/**
 * Dictionary Governance V1 — required curriculum concepts.
 *
 * These are the concepts the educator-approved learning areas
 * (see `learning-areas.ts`) require the dictionary to cover. They are
 * NOT full definitions — only mapping records used to:
 *
 *   1. detect which concepts already exist in `TERMS`;
 *   2. detect duplicates by English and Bulgarian term;
 *   3. surface unreviewed / missing concepts in the UI and tests.
 *
 * Nothing here is educator_approved by default. A concept becomes
 * educator_approved only when a human educator explicitly rewrites
 * and signs off on the corresponding entry inside `dictionary-terms.ts`.
 */

import { TERMS, type DictionaryTerm, type LearningAreaId, type ReviewStatus, type SourceStatus } from './dictionary-terms';

export interface RequiredConcept {
  term_en: string;
  term_bg: string;
  learningAreaId: LearningAreaId;
  topicTags: string[];
  subjectKeys?: string[];
  required: true;
  reviewStatus: ReviewStatus;
  sourceStatus: SourceStatus;
  /** Optional editorial notes / cautions (e.g. "don't define MVP as just 'small product'"). */
  notes?: string;
}

const defaults = {
  required: true as const,
  reviewStatus: 'needs_review' as ReviewStatus,
  sourceStatus: 'not_checked' as SourceStatus,
};

const c = (
  term_en: string,
  term_bg: string,
  learningAreaId: LearningAreaId,
  topicTags: string[],
  extra: Partial<RequiredConcept> = {},
): RequiredConcept => ({
  term_en,
  term_bg,
  learningAreaId,
  topicTags,
  ...defaults,
  ...extra,
});

// -------------------- Management --------------------
const MANAGEMENT: RequiredConcept[] = [
  c('Management', 'Мениджмънт', 'management', ['fundamentals'], { subjectKeys: ['management-fundamentals'] }),
  c('Goals', 'Цели', 'management', ['fundamentals', 'planning']),
  c('Results', 'Резултати', 'management', ['fundamentals']),
  c('Planning', 'Планиране', 'management', ['fundamentals']),
  c('Organizing', 'Организиране', 'management', ['fundamentals']),
  c('Processes', 'Процеси', 'management', ['fundamentals']),
  c('Resources', 'Ресурси', 'management', ['fundamentals']),
  c('Time frames', 'Времеви рамки', 'management', ['fundamentals', 'project-management']),
  c('Coordination', 'Координация', 'management', ['fundamentals']),
  c('Execution', 'Изпълнение', 'management', ['fundamentals']),
  c('Control', 'Контрол', 'management', ['fundamentals']),
  c('Quality', 'Качество', 'management', ['fundamentals']),
  c('Decision-making', 'Вземане на решения', 'management', ['fundamentals']),
  c('People management', 'Управление на хора', 'management', ['people']),
  c('Leadership', 'Лидерство', 'management', ['people']),
  c('Project management', 'Управление на проекти', 'management', ['project-management'], { subjectKeys: ['project-management'] }),
  c('Project', 'Проект', 'management', ['project-management']),
  c('Scope', 'Обхват', 'management', ['project-management']),
  c('Stakeholders', 'Заинтересовани страни', 'management', ['project-management']),
  c('Project deliverables', 'Deliverables', 'management', ['project-management']),
  c('Milestones', 'Основни етапи', 'management', ['project-management']),
  c('Risk', 'Риск', 'management', ['project-management']),
  c('Change control', 'Контрол на промени', 'management', ['project-management']),
  c('Monitoring', 'Проследяване', 'management', ['project-management']),
  c('Project review', 'Преглед на проекта', 'management', ['project-management']),
  // Agile & Scrum belong under Project Management, NOT as top-level subjects.
  c('Agile', 'Agile', 'management', ['project-management', 'agile'], {
    subjectKeys: ['agile'],
    notes: 'Frame Agile as an approach under uncertainty, inside Project Management — never as a standalone subject.',
  }),
  c('Scrum', 'Scrum', 'management', ['project-management', 'agile'], {
    subjectKeys: ['scrum'],
    notes: 'Scrum is a framework inside Agile, inside Project Management.',
  }),
];

