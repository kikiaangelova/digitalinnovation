/**
 * DigiInnov Content Structure V1 — 5 approved learning themes.
 *
 * Single source of truth for the platform's educator-approved thematic
 * structure. Does NOT redefine the taxonomy in `learning-areas.ts`
 * (which powers /learn grouping); instead, declares how the 5 main
 * themes connect to dictionary concepts, cases, practice types and
 * Kiki AI modes.
 *
 * Rules:
 *  - Skills are NOT a theme. They are outcomes, evidenced across every
 *    theme through tasks, cases, decisions, projects and reflection.
 *  - Nothing here is "final content". Theory, dictionary definitions and
 *    case bodies are authored separately and must be marked `needs_review`
 *    until an educator signs off.
 *  - Themes share the same process spine: observe -> identify problems ->
 *    search info -> distinguish fact/opinion/assumption -> find
 *    opportunities -> create/improve value -> business model -> manage
 *    process -> test via MVP/experiments -> market/sell -> feedback ->
 *    improve.
 */

import type { LearningAreaId } from './learning-areas';

export type ThemeId =
  | 'entrepreneurship'
  | 'innovation'
  | 'marketing'
  | 'management'
  | 'ai';

export type ThemeDifficulty = 'foundation' | 'applied' | 'advanced';

export type PracticeType =
  | 'case_study'
  | 'decision_task'
  | 'information_search'
  | 'experiment'
  | 'mvp_build'
  | 'reflection'
  | 'peer_review'
  | 'project';

export type KikiMode =
  | 'explain'
  | 'challenge'
  | 'reflect'
  | 'critique'
  | 'ask_better_questions';

export interface LearningTheme {
  id: ThemeId;
  learningAreaId: LearningAreaId;
  title_en: string;
  title_bg: string;
  short_en: string;
  short_bg: string;
  difficulty: ThemeDifficulty;
  topics: { en: string; bg: string }[];
  practiceTypes: PracticeType[];
  relatedDictionaryConcepts: string[];
  relatedCaseTags: string[];
  relatedKikiModes: KikiMode[];
}

/** Practice-first rule: 10-15% theory, 85-90% practice. */
export const PRACTICE_THEORY_RATIO = {
  theoryMinPct: 10,
  theoryMaxPct: 15,
  practiceMinPct: 85,
  practiceMaxPct: 90,
} as const;

