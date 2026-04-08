export interface SimWeekKPIs {
  innovation: number;       // 0-100
  marketPotential: number;  // 0-100
  scalability: number;      // 0-100
  riskLevel: number;        // 0-100 (lower is better)
  growthPotential: number;  // 0-100
}

/** Financial KPIs derived from strategic KPIs + choices */
export interface FinancialKPIs {
  revenue: number;         // €/month
  costs: number;           // €/month
  burnRate: number;        // €/month (costs - revenue)
  breakEvenMonth: number;  // estimated month to break even
  engagement: number;      // % (0-100)
  retention: number;       // % (0-100)
  revenuePerUser: number;  // €
  totalUsers: number;
}

export interface SimDecisionOption {
  id: string;
  labelEn: string;
  labelBg: string;
  descEn: string;
  descBg: string;
  effects: Partial<SimWeekKPIs>;
  /** Optional financial effects */
  financialEffects?: Partial<FinancialKPIs>;
}

export interface SimDecision {
  questionEn: string;
  questionBg: string;
  multiSelect?: boolean;
  multiSelectHintEn?: string;
  multiSelectHintBg?: string;
  options: SimDecisionOption[];
}

export interface SimWeek {
  week: number;
  titleEn: string;
  titleBg: string;
  descEn: string;
  descBg: string;
  icon: string;
  theoryConceptEn?: string;
  theoryConceptBg?: string;
  decisions: SimDecision[];
}

export const INITIAL_KPIS: SimWeekKPIs = {
  innovation: 20,
  marketPotential: 20,
  scalability: 20,
  riskLevel: 50,
  growthPotential: 20,
};

export const INITIAL_FINANCIAL: FinancialKPIs = {
  revenue: 0,
  costs: 2000,
  burnRate: 2000,
  breakEvenMonth: 24,
  engagement: 0,
  retention: 0,
  revenuePerUser: 0,
  totalUsers: 0,
};

// ─── MVP VALIDATION DECISION (Step 4A — new) ───
export const MVP_VALIDATION_DECISION: SimDecision = {
  questionEn: 'How will you validate your idea before building?',
  questionBg: 'Как ще валидираш идеята си преди да строиш?',
  options: [
    {
      id: 's4-smoketest',
      labelEn: 'C) Test without a product — "Smoke test"',
      labelBg: 'C) Тествай без продукт — „Smoke test"',
      descEn: 'Landing page + Google Ads. Measure clicks. 1 week, €500. You learn: Is there demand? You DON\'T learn: Does the product work.',
      descBg: 'Landing page + Google Ads. Измерваш кликове. 1 седмица, €500. Научаваш: Има ли търсене? НЕ научаваш: Дали продуктът работи.',
      effects: { riskLevel: -15, growthPotential: 5 },
      financialEffects: { costs: -500, engagement: 10 },
    },
    {
      id: 's4-mvp',
      labelEn: 'B) Build an MVP — Minimum Viable Product',
      labelBg: 'B) Изгради MVP — Минимален жизнеспособен продукт',
      descEn: 'Only core feature. Everything else → later. 6-8 weeks, €8,000-€15,000. You learn: Do people use it? You DON\'T learn: Will they pay.',
      descBg: 'Само core feature. Всичко друго → по-късно. 6-8 седмици, €8,000-€15,000. Научаваш: Дали хората го използват? НЕ научаваш: Дали ще платят.',
      effects: { innovation: 5, scalability: 5, riskLevel: -5 },
      financialEffects: { costs: 3000, engagement: 25, retention: 15 },
    },
    {
      id: 's4-fullproduct',
      labelEn: 'A) Build a full product',
      labelBg: 'A) Изгради пълен продукт',
      descEn: 'All features from day one. 6-12 months, €50K-€200K. You learn: Everything — but AFTER you\'ve spent everything. If the product fails → no money to pivot.',
      descBg: 'Всички функции от първия ден. 6-12 месеца, €50K-€200K. Научаваш: Всичко — но СЛЕД като си похарчил всичко. Ако продуктът се провали → нямаш пари за пивот.',
      effects: { innovation: 10, riskLevel: 25, scalability: 10 },
      financialEffects: { costs: 12000, engagement: 40, retention: 30, totalUsers: 50 },
    },
  ],
};

/** Consequence feedback per MVP choice */
export const MVP_CONSEQUENCES: Record<string, { en: string; bg: string; kpiLabel: string }> = {
  's4-smoketest': {
    en: '✅ Smart move. You\'re in good company — Dropbox tested with a video before writing a line of code. 75,000 signups in 1 night.',
    bg: '✅ Умен ход. Ти си в добра компания — Dropbox тестваха с видео преди да напишат ред код. 75,000 записвания за 1 нощ.',
    kpiLabel: 'Risk -15 | Speed +20 | Cost -30',
  },
  's4-mvp': {
    en: '✅ Lean approach. Zappos sold shoes without a warehouse before building logistics. Validating before building.',
    bg: '✅ Lean подход. Zappos продаваха обувки без склад преди да изградят логистиката. Validating before building.',
    kpiLabel: 'Balanced approach',
  },
  's4-fullproduct': {
    en: '⚠️ Risky bet. 9 out of 10 startups that built a full product without validation pivoted or failed.',
    bg: '⚠️ Рискован залог. 9 от 10 стартъпа, строили пълен продукт без валидация, са пивотирали или фалирали.',
    kpiLabel: 'Risk +25 | Cost +40',
  },
};

