import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * Lightweight hook that computes the 6-stage journey completion percentage.
 * Mirrors the logic in JourneyProgress.tsx but returns only the percentage.
 */
export function useJourneyProgress() {
  const { user } = useAuth();
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!user) { setPercentage(0); return; }

    const fetch = async () => {
      const [subsRes, projRes, simRes] = await Promise.all([
        supabase.from('submissions').select('case_study_id, is_draft').eq('user_id', user.id).eq('is_draft', false),
        supabase.from('startup_projects').select('problem, customer, value_proposition, digital_product, business_model, growth_strategy, final_pitch, is_submitted').eq('user_id', user.id).maybeSingle(),
        supabase.from('simulator_progress').select('current_week, is_complete').eq('user_id', user.id).maybeSingle(),
      ]);

      const casesCompleted = (subsRes.data || []).length;
      const proj = projRes.data as any;
      const sim = simRes.data as any;
      const s = (key: string) => proj ? ((proj[key] || '').trim().length > 20) : false;
      const simWeek = sim?.current_week || 1;
      const simComplete = sim?.is_complete || false;
      const startupSubmitted = proj?.is_submitted || false;

      const statuses = [
        casesCompleted >= 1 ? 'completed' : 'not_started',
        casesCompleted >= 2 ? 'completed' : casesCompleted >= 1 ? 'in_progress' : 'not_started',
        s('problem') && s('value_proposition') ? 'completed' : (s('problem') || s('customer') || s('value_proposition')) ? 'in_progress' : 'not_started',
        s('digital_product') && s('business_model') && s('growth_strategy') ? 'completed' : (s('digital_product') || s('business_model') || s('growth_strategy')) ? 'in_progress' : 'not_started',
        simComplete ? 'completed' : simWeek > 1 ? 'in_progress' : 'not_started',
        startupSubmitted ? 'completed' : s('final_pitch') ? 'in_progress' : 'not_started',
      ];

      const completed = statuses.filter(st => st === 'completed').length;
      setPercentage(Math.round((completed / 6) * 100));
    };

    fetch();
  }, [user]);

  return percentage;
}