// -------------------- Marketing --------------------
const MARKETING: RequiredConcept[] = [
  c('Marketing', 'Маркетинг', 'marketing', ['fundamentals'], { subjectKeys: ['marketing-foundations'] }),
  c('Needs', 'Потребности', 'marketing', ['fundamentals']),
  c('Wants', 'Желания', 'marketing', ['fundamentals']),
  c('Demand', 'Търсене', 'marketing', ['fundamentals']),
  c('Customer value', 'Стойност за клиента', 'marketing', ['fundamentals']),
  c('Market', 'Пазар', 'marketing', ['fundamentals']),
  c('Competition', 'Конкуренция', 'marketing', ['fundamentals']),
  c('Market research', 'Пазарно проучване', 'marketing', ['research']),
  c('Segmentation', 'Сегментиране', 'marketing', ['stp']),
  c('Targeting', 'Таргетиране', 'marketing', ['stp']),
  c('Positioning', 'Позициониране', 'marketing', ['stp']),
  c('Value proposition', 'Стойностно предложение', 'marketing', ['stp', 'offer']),
  c('Offer', 'Оферта', 'marketing', ['offer']),
  c('Marketing mix (4P)', 'Marketing mix / 4P', 'marketing', ['mix']),
  c('Product', 'Продукт', 'marketing', ['mix']),
  c('Price', 'Цена', 'marketing', ['mix']),
  c('Place', 'Дистрибуция', 'marketing', ['mix']),
  c('Promotion', 'Промоция', 'marketing', ['mix']),
  c('Brand', 'Бранд', 'marketing', ['brand']),
  c('Customer journey', 'Клиентско пътуване', 'marketing', ['journey']),
  c('Sales', 'Продажби', 'marketing', ['sales'], { subjectKeys: ['sales-customer-relationships'] }),
  c('Marketing ethics', 'Етика в маркетинга', 'marketing', ['ethics']),
  c('Measuring effectiveness', 'Измерване на ефективност', 'marketing', ['analytics']),
  c('Digital marketing', 'Дигитален маркетинг', 'marketing', ['digital'], { subjectKeys: ['digital-marketing'] }),
  c('Digital channels', 'Дигитални канали', 'marketing', ['digital']),
  c('Content marketing', 'Съдържателен маркетинг', 'marketing', ['digital', 'content']),
  c('Instagram marketing', 'Instagram маркетинг', 'marketing', ['digital', 'social']),
  c('TikTok marketing', 'TikTok маркетинг', 'marketing', ['digital', 'social']),
  c('LinkedIn marketing', 'LinkedIn маркетинг', 'marketing', ['digital', 'social']),
  c('Facebook / Meta marketing', 'Facebook / Meta маркетинг', 'marketing', ['digital', 'social']),
  c('SEO', 'SEO', 'marketing', ['digital', 'search']),
  c('AI search visibility', 'Видимост в AI търсене', 'marketing', ['digital', 'search', 'ai']),
  c('AEO', 'AEO', 'marketing', ['digital', 'search', 'ai']),
  c('GEO', 'GEO', 'marketing', ['digital', 'search', 'ai']),
  c('Email marketing', 'Email маркетинг', 'marketing', ['digital']),
  c('Paid ads', 'Платени реклами', 'marketing', ['digital', 'paid']),
  c('Analytics', 'Аналитика', 'marketing', ['digital', 'analytics']),
  c('Campaign planning', 'Планиране на кампании', 'marketing', ['digital']),
  c('Creative testing', 'Тестване на креативи', 'marketing', ['digital', 'experiments']),
  c('Conversion', 'Конверсия', 'marketing', ['digital', 'analytics']),
  c('Privacy', 'Поверителност', 'marketing', ['digital', 'ethics']),
  c('Consent', 'Съгласие', 'marketing', ['digital', 'ethics']),
  c('Ethical data use', 'Етично ползване на данни', 'marketing', ['digital', 'ethics']),
];