export const SIM_WEEKS: SimWeek[] = [
  // Step 1 – Industry Selection
  {
    week: 1,
    titleEn: 'Industry Selection',
    titleBg: 'Избор на индустрия',
    descEn: 'Choose the industry your startup will operate in. Each industry has different innovation dynamics, market sizes, and risk profiles.',
    descBg: 'Изберете индустрията, в която ще работи вашият стартъп. Всяка индустрия има различна динамика на иновациите, размер на пазара и рисков профил.',
    icon: '🏭',
    theoryConceptEn: 'Digital Ecosystems',
    theoryConceptBg: 'Дигитални екосистеми',
    decisions: [
      {
        questionEn: 'Which industry will your startup target?',
        questionBg: 'В коя индустрия ще работи вашият стартъп?',
        options: [
          { id: 's1-fintech', labelEn: 'FinTech', labelBg: 'FinTech', descEn: 'Financial technology — payments, lending, crypto, insurance. Large market, heavy regulation.', descBg: 'Финансови технологии — плащания, кредитиране, крипто, застраховане. Голям пазар, тежка регулация.', effects: { innovation: 15, marketPotential: 20, scalability: 15, riskLevel: 15, growthPotential: 18 } },
          { id: 's1-healthtech', labelEn: 'HealthTech', labelBg: 'HealthTech', descEn: 'Healthcare technology — diagnostics, telemedicine, health data. High impact, long sales cycles.', descBg: 'Здравни технологии — диагностика, телемедицина, здравни данни. Голямо въздействие, дълги цикли на продажба.', effects: { innovation: 20, marketPotential: 18, scalability: 10, riskLevel: 10, growthPotential: 15 } },
          { id: 's1-edtech', labelEn: 'EdTech', labelBg: 'EdTech', descEn: 'Education technology — online learning, LMS, skill platforms. Growing fast post-pandemic.', descBg: 'Образователни технологии — онлайн обучение, LMS, платформи за умения. Бърз растеж след пандемията.', effects: { innovation: 12, marketPotential: 15, scalability: 18, riskLevel: -5, growthPotential: 16 } },
          { id: 's1-smartcities', labelEn: 'Smart Cities', labelBg: 'Умни градове', descEn: 'Urban technology — IoT, mobility, energy, digital twins. Complex B2G sales, massive impact.', descBg: 'Градски технологии — IoT, мобилност, енергия, цифрови двойници. Сложни B2G продажби, огромно въздействие.', effects: { innovation: 22, marketPotential: 14, scalability: 12, riskLevel: 18, growthPotential: 12 } },
          { id: 's1-ecommerce', labelEn: 'E-commerce', labelBg: 'Електронна търговия', descEn: 'Online retail — marketplaces, D2C, logistics. Massive market, fierce competition.', descBg: 'Онлайн търговия — маркетплейси, D2C, логистика. Огромен пазар, жестока конкуренция.', effects: { innovation: 10, marketPotential: 22, scalability: 20, riskLevel: 8, growthPotential: 20 } },
        ],
      },
    ],
  },
  // Step 2 – Problem Definition
  {
    week: 2,
    titleEn: 'Problem Definition',
    titleBg: 'Дефиниране на проблема',
    descEn: 'Define the problem your startup solves. The best startups solve real, urgent, and widespread problems.',
    descBg: 'Дефинирайте проблема, който вашият стартъп решава. Най-добрите стартъпи решават реални, неотложни и широко разпространени проблеми.',
    icon: '🎯',
    decisions: [
      {
        questionEn: 'How significant is the problem you are solving?',
        questionBg: 'Колко значителен е проблемът, който решавате?',
        options: [
          { id: 's2-critical', labelEn: 'Critical pain point', labelBg: 'Критичен проблем', descEn: 'Life-or-death problem. Customers urgently need a solution and will pay premium.', descBg: 'Проблем от критично значение. Клиентите спешно се нуждаят от решение и ще платят премия.', effects: { innovation: 8, marketPotential: 15, riskLevel: 5, growthPotential: 12 } },
          { id: 's2-important', labelEn: 'Important improvement', labelBg: 'Важно подобрение', descEn: 'Significant inefficiency. Clear value, moderate urgency.', descBg: 'Значителна неефективност. Ясна стойност, умерена спешност.', effects: { innovation: 5, marketPotential: 10, scalability: 5, riskLevel: -5, growthPotential: 8 } },
          { id: 's2-nicetohave', labelEn: 'Nice-to-have convenience', labelBg: 'Приятно удобство', descEn: 'Makes life easier but not essential. Hard to monetize, easy to adopt.', descBg: 'Улеснява живота, но не е от съществено значение. Трудно за монетизиране, лесно за приемане.', effects: { marketPotential: 5, scalability: 8, riskLevel: -10, growthPotential: 5 } },
        ],
      },
      {
        questionEn: 'How many people face this problem?',
        questionBg: 'Колко хора се сблъскват с този проблем?',
        options: [
          { id: 's2-millions', labelEn: 'Millions globally', labelBg: 'Милиони по света', descEn: 'Massive TAM. Strong investor appeal but intense competition.', descBg: 'Огромен TAM. Силен интерес от инвеститори, но интензивна конкуренция.', effects: { marketPotential: 15, scalability: 10, riskLevel: 10, growthPotential: 12 } },
          { id: 's2-thousands', labelEn: 'Thousands in a niche', labelBg: 'Хиляди в ниша', descEn: 'Focused market. Easier to dominate, harder to scale beyond.', descBg: 'Фокусиран пазар. По-лесно за доминиране, по-трудно за мащабиране.', effects: { marketPotential: 8, scalability: 3, riskLevel: -8, growthPotential: 5 } },
          { id: 's2-enterprises', labelEn: 'Specific enterprises', labelBg: 'Конкретни предприятия', descEn: 'B2B niche. High contract values, long sales cycles, fewer customers.', descBg: 'B2B ниша. Високи стойности на договорите, дълги цикли на продажба, по-малко клиенти.', effects: { marketPotential: 10, scalability: 5, riskLevel: 3, growthPotential: 7 } },
        ],
      },
    ],
  },
  // Step 3 – Competitor Analysis
  {
    week: 3,
    titleEn: 'Competitor Analysis',
    titleBg: 'Анализ на конкурентите',
    descEn: 'Identify your competitive landscape and choose how you will differentiate. Strategy is about making distinct choices.',
    descBg: 'Идентифицирайте конкурентната среда и изберете как ще се разграничите. Стратегията е свързана с правене на ясни избори.',
    icon: '⚔️',
    theoryConceptEn: 'Platform Business Models',
    theoryConceptBg: 'Платформени бизнес модели',
    decisions: [
      {
        questionEn: 'How crowded is your market?',
        questionBg: 'Колко наситен е вашият пазар?',
        options: [
          { id: 's3-blue', labelEn: 'Blue ocean — no direct competitors', labelBg: 'Син океан — без преки конкуренти', descEn: 'First mover advantage but must educate the market.', descBg: 'Предимство на първия навлизащ, но трябва да обучите пазара.', effects: { innovation: 15, marketPotential: 5, riskLevel: 12, growthPotential: 10 } },
          { id: 's3-moderate', labelEn: 'Moderate competition — 3-5 players', labelBg: 'Умерена конкуренция — 3-5 играча', descEn: 'Validated market with room for differentiation.', descBg: 'Валидиран пазар с място за диференциация.', effects: { innovation: 5, marketPotential: 10, scalability: 5, riskLevel: -3, growthPotential: 8 } },
          { id: 's3-red', labelEn: 'Red ocean — dominated by incumbents', labelBg: 'Червен океан — доминиран от установени играчи', descEn: 'Proven demand but must compete on execution and innovation.', descBg: 'Доказано търсене, но трябва да се конкурирате с изпълнение и иновации.', effects: { marketPotential: 12, scalability: 8, riskLevel: 8, growthPotential: 5 } },
        ],
      },
      {
        questionEn: 'What is your primary differentiation strategy?',
        questionBg: 'Каква е вашата основна стратегия за диференциация?',
        options: [
          { id: 's3-tech', labelEn: 'Technology superiority', labelBg: 'Технологично превъзходство', descEn: 'Better tech creates barriers to entry. High R&D cost.', descBg: 'По-добрата технология създава бариери за навлизане. Висока R&D цена.', effects: { innovation: 15, scalability: 8, riskLevel: 5, growthPotential: 8 } },
          { id: 's3-ux', labelEn: 'Superior user experience', labelBg: 'Превъзходно потребителско изживяване', descEn: 'Make it 10x easier to use. Lower barrier, faster adoption.', descBg: 'Направете го 10 пъти по-лесно за използване. По-ниска бариера, по-бързо приемане.', effects: { innovation: 8, marketPotential: 5, scalability: 5, riskLevel: -5, growthPotential: 12 } },
          { id: 's3-cost', labelEn: 'Cost leadership', labelBg: 'Ценово лидерство', descEn: 'Undercut competitors on price. Thin margins, high volume.', descBg: 'Подбийте конкурентите по цена. Тънки маржове, голям обем.', effects: { marketPotential: 10, scalability: 10, riskLevel: 3, growthPotential: 10 } },
          { id: 's3-niche', labelEn: 'Niche specialization', labelBg: 'Нишова специализация', descEn: 'Own a specific vertical or segment completely.', descBg: 'Притежавайте напълно конкретен вертикал или сегмент.', effects: { innovation: 5, marketPotential: 8, riskLevel: -8, growthPotential: 5 } },
        ],
      },
    ],
  },
  // Step 4 – MVP Validation + Product Type (upgraded)
  {
    week: 4,
    titleEn: 'Product Validation & Type',
    titleBg: 'Валидация и тип на продукта',
    descEn: 'First, choose how to validate your idea. Then pick the product type. The Lean Startup method says: validate before you build.',
    descBg: 'Първо, избери как да валидираш идеята. После избери типа продукт. Lean Startup методът казва: валидирай преди да строиш.',
    icon: '🛠️',
    theoryConceptEn: 'Product-Market Fit',
    theoryConceptBg: 'Продукт-пазар фит',
    decisions: [
      // 4A: MVP Validation — inserted first
      MVP_VALIDATION_DECISION,
      // 4B: Product type — kept from original
      {
        questionEn: 'What type of digital product will you build? (Select all that apply)',
        questionBg: 'Какъв тип дигитален продукт ще създадете? (изберете всички приложими)',
        multiSelect: true,
        multiSelectHintEn: 'Hybrid product architecture detected — combining product types can increase innovation and scalability.',
        multiSelectHintBg: 'Засечена хибридна архитектура — комбинирането на типове продукти може да увеличи иновацията и мащабируемостта.',
        options: [
          { id: 's4-mobile', labelEn: 'Mobile App', labelBg: 'Мобилно приложение', descEn: 'Native mobile experience. Great engagement, push notifications, location features.', descBg: 'Нативно мобилно изживяване. Страхотна ангажираност, push нотификации, локационни функции.', effects: { innovation: 5, scalability: 8, riskLevel: 3, growthPotential: 10 } },
          { id: 's4-saas', labelEn: 'SaaS Platform', labelBg: 'SaaS платформа', descEn: 'Cloud-based software. Recurring revenue, high scalability, enterprise appeal.', descBg: 'Облачен софтуер. Повтарящи се приходи, висока мащабируемост, корпоративен интерес.', effects: { innovation: 8, marketPotential: 5, scalability: 15, riskLevel: -3, growthPotential: 8 } },
          { id: 's4-ai', labelEn: 'AI Tool', labelBg: 'AI инструмент', descEn: 'Leverage machine learning and AI for automation, prediction, or generation.', descBg: 'Използвайте машинно обучение и AI за автоматизация, прогнозиране или генериране.', effects: { innovation: 18, marketPotential: 8, scalability: 5, riskLevel: 8, growthPotential: 12 } },
          { id: 's4-marketplace', labelEn: 'Marketplace', labelBg: 'Маркетплейс', descEn: 'Connect buyers and sellers. Network effects drive exponential growth.', descBg: 'Свържете купувачи и продавачи. Мрежовите ефекти движат експоненциален растеж.', effects: { innovation: 5, marketPotential: 12, scalability: 12, riskLevel: 5, growthPotential: 15 } },
        ],
      },
    ],
  },
  // Step 5 – Business Model
  {
    week: 5,
    titleEn: 'Business Model',
    titleBg: 'Бизнес модел',
    descEn: 'Design how your startup will generate revenue. The best startups often combine multiple revenue streams to diversify risk.',
    descBg: 'Проектирайте как вашият стартъп ще генерира приходи. Най-добрите стартъпи често комбинират множество приходни потоци.',
    icon: '💰',
    theoryConceptEn: 'Customer Acquisition Cost',
    theoryConceptBg: 'Цена за привличане на клиент',
    decisions: [
      {
        questionEn: 'How will your startup make money? (Select all that apply)',
        questionBg: 'Как вашият стартъп ще печели пари? (изберете всички приложими)',
        multiSelect: true,
        multiSelectHintEn: 'Multi-revenue strategy detected — diversifying revenue streams reduces risk and increases valuation.',
        multiSelectHintBg: 'Засечена мулти-приходна стратегия — диверсификацията на приходите намалява риска и увеличава оценката.',
        options: [
          { id: 's5-subscription', labelEn: 'Subscription', labelBg: 'Абонамент', descEn: 'Monthly or yearly recurring revenue. Predictable and investor-friendly.', descBg: 'Месечни или годишни повтарящи се приходи. Предвидими и привлекателни за инвеститори.', effects: { scalability: 10, riskLevel: -8, growthPotential: 8, marketPotential: 5 } },
          { id: 's5-freemium', labelEn: 'Freemium', labelBg: 'Freemium', descEn: 'Free basic tier, paid premium. Maximizes adoption, tricky conversion.', descBg: 'Безплатен базов план, платен премиум. Максимално приемане, трудна конверсия.', effects: { marketPotential: 10, scalability: 8, riskLevel: 3, growthPotential: 12 } },
          { id: 's5-payperuse', labelEn: 'Pay-per-use', labelBg: 'Плащане при ползване', descEn: 'Users pay only for what they consume. Fair pricing, variable revenue.', descBg: 'Потребителите плащат само за това, което консумират. Справедлива цена, променливи приходи.', effects: { marketPotential: 5, scalability: 5, riskLevel: -3, growthPotential: 5 } },
          { id: 's5-commission', labelEn: 'Marketplace commission', labelBg: 'Комисиона от маркетплейс', descEn: 'Take a cut of each transaction. Scales with platform volume.', descBg: 'Вземете процент от всяка транзакция. Мащабира с обема на платформата.', effects: { scalability: 12, marketPotential: 8, riskLevel: 5, growthPotential: 10 } },
          { id: 's5-ads', labelEn: 'Advertising', labelBg: 'Рекламен модел', descEn: 'Monetize through ads. Needs massive user base, low user satisfaction.', descBg: 'Монетизирайте чрез реклами. Нуждае се от огромна потребителска база.', effects: { marketPotential: 5, scalability: 5, riskLevel: 8, growthPotential: 3 } },
        ],
      },
    ],
  },
  // Step 6 – Marketing Strategy
  {
    week: 6,
    titleEn: 'Marketing Strategy',
    titleBg: 'Маркетингова стратегия',
    descEn: 'Choose how you will acquire customers and grow your startup. The best founders use a strategic mix of channels.',
    descBg: 'Изберете как ще привлечете клиенти и ще развиете стартъпа. Най-добрите основатели използват стратегически микс от канали.',
    icon: '📣',
    theoryConceptEn: 'Network Effects',
    theoryConceptBg: 'Мрежови ефекти',
    decisions: [
      {
        questionEn: 'Which marketing channels will you use? (Select all that apply)',
        questionBg: 'Кои маркетингови канали ще използвате? (изберете всички приложими)',
        multiSelect: true,
        multiSelectHintEn: 'Multi-channel strategy detected — using diverse channels accelerates growth and reduces dependency on any single channel.',
        multiSelectHintBg: 'Засечена мулти-канална стратегия — разнообразните канали ускоряват растежа.',
        options: [
          { id: 's6-social', labelEn: 'Social Media', labelBg: 'Социални медии', descEn: 'Organic content on Instagram, TikTok, LinkedIn. Low cost, slow build.', descBg: 'Органично съдържание в Instagram, TikTok, LinkedIn. Ниска цена, бавно изграждане.', effects: { marketPotential: 5, growthPotential: 8, riskLevel: -3 } },
          { id: 's6-influencers', labelEn: 'Influencers', labelBg: 'Инфлуенсъри', descEn: 'Partner with creators for fast brand awareness. Expensive but impactful.', descBg: 'Партнирайте с криейтъри за бързо разпознаване. Скъпо, но ефективно.', effects: { marketPotential: 8, growthPotential: 12, riskLevel: 5 } },
          { id: 's6-seo', labelEn: 'SEO', labelBg: 'SEO', descEn: 'Organic search traffic. Takes time but compounds over time.', descBg: 'Органичен трафик от търсачки. Отнема време, но се натрупва.', effects: { scalability: 5, growthPotential: 6, riskLevel: -5 } },
          { id: 's6-partnerships', labelEn: 'Partnerships', labelBg: 'Партньорства', descEn: 'Strategic alliances for distribution and credibility.', descBg: 'Стратегически съюзи за дистрибуция и доверие.', effects: { marketPotential: 8, scalability: 5, riskLevel: -3, growthPotential: 7 } },
          { id: 's6-paidads', labelEn: 'Paid Ads', labelBg: 'Платени реклами', descEn: 'Pay for immediate visibility. Expensive, measurable, fast.', descBg: 'Платете за незабавна видимост. Скъпо, измеримо, бързо.', effects: { marketPotential: 5, growthPotential: 15, riskLevel: 8 } },
        ],
      },
    ],
  },
];

