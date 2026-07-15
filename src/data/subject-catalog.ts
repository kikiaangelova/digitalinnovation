/**
 * Canonical DigiInnov Subject Catalog (V1)
 * ----------------------------------------
 * Single source of truth for the subjects a teacher can teach and a
 * student can study. Keys are stable — never rename them, or the
 * `classrooms.subject_key` and `learning_modules.subject_key` rows in
 * the database will lose their meaning.
 *
 * Availability states are honest:
 *   - `playable` — real playable modules exist today
 *   - `preview`  — some content exists but the subject is not fully built
 *   - `planned`  — announced, no playable content yet
 *
 * Do NOT invent content. If a subject has no playable modules, the UI
 * shows an honest "content is being prepared" message.
 */

export type SubjectAvailability = 'playable' | 'preview' | 'planned';

export interface Subject {
  /** Stable key stored in DB (`classrooms.subject_key`, `learning_modules.subject_key`). */
  key: string;
  title_bg: string;
  title_en: string;
  short_bg: string;
  short_en: string;
  family:
    | 'marketing'
    | 'business'
    | 'entrepreneurship'
    | 'strategy'
    | 'delivery'
    | 'ai'
    | 'management';
  /** Optional link to an existing PATHWAYS entry (kept as free text so we don't invent renames). */
  pathwayId?: string;
  availability: SubjectAvailability;
}