// -------------------- Entrepreneurship --------------------
const ENTREPRENEURSHIP: RequiredConcept[] = [
  c('Entrepreneurship', 'Предприемачество', 'entrepreneurship', ['fundamentals'], {
    subjectKeys: ['entrepreneurship-startups'],
    notes: 'Do not reduce entrepreneurship to "starting a company".',
  }),
  c('Entrepreneurial mindset', 'Предприемаческо мислене', 'entrepreneurship', ['fundamentals']),
  c('Environmental observation', 'Наблюдение на среда', 'entrepreneurship', ['discovery']),
  c('Problem', 'Проблем', 'entrepreneurship', ['discovery']),
  c('Problem discovery', 'Откриване на проблем', 'entrepreneurship', ['discovery']),
  c('Customer problem', 'Проблем на клиента', 'entrepreneurship', ['discovery']),
  c('Opportunity', 'Възможност', 'entrepreneurship', ['discovery']),
  c('Opportunity recognition', 'Разпознаване на възможност', 'entrepreneurship', ['discovery']),
  c('Business model', 'Бизнес модел', 'entrepreneurship', ['model']),
  c('Value proposition', 'Стойностно предложение', 'entrepreneurship', ['model']),
  c('Assumption', 'Допускане', 'entrepreneurship', ['lean'], {
    notes: 'Alias of legacy "Assumptions". Kept singular to align with the practice-first Entrepreneurship dictionary entry.',
  }),
  c('Evidence', 'Доказателство', 'entrepreneurship', ['lean', 'analysis'], {
    notes: 'Entrepreneurship sense — evidence that supports or challenges an assumption. Separate from the Skills-area "Evidence / Доказване" concept.',
  }),
  c('Information search', 'Търсене на информация', 'entrepreneurship', ['discovery', 'analysis']),
  c('Customer interview', 'Клиентско интервю', 'entrepreneurship', ['discovery']),
  c('Root cause', 'Първопричина', 'entrepreneurship', ['discovery', 'analysis']),
  c('Lean Startup', 'Lean Startup', 'entrepreneurship', ['lean'], { subjectKeys: ['lean-startup'] }),
  c('MVP (Minimum Viable Product)', 'MVP (Minimum Viable Product)', 'entrepreneurship', ['lean'], {
    notes: 'Do not define MVP as simply "a small version of the product". It is the smallest thing that lets you learn about a real assumption.',
  }),
  c('Experiment', 'Експеримент', 'entrepreneurship', ['lean']),
  c('Measurement', 'Измерване', 'entrepreneurship', ['lean']),
  c('Learning', 'Учене', 'entrepreneurship', ['lean']),
  c('Learning loop', 'Цикъл на учене', 'entrepreneurship', ['lean']),
  c('Decision', 'Решение', 'entrepreneurship', ['lean', 'decision-making'], {
    notes: 'Entrepreneurship sense — an argued choice between options based on evidence. Separate from the Skills-area "Decision-making" concept.',
  }),
  c('Pivot', 'Pivot', 'entrepreneurship', ['lean']),
  c('Persevere', 'Продължаване без промяна на посоката', 'entrepreneurship', ['lean']),
  c('Design Thinking', 'Design Thinking', 'entrepreneurship', ['methods'], { subjectKeys: ['design-thinking'] }),
  c('Blue Ocean Strategy', 'Blue Ocean Strategy', 'entrepreneurship', ['methods'], {
    subjectKeys: ['blue-ocean-strategy'],
    notes: 'Do not define Blue Ocean as simply "a market with no competition". It is about creating new value space that makes competition less relevant.',
  }),
  c('Black Swan', 'Black Swan', 'entrepreneurship', ['methods', 'uncertainty'], { subjectKeys: ['black-swan-risk-uncertainty'] }),
  c('Uncertainty', 'Несигурност', 'entrepreneurship', ['uncertainty']),
  c('Market validation', 'Валидация на пазара', 'entrepreneurship', ['gtm']),
  c('First customers', 'Първи клиенти', 'entrepreneurship', ['gtm']),
  c('Go-to-market', 'Go-to-market', 'entrepreneurship', ['gtm']),
  c('Pitch', 'Представяне на идея', 'entrepreneurship', ['gtm']),
];