// ─── CYCLE 2/3 DECISION GENERATORS ───
export interface CycleDecision {
  titleEn: string;
  titleBg: string;
  descEn: string;
  descBg: string;
  decision: SimDecision;
}

const CYCLE_DECISIONS_BY_WEAKNESS: Record<string, CycleDecision[]> = {
  scalability: [
    {
      titleEn: 'Product Architecture', titleBg: 'Архитектура на продукта',
      descEn: 'Your scalability is low. How will you architect for growth?',
      descBg: 'Мащабируемостта ти е ниска. Как ще архитектираш за растеж?',
      decision: {
        questionEn: 'How will you architect your product for scale?',
        questionBg: 'Как ще архитектираш продукта за мащаб?',
        options: [
          { id: 'c2-monolith', labelEn: 'Monolith — ship fast', labelBg: 'Монолит — пускай бързо', descEn: 'Single codebase. Fast to build, hard to scale later.', descBg: 'Една кодова база. Бърза за изграждане, трудна за мащабиране.', effects: { scalability: 5, riskLevel: 5, growthPotential: 8 } },
          { id: 'c2-micro', labelEn: 'Microservices — build for scale', labelBg: 'Микросервизи — строй за мащаб', descEn: 'Distributed services. Slower to build, scales infinitely.', descBg: 'Разпределени услуги. По-бавни за изграждане, мащабират безкрайно.', effects: { scalability: 18, riskLevel: -5, innovation: 5 } },
          { id: 'c2-serverless', labelEn: 'Serverless — pay per use', labelBg: 'Serverless — плати при ползване', descEn: 'Zero infrastructure management. Auto-scales, pay only for usage.', descBg: 'Нулево управление на инфраструктура. Авто-мащабиране, плащаш само за използване.', effects: { scalability: 15, riskLevel: -8, growthPotential: 5 } },
        ],
      },
    },
    {
      titleEn: 'Team Structure', titleBg: 'Структура на екипа',
      descEn: 'Your team needs to support scaling.',
      descBg: 'Екипът ти трябва да поддържа мащабирането.',
      decision: {
        questionEn: 'How will you structure your team for growth?',
        questionBg: 'Как ще структурираш екипа за растеж?',
        options: [
          { id: 'c2-generalists', labelEn: 'Generalists — flexible', labelBg: 'Генералисти — гъвкави', descEn: 'Everyone does everything. Great for 0→1, poor for 1→100.', descBg: 'Всеки прави всичко. Страхотно за 0→1, слабо за 1→100.', effects: { scalability: 5, riskLevel: -3, innovation: 5 } },
          { id: 'c2-specialists', labelEn: 'Specialists — deep expertise', labelBg: 'Специалисти — дълбока експертиза', descEn: 'Hire experts in each area. Expensive but efficient at scale.', descBg: 'Наемане на експерти. Скъпо, но ефективно при мащаб.', effects: { scalability: 12, innovation: 8, riskLevel: 3 } },
          { id: 'c2-hybrid', labelEn: 'Hybrid — T-shaped team', labelBg: 'Хибрид — Т-образен екип', descEn: 'Broad knowledge + one deep skill each. Best of both worlds.', descBg: 'Широко знание + едно дълбоко умение всеки. Най-доброто от двата свята.', effects: { scalability: 10, innovation: 5, riskLevel: -5, growthPotential: 5 } },
        ],
      },
    },
    {
      titleEn: 'Infrastructure', titleBg: 'Инфраструктура',
      descEn: 'Build or buy your infrastructure?',
      descBg: 'Строиш или купуваш инфраструктурата?',
      decision: {
        questionEn: 'How will you handle infrastructure?',
        questionBg: 'Как ще се справиш с инфраструктурата?',
        options: [
          { id: 'c2-build', labelEn: 'Build everything in-house', labelBg: 'Строй всичко вътрешно', descEn: 'Full control. High cost, high customization.', descBg: 'Пълен контрол. Висока цена, висока персонализация.', effects: { scalability: 8, riskLevel: 10, innovation: 8 } },
          { id: 'c2-buy', labelEn: 'Use managed services', labelBg: 'Използвай managed услуги', descEn: 'AWS/GCP/Azure. Lower risk, faster time to market.', descBg: 'AWS/GCP/Azure. По-нисък риск, по-бързо на пазара.', effects: { scalability: 15, riskLevel: -10, growthPotential: 5 } },
        ],
      },
    },
  ],
  innovation: [
    {
      titleEn: 'R&D Investment', titleBg: 'Инвестиция в R&D',
      descEn: 'Your innovation score is low. Invest in R&D?',
      descBg: 'Иновационният ти резултат е нисък. Инвестираш ли в R&D?',
      decision: {
        questionEn: 'How much will you invest in R&D?',
        questionBg: 'Колко ще инвестираш в R&D?',
        options: [
          { id: 'c2-rd-heavy', labelEn: 'Heavy R&D (30% of budget)', labelBg: 'Тежък R&D (30% от бюджета)', descEn: 'Major innovation push. Risky but game-changing.', descBg: 'Голям иновационен тласък. Рисков, но промяна на играта.', effects: { innovation: 20, riskLevel: 8, growthPotential: 10 } },
          { id: 'c2-rd-moderate', labelEn: 'Moderate R&D (15%)', labelBg: 'Умерен R&D (15%)', descEn: 'Balanced approach. Steady innovation.', descBg: 'Балансиран подход. Стабилна иновация.', effects: { innovation: 12, riskLevel: -3, growthPotential: 5 } },
          { id: 'c2-rd-acquire', labelEn: 'Acquire innovation', labelBg: 'Придоби иновация', descEn: 'Buy a startup or license tech. Fast but expensive.', descBg: 'Купи стартъп или лицензирай технология. Бързо, но скъпо.', effects: { innovation: 15, scalability: 5, riskLevel: 5 } },
        ],
      },
    },
    {
      titleEn: 'AI Integration', titleBg: 'AI Интеграция',
      descEn: 'Can AI boost your product?',
      descBg: 'Може ли AI да подобри продукта ти?',
      decision: {
        questionEn: 'How will you use AI in your product?',
        questionBg: 'Как ще използваш AI в продукта?',
        options: [
          { id: 'c2-ai-core', labelEn: 'AI as core product', labelBg: 'AI като основен продукт', descEn: 'AI is the product. High differentiation, high complexity.', descBg: 'AI е продуктът. Висока диференциация, висока сложност.', effects: { innovation: 18, riskLevel: 8, scalability: 5 } },
          { id: 'c2-ai-feature', labelEn: 'AI as feature', labelBg: 'AI като функция', descEn: 'Add AI to existing product. Lower risk, moderate impact.', descBg: 'Добави AI към съществуващ продукт. Нисък риск, умерено въздействие.', effects: { innovation: 10, riskLevel: -3, growthPotential: 5 } },
          { id: 'c2-ai-ops', labelEn: 'AI for operations only', labelBg: 'AI само за операции', descEn: 'Use AI internally. Reduces costs, no visible differentiation.', descBg: 'Използвай AI вътрешно. Намалява разходите, без видима диференциация.', effects: { innovation: 5, riskLevel: -5, scalability: 5 } },
        ],
      },
    },
    {
      titleEn: 'IP Strategy', titleBg: 'IP Стратегия',
      descEn: 'Protect your innovation.',
      descBg: 'Защити иновацията си.',
      decision: {
        questionEn: 'How will you protect your competitive advantage?',
        questionBg: 'Как ще защитиш конкурентното си предимство?',
        options: [
          { id: 'c2-ip-patent', labelEn: 'File patents', labelBg: 'Подай патенти', descEn: 'Legal protection. Expensive, slow, but strong defense.', descBg: 'Правна защита. Скъпо, бавно, но силна защита.', effects: { innovation: 8, riskLevel: -8, scalability: 3 } },
          { id: 'c2-ip-speed', labelEn: 'Speed as moat', labelBg: 'Скоростта като ров', descEn: 'Move so fast competitors can\'t catch up. Exhausting.', descBg: 'Движи се толкова бързо, че конкурентите не могат да настигнат.', effects: { innovation: 5, growthPotential: 12, riskLevel: 3 } },
          { id: 'c2-ip-network', labelEn: 'Network effects', labelBg: 'Мрежови ефекти', descEn: 'Build defensibility through user base. Winner-take-all.', descBg: 'Изгради защита чрез потребителска база. Победителят взема всичко.', effects: { innovation: 5, scalability: 10, marketPotential: 8 } },
        ],
      },
    },
  ],
  marketPotential: [
    {
      titleEn: 'Market Expansion', titleBg: 'Разширяване на пазара',
      descEn: 'Your market potential is low. How will you expand?',
      descBg: 'Пазарният ти потенциал е нисък. Как ще го разшириш?',
      decision: {
        questionEn: 'How will you expand your addressable market?',
        questionBg: 'Как ще разшириш адресируемия си пазар?',
        options: [
          { id: 'c2-geo', labelEn: 'Geographic expansion', labelBg: 'Географско разширение', descEn: 'Enter new markets/countries. Expensive but multiplies TAM.', descBg: 'Навлизане в нови пазари/страни. Скъпо, но умножава TAM.', effects: { marketPotential: 18, riskLevel: 8, growthPotential: 10 } },
          { id: 'c2-segment', labelEn: 'New customer segment', labelBg: 'Нов клиентски сегмент', descEn: 'Adapt product for a new user type. Lower risk than geo.', descBg: 'Адаптирай продукта за нов тип потребител. По-нисък риск от гео.', effects: { marketPotential: 12, riskLevel: -3, growthPotential: 8 } },
          { id: 'c2-platform', labelEn: 'Platform play', labelBg: 'Платформена стратегия', descEn: 'Open APIs, let others build on you. Exponential growth potential.', descBg: 'Отвори API-та, нека други строят върху теб. Експоненциален потенциал.', effects: { marketPotential: 15, scalability: 12, innovation: 5 } },
        ],
      },
    },
    {
      titleEn: 'Pricing Strategy', titleBg: 'Ценова стратегия',
      descEn: 'Optimize your pricing for market penetration.',
      descBg: 'Оптимизирай цената за пазарно проникване.',
      decision: {
        questionEn: 'How will you price your product?',
        questionBg: 'Как ще определиш цената на продукта?',
        options: [
          { id: 'c2-penetration', labelEn: 'Penetration pricing', labelBg: 'Цена за проникване', descEn: 'Start low, raise later. Wins market share fast.', descBg: 'Започни ниско, вдигни по-късно. Печели пазарен дял бързо.', effects: { marketPotential: 15, growthPotential: 10, riskLevel: 5 } },
          { id: 'c2-value', labelEn: 'Value-based pricing', labelBg: 'Цена базирана на стойност', descEn: 'Price based on value delivered. Higher margins, slower growth.', descBg: 'Цена базирана на доставената стойност. По-високи маржове, по-бавен растеж.', effects: { marketPotential: 8, riskLevel: -5, growthPotential: 5 } },
          { id: 'c2-dynamic', labelEn: 'Dynamic pricing', labelBg: 'Динамично ценообразуване', descEn: 'AI-driven pricing. Maximizes revenue per user.', descBg: 'AI-базирано ценообразуване. Максимизира приходи на потребител.', effects: { marketPotential: 10, innovation: 8, riskLevel: 3 } },
        ],
      },
    },
    {
      titleEn: 'Partnership Strategy', titleBg: 'Партньорска стратегия',
      descEn: 'Strategic partnerships can unlock new markets.',
      descBg: 'Стратегическите партньорства могат да отключат нови пазари.',
      decision: {
        questionEn: 'What type of strategic partnership will you pursue?',
        questionBg: 'Какъв тип стратегическо партньорство ще преследваш?',
        options: [
          { id: 'c2-corp', labelEn: 'Corporate partner', labelBg: 'Корпоративен партньор', descEn: 'Large company distribution. Credibility + reach.', descBg: 'Дистрибуция чрез голяма компания. Кредитабилност + обхват.', effects: { marketPotential: 15, riskLevel: -5, growthPotential: 8 } },
          { id: 'c2-startup', labelEn: 'Startup ecosystem', labelBg: 'Стартъп екосистема', descEn: 'Partner with complementary startups. Mutual growth.', descBg: 'Партнирай с допълващи стартъпи. Взаимен растеж.', effects: { marketPotential: 10, innovation: 5, growthPotential: 8 } },
          { id: 'c2-gov', labelEn: 'Government/institutional', labelBg: 'Правителствен/институционален', descEn: 'Public sector contracts. Slow but stable revenue.', descBg: 'Контракти с публичен сектор. Бавни, но стабилни приходи.', effects: { marketPotential: 12, riskLevel: -8, scalability: 3 } },
        ],
      },
    },
  ],
  riskLevel: [
    {
      titleEn: 'Risk Mitigation', titleBg: 'Намаляване на риска',
      descEn: 'Your risk level is too high. How will you reduce it?',
      descBg: 'Нивото ти на риск е твърде високо. Как ще го намалиш?',
      decision: {
        questionEn: 'How will you reduce your startup\'s risk?',
        questionBg: 'Как ще намалиш риска на стартъпа?',
        options: [
          { id: 'c2-diversify', labelEn: 'Revenue diversification', labelBg: 'Диверсификация на приходите', descEn: 'Add a second revenue stream. Reduces single point of failure.', descBg: 'Добави втори приходен поток. Намалява единична точка на провал.', effects: { riskLevel: -15, scalability: 5, growthPotential: 5 } },
          { id: 'c2-insurance', labelEn: 'Build financial cushion', labelBg: 'Изгради финансова възглавница', descEn: 'Raise more capital or cut costs. Safety net.', descBg: 'Набери повече капитал или намали разходите. Предпазна мрежа.', effects: { riskLevel: -12, growthPotential: -3 } },
          { id: 'c2-compliance', labelEn: 'Regulatory compliance', labelBg: 'Регулаторно съответствие', descEn: 'Invest in compliance early. Prevents future crises.', descBg: 'Инвестирай в съответствие рано. Предотвратява бъдещи кризи.', effects: { riskLevel: -18, innovation: -3, scalability: 3 } },
        ],
      },
    },
    {
      titleEn: 'Customer Retention', titleBg: 'Задържане на клиенти',
      descEn: 'Retention is key to reducing churn risk.',
      descBg: 'Задържането е ключово за намаляване на риска от отток.',
      decision: {
        questionEn: 'How will you improve customer retention?',
        questionBg: 'Как ще подобриш задържането на клиенти?',
        options: [
          { id: 'c2-loyalty', labelEn: 'Loyalty program', labelBg: 'Програма за лоялност', descEn: 'Rewards for staying. Increases switching costs.', descBg: 'Награди за оставане. Увеличава разходите за смяна.', effects: { riskLevel: -10, marketPotential: 5, growthPotential: 8 } },
          { id: 'c2-community', labelEn: 'Community building', labelBg: 'Изграждане на общност', descEn: 'User community creates emotional lock-in.', descBg: 'Потребителската общност създава емоционална обвързаност.', effects: { riskLevel: -8, scalability: 5, innovation: 3, growthPotential: 5 } },
          { id: 'c2-personalize', labelEn: 'Personalization', labelBg: 'Персонализация', descEn: 'AI-driven personalization. The more they use, the better it gets.', descBg: 'AI-базирана персонализация. Колкото повече ползват, толкова по-добро става.', effects: { riskLevel: -12, innovation: 8, growthPotential: 5 } },
        ],
      },
    },
    {
      titleEn: 'Data Security', titleBg: 'Сигурност на данните',
      descEn: 'Data breaches can kill a startup.',
      descBg: 'Пробиви в данните могат да убият стартъп.',
      decision: {
        questionEn: 'How will you handle data security?',
        questionBg: 'Как ще се справиш със сигурността на данните?',
        options: [
          { id: 'c2-sec-max', labelEn: 'Maximum security', labelBg: 'Максимална сигурност', descEn: 'SOC2, encryption, audits. Expensive but trustworthy.', descBg: 'SOC2, криптиране, одити. Скъпо, но надеждно.', effects: { riskLevel: -15, innovation: -3, scalability: 3 } },
          { id: 'c2-sec-balanced', labelEn: 'Balanced approach', labelBg: 'Балансиран подход', descEn: 'Industry standards. Good enough for most cases.', descBg: 'Индустриални стандарти. Достатъчно за повечето случаи.', effects: { riskLevel: -8, growthPotential: 3 } },
        ],
      },
    },
  ],
  growthPotential: [
    {
      titleEn: 'Growth Hacking', titleBg: 'Хакване на растежа',
      descEn: 'Your growth potential is low. Time to hack growth.',
      descBg: 'Потенциалът ти за растеж е нисък. Време е да хакнеш растежа.',
      decision: {
        questionEn: 'What growth hack will you try?',
        questionBg: 'Какъв growth hack ще опиташ?',
        options: [
          { id: 'c2-viral', labelEn: 'Viral mechanics', labelBg: 'Вирални механики', descEn: 'Built-in sharing. K-factor > 1 = exponential growth.', descBg: 'Вградено споделяне. K-фактор > 1 = експоненциален растеж.', effects: { growthPotential: 18, scalability: 8, riskLevel: 5 } },
          { id: 'c2-content', labelEn: 'Content marketing', labelBg: 'Контент маркетинг', descEn: 'Build audience through valuable content. Slow but compounding.', descBg: 'Изгради аудитория чрез ценно съдържание. Бавно, но натрупващо.', effects: { growthPotential: 10, marketPotential: 8, riskLevel: -5 } },
          { id: 'c2-referral', labelEn: 'Referral program', labelBg: 'Реферална програма', descEn: 'Users bring users. Dropbox grew 3900% with this.', descBg: 'Потребителите довеждат потребители. Dropbox растяха с 3900% с това.', effects: { growthPotential: 15, marketPotential: 5, riskLevel: -3 } },
        ],
      },
    },
    {
      titleEn: 'Fundraising', titleBg: 'Набиране на капитал',
      descEn: 'Capital can accelerate growth.',
      descBg: 'Капиталът може да ускори растежа.',
      decision: {
        questionEn: 'How will you fund your growth?',
        questionBg: 'Как ще финансираш растежа си?',
        options: [
          { id: 'c2-vc', labelEn: 'Venture Capital', labelBg: 'Рисков капитал', descEn: 'Big money, big expectations. Give up equity for speed.', descBg: 'Големи пари, големи очаквания. Отказваш се от дялове за скорост.', effects: { growthPotential: 20, riskLevel: 10, scalability: 10 } },
          { id: 'c2-bootstrap', labelEn: 'Bootstrap', labelBg: 'Бутстрап', descEn: 'Grow with revenue. Slower but you keep control.', descBg: 'Расти с приходи. По-бавно, но пазиш контрол.', effects: { growthPotential: 8, riskLevel: -10, scalability: 3 } },
          { id: 'c2-grants', labelEn: 'Grants & EU funds', labelBg: 'Грантове и EU фондове', descEn: 'Non-dilutive capital. Slow process, great for deep tech.', descBg: 'Неразводняващ капитал. Бавен процес, страхотно за deep tech.', effects: { growthPotential: 12, riskLevel: -5, innovation: 5 } },
        ],
      },
    },
    {
      titleEn: 'International Strategy', titleBg: 'Международна стратегия',
      descEn: 'Going global can multiply your growth.',
      descBg: 'Глобализацията може да умножи растежа ти.',
      decision: {
        questionEn: 'When and how will you expand internationally?',
        questionBg: 'Кога и как ще се разширяваш международно?',
        options: [
          { id: 'c2-global-now', labelEn: 'Born global', labelBg: 'Роден глобален', descEn: 'Launch everywhere from day 1. High risk, massive potential.', descBg: 'Лансирай навсякъде от ден 1. Висок риск, огромен потенциал.', effects: { growthPotential: 15, marketPotential: 12, riskLevel: 12 } },
          { id: 'c2-global-later', labelEn: 'Dominate locally first', labelBg: 'Доминирай локално първо', descEn: 'Win home market, then expand. Lower risk.', descBg: 'Спечели домашния пазар, после се разширявай. По-нисък риск.', effects: { growthPotential: 10, riskLevel: -8, marketPotential: 5 } },
          { id: 'c2-global-partner', labelEn: 'International partnerships', labelBg: 'Международни партньорства', descEn: 'Use partners\' distribution in other countries.', descBg: 'Използвай дистрибуцията на партньори в други страни.', effects: { growthPotential: 12, marketPotential: 8, riskLevel: -3 } },
        ],
      },
    },
  ],
};

