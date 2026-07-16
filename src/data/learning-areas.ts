/**
 * DigiInnov Learning Areas (V1)
 * -----------------------------
 * Canonical, learner-facing hierarchy that groups the flat
 * `subject-catalog` keys into 6 educational areas.
 *
 * Stable DB keys in `subject-catalog.ts` are unchanged — this file
 * only controls how learners see the subjects grouped in the UI.
 *
 *   Learning Area → Subject/Pathway → Main Topics → Modules → Tasks → Skills
 *
 * The Skills area is cross-cutting: it lists ability families
 * developed across every area, not a stack of subjects to consume.
 *
 * These summaries are educator-approved navigation labels for V1.
 * Lovable must not invent or expand curriculum taxonomy. Full
 * curriculum taxonomy is authored by the educator.
 */

import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Megaphone,
  Rocket,
  Sparkles,
  Bot,
  Compass,
} from 'lucide-react';

export type LearningAreaId =
  | 'management'
  | 'marketing'
  | 'entrepreneurship'
  | 'innovation'
  | 'ai'
  | 'skills';

export interface LearningArea {
  id: LearningAreaId;
  icon: LucideIcon;
  title_en: string;
  title_bg: string;
  short_en: string;
  short_bg: string;
  /**
   * Ordered list of `subject-catalog` keys that belong to this area.
   * Primary/base subjects come first; deeper pathways after.
   * Cross-cutting areas (skills) may be empty and rely on `topics`.
   */
  subjectKeys: string[];
  /**
   * Subject-catalog keys that belong to this area for classification
   * purposes (reverse lookup, "Other" filter) but should NOT be
   * rendered as prominent standalone learner-facing cards — because
   * they are methods/frameworks or skill-adjacent, not top-level
   * subjects. Example: Agile & Scrum sit under Project Management,
   * Sales sits under Skills.
   */
  hiddenSubjectKeys?: string[];
  /**
   * Learner-facing topics/lenses shown inside the area even when they
   * are not standalone subjects (e.g. Agile/Scrum inside Management,
   * or the Skills families). Purely informational.
   */
  topics: { en: string; bg: string }[];
}

