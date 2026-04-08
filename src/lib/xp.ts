import { supabase } from '@/integrations/supabase/client';
import { showXpToast, checkLevelUp } from '@/lib/xp-toast';
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
  | 'dict_quiz_complete'
  | 'dict_quiz_bonus'
  | 'dict_weekly_challenge'
  | 'case_startup_notes'
  | 'theory_complete'
  | 'theory_quiz_pass'
  | 'onboarding_profile'
  | 'onboarding_journey'
  | 'startup_all_sections'
  | 'hypothesis_saved';

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
  dict_quiz_complete: 10,
  dict_quiz_bonus: 10,
  dict_weekly_challenge: 15,
  case_startup_notes: 50,
  theory_complete: 10,
  theory_quiz_pass: 15,
  onboarding_profile: 5,
  onboarding_journey: 10,
  startup_all_sections: 50,
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

    const result = data as AwardXpResult;

    // Auto-show celebration toast + level-up check
    if (result.xp_awarded > 0) {
      const lang = (localStorage.getItem('digiinnov-lang') || 'en') as 'en' | 'bg';
      showXpToast(action, result.xp_awarded, lang);

      // Check for level-up by reading current profile XP
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('total_xp')
            .eq('user_id', user.id)
            .maybeSingle();
          if (profile) {
            checkLevelUp(profile.total_xp - result.xp_awarded, profile.total_xp, lang);
          }
        }
      } catch (_) { /* level-up check is best-effort */ }
    }

    return result;
  } catch (err) {
    console.error('award-xp call failed:', err);
    return { xp_awarded: 0 };
  }
}
