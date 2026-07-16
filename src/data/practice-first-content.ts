/**
 * Practice-first content seed V1 — draft learning modules for the 5
 * approved themes in `content-structure.ts`. All modules are
 * `needs_review`. Nothing here is educator_approved.
 */
import { PRACTICE_THEORY_RATIO, type ThemeId } from './content-structure';

export type ModuleReviewStatus =
  | 'needs_review'
  | 'needs_content_review'
  | 'ready_for_educator_review'
  | 'educator_approved';

export interface PracticeTask {
  id: string;
  title_en: string;
  title_bg: string;
  kind:
    | 'observation'
    | 'information_search'
    | 'fact_vs_assumption'
    | 'analysis'
    | 'comparison'
    | 'mvp_definition'
    | 'experiment_design'
    | 'case_evaluation'
    | 'decision'
    | 'reflection'
    | 'iteration';
  brief_en: string;
  brief_bg: string;
}

export interface CaseConnection {
  caseId: string;
  reviewStatus: 'needs_content_review';
  note_en?: string;
  note_bg?: string;
}

export interface PracticeFirstModule {
  id: string;
  themeId: ThemeId;
  title_en: string;
  title_bg: string;
  status: ModuleReviewStatus;
  theoryBlock_en: string;
  theoryBlock_bg: string;
  practiceRatio: typeof PRACTICE_THEORY_RATIO;
  keyConcepts: string[];
  dictionaryConcepts: string[];
  practiceTasks: PracticeTask[];
  informationSearchTask?: { prompt_en: string; prompt_bg: string };
  caseConnection?: CaseConnection;
  kikiQuestions: { en: string; bg: string }[];
  evidenceOfSkill: string[];
  reflectionPrompt: { en: string; bg: string };
  improvementPrompt: { en: string; bg: string };
}

const R = PRACTICE_THEORY_RATIO;