export const LEARNING_THEMES: LearningTheme[] = [
  {
    id: 'entrepreneurship',
    learningAreaId: 'entrepreneurship',
    title_en: 'Entrepreneurship & Entrepreneurial Thinking',
    title_bg: 'Предприемачество и предприемаческо мислене',
    short_en:
      'Entrepreneurship as a way of thinking and acting: observing environments, identifying real problems, distinguishing facts from assumptions, recognizing opportunities, building business models and testing them through MVPs and experiments.',
    short_bg:
      'Предприемачеството като начин на мислене и действие: наблюдение на средата, идентифициране на реални проблеми, разграничаване на факти от допускания, разпознаване на възможности, изграждане на бизнес модели и проверката им през MVP и експерименти.',
    difficulty: 'foundation',
    topics: [
      { en: 'Entrepreneurial thinking and action', bg: 'Предприемаческо мислене и действие' },
      { en: 'Curiosity and observation', bg: 'Любопитство и наблюдение' },
      { en: 'Identifying problems', bg: 'Идентифициране на проблеми' },
      { en: 'Fact vs opinion vs assumption', bg: 'Факт срещу мнение срещу допускане' },
      { en: 'Information search', bg: 'Търсене на информация' },
      { en: 'Opportunity recognition', bg: 'Разпознаване на възможност' },
      { en: 'Value creation', bg: 'Създаване на стойност' },
      { en: 'Business model', bg: 'Бизнес модел' },
      { en: 'MVP', bg: 'MVP' },
      { en: 'Experiments', bg: 'Експерименти' },
      { en: 'Argued decisions', bg: 'Аргументирани решения' },
    ],
    practiceTypes: ['case_study', 'decision_task', 'information_search', 'experiment', 'mvp_build', 'reflection'],
    relatedDictionaryConcepts: [
      'Entrepreneurship', 'Entrepreneurial mindset', 'Problem discovery', 'Opportunity recognition',
      'Business model', 'Value proposition', 'Assumptions', 'MVP (Minimum Viable Product)',
      'Experiment', 'Lean Startup', 'Pivot', 'Go-to-market',
    ],
    relatedCaseTags: ['startup', 'small-business', 'youth-environment', 'fashion-business', 'food-waste'],
    relatedKikiModes: ['challenge', 'ask_better_questions', 'critique', 'reflect'],
  },
  {
    id: 'innovation',
    learningAreaId: 'innovation',
    title_en: 'Innovation & Digital Innovation',
    title_bg: 'Иновации и дигитални иновации',
    short_en:
      'Innovation as a managed process — not random creativity. Improving products, services, processes and business models; digital innovation, platforms, ecosystems and network effects; applied areas including sports innovation.',
    short_bg:
      'Иновацията като управляван процес — не случайна креативност. Подобряване на продукти, услуги, процеси и бизнес модели; дигитални иновации, платформи, екосистеми и мрежови ефекти; приложни области, включително спортни иновации.',
    difficulty: 'applied',
    topics: [
      { en: 'Idea vs invention vs innovation', bg: 'Идея срещу изобретение срещу иновация' },
      { en: 'Improving products, services, processes, business models', bg: 'Подобряване на продукти, услуги, процеси и бизнес модели' },
      { en: 'Product innovation', bg: 'Продуктова иновация' },
      { en: 'Process innovation', bg: 'Процесна иновация' },
      { en: 'Service innovation', bg: 'Услугова иновация' },
      { en: 'Business model innovation', bg: 'Бизнес модел иновация' },
      { en: 'Digital innovation', bg: 'Дигитална иновация' },
      { en: 'Platforms', bg: 'Платформи' },
      { en: 'Ecosystems', bg: 'Екосистеми' },
      { en: 'Network effects', bg: 'Мрежови ефекти' },
      { en: 'Sports innovation (applied)', bg: 'Спортни иновации (приложна област)' },
      { en: 'Innovation as a managed process', bg: 'Иновацията като управляван процес' },
    ],
    practiceTypes: ['case_study', 'decision_task', 'experiment', 'project', 'reflection'],
    relatedDictionaryConcepts: [
      'Innovation', 'Idea', 'Invention', 'Product innovation', 'Process innovation',
      'Service innovation', 'Business model innovation', 'Digital innovation',
      'Platform', 'Ecosystem', 'Network effects', 'Diffusion of innovation',
    ],
    relatedCaseTags: ['sports-innovation', 'digital-platform', 'chatgpt-ai-business-model', 'sustainability', 'food-waste'],
    relatedKikiModes: ['explain', 'challenge', 'critique'],
  },
  {
    id: 'marketing',
    learningAreaId: 'marketing',
    title_en: 'Marketing & Digital Marketing',
    title_bg: 'Маркетинг и дигитален маркетинг',
    short_en:
      'Understanding customer needs and value; markets, segmentation, targeting, positioning and offer; brand and customer journey; marketing mix and digital channels; SEO and AI search visibility (AEO/GEO); email, paid ads, analytics; ethics and consent.',
    short_bg:
      'Разбиране на потребности и стойност за клиента; пазар, сегментиране, таргетиране, позициониране и оферта; бранд и клиентско пътуване; marketing mix и дигитални канали; SEO и видимост в AI търсене (AEO/GEO); email, платени реклами, аналитика; етика и съгласие.',
    difficulty: 'applied',
    topics: [
      { en: 'Customer needs', bg: 'Потребности на клиента' },
      { en: 'Value', bg: 'Стойност' },
      { en: 'Market', bg: 'Пазар' },
      { en: 'Segmentation, targeting, positioning', bg: 'Сегментиране, таргетиране, позициониране' },
      { en: 'Offer', bg: 'Оферта' },
      { en: 'Brand', bg: 'Бранд' },
      { en: 'Customer journey', bg: 'Клиентско пътуване' },
      { en: 'Marketing mix', bg: 'Marketing mix' },
      { en: 'Digital channels: Instagram, TikTok, LinkedIn, Facebook/Meta', bg: 'Дигитални канали: Instagram, TikTok, LinkedIn, Facebook/Meta' },
      { en: 'SEO', bg: 'SEO' },
      { en: 'AI search visibility / AEO / GEO', bg: 'Видимост в AI търсене / AEO / GEO' },
      { en: 'Email', bg: 'Email' },
      { en: 'Paid ads', bg: 'Платени реклами' },
      { en: 'Analytics', bg: 'Аналитика' },
      { en: 'Ethics and consent', bg: 'Етика и съгласие' },
    ],
    practiceTypes: ['case_study', 'decision_task', 'experiment', 'information_search', 'project', 'reflection'],
    relatedDictionaryConcepts: [
      'Marketing', 'Customer value', 'Market', 'Segmentation', 'Targeting', 'Positioning',
      'Value proposition', 'Marketing mix (4P)', 'Brand', 'Customer journey',
      'Digital marketing', 'SEO', 'AI search visibility', 'AEO', 'GEO',
      'Email marketing', 'Paid ads', 'Analytics', 'Privacy', 'Consent',
    ],
    relatedCaseTags: ['digital-marketing-campaign', 'fashion-business', 'small-business', 'youth-environment'],
    relatedKikiModes: ['challenge', 'critique', 'ask_better_questions', 'reflect'],
  },
  {
    id: 'management',
    learningAreaId: 'management',
    title_en: 'Management & Project Management',
    title_bg: 'Мениджмънт и управление на проекти',
    short_en:
      'Managing goals, planning, organizing, processes, resources, timeframes, coordination, execution, control, quality and decision-making. Project management with scope, stakeholders, milestones, risk and change control. Agile sits under project management; Scrum sits under Agile.',
    short_bg:
      'Управление на цели, планиране, организиране, процеси, ресурси, времеви рамки, координация, изпълнение, контрол, качество и вземане на решения. Управление на проекти с обхват, заинтересовани страни, milestones, риск и контрол на промени. Agile е под управление на проекти; Scrum е под Agile.',
    difficulty: 'applied',
    topics: [
      { en: 'Goals', bg: 'Цели' },
      { en: 'Planning', bg: 'Планиране' },
      { en: 'Organizing', bg: 'Организиране' },
      { en: 'Processes', bg: 'Процеси' },
      { en: 'Resources', bg: 'Ресурси' },
      { en: 'Timeframes', bg: 'Времеви рамки' },
      { en: 'Coordination', bg: 'Координация' },
      { en: 'Execution', bg: 'Изпълнение' },
      { en: 'Control', bg: 'Контрол' },
      { en: 'Quality', bg: 'Качество' },
      { en: 'Decision-making', bg: 'Вземане на решения' },
      { en: 'Project management', bg: 'Управление на проекти' },
      { en: 'Scope', bg: 'Обхват' },
      { en: 'Stakeholders', bg: 'Заинтересовани страни' },
      { en: 'Milestones', bg: 'Milestones' },
      { en: 'Risk', bg: 'Риск' },
      { en: 'Change control', bg: 'Контрол на промени' },
      { en: 'Agile (under project management)', bg: 'Agile (под управление на проекти)' },
      { en: 'Scrum (under Agile)', bg: 'Scrum (под Agile)' },
    ],
    practiceTypes: ['case_study', 'decision_task', 'project', 'reflection', 'peer_review'],
    relatedDictionaryConcepts: [
      'Management', 'Goals', 'Planning', 'Organizing', 'Processes', 'Resources',
      'Time frames', 'Coordination', 'Execution', 'Control', 'Quality', 'Decision-making',
      'Project management', 'Scope', 'Stakeholders', 'Milestones', 'Risk',
      'Change control', 'Agile', 'Scrum',
    ],
    relatedCaseTags: ['small-business', 'digital-marketing-campaign', 'school-environment', 'sports-innovation'],
    relatedKikiModes: ['explain', 'challenge', 'critique', 'reflect'],
  },
  {
    id: 'ai',
    learningAreaId: 'ai',
    title_en: 'AI Literacy & AI for Business',
    title_bg: 'AI грамотност и AI за бизнес',
    short_en:
      'AI literacy (machine learning basics, generative AI, LLMs, tokens, context, hallucinations, bias, privacy, copyright/IP, verification, human oversight) and AI for business — marketing, management, research, content, workflows — with prompt design and responsible use.',
    short_bg:
      'AI грамотност (основи на machine learning, генеративен AI, LLM, токени, контекст, халюцинации, bias, поверителност, авторско право/IP, проверка, човешки контрол) и AI за бизнес — маркетинг, мениджмънт, проучване, съдържание, workflows — с prompt design и отговорно ползване.',
    difficulty: 'applied',
    topics: [
      { en: 'AI literacy', bg: 'AI грамотност' },
      { en: 'Machine learning basics', bg: 'Основи на machine learning' },
      { en: 'Generative AI', bg: 'Генеративен AI' },
      { en: 'LLMs', bg: 'LLM' },
      { en: 'Tokens', bg: 'Токени' },
      { en: 'Context', bg: 'Контекст' },
      { en: 'Hallucinations', bg: 'Халюцинации' },
      { en: 'Bias', bg: 'Bias / предубеденост' },
      { en: 'Privacy', bg: 'Поверителност' },
      { en: 'Copyright / IP', bg: 'Авторско право / IP' },
      { en: 'Verification', bg: 'Проверка' },
      { en: 'Human oversight', bg: 'Човешки контрол' },
      { en: 'AI for marketing', bg: 'AI за маркетинг' },
      { en: 'AI for management', bg: 'AI за мениджмънт' },
      { en: 'AI for research', bg: 'AI за проучване' },
      { en: 'AI for content', bg: 'AI за съдържание' },
      { en: 'AI workflows', bg: 'AI workflows' },
      { en: 'Prompt design', bg: 'Prompt design' },
      { en: 'Responsible AI use', bg: 'Отговорно ползване на AI' },
    ],
    practiceTypes: ['case_study', 'decision_task', 'experiment', 'information_search', 'reflection'],
    relatedDictionaryConcepts: [
      'Artificial Intelligence', 'Machine learning', 'Generative AI', 'LLM', 'Tokens', 'Context',
      'Hallucinations', 'Bias', 'Privacy', 'Copyright', 'Verification', 'Human oversight',
      'Prompt design', 'Responsible AI use', 'Human accountability',
    ],
    relatedCaseTags: ['chatgpt-ai-business-model', 'digital-marketing-campaign', 'small-business'],
    relatedKikiModes: ['explain', 'challenge', 'critique', 'ask_better_questions', 'reflect'],
  },
];

