import { ShockEvent, TurbulenceCategory } from '@/types/simulator';

export interface TurbulencePool {
  category: TurbulenceCategory;
  events: ShockEvent[];
}

export const TURBULENCE_POOLS: TurbulencePool[] = [
  {
    category: 'market_crash',
    events: [
      {
        title: 'Market Downturn',
        description: 'Economic uncertainty causes consumer spending to drop 15%. Investors are cautious, and customer acquisition costs rise sharply.',
        kpi_effects: { users_total: -30, revenue: -500, cac: 15, burn_rate: 300, brand_trust: -5 },
        category: 'market_crash',
        severity: 3,
        concept_lesson: '💡 Kotler\'s Chaotics: In turbulent markets, cutting all marketing is a mistake. Companies that maintain strategic visibility during downturns capture market share when recovery begins.',
        concept_lesson_bg: '💡 Chaotics на Котлър: В турбулентни пазари спирането на маркетинга е грешка. Компаниите, които поддържат стратегическа видимост по време на спад, печелят пазарен дял при възстановяване.',
      },
      {
        title: 'Funding Winter',
        description: 'Venture capital dries up across the sector. Your runway feels shorter as future fundraising becomes uncertain.',
        kpi_effects: { runway_months: -2, burn_rate: 500, brand_trust: -3 },
        category: 'market_crash',
        severity: 4,
        concept_lesson: '💡 Resilience Principle: Cash is oxygen in a crisis. Startups that proactively reduce burn rate and focus on unit economics survive when others don\'t.',
        concept_lesson_bg: '💡 Принцип на устойчивост: Парите са кислород в криза. Стартъпите, които проактивно намаляват разходите, оцеляват.',
      },
      {
        title: 'Currency Fluctuation',
        description: 'A sudden currency shift makes your imported services 20% more expensive. Margins shrink overnight.',
        kpi_effects: { burn_rate: 800, revenue: -300, arpu: -2 },
        category: 'market_crash',
        severity: 2,
        concept_lesson: '💡 Risk Diversification: Businesses dependent on a single currency or supplier are fragile. Building redundancy is a strategic investment, not a cost.',
        concept_lesson_bg: '💡 Диверсификация на риска: Бизнеси, зависещи от една валута или доставчик, са крехки. Изграждането на резервни варианти е инвестиция.',
      },
    ],
  },
  {
    category: 'competitor_entry',
    events: [
      {
        title: 'Tech Giant Enters Your Market',
        description: 'A major tech company announces a competing product with massive distribution. Your users are nervous. Brand trust wavers.',
        kpi_effects: { users_total: -50, churn_rate: 0.03, brand_trust: -8, nps: -10 },
        category: 'competitor_entry',
        severity: 5,
        concept_lesson: '💡 Adaptability: When a gorilla enters the room, don\'t fight on their terms. Find the niche they can\'t serve. Speed and focus beat scale in uncertainty.',
        concept_lesson_bg: '💡 Адаптивност: Когато голям играч навлезе, не се борете по техните правила. Намерете нишата, която не могат да обслужат.',
      },
      {
        title: 'Aggressive Price War',
        description: 'A competitor slashes prices to gain market share. Users expect you to match their pricing, squeezing your margins.',
        kpi_effects: { arpu: -5, churn_rate: 0.02, revenue: -400, users_total: -20 },
        category: 'competitor_entry',
        severity: 3,
        concept_lesson: '💡 Value Over Price: Racing to the bottom destroys value. Competing on differentiation and customer experience is more sustainable than competing on price.',
        concept_lesson_bg: '💡 Стойност над цена: Надпреварата до дъното унищожава стойност. Конкуренцията чрез диференциация е по-устойчива от ценовата.',
      },
    ],
  },
  {
    category: 'regulation_change',
    events: [
      {
        title: 'New Data Privacy Law',
        description: 'Government introduces strict data privacy regulations. You must invest in compliance or face heavy fines.',
        kpi_effects: { compliance_risk: 20, burn_rate: 1000, tech_debt: 8, product_quality: -3 },
        category: 'regulation_change',
        severity: 4,
        concept_lesson: '💡 Regulatory Resilience: Regulations aren\'t just threats — they\'re opportunities. Companies that lead in compliance build trust and competitive moats.',
        concept_lesson_bg: '💡 Регулаторна устойчивост: Регулациите не са само заплахи — те са възможности. Лидерите в съответствието изграждат доверие.',
      },
      {
        title: 'Tax Policy Change',
        description: 'A new digital services tax applies to startups above a revenue threshold. Your cost structure needs adjustment.',
        kpi_effects: { burn_rate: 600, revenue: -200, compliance_risk: 10 },
        category: 'regulation_change',
        severity: 2,
        concept_lesson: '💡 Strategic Agility: The best-prepared companies have scenario plans for regulatory changes. Proactive planning beats reactive scrambling.',
        concept_lesson_bg: '💡 Стратегическа гъвкавост: Най-подготвените компании имат сценарийни планове. Проактивното планиране побеждава реактивното.',
      },
    ],
  },
  {
    category: 'tech_disruption',
    events: [
      {
        title: 'AI Breakthrough Disrupts Industry',
        description: 'A new AI model makes a core part of your product obsolete. Users wonder if your solution is still relevant.',
        kpi_effects: { nps: -8, churn_rate: 0.02, product_quality: -5, tech_debt: 10 },
        category: 'tech_disruption',
        severity: 4,
        concept_lesson: '💡 Innovation Imperative: In Kotler\'s Chaotics framework, technology disruption is the biggest source of market turbulence. Companies must build "early warning systems" and pivot quickly.',
        concept_lesson_bg: '💡 Императив за иновации: Във рамката Chaotics на Котлър, технологичното разрушаване е най-големият източник на турбулентност.',
      },
      {
        title: 'Platform Dependency Crisis',
        description: 'The platform you built on (app store, social media API) changes its terms. Your distribution channel is disrupted.',
        kpi_effects: { users_total: -40, active_users: -25, cac: 10, burn_rate: 500 },
        category: 'tech_disruption',
        severity: 3,
        concept_lesson: '💡 Platform Risk: Building on someone else\'s platform means playing by their rules. Diversify distribution channels to reduce single-point-of-failure risk.',
        concept_lesson_bg: '💡 Платформен риск: Изграждането върху чужда платформа означава игра по техните правила. Диверсифицирайте каналите за разпространение.',
      },
    ],
  },
];

