/**
 * Optional, additive content model for pilot-quality learning modules.
 *
 * Every type here is used through OPTIONAL fields on `LearningModule` and
 * `EmbeddedCaseStudy`, so existing modules keep rendering unchanged.
 *
 * Teacher-only material lives in `TeacherPack` and must never be rendered
 * in the student module player.
 */

export type ContentQualityStatus =
  | 'draft'
  | 'needs_review'
  | 'educator_reviewed'
  | 'pilot_ready'
  | 'published';

/** Bilingual string pair. BG and EN must be equivalent in meaning and depth. */
export interface Bilingual {
  en: string;
  bg: string;
}

export type BloomLevel =
  | 'Remember'
  | 'Understand'
  | 'Apply'
  | 'Analyze'
  | 'Evaluate'
  | 'Create';

export interface LearningOutcome {
  id: string;
  bloom: BloomLevel;
  en: string;
  bg: string;
}

/** A verifiable source the student can open. */
export interface SourceRef {
  id: string;
  title: string;
  publisher: string;
  /** Year or precise date of the referenced material. */
  date: string;
  url: string;
  use_note_en: string;
  use_note_bg: string;
}

/** A common wrong idea paired with the accurate version. */
export interface Misconception {
  id: string;
  wrong_en: string;
  wrong_bg: string;
  correct_en: string;
  correct_bg: string;
}

export interface EntryTaskScenario {
  id: string;
  en: string;
  bg: string;
}

export interface EntryTask {
  prompt_en: string;
  prompt_bg: string;
  /** Labels the learner chooses between, e.g. scale / direct / cross-side. */
  categories: Bilingual[];
  scenarios: EntryTaskScenario[];
  followup_en: string;
  followup_bg: string;
}

/** The evidence a learner must submit — the graded deliverable. */
export interface EvidenceTask {
  title_en: string;
  title_bg: string;
  brief_en: string;
  brief_bg: string;
  requirements: Bilingual[];
  min_words: number;
  max_words: number;
}

export type ExhibitKind = 'facts' | 'mechanisms' | 'comparison' | 'matrix';

export interface ExhibitRow {
  label_en: string;
  label_bg: string;
  cells_en: string[];
  cells_bg: string[];
}

export interface Exhibit {
  id: string;
  kind: ExhibitKind;
  title_en: string;
  title_bg: string;
  /** Plain bullet lines, used by `facts` and `mechanisms` exhibits. */
  lines?: Bilingual[];
  /** Column headers for table-shaped exhibits. */
  columns_en?: string[];
  columns_bg?: string[];
  rows?: ExhibitRow[];
  /** Honest caveat, e.g. "these ratings are case assumptions". */
  caveat_en?: string;
  caveat_bg?: string;
  /** Source ids backing this exhibit. */
  source_ids?: string[];
}

export interface DecisionOption {
  id: string;
  label_en: string;
  label_bg: string;
  description_en: string;
  description_bg: string;
  tradeoffs: Bilingual[];
}

export interface RubricAnchor {
  score: 0 | 1 | 2 | 3 | 4;
  en: string;
  bg: string;
}

export interface RubricDimension {
  id: string;
  label_en: string;
  label_bg: string;
}

/** Teacher-only material. Never rendered in the student player. */
export interface TeacherPack {
  rubric_dimensions: RubricDimension[];
  rubric_anchors: RubricAnchor[];
  evidence_checklist: Bilingual[];
  /** Strong sample recommendation / decision key. */
  model_answer_en: string;
  model_answer_bg: string;
  common_errors: Bilingual[];
  feedback_prompts: Bilingual[];
}

/** Case-pack extension used by `EmbeddedCaseStudy` for pilot cases. */
export interface CasePack {
  verified_facts: Bilingual[];
  interpretations: Bilingual[];
  case_assumptions: Bilingual[];
  stakeholders: Bilingual[];
  dilemma_en: string;
  dilemma_bg: string;
  decision_options: DecisionOption[];
  exhibits: Exhibit[];
  deliverable: EvidenceTask;
  reflection_en: string;
  reflection_bg: string;
  source_ids: string[];
}