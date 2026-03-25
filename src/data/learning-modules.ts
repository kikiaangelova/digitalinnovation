export interface QuizOption {
  id: string;
  en: string;
  bg: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  question_en: string;
  question_bg: string;
  options: QuizOption[];
}

export interface LearningModule {
  slug: string;
  title_en: string;
  title_bg: string;
  theory_en: string;
  theory_bg: string;
  quiz_questions: QuizQuestion[];
  analytical_question_en: string;
  analytical_question_bg: string;
  application_question_en: string;
  application_question_bg: string;
  display_order: number;
  /** Which curriculum level this module belongs to (1 = Innovation Thinking, 2 = Business Fundamentals) */
  level?: number;
  /** Which startup_projects field to update with the application answer */
  startup_field?: string;
  // Theory-to-Case mapping
  related_case_topic?: string;
  case_transition_en?: string;
  case_transition_bg?: string;
  // Theory-to-Simulator mapping
  related_sim_concepts_en?: string[];
  related_sim_concepts_bg?: string[];
  sim_transition_en?: string;
  sim_transition_bg?: string;
}

export const LEARNING_MODULES: LearningModule[] = [
  {
    slug: 'network-effects',
    title_en: 'Network Effects',
    title_bg: 'Мрежови ефекти',
    theory_en: `Network effects occur when a product or service becomes more valuable as more people use it. This is one of the most powerful competitive advantages in the digital economy.

There are two main types: **direct network effects** (same-side), where users benefit from other users on the same platform (e.g., social networks), and **indirect network effects** (cross-side), where one group of users benefits from a different group (e.g., buyers and sellers on a marketplace).

Network effects create winner-take-all dynamics. Once a platform reaches critical mass, it becomes extremely difficult for competitors to enter. This is why platforms like Facebook, Uber, and Airbnb dominate their markets.

However, network effects can also work in reverse. If users start leaving a platform, its value decreases for remaining users, creating a negative spiral. This makes user retention as important as acquisition.

Understanding network effects is essential for designing digital products that grow stronger with each new user, creating sustainable competitive moats.`,
    theory_bg: `Мрежовите ефекти възникват, когато продукт или услуга стават по-ценни с увеличаването на потребителите. Това е едно от най-мощните конкурентни предимства в дигиталната икономика.

Има два основни типа: **директни мрежови ефекти** (от същата страна), където потребителите се възползват от други потребители на същата платформа (напр. социални мрежи), и **индиректни мрежови ефекти** (от различна страна), където една група потребители се възползва от различна група (напр. купувачи и продавачи на пазар).

Мрежовите ефекти създават динамика „победителят взема всичко". След като платформата достигне критична маса, става изключително трудно за конкурентите да навлязат.

Мрежовите ефекти обаче могат да работят и в обратна посока. Ако потребителите започнат да напускат платформата, стойността й намалява за останалите, създавайки негативна спирала.

Разбирането на мрежовите ефекти е от съществено значение за проектирането на дигитални продукти, които стават по-силни с всеки нов потребител.`,
    quiz_questions: [
      { id: 'ne1', question_en: 'What happens when a platform reaches critical mass with strong network effects?', question_bg: 'Какво се случва, когато платформа достигне критична маса със силни мрежови ефекти?', options: [{ id: 'a', en: 'It becomes nearly impossible for competitors to enter', bg: 'Става почти невъзможно за конкурентите да навлязат', correct: true }, { id: 'b', en: 'Prices automatically increase', bg: 'Цените автоматично се увеличават', correct: false }, { id: 'c', en: 'The platform stops growing', bg: 'Платформата спира да расте', correct: false }] },
      { id: 'ne2', question_en: 'Which is an example of indirect (cross-side) network effects?', question_bg: 'Кой е пример за индиректни мрежови ефекти?', options: [{ id: 'a', en: 'More friends joining a messaging app', bg: 'Повече приятели се присъединяват към чат приложение', correct: false }, { id: 'b', en: 'More sellers attracting more buyers on a marketplace', bg: 'Повече продавачи привличат повече купувачи на пазар', correct: true }, { id: 'c', en: 'A company hiring more employees', bg: 'Компания наема повече служители', correct: false }] },
      { id: 'ne3', question_en: 'What is a negative network effect?', question_bg: 'Какво е негативен мрежови ефект?', options: [{ id: 'a', en: 'Users leaving causes further user loss', bg: 'Напускането на потребители причинява допълнителна загуба', correct: true }, { id: 'b', en: 'Too many features confuse users', bg: 'Твърде много функции объркват потребителите', correct: false }, { id: 'c', en: 'High server costs', bg: 'Високи разходи за сървъри', correct: false }] },
    ],
    analytical_question_en: 'Why are network effects considered one of the strongest competitive moats in the digital economy? Provide examples to support your reasoning.',
    analytical_question_bg: 'Защо мрежовите ефекти се считат за един от най-силните конкурентни защитни механизми в дигиталната икономика? Дайте примери.',
    application_question_en: 'How could you leverage network effects in your own startup idea? What type of network effect would be most relevant and how would you achieve critical mass?',
    application_question_bg: 'Как бихте използвали мрежовите ефекти във вашата стартъп идея? Кой тип мрежови ефект би бил най-подходящ и как бихте постигнали критична маса?',
    display_order: 1,
    related_case_topic: 'Platform Economy',
    case_transition_en: 'You just learned about network effects. Now analyze how Uber used network effects to dominate the mobility market.',
    case_transition_bg: 'Току-що научихте за мрежовите ефекти. Сега анализирайте как Uber използва мрежовите ефекти, за да доминира на пазара за мобилност.',
    related_sim_concepts_en: ['Network Effects', 'Platform Scaling'],
    related_sim_concepts_bg: ['Мрежови ефекти', 'Мащабиране на платформа'],
    sim_transition_en: 'Apply network effects strategy in the startup simulator to test how your platform can grow.',
    sim_transition_bg: 'Приложете стратегия за мрежови ефекти в стартъп симулатора, за да тествате как вашата платформа може да расте.',
  },
  {
    slug: 'platform-business-models',
    title_en: 'Platform Business Models',
    title_bg: 'Платформени бизнес модели',
    theory_en: `Platform business models connect two or more user groups and facilitate value exchange between them. Unlike traditional linear businesses that create and sell products, platforms create infrastructure for interactions.

The key components of a platform are: **producers** who create value, **consumers** who consume it, and the **platform** that provides the rules and infrastructure. Revenue comes from transaction fees, subscriptions, advertising, or data monetization.

Successful platforms solve the **chicken-and-egg problem** — attracting both sides simultaneously. Strategies include subsidizing one side (e.g., free for consumers, paid for businesses), starting with a single-player use case, or seeding supply artificially.

Platform governance is critical. Too much openness can lead to low quality; too much control can stifle innovation. The best platforms find a balance through reputation systems, quality filters, and algorithmic curation.

Examples include Airbnb (hosts and guests), YouTube (creators and viewers), and the App Store (developers and users). Each demonstrates how platforms can scale faster than traditional businesses by leveraging their community.`,
    theory_bg: `Платформените бизнес модели свързват две или повече потребителски групи и улесняват обмена на стойност между тях. За разлика от традиционните линейни бизнеси, платформите създават инфраструктура за взаимодействия.

Ключовите компоненти на платформата са: **производители**, които създават стойност, **потребители**, които я консумират, и **платформата**, която предоставя правилата и инфраструктурата.

Успешните платформи решават **проблема кокошка и яйце** — привличане на двете страни едновременно. Стратегиите включват субсидиране на една страна, стартиране с единичен случай на употреба или изкуствено захранване на предлагането.

Управлението на платформата е критично. Твърде голяма откритост може да доведе до ниско качество; твърде голям контрол може да задуши иновациите.

Примери включват Airbnb (домакини и гости), YouTube (създатели и зрители) и App Store (разработчици и потребители).`,
    quiz_questions: [
      { id: 'pb1', question_en: 'What is the chicken-and-egg problem in platforms?', question_bg: 'Какъв е проблемът кокошка и яйце при платформите?', options: [{ id: 'a', en: 'Needing both supply and demand sides simultaneously', bg: 'Нужда от двете страни едновременно', correct: true }, { id: 'b', en: 'Choosing between mobile and web', bg: 'Избор между мобилна и уеб версия', correct: false }, { id: 'c', en: 'Deciding on pricing strategy', bg: 'Решаване на ценова стратегия', correct: false }] },
      { id: 'pb2', question_en: 'How do platforms typically generate revenue?', question_bg: 'Как платформите обикновено генерират приходи?', options: [{ id: 'a', en: 'Only through product sales', bg: 'Само чрез продажба на продукти', correct: false }, { id: 'b', en: 'Transaction fees, subscriptions, ads, or data', bg: 'Такси за транзакции, абонаменти, реклами или данни', correct: true }, { id: 'c', en: 'Government subsidies', bg: 'Държавни субсидии', correct: false }] },
    ],
    analytical_question_en: 'Compare linear business models with platform business models. What are the key advantages and risks of each approach?',
    analytical_question_bg: 'Сравнете линейните бизнес модели с платформените бизнес модели. Какви са ключовите предимства и рискове на всеки подход?',
    application_question_en: 'If your startup were a platform, who would be the producers and consumers? How would you solve the chicken-and-egg problem?',
    application_question_bg: 'Ако вашият стартъп беше платформа, кои биха били производителите и потребителите? Как бихте решили проблема кокошка и яйце?',
    display_order: 2,
    related_case_topic: 'Platform Economy',
    case_transition_en: 'You just learned about platform business models. Now analyze how real platforms solved the chicken-and-egg problem.',
    case_transition_bg: 'Току-що научихте за платформените бизнес модели. Сега анализирайте как реални платформи решиха проблема кокошка и яйце.',
    related_sim_concepts_en: ['Platform Business Models', 'Two-sided Markets'],
    related_sim_concepts_bg: ['Платформени бизнес модели', 'Двустранни пазари'],
    sim_transition_en: 'Test your platform strategy in the startup simulator.',
    sim_transition_bg: 'Тествайте вашата платформена стратегия в стартъп симулатора.',
  },
  {
    slug: 'customer-acquisition-cost',
    title_en: 'Customer Acquisition Cost',
    title_bg: 'Цена за привличане на клиент (CAC)',
    theory_en: `Customer Acquisition Cost (CAC) measures how much it costs to acquire a single new customer. It is calculated by dividing total sales and marketing expenses by the number of new customers acquired in a given period.

**CAC = Total Sales & Marketing Cost / Number of New Customers**

CAC is critical because it directly impacts profitability. If it costs more to acquire a customer than the revenue they generate (their Lifetime Value or LTV), the business model is unsustainable. The golden ratio is **LTV:CAC of 3:1** or higher.

Different channels have different CACs. Paid advertising (Google Ads, Facebook) tends to have higher CAC, while organic channels (SEO, word-of-mouth, content marketing) have lower CAC but take longer to build.

Startups often have high CAC initially and reduce it over time through brand building, product-led growth, and viral loops. The key is to monitor CAC by channel and optimize spending toward the most efficient acquisition methods.

Understanding CAC helps founders make smart decisions about marketing budgets, pricing, and growth strategies. A startup that cannot achieve profitable unit economics (LTV > CAC) will eventually run out of funding.`,
    theory_bg: `Цената за привличане на клиент (CAC) измерва колко струва привличането на един нов клиент. Изчислява се като се разделят общите разходи за продажби и маркетинг на броя нови клиенти за даден период.

**CAC = Общи разходи за продажби и маркетинг / Брой нови клиенти**

CAC е критичен, защото директно влияе на рентабилността. Ако привличането на клиент струва повече от приходите, които генерира (LTV), бизнес моделът е неустойчив. Златното съотношение е **LTV:CAC от 3:1** или повече.

Различните канали имат различен CAC. Платената реклама обикновено има по-висок CAC, докато органичните канали имат по-нисък CAC, но отнемат повече време.

Стартъпите често имат висок CAC първоначално и го намаляват с течение на времето чрез изграждане на бранд, продуктово ориентиран растеж и вирусни цикли.

Разбирането на CAC помага на основателите да вземат интелигентни решения за маркетингови бюджети, ценообразуване и стратегии за растеж.`,
    quiz_questions: [
      { id: 'cac1', question_en: 'What is Customer Acquisition Cost (CAC)?', question_bg: 'Какво е цена за привличане на клиент (CAC)?', options: [{ id: 'a', en: 'The cost to acquire a new customer', bg: 'Цената за привличане на нов клиент', correct: true }, { id: 'b', en: 'Total company revenue', bg: 'Общ приход на компанията', correct: false }, { id: 'c', en: 'Operational costs per month', bg: 'Оперативни разходи на месец', correct: false }] },
      { id: 'cac2', question_en: 'What is the ideal LTV:CAC ratio for a sustainable business?', question_bg: 'Какво е идеалното съотношение LTV:CAC за устойчив бизнес?', options: [{ id: 'a', en: '1:1', bg: '1:1', correct: false }, { id: 'b', en: '3:1 or higher', bg: '3:1 или повече', correct: true }, { id: 'c', en: '1:3', bg: '1:3', correct: false }] },
      { id: 'cac3', question_en: 'Which channel typically has lower CAC but takes longer?', question_bg: 'Кой канал обикновено има по-нисък CAC, но отнема повече време?', options: [{ id: 'a', en: 'Paid advertising', bg: 'Платена реклама', correct: false }, { id: 'b', en: 'Organic channels (SEO, content, word-of-mouth)', bg: 'Органични канали (SEO, съдържание, от уста на уста)', correct: true }, { id: 'c', en: 'TV commercials', bg: 'Телевизионни реклами', correct: false }] },
    ],
    analytical_question_en: 'Why is CAC critical for startup sustainability? What happens when CAC exceeds LTV?',
    analytical_question_bg: 'Защо CAC е критичен за устойчивостта на стартъпа? Какво се случва, когато CAC надвиши LTV?',
    application_question_en: 'How would you reduce CAC for your own startup idea? What acquisition channels would you prioritize and why?',
    application_question_bg: 'Как бихте намалили CAC за вашата стартъп идея? Кои канали за привличане бихте приоритизирали и защо?',
    display_order: 3,
    related_case_topic: 'FinTech',
    case_transition_en: 'You just learned about CAC. Now analyze how FinTech startups optimize customer acquisition in a regulated market.',
    case_transition_bg: 'Току-що научихте за CAC. Сега анализирайте как FinTech стартъпите оптимизират привличането на клиенти в регулиран пазар.',
    related_sim_concepts_en: ['Customer Acquisition Cost', 'Growth Channels'],
    related_sim_concepts_bg: ['Цена за привличане на клиент', 'Канали за растеж'],
    sim_transition_en: 'Apply CAC optimization strategies in the startup simulator marketing decisions.',
    sim_transition_bg: 'Приложете стратегии за оптимизация на CAC в маркетинговите решения на стартъп симулатора.',
  },
  {
    slug: 'product-market-fit',
    title_en: 'Product-Market Fit',
    title_bg: 'Продуктово-пазарно съответствие',
    theory_en: `Product-Market Fit (PMF) is the degree to which a product satisfies strong market demand. Marc Andreessen described it as "being in a good market with a product that can satisfy that market." It is the most important milestone for any startup.

Signs of PMF include: rapid organic growth, high retention rates, customers actively recommending the product, and demand exceeding the team's capacity to deliver. The **Sean Ellis test** asks users "How would you feel if you could no longer use this product?" — if 40%+ say "very disappointed," you likely have PMF.

Before PMF, startups should focus on learning and iteration, not scaling. Premature scaling (hiring, marketing spend) before PMF is the #1 cause of startup failure. The Lean Startup methodology recommends building an MVP, measuring results, and learning from customer feedback.

Achieving PMF requires deep understanding of customer pain points, willingness to pivot, and rapid experimentation. Many successful companies pivoted significantly before finding PMF — Instagram started as Burbn, Slack started as a gaming company, and YouTube began as a dating site.

Once PMF is achieved, the focus shifts to scaling. But PMF is not permanent — markets evolve, competitors emerge, and customer needs change. Continuous innovation is necessary to maintain it.`,
    theory_bg: `Продуктово-пазарното съответствие (PMF) е степента, до която продуктът задоволява силно пазарно търсене. Марк Андрийсен го описва като „да си на добър пазар с продукт, който може да задоволи този пазар." Това е най-важният етап за всеки стартъп.

Признаците на PMF включват: бърз органичен растеж, високи нива на задържане, клиенти, които активно препоръчват продукта. **Тестът на Шон Елис** пита потребителите „Как бихте се почувствали, ако не можете повече да използвате този продукт?" — ако 40%+ казват „много разочаровани", вероятно имате PMF.

Преди PMF, стартъпите трябва да се фокусират върху учене и итерация, а не мащабиране. Преждевременното мащабиране преди PMF е причина №1 за провал на стартъп.

Постигането на PMF изисква дълбоко разбиране на болките на клиентите, готовност за пивотиране и бързо експериментиране. Много успешни компании са пивотирали значително — Instagram започна като Burbn, Slack започна като компания за игри.

След постигане на PMF фокусът се измества към мащабиране. Но PMF не е постоянно — пазарите еволюират и нуждите на клиентите се променят.`,
    quiz_questions: [
      { id: 'pmf1', question_en: 'What is Product-Market Fit?', question_bg: 'Какво е продуктово-пазарно съответствие?', options: [{ id: 'a', en: 'When a product satisfies strong market demand', bg: 'Когато продуктът задоволява силно пазарно търсене', correct: true }, { id: 'b', en: 'When a product is feature-complete', bg: 'Когато продуктът е напълно завършен', correct: false }, { id: 'c', en: 'When a company is profitable', bg: 'Когато компанията е печеливша', correct: false }] },
      { id: 'pmf2', question_en: 'According to the Sean Ellis test, what percentage indicates PMF?', question_bg: 'Според теста на Шон Елис, какъв процент показва PMF?', options: [{ id: 'a', en: '10% very disappointed', bg: '10% много разочаровани', correct: false }, { id: 'b', en: '40%+ very disappointed', bg: '40%+ много разочаровани', correct: true }, { id: 'c', en: '100% satisfied', bg: '100% удовлетворени', correct: false }] },
      { id: 'pmf3', question_en: 'What is the #1 cause of startup failure?', question_bg: 'Коя е причина №1 за провал на стартъп?', options: [{ id: 'a', en: 'Bad technology', bg: 'Лоша технология', correct: false }, { id: 'b', en: 'Premature scaling before PMF', bg: 'Преждевременно мащабиране преди PMF', correct: true }, { id: 'c', en: 'Too many founders', bg: 'Твърде много основатели', correct: false }] },
    ],
    analytical_question_en: 'Why should startups avoid scaling before achieving Product-Market Fit? What are the consequences of premature scaling?',
    analytical_question_bg: 'Защо стартъпите трябва да избягват мащабирането преди постигане на продуктово-пазарно съответствие?',
    application_question_en: 'How would you test for Product-Market Fit in your startup idea? What metrics would you track and what experiments would you run?',
    application_question_bg: 'Как бихте тествали за продуктово-пазарно съответствие във вашата стартъп идея? Какви метрики бихте проследявали?',
    display_order: 4,
    related_case_topic: 'EdTech',
    case_transition_en: 'You just learned about Product-Market Fit. Now analyze how EdTech platforms found PMF in the education market.',
    case_transition_bg: 'Току-що научихте за продуктово-пазарно съответствие. Сега анализирайте как EdTech платформи намериха PMF.',
    related_sim_concepts_en: ['Product-Market Fit', 'MVP Strategy'],
    related_sim_concepts_bg: ['Продуктово-пазарно съответствие', 'MVP стратегия'],
    sim_transition_en: 'Test your product-market fit strategy in the startup simulator.',
    sim_transition_bg: 'Тествайте стратегията си за продуктово-пазарно съответствие в стартъп симулатора.',
  },
  {
    slug: 'digital-ecosystems',
    title_en: 'Digital Ecosystems',
    title_bg: 'Дигитални екосистеми',
    theory_en: `A digital ecosystem is a network of interconnected organizations, technologies, and individuals that create and exchange value through digital platforms. Unlike single platforms, ecosystems span multiple products and services that work together.

Apple's ecosystem is a prime example: iPhone, Mac, iPad, Apple Watch, App Store, iCloud, and Apple Pay form an interconnected system where each product reinforces the others. **Lock-in effects** make it costly for users to switch, creating powerful retention.

Ecosystems create value through **complementarity** — products become more valuable when used together. They also enable **data network effects**, where data collected across multiple touchpoints improves all products in the ecosystem.

Building an ecosystem requires a **keystone strategy**: provide core infrastructure that attracts complementors (third-party developers, partners), share value fairly, and maintain platform health. Amazon demonstrates this with AWS, Marketplace, Prime, and Alexa forming a self-reinforcing ecosystem.

The future of competition is increasingly between ecosystems, not individual companies. Understanding ecosystem dynamics — including API strategies, developer relations, and interoperability — is essential for modern digital strategy.`,
    theory_bg: `Дигиталната екосистема е мрежа от взаимосвързани организации, технологии и хора, които създават и обменят стойност чрез дигитални платформи.

Екосистемата на Apple е отличен пример: iPhone, Mac, iPad, Apple Watch, App Store, iCloud и Apple Pay формират взаимосвързана система. **Ефектите на заключване** правят скъпо за потребителите да сменят, създавайки мощно задържане.

Екосистемите създават стойност чрез **допълняемост** — продуктите стават по-ценни при съвместна употреба. Те също позволяват **мрежови ефекти на данните**, където данните, събрани от множество точки, подобряват всички продукти.

Изграждането на екосистема изисква **стратегия на ключов камък**: осигуряване на основна инфраструктура, която привлича допълващи. Amazon демонстрира това с AWS, Marketplace, Prime и Alexa.

Бъдещето на конкуренцията е все повече между екосистеми, а не отделни компании.`,
    quiz_questions: [
      { id: 'de1', question_en: 'What is a digital ecosystem?', question_bg: 'Какво е дигитална екосистема?', options: [{ id: 'a', en: 'A single app with many features', bg: 'Едно приложение с много функции', correct: false }, { id: 'b', en: 'A network of interconnected products and services creating shared value', bg: 'Мрежа от взаимосвързани продукти и услуги, създаващи споделена стойност', correct: true }, { id: 'c', en: 'A company website', bg: 'Уебсайт на компания', correct: false }] },
      { id: 'de2', question_en: 'What is a lock-in effect in ecosystems?', question_bg: 'Какво е ефект на заключване в екосистемите?', options: [{ id: 'a', en: 'When switching to competitors becomes too costly', bg: 'Когато преминаването към конкуренти става твърде скъпо', correct: true }, { id: 'b', en: 'When users are physically locked out', bg: 'Когато потребителите са физически заключени', correct: false }, { id: 'c', en: 'When an app requires a password', bg: 'Когато приложение изисква парола', correct: false }] },
    ],
    analytical_question_en: 'How do digital ecosystems create stronger competitive advantages compared to standalone platforms? Use specific examples in your analysis.',
    analytical_question_bg: 'Как дигиталните екосистеми създават по-силни конкурентни предимства в сравнение със самостоятелните платформи?',
    application_question_en: 'Could your startup idea become part of or create a digital ecosystem? What complementary products or services would strengthen your value proposition?',
    application_question_bg: 'Може ли вашата стартъп идея да стане част от или да създаде дигитална екосистема? Какви допълващи продукти или услуги биха укрепили вашето ценностно предложение?',
    display_order: 5,
    related_case_topic: 'AI',
    case_transition_en: 'You just learned about digital ecosystems. Now analyze how AI-powered smart cities create interconnected value.',
    case_transition_bg: 'Току-що научихте за дигиталните екосистеми. Сега анализирайте как умните градове с AI създават взаимосвързана стойност.',
    related_sim_concepts_en: ['Digital Ecosystems', 'API Strategy'],
    related_sim_concepts_bg: ['Дигитални екосистеми', 'API стратегия'],
    sim_transition_en: 'Apply ecosystem thinking in the startup simulator to build a stronger product.',
    sim_transition_bg: 'Приложете екосистемно мислене в стартъп симулатора, за да изградите по-силен продукт.',
  },
  /* ── Level 2: Business Fundamentals ── */
  {
    slug: 'marketing-fundamentals',
    title_en: 'Marketing Fundamentals',
    title_bg: 'Основи на маркетинга',
    level: 2,
    startup_field: 'customer',
    theory_en: `Marketing is the process of creating, communicating, and delivering value to customers. For startups, marketing is not about big budgets — it's about deeply understanding your audience and crafting the right message.

The **4Ps framework** (Product, Price, Place, Promotion) remains a useful lens. But modern digital marketing adds a critical fifth: **People**. Understanding your customer persona — their pain points, habits, and decision-making process — is the foundation of everything.

**Content marketing** builds trust over time. Blog posts, videos, and social media create awareness without hard-selling. **Performance marketing** (Google Ads, Meta Ads) delivers measurable results but requires budget and optimization skills.

The **marketing funnel** maps the customer journey: Awareness → Interest → Consideration → Conversion → Retention. Most startups focus too much on acquisition and too little on retention. Yet retaining an existing customer is **5–7x cheaper** than acquiring a new one.

**Growth hacking** combines marketing creativity with data analytics. Dropbox's referral program (give storage, get storage) is a classic example — it grew users 3900% in 15 months with almost zero ad spend.

Key metrics to track: **CAC** (cost to acquire), **LTV** (lifetime value), **conversion rate**, **churn rate**, and **NPS** (Net Promoter Score). Data-driven marketing means making decisions based on these numbers, not gut feelings.`,
    theory_bg: `Маркетингът е процесът на създаване, комуникиране и доставяне на стойност до клиентите. За стартъпи маркетингът не е за големи бюджети — а за дълбоко разбиране на аудиторията и правилното послание.

**Рамката 4P** (Продукт, Цена, Място, Промоция) остава полезна. Но модерният дигитален маркетинг добавя критично пето P: **Хора (People)**. Разбирането на клиентската персона — болки, навици и процес на вземане на решения — е основата на всичко.

**Контент маркетингът** изгражда доверие с времето. **Пърформанс маркетингът** (Google Ads, Meta Ads) дава измерими резултати, но изисква бюджет и оптимизация.

**Маркетинговата фуния** описва пътя на клиента: Осведоменост → Интерес → Обмисляне → Конверсия → Задържане. Повечето стартъпи се фокусират прекалено върху придобиване и твърде малко върху задържане. Задържането на съществуващ клиент е **5–7 пъти по-евтино** от придобиването на нов.

**Growth hacking** комбинира маркетингова креативност с анализ на данни. Програмата за препоръки на Dropbox е класически пример — нарасна с 3900% за 15 месеца почти без рекламен бюджет.

Ключови метрики: **CAC**, **LTV**, **конверсионен процент**, **churn rate** и **NPS**. Маркетинг, базиран на данни, означава решения на база числа, не интуиция.`,
    quiz_questions: [
      { id: 'mf1', question_en: 'What is the marketing funnel?', question_bg: 'Какво е маркетинговата фуния?', options: [{ id: 'a', en: 'A physical tool for pouring ads', bg: 'Физически инструмент за реклами', correct: false }, { id: 'b', en: 'A model mapping the customer journey from awareness to retention', bg: 'Модел на пътя на клиента от осведоменост до задържане', correct: true }, { id: 'c', en: 'A pricing strategy', bg: 'Ценова стратегия', correct: false }] },
      { id: 'mf2', question_en: 'Why is customer retention cheaper than acquisition?', question_bg: 'Защо задържането на клиенти е по-евтино от привличането?', options: [{ id: 'a', en: 'Existing customers already trust your brand', bg: 'Съществуващите клиенти вече имат доверие', correct: true }, { id: 'b', en: 'Retention requires no effort', bg: 'Задържането не изисква усилия', correct: false }, { id: 'c', en: 'New customers are always more expensive to serve', bg: 'Новите клиенти винаги струват повече за обслужване', correct: false }] },
      { id: 'mf3', question_en: 'What made Dropbox\'s referral program successful?', question_bg: 'Какво направи програмата за препоръки на Dropbox успешна?', options: [{ id: 'a', en: 'Massive TV advertising', bg: 'Масивна телевизионна реклама', correct: false }, { id: 'b', en: 'Both referrer and referred got value (free storage)', bg: 'И двете страни получаваха стойност (безплатно пространство)', correct: true }, { id: 'c', en: 'They paid influencers', bg: 'Плащали са на инфлуенсъри', correct: false }] },
    ],
    analytical_question_en: 'Compare content marketing with performance marketing. When should a startup prioritize each approach, and what are the trade-offs?',
    analytical_question_bg: 'Сравнете контент маркетинга с пърформанс маркетинга. Кога стартъп трябва да приоритизира всеки подход и какви са компромисите?',
    application_question_en: 'Design a marketing strategy for your startup idea. Which channels would you use in the first 6 months, and how would you measure success?',
    application_question_bg: 'Проектирайте маркетингова стратегия за вашата стартъп идея. Кои канали бихте използвали в първите 6 месеца и как бихте измервали успеха?',
    display_order: 6,
    related_case_topic: 'FinTech',
    case_transition_en: 'You learned marketing fundamentals. Now analyze how FinTech startups acquire and retain customers in competitive markets.',
    case_transition_bg: 'Научихте основите на маркетинга. Сега анализирайте как FinTech стартъпите привличат и задържат клиенти.',
    sim_transition_en: 'Apply your marketing strategy in the startup simulator to see how channel choices affect growth.',
    sim_transition_bg: 'Приложете маркетинговата си стратегия в стартъп симулатора, за да видите как изборът на канали влияе на растежа.',
  },
  {
    slug: 'pricing-and-revenue',
    title_en: 'Pricing & Revenue Models',
    title_bg: 'Ценообразуване и приходни модели',
    level: 2,
    startup_field: 'business_model',
    theory_en: `Pricing is one of the most powerful levers for startup success — and one of the most neglected. A 1% improvement in pricing can boost profits by 11%, more than any other business lever.

**Cost-based pricing** sets prices by adding a margin to costs. It's simple but ignores what customers are willing to pay. **Value-based pricing** sets prices based on perceived customer value — this is the gold standard for startups because it captures more of the value you create.

Common revenue models for digital startups:

- **Freemium**: Free basic tier, paid premium features (Spotify, Slack). Works when free users create network effects or convert over time.
- **Subscription (SaaS)**: Monthly/annual recurring revenue (Netflix, Salesforce). Creates predictable cash flow and high LTV.
- **Transaction fee**: Take a percentage of each transaction (Stripe, Uber). Scales with customer success.
- **Marketplace commission**: Charge sellers or buyers per transaction (Airbnb, eBay). Requires critical mass on both sides.
- **Advertising**: Monetize attention (Google, Instagram). Requires massive scale to be profitable.

**Unit economics** is the foundation: Revenue per customer (LTV) must exceed Cost per customer (CAC + COGS). The **payback period** — how long until you recover CAC — determines how fast you can grow.

**Pricing psychology** matters: Anchoring (show the expensive plan first), decoy pricing (add an unattractive option to make another look better), and ending prices in 9 or 7 all influence decisions.

The best approach is to **start higher** than you think. It's easier to lower prices than raise them. And always test — A/B test pricing pages, run experiments with different segments, and iterate based on data.`,
    theory_bg: `Ценообразуването е един от най-мощните лостове за успех на стартъп — и един от най-пренебрегваните. 1% подобрение в ценообразуването може да увеличи печалбите с 11%.

**Разходно ценообразуване** определя цени чрез добавяне на марж. **Ценообразуване базирано на стойност** определя цени въз основа на възприеманата клиентска стойност — златният стандарт за стартъпи.

Често срещани приходни модели за дигитални стартъпи:

- **Freemium**: Безплатно основно ниво, платени премиум функции (Spotify, Slack). Работи когато безплатните потребители създават мрежови ефекти.
- **Абонамент (SaaS)**: Месечен/годишен рекурентен приход (Netflix, Salesforce). Създава предсказуем паричен поток.
- **Такса за транзакция**: Процент от всяка транзакция (Stripe, Uber). Мащабира се с успеха на клиента.
- **Комисионна на маркетплейс**: Такса за продавачи или купувачи (Airbnb, eBay). Изисква критична маса.
- **Реклама**: Монетизиране на вниманието (Google, Instagram). Изисква огромен мащаб.

**Unit economics** е основата: Приходът на клиент (LTV) трябва да надвишава Разходите на клиент (CAC + COGS). **Периодът на изплащане** определя колко бързо можете да растете.

**Психология на ценообразуването** има значение: Закотвяне, примамливо ценообразуване и числа, завършващи на 9 или 7, влияят на решенията.

Най-добрият подход е да **започнете по-високо** отколкото мислите. По-лесно е да намалите цените. И винаги тествайте — A/B тест на ценови страници и експерименти.`,
    quiz_questions: [
      { id: 'pr1', question_en: 'What is value-based pricing?', question_bg: 'Какво е ценообразуване базирано на стойност?', options: [{ id: 'a', en: 'Setting prices based on perceived customer value', bg: 'Определяне на цени въз основа на възприеманата клиентска стойност', correct: true }, { id: 'b', en: 'Adding a fixed margin to production costs', bg: 'Добавяне на фиксиран марж към производствените разходи', correct: false }, { id: 'c', en: 'Matching competitor prices', bg: 'Съвпадение с цените на конкурентите', correct: false }] },
      { id: 'pr2', question_en: 'Which revenue model creates the most predictable cash flow?', question_bg: 'Кой приходен модел създава най-предсказуем паричен поток?', options: [{ id: 'a', en: 'One-time product sales', bg: 'Еднократна продажба на продукти', correct: false }, { id: 'b', en: 'Subscription (SaaS)', bg: 'Абонамент (SaaS)', correct: true }, { id: 'c', en: 'Advertising', bg: 'Реклама', correct: false }] },
      { id: 'pr3', question_en: 'Why should startups "start higher" with pricing?', question_bg: 'Защо стартъпите трябва да „започнат по-високо" с ценообразуването?', options: [{ id: 'a', en: 'It\'s easier to lower prices than raise them', bg: 'По-лесно е да се намалят цените, отколкото да се вдигнат', correct: true }, { id: 'b', en: 'High prices always mean more profit', bg: 'Високите цени винаги означават повече печалба', correct: false }, { id: 'c', en: 'Customers prefer expensive products', bg: 'Клиентите предпочитат скъпи продукти', correct: false }] },
    ],
    analytical_question_en: 'Compare freemium, subscription, and transaction-based revenue models. What type of startup is each model best suited for, and what are the risks of choosing the wrong model?',
    analytical_question_bg: 'Сравнете freemium, абонаментен и транзакционен приходен модел. За кой тип стартъп е най-подходящ всеки модел и какви са рисковете от грешен избор?',
    application_question_en: 'What pricing and revenue model would you choose for your startup idea? Justify your choice with unit economics reasoning (estimated CAC, LTV, payback period).',
    application_question_bg: 'Какъв ценови и приходен модел бихте избрали за вашата стартъп идея? Обосновете избора си с unit economics (прогнозен CAC, LTV, период на изплащане).',
    display_order: 7,
    related_case_topic: 'Platform Economy',
    case_transition_en: 'You learned about pricing and revenue. Now analyze how platform businesses monetize their networks.',
    case_transition_bg: 'Научихте за ценообразуване и приходи. Сега анализирайте как платформените бизнеси монетизират мрежите си.',
    sim_transition_en: 'Test different pricing strategies in the startup simulator to see their impact on growth and revenue.',
    sim_transition_bg: 'Тествайте различни ценови стратегии в стартъп симулатора, за да видите въздействието им върху растежа и приходите.',
  },
  /* ── Level 2: Team & Roles ── */
  {
    slug: 'team-and-roles',
    title_en: 'Team & Roles',
    title_bg: 'Екип и роли',
    level: 2,
    startup_field: 'bmc_key_activities',
    theory_en: `A startup is only as strong as its founding team. Investors often say they bet on people first, ideas second. But building the right team is not just about talent — it's about **complementary skills** and **clear roles**.

Every early-stage startup needs three core functions covered:

1. **The Builder** (CTO / Technical Lead) — builds the product, makes technology decisions, manages development.
2. **The Seller** (CEO / Business Lead) — talks to customers, closes deals, raises funding, sets vision.
3. **The Designer** (CPO / Product Lead) — understands user needs, designs the experience, bridges tech and business.

One person can cover multiple roles, but all three functions must exist. The most common startup failure pattern is **all-technical teams** (great product, no customers) or **all-business teams** (great pitch, no product).

**Equity splits** should be discussed early. The 50/50 split sounds fair but often creates deadlocks. A better approach: give the person with the most commitment and risk a slight majority, and use **vesting schedules** (typically 4 years with a 1-year cliff) to protect against early departures.

**Hiring your first employees** is a critical moment. Early hires shape company culture. Prioritize attitude and learning speed over experience. A motivated generalist is more valuable than an expensive specialist at this stage.

**Remote vs. co-located** teams: Remote offers access to global talent and lower costs. Co-located teams iterate faster and build stronger culture. Many startups use a hybrid model — remote-first with regular in-person sprints.

Key principle: **Hire slow, fire fast.** A wrong hire at an early stage can destroy team morale and waste months of runway.`,
    theory_bg: `Стартъпът е толкова силен, колкото е основаващият му екип. Инвеститорите често казват, че залагат на хората, а не на идеите. Но изграждането на правилния екип не е само за талант — а за **допълващи се умения** и **ясни роли**.

Всеки ранен стартъп се нуждае от три основни функции:

1. **Строителят** (CTO / Технически лидер) — изгражда продукта, взема технологични решения.
2. **Продавачът** (CEO / Бизнес лидер) — говори с клиенти, затваря сделки, привлича финансиране.
3. **Дизайнерът** (CPO / Продуктов лидер) — разбира нуждите на потребителите, проектира преживяването.

Един човек може да покрива няколко роли, но и трите функции трябва да съществуват. Най-честият модел на провал е **изцяло технически екип** (страхотен продукт, няма клиенти) или **изцяло бизнес екип** (страхотна презентация, няма продукт).

**Разпределението на дялове** трябва да се обсъди рано. Разделянето 50/50 звучи справедливо, но често създава задънки. По-добрият подход: дайте лекно мнозинство на човека с най-голям ангажимент и използвайте **вестинг график** (обикновено 4 години с 1-годишен cliff).

**Наемането на първите служители** оформя фирмената култура. Приоритизирайте нагласа и скорост на учене пред опит.

Ключов принцип: **Наемай бавно, уволнявай бързо.** Грешен служител на ранен етап може да унищожи морала и да пропилее месеци.`,
    quiz_questions: [
      { id: 'tr1', question_en: 'What are the three core functions every startup needs?', question_bg: 'Кои са трите основни функции, от които всеки стартъп се нуждае?', options: [{ id: 'a', en: 'Builder, Seller, Designer', bg: 'Строител, Продавач, Дизайнер', correct: true }, { id: 'b', en: 'CEO, CFO, COO', bg: 'CEO, CFO, COO', correct: false }, { id: 'c', en: 'Marketing, Sales, Support', bg: 'Маркетинг, Продажби, Поддръжка', correct: false }] },
      { id: 'tr2', question_en: 'What is a vesting schedule?', question_bg: 'Какво е вестинг график?', options: [{ id: 'a', en: 'A timeline for earning equity over time to prevent early departures', bg: 'График за придобиване на дялове с времето, за да се предотврати ранно напускане', correct: true }, { id: 'b', en: 'A schedule for team meetings', bg: 'График за екипни срещи', correct: false }, { id: 'c', en: 'A payment plan for investors', bg: 'План за плащане на инвеститори', correct: false }] },
      { id: 'tr3', question_en: 'Why is "hire slow, fire fast" important for startups?', question_bg: 'Защо „наемай бавно, уволнявай бързо" е важно за стартъпи?', options: [{ id: 'a', en: 'A wrong early hire destroys morale and wastes runway', bg: 'Грешен ранен служител унищожава морала и пропилява ресурси', correct: true }, { id: 'b', en: 'It saves money on salaries', bg: 'Спестява пари от заплати', correct: false }, { id: 'c', en: 'It makes the company look more exclusive', bg: 'Прави компанията да изглежда по-ексклузивна', correct: false }] },
    ],
    analytical_question_en: 'Why do all-technical teams or all-business teams often fail? What makes a balanced founding team more likely to succeed?',
    analytical_question_bg: 'Защо изцяло технически или изцяло бизнес екипи често се провалят? Какво прави балансирания основателски екип по-вероятно успешен?',
    application_question_en: 'Define the key roles your startup needs in its first 6 months. Who would you hire first, and what skills would you prioritize? How would you split equity among co-founders?',
    application_question_bg: 'Определете ключовите роли, от които вашият стартъп се нуждае през първите 6 месеца. Кого бихте наели първо и какви умения бихте приоритизирали? Как бихте разпределили дяловете между съоснователите?',
    display_order: 8,
    sim_transition_en: 'Apply your team-building insights in the startup simulator hiring decisions.',
    sim_transition_bg: 'Приложете знанията си за изграждане на екип в решенията за наемане в стартъп симулатора.',
  },
  /* ── Level 2: Operations ── */
  {
    slug: 'operations-fundamentals',
    title_en: 'Operations & Processes',
    title_bg: 'Операции и процеси',
    level: 2,
    startup_field: 'bmc_key_resources',
    theory_en: `Operations is how a startup delivers its promise to customers — repeatedly, reliably, and at scale. A great idea with broken operations will lose to an average idea with excellent execution.

**The value chain** maps every step from raw input to delivered value: sourcing → building → delivering → supporting. Each link must be efficient. Bottlenecks in one area slow down everything.

For digital startups, **key operational processes** include:

1. **Product development cycle** — How fast can you ship features? Agile methodology (2-week sprints, daily standups, retrospectives) is the industry standard. The goal: ship small, learn fast, iterate.
2. **Customer support** — How quickly do you resolve issues? Response time and resolution quality directly affect retention and NPS.
3. **Quality assurance** — How do you prevent bugs and downtime? Automated testing, staging environments, and monitoring tools are essential.

**Standard Operating Procedures (SOPs)** document how things should be done. They seem bureaucratic, but they enable scaling. Without SOPs, every new team member reinvents processes, creating inconsistency.

**Automation** is the startup superpower. Automate repetitive tasks: email sequences, invoice generation, data entry, deployment. Tools like Zapier, n8n, and custom scripts free up human time for creative work.

**Metrics that matter**: Lead time (idea to production), cycle time (start to finish of one task), error rate, customer support response time, and system uptime. What you don't measure, you can't improve.

**Lean operations** means eliminating waste: unnecessary steps, overproduction, waiting time, and unused talent. The Toyota Production System principles apply perfectly to digital startups.`,
    theory_bg: `Операциите са как стартъпът изпълнява обещанието си към клиентите — многократно, надеждно и в мащаб. Страхотна идея с лоши операции ще загуби срещу средна идея с отлично изпълнение.

**Веригата на стойността** описва всяка стъпка от суровия вход до доставената стойност: снабдяване → изграждане → доставка → поддръжка. Всяко звено трябва да е ефективно.

За дигитални стартъпи, **ключови оперативни процеси** включват:

1. **Цикъл на разработка** — Колко бързо можете да пуснете функции? Agile методологията (2-седмични спринтове, ежедневни срещи) е стандартът.
2. **Клиентска поддръжка** — Колко бързо решавате проблеми? Времето за отговор директно влияе на задържането.
3. **Осигуряване на качество** — Как предотвратявате грешки? Автоматизирано тестване и мониторинг са основни.

**Стандартни оперативни процедури (SOPs)** документират как нещата трябва да се правят. Изглеждат бюрократични, но позволяват мащабиране.

**Автоматизацията** е суперсила на стартъпа. Автоматизирайте повтарящи се задачи: email последователности, фактуриране, деплоймънт.

**Lean операции** означава елиминиране на разхищение: ненужни стъпки, свръхпроизводство, чакане и неизползван талант.`,
    quiz_questions: [
      { id: 'op1', question_en: 'What is the value chain?', question_bg: 'Какво е веригата на стойността?', options: [{ id: 'a', en: 'Every step from input to delivered value', bg: 'Всяка стъпка от вход до доставена стойност', correct: true }, { id: 'b', en: 'A blockchain technology', bg: 'Блокчейн технология', correct: false }, { id: 'c', en: 'The company org chart', bg: 'Организационната схема на компанията', correct: false }] },
      { id: 'op2', question_en: 'Why are SOPs important for startups?', question_bg: 'Защо SOPs са важни за стартъпите?', options: [{ id: 'a', en: 'They enable consistent scaling and onboarding', bg: 'Позволяват последователно мащабиране и въвеждане на нови хора', correct: true }, { id: 'b', en: 'They are legally required', bg: 'Изискват се по закон', correct: false }, { id: 'c', en: 'They replace the need for management', bg: 'Заменят нуждата от управление', correct: false }] },
      { id: 'op3', question_en: 'What is the main principle of lean operations?', question_bg: 'Какъв е основният принцип на lean операциите?', options: [{ id: 'a', en: 'Eliminate waste in every process', bg: 'Елиминирай разхищението във всеки процес', correct: true }, { id: 'b', en: 'Hire as few people as possible', bg: 'Наеми колкото може по-малко хора', correct: false }, { id: 'c', en: 'Use only free tools', bg: 'Използвай само безплатни инструменти', correct: false }] },
    ],
    analytical_question_en: 'Why does operational excellence matter more than a great idea for long-term startup success? Give examples of companies that won through execution rather than innovation.',
    analytical_question_bg: 'Защо оперативното съвършенство е по-важно от страхотна идея за дългосрочния успех? Дайте примери на компании, които печелят чрез изпълнение, а не иновация.',
    application_question_en: 'Map the key operational processes your startup needs to deliver its product. Identify one bottleneck and propose how to solve it through automation or process redesign.',
    application_question_bg: 'Опишете ключовите оперативни процеси, от които вашият стартъп се нуждае. Идентифицирайте едно тесно място и предложете как да го решите чрез автоматизация или преструктуриране.',
    display_order: 9,
    sim_transition_en: 'Apply operational thinking in the simulator to optimize your startup execution.',
    sim_transition_bg: 'Приложете оперативно мислене в симулатора, за да оптимизирате изпълнението на стартъпа.',
  },
  /* ── Level 2: Supply Chain ── */
  {
    slug: 'supply-chain-basics',
    title_en: 'Supply Chain Basics',
    title_bg: 'Основи на веригата за доставки',
    level: 2,
    theory_en: `Even digital startups have a supply chain — the network of resources, processes, and partners needed to deliver your product to customers. Understanding supply chain basics helps founders make smarter decisions about partnerships, costs, and scalability.

**Traditional supply chain**: Raw materials → Manufacturing → Distribution → Retail → Customer. Each step adds cost and time.

**Digital supply chain**: Content/Data → Processing/Platform → Distribution (Internet) → User. The steps are compressed, but dependencies still exist: cloud hosting (AWS, GCP), payment processors (Stripe), API providers, and data sources.

**Key concepts**:

- **Upstream vs. Downstream**: Upstream = your suppliers and partners. Downstream = your distribution and customers. Control over both sides gives you power.
- **Just-in-Time (JIT)**: Minimize inventory and produce on demand. Amazon's fulfillment network is a masterclass in JIT at scale.
- **Single point of failure**: If one supplier or service goes down, can your business survive? Diversification reduces risk.

**For digital startups**, supply chain thinking applies to:

1. **Tech stack dependencies** — Which services are you dependent on? If Stripe goes down, can you still process payments?
2. **Content pipeline** — Where does your content come from? User-generated, curated, or created? Each has different scalability.
3. **Partnership dependencies** — Do you rely on one platform (e.g., Instagram algorithm) for distribution? That's supply chain risk.
4. **Delivery logistics** — For startups with physical components (D2C, food delivery), last-mile delivery is the most expensive link.

**Cost optimization**: Negotiate with suppliers as you scale. Volume discounts, long-term contracts, and strategic partnerships can reduce costs by 20-40%.

The supply chain mindset helps you see your startup not as an isolated product, but as part of a larger ecosystem of dependencies and value flows.`,
    theory_bg: `Дори дигиталните стартъпи имат верига за доставки — мрежата от ресурси, процеси и партньори, необходими за доставяне на продукта до клиентите.

**Традиционна верига**: Суровини → Производство → Дистрибуция → Търговия → Клиент. Всяка стъпка добавя разход и време.

**Дигитална верига**: Съдържание/Данни → Обработка/Платформа → Дистрибуция (Интернет) → Потребител. Стъпките са компресирани, но зависимости съществуват: облачен хостинг (AWS), платежни процесори (Stripe), API доставчици.

**Ключови концепции**:

- **Upstream vs. Downstream**: Upstream = вашите доставчици. Downstream = вашата дистрибуция и клиенти.
- **Just-in-Time (JIT)**: Минимизирайте запасите и произвеждайте по заявка.
- **Единична точка на отказ**: Ако един доставчик или услуга спре, може ли бизнесът ви да оцелее?

**За дигитални стартъпи** веригата за доставки означава:

1. **Зависимости от технологичния стак** — От кои услуги зависите?
2. **Тръбопровод за съдържание** — Откъде идва съдържанието ви?
3. **Партньорски зависимости** — Разчитате ли на една платформа за дистрибуция?
4. **Логистика на доставка** — За стартъпи с физически компоненти, доставката на последната миля е най-скъпото звено.

**Оптимизация на разходите**: Договаряйте с доставчици при мащабиране. Отстъпки за обем и стратегически партньорства могат да намалят разходите с 20-40%.`,
    quiz_questions: [
      { id: 'sc1', question_en: 'What is a digital supply chain?', question_bg: 'Какво е дигитална верига за доставки?', options: [{ id: 'a', en: 'The network of tech services, partners, and processes needed to deliver a digital product', bg: 'Мрежата от технологични услуги, партньори и процеси за доставяне на дигитален продукт', correct: true }, { id: 'b', en: 'A blockchain for tracking shipments', bg: 'Блокчейн за проследяване на пратки', correct: false }, { id: 'c', en: 'An online store inventory system', bg: 'Система за инвентар на онлайн магазин', correct: false }] },
      { id: 'sc2', question_en: 'What is a "single point of failure" in a supply chain?', question_bg: 'Какво е „единична точка на отказ" във верига за доставки?', options: [{ id: 'a', en: 'A dependency that, if disrupted, stops the entire business', bg: 'Зависимост, която ако се наруши, спира целия бизнес', correct: true }, { id: 'b', en: 'The weakest team member', bg: 'Най-слабият член на екипа', correct: false }, { id: 'c', en: 'A bug in the software', bg: 'Бъг в софтуера', correct: false }] },
      { id: 'sc3', question_en: 'Why is platform dependency a supply chain risk?', question_bg: 'Защо зависимостта от платформа е риск за веригата за доставки?', options: [{ id: 'a', en: 'Algorithm changes can cut your distribution overnight', bg: 'Промени в алгоритъма могат да отрежат дистрибуцията ви за една нощ', correct: true }, { id: 'b', en: 'Platforms always charge too much', bg: 'Платформите винаги таксуват прекалено', correct: false }, { id: 'c', en: 'Platforms are unreliable technically', bg: 'Платформите са технически ненадеждни', correct: false }] },
    ],
    analytical_question_en: 'How does supply chain thinking apply to digital startups differently from traditional businesses? Identify the key dependencies a SaaS startup has and explain the risks.',
    analytical_question_bg: 'Как мисленето за верига за доставки се различава за дигитални стартъпи спрямо традиционни бизнеси? Идентифицирайте ключовите зависимости на SaaS стартъп.',
    application_question_en: 'Map your startup\'s supply chain — what are your key dependencies (tech, content, distribution, partners)? Identify at least one single point of failure and propose a mitigation strategy.',
    application_question_bg: 'Опишете веригата за доставки на вашия стартъп — какви са ключовите зависимости (технология, съдържание, дистрибуция, партньори)? Идентифицирайте поне една единична точка на отказ и предложете стратегия за смекчаване.',
    display_order: 10,
    sim_transition_en: 'Consider supply chain dependencies when making decisions in the startup simulator.',
    sim_transition_bg: 'Помислете за зависимостите на веригата за доставки, когато вземате решения в стартъп симулатора.',
  },
];