/** Canonical ordered theme IDs. */
export const THEME_ORDER: ThemeId[] = [
  'entrepreneurship',
  'innovation',
  'marketing',
  'management',
  'ai',
];

/**
 * Skills are outcomes, evidenced across every theme — NOT a theme.
 * Exposed here purely so UI can surface outcome families without
 * treating "Skills" as a sixth learning theme.
 */
export const SKILL_OUTCOME_FAMILIES = [
  { en: 'Critical thinking', bg: 'Критично мислене' },
  { en: 'Problem solving', bg: 'Решаване на проблеми' },
  { en: 'Communication', bg: 'Комуникация' },
  { en: 'Decision-making', bg: 'Вземане на решения' },
  { en: 'Research and evidence', bg: 'Изследване и доказване' },
  { en: 'Reflection and improvement', bg: 'Рефлексия и подобрение' },
] as const;

export function themeById(id: ThemeId): LearningTheme | undefined {
  return LEARNING_THEMES.find((t) => t.id === id);
}

export function themeTitle(theme: LearningTheme, lang: 'bg' | 'en'): string {
  return lang === 'bg' ? theme.title_bg : theme.title_en;
}

export function themeShort(theme: LearningTheme, lang: 'bg' | 'en'): string {
  return lang === 'bg' ? theme.short_bg : theme.short_en;
}
