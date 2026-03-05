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
  },
];
