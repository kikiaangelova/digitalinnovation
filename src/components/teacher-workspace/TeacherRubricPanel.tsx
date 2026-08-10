/**
 * TeacherRubricPanel — teacher-only judgement aid.
 *
 * Rendered only inside the Teacher Workspace evidence detail. Nothing
 * here is persisted: there are no rubric score fields, no schema change
 * and no writes. The only write in the evidence detail remains the
 * existing `teacher_feedback` comment.
 *
 * This component must never be imported by a student-facing route.
 */

import { Badge } from '@/components/ui/badge';
import { useLang } from '@/context/LangContext';
import type { TeacherPack } from '@/data/module-pilot-types';

export default function TeacherRubricPanel({ pack }: { pack: TeacherPack }) {
  const { lang } = useLang();
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);
  const bi = (v: { en: string; bg: string }) => (lang === 'bg' ? v.bg : v.en);

  return (
    <aside
      data-testid="teacher-rubric-panel"
      aria-label={t('Teacher-only guidance', 'Насоки само за учителя')}
      className="rounded-md border border-primary/30 bg-primary/5 p-3 space-y-4 text-sm"
    >
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-[10px]">
          {t('Teacher only', 'Само за учителя')}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {t('Not visible to students. Nothing here is stored.', 'Не се вижда от учениците. Нищо тук не се съхранява.')}
        </span>
      </div>

      <div className="space-y-2">
        <p className="font-medium">{t('Rubric 0–4', 'Рубрика 0–4')}</p>
        <div className="flex flex-wrap gap-1.5">
          {pack.rubric_dimensions.map((d) => (
            <Badge key={d.id} variant="secondary" className="text-[10px]">
              {lang === 'bg' ? d.label_bg : d.label_en}
            </Badge>
          ))}
        </div>
        <ul className="space-y-1">
          {pack.rubric_anchors.map((a) => (
            <li key={a.score} className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{a.score}</span> — {lang === 'bg' ? a.bg : a.en}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-1">
        <p className="font-medium">{t('Evidence checklist', 'Списък за доказателства')}</p>
        <ul className="space-y-1">
          {pack.evidence_checklist.map((c, i) => (
            <li key={i} className="text-xs text-muted-foreground">□ {bi(c)}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-1">
        <p className="font-medium">{t('Decision key / model answer', 'Ключ за решение / примерен отговор')}</p>
        <p className="text-xs text-muted-foreground">
          {lang === 'bg' ? pack.model_answer_bg : pack.model_answer_en}
        </p>
      </div>

      <div className="space-y-1">
        <p className="font-medium">{t('Common errors', 'Често срещани грешки')}</p>
        <ul className="space-y-1">
          {pack.common_errors.map((c, i) => (
            <li key={i} className="text-xs text-muted-foreground">• {bi(c)}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-1">
        <p className="font-medium">{t('Feedback prompts', 'Насочващи въпроси за обратна връзка')}</p>
        <ul className="space-y-1">
          {pack.feedback_prompts.map((c, i) => (
            <li key={i} className="text-xs text-muted-foreground">— {bi(c)}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