/** Get the weakest KPI key (for risk, higher = worse) */
export function getWeakestKPI(kpis: SimWeekKPIs): keyof SimWeekKPIs {
  const adjusted = {
    innovation: kpis.innovation,
    marketPotential: kpis.marketPotential,
    scalability: kpis.scalability,
    riskLevel: 100 - kpis.riskLevel, // invert: high risk = low score
    growthPotential: kpis.growthPotential,
  };
  let weakest: keyof SimWeekKPIs = 'innovation';
  let minVal = Infinity;
  for (const [key, val] of Object.entries(adjusted) as [keyof SimWeekKPIs, number][]) {
    if (val < minVal) { minVal = val; weakest = key; }
  }
  return weakest;
}

/** Get cycle decisions targeting the weakest KPI */
export function getCycleDecisions(weakestKPI: keyof SimWeekKPIs): CycleDecision[] {
  return CYCLE_DECISIONS_BY_WEAKNESS[weakestKPI] || CYCLE_DECISIONS_BY_WEAKNESS.scalability;
}

// ─── EXPERIMENT SYSTEM ───
export interface ExperimentDef {
  type: 'pricing' | 'audience' | 'landing_page' | 'interviews';
  titleEn: string;
  titleBg: string;
  costEuros: number;
  timeEn: string;
  timeBg: string;
  descEn: string;
  descBg: string;
  outcomes: {
    signal: { en: string; bg: string; effects: Partial<SimWeekKPIs> };
    inconclusive: { en: string; bg: string };
    no_traction: { en: string; bg: string; effects: Partial<SimWeekKPIs> };
  };
}

