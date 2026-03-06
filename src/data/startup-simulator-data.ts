export interface SimWeekKPIs {
  innovation: number;       // 0-100
  marketPotential: number;  // 0-100
  scalability: number;      // 0-100
  riskLevel: number;        // 0-100 (lower is better)
  growthPotential: number;  // 0-100
}

export interface SimDecisionOption {
  id: string;
  labelEn: string;
  labelBg: string;
  descEn: string;
  descBg: string;
  effects: Partial<SimWeekKPIs>;
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
    theoryConceptEn: 'Product-Market Fit',
    theoryConceptBg: 'Продуктово-пазарно съответствие',
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
  // Step 4 – Product Type
  {
    week: 4,
    titleEn: 'Product Type',
    titleBg: 'Тип на продукта',
    descEn: 'Choose the type of digital product you will build. Many successful startups combine multiple product types into one solution.',
    descBg: 'Изберете типа дигитален продукт, който ще създадете. Много успешни стартъпи комбинират множество типове продукти.',
    icon: '🛠️',
    theoryConceptEn: 'Network Effects',
    theoryConceptBg: 'Мрежови ефекти',
    decisions: [
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
    theoryConceptEn: 'Platform Business Models',
    theoryConceptBg: 'Платформени бизнес модели',
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
    theoryConceptEn: 'Customer Acquisition Cost',
    theoryConceptBg: 'Цена за привличане на клиент (CAC)',
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
  // Performance score: weighted sum favoring innovation and growth, penalizing risk
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