export const SUBJECT_CATALOG: Subject[] = [
  {
    key: 'digital-innovation',
    title_bg: 'Дигитални иновации',
    title_en: 'Digital Innovation',
    short_bg:
      'Как работят дигиталните продукти, мрежовите ефекти, платформите и модерните бизнес модели.',
    short_en:
      'How digital products, network effects, platforms and modern business models actually work.',
    family: 'business',
    pathwayId: 'digital-innovation',
    availability: 'playable',
  },
  {
    key: 'marketing-foundations',
    title_bg: 'Основи на маркетинга',
    title_en: 'Marketing Foundations',
    short_bg: 'Позициониране, целева аудитория, съобщения и оферта — без жаргон.',
    short_en: 'Positioning, audience, messaging and offers — without the jargon.',
    family: 'marketing',
    pathwayId: 'marketing-foundations',
    availability: 'preview',
  },
  {
    key: 'digital-marketing',
    title_bg: 'Дигитален маркетинг',
    title_en: 'Digital Marketing',
    short_bg:
      'Съдържание, канали и мерене — как да стигнеш до реалните си клиенти онлайн.',
    short_en: 'Content, channels and measurement — how to reach real customers online.',
    family: 'marketing',
    pathwayId: 'digital-marketing',
    availability: 'preview',
  },
  {
    key: 'sales-customer-relationships',
    title_bg: 'Продажби и работа с клиенти',
    title_en: 'Sales & Customer Relationships',
    short_bg: 'Разговори с клиенти, оферти, възражения и дългосрочно доверие.',
    short_en:
      'Customer conversations, offers, objections and building long-term trust.',
    family: 'marketing',
    availability: 'planned',
  },
  {
    key: 'entrepreneurship-startups',
    title_bg: 'Предприемачество и стартъпи',
    title_en: 'Entrepreneurship & Startups',
    short_bg: 'От идея към първи клиенти — практично, без празни лозунги.',
    short_en: 'From idea to first customers — practical, no empty slogans.',
    family: 'entrepreneurship',
    pathwayId: 'entrepreneurship-startups',
    availability: 'preview',
  },
  {
    key: 'lean-startup',
    title_bg: 'Lean Startup',
    title_en: 'Lean Startup',
    short_bg: 'Хипотези, експерименти и учене преди мащабиране.',
    short_en: 'Hypotheses, experiments and learning before scaling.',
    family: 'entrepreneurship',
    pathwayId: 'lean-startup',
    availability: 'preview',
  },
  {
    key: 'design-thinking',
    title_bg: 'Дизайн мислене',
    title_en: 'Design Thinking',
    short_bg: 'Разбиране на потребителя, дефиниране на проблема и прототипи.',
    short_en: 'Understand the user, frame the problem and prototype.',
    family: 'strategy',
    pathwayId: 'design-thinking',
    availability: 'preview',
  },
  {
    key: 'black-swan-risk-uncertainty',
    title_bg: 'Черен лебед: риск и несигурност',
    title_en: 'Black Swan: Risk & Uncertainty',
    short_bg:
      'По Насим Талеб — как да мислиш за редки, но силни събития в бизнеса.',
    short_en:
      'Nassim Taleb inspired — thinking about rare, high-impact events in business.',
    family: 'strategy',
    pathwayId: 'black-swan',
    availability: 'preview',
  },
  {
    key: 'blue-ocean-strategy',
    title_bg: 'Стратегия „Син океан“',
    title_en: 'Blue Ocean Strategy',
    short_bg: 'Как да намериш пазар без пряка конкуренция.',
    short_en: 'How to find a market with no direct competition.',
    family: 'strategy',
    availability: 'planned',
  },
  {
    key: 'project-management',
    title_bg: 'Управление на проекти',
    title_en: 'Project Management',
    short_bg: 'Обхват, срокове, хора и рискове — как проектите наистина завършват.',
    short_en: 'Scope, timeline, people and risk — how projects actually get done.',
    family: 'delivery',
    pathwayId: 'project-management',
    availability: 'planned',
  },
  {
    key: 'agile',
    title_bg: 'Agile',
    title_en: 'Agile',
    short_bg: 'Итеративна работа, обратна връзка и адаптиране.',
    short_en: 'Iterative work, feedback loops and adapting fast.',
    family: 'delivery',
    availability: 'planned',
  },
  {
    key: 'scrum',
    title_bg: 'Scrum',
    title_en: 'Scrum',
    short_bg: 'Роли, събития и артефакти — Scrum на човешки език.',
    short_en: 'Roles, events and artifacts — Scrum in plain language.',
    family: 'delivery',
    availability: 'planned',
  },
  {
    key: 'ai-for-business',
    title_bg: 'AI за бизнес',
    title_en: 'AI for Business',
    short_bg: 'Как да използваш AI отговорно за реални бизнес задачи.',
    short_en: 'Using AI responsibly on real business tasks.',
    family: 'ai',
    pathwayId: 'ai-for-business',
    availability: 'preview',
  },
  {
    key: 'management-fundamentals',
    title_bg: 'Основи на управлението',
    title_en: 'Management Fundamentals',
    short_bg: 'Хора, приоритети, решения и обратна връзка — базата на добрия мениджмънт.',
    short_en:
      'People, priorities, decisions and feedback — the base of good management.',
    family: 'management',
    pathwayId: 'management-fundamentals',
    availability: 'preview',
  },
];

/** Default subject for legacy classrooms and legacy modules. */
export const DEFAULT_SUBJECT_KEY = 'digital-innovation';

export const SUBJECT_BY_KEY: Record<string, Subject> = Object.fromEntries(
  SUBJECT_CATALOG.map((s) => [s.key, s]),
);

export function getSubject(key: string | null | undefined): Subject | null {
  if (!key) return null;
  return SUBJECT_BY_KEY[key] ?? null;
}

export function subjectTitle(
  subject: Subject | null | undefined,
  lang: 'bg' | 'en',
): string {
  if (!subject) return '';
  return lang === 'bg' ? subject.title_bg : subject.title_en;
}

export function subjectShort(
  subject: Subject | null | undefined,
  lang: 'bg' | 'en',
): string {
  if (!subject) return '';
  return lang === 'bg' ? subject.short_bg : subject.short_en;
}

/**
 * Resolves a subject key to a display label, falling back to a
 * human-readable version of the raw key when the subject is unknown
 * (e.g. a legacy value that was manually inserted).
 */
export function subjectLabel(
  key: string | null | undefined,
  lang: 'bg' | 'en',
): string {
  const s = getSubject(key);
  if (s) return subjectTitle(s, lang);
  if (!key) return lang === 'bg' ? 'Без предмет' : 'No subject';
  return key;
}