/**
 * Randomly select a turbulence event based on the current week and stability.
 * Higher weeks = higher chance of turbulence.
 * Lower stability = more severe events possible.
 */
export function rollTurbulenceEvent(
  weekNumber: number,
  currentStability: number,
  excludeCategories: TurbulenceCategory[] = []
): ShockEvent | undefined {
  // Probability increases: week 1 = 20%, week 6 = 70%
  const baseProbability = 0.15 + weekNumber * 0.09;
  // Low stability increases probability
  const stabilityModifier = (100 - currentStability) / 200;
  const totalProbability = Math.min(baseProbability + stabilityModifier, 0.85);

  if (Math.random() > totalProbability) return undefined;

  // Filter available pools
  const availablePools = TURBULENCE_POOLS.filter(
    p => !excludeCategories.includes(p.category)
  );
  if (availablePools.length === 0) return undefined;

  const pool = availablePools[Math.floor(Math.random() * availablePools.length)];
  const event = pool.events[Math.floor(Math.random() * pool.events.length)];

  // Scale severity based on stability — lower stability = harder hits
  if (currentStability < 40) {
    const amplifier = 1 + (40 - currentStability) / 100;
    const amplifiedEffects: Partial<typeof event.kpi_effects> = {};
    for (const [key, val] of Object.entries(event.kpi_effects)) {
      amplifiedEffects[key as keyof typeof event.kpi_effects] = Math.round((val as number) * amplifier);
    }
    return { ...event, kpi_effects: amplifiedEffects };
  }

  return event;
}

/**
 * Calculate new stability score after a round.
 * Stability decreases with shock events and recovers slightly each round without shocks.
 */
export function calculateStability(
  previousStability: number,
  hadShockEvent: boolean,
  eventSeverity: number = 0
): number {
  if (hadShockEvent) {
    const drop = eventSeverity * 8 + Math.random() * 5;
    return Math.max(0, Math.round(previousStability - drop));
  }
  // Recovery: +5-10 stability per calm round
  const recovery = 5 + Math.random() * 5;
  return Math.min(100, Math.round(previousStability + recovery));
}