// -------------------- Innovation --------------------
const INNOVATION: RequiredConcept[] = [
  c('Innovation', 'Иновация', 'innovation', ['fundamentals']),
  c('Idea', 'Идея', 'innovation', ['fundamentals']),
  c('Invention', 'Изобретение', 'innovation', ['fundamentals']),
  c('Types of innovation', 'Видове иновации', 'innovation', ['types']),
  c('Product innovation', 'Продуктова иновация', 'innovation', ['types']),
  c('Process innovation', 'Процесна иновация', 'innovation', ['types']),
  c('Service innovation', 'Услугова иновация', 'innovation', ['types']),
  c('Organizational innovation', 'Организационна иновация', 'innovation', ['types']),
  c('Business model innovation', 'Бизнес модел иновация', 'innovation', ['types']),
  c('Digital innovation', 'Дигитална иновация', 'innovation', ['digital'], { subjectKeys: ['digital-innovation'] }),
  c('Platform', 'Платформа', 'innovation', ['digital']),
  c('Ecosystem', 'Екосистема', 'innovation', ['digital']),
  c('Network effects', 'Мрежови ефекти', 'innovation', ['digital']),
  c('Diffusion of innovation', 'Разпространение на иновации', 'innovation', ['adoption']),
  c('Innovation in organizations', 'Иновации в организации', 'innovation', ['organizations']),
  c('Innovation risk', 'Риск при иновации', 'innovation', ['organizations']),
  c('Innovation measurement', 'Измерване на иновации', 'innovation', ['organizations']),
];

// Innovation Batch 2A — practice-first module anchors
const INNOVATION_2A: RequiredConcept[] = [
  c('Adoption', 'Приемане', 'innovation', ['adoption', 'diffusion']),
  c('Value Creation', 'Създаване на стойност', 'innovation', ['value', 'impact']),
  c('Continuous Improvement', 'Непрекъснато подобрение', 'innovation', ['process', 'improvement', 'measurement']),
  c('Implementation', 'Внедряване', 'innovation', ['implementation', 'change']),
  c('Change Management', 'Управление на промяната', 'innovation', ['implementation', 'change', 'people']),
  c('Baseline', 'Базова стойност', 'innovation', ['measurement', 'baseline', 'evidence']),
  c('Impact Measurement', 'Измерване на въздействие', 'innovation', ['measurement', 'impact', 'evidence']),
];