export const LEARNING_AREAS: LearningArea[] = [
  {
    id: 'management',
    icon: Briefcase,
    title_en: 'Management',
    title_bg: 'Мениджмънт',
    short_en:
      'Managing goals, processes, resources, timelines, coordination, execution, control and results. People are an important part of management, but management is not only people leadership.',
    short_bg:
      'Управление на цели, процеси, ресурси, времеви рамки, координация, изпълнение, контрол и резултати. Хората са важна част от мениджмънта, но не са цялото управление.',
    subjectKeys: ['management-fundamentals', 'project-management'],
    // Agile & Scrum are frameworks inside Project Management, not top-level subjects.
    hiddenSubjectKeys: ['agile', 'scrum'],
    topics: [
      { en: 'What management is', bg: 'Какво е мениджмънт' },
      { en: 'Goals and results', bg: 'Цели и резултати' },
      { en: 'Planning', bg: 'Планиране' },
      { en: 'Organizing', bg: 'Организиране' },
      { en: 'Processes', bg: 'Процеси' },
      { en: 'Resources', bg: 'Ресурси' },
      { en: 'Time frames', bg: 'Времеви рамки' },
      { en: 'Coordination', bg: 'Координация' },
      { en: 'Control and quality', bg: 'Контрол и качество' },
      { en: 'Decision-making', bg: 'Вземане на решения' },
      { en: 'People management', bg: 'Управление на хора' },
      { en: 'Leadership as related but distinct', bg: 'Лидерство като свързано, но различно понятие' },
      { en: 'Connection to project management', bg: 'Връзка с управление на проекти' },
      { en: 'Project management (scope, milestones, risk, change control)', bg: 'Управление на проекти (обхват, milestones, риск, контрол на промени)' },
      { en: 'Agile as an approach under uncertainty', bg: 'Agile като подход при несигурност' },
      { en: 'Scrum as a framework inside Agile', bg: 'Scrum като рамка вътре в Agile' },
    ],
  },
  {
    id: 'marketing',
    icon: Megaphone,
    title_en: 'Marketing',
    title_bg: 'Маркетинг',
    short_en:
      'Understanding customers, markets, value, positioning, offers and channels. Digital marketing is an applied part of marketing, not a separate universe.',
    short_bg:
      'Разбиране на клиента, пазара, стойността, позиционирането, офертата и каналите. Дигиталният маркетинг е приложна част от маркетинга, не отделна логическа вселена.',
    subjectKeys: ['marketing-foundations', 'digital-marketing'],
    // Sales lives in Skills, connected to Marketing — not a top-level subject here.
    hiddenSubjectKeys: ['sales-customer-relationships'],
    topics: [
      { en: 'What marketing is', bg: 'Какво е маркетинг' },
      { en: 'Needs, wants and demand', bg: 'Потребности, желания и търсене' },
      { en: 'Customer value', bg: 'Стойност за клиента' },
      { en: 'Market and competition', bg: 'Пазар и конкуренция' },
      { en: 'Market research', bg: 'Проучване на пазара' },
      { en: 'Segmentation', bg: 'Сегментиране' },
      { en: 'Targeting', bg: 'Таргетиране' },
      { en: 'Positioning', bg: 'Позициониране' },
      { en: 'Value proposition', bg: 'Стойностно предложение' },
      { en: 'Offer', bg: 'Оферта' },
      { en: 'Marketing mix / 4P', bg: 'Marketing mix / 4P' },
      { en: 'Brand', bg: 'Бранд' },
      { en: 'Customer journey', bg: 'Customer journey' },
      { en: 'Marketing ↔ sales', bg: 'Връзка между маркетинг и продажби' },
      { en: 'Marketing ethics', bg: 'Етика в маркетинга' },
      { en: 'Measuring effectiveness', bg: 'Измерване на ефективност' },
      { en: 'Digital channels (Instagram, TikTok, LinkedIn, Meta)', bg: 'Дигитални канали (Instagram, TikTok, LinkedIn, Meta)' },
      { en: 'Content, SEO & AI search visibility (AEO/GEO)', bg: 'Съдържание, SEO и видимост в AI търсене (AEO/GEO)' },
      { en: 'Email, paid ads, analytics', bg: 'Email, платени реклами, аналитика' },
      { en: 'Privacy, consent and ethical data use', bg: 'Поверителност, съгласие и етично ползване на данни' },
    ],
  },
  {
    id: 'entrepreneurship',
    icon: Rocket,
    title_en: 'Entrepreneurship',
    title_bg: 'Предприемачество',
    short_en:
      'Entrepreneurial thinking for discovering problems, opportunities and working business models. Methods such as Lean Startup, Design Thinking, Blue Ocean and Black Swan are thinking and action lenses inside this area.',
    short_bg:
      'Предприемаческо мислене за откриване на проблеми, възможности и работещи бизнес модели. Методологии като Lean Startup, Design Thinking, Blue Ocean и Black Swan са лещи за мислене и действие вътре в тази област.',
    subjectKeys: [
      'entrepreneurship-startups',
      'lean-startup',
      'design-thinking',
      'blue-ocean-strategy',
      'black-swan-risk-uncertainty',
    ],
    topics: [
      { en: 'Entrepreneurial mindset', bg: 'Предприемаческо мислене' },
      { en: 'Observing environments and problems', bg: 'Наблюдение на среда и проблеми' },
      { en: 'Problem discovery', bg: 'Откриване на проблема' },
      { en: 'Customer problem', bg: 'Проблем на клиента' },
      { en: 'Opportunity recognition', bg: 'Разпознаване на възможност' },
      { en: 'Business models', bg: 'Бизнес модели' },
      { en: 'Value proposition', bg: 'Стойностно предложение' },
      { en: 'Core assumptions', bg: 'Основни допускания' },
      { en: 'Lean Startup', bg: 'Lean Startup' },
      { en: 'MVP', bg: 'MVP' },
      { en: 'Experiments', bg: 'Експерименти' },
      { en: 'Measurement and learning', bg: 'Измерване и учене' },
      { en: 'Pivot or persevere', bg: 'Pivot или persevere' },
      { en: 'Design Thinking', bg: 'Design Thinking' },
      { en: 'Blue Ocean Strategy', bg: 'Blue Ocean Strategy' },
      { en: 'Black Swan / uncertainty thinking', bg: 'Black Swan / мислене за несигурност' },
      { en: 'Market validation', bg: 'Валидация на пазара' },
      { en: 'First customers', bg: 'Първи клиенти' },
      { en: 'Go-to-market', bg: 'Go-to-market' },
      { en: 'Pitching', bg: 'Питчинг' },
    ],
  },
  {
    id: 'innovation',
    icon: Sparkles,
    title_en: 'Innovation',
    title_bg: 'Иновации',
    short_en:
      'Innovation is about novelty, implementation and value creation. It can be product, process, digital, organizational or business-model related.',
    short_bg:
      'Иновациите са свързани с новост, внедряване и създаване на стойност. Те могат да бъдат продуктови, процесни, дигитални, организационни или свързани с бизнес модела.',
    subjectKeys: ['digital-innovation'],
    topics: [
      { en: 'What innovation is', bg: 'Какво е иновация' },
      { en: 'Idea vs invention vs innovation', bg: 'Разлика между идея, изобретение и иновация' },
      { en: 'Types of innovation', bg: 'Видове иновации' },
      { en: 'Product innovation', bg: 'Продуктова иновация' },
      { en: 'Process innovation', bg: 'Процесна иновация' },
      { en: 'Service innovation', bg: 'Услугова иновация' },
      { en: 'Organizational innovation', bg: 'Организационна иновация' },
      { en: 'Business model innovation', bg: 'Бизнес модел иновация' },
      { en: 'Digital innovation', bg: 'Дигитална иновация' },
      { en: 'Platforms', bg: 'Платформи' },
      { en: 'Ecosystems', bg: 'Екосистеми' },
      { en: 'Network effects', bg: 'Мрежови ефекти' },
      { en: 'Diffusion of innovation', bg: 'Разпространение на иновации' },
      { en: 'Innovation in organizations', bg: 'Иновации в организации' },
      { en: 'Measurement and risk in innovation', bg: 'Измерване и риск при иновации' },
    ],
  },
  {
    id: 'ai',
    icon: Bot,
    title_en: 'AI Literacy & AI for Business',
    title_bg: 'AI грамотност и AI за бизнес',
    short_en:
      'Three layers: understanding AI, using AI in business contexts, and practicing with AI tools responsibly.',
    short_bg:
      'Три слоя: разбиране на AI, използване на AI в бизнес контекст и практическа работа с AI инструменти по отговорен начин.',
    subjectKeys: ['ai-for-business'],
    topics: [
      // AI Literacy
      { en: 'AI Literacy — what AI is', bg: 'AI грамотност — какво е AI' },
      { en: 'Machine learning basics', bg: 'Основи на machine learning' },
      { en: 'Generative AI', bg: 'Генеративен AI' },
      { en: 'LLMs, tokens and context', bg: 'LLM, токени и контекст' },
      { en: 'Capabilities and limits', bg: 'Възможности и ограничения' },
      { en: 'Hallucinations', bg: 'Халюцинации' },
      { en: 'Bias', bg: 'Предубеденост (bias)' },
      { en: 'Privacy and confidential data', bg: 'Поверителност и конфиденциални данни' },
      { en: 'Copyright / IP', bg: 'Авторско право / IP' },
      { en: 'Human oversight and verification', bg: 'Човешки контрол и проверка' },
      // AI for Business
      { en: 'AI for Business — marketing', bg: 'AI за бизнес — маркетинг' },
      { en: 'AI for Business — management', bg: 'AI за бизнес — мениджмънт' },
      { en: 'AI for Business — research & analysis', bg: 'AI за бизнес — проучване и анализ' },
      { en: 'AI for Business — content', bg: 'AI за бизнес — съдържание' },
      { en: 'AI for Business — sales & customers', bg: 'AI за бизнес — продажби и клиенти' },
      { en: 'AI for Business — productivity', bg: 'AI за бизнес — продуктивност' },
      { en: 'AI for Business — learning', bg: 'AI за бизнес — обучение' },
      { en: 'AI for Business — decision-making', bg: 'AI за бизнес — вземане на решения' },
      // AI in Practice
      { en: 'AI in Practice — prompt design', bg: 'AI на практика — prompt design' },
      { en: 'AI in Practice — context design', bg: 'AI на практика — context design' },
      { en: 'AI in Practice — tool choice & workflows', bg: 'AI на практика — избор на инструменти и workflows' },
      { en: 'AI in Practice — verification & iteration', bg: 'AI на практика — проверка и итерация' },
      { en: 'AI in Practice — disclosure & responsible use', bg: 'AI на практика — прозрачност и отговорно ползване' },
      { en: 'Human accountability', bg: 'Човешка отговорност' },
    ],
  },
  {
    id: 'skills',
    icon: Compass,
    title_en: 'Skills',
    title_bg: 'Умения',
    short_en:
      'Skills are developed across all areas and evidenced through tasks, cases, projects, decisions, reasoning, presentations, feedback, revisions and reflection — not clicks or XP.',
    short_bg:
      'Уменията се развиват през всички области и се доказват чрез задачи, казуси, проекти, решения, аргументация, презентации, обратна връзка, ревизии и рефлексия — не чрез кликове или XP.',
    subjectKeys: [],
    topics: [
      { en: 'Critical thinking', bg: 'Критично мислене' },
      { en: 'Problem solving', bg: 'Решаване на проблеми' },
      { en: 'Communication', bg: 'Комуникация' },
      { en: 'Presentation skills', bg: 'Презентационни умения' },
      { en: 'Negotiation', bg: 'Преговори' },
      { en: 'Sales skills', bg: 'Продажбени умения' },
      { en: 'Financial skills', bg: 'Финансови умения' },
      { en: 'Data literacy', bg: 'Data literacy' },
      { en: 'AI literacy', bg: 'AI literacy' },
      { en: 'Decision-making', bg: 'Вземане на решения' },
      { en: 'Working with people', bg: 'Работа с хора' },
      { en: 'Leadership', bg: 'Лидерство' },
      { en: 'Project thinking', bg: 'Проектно мислене' },
      { en: 'Research and evidence', bg: 'Изследване и доказване' },
      { en: 'Ethical thinking', bg: 'Етично мислене' },
      { en: 'Reflection and improvement', bg: 'Рефлексия и подобрение' },
    ],
  },
];

/** Reverse lookup: subject key → its learning area (or null if unmapped). */
export const AREA_BY_SUBJECT_KEY: Record<string, LearningAreaId> =
  LEARNING_AREAS.reduce<Record<string, LearningAreaId>>((acc, area) => {
    for (const key of area.subjectKeys) acc[key] = area.id;
    for (const key of area.hiddenSubjectKeys ?? []) acc[key] = area.id;
    return acc;
  }, {});

export function areaOfSubject(subjectKey: string | null | undefined): LearningAreaId | null {
  if (!subjectKey) return null;
  return AREA_BY_SUBJECT_KEY[subjectKey] ?? null;
}

export function areaTitle(area: LearningArea, lang: 'bg' | 'en'): string {
  return lang === 'bg' ? area.title_bg : area.title_en;
}

export function areaShort(area: LearningArea, lang: 'bg' | 'en'): string {
  return lang === 'bg' ? area.short_bg : area.short_en;
}