// Reverse mapping: case topic keyword → module slug
export const CASE_TOPIC_TO_MODULE: Record<string, string> = {
  'Platform Economy': 'network-effects',
  'Network Effects': 'network-effects',
  'FinTech': 'customer-acquisition-cost',
  'FinTech Disruption': 'customer-acquisition-cost',
  'EdTech': 'product-market-fit',
  'AI': 'digital-ecosystems',
  'AI Smart Cities': 'digital-ecosystems',
  'Digital Twin': 'digital-ecosystems',
  'Spotify': 'platform-business-models',
  'Algorithm Economy': 'platform-business-models',
};

/** Get modules by level */
export const LEVEL_1_MODULES = LEARNING_MODULES.filter(m => (m.level || 1) === 1);
export const LEVEL_2_MODULES = LEARNING_MODULES.filter(m => m.level === 2);

export const LEVEL_INFO = {
  1: {
    en: 'Innovation Thinking',
    bg: 'Иновационно мислене',
    desc_en: 'Master the foundations of digital innovation, network effects, and platform strategy.',
    desc_bg: 'Овладейте основите на дигиталната иновация, мрежовите ефекти и платформената стратегия.',
  },
  2: {
    en: 'Business Fundamentals',
    bg: 'Бизнес основи',
    desc_en: 'Marketing, pricing, team building, operations, and supply chain — the business skills every founder needs.',
    desc_bg: 'Маркетинг, ценообразуване, екип, операции и верига за доставки — бизнес уменията за всеки основател.',
  },
} as const;
