/**
 * DigiInnov Case Lab — 2026–27 Curriculum Manifest
 *
 * Four-layer architecture:
 *   Layer 1 — Content library (existing files, untouched).
 *   Layer 2 — Curriculum (this manifest): Core + 12 pathways × 3 levels.
 *   Layer 3 — School / teacher configuration (future phases).
 *   Layer 4 — Learner experience (future phases).
 *
 * References point at existing assets by id/slug so nothing is duplicated.
 */

export type PathwayLevel = 'foundation' | 'intermediate' | 'advanced';
export type PathwayTrack = 'core' | 'business' | 'marketing' | 'data_ai' | 'human';

export interface PathwayReference {
  kind: 'module' | 'stage' | 'dictionary_category' | 'case' | 'simulator_week' | 'assessment';
  /** Id/slug in the source data file. Empty when the asset is still to be authored. */
  ref: string;
  /** Level the reference contributes to inside this pathway. */
  level: PathwayLevel;
  /** Optional human note (e.g. "expand with LTV section"). */
  note?: string;
}

export interface Pathway {
  id: string;
  track: PathwayTrack;
  titleEn: string;
  titleBg: string;
  descriptionEn: string;
  descriptionBg: string;
  /** Recommended order among peers on the same track (1 = first). */
  order: number;
  references: PathwayReference[];
}

export const CURRICULUM_VERSION = '2026-2027';

export const PATHWAYS: Pathway[] = [
  /* ── CORE ────────────────────────────────────────────────────────── */
  {
    id: 'core-innovation',
    track: 'core',
    order: 1,
    titleEn: 'Innovation Core',
    titleBg: 'Иновационно ядро',
    descriptionEn: 'The shared foundation every learner completes: what digital innovation is, how startups work, and how to make evidence-based decisions.',
    descriptionBg: 'Обща основа за всеки: какво е дигитална иновация, как работят стартъпите и как да вземаш решения на база доказателства.',
    references: [
      { kind: 'stage', ref: 'stage-1', level: 'foundation' },
      { kind: 'stage', ref: 'stage-2', level: 'foundation' },
      { kind: 'module', ref: 'pmf', level: 'intermediate' },
      { kind: 'dictionary_category', ref: 'Innovation', level: 'foundation' },
      { kind: 'dictionary_category', ref: 'Startup', level: 'foundation' },
    ],
  },
  {
    id: 'core-startup-project',
    track: 'core',
    order: 2,
    titleEn: 'Startup Project (BMC)',
    titleBg: 'Стартъп проект (BMC)',
    descriptionEn: 'Build your own startup end-to-end using the Business Model Canvas.',
    descriptionBg: 'Изгради собствен стартъп от край до край с Business Model Canvas.',
    references: [
      { kind: 'stage', ref: 'stage-3', level: 'foundation' },
      { kind: 'stage', ref: 'stage-4', level: 'intermediate' },
      { kind: 'stage', ref: 'stage-5', level: 'intermediate' },
      { kind: 'stage', ref: 'stage-6', level: 'advanced' },
    ],
  },

  /* ── BUSINESS TRACK ──────────────────────────────────────────────── */
  {
    id: 'strategy-competitive',
    track: 'business',
    order: 1,
    titleEn: 'Strategy & Competitive Advantage',
    titleBg: 'Стратегия и конкурентно предимство',
    descriptionEn: 'Positioning, moats, platforms, and defensibility in digital markets.',
    descriptionBg: 'Позициониране, защитни ровове, платформи и устойчивост в дигиталните пазари.',
    references: [
      { kind: 'module', ref: 'network-effects', level: 'intermediate' },
      { kind: 'module', ref: 'platform-models', level: 'intermediate' },
      { kind: 'module', ref: 'digital-ecosystems', level: 'advanced' },
      { kind: 'dictionary_category', ref: 'Strategy', level: 'foundation' },
      { kind: 'dictionary_category', ref: 'Platform', level: 'intermediate' },
    ],
  },
  {
    id: 'finance-unit-economics',
    track: 'business',
    order: 2,
    titleEn: 'Finance & Unit Economics',
    titleBg: 'Финанси и юнит икономика',
    descriptionEn: 'CAC, LTV, payback, burn, runway — the numbers that decide if a startup survives.',
    descriptionBg: 'CAC, LTV, откупуване, бърн, писта — числата, които решават дали един стартъп ще оцелее.',
    references: [
      { kind: 'module', ref: 'cac', level: 'foundation', note: 'expand with LTV & payback' },
      { kind: 'module', ref: 'pricing-revenue', level: 'intermediate' },
      { kind: 'dictionary_category', ref: 'Metrics', level: 'foundation' },
      { kind: 'dictionary_category', ref: 'Pricing & Revenue', level: 'intermediate' },
    ],
  },
  {
    id: 'operations-systems',
    track: 'business',
    order: 3,
    titleEn: 'Operations & Systems',
    titleBg: 'Операции и системи',
    descriptionEn: 'Processes, supply chain, and reliability — how startups actually deliver.',
    descriptionBg: 'Процеси, доставки и надеждност — как стартъпите реално доставят.',
    references: [
      { kind: 'module', ref: 'operations', level: 'foundation' },
      { kind: 'module', ref: 'supply-chain', level: 'intermediate' },
      { kind: 'dictionary_category', ref: 'Operations', level: 'foundation' },
      { kind: 'dictionary_category', ref: 'Supply Chain', level: 'intermediate' },
    ],
  },

  /* ── MARKETING TRACK ─────────────────────────────────────────────── */
  {
    id: 'marketing-foundations',
    track: 'marketing',
    order: 1,
    titleEn: 'Marketing Foundations',
    titleBg: 'Основи на маркетинга',
    descriptionEn: 'Positioning, segmentation, and the marketing funnel.',
    descriptionBg: 'Позициониране, сегментиране и маркетинг фуния.',
    references: [
      { kind: 'module', ref: 'marketing-basics', level: 'foundation' },
      { kind: 'dictionary_category', ref: 'Marketing', level: 'foundation' },
    ],
  },
  {
    id: 'growth-experimentation',
    track: 'marketing',
    order: 2,
    titleEn: 'Growth & Experimentation',
    titleBg: 'Растеж и експериментиране',
    descriptionEn: 'Growth loops, A/B testing, and channel discovery.',
    descriptionBg: 'Растежни цикли, A/B тестове и откриване на канали.',
    references: [
      { kind: 'dictionary_category', ref: 'Growth', level: 'foundation' },
      { kind: 'dictionary_category', ref: 'Experimentation', level: 'intermediate' },
    ],
  },
  {
    id: 'brand-community',
    track: 'marketing',
    order: 3,
    titleEn: 'Brand & Community',
    titleBg: 'Бранд и общност',
    descriptionEn: 'Building brand equity and community-led growth.',
    descriptionBg: 'Изграждане на бранд капитал и растеж, воден от общност.',
    references: [
      { kind: 'dictionary_category', ref: 'Marketing', level: 'intermediate' },
    ],
  },

  /* ── DATA & AI TRACK ─────────────────────────────────────────────── */
  {
    id: 'ai-for-business',
    track: 'data_ai',
    order: 1,
    titleEn: 'AI for Business',
    titleBg: 'AI за бизнеса',
    descriptionEn: 'How founders use AI to research, build, and operate.',
    descriptionBg: 'Как основателите използват AI за проучване, изграждане и оперативна дейност.',
    references: [
      { kind: 'dictionary_category', ref: 'AI', level: 'foundation' },
    ],
  },
  {
    id: 'data-decisions',
    track: 'data_ai',
    order: 2,
    titleEn: 'Data-Driven Decisions',
    titleBg: 'Решения, водени от данни',
    descriptionEn: 'Reading dashboards, running experiments, avoiding vanity metrics.',
    descriptionBg: 'Четене на табла, провеждане на експерименти, избягване на суетни метрики.',
    references: [
      { kind: 'dictionary_category', ref: 'Data', level: 'foundation' },
      { kind: 'dictionary_category', ref: 'Metrics', level: 'intermediate' },
    ],
  },
  {
    id: 'responsible-innovation',
    track: 'data_ai',
    order: 3,
    titleEn: 'Responsible Innovation',
    titleBg: 'Отговорна иновация',
    descriptionEn: 'AI ethics, GDPR/EU AI Act, bias, and dark patterns.',
    descriptionBg: 'AI етика, GDPR/EU AI Act, пристрастия и тъмни модели.',
    references: [],
  },

  /* ── HUMAN & FUTURE TRACK ────────────────────────────────────────── */
  {
    id: 'team-leadership',
    track: 'human',
    order: 1,
    titleEn: 'Team & Leadership',
    titleBg: 'Екип и лидерство',
    descriptionEn: 'Founding teams, roles, remote work, and founder archetypes.',
    descriptionBg: 'Учредителни екипи, роли, дистанционна работа и архетипи на основателя.',
    references: [
      { kind: 'module', ref: 'team-roles', level: 'foundation' },
      { kind: 'dictionary_category', ref: 'Team & Roles', level: 'foundation' },
    ],
  },
  {
    id: 'future-of-work',
    track: 'human',
    order: 2,
    titleEn: 'Future of Work',
    titleBg: 'Бъдещето на работата',
    descriptionEn: 'How AI, automation, and new business models reshape careers.',
    descriptionBg: 'Как AI, автоматизацията и новите бизнес модели променят кариерите.',
    references: [],
  },
];

export const TRACK_LABELS: Record<PathwayTrack, { en: string; bg: string }> = {
  core:      { en: 'Core',              bg: 'Ядро' },
  business:  { en: 'Business',          bg: 'Бизнес' },
  marketing: { en: 'Marketing & Growth',bg: 'Маркетинг и растеж' },
  data_ai:   { en: 'Data & AI',         bg: 'Данни и AI' },
  human:     { en: 'Human & Future',    bg: 'Хора и бъдеще' },
};

export const LEVEL_LABELS: Record<PathwayLevel, { en: string; bg: string }> = {
  foundation:   { en: 'Foundation',   bg: 'Основи' },
  intermediate: { en: 'Intermediate', bg: 'Средно ниво' },
  advanced:     { en: 'Advanced',     bg: 'Напреднали' },
};

/** Convenience: pathways grouped by track. */
export function pathwaysByTrack(): Record<PathwayTrack, Pathway[]> {
  const map: Record<PathwayTrack, Pathway[]> = {
    core: [], business: [], marketing: [], data_ai: [], human: [],
  };
  for (const p of PATHWAYS) map[p.track].push(p);
  for (const t of Object.keys(map) as PathwayTrack[]) {
    map[t].sort((a, b) => a.order - b.order);
  }
  return map;
}