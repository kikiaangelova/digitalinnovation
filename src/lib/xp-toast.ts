import { toast } from 'sonner';

type Lang = 'en' | 'bg';

const ACTION_LABELS: Record<string, { en: string; bg: string }> = {
  case_open: { en: 'Case opened', bg: 'Казусът е отворен' },
  case_question_answer: { en: 'Question answered', bg: 'Отговор на въпрос' },
  case_complete: { en: 'Case completed!', bg: 'Казусът е завършен!' },
  case_high_quality: { en: 'High-quality analysis', bg: 'Качествен анализ' },
  startup_problem: { en: 'Problem defined', bg: 'Проблемът е дефиниран' },
  startup_customer: { en: 'Customer identified', bg: 'Клиентът е идентифициран' },
  startup_value_proposition: { en: 'Value proposition set', bg: 'Стойностно предложение' },
  startup_digital_product: { en: 'Product designed', bg: 'Продуктът е проектиран' },
  startup_business_model: { en: 'Business model ready', bg: 'Бизнес модел готов' },
  startup_growth_strategy: { en: 'Growth strategy set', bg: 'Стратегия за растеж' },
  startup_final_pitch: { en: 'Final pitch submitted!', bg: 'Финалното представяне е подадено!' },
  sim_scenario_complete: { en: 'Scenario completed', bg: 'Сценарият е завършен' },
  sim_high_performance: { en: 'High performance bonus', bg: 'Бонус за високо представяне' },
  dict_view_term: { en: 'New term learned', bg: 'Нов термин научен' },
  dict_quiz_correct: { en: 'Quiz correct!', bg: 'Верен отговор!' },
  dict_weekly_challenge: { en: 'Weekly challenge done', bg: 'Седмично предизвикателство' },
  case_startup_notes: { en: 'Startup notes saved', bg: 'Бележки запазени' },
  theory_complete: { en: 'Theory completed', bg: 'Теорията е завършена' },
  theory_quiz_pass: { en: 'Quiz passed!', bg: 'Тестът е преминат!' },
};

export function showXpToast(action: string, xpAwarded: number, lang: Lang) {
  if (xpAwarded <= 0) return;

  const label = ACTION_LABELS[action]?.[lang] || (lang === 'bg' ? 'XP спечелени' : 'XP earned');

  toast(`⚡ +${xpAwarded} XP — ${label}`, {
    duration: 3000,
    position: 'top-right',
    className: 'xp-toast',
  });
}