export const EXPERIMENTS: ExperimentDef[] = [
  {
    type: 'pricing',
    titleEn: '💰 A/B Price Test',
    titleBg: '💰 A/B тест на цената',
    costEuros: 500, timeEn: '2 weeks', timeBg: '2 седмици',
    descEn: 'Test €9/month vs €19/month.',
    descBg: 'Тестваш €9/месец срещу €19/месец.',
    outcomes: {
      signal: { en: 'Conversion: +8% at €9/m. Lower price wins significantly.', bg: 'Конверсия: +8% при €9/м. По-ниската цена печели значително.', effects: { marketPotential: 8, growthPotential: 5 } },
      inconclusive: { en: 'No significant difference between prices. Need a larger sample.', bg: 'Няма значима разлика между цените. Нужна е по-голяма извадка.' },
      no_traction: { en: 'Neither price point attracted users. The problem may not be pricing.', bg: 'Нито една цена не привлече потребители. Проблемът може да не е цената.', effects: { riskLevel: 5 } },
    },
  },
  {
    type: 'audience',
    titleEn: '👥 Audience Test',
    titleBg: '👥 Тест на аудиторията',
    costEuros: 300, timeEn: '1 week', timeBg: '1 седмица',
    descEn: 'Test students vs professionals.',
    descBg: 'Тестваш сред студенти vs. професионалисти.',
    outcomes: {
      signal: { en: 'Students convert 3x more than professionals. Adjust your messaging!', bg: 'Студентите конвертират 3x повече от професионалистите. Адаптирай съобщението!', effects: { marketPotential: 10, growthPotential: 5 } },
      inconclusive: { en: 'Both groups show weak signals. Try a different segmentation.', bg: 'И двете групи — слаб сигнал. Опитай различна сегментация.' },
      no_traction: { en: 'Neither group engaged. Consider if this is a real problem.', bg: 'Нито една група не се ангажира. Помисли дали това е реален проблем.', effects: { riskLevel: 8, marketPotential: -5 } },
    },
  },
  {
    type: 'landing_page',
    titleEn: '📄 Landing Page Test',
    titleBg: '📄 Landing page тест',
    costEuros: 200, timeEn: '3 days', timeBg: '3 дни',
    descEn: 'Test 2 different messages.',
    descBg: 'Тестваш 2 различни съобщения.',
    outcomes: {
      signal: { en: '"Save time" → 4.2% CTR vs "Earn more" → 1.8% CTR. Time-saving message wins!', bg: '„Спести време" → 4.2% CTR vs „Спечели повече" → 1.8% CTR. Съобщението за спестяване на време печели!', effects: { growthPotential: 8, marketPotential: 5 } },
      inconclusive: { en: 'Less than 1% difference. Both messages need work.', bg: 'По-малко от 1% разлика. И двете съобщения се нуждаят от работа.' },
      no_traction: { en: 'Both pages had <0.5% CTR. Re-think your value proposition entirely.', bg: 'И двете страници имаха <0.5% CTR. Преосмисли изцяло стойностното предложение.', effects: { riskLevel: 10 } },
    },
  },
  {
    type: 'interviews',
    titleEn: '🤝 5 Customer Interviews',
    titleBg: '🤝 5 клиентски интервюта',
    costEuros: 0, timeEn: '1 week', timeBg: '1 седмица',
    descEn: 'Talk to real potential customers.',
    descBg: 'Говориш с реални потенциални клиенти.',
    outcomes: {
      signal: { en: '"We\'d pay €X for this today" — strong buying signal from 4 of 5 interviewees.', bg: '„Бихме платили €X за това днес" — силен сигнал за покупка от 4 от 5 интервюирани.', effects: { marketPotential: 12, riskLevel: -8 } },
      inconclusive: { en: 'Mixed feedback. Some interested, some confused by the product.', bg: 'Смесена обратна връзка. Някои заинтересовани, някои объркани от продукта.' },
      no_traction: { en: '"The problem isn\'t painful enough" — pivot signal from most interviewees.', bg: '„Проблемът не е достатъчно болезнен" — сигнал за пивот от повечето интервюирани.', effects: { riskLevel: 12, marketPotential: -8 } },
    },
  },
];