// -------------------- AI --------------------
const AI: RequiredConcept[] = [
  // Literacy
  c('Artificial Intelligence', 'Изкуствен интелект', 'ai', ['literacy'], { subjectKeys: ['ai-for-business'] }),
  c('Machine learning', 'Machine learning', 'ai', ['literacy']),
  c('Generative AI', 'Генеративен AI', 'ai', ['literacy']),
  c('LLM', 'LLM', 'ai', ['literacy']),
  c('Tokens', 'Токени', 'ai', ['literacy']),
  c('Context', 'Контекст', 'ai', ['literacy']),
  c('Context window', 'Контекстен прозорец', 'ai', ['literacy']),
  c('Capabilities', 'Възможности', 'ai', ['literacy']),
  c('Limitations', 'Ограничения', 'ai', ['literacy']),
  c('Hallucinations', 'Халюцинации', 'ai', ['literacy', 'risk']),
  c('Bias', 'Предубеденост', 'ai', ['literacy', 'risk']),
  c('Privacy', 'Поверителност', 'ai', ['literacy', 'ethics']),
  c('Confidential data', 'Конфиденциални данни', 'ai', ['literacy', 'ethics']),
  c('Copyright', 'Авторско право', 'ai', ['literacy', 'ethics']),
  c('Intellectual property', 'Интелектуална собственост', 'ai', ['literacy', 'ethics']),
  c('Human oversight', 'Човешки контрол', 'ai', ['literacy', 'ethics']),
  c('Verification', 'Проверка', 'ai', ['literacy', 'ethics']),
  // For Business
  c('AI in marketing', 'AI в маркетинга', 'ai', ['business']),
  c('AI in management', 'AI в мениджмънта', 'ai', ['business']),
  c('AI in research', 'AI в проучване', 'ai', ['business']),
  c('AI in analysis', 'AI в анализ', 'ai', ['business']),
  c('AI in content creation', 'AI в създаване на съдържание', 'ai', ['business']),
  c('AI in sales and customers', 'AI в продажби и клиенти', 'ai', ['business']),
  c('AI in productivity', 'AI в продуктивност', 'ai', ['business']),
  c('AI in education', 'AI в обучение', 'ai', ['business']),
  c('AI in decision-making', 'AI във вземане на решения', 'ai', ['business']),
  // In Practice
  c('Prompt design', 'Prompt design', 'ai', ['practice']),
  c('Context design', 'Context design', 'ai', ['practice']),
  c('Tool choice', 'Избор на инструменти', 'ai', ['practice']),
  c('Workflow design', 'Дизайн на workflows', 'ai', ['practice']),
  c('Iteration', 'Итерация', 'ai', ['practice']),
  c('Disclosure', 'Прозрачност', 'ai', ['practice', 'ethics']),
  c('Responsible AI use', 'Отговорно ползване на AI', 'ai', ['practice', 'ethics']),
  c('Human accountability', 'Човешка отговорност', 'ai', ['practice', 'ethics']),
];

// -------------------- Skills --------------------
const SKILLS: RequiredConcept[] = [
  c('Skills', 'Умения', 'skills', ['overview']),
  c('Critical thinking', 'Критично мислене', 'skills', ['thinking']),
  c('Problem solving', 'Решаване на проблеми', 'skills', ['thinking']),
  c('Communication', 'Комуникация', 'skills', ['communication']),
  c('Presentation skills', 'Презентационни умения', 'skills', ['communication']),
  c('Negotiation', 'Преговори', 'skills', ['communication']),
  c('Sales skills', 'Продажбени умения', 'skills', ['communication']),
  c('Financial skills', 'Финансови умения', 'skills', ['literacy']),
  c('Data literacy', 'Data literacy', 'skills', ['literacy']),
  c('AI literacy', 'AI literacy', 'skills', ['literacy']),
  c('Decision-making', 'Вземане на решения', 'skills', ['thinking']),
  c('Working with people', 'Работа с хора', 'skills', ['people']),
  c('Leadership', 'Лидерство', 'skills', ['people']),
  c('Project thinking', 'Проектно мислене', 'skills', ['thinking']),
  c('Research', 'Изследване', 'skills', ['research']),
  c('Evidence', 'Доказване', 'skills', ['research']),
  c('Ethical thinking', 'Етично мислене', 'skills', ['ethics']),
  c('Reflection', 'Рефлексия', 'skills', ['reflection']),
  c('Improvement', 'Подобрение', 'skills', ['reflection']),
];

export const REQUIRED_CONCEPTS: RequiredConcept[] = [
  ...MANAGEMENT,
  ...MARKETING,
  ...ENTREPRENEURSHIP,
  ...INNOVATION,
  ...INNOVATION_2A,
  ...AI,
  ...SKILLS,
];

// -------------------- Matching helpers --------------------

/** Normalize a term for equality-style matching. */
export function normalizeTerm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function termMatches(needle: string, hay: string): boolean {
  const a = normalizeTerm(needle);
  const b = normalizeTerm(hay);
  if (!a || !b) return false;
  return a === b;
}

