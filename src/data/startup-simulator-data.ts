export interface SimWeekKPIs {
  users: number;
  revenue: number;
  satisfaction: number; // 0-100
  growthRate: number;   // percentage
}

export interface SimDecisionOption {
  id: string;
  labelEn: string;
  labelBg: string;
  descEn: string;
  descBg: string;
  effects: Partial<SimWeekKPIs>;
}

export interface SimWeek {
  week: number;
  titleEn: string;
  titleBg: string;
  descEn: string;
  descBg: string;
  icon: string;
  decisions: {
    questionEn: string;
    questionBg: string;
    options: SimDecisionOption[];
  }[];
}

export const INITIAL_KPIS: SimWeekKPIs = {
  users: 0,
  revenue: 0,
  satisfaction: 50,
  growthRate: 0,
};

export const SIM_WEEKS: SimWeek[] = [
  {
    week: 1,
    titleEn: 'Identify Problem & Opportunity',
    titleBg: 'Проблем и възможност',
    descEn: 'Every startup begins by identifying a real problem worth solving. Choose the market and problem your startup will tackle.',
    descBg: 'Всеки стартъп започва с идентифициране на реален проблем. Изберете пазара и проблема, който вашият стартъп ще реши.',
    icon: '🔍',
    decisions: [
      {
        questionEn: 'Which market will you target?',
        questionBg: 'Кой пазар ще таргетирате?',
        options: [
          { id: 'w1-local', labelEn: 'Local market', labelBg: 'Местен пазар', descEn: 'Focus on a specific city or region. Lower risk, slower growth.', descBg: 'Фокус върху конкретен град или регион. По-нисък риск, по-бавен растеж.', effects: { users: 50, satisfaction: 65, growthRate: 5 } },
          { id: 'w1-national', labelEn: 'National market', labelBg: 'Национален пазар', descEn: 'Target your entire country. Moderate risk and growth potential.', descBg: 'Таргетирайте цялата страна. Умерен риск и потенциал за растеж.', effects: { users: 120, satisfaction: 55, growthRate: 12 } },
          { id: 'w1-global', labelEn: 'Global market', labelBg: 'Глобален пазар', descEn: 'Go international from day one. High risk, high reward.', descBg: 'Излезте на международен пазар от ден първи. Висок риск, висока награда.', effects: { users: 200, satisfaction: 40, growthRate: 20 } },
        ],
      },
      {
        questionEn: 'How big is the problem you are solving?',
        questionBg: 'Колко голям е проблемът, който решавате?',
        options: [
          { id: 'w1-niche', labelEn: 'Niche problem', labelBg: 'Нишов проблем', descEn: 'A specific problem for a small group. High satisfaction, limited market.', descBg: 'Специфичен проблем за малка група. Висока удовлетвореност, ограничен пазар.', effects: { satisfaction: 20, growthRate: -2 } },
          { id: 'w1-moderate', labelEn: 'Moderate problem', labelBg: 'Умерен проблем', descEn: 'A common problem many people face. Balanced approach.', descBg: 'Общ проблем, с който се сблъскват много хора. Балансиран подход.', effects: { users: 30, satisfaction: 10, growthRate: 5 } },
          { id: 'w1-massive', labelEn: 'Massive problem', labelBg: 'Мащабен проблем', descEn: 'A huge pain point. Big market but intense competition.', descBg: 'Огромна болезнена точка. Голям пазар, но силна конкуренция.', effects: { users: 80, satisfaction: -5, growthRate: 10 } },
        ],
      },
    ],
  },
  {
    week: 2,
    titleEn: 'Customer & Value Proposition',
    titleBg: 'Клиент и стойностно предложение',
    descEn: 'Define who your customers are and why they should choose your solution over alternatives.',
    descBg: 'Определете кои са вашите клиенти и защо трябва да изберат вашето решение пред алтернативите.',
    icon: '👥',
    decisions: [
      {
        questionEn: 'Who is your primary customer?',
        questionBg: 'Кой е основният ви клиент?',
        options: [
          { id: 'w2-b2c', labelEn: 'Consumers (B2C)', labelBg: 'Потребители (B2C)', descEn: 'Sell directly to individual users. Large audience, lower price per customer.', descBg: 'Продавайте директно на индивидуални потребители. Голяма аудитория, по-ниска цена.', effects: { users: 150, revenue: 500, satisfaction: 5 } },
          { id: 'w2-b2b', labelEn: 'Businesses (B2B)', labelBg: 'Бизнеси (B2B)', descEn: 'Sell to companies. Fewer customers, higher contract values.', descBg: 'Продавайте на компании. По-малко клиенти, по-високи стойности на договорите.', effects: { users: 30, revenue: 2000, satisfaction: 10 } },
          { id: 'w2-both', labelEn: 'Both (B2B2C)', labelBg: 'И двата (B2B2C)', descEn: 'Platform model serving both. Complex but scalable.', descBg: 'Платформен модел за двата. Сложен, но мащабируем.', effects: { users: 80, revenue: 1200, growthRate: 8 } },
        ],
      },
      {
        questionEn: 'What is your unique value proposition?',
        questionBg: 'Какво е вашето уникално стойностно предложение?',
        options: [
          { id: 'w2-price', labelEn: 'Lowest price', labelBg: 'Най-ниска цена', descEn: 'Compete on price. High volume, thin margins.', descBg: 'Конкурирайте се с цена. Висок обем, тънки маржове.', effects: { users: 100, revenue: -200, satisfaction: 5 } },
          { id: 'w2-quality', labelEn: 'Best quality', labelBg: 'Най-добро качество', descEn: 'Premium product. Fewer users but higher loyalty.', descBg: 'Премиум продукт. По-малко потребители, но по-висока лоялност.', effects: { users: 20, revenue: 800, satisfaction: 15 } },
          { id: 'w2-speed', labelEn: 'Fastest experience', labelBg: 'Най-бързо изживяване', descEn: 'Speed is your advantage. Great for convenience markets.', descBg: 'Скоростта е вашето предимство. Чудесно за пазари на удобство.', effects: { users: 60, revenue: 400, satisfaction: 10, growthRate: 5 } },
        ],
      },
    ],
  },
  {
    week: 3,
    titleEn: 'Business Model',
    titleBg: 'Бизнес модел',
    descEn: 'Design how your startup will generate revenue and sustain itself financially.',
    descBg: 'Проектирайте как вашият стартъп ще генерира приходи и ще се поддържа финансово.',
    icon: '💰',
    decisions: [
      {
        questionEn: 'How will you charge customers?',
        questionBg: 'Как ще таксувате клиентите?',
        options: [
          { id: 'w3-subscription', labelEn: 'Subscription model', labelBg: 'Абонаментен модел', descEn: 'Monthly recurring revenue. Predictable but slower to build.', descBg: 'Месечни повтарящи се приходи. Предсказуем, но по-бавен за изграждане.', effects: { revenue: 1500, satisfaction: 5, growthRate: 8 } },
          { id: 'w3-commission', labelEn: 'Commission per transaction', labelBg: 'Комисиона на транзакция', descEn: 'Take a cut of each transaction. Revenue scales with volume.', descBg: 'Вземете процент от всяка транзакция. Приходите нарастват с обема.', effects: { revenue: 800, users: 50, growthRate: 12 } },
          { id: 'w3-freemium', labelEn: 'Freemium model', labelBg: 'Freemium модел', descEn: 'Free basic version, paid premium. Fast user growth, slow monetization.', descBg: 'Безплатна базова версия, платена премиум. Бърз растеж, бавна монетизация.', effects: { users: 200, revenue: 300, satisfaction: 10, growthRate: 15 } },
        ],
      },
      {
        questionEn: 'What is your pricing strategy?',
        questionBg: 'Каква е ценовата ви стратегия?',
        options: [
          { id: 'w3-low', labelEn: 'Low price, high volume', labelBg: 'Ниска цена, голям обем', descEn: 'Affordable for everyone. Aim for mass adoption.', descBg: 'Достъпна за всички. Цел — масово приемане.', effects: { users: 100, revenue: 400, growthRate: 5 } },
          { id: 'w3-mid', labelEn: 'Mid-range pricing', labelBg: 'Средна ценова категория', descEn: 'Balanced price and value. Sustainable approach.', descBg: 'Балансирана цена и стойност. Устойчив подход.', effects: { users: 40, revenue: 900, satisfaction: 5 } },
          { id: 'w3-premium', labelEn: 'Premium pricing', labelBg: 'Премиум цена', descEn: 'High price for a premium product. Few users, high revenue.', descBg: 'Висока цена за премиум продукт. Малко потребители, високи приходи.', effects: { users: -20, revenue: 1800, satisfaction: 10 } },
        ],
      },
    ],
  },
  {
    week: 4,
    titleEn: 'Product Design (MVP)',
    titleBg: 'Дизайн на продукт (MVP)',
    descEn: 'Build your Minimum Viable Product — the simplest version of your product that solves the core problem.',
    descBg: 'Изградете вашия Минимално Жизнеспособен Продукт — най-простата версия, която решава основния проблем.',
    icon: '🛠️',
    decisions: [
      {
        questionEn: 'What type of digital product will you build?',
        questionBg: 'Какъв тип дигитален продукт ще изградите?',
        options: [
          { id: 'w4-app', labelEn: 'Mobile app', labelBg: 'Мобилно приложение', descEn: 'A native mobile app. Great for engagement, costly to build.', descBg: 'Нативно мобилно приложение. Чудесно за ангажираност, скъпо за изграждане.', effects: { users: 80, satisfaction: 15, revenue: -500 } },
          { id: 'w4-web', labelEn: 'Web platform', labelBg: 'Уеб платформа', descEn: 'Browser-based platform. Easier to build, accessible to everyone.', descBg: 'Платформа, базирана на браузър. По-лесна за изграждане, достъпна за всички.', effects: { users: 120, satisfaction: 8, revenue: -200 } },
          { id: 'w4-ai', labelEn: 'AI-powered tool', labelBg: 'AI инструмент', descEn: 'An AI tool solving a specific problem. Innovative but complex.', descBg: 'AI инструмент, решаващ специфичен проблем. Иновативен, но сложен.', effects: { users: 60, satisfaction: 12, revenue: -800, growthRate: 10 } },
        ],
      },
      {
        questionEn: 'How will you test your MVP?',
        questionBg: 'Как ще тествате вашия MVP?',
        options: [
          { id: 'w4-beta', labelEn: 'Private beta with 50 users', labelBg: 'Частна бета с 50 потребители', descEn: 'Small test group. High feedback quality, slow launch.', descBg: 'Малка тестова група. Високо качество на обратна връзка, бавно стартиране.', effects: { satisfaction: 15, growthRate: -3 } },
          { id: 'w4-public', labelEn: 'Public launch', labelBg: 'Публично стартиране', descEn: 'Launch to everyone immediately. Fast growth, more bugs.', descBg: 'Стартирайте за всички веднага. Бърз растеж, повече бъгове.', effects: { users: 150, satisfaction: -10, growthRate: 15 } },
          { id: 'w4-landing', labelEn: 'Landing page + waitlist', labelBg: 'Landing page + списък за чакане', descEn: 'Test demand before building. Smart but slow.', descBg: 'Тествайте търсенето преди да строите. Умно, но бавно.', effects: { users: 30, satisfaction: 8, growthRate: 5 } },
        ],
      },
    ],
  },
  {
    week: 5,
    titleEn: 'Growth Strategy',
    titleBg: 'Стратегия за растеж',
    descEn: 'Choose how you will acquire users and grow your startup rapidly.',
    descBg: 'Изберете как ще привлечете потребители и ще развиете стартъпа си бързо.',
    icon: '🚀',
    decisions: [
      {
        questionEn: 'Choose your marketing strategy:',
        questionBg: 'Изберете вашата маркетингова стратегия:',
        options: [
          { id: 'w5-social', labelEn: 'Social media marketing', labelBg: 'Маркетинг в социалните медии', descEn: 'Organic content on Instagram, TikTok, etc. Low cost, slow build.', descBg: 'Органично съдържание в Instagram, TikTok и др. Ниска цена, бавно изграждане.', effects: { users: 200, revenue: -100, satisfaction: 5, growthRate: 10 } },
          { id: 'w5-influencer', labelEn: 'Influencer marketing', labelBg: 'Инфлуенсър маркетинг', descEn: 'Partner with influencers. Medium cost, fast awareness.', descBg: 'Партнирайте с инфлуенсъри. Средна цена, бързо разпознаване.', effects: { users: 350, revenue: -600, satisfaction: 3, growthRate: 18 } },
          { id: 'w5-paid', labelEn: 'Paid advertising', labelBg: 'Платена реклама', descEn: 'Google/Facebook ads. Expensive but measurable results.', descBg: 'Реклами в Google/Facebook. Скъпо, но измерими резултати.', effects: { users: 500, revenue: -1200, satisfaction: -2, growthRate: 25 } },
        ],
      },
      {
        questionEn: 'How will you retain users?',
        questionBg: 'Как ще задържите потребителите?',
        options: [
          { id: 'w5-loyalty', labelEn: 'Loyalty & rewards program', labelBg: 'Програма за лоялност', descEn: 'Reward repeat users. Increases retention at moderate cost.', descBg: 'Възнаградете редовните потребители. Увеличава задържането при умерена цена.', effects: { satisfaction: 15, revenue: -300, growthRate: 3 } },
          { id: 'w5-community', labelEn: 'Community building', labelBg: 'Изграждане на общност', descEn: 'Build a community around your brand. Strong but slow.', descBg: 'Изградете общност около бранда. Силно, но бавно.', effects: { satisfaction: 20, users: 50, growthRate: 5 } },
          { id: 'w5-features', labelEn: 'Continuous feature updates', labelBg: 'Непрекъснати актуализации', descEn: 'Keep shipping new features. Expensive but keeps users engaged.', descBg: 'Продължавайте да пускате нови функции. Скъпо, но държи потребителите ангажирани.', effects: { satisfaction: 10, revenue: -500, users: 30, growthRate: 8 } },
        ],
      },
    ],
  },
  {
    week: 6,
    titleEn: 'Startup Pitch & Results',
    titleBg: 'Стартъп представяне и резултати',
    descEn: 'Present your final startup pitch and review your results. What kind of startup have you built?',
    descBg: 'Представете финалното си стартъп представяне и прегледайте резултатите. Какъв стартъп изградихте?',
    icon: '🎤',
    decisions: [
      {
        questionEn: 'What is your next funding strategy?',
        questionBg: 'Каква е следващата ви стратегия за финансиране?',
        options: [
          { id: 'w6-bootstrap', labelEn: 'Bootstrap (self-funded)', labelBg: 'Бутстрап (самофинансиране)', descEn: 'Keep full control. Slower growth but no dilution.', descBg: 'Запазете пълен контрол. По-бавен растеж, но без размиване.', effects: { satisfaction: 10, growthRate: 3 } },
          { id: 'w6-angel', labelEn: 'Seek angel investors', labelBg: 'Търсете ангел инвеститори', descEn: 'Get early funding from angel investors. Give up some equity.', descBg: 'Вземете ранно финансиране от ангел инвеститори. Откажете се от малко дялов капитал.', effects: { revenue: 3000, users: 100, growthRate: 10 } },
          { id: 'w6-vc', labelEn: 'Apply for venture capital', labelBg: 'Кандидатствайте за рисков капитал', descEn: 'Go big. Raise serious funding to scale fast.', descBg: 'Мислете мащабно. Наберете сериозно финансиране за бързо мащабиране.', effects: { revenue: 8000, users: 300, growthRate: 25, satisfaction: -5 } },
        ],
      },
      {
        questionEn: 'What is your 1-year vision?',
        questionBg: 'Каква е вашата 1-годишна визия?',
        options: [
          { id: 'w6-profit', labelEn: 'Reach profitability', labelBg: 'Достигнете рентабилност', descEn: 'Focus on becoming profitable. Sustainable and cautious.', descBg: 'Фокусирайте се върху рентабилността. Устойчиво и предпазливо.', effects: { revenue: 2000, satisfaction: 10 } },
          { id: 'w6-scale', labelEn: 'Scale to 100K users', labelBg: 'Мащабирайте до 100K потребители', descEn: 'Aggressive user growth. Revenue can come later.', descBg: 'Агресивен потребителски растеж. Приходите могат да дойдат по-късно.', effects: { users: 500, growthRate: 20, revenue: -500 } },
          { id: 'w6-expand', labelEn: 'Expand to new markets', labelBg: 'Разширете се на нови пазари', descEn: 'Enter new countries or verticals. High risk, high upside.', descBg: 'Навлезте в нови страни или вертикали. Висок риск, голям потенциал.', effects: { users: 200, revenue: 1000, growthRate: 15, satisfaction: -3 } },
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
    users: Math.max(0, currentKPIs.users + (effects.users || 0)),
    revenue: currentKPIs.revenue + (effects.revenue || 0),
    satisfaction: Math.min(100, Math.max(0, currentKPIs.satisfaction + (effects.satisfaction || 0))),
    growthRate: Math.max(-50, Math.min(100, currentKPIs.growthRate + (effects.growthRate || 0))),
  };
}

export function getStartupGrade(kpis: SimWeekKPIs): { grade: string; labelEn: string; labelBg: string; color: string } {
  const score = (kpis.users / 20) + (kpis.revenue / 500) + kpis.satisfaction + kpis.growthRate;
  if (score >= 150) return { grade: 'A', labelEn: 'Unicorn Potential', labelBg: 'Потенциал за Unicorn', color: 'hsl(var(--sim-success))' };
  if (score >= 100) return { grade: 'B', labelEn: 'Strong Startup', labelBg: 'Силен стартъп', color: 'hsl(var(--chart-2))' };
  if (score >= 60) return { grade: 'C', labelEn: 'Promising Venture', labelBg: 'Обещаващ проект', color: 'hsl(var(--sim-warning))' };
  return { grade: 'D', labelEn: 'Needs Improvement', labelBg: 'Нуждае се от подобрение', color: 'hsl(var(--sim-danger))' };
}