/** Roll experiment result with weighted randomness */
export function rollExperimentResult(): 'signal' | 'inconclusive' | 'no_traction' {
  const roll = Math.random();
  if (roll < 0.60) return 'signal';
  if (roll < 0.85) return 'inconclusive';
  return 'no_traction';
}

// ─── FINANCIAL KPI DERIVATION ───
export function deriveFinancialKPIs(kpis: SimWeekKPIs, choices: string[]): FinancialKPIs {
  const base = { ...INITIAL_FINANCIAL };
  // Revenue scales with market potential and growth
  base.revenue = Math.round(kpis.marketPotential * 20 + kpis.growthPotential * 15);
  // Costs scale with scalability investment and risk
  base.costs = Math.round(2000 + kpis.scalability * 30 + kpis.riskLevel * 20 + kpis.innovation * 15);
  base.burnRate = Math.max(0, base.costs - base.revenue);
  base.breakEvenMonth = base.burnRate > 0 ? Math.round(base.costs * 6 / Math.max(1, base.revenue)) : 0;
  base.engagement = Math.min(100, Math.round(kpis.innovation * 0.3 + kpis.marketPotential * 0.3 + kpis.growthPotential * 0.2 + (100 - kpis.riskLevel) * 0.2));
  base.retention = Math.min(100, Math.max(0, Math.round(base.engagement * 0.7 - kpis.riskLevel * 0.15)));
  base.revenuePerUser = base.totalUsers > 0 ? Math.round(base.revenue / base.totalUsers) : Math.round(kpis.marketPotential * 0.5);
  base.totalUsers = Math.round(kpis.marketPotential * 2 + kpis.growthPotential * 1.5);
  return base;
}