/** Find the existing TERMS entry that already covers a required concept, if any. */
export function findExistingTerm(concept: RequiredConcept, terms: DictionaryTerm[] = TERMS): DictionaryTerm | null {
  return (
    terms.find(
      (t) => termMatches(concept.term_en, t.term) || termMatches(concept.term_bg, t.termBg),
    ) ?? null
  );
}

export interface CoverageEntry {
  concept: RequiredConcept;
  existing: DictionaryTerm | null;
}

/** Full coverage table: which required concepts already exist vs. missing. */
export function getRequiredConceptCoverage(terms: DictionaryTerm[] = TERMS): CoverageEntry[] {
  return REQUIRED_CONCEPTS.map((concept) => ({
    concept,
    existing: findExistingTerm(concept, terms),
  }));
}

export function getMissingRequiredConcepts(terms: DictionaryTerm[] = TERMS): RequiredConcept[] {
  return getRequiredConceptCoverage(terms)
    .filter((e) => !e.existing)
    .map((e) => e.concept);
}

export function getMatchedRequiredConcepts(terms: DictionaryTerm[] = TERMS): CoverageEntry[] {
  return getRequiredConceptCoverage(terms).filter((e) => !!e.existing);
}

/** Duplicate-by-EN across TERMS. */
export function findDuplicateEnglishTerms(terms: DictionaryTerm[] = TERMS): Record<string, DictionaryTerm[]> {
  const groups: Record<string, DictionaryTerm[]> = {};
  for (const t of terms) {
    const k = normalizeTerm(t.term);
    if (!k) continue;
    (groups[k] ??= []).push(t);
  }
  return Object.fromEntries(Object.entries(groups).filter(([, v]) => v.length > 1));
}

/** Duplicate-by-BG across TERMS. */
export function findDuplicateBulgarianTerms(terms: DictionaryTerm[] = TERMS): Record<string, DictionaryTerm[]> {
  const groups: Record<string, DictionaryTerm[]> = {};
  for (const t of terms) {
    const k = normalizeTerm(t.termBg);
    if (!k) continue;
    (groups[k] ??= []).push(t);
  }
  return Object.fromEntries(Object.entries(groups).filter(([, v]) => v.length > 1));
}

/** Concept keys colliding with themselves (should always be empty by design). */
export function findDuplicateRequiredConcepts(): {
  en: Record<string, RequiredConcept[]>;
  bg: Record<string, RequiredConcept[]>;
} {
  const enGroups: Record<string, RequiredConcept[]> = {};
  const bgGroups: Record<string, RequiredConcept[]> = {};
  for (const c of REQUIRED_CONCEPTS) {
    const kEn = `${c.learningAreaId}::${normalizeTerm(c.term_en)}`;
    const kBg = `${c.learningAreaId}::${normalizeTerm(c.term_bg)}`;
    (enGroups[kEn] ??= []).push(c);
    (bgGroups[kBg] ??= []).push(c);
  }
  return {
    en: Object.fromEntries(Object.entries(enGroups).filter(([, v]) => v.length > 1)),
    bg: Object.fromEntries(Object.entries(bgGroups).filter(([, v]) => v.length > 1)),
  };
}

/** Concepts that are required but not yet reviewed by an educator. */
export function getNeedsReviewConcepts(): RequiredConcept[] {
  return REQUIRED_CONCEPTS.filter((c) => c.reviewStatus === 'needs_review');
}

/** Reverse lookup: is this dictionary term a required curriculum concept? */
export function isRequiredConcept(term: DictionaryTerm): boolean {
  return REQUIRED_CONCEPTS.some(
    (c) => termMatches(c.term_en, term.term) || termMatches(c.term_bg, term.termBg),
  );
}

/** Casual / generative phrases that must not appear in dictionary copy. */
export const FORBIDDEN_TONE_PHRASES: string[] = [
  'dangerous at facts',
  'burning money for practice',
  'boring but crucial',
  'cries a little when it breaks',
  'keeps you off the news',
  'one Tuesday afternoon',
  'juicy',
  'ugly name, honest answers',
  'brilliant but has amnesia',
  'brilliant intern',
  'founder friend',
];