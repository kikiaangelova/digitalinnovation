import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLang } from '@/context/LangContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { generateDefaultExhibitContent } from '@/data/case-defaults';
import {
  Save, Plus, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle,
  BookOpen, Building2, TrendingUp, BarChart3, Brain, PenTool, Rocket, Award,
  FileText, Trash2,
} from 'lucide-react';

const STEP_LABELS = [
  'Research & Reading', 'Industry Context', 'Digital Disruption & Data',
  'Strategic Problem & Exhibits', 'Strategic Question',
  'Student Analysis', 'Innovation Proposal', 'Final Recommendation',
];

interface StepData {
  id?: string;
  step_order: number;
  title: string;
  title_bg: string;
  narrative: string;
  narrative_bg: string;
  exhibit_text: string;
  exhibit_text_bg: string;
}

interface CaseStepEditorProps {
  caseId: string;
  caseTopic: string | null;
}

export default function CaseStepEditor({ caseId, caseTopic }: CaseStepEditorProps) {
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [steps, setSteps] = useState<StepData[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('case_steps')
      .select('id, step_order, title, title_bg, narrative, narrative_bg, exhibit_text, exhibit_text_bg')
      .eq('case_study_id', caseId)
      .order('step_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSteps(data.map(s => ({
            id: s.id,
            step_order: s.step_order,
            title: s.title || '',
            title_bg: s.title_bg || '',
            narrative: s.narrative || '',
            narrative_bg: s.narrative_bg || '',
            exhibit_text: s.exhibit_text || '',
            exhibit_text_bg: s.exhibit_text_bg || '',
          })));
        } else {
          // Create 8 default steps
          setSteps(STEP_LABELS.map((label, i) => ({
            step_order: i,
            title: label,
            title_bg: '',
            narrative: '',
            narrative_bg: '',
            exhibit_text: '',
            exhibit_text_bg: '',
          })));
        }
        setLoading(false);
      });
  }, [caseId]);

  const updateStep = (idx: number, field: keyof StepData, value: string) => {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const fillDefaultExhibit = (idx: number) => {
    const enContent = generateDefaultExhibitContent(caseTopic, idx, 'en');
    const bgContent = generateDefaultExhibitContent(caseTopic, idx, 'bg');
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, exhibit_text: enContent, exhibit_text_bg: bgContent } : s));
    toast.success(t('Default exhibit template inserted', 'Шаблон за приложение е вмъкнат'));
  };

  const saveAllSteps = async () => {
    setSaving(true);
    for (const step of steps) {
      const payload = {
        case_study_id: caseId,
        step_order: step.step_order,
        title: step.title || STEP_LABELS[step.step_order] || `Step ${step.step_order + 1}`,
        title_bg: step.title_bg || null,
        narrative: step.narrative || null,
        narrative_bg: step.narrative_bg || null,
        exhibit_text: step.exhibit_text || null,
        exhibit_text_bg: step.exhibit_text_bg || null,
      };

      if (step.id) {
        await supabase.from('case_steps').update(payload).eq('id', step.id);
      } else {
        const { data } = await supabase.from('case_steps').insert(payload).select('id').single();
        if (data) step.id = data.id;
      }
    }
    setSaving(false);
    toast.success(t('All steps saved', 'Всички стъпки са запазени'));
  };

  // Quality checklist
  const qualityChecks = steps.map((s, i) => {
    const issues: string[] = [];
    if (!s.title && !s.title_bg) issues.push(t('Missing title', 'Липсва заглавие'));
    if (!s.narrative && !s.narrative_bg) issues.push(t('Missing narrative', 'Липсва наратив'));
    if (i >= 1 && i <= 3 && !s.exhibit_text && !s.exhibit_text_bg) issues.push(t('Missing exhibits', 'Липсват приложения'));
    return { step: i, label: STEP_LABELS[i] || `Step ${i + 1}`, issues, ok: issues.length === 0 };
  });

  const totalIssues = qualityChecks.reduce((sum, c) => sum + c.issues.length, 0);

  if (loading) return <p className="text-sm text-muted-foreground py-4">{t('Loading steps...', 'Зареждане...')}</p>;

  return (
    <div className="space-y-4">
      {/* Quality Checklist */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          {totalIssues === 0 ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          )}
          {t('Quality Checklist', 'Списък за качество')}
          {totalIssues > 0 && (
            <Badge variant="destructive" className="text-[10px]">{totalIssues} {t('issues', 'проблема')}</Badge>
          )}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {qualityChecks.map(c => (
            <div
              key={c.step}
              className={`rounded-lg p-2 text-center text-xs ${c.ok ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}
            >
              <p className="font-medium truncate">{c.label}</p>
              {c.ok ? (
                <CheckCircle2 className="h-3 w-3 mx-auto mt-1" />
              ) : (
                <p className="mt-1">{c.issues.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step editors */}
      {steps.map((step, idx) => {
        const isExpanded = expandedStep === idx;
        const hasNarrative = !!step.narrative || !!step.narrative_bg;
        const hasExhibit = !!step.exhibit_text || !!step.exhibit_text_bg;
        return (
          <div key={idx} className="rounded-xl border border-border bg-card">
            <button
              onClick={() => setExpandedStep(isExpanded ? null : idx)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-muted-foreground">{idx + 1}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{step.title || STEP_LABELS[idx]}</p>
                  <div className="flex gap-1 mt-0.5">
                    {hasNarrative && <Badge variant="outline" className="text-[10px] text-primary">✓ {t('Narrative', 'Наратив')}</Badge>}
                    {hasExhibit && <Badge variant="outline" className="text-[10px] text-primary">✓ {t('Exhibits', 'Приложения')}</Badge>}
                    {!hasNarrative && <Badge variant="outline" className="text-[10px] text-muted-foreground">— {t('Narrative', 'Наратив')}</Badge>}
                    {idx >= 1 && idx <= 3 && !hasExhibit && <Badge variant="outline" className="text-[10px] text-destructive">⚠ {t('Exhibits', 'Приложения')}</Badge>}
                  </div>
                </div>
              </div>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {isExpanded && (
              <div className="border-t border-border p-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs">{t('Title (EN)', 'Заглавие (EN)')}</Label>
                    <Input value={step.title} onChange={e => updateStep(idx, 'title', e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs">{t('Title (BG)', 'Заглавие (BG)')}</Label>
                    <Input value={step.title_bg} onChange={e => updateStep(idx, 'title_bg', e.target.value)} />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">{t('Narrative / Context (EN)', 'Наратив / Контекст (EN)')}</Label>
                  <Textarea
                    value={step.narrative}
                    onChange={e => updateStep(idx, 'narrative', e.target.value)}
                    placeholder={t('Write the narrative context for this section...', 'Напишете наративния контекст...')}
                    className="min-h-[120px]"
                  />
                </div>
                <div>
                  <Label className="text-xs">{t('Narrative / Context (BG)', 'Наратив / Контекст (BG)')}</Label>
                  <Textarea
                    value={step.narrative_bg}
                    onChange={e => updateStep(idx, 'narrative_bg', e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs">{t('Exhibits / Data (EN)', 'Приложения / Данни (EN)')}</Label>
                    {idx >= 1 && idx <= 3 && !step.exhibit_text && (
                      <Button variant="outline" size="sm" onClick={() => fillDefaultExhibit(idx)} className="text-xs h-7">
                        <Plus className="h-3 w-3 mr-1" /> {t('Insert Template', 'Вмъкни шаблон')}
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={step.exhibit_text}
                    onChange={e => updateStep(idx, 'exhibit_text', e.target.value)}
                    placeholder={t('Tables, charts, data exhibits...', 'Таблици, графики, данни...')}
                    className="min-h-[120px] font-mono text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">{t('Exhibits / Data (BG)', 'Приложения / Данни (BG)')}</Label>
                  <Textarea
                    value={step.exhibit_text_bg}
                    onChange={e => updateStep(idx, 'exhibit_text_bg', e.target.value)}
                    className="min-h-[120px] font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-end">
        <Button onClick={saveAllSteps} disabled={saving}>
          <Save className="h-4 w-4 mr-1" />
          {saving ? t('Saving...', 'Запазване...') : t('Save All Steps', 'Запази всички стъпки')}
        </Button>
      </div>
    </div>
  );
}