// ─── INSIGHT GENERATOR ───
export function generateCycleInsight(
  kpis: SimWeekKPIs,
  financial: FinancialKPIs,
  lang: 'en' | 'bg',
): { insight: string; weakest: keyof SimWeekKPIs } {
  const weakest = getWeakestKPI(kpis);
  const insights: Record<keyof SimWeekKPIs, { en: string; bg: string }> = {
    scalability: {
      en: `Your scalability score of ${kpis.scalability} is critically low. Industry benchmark is 60+. The main reason: your product architecture can't handle 10x growth without a rewrite. In Cycle 2, you can test alternatives.`,
      bg: `Мащабируемостта ти от ${kpis.scalability} е критично ниска. Индустриалният benchmark е 60+. Главната причина: архитектурата на продукта ти не може да издържи 10x растеж без пренаписване. В Цикъл 2 можеш да тестваш алтернативи.`,
    },
    innovation: {
      en: `Your innovation score of ${kpis.innovation} is below average. Without differentiation, you're competing on price alone — a race to the bottom. In Cycle 2, you can invest in R&D or AI.`,
      bg: `Иновацията ти от ${kpis.innovation} е под средното. Без диференциация се конкурираш само по цена — надпревара към дъното. В Цикъл 2 можеш да инвестираш в R&D или AI.`,
    },
    marketPotential: {
      en: `Your market potential of ${kpis.marketPotential} is limited. Your TAM may be too small or your positioning too narrow. In Cycle 2, you can expand geographically or target new segments.`,
      bg: `Пазарният ти потенциал от ${kpis.marketPotential} е ограничен. TAM-ът може да е прекалено малък или позиционирането прекалено тясно. В Цикъл 2 можеш да се разшириш.`,
    },
    riskLevel: {
      en: `Your risk level of ${kpis.riskLevel} is dangerously high. ${financial.burnRate > financial.revenue ? 'You\'re burning more than you earn.' : ''} In Cycle 2, you can diversify revenue or build a financial cushion.`,
      bg: `Нивото ти на риск от ${kpis.riskLevel} е опасно високо. ${financial.burnRate > financial.revenue ? 'Горите повече отколкото печелите.' : ''} В Цикъл 2 можеш да диверсифицираш приходите или да изградиш финансова възглавница.`,
    },
    growthPotential: {
      en: `Your growth potential of ${kpis.growthPotential} is low. Without growth levers, your startup will stagnate. In Cycle 2, you can add viral mechanics or a referral program.`,
      bg: `Потенциалът ти за растеж от ${kpis.growthPotential} е нисък. Без лостове за растеж стартъпът ще стагнира. В Цикъл 2 можеш да добавиш вирални механики или реферална програма.`,
    },
  };
  return { insight: lang === 'bg' ? insights[weakest].bg : insights[weakest].en, weakest };
}

// ─── EXISTING FUNCTIONS ───
export function applyDecisionEffects(
  currentKPIs: SimWeekKPIs,
  effects: Partial<SimWeekKPIs>
): SimWeekKPIs {
  return {
    innovation: Math.min(100, Math.max(0, currentKPIs.innovation + (effects.innovation || 0))),
    marketPotential: Math.min(100, Math.max(0, currentKPIs.marketPotential + (effects.marketPotential || 0))),
    scalability: Math.min(100, Math.max(0, currentKPIs.scalability + (effects.scalability || 0))),
    riskLevel: Math.min(100, Math.max(0, currentKPIs.riskLevel + (effects.riskLevel || 0))),
    growthPotential: Math.min(100, Math.max(0, currentKPIs.growthPotential + (effects.growthPotential || 0))),
  };
}

export function combineEffects(effectsList: Partial<SimWeekKPIs>[]): Partial<SimWeekKPIs> {
  const combined: Partial<SimWeekKPIs> = {};
  for (const effects of effectsList) {
    for (const [key, val] of Object.entries(effects) as [keyof SimWeekKPIs, number][]) {
      combined[key] = (combined[key] || 0) + val;
    }
  }
  return combined;
}

export function getStartupGrade(kpis: SimWeekKPIs): { grade: string; labelEn: string; labelBg: string; color: string; feedbackEn: string; feedbackBg: string } {
  const score = kpis.innovation * 0.25 + kpis.marketPotential * 0.2 + kpis.scalability * 0.2 + (100 - kpis.riskLevel) * 0.15 + kpis.growthPotential * 0.2;
  
  if (score >= 75) return {
    grade: 'A', labelEn: 'Unicorn Potential', labelBg: 'Потенциал за Unicorn', color: 'hsl(var(--sim-success))',
    feedbackEn: 'Exceptional strategy! Your startup demonstrates strong innovation, excellent market fit, and high growth potential with manageable risk. You think like a top founder.',
    feedbackBg: 'Изключителна стратегия! Вашият стартъп демонстрира силна иновация, отлично съответствие с пазара и висок потенциал за растеж с управляем риск.'
  };
  if (score >= 55) return {
    grade: 'B', labelEn: 'Strong Startup', labelBg: 'Силен стартъп', color: 'hsl(var(--chart-2))',
    feedbackEn: 'Solid strategy with good fundamentals. Your decisions show strategic thinking. Consider strengthening areas where your scores are lower to unlock full potential.',
    feedbackBg: 'Солидна стратегия с добри основи. Решенията ви показват стратегическо мислене. Помислете за укрепване на слабите области.'
  };
  if (score >= 40) return {
    grade: 'C', labelEn: 'Promising Venture', labelBg: 'Обещаващ проект', color: 'hsl(var(--sim-warning))',
    feedbackEn: 'Your startup has potential but faces significant challenges. Review your risk exposure and consider whether your product-market fit is strong enough.',
    feedbackBg: 'Вашият стартъп има потенциал, но среща значителни предизвикателства. Прегледайте рисковата си експозиция.'
  };
  return {
    grade: 'D', labelEn: 'Needs Rethinking', labelBg: 'Нуждае се от преосмисляне', color: 'hsl(var(--sim-danger))',
    feedbackEn: 'Your strategic decisions create high risk with limited upside. Consider pivoting your approach — focus on reducing risk while increasing innovation and market potential.',
    feedbackBg: 'Стратегическите ви решения създават висок риск с ограничен потенциал. Помислете за промяна на подхода си.'
  };
}
