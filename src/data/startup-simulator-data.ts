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
  decisions: SimDecision[];
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
    titleEn: 'Product Architecture',
    titleBg: 'Архитектура на продукта',
    descEn: 'Design your digital product architecture. Real startups often combine multiple technologies to create powerful solutions.',
    descBg: 'Проектирайте архитектурата на вашия дигитален продукт. Реалните стартъпи често комбинират множество технологии.',
    icon: '🛠️',
    decisions: [
      {
        questionEn: 'What components will your digital product include? (Select all that apply)',
        questionBg: 'Кои компоненти ще включва вашият дигитален продукт? (можете да изберете повече от един)',
        multiSelect: true,
        multiSelectHintEn: 'Hybrid product architecture detected — many successful startups combine multiple technologies.',
        multiSelectHintBg: 'Засечена хибридна архитектура — много успешни стартъпи комбинират множество технологии.',
        options: [
          { id: 'w3-mobile', labelEn: 'Mobile App', labelBg: 'Мобилно приложение', descEn: 'Native mobile experience. Great for engagement and push notifications.', descBg: 'Нативно мобилно изживяване. Чудесно за ангажираност и push нотификации.', effects: { users: 80, satisfaction: 12, revenue: -400 } },
          { id: 'w3-web', labelEn: 'Web Platform', labelBg: 'Уеб платформа', descEn: 'Browser-based platform accessible to everyone, everywhere.', descBg: 'Платформа, достъпна за всички навсякъде чрез браузър.', effects: { users: 120, satisfaction: 8, revenue: -200 } },
          { id: 'w3-ai', labelEn: 'AI-Powered Tool', labelBg: 'AI инструмент', descEn: 'Leverage artificial intelligence for automation and insights.', descBg: 'Използвайте изкуствен интелект за автоматизация и анализи.', effects: { users: 40, satisfaction: 10, revenue: -600, growthRate: 8 } },
          { id: 'w3-data', labelEn: 'Data Platform', labelBg: 'Платформа за данни', descEn: 'Collect, analyze and monetize data insights.', descBg: 'Събирайте, анализирайте и монетизирайте данни.', effects: { users: 20, satisfaction: 5, revenue: 300, growthRate: 5 } },
          { id: 'w3-marketplace', labelEn: 'Marketplace Platform', labelBg: 'Маркетплейс платформа', descEn: 'Connect buyers and sellers. Network effects drive growth.', descBg: 'Свържете купувачи и продавачи. Мрежови ефекти движат растежа.', effects: { users: 100, satisfaction: 6, revenue: 200, growthRate: 10 } },
        ],
      },
      {
        questionEn: 'How will you test your MVP?',
        questionBg: 'Как ще тествате вашия MVP?',
        options: [
          { id: 'w3-beta', labelEn: 'Private beta with 50 users', labelBg: 'Частна бета с 50 потребители', descEn: 'Small test group. High feedback quality, slow launch.', descBg: 'Малка тестова група. Високо качество на обратна връзка, бавно стартиране.', effects: { satisfaction: 15, growthRate: -3 } },
          { id: 'w3-public', labelEn: 'Public launch', labelBg: 'Публично стартиране', descEn: 'Launch to everyone immediately. Fast growth, more bugs.', descBg: 'Стартирайте за всички веднага. Бърз растеж, повече бъгове.', effects: { users: 150, satisfaction: -10, growthRate: 15 } },
          { id: 'w3-landing', labelEn: 'Landing page + waitlist', labelBg: 'Landing page + списък за чакане', descEn: 'Test demand before building. Smart but slow.', descBg: 'Тествайте търсенето преди да строите. Умно, но бавно.', effects: { users: 30, satisfaction: 8, growthRate: 5 } },
        ],
      },
    ],
  },
  {
    week: 4,
    titleEn: 'Business Model & Revenue',
    titleBg: 'Бизнес модел и приходи',
    descEn: 'Design how your startup will generate revenue. Successful startups often combine multiple revenue streams.',
    descBg: 'Проектирайте как вашият стартъп ще генерира приходи. Успешните стартъпи често комбинират множество източници на приходи.',
    icon: '💰',
    decisions: [
      {
        questionEn: 'How will your product generate revenue? (Select all that apply)',
        questionBg: 'Как вашият продукт ще генерира приходи? (можете да изберете повече от един)',
        multiSelect: true,
        multiSelectHintEn: 'Multi-revenue strategy detected — diversifying revenue streams reduces risk.',
        multiSelectHintBg: 'Засечена мулти-приходна стратегия — диверсификацията на приходите намалява риска.',
        options: [
          { id: 'w4-subscription', labelEn: 'Subscription (monthly/yearly)', labelBg: 'Абонамент (месечен/годишен)', descEn: 'Predictable recurring revenue. Industry standard for SaaS.', descBg: 'Предвидими повтарящи се приходи. Индустриален стандарт за SaaS.', effects: { revenue: 1500, satisfaction: 5, growthRate: 6 } },
          { id: 'w4-freemium', labelEn: 'Freemium', labelBg: 'Freemium', descEn: 'Free basic version, paid premium features. Fast user acquisition.', descBg: 'Безплатна базова версия, платени премиум функции. Бързо привличане на потребители.', effects: { users: 200, revenue: 300, satisfaction: 10, growthRate: 12 } },
          { id: 'w4-payperuse', labelEn: 'Pay-per-use', labelBg: 'Плащане при ползване', descEn: 'Users pay only for what they use. Fair and transparent.', descBg: 'Потребителите плащат само за това, което използват. Справедливо и прозрачно.', effects: { revenue: 800, satisfaction: 8, growthRate: 5 } },
          { id: 'w4-iap', labelEn: 'In-app purchases', labelBg: 'Покупки в приложението', descEn: 'Sell digital goods or upgrades inside your app.', descBg: 'Продавайте дигитални стоки или ъпгрейди в приложението.', effects: { revenue: 600, users: 50, satisfaction: 3 } },
          { id: 'w4-commission', labelEn: 'Marketplace commission', labelBg: 'Комисиона от маркетплейс', descEn: 'Take a percentage of each transaction. Scales with volume.', descBg: 'Вземете процент от всяка транзакция. Мащабира с обема.', effects: { revenue: 700, users: 40, growthRate: 8 } },
          { id: 'w4-ads', labelEn: 'Advertising', labelBg: 'Реклами', descEn: 'Monetize through ads. Requires large user base.', descBg: 'Монетизирайте чрез реклами. Изисква голяма потребителска база.', effects: { revenue: 400, users: 100, satisfaction: -5, growthRate: 3 } },
          { id: 'w4-enterprise', labelEn: 'Enterprise licensing', labelBg: 'Корпоративен лиценз', descEn: 'Sell licenses to large organizations. High value contracts.', descBg: 'Продавайте лицензи на големи организации. Договори с висока стойност.', effects: { revenue: 2500, users: 10, satisfaction: 8 } },
          { id: 'w4-onetime', labelEn: 'One-time purchase', labelBg: 'Еднократна покупка', descEn: 'Single payment for lifetime access. Simple but no recurring revenue.', descBg: 'Еднократно плащане за пожизнен достъп. Просто, но без повтарящи се приходи.', effects: { revenue: 1000, satisfaction: 12, growthRate: -2 } },
        ],
      },
      {
        questionEn: 'Who is your primary target market?',
        questionBg: 'Кой е основният пазар за вашия продукт?',
        options: [
          { id: 'w4-mass', labelEn: 'Mass Market', labelBg: 'Масов пазар', descEn: 'Target the broadest possible audience. High volume, intense competition.', descBg: 'Таргетирайте най-широката аудитория. Голям обем, интензивна конкуренция.', effects: { users: 200, revenue: 500, satisfaction: -3, growthRate: 10 } },
          { id: 'w4-nichemarket', labelEn: 'Niche Market', labelBg: 'Нишов пазар', descEn: 'Focus on a specific segment. Less competition, higher loyalty.', descBg: 'Фокусирайте се върху специфичен сегмент. По-малка конкуренция, по-висока лоялност.', effects: { users: 40, revenue: 800, satisfaction: 15, growthRate: 3 } },
          { id: 'w4-b2b-target', labelEn: 'B2B', labelBg: 'B2B', descEn: 'Sell to other businesses. Higher contract values, longer sales cycles.', descBg: 'Продавайте на други бизнеси. По-високи стойности на договорите, по-дълги цикли на продажба.', effects: { users: 20, revenue: 2000, satisfaction: 10, growthRate: 5 } },
          { id: 'w4-b2c-target', labelEn: 'B2C', labelBg: 'B2C', descEn: 'Sell directly to consumers. Large audience, lower prices.', descBg: 'Продавайте директно на потребители. Голяма аудитория, по-ниски цени.', effects: { users: 180, revenue: 400, satisfaction: 5, growthRate: 8 } },
          { id: 'w4-enterprise-target', labelEn: 'Enterprise', labelBg: 'Корпоративен', descEn: 'Target large enterprises. Complex sales but very high revenue.', descBg: 'Таргетирайте големи предприятия. Сложни продажби, но много високи приходи.', effects: { users: 10, revenue: 3000, satisfaction: 8, growthRate: 2 } },
        ],
      },
    ],
  },
  {
    week: 5,
    titleEn: 'Marketing & Growth Strategy',
    titleBg: 'Маркетинг и стратегия за растеж',
    descEn: 'Choose how you will acquire users and grow your startup. The best startups use multiple channels strategically.',
    descBg: 'Изберете как ще привлечете потребители и ще развиете стартъпа. Най-добрите стартъпи използват множество канали стратегически.',
    icon: '🚀',
    decisions: [
      {
        questionEn: 'Which marketing channels will you use to grow your startup? (Select all that apply)',
        questionBg: 'Кои маркетингови канали ще използвате за растеж? (можете да изберете повече от един)',
        multiSelect: true,
        multiSelectHintEn: 'Multi-channel strategy detected — using diverse channels accelerates growth.',
        multiSelectHintBg: 'Засечена мулти-канална стратегия — разнообразните канали ускоряват растежа.',
        options: [
          { id: 'w5-social', labelEn: 'Social Media Marketing', labelBg: 'Маркетинг в социалните медии', descEn: 'Organic content on Instagram, TikTok, LinkedIn. Low cost, slow build.', descBg: 'Органично съдържание в Instagram, TikTok, LinkedIn. Ниска цена, бавно изграждане.', effects: { users: 150, revenue: -100, satisfaction: 5, growthRate: 8 } },
          { id: 'w5-influencer', labelEn: 'Influencer Marketing', labelBg: 'Инфлуенсър маркетинг', descEn: 'Partner with influencers for fast brand awareness.', descBg: 'Партнирайте с инфлуенсъри за бързо разпознаване.', effects: { users: 250, revenue: -400, satisfaction: 3, growthRate: 12 } },
          { id: 'w5-seo', labelEn: 'SEO / Content Marketing', labelBg: 'SEO / Съдържателен маркетинг', descEn: 'Create valuable content to rank in search engines. Long-term play.', descBg: 'Създавайте ценно съдържание за класиране в търсачки. Дългосрочна стратегия.', effects: { users: 100, satisfaction: 8, growthRate: 6 } },
          { id: 'w5-paid', labelEn: 'Paid Ads (Google / Meta)', labelBg: 'Платени реклами (Google / Meta)', descEn: 'Pay for immediate visibility. Expensive but measurable.', descBg: 'Платете за незабавна видимост. Скъпо, но измеримо.', effects: { users: 300, revenue: -800, satisfaction: -2, growthRate: 18 } },
          { id: 'w5-community', labelEn: 'Community Building', labelBg: 'Изграждане на общност', descEn: 'Build a loyal community around your brand. Strong retention.', descBg: 'Изградете лоялна общност около бранда. Силно задържане.', effects: { satisfaction: 18, users: 50, growthRate: 5 } },
          { id: 'w5-partnerships', labelEn: 'Partnerships', labelBg: 'Партньорства', descEn: 'Strategic partnerships for distribution and credibility.', descBg: 'Стратегически партньорства за дистрибуция и доверие.', effects: { users: 80, revenue: 200, satisfaction: 5, growthRate: 7 } },
          { id: 'w5-plg', labelEn: 'Product-Led Growth', labelBg: 'Растеж чрез продукта', descEn: 'Let the product sell itself through great user experience.', descBg: 'Нека продуктът се продава сам чрез страхотно потребителско изживяване.', effects: { users: 120, satisfaction: 15, growthRate: 10 } },
          { id: 'w5-referral', labelEn: 'Referral Programs', labelBg: 'Реферални програми', descEn: 'Incentivize users to invite friends. Viral growth potential.', descBg: 'Стимулирайте потребителите да канят приятели. Потенциал за вирусен растеж.', effects: { users: 180, revenue: -200, satisfaction: 5, growthRate: 14 } },
          { id: 'w5-email', labelEn: 'Email Marketing', labelBg: 'Имейл маркетинг', descEn: 'Direct communication with your audience. High ROI channel.', descBg: 'Директна комуникация с аудиторията. Канал с висок ROI.', effects: { users: 60, revenue: 100, satisfaction: 3, growthRate: 4 } },
          { id: 'w5-events', labelEn: 'Events / Webinars', labelBg: 'Събития / Уебинари', descEn: 'Build authority through live events and presentations.', descBg: 'Изградете авторитет чрез живи събития и презентации.', effects: { users: 40, satisfaction: 10, revenue: -150, growthRate: 3 } },
        ],
      },
      {
        questionEn: 'How will you retain users?',
        questionBg: 'Как ще задържите потребителите?',
        options: [
          { id: 'w5-loyalty', labelEn: 'Loyalty & rewards program', labelBg: 'Програма за лоялност', descEn: 'Reward repeat users. Increases retention at moderate cost.', descBg: 'Възнаградете редовните потребители. Увеличава задържането при умерена цена.', effects: { satisfaction: 15, revenue: -300, growthRate: 3 } },
          { id: 'w5-comm-build', labelEn: 'Community building', labelBg: 'Изграждане на общност', descEn: 'Build a community around your brand. Strong but slow.', descBg: 'Изградете общност около бранда. Силно, но бавно.', effects: { satisfaction: 20, users: 50, growthRate: 5 } },
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

export function combineEffects(effectsList: Partial<SimWeekKPIs>[]): Partial<SimWeekKPIs> {
  const combined: Partial<SimWeekKPIs> = {};
  for (const effects of effectsList) {
    for (const [key, val] of Object.entries(effects) as [keyof SimWeekKPIs, number][]) {
      combined[key] = (combined[key] || 0) + val;
    }
  }
  return combined;
}

export function getStartupGrade(kpis: SimWeekKPIs): { grade: string; labelEn: string; labelBg: string; color: string } {
  const score = (kpis.users / 20) + (kpis.revenue / 500) + kpis.satisfaction + kpis.growthRate;
  if (score >= 150) return { grade: 'A', labelEn: 'Unicorn Potential', labelBg: 'Потенциал за Unicorn', color: 'hsl(var(--sim-success))' };
  if (score >= 100) return { grade: 'B', labelEn: 'Strong Startup', labelBg: 'Силен стартъп', color: 'hsl(var(--chart-2))' };
  if (score >= 60) return { grade: 'C', labelEn: 'Promising Venture', labelBg: 'Обещаващ проект', color: 'hsl(var(--sim-warning))' };
  return { grade: 'D', labelEn: 'Needs Improvement', labelBg: 'Нуждае се от подобрение', color: 'hsl(var(--sim-danger))' };
}
