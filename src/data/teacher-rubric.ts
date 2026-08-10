/**
 * Shared 0–4 teacher rubric for practice-first evidence.
 *
 * Teacher-only. This is a judgement aid, not a stored score: nothing here
 * is persisted, and it must never be shown to students or mixed with XP.
 */

import type { RubricAnchor, RubricDimension } from './module-pilot-types';

export const SHARED_RUBRIC_DIMENSIONS: RubricDimension[] = [
  { id: 'clarity', label_en: 'Clarity', label_bg: 'Яснота' },
  { id: 'evidence_use', label_en: 'Evidence use', label_bg: 'Работа с доказателства' },
  { id: 'tradeoffs', label_en: 'Trade-offs', label_bg: 'Компромиси' },
  { id: 'realism', label_en: 'Realism', label_bg: 'Реалистичност' },
  { id: 'risk_ethics', label_en: 'Risk and ethics', label_bg: 'Риск и етика' },
];

export const SHARED_RUBRIC_ANCHORS: RubricAnchor[] = [
  {
    score: 4,
    en: 'Precise, source-linked, alternatives weighed, feasible and reversible, risks and affected groups explicitly addressed.',
    bg: 'Точно, обвързано с източници, претеглени алтернативи, изпълнимо и обратимо, рисковете и засегнатите групи са адресирани изрично.',
  },
  {
    score: 3,
    en: 'Clear and mostly supported, meaningful trade-offs, feasible plan, material risks addressed.',
    bg: 'Ясно и в голяма степен подкрепено, смислени компромиси, изпълним план, съществените рискове са адресирани.',
  },
  {
    score: 2,
    en: 'Partly clear, limited evidence, alternatives mentioned but weakly weighed, gaps in feasibility or risk.',
    bg: 'Частично ясно, ограничени доказателства, алтернативите са споменати, но слабо претеглени, пропуски в изпълнимостта или риска.',
  },
  {
    score: 1,
    en: 'Assertion-led, little evidence, one-sided, vague or unrealistic, risks mostly ignored.',
    bg: 'Водено от твърдения, малко доказателства, едностранчиво, неясно или нереалистично, рисковете са почти игнорирани.',
  },
  {
    score: 0,
    en: 'Missing, off-task, or evidence that is fabricated.',
    bg: 'Липсващо, не по задачата или измислени доказателства.',
  },
];