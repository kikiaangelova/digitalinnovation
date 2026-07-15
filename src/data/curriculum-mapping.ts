/**
 * Curriculum 2026–27 preservation mapping.
 *
 * Machine-readable classification of every current learning asset so later
 * phases (content expansion, TEACR loop wiring, gamification rebalance) can
 * act on them without hard-coding names in components.
 *
 * No content is deleted or moved by this file — it only labels.
 */

export type PreservationClass =
  | 'keep'
  | 'update'
  | 'expand'
  | 'merge'
  | 'move'
  | 'optional'
  | 'replace_gradually';

export interface AssetMapping {
  /** Stable id used in the source data file. */
  id: string;
  /** Human title for docs / admin surfaces. */
  title: string;
  /** Source data file for traceability. */
  source: string;
  /** Classification for the 2026–27 upgrade. */
  class: PreservationClass;
  /** Short note describing the intended action. */
  note: string;
}

export const MODULE_MAPPING: AssetMapping[] = [
  { id: 'network-effects',   title: 'Network Effects',            source: 'src/data/learning-modules.ts', class: 'update', note: 'Refresh Uber narrative to 2024–26, add TikTok/Shein.' },
  { id: 'platform-models',   title: 'Platform Business Models',   source: 'src/data/learning-modules.ts', class: 'keep',   note: 'Solid — add EU DMA gatekeeper angle.' },
  { id: 'cac',               title: 'Customer Acquisition Cost',  source: 'src/data/learning-modules.ts', class: 'expand', note: 'Add LTV, payback, CAC:LTV, blended vs paid CAC.' },
  { id: 'pmf',               title: 'Product-Market Fit',         source: 'src/data/learning-modules.ts', class: 'keep',   note: 'Add Sean Ellis 40% test, retention curves.' },
  { id: 'digital-ecosystems',title: 'Digital Ecosystems',         source: 'src/data/learning-modules.ts', class: 'update', note: 'Add EU DMA / super-app failures in West.' },
  { id: 'marketing-basics',  title: 'Marketing Fundamentals',     source: 'src/data/learning-modules.ts', class: 'expand', note: 'Split into Positioning, SEO, Content, Paid, Analytics.' },
  { id: 'pricing-revenue',   title: 'Pricing & Revenue',          source: 'src/data/learning-modules.ts', class: 'expand', note: 'Add unit economics, WTP, pricing psychology.' },
  { id: 'team-roles',        title: 'Team & Roles',               source: 'src/data/learning-modules.ts', class: 'keep',   note: 'Add remote/async, founder archetypes.' },
  { id: 'operations',        title: 'Operations & Processes',     source: 'src/data/learning-modules.ts', class: 'merge',  note: 'Merge with Supply Chain → "Operations & Systems".' },
  { id: 'supply-chain',      title: 'Supply Chain Basics',        source: 'src/data/learning-modules.ts', class: 'merge',  note: 'Merge with Operations → "Operations & Systems".' },
];

export const STAGE_MAPPING: AssetMapping[] = [
  { id: 'stage-1', title: 'Digital Innovation Basics',           source: 'src/data/stage-learn-content.ts', class: 'keep',   note: 'Add TEACR loop.' },
  { id: 'stage-2', title: 'Industry & Competitor Analysis',      source: 'src/data/stage-learn-content.ts', class: 'keep',   note: 'Add TEACR loop.' },
  { id: 'stage-3', title: 'Startup Idea & Value Proposition',    source: 'src/data/stage-learn-content.ts', class: 'keep',   note: 'Add TEACR loop.' },
  { id: 'stage-4', title: 'Product Design (MVP)',                source: 'src/data/stage-learn-content.ts', class: 'expand', note: 'Add prototype-fidelity ladder, no-code MVP options.' },
  { id: 'stage-5', title: 'Business Model & Marketing Strategy', source: 'src/data/stage-learn-content.ts', class: 'expand', note: 'Add PLG, community-led growth.' },
  { id: 'stage-6', title: 'Startup Pitch',                       source: 'src/data/stage-learn-content.ts', class: 'keep',   note: 'Add async video pitch, investor Q&A drills.' },
];

export const DICTIONARY_CATEGORY_MAPPING: AssetMapping[] = [
  { id: 'AI',                title: 'AI',                source: 'src/data/dictionary-terms.ts', class: 'expand', note: 'Split into Foundations / GenAI / Prompting / Ethics / Agents.' },
  { id: 'Marketing',         title: 'Marketing',         source: 'src/data/dictionary-terms.ts', class: 'expand', note: 'Split into Positioning / SEO / Content / Paid / Analytics.' },
  { id: 'Metrics',           title: 'Metrics',           source: 'src/data/dictionary-terms.ts', class: 'expand', note: 'Add NRR, payback period, magic number, cohort retention.' },
  { id: 'Pricing & Revenue', title: 'Pricing & Revenue', source: 'src/data/dictionary-terms.ts', class: 'expand', note: 'Add WTP, elasticity, value-based pricing.' },
  { id: 'Operations',        title: 'Operations',        source: 'src/data/dictionary-terms.ts', class: 'merge',  note: 'Merge with Supply Chain.' },
  { id: 'Supply Chain',      title: 'Supply Chain',      source: 'src/data/dictionary-terms.ts', class: 'merge',  note: 'Merge with Operations.' },
  { id: 'Team & Roles',      title: 'Team & Roles',      source: 'src/data/dictionary-terms.ts', class: 'update', note: 'Add async/remote, founder archetypes.' },
  { id: 'Data',              title: 'Data',              source: 'src/data/dictionary-terms.ts', class: 'update', note: 'Add data governance, EU AI Act.' },
  { id: 'Technology',        title: 'Technology',        source: 'src/data/dictionary-terms.ts', class: 'update', note: 'Add edge AI, EU AI Act.' },
  { id: 'Business Model',    title: 'Business Model',    source: 'src/data/dictionary-terms.ts', class: 'keep',   note: '' },
  { id: 'Experimentation',   title: 'Experimentation',   source: 'src/data/dictionary-terms.ts', class: 'keep',   note: '' },
  { id: 'Growth',            title: 'Growth',            source: 'src/data/dictionary-terms.ts', class: 'keep',   note: '' },
  { id: 'Innovation',        title: 'Innovation',        source: 'src/data/dictionary-terms.ts', class: 'keep',   note: '' },
  { id: 'Platform',          title: 'Platform',          source: 'src/data/dictionary-terms.ts', class: 'keep',   note: '' },
  { id: 'Product',           title: 'Product',           source: 'src/data/dictionary-terms.ts', class: 'keep',   note: '' },
  { id: 'Startup',           title: 'Startup',           source: 'src/data/dictionary-terms.ts', class: 'keep',   note: '' },
  { id: 'Strategy',          title: 'Strategy',          source: 'src/data/dictionary-terms.ts', class: 'keep',   note: '' },
];

export const NEW_CATEGORIES_2026: AssetMapping[] = [
  { id: 'finance-unit-economics', title: 'Finance & Unit Economics', source: 'new',        class: 'optional', note: 'Add LTV, CAC payback, gross margin, burn multiple.' },
  { id: 'legal-compliance',       title: 'Legal & Compliance',       source: 'new',        class: 'optional', note: 'GDPR, EU AI Act, data residency.' },
  { id: 'sustainability-esg',     title: 'Sustainability & ESG',     source: 'new',        class: 'optional', note: 'Impact metrics, circular models.' },
  { id: 'responsible-innovation', title: 'Responsible Innovation',   source: 'new',        class: 'optional', note: 'AI ethics, bias, dark patterns.' },
];