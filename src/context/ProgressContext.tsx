import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { deriveJourneyStatuses, type StepStatus } from '@/lib/journey';
import { calcOutcomeScores } from '@/components/dashboard/LearningOutcomes';
import { LEARNING_MODULES } from '@/data/learning-modules';

/* ── Unified progress model ── */
export interface UnifiedProgress {
  // Raw data
  xp: number;
  casesCompleted: number;
  casesTotal: number;
  completedCaseIds: Set<string>;

  // Journey stages (6)
  stagesCompleted: number;
  stageStatuses: StepStatus[];
  journeyPct: number;

  // Learning modules
  modulesCompleted: number;
  modulesTotal: number;
  completedModuleSlugs: Set<string>;
  modulesPct: number;

  // Startup project
  startupSectionMap: Record<string, boolean>;
  startupSubmitted: boolean;
  startupProgressPct: number;
  bmcSectionsCompleted: number;
  finalPitchSubmitted: boolean;

  // Simulator
  simWeek: number;
  simComplete: boolean;

  // Stage learn completion (which stages had their Learn section marked complete)
  stageLearnCompleted: Set<number>;

  // Computed scores
  outcomeScores: Record<string, number>;

  // Meta
  loading: boolean;
  refresh: () => void;
}

const defaultProgress: UnifiedProgress = {
  xp: 0,
  casesCompleted: 0,
  casesTotal: 0,
  completedCaseIds: new Set(),
  stagesCompleted: 0,
  stageStatuses: ['not_started', 'not_started', 'not_started', 'not_started', 'not_started', 'not_started'],
  journeyPct: 0,
  modulesCompleted: 0,
  modulesTotal: 0,
  completedModuleSlugs: new Set(),
  modulesPct: 0,
  startupSectionMap: {},
  startupSubmitted: false,
  startupProgressPct: 0,
  bmcSectionsCompleted: 0,
  finalPitchSubmitted: false,
  simWeek: 1,
  simComplete: false,
  outcomeScores: {},
  loading: true,
  refresh: () => {},
};

const ProgressContext = createContext<UnifiedProgress>(defaultProgress);

export function useProgress() {
  return useContext(ProgressContext);
}

const STARTUP_SECTIONS = ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model', 'growth_strategy', 'final_pitch'];
const BMC_FIELDS = ['bmc_customer_segments', 'bmc_value_proposition', 'bmc_channels', 'bmc_customer_relationships', 'bmc_revenue_streams', 'bmc_key_resources', 'bmc_key_activities', 'bmc_key_partners', 'bmc_cost_structure'];

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UnifiedProgress>(defaultProgress);
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion(v => v + 1), []);

  useEffect(() => {
    if (!user) {
      setProgress({ ...defaultProgress, loading: false, refresh });
      return;
    }

    let cancelled = false;

    const fetchAll = async () => {
      try {
        const [
          casesRes,
          subsRes,
          projRes,
          simRes,
          profileRes,
          moduleResponsesRes,
          allModsRes,
        ] = await Promise.all([
          supabase.from('case_studies').select('id').eq('published', true),
          supabase.from('submissions').select('case_study_id, is_draft').eq('user_id', user.id).eq('is_draft', false),
          supabase.from('startup_projects').select(
            'problem, customer, value_proposition, digital_product, business_model, growth_strategy, final_pitch, is_submitted, ' +
            'bmc_customer_segments, bmc_value_proposition, bmc_channels, bmc_customer_relationships, bmc_revenue_streams, bmc_key_resources, bmc_key_activities, bmc_key_partners, bmc_cost_structure'
          ).eq('user_id', user.id).maybeSingle(),
          supabase.from('simulator_progress').select('current_week, is_complete').eq('user_id', user.id).maybeSingle(),
          supabase.from('profiles').select('total_xp').eq('user_id', user.id).maybeSingle(),
          supabase.from('learning_module_responses').select('module_id, completed_at').eq('user_id', user.id).not('completed_at', 'is', null),
          supabase.from('learning_modules').select('id, slug'),
        ]);

        if (cancelled) return;

        // Cases
        const casesTotal = (casesRes.data || []).length;
        const completedSubs = subsRes.data || [];
        const casesCompleted = completedSubs.length;
        const completedCaseIds = new Set(completedSubs.map(s => s.case_study_id));

        // XP
        const xp = (profileRes.data as any)?.total_xp || 0;

        // Startup
        const proj = projRes.data as any;
        const startupSectionMap: Record<string, boolean> = {};
        STARTUP_SECTIONS.forEach(s => {
          startupSectionMap[s] = proj ? ((proj[s] || '').trim().length > 20) : false;
        });
        const startupSubmitted = proj?.is_submitted || false;
        const filledSections = Object.values(startupSectionMap).filter(Boolean).length;
        const startupProgressPct = Math.round((filledSections / STARTUP_SECTIONS.length) * 100);
        const bmcSectionsCompleted = proj ? BMC_FIELDS.filter(f => ((proj[f] || '').trim().length > 10)).length : 0;
        const finalPitchSubmitted = proj ? ((proj.final_pitch || '').trim().length > 20) : false;

        // Simulator
        const simWeek = (simRes.data as any)?.current_week || 1;
        const simComplete = (simRes.data as any)?.is_complete || false;

        // Journey stages
        const stageStatuses = deriveJourneyStatuses({
          casesCompleted,
          startupSections: startupSectionMap,
          startupSubmitted,
          simWeek,
          simComplete,
        });
        const stagesCompleted = stageStatuses.filter(s => s === 'completed').length;
        const journeyPct = Math.round((stagesCompleted / 6) * 100);

        // Learning modules — use DB modules if available, fall back to static count
        const allMods = allModsRes.data || [];
        const completedModuleIds = new Set((moduleResponsesRes.data || []).map((r: any) => r.module_id));
        const completedModuleSlugs = new Set(
          allMods.filter((m: any) => completedModuleIds.has(m.id)).map((m: any) => m.slug)
        );
        const modulesCompleted = completedModuleSlugs.size;
        // If DB has modules use that count, otherwise fall back to static data length
        const modulesTotal = allMods.length > 0 ? allMods.length : LEARNING_MODULES.length;
        const modulesPct = modulesTotal > 0 ? Math.round((modulesCompleted / modulesTotal) * 100) : 0;

        // Outcome scores
        const outcomeScores = calcOutcomeScores({
          casesCompleted,
          casesTotal,
          startupSections: startupSectionMap,
          simWeek,
          simComplete,
        });

        setProgress({
          xp,
          casesCompleted,
          casesTotal,
          completedCaseIds,
          stagesCompleted,
          stageStatuses,
          journeyPct,
          modulesCompleted,
          modulesTotal,
          completedModuleSlugs,
          modulesPct,
          startupSectionMap,
          startupSubmitted,
          startupProgressPct,
          bmcSectionsCompleted,
          finalPitchSubmitted,
          simWeek,
          simComplete,
          outcomeScores,
          loading: false,
          refresh,
        });
      } catch (err) {
        console.error('ProgressContext fetch error:', err);
        if (!cancelled) setProgress(prev => ({ ...prev, loading: false, refresh }));
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [user, version, refresh]);

  return (
    <ProgressContext.Provider value={progress}>
      {children}
    </ProgressContext.Provider>
  );
}
