import { supabase } from '@/integrations/supabase/client';

export type XpAction =
  | 'case_open'
  | 'case_question_answer'
  | 'case_complete'
  | 'case_high_quality'
  | 'startup_problem'
  | 'startup_customer'
  | 'startup_value_proposition'
  | 'startup_digital_product'
  | 'startup_business_model'
  | 'startup_growth_strategy'
  | 'startup_final_pitch'
  | 'sim_scenario_complete'
  | 'sim_high_performance'
  | 'dict_view_term'
  | 'dict_quiz_correct'
  | 'dict_weekly_challenge'
  | 'case_startup_notes';

export const XP_VALUES: Record<XpAction, number> = {
  case_open: 5,
  case_question_answer: 10,
  case_complete: 100,
  case_high_quality: 30,
  startup_problem: 40,
  startup_customer: 40,
  startup_value_proposition: 40,
  startup_digital_product: 50,
  startup_business_model: 50,
  startup_growth_strategy: 50,
  startup_final_pitch: 120,
  sim_scenario_complete: 50,
  sim_high_performance: 50,
  dict_view_term: 2,
  dict_quiz_correct: 10,
  dict_weekly_challenge: 15,
  case_startup_notes: 50,
};

interface AwardXpResult {
  xp_awarded: number;
  duplicate?: boolean;
  capped?: boolean;
  message?: string;
}

export async function awardXp(
  action: XpAction,
  contextId?: string,
  metadata?: Record<string, unknown>
): Promise<AwardXpResult> {
  try {
    const { data, error } = await supabase.functions.invoke('award-xp', {
      body: { action, context_id: contextId, metadata },
    });

    if (error) {
      console.error('award-xp error:', error);
      return { xp_awarded: 0 };
    }

    return data as AwardXpResult;
  } catch (err) {
    console.error('award-xp call failed:', err);
    return { xp_awarded: 0 };
  }
}
