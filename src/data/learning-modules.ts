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

export interface CaseAnalyticalQuestion {
  id: string;
  question_en: string;
  question_bg: string;
}

export interface EmbeddedCaseStudy {
  title_en: string;
  title_bg: string;
  learning_goal_en: string;
  learning_goal_bg: string;
  context_en: string;
  context_bg: string;
  problem_en: string;
  problem_bg: string;
  key_decision_en: string;
  key_decision_bg: string;
  outcome_en: string;
  outcome_bg: string;
  outcome_type: 'success' | 'failure' | 'mixed';
  analytical_questions: CaseAnalyticalQuestion[];
}

/** Structured concept card displayed in the Concept Layer */
export interface ConceptCard {
  id: string;
  name_en: string;
  name_bg: string;
  explanation_en: string;
  explanation_bg: string;
  example_en: string;
  example_bg: string;
  takeaway_en: string;
  takeaway_bg: string;
}

/** Simulator decision option */
export interface SimDecisionOption {
  id: string;
  label_en: string;
  label_bg: string;
  description_en: string;
  description_bg: string;
}

/** Simulator decision embedded in a learning module */
export interface SimulatorDecision {
  scenario_en: string;
  scenario_bg: string;
  question_en: string;
  question_bg: string;
  options: SimDecisionOption[];
}

/** Theory Block 1: Hook — why this matters */
export interface TheoryHook {
  en: string;
  bg: string;
}

/** Theory Block 3: Named framework */
export interface TheoryFramework {
  name: string;
  bullets_en: string[];
  bullets_bg: string[];
  apply_en: string;
  apply_bg: string;
}

/** Theory Block 2: Visual metaphor */
export interface TheoryMetaphor {
  en: string;
  bg: string;
}

/** Theory Block 4: Provocative questions */
export interface TheoryProvocation {
  en: string;
  bg: string;
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
  /** Embedded real-world case study for Level 2+ modules */
  embedded_case?: EmbeddedCaseStudy;
  /** Structured concept cards for the Concept Layer */
  concepts?: ConceptCard[];
  /** Simulator decision for the Decision Layer */
  simulator_decision?: SimulatorDecision;
  // Theory-to-Case mapping
  related_case_topic?: string;
  case_transition_en?: string;
  case_transition_bg?: string;
  // Theory-to-Simulator mapping
  related_sim_concepts_en?: string[];
  related_sim_concepts_bg?: string[];
  sim_transition_en?: string;
  sim_transition_bg?: string;
  // Theory redesign blocks
  hook?: TheoryHook;
  framework?: TheoryFramework;
  metaphor?: TheoryMetaphor;
  provocations?: TheoryProvocation[];
}

export const LEARNING_MODULES: LearningModule[] = [
  {
    slug: 'network-effects',
    title_en: 'Network Effects',
    title_bg: 'Мрежови ефекти',
    hook: { en: 'If your app has 10 users and the competitor has 1,000, you\'re doomed — unless you understand how network effects work and how to build them from zero.', bg: 'Ако имаш приложение с 10 потребители и конкурентът има 1000, ти си обречен — освен ако не разбираш как мрежовите ефекти работят и как да ги изградиш от нулата.' },
    metaphor: { en: '1 user = 1 connection. 10 users = 45 connections. 100 users = 4,950 connections. Value grows quadratically.', bg: 'Представи си: 1 потребител = 1 връзка. 10 потребители = 45 връзки. 100 потребители = 4950 връзки. Стойността расте квадратично.' },
    framework: { name: "Metcalfe's Law", bullets_en: ['The value of a network is proportional to the square of the number of users (n²)', 'Explains why platforms become near-monopolies after reaching critical mass', 'Applies to social networks, marketplaces, and communication tools'], bullets_bg: ['Стойността на мрежата е пропорционална на квадрата на броя потребители (n²)', 'Обяснява защо платформите стават почти монополи след критична маса', 'Прилага се за социални мрежи, пазари и комуникационни инструменти'], apply_en: 'Calculate n² for your startup: what is your critical mass number?', apply_bg: 'Изчисли n² за стартъпа си: какъв е твоят брой за критична маса?' },
    provocations: [{ en: 'When do network effects kill a platform instead of growing it?', bg: 'Кога мрежовият ефект убива платформата вместо да я развие?' }, { en: 'Why did WhatsApp refuse ads while Facebook embraced them?', bg: 'Защо WhatsApp отказа реклами, докато Facebook ги прие?' }],
    concepts: [
      {
        id: 'ne-concept-1',
        name_en: 'Network Effects',
        name_bg: 'Мрежови ефекти',
        explanation_en: 'A product becomes more valuable as more people use it, creating a self-reinforcing growth loop.',
        explanation_bg: 'Продуктът става по-ценен с увеличаване на потребителите, създавайки самоподсилващ се цикъл на растеж.',
        example_en: 'WhatsApp — every new user makes the app more valuable for existing users because there are more people to message.',
        example_bg: 'WhatsApp — всеки нов потребител прави приложението по-ценно за съществуващите, защото има повече хора за комуникация.',
        takeaway_en: 'Network effects create winner-take-all markets where the largest platform dominates.',
        takeaway_bg: 'Мрежовите ефекти създават пазари, където победителят взема всичко.',
      },
      {
        id: 'ne-concept-2',
        name_en: 'Direct vs. Indirect Network Effects',
        name_bg: 'Директни vs. индиректни мрежови ефекти',
        explanation_en: 'Direct: same-side users benefit each other (social networks). Indirect: one user group benefits from a different group (marketplaces).',
        explanation_bg: 'Директни: потребители от същата страна се възползват взаимно. Индиректни: една група потребители се възползва от друга група.',
        example_en: 'Uber — more drivers attract more riders (indirect), while riders don\'t directly benefit from other riders (no direct effect).',
        example_bg: 'Uber — повече шофьори привличат повече пътници (индиректен), докато пътниците не се възползват директно от други пътници.',
        takeaway_en: 'Understanding which type of network effect your product creates determines your growth strategy.',
        takeaway_bg: 'Разбирането на типа мрежови ефект определя стратегията ви за растеж.',
      },
      {
        id: 'ne-concept-3',
        name_en: 'Critical Mass',
        name_bg: 'Критична маса',
        explanation_en: 'The minimum number of users needed before network effects kick in and the platform becomes self-sustaining.',
        explanation_bg: 'Минималният брой потребители, необходим преди мрежовите ефекти да се активират и платформата да стане самоподдържаща се.',
        example_en: 'Facebook initially launched only at Harvard, reaching critical mass at one university before expanding to others.',
        example_bg: 'Facebook първоначално стартира само в Харвард, достигайки критична маса в един университет, преди да се разшири.',
        takeaway_en: 'Start narrow — dominate one small market before expanding. Critical mass is easier in a niche.',
        takeaway_bg: 'Започнете тясно — доминирайте един малък пазар, преди да се разширите.',
      },
    ],
    simulator_decision: {
      scenario_en: 'Your social platform has 5,000 users. You need to decide how to grow to critical mass.',
      scenario_bg: 'Вашата социална платформа има 5,000 потребители. Трябва да решите как да достигнете критична маса.',
      question_en: 'Which growth strategy do you choose?',
      question_bg: 'Коя стратегия за растеж избирате?',
      options: [
        { id: 'ne-d1', label_en: 'Subsidize one side', label_bg: 'Субсидирайте една страна', description_en: 'Offer free premium features to creators to attract supply, then monetize demand.', description_bg: 'Предложете безплатни премиум функции на създателите, за да привлечете предлагане, след което монетизирайте търсенето.' },
        { id: 'ne-d2', label_en: 'Viral referral program', label_bg: 'Вирусна програма за препоръки', description_en: 'Give both referrer and referred users extra features. Focus on organic word-of-mouth.', description_bg: 'Дайте на препоръчващия и препоръчания потребител допълнителни функции. Фокусирайте се върху органично разпространение.' },
        { id: 'ne-d3', label_en: 'Paid advertising blitz', label_bg: 'Блиц платена реклама', description_en: 'Spend heavily on ads to rapidly acquire users. Risk: high CAC, users may not stick.', description_bg: 'Харчете значително за реклами за бързо привличане. Риск: висок CAC, потребителите може да не останат.' },
        { id: 'ne-d4', label_en: 'Niche-first strategy', label_bg: 'Стратегия „нишата първо"', description_en: 'Dominate one specific community before expanding. Slower but more sustainable.', description_bg: 'Доминирайте в една конкретна общност преди разширяване. По-бавно, но по-устойчиво.' },
      ],
    },
    embedded_case: {
      title_en: 'Uber: The Network Effects Engine',
      title_bg: 'Uber: Двигателят на мрежовите ефекти',
      learning_goal_en: 'Understand how Uber leveraged indirect network effects to dominate urban mobility and the risks of scaling before profitability.',
      learning_goal_bg: 'Разберете как Uber използва индиректните мрежови ефекти, за да доминира градската мобилност, и рисковете от мащабиране преди рентабилност.',
      context_en: `Uber launched in San Francisco in 2010 as "UberCab" — a luxury black car service accessible via smartphone. By 2015, it had expanded to 60+ countries, raised $10B+, and was valued at $50B+. The key insight was a powerful **indirect network effect**: more drivers meant shorter wait times, which attracted more riders, which attracted more drivers.

Uber's strategy was aggressive: subsidize both sides with investor capital. Drivers received guaranteed minimum earnings. Riders got discounts and free rides. In new cities, Uber would "carpet bomb" — flooding the market with subsidies to reach critical mass quickly, then gradually reducing them.

By 2019, Uber had 3.9 million drivers and 103 million monthly active riders worldwide. But the company was losing $8.5 billion per year. The question: were the network effects strong enough to eventually make the business profitable?`,
      context_bg: `Uber стартира в Сан Франциско през 2010 г. като "UberCab" — луксозна услуга за черни коли, достъпна чрез смартфон. До 2015 г. се разшири в 60+ държави, привлече $10B+ и беше оценен на $50B+. Ключовото прозрение беше мощен **индиректен мрежови ефект**: повече шофьори означаваха по-кратко чакане, което привличаше повече пътници, което привличаше повече шофьори.

Стратегията на Uber беше агресивна: субсидиране на двете страни с капитал от инвеститори. Шофьорите получаваха гарантирани минимални заплати. Пътниците получаваха отстъпки. В нови градове Uber „бомбардираше" пазара със субсидии, за да достигне критична маса бързо.

До 2019 г. Uber имаше 3.9 милиона шофьори и 103 милиона месечни активни пътници. Но компанията губеше $8.5 милиарда годишно.`,
      problem_en: 'Are Uber\'s network effects strong enough to create a defensible market position, or are ride-hailing platforms fundamentally commoditized services where network effects are weak?',
      problem_bg: 'Достатъчно силни ли са мрежовите ефекти на Uber, за да създадат защитима позиция, или платформите за споделено пътуване са фундаментално комодитизирани услуги, където мрежовите ефекти са слаби?',
      key_decision_en: 'Uber chose hyper-aggressive expansion over profitability. They subsidized both sides heavily, accepted billions in losses, and expanded to 10,000+ cities. The bet: once dominant, reduce subsidies and profit from the network effect moat.',
      key_decision_bg: 'Uber избра хиперагресивна експанзия пред рентабилност. Субсидираха двете страни значително, приеха милиарди загуби и се разшириха в 10,000+ града. Залогът: след като доминират, да намалят субсидиите и печелят от мрежовия ефект.',
      outcome_en: 'Mixed results. Uber became the dominant ride-hailing platform in most Western markets but network effects proved **weaker than expected** — drivers and riders easily switch to competitors (Lyft, Bolt) based on pricing. Uber only achieved profitability in 2023, 14 years after founding, by diversifying into food delivery (Uber Eats) and freight. **Lesson: network effects in ride-hailing are local and weak compared to platforms like Facebook or WhatsApp.**',
      outcome_bg: 'Смесени резултати. Uber стана доминираща платформа в повечето западни пазари, но мрежовите ефекти се оказаха **по-слаби от очакваното** — шофьори и пътници лесно превключват към конкуренти (Lyft, Bolt) на база ценообразуване. Uber постигна рентабилност едва през 2023 г., 14 години след основаването, чрез диверсификация в доставката на храна.',
      outcome_type: 'mixed',
      analytical_questions: [
        { id: 'uc1', question_en: 'Why are Uber\'s network effects weaker than those of platforms like Facebook or WhatsApp? What makes some network effects more defensible than others?', question_bg: 'Защо мрежовите ефекти на Uber са по-слаби от тези на Facebook или WhatsApp? Какво прави някои мрежови ефекти по-защитими?' },
        { id: 'uc2', question_en: 'Was Uber\'s "subsidize and expand" strategy the right approach, or should they have focused on profitability in fewer markets? Justify your answer with data.', question_bg: 'Правилен ли беше подходът на Uber „субсидирай и разширявай", или трябваше да се фокусират върху рентабилност в по-малко пазари?' },
      ],
    },
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
    case_transition_bg: 'Току-що научи за мрежовите ефекти. Сега анализирай как Uber ги използва, за да доминира на пазара за мобилност.',
    related_sim_concepts_en: ['Network Effects', 'Platform Scaling'],
    related_sim_concepts_bg: ['Мрежови ефекти', 'Мащабиране на платформа'],
    sim_transition_en: 'Apply network effects strategy in the startup simulator to test how your platform can grow.',
    sim_transition_bg: 'Приложете стратегия за мрежови ефекти в стартъп симулатора, за да тествате как вашата платформа може да расте.',
  },
  {
    slug: 'platform-business-models',
    title_en: 'Platform Business Models',
    title_bg: 'Платформени бизнес модели',
    hook: { en: 'The 5 most valuable companies in the world are all platforms. Zero of them produce physical products. Why?', bg: 'Петте най-скъпи компании в света са платформи. Нито една не произвежда физически продукти. Защо?' },
    metaphor: { en: 'A platform is a nightclub: producers are the DJs, consumers are the dancers, and you set the rules.', bg: 'Платформата е нощен клуб: производителите са DJ-тата, потребителите са танцуващите, а ти определяш правилата.' },
    framework: { name: 'Platform Canvas', bullets_en: ['Producers: who creates value on the platform?', 'Consumers: who consumes and pays?', 'Platform: what rules, filters, and trust mechanisms do you provide?'], bullets_bg: ['Производители: кой създава стойност?', 'Потребители: кой консумира и плаща?', 'Платформа: какви правила и механизми за доверие предоставяш?'], apply_en: 'Map your startup on the Platform Canvas.', apply_bg: 'Начертай стартъпа си на Platform Canvas.' },
    provocations: [{ en: 'Can every business become a platform? When is it a bad idea?', bg: 'Може ли всеки бизнес да стане платформа? Кога е лоша идея?' }, { en: 'Why did Amazon allow competitors to sell on its marketplace?', bg: 'Защо Amazon позволи на конкуренти да продават в маркетплейса му?' }],
    concepts: [
      {
        id: 'pb-concept-1',
        name_en: 'Platform Business Model',
        name_bg: 'Платформен бизнес модел',
        explanation_en: 'A business that creates value by facilitating exchanges between two or more user groups, rather than selling products directly.',
        explanation_bg: 'Бизнес, който създава стойност чрез улесняване на обмени между две или повече потребителски групи.',
        example_en: 'Airbnb connects hosts and guests, taking a commission on each booking without owning any properties.',
        example_bg: 'Airbnb свързва домакини и гости, вземайки комисионна от всяка резервация, без да притежава имоти.',
        takeaway_en: 'Platforms scale faster than traditional businesses because they leverage their community instead of building inventory.',
        takeaway_bg: 'Платформите мащабират по-бързо от традиционните бизнеси, защото използват общността си.',
      },
      {
        id: 'pb-concept-2',
        name_en: 'Chicken-and-Egg Problem',
        name_bg: 'Проблемът кокошка и яйце',
        explanation_en: 'The challenge of attracting both supply and demand sides simultaneously — neither side wants to join without the other.',
        explanation_bg: 'Предизвикателството да привлечете и двете страни едновременно — нито една страна не иска да се присъедини без другата.',
        example_en: 'YouTube initially paid creators to upload videos, solving the supply side first so viewers would follow.',
        example_bg: 'YouTube първоначално плащаше на създатели да качват видеоклипове, решавайки страната на предлагането първо.',
        takeaway_en: 'Most successful platforms solve the chicken-and-egg by subsidizing one side or creating standalone value.',
        takeaway_bg: 'Повечето успешни платформи решават проблема чрез субсидиране на една страна или създаване на самостоятелна стойност.',
      },
      {
        id: 'pb-concept-3',
        name_en: 'Platform Governance',
        name_bg: 'Управление на платформата',
        explanation_en: 'The rules, systems, and mechanisms a platform uses to maintain quality, safety, and trust while allowing openness.',
        explanation_bg: 'Правилата и механизмите, които платформата използва за поддържане на качество, безопасност и доверие.',
        example_en: 'App Store review process — Apple controls which apps are allowed, balancing quality control with developer freedom.',
        example_bg: 'Процесът на преглед на App Store — Apple контролира кои приложения са позволени, балансирайки контрол на качеството със свобода на разработчиците.',
        takeaway_en: 'Too much openness leads to spam; too much control stifles innovation. Great platforms find the balance.',
        takeaway_bg: 'Твърде голяма откритост води до спам; твърде голям контрол задушава иновациите.',
      },
    ],
    simulator_decision: {
      scenario_en: 'Your marketplace platform has 200 sellers but only 50 buyers. Growth has stalled.',
      scenario_bg: 'Вашата маркетплейс платформа има 200 продавачи, но само 50 купувачи. Растежът е спрял.',
      question_en: 'How do you solve the chicken-and-egg problem?',
      question_bg: 'Как решавате проблема кокошка и яйце?',
      options: [
        { id: 'pb-d1', label_en: 'Subsidize buyers', label_bg: 'Субсидирайте купувачите', description_en: 'Offer free credits or discounts to attract demand. Risk: unsustainable without funding.', description_bg: 'Предложете безплатни кредити или отстъпки. Риск: неустойчиво без финансиране.' },
        { id: 'pb-d2', label_en: 'Create standalone value', label_bg: 'Създайте самостоятелна стойност', description_en: 'Build a useful tool for buyers (like a review site) that works without sellers. Convert users later.', description_bg: 'Изградете полезен инструмент за купувачите, който работи без продавачи. Конвертирайте потребителите по-късно.' },
        { id: 'pb-d3', label_en: 'Focus on one niche', label_bg: 'Фокусирайте се в една ниша', description_en: 'Narrow to one product category and dominate it before expanding.', description_bg: 'Стеснете се до една продуктова категория и я доминирайте преди разширяване.' },
      ],
    },
    embedded_case: {
      title_en: 'Spotify: From Piracy Killer to Platform Giant',
      title_bg: 'Spotify: От убиец на пиратството до платформен гигант',
      learning_goal_en: 'Understand how Spotify built a two-sided platform between listeners and artists/labels in a disrupted industry.',
      learning_goal_bg: 'Разберете как Spotify изгради двустранна платформа между слушатели и артисти/лейбъли в нарушена индустрия.',
      context_en: `In 2006, the music industry was in crisis. Napster and LimeWire had normalized free pirated music. CD sales had dropped 50% in 5 years. The industry needed a legal alternative that could compete with "free."

Daniel Ek and Martin Lorentzon founded Spotify in Stockholm with a radical proposition: give users unlimited free music (ad-supported) with a premium tier ($9.99/month for ad-free, offline). They negotiated licenses with major labels by offering guaranteed minimum payments.

The challenge: **how do you build a platform when one side (labels) controls all the content and the other side (listeners) expects music for free?** Spotify needed both — without music, no listeners; without listeners, no label deals.`,
      context_bg: `През 2006 г. музикалната индустрия беше в криза. Napster и LimeWire бяха нормализирали безплатната пиратска музика. Продажбите на CD-та бяха паднали с 50% за 5 години.

Даниел Ек и Мартин Лоренцон основаха Spotify в Стокхолм с радикално предложение: дайте на потребителите неограничена безплатна музика (с реклами) с премиум ниво (€9.99/месец без реклами). Договориха лицензи с големите лейбъли, предлагайки гарантирани минимални плащания.

Предизвикателството: **как да изградите платформа, когато едната страна (лейбъли) контролира цялото съдържание, а другата страна (слушатели) очаква музиката безплатно?**`,
      problem_en: 'How did Spotify solve the platform chicken-and-egg problem in an industry where content owners had all the leverage?',
      problem_bg: 'Как Spotify реши проблема кокошка и яйце в индустрия, където собствениците на съдържание имаха целия лост?',
      key_decision_en: 'Spotify chose a "pay first, earn later" strategy: paying labels guaranteed minimums before having enough subscribers to cover costs. They used the freemium model (free ad-supported tier) to acquire users cheaply, then convert them to premium. This solved the chicken-and-egg: labels joined because of guaranteed payments; users joined because of free access.',
      key_decision_bg: 'Spotify избра стратегия „плати първо, печели после": плащайки на лейбълите гарантирани минимуми преди да имат достатъчно абонати. Използваха freemium модела (безплатно ниво с реклами), за да привлекат потребители евтино, след което да ги конвертират в премиум.',
      outcome_en: 'Spotify became the world\'s largest music streaming platform with 600M+ users and 220M+ paid subscribers by 2024. It transformed an industry from piracy to legal streaming. However, profitability remained elusive — Spotify only achieved its first profitable year in 2024, 18 years after founding, because label payments consume ~70% of revenue. **Lesson: solving chicken-and-egg can win the market, but platform economics depend on negotiating power with suppliers.**',
      outcome_bg: 'Spotify стана най-голямата музикална стрийминг платформа в света с 600M+ потребители и 220M+ платени абонати до 2024 г. Трансформира индустрия от пиратство в легален стрийминг. Но рентабилността остана трудна — Spotify постигна първата си печеливша година едва през 2024 г., защото плащанията към лейбълите поглъщат ~70% от приходите.',
      outcome_type: 'success',
      analytical_questions: [
        { id: 'sp1', question_en: 'Evaluate Spotify\'s freemium model. Why was offering free music essential for building the platform, and what are the long-term risks of this approach?', question_bg: 'Оценете freemium модела на Spotify. Защо предлагането на безплатна музика беше от съществено значение за изграждането на платформата?' },
        { id: 'sp2', question_en: 'Compare Spotify\'s platform strategy with Apple Music\'s approach (no free tier, bundled with hardware). Which model creates stronger network effects and why?', question_bg: 'Сравнете платформената стратегия на Spotify с подхода на Apple Music (без безплатно ниво, в комплект с хардуер). Кой модел създава по-силни мрежови ефекти?' },
      ],
    },
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
    case_transition_bg: 'Току-що научи за платформените бизнес модели. Сега анализирай как реални платформи решиха проблема кокошка и яйце.',
    related_sim_concepts_en: ['Platform Business Models', 'Two-sided Markets'],
    related_sim_concepts_bg: ['Платформени бизнес модели', 'Двустранни пазари'],
    sim_transition_en: 'Test your platform strategy in the startup simulator.',
    sim_transition_bg: 'Тествайте вашата платформена стратегия в стартъп симулатора.',
  },
  {
    slug: 'customer-acquisition-cost',
    title_en: 'Customer Acquisition Cost',
    title_bg: 'Цена за привличане на клиент (CAC)',
    hook: { en: 'You can build the best product in the world. If it costs €50 to get each user and each user pays you €30, you\'re bankrupt.', bg: 'Можеш да създадеш най-добрия продукт в света. Ако привличането на всеки потребител струва €50, а той плаща €30, си банкрутирал.' },
    metaphor: { en: 'CAC is the price of a fishing rod. LTV is the total fish you catch. If the rod costs more than the fish, stop fishing.', bg: 'CAC е цената на въдицата. LTV е общата риба, която хващаш. Ако въдицата струва повече от рибата, спри да ловиш.' },
    framework: { name: 'LTV:CAC Ratio', bullets_en: ['LTV (Lifetime Value) / CAC should be > 3:1', 'Below 1:1 = losing money on every customer', 'Payback period: how fast do you recoup CAC?'], bullets_bg: ['LTV / CAC трябва да е > 3:1', 'Под 1:1 = губиш пари с всеки клиент', 'Период на изплащане: колко бързо връщаш CAC?'], apply_en: 'Calculate LTV:CAC for your startup idea.', apply_bg: 'Изчисли LTV:CAC за стартъп идеята си.' },
    provocations: [{ en: 'Is it possible for a startup with high CAC to succeed? Under what conditions?', bg: 'Възможно ли е стартъп с висок CAC да успее? При какви условия?' }, { en: 'Why do some companies give away products for free and still make billions?', bg: 'Защо някои компании раздават продукти безплатно и въпреки това печелят милиарди?' }],
    concepts: [
      {
        id: 'cac-concept-1',
        name_en: 'Customer Acquisition Cost (CAC)',
        name_bg: 'Цена за привличане на клиент (CAC)',
        explanation_en: 'The total cost of sales and marketing divided by the number of new customers acquired. It measures how efficiently you grow.',
        explanation_bg: 'Общите разходи за продажби и маркетинг, разделени на броя нови клиенти. Измерва колко ефективно растете.',
        example_en: 'Dropbox reduced CAC to near-zero by using a referral program where both users got free storage — growing 3900% in 15 months.',
        example_bg: 'Dropbox намали CAC до почти нула чрез програма за препоръки, където и двамата потребители получаваха безплатно пространство — растеж от 3900% за 15 месеца.',
        takeaway_en: 'CAC determines whether your business model is sustainable. Always know your CAC by channel.',
        takeaway_bg: 'CAC определя дали бизнес моделът ви е устойчив. Винаги знайте CAC по канал.',
      },
      {
        id: 'cac-concept-2',
        name_en: 'LTV:CAC Ratio',
        name_bg: 'Съотношение LTV:CAC',
        explanation_en: 'Lifetime Value divided by Customer Acquisition Cost. The golden ratio is 3:1 — meaning each customer generates 3x what it costs to acquire them.',
        explanation_bg: 'Стойност за целия живот, разделена на цената за придобиване. Златното съотношение е 3:1.',
        example_en: 'Netflix spends ~$50 to acquire a subscriber who stays for 25 months at $15/mo = $375 LTV. Their LTV:CAC ratio is ~7.5:1.',
        example_bg: 'Netflix харчи ~$50 за придобиване на абонат, който остава 25 месеца при $15/мес = $375 LTV. Съотношението LTV:CAC е ~7.5:1.',
        takeaway_en: 'If LTV:CAC < 1, you\'re losing money on every customer. If > 3, you have a sustainable growth engine.',
        takeaway_bg: 'Ако LTV:CAC < 1, губите пари от всеки клиент. Ако > 3, имате устойчив двигател за растеж.',
      },
      {
        id: 'cac-concept-3',
        name_en: 'Payback Period',
        name_bg: 'Период на възвръщаемост',
        explanation_en: 'The time it takes to recoup the cost of acquiring a customer. Shorter payback = faster reinvestment in growth.',
        explanation_bg: 'Времето, необходимо за възвръщане на разходите за придобиване на клиент. По-кратък период = по-бързо реинвестиране.',
        example_en: 'SaaS companies typically aim for <12 months payback. If CAC is $100 and monthly revenue is $20, payback is 5 months.',
        example_bg: 'SaaS компаниите обикновено целят <12 месеца възвръщаемост. Ако CAC е $100 и месечният приход е $20, периодът е 5 месеца.',
        takeaway_en: 'A long payback period means you need more cash to grow. Optimize for shorter payback before scaling.',
        takeaway_bg: 'Дълъг период на възвръщаемост означава, че имате нужда от повече пари за растеж.',
      },
    ],
    simulator_decision: {
      scenario_en: 'Your startup has $50,000 for marketing. Your current CAC is $80 and LTV is $200 (LTV:CAC = 2.5:1).',
      scenario_bg: 'Вашият стартъп има $50,000 за маркетинг. Текущият CAC е $80 и LTV е $200 (LTV:CAC = 2.5:1).',
      question_en: 'How do you allocate the marketing budget?',
      question_bg: 'Как разпределяте маркетинговия бюджет?',
      options: [
        { id: 'cac-d1', label_en: 'All on paid ads', label_bg: 'Всичко в платена реклама', description_en: 'Predictable but expensive. Acquire 625 customers immediately at $80 CAC.', description_bg: 'Предвидимо, но скъпо. Привлечете 625 клиенти незабавно при $80 CAC.' },
        { id: 'cac-d2', label_en: '70% organic, 30% paid', label_bg: '70% органично, 30% платено', description_en: 'Invest in content, SEO, and community. Slower but builds a moat. CAC drops over time.', description_bg: 'Инвестирайте в съдържание, SEO и общност. По-бавно, но изгражда защита. CAC намалява с времето.' },
        { id: 'cac-d3', label_en: 'Build referral program', label_bg: 'Изградете програма за препоръки', description_en: 'Invest $20K in building a viral referral system. If it works, CAC drops to ~$10.', description_bg: 'Инвестирайте $20K в изграждане на вирусна система за препоръки. Ако работи, CAC пада до ~$10.' },
        { id: 'cac-d4', label_en: 'Improve product first', label_bg: 'Подобрете продукта първо', description_en: 'Spend $40K on product, $10K on marketing. Better product = higher retention = better LTV:CAC.', description_bg: 'Харчете $40K за продукт, $10K за маркетинг. По-добър продукт = по-добро LTV:CAC.' },
      ],
    },
    embedded_case: {
      title_en: 'HubSpot: The Content Marketing Engine',
      title_bg: 'HubSpot: Двигателят на контент маркетинга',
      learning_goal_en: 'Understand how HubSpot reduced CAC by 60% through inbound marketing and content strategy.',
      learning_goal_bg: 'Разберете как HubSpot намали CAC с 60% чрез входящ маркетинг и стратегия за съдържание.',
      context_en: `In 2006, HubSpot co-founders Brian Halligan and Dharmesh Shah noticed a fundamental shift: traditional outbound marketing (cold calls, ads, trade shows) was becoming less effective. People were blocking ads, ignoring cold emails, and researching online before buying.

They coined the term **"inbound marketing"** — attracting customers by creating valuable content that solves their problems, rather than interrupting them with ads. HubSpot built a massive content engine: free blog posts, ebooks, tools, and webinars about marketing and sales. By 2010, their blog attracted 2 million monthly visitors — all potential customers.

The math was compelling: traditional SaaS companies spent $300-500 on CAC for enterprise software. HubSpot's inbound approach reduced CAC to $120 while their LTV was $8,000+, creating an extraordinary LTV:CAC ratio of 66:1.`,
      context_bg: `През 2006 г. съоснователите на HubSpot забелязаха фундаментална промяна: традиционният изходящ маркетинг (студени обаждания, реклами) ставаше по-малко ефективен. Хората блокираха реклами и проучваха онлайн преди покупка.

Те създадоха термина **„входящ маркетинг"** — привличане на клиенти чрез създаване на ценно съдържание. HubSpot изгради масивен двигател за съдържание: безплатни статии, електронни книги, инструменти и уебинари. До 2010 г. блогът им привличаше 2 милиона месечни посетители.

Математиката беше впечатляваща: традиционните SaaS компании харчеха $300-500 за CAC. Входящият подход на HubSpot намали CAC до $120, докато LTV беше $8,000+, създавайки LTV:CAC съотношение от 66:1.`,
      problem_en: 'Is content marketing a viable growth strategy for all startups, or does it only work in certain industries? What are the hidden costs and timelines?',
      problem_bg: 'Ефективна ли е стратегията за контент маркетинг за всички стартъпи, или работи само в определени индустрии?',
      key_decision_en: 'HubSpot invested heavily in content creation before seeing returns. They hired writers, designers, and SEO experts — treating content as a product, not an afterthought. They also created a free CRM tool that attracted users who later upgraded to paid plans.',
      key_decision_bg: 'HubSpot инвестира значително в създаване на съдържание преди да види възвръщаемост. Наеха писатели, дизайнери и SEO експерти — третирайки съдържанието като продукт. Също създадоха безплатен CRM инструмент, който привличаше потребители.',
      outcome_en: 'HubSpot grew to $2B+ annual revenue by 2024, going public in 2014. Their content library (blog, academy, tools) became the primary acquisition channel, generating 10x more leads than paid advertising at 1/6 the cost. **Lesson: content marketing requires patience (6-18 months to see results) but creates a compounding asset — old blog posts keep generating leads forever, unlike ads which stop when you stop paying.**',
      outcome_bg: 'HubSpot нарасна до $2B+ годишен приход до 2024 г. Библиотеката им от съдържание стана основният канал за придобиване, генерирайки 10x повече потенциални клиенти от платена реклама на 1/6 от цената. **Урок: контент маркетингът изисква търпение (6-18 месеца), но създава натрупващ се актив — старите статии продължават да генерират клиенти завинаги.**',
      outcome_type: 'success',
      analytical_questions: [
        { id: 'hb1', question_en: 'Calculate the ROI difference between HubSpot\'s inbound approach (CAC=$120, LTV=$8,000) vs. traditional outbound (CAC=$400, LTV=$8,000). How does this compound over 1,000 customers?', question_bg: 'Изчислете разликата в ROI между входящия подход на HubSpot (CAC=$120, LTV=$8,000) и традиционния изходящ (CAC=$400, LTV=$8,000). Как се натрупва при 1,000 клиенти?' },
        { id: 'hb2', question_en: 'What types of startups would NOT benefit from a content marketing strategy? What alternative acquisition strategies would work better for them?', question_bg: 'Кои типове стартъпи НЕ биха имали полза от стратегия за контент маркетинг? Какви алтернативни стратегии биха работили по-добре за тях?' },
      ],
    },
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
    case_transition_bg: 'Току-що научи за CAC. Сега анализирай как FinTech стартъпите оптимизират привличането на клиенти в регулиран пазар.',
    related_sim_concepts_en: ['Customer Acquisition Cost', 'Growth Channels'],
    related_sim_concepts_bg: ['Цена за привличане на клиент', 'Канали за растеж'],
    sim_transition_en: 'Apply CAC optimization strategies in the startup simulator marketing decisions.',
    sim_transition_bg: 'Приложете стратегии за оптимизация на CAC в маркетинговите решения на стартъп симулатора.',
  },
  {
    slug: 'product-market-fit',
    title_en: 'Product-Market Fit',
    title_bg: 'Продуктово-пазарно съответствие',
    hook: { en: 'Marc Andreessen says PMF is the only thing that matters. Without it, nothing else you do matters. With it, everything becomes easier.', bg: 'Марк Андрийсън казва, че PMF е единственото, което има значение. Без него нищо друго няма значение. С него всичко става по-лесно.' },
    metaphor: { en: 'PMF is when you stop pushing a boulder uphill and it starts rolling downhill by itself.', bg: 'PMF е моментът, в който спираш да буташ камък нагоре и той започва да се търкаля надолу сам.' },
    framework: { name: 'Sean Ellis Test', bullets_en: ['Ask users: "How would you feel if you could no longer use this product?"', 'If >40% answer "Very disappointed" — you have PMF', 'Below 40% means iterate on the product, not marketing'], bullets_bg: ['Попитай потребителите: „Как бихте се почувствали, ако не можехте да използвате продукта?"', 'Ако >40% отговорят „Много разочарован" — имаш PMF', 'Под 40% означава итерирай продукта, не маркетинга'], apply_en: 'Design a Sean Ellis survey for your startup MVP.', apply_bg: 'Създай Sean Ellis анкета за MVP-то на стартъпа си.' },
    provocations: [{ en: 'Can you have PMF in one market segment and not in another?', bg: 'Можеш ли да имаш PMF в един пазарен сегмент, а в друг не?' }, { en: 'What happens if you scale before PMF? Name a real example.', bg: 'Какво се случва, ако мащабираш преди PMF? Дай реален пример.' }],
    concepts: [
      {
        id: 'pmf-concept-1',
        name_en: 'Product-Market Fit (PMF)',
        name_bg: 'Продуктово-пазарно съответствие (PMF)',
        explanation_en: 'The degree to which a product satisfies strong market demand. It\'s the #1 milestone every startup must reach before scaling.',
        explanation_bg: 'Степента, до която продуктът задоволява силно пазарно търсене. Етап №1, който всеки стартъп трябва да достигне преди мащабиране.',
        example_en: 'Slack started as an internal tool at a gaming company. When other companies begged to use it, they knew they had PMF.',
        example_bg: 'Slack започна като вътрешен инструмент в гейминг компания. Когато други компании молеха да го използват, те разбраха, че имат PMF.',
        takeaway_en: 'You have PMF when customers are pulling the product out of your hands, not when you\'re pushing it on them.',
        takeaway_bg: 'Имате PMF, когато клиентите издърпват продукта от ръцете ви, а не когато вие го натрапвате.',
      },
      {
        id: 'pmf-concept-2',
        name_en: 'Sean Ellis Test',
        name_bg: 'Тест на Шон Елис',
        explanation_en: 'Ask users: "How would you feel if you could no longer use this product?" If 40%+ say "very disappointed," you have PMF.',
        explanation_bg: 'Попитайте потребителите: „Как бихте се почувствали, ако не можете повече да използвате този продукт?" Ако 40%+ казват „много разочарован/а" — имате PMF.',
        example_en: 'Superhuman (email app) used this test and found only 22% said "very disappointed." They iterated until reaching 58%, then scaled.',
        example_bg: 'Superhuman (имейл приложение) използва този тест и откри, че само 22% казват „много разочарован". Итерираха, докато достигнаха 58%, след което мащабираха.',
        takeaway_en: 'PMF is measurable, not just a feeling. Use the Sean Ellis test to make data-driven decisions about when to scale.',
        takeaway_bg: 'PMF е измеримо, не просто усещане. Използвайте теста на Шон Елис за решения, базирани на данни.',
      },
      {
        id: 'pmf-concept-3',
        name_en: 'Premature Scaling',
        name_bg: 'Преждевременно мащабиране',
        explanation_en: 'Spending on growth (hiring, marketing, infrastructure) before achieving PMF. It\'s the #1 cause of startup failure.',
        explanation_bg: 'Харчене за растеж (наемане, маркетинг, инфраструктура) преди постигане на PMF. Причина №1 за провал на стартъп.',
        example_en: 'Quibi raised $1.75B and launched with massive marketing before validating that people wanted short-form premium video. It shut down in 6 months.',
        example_bg: 'Quibi привлече $1.75B и стартира с масивен маркетинг, преди да валидира, че хората искат кратко премиум видео. Затвори за 6 месеца.',
        takeaway_en: 'Before PMF: iterate fast, spend little. After PMF: scale aggressively. Never reverse this order.',
        takeaway_bg: 'Преди PMF: итерирайте бързо, харчете малко. След PMF: мащабирайте агресивно. Никога не обръщайте тази последователност.',
      },
    ],
    simulator_decision: {
      scenario_en: 'Your app has 500 users. The Sean Ellis test shows 28% would be "very disappointed" if it disappeared. You have $200K in funding.',
      scenario_bg: 'Вашето приложение има 500 потребители. Тестът на Шон Елис показва 28% „много разочаровани." Имате $200K финансиране.',
      question_en: 'What do you do next?',
      question_bg: 'Какво правите следващо?',
      options: [
        { id: 'pmf-d1', label_en: 'Scale now — launch paid ads', label_bg: 'Мащабирайте сега — стартирайте реклами', description_en: '28% is close enough. Speed is everything in competitive markets.', description_bg: '28% е достатъчно близо. Скоростта е всичко в конкурентни пазари.' },
        { id: 'pmf-d2', label_en: 'Iterate on the product', label_bg: 'Итерирайте продукта', description_en: 'Talk to the 72% who are NOT very disappointed. Find out what\'s missing and fix it.', description_bg: 'Говорете с 72%, които НЕ са много разочаровани. Разберете какво липсва и го поправете.' },
        { id: 'pmf-d3', label_en: 'Pivot to a new segment', label_bg: 'Пивотирайте към нов сегмент', description_en: 'Maybe the current audience is wrong. Test with a different customer segment.', description_bg: 'Може би текущата аудитория е грешна. Тествайте с различен клиентски сегмент.' },
        { id: 'pmf-d4', label_en: 'Double down on power users', label_bg: 'Фокусирайте се върху „силните" потребители', description_en: 'Study the 28% who love it. Build exclusively for them and ignore the rest.', description_bg: 'Проучете 28%, които го обичат. Изградете изцяло за тях и игнорирайте останалите.' },
      ],
    },
    embedded_case: {
      title_en: 'Instagram: The Pivot That Found PMF',
      title_bg: 'Instagram: Пивотът, който намери PMF',
      learning_goal_en: 'Understand how Instagram pivoted from a complex app (Burbn) to a simple photo-sharing app and found explosive Product-Market Fit.',
      learning_goal_bg: 'Разберете как Instagram пивотира от сложно приложение (Burbn) до просто приложение за снимки и намери експлозивно PMF.',
      context_en: `Kevin Systrom originally built "Burbn" — a location-based check-in app similar to Foursquare. It let users check in at locations, make plans with friends, and share photos. The app had about 200 beta users, but engagement was low. Most features were ignored.

When Systrom analyzed usage data, he noticed something unexpected: **the only feature people actually used was photo sharing.** Users were uploading photos of their meals, sunsets, and friends — and ignoring everything else.

In October 2010, Systrom and co-founder Mike Krieger made a radical decision: strip everything except photo sharing. They added filters to make photos look professional, a simple feed, and social features (likes, comments). They renamed it "Instagram" and launched on the App Store.`,
      context_bg: `Кевин Систром първоначално създаде "Burbn" — приложение за check-in, подобно на Foursquare. То позволяваше на потребителите да се отбелязват на локации, да правят планове и да споделят снимки. Приложението имаше около 200 бета потребители, но ангажираността беше ниска.

Когато Систром анализира данните за използване, забеляза нещо неочаквано: **единствената функция, която хората реално използваха, беше споделянето на снимки.** Потребителите качваха снимки на храната, залезите и приятелите си — и игнорираха всичко останало.

През октомври 2010 г. Систром и съосновател Майк Кригер направиха радикално решение: премахнаха всичко освен споделянето на снимки. Добавиха филтри, прост фийд и социални функции. Преименуваха го на "Instagram."`,
      problem_en: 'How do you know when to pivot vs. iterate? What signals told Instagram they had found PMF after the pivot?',
      problem_bg: 'Как разбирате кога да пивотирате vs. итерирате? Какви сигнали казаха на Instagram, че са намерили PMF след пивота?',
      key_decision_en: 'Systrom killed 80% of Burbn\'s features and focused entirely on the one thing users actually loved. This required courage — throwing away months of development work. The pivot was guided by data (usage analytics), not ego.',
      key_decision_bg: 'Систром премахна 80% от функциите на Burbn и се фокусира изцяло върху единственото нещо, което потребителите обичаха. Това изискваше смелост — изхвърляне на месеци работа. Пивотът беше воден от данни, не от его.',
      outcome_en: 'Instagram gained 25,000 users on launch day. Within 2 months: 1 million users. Within 2 years: 100 million users. Facebook acquired Instagram for $1 billion in 2012. **Lesson: PMF often hides in the data — look at what users actually do, not what you built for them. The willingness to pivot based on evidence is a founder\'s superpower.**',
      outcome_bg: 'Instagram спечели 25,000 потребители в деня на стартиране. В рамките на 2 месеца: 1 милион. В рамките на 2 години: 100 милиона. Facebook придоби Instagram за $1 милиард през 2012 г. **Урок: PMF често се крие в данните — гледайте какво потребителите наистина правят, а не какво сте построили за тях.**',
      outcome_type: 'success',
      analytical_questions: [
        { id: 'ig1', question_en: 'What specific data signals should a founder look for to decide between pivoting and iterating? Apply this framework to the Instagram case.', question_bg: 'Какви специфични сигнали от данните трябва да търси основателят, за да реши дали да пивотира или итерира? Приложете тази рамка към случая на Instagram.' },
        { id: 'ig2', question_en: 'What risks did Instagram take by removing 80% of features? When is this "subtract to add" strategy appropriate and when is it dangerous?', question_bg: 'Какви рискове пое Instagram, премахвайки 80% от функциите? Кога тази стратегия „извади, за да добавиш" е подходяща?' },
      ],
    },
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
    case_transition_bg: 'Току-що научи за продуктово-пазарно съответствие. Сега анализирай как EdTech платформи намериха PMF.',
    related_sim_concepts_en: ['Product-Market Fit', 'MVP Strategy'],
    related_sim_concepts_bg: ['Продуктово-пазарно съответствие', 'MVP стратегия'],
    sim_transition_en: 'Test your product-market fit strategy in the startup simulator.',
    sim_transition_bg: 'Тествайте стратегията си за продуктово-пазарно съответствие в стартъп симулатора.',
  },
  {
    slug: 'digital-ecosystems',
    title_en: 'Digital Ecosystems',
    title_bg: 'Дигитални екосистеми',
    hook: { en: 'Amazon started as a bookstore. Now it\'s a cloud provider, bank, grocery store, and entertainment studio. That\'s an ecosystem.', bg: 'Amazon започна като книжарница. Сега е облачен доставчик, банка, хранителен магазин и развлекателно студио. Това е екосистема.' },
    metaphor: { en: 'An ecosystem is like a flywheel: each service feeds the next. More Prime members → more sellers → more data → better recommendations → more members.', bg: 'Екосистемата е като маховик: всяка услуга захранва следващата. Повече Prime членове → повече продавачи → повече данни → по-добри препоръки → повече членове.' },
    framework: { name: 'Amazon Flywheel', bullets_en: ['Lower prices → more customers', 'More customers → more sellers', 'More sellers → better selection → more customers'], bullets_bg: ['По-ниски цени → повече клиенти', 'Повече клиенти → повече продавачи', 'Повече продавачи → по-добър избор → повече клиенти'], apply_en: 'Draw the flywheel for your startup: what reinforcing loops can you create?', apply_bg: 'Начертай маховика за стартъпа си: какви самоподсилващи се цикли можеш да създадеш?' },
    provocations: [{ en: 'Is building an ecosystem always better than building a single product?', bg: 'Изграждането на екосистема винаги ли е по-добро от един продукт?' }, { en: 'How can a small startup compete with an established ecosystem like Apple?', bg: 'Как малък стартъп може да се конкурира с установена екосистема като Apple?' }],
    concepts: [
      {
        id: 'de-concept-1',
        name_en: 'Digital Ecosystem',
        name_bg: 'Дигитална екосистема',
        explanation_en: 'A network of interconnected products, services, and organizations that create and exchange value through digital platforms.',
        explanation_bg: 'Мрежа от взаимосвързани продукти, услуги и организации, които създават и обменят стойност чрез дигитални платформи.',
        example_en: 'Apple\'s ecosystem (iPhone, Mac, iPad, Watch, AirPods, iCloud, App Store) — each product reinforces the others.',
        example_bg: 'Екосистемата на Apple (iPhone, Mac, iPad, Watch, AirPods, iCloud, App Store) — всеки продукт подсилва останалите.',
        takeaway_en: 'Ecosystems create lock-in: the more products you use, the harder it is to switch to competitors.',
        takeaway_bg: 'Екосистемите създават заключване: колкото повече продукти използвате, толкова по-трудно е да преминете към конкуренти.',
      },
      {
        id: 'de-concept-2',
        name_en: 'Lock-in Effect',
        name_bg: 'Ефект на заключване',
        explanation_en: 'When switching to a competitor becomes too costly (time, money, data) because the user is deeply integrated into the ecosystem.',
        explanation_bg: 'Когато преминаването към конкурент става прекалено скъпо (време, пари, данни), защото потребителят е дълбоко интегриран в екосистемата.',
        example_en: 'Google Workspace: your email, documents, calendar, and storage are all interconnected. Switching means migrating everything.',
        example_bg: 'Google Workspace: имейл, документи, календар и хранилище са взаимосвързани. Преминаването означава мигриране на всичко.',
        takeaway_en: 'Lock-in is a double-edged sword: it creates retention but can breed resentment if users feel trapped.',
        takeaway_bg: 'Заключването е нож с две остриета: създава задържане, но може да породи негодуване.',
      },
      {
        id: 'de-concept-3',
        name_en: 'Keystone Strategy',
        name_bg: 'Стратегия на ключовия камък',
        explanation_en: 'The strategy of becoming the essential infrastructure that third-party developers and partners build upon.',
        explanation_bg: 'Стратегията да станете основната инфраструктура, върху която трети страни изграждат.',
        example_en: 'Amazon Web Services (AWS) — millions of companies depend on AWS for infrastructure, making Amazon the "keystone" of the internet.',
        example_bg: 'Amazon Web Services (AWS) — милиони компании зависят от AWS за инфраструктура, правейки Amazon „ключов камък" на интернет.',
        takeaway_en: 'Being the keystone creates the strongest competitive position — if you become infrastructure, you become irreplaceable.',
        takeaway_bg: 'Да бъдеш ключовият камък създава най-силната конкурентна позиция — ако станете инфраструктура, ставате незаменими.',
      },
    ],
    simulator_decision: {
      scenario_en: 'Your SaaS product has gained traction. You can expand into an ecosystem or stay focused on one product.',
      scenario_bg: 'Вашият SaaS продукт набра скорост. Можете да се разширите в екосистема или да останете фокусирани на един продукт.',
      question_en: 'What\'s your ecosystem strategy?',
      question_bg: 'Каква е екосистемната ви стратегия?',
      options: [
        { id: 'de-d1', label_en: 'Open API platform', label_bg: 'Отворена API платформа', description_en: 'Let third-party developers build on your platform. Slow to start but creates powerful lock-in.', description_bg: 'Позволете на трети страни да изграждат върху вашата платформа. Бавно начало, но създава мощно заключване.' },
        { id: 'de-d2', label_en: 'Build complementary products', label_bg: 'Изградете допълващи продукти', description_en: 'Create 2-3 products that work together. Higher cost but complete control over quality.', description_bg: 'Създайте 2-3 продукта, които работят заедно. По-висока цена, но пълен контрол.' },
        { id: 'de-d3', label_en: 'Stay focused on one product', label_bg: 'Останете фокусирани на един продукт', description_en: 'Perfect your core product before expanding. Risk: competitors build the ecosystem first.', description_bg: 'Усъвършенствайте основния продукт преди разширяване. Риск: конкурентите изграждат екосистемата първи.' },
      ],
    },
    embedded_case: {
      title_en: 'WeChat: The Super-App Ecosystem',
      title_bg: 'WeChat: Екосистемата на супер-приложението',
      learning_goal_en: 'Understand how WeChat evolved from a messaging app into a complete digital ecosystem that 1.3 billion people use for everything.',
      learning_goal_bg: 'Разберете как WeChat еволюира от приложение за съобщения в пълна дигитална екосистема, която 1.3 милиарда души използват за всичко.',
      context_en: `WeChat launched in 2011 as a simple messaging app, competing with WhatsApp and LINE. By 2014, it had 400 million users in China — impressive, but nothing revolutionary. Then Tencent made a strategic decision that would change everything.

Instead of staying a messaging app, WeChat became a **super-app**: a single platform for messaging, social media, payments (WeChat Pay), e-commerce, food delivery, ride-hailing, government services, healthcare appointments, and even mini-programs (apps within the app).

By 2024, WeChat had 1.3 billion monthly active users who spent an average of 82 minutes per day on the app. Over 4 million mini-programs operated within WeChat, making it the operating system of China's digital life.

The ecosystem strategy created extreme lock-in: users couldn't leave WeChat without losing access to payments, social connections, services, and business communications all at once.`,
      context_bg: `WeChat стартира през 2011 г. като просто приложение за съобщения. До 2014 г. имаше 400 милиона потребители в Китай.

Вместо да остане приложение за съобщения, WeChat стана **супер-приложение**: единна платформа за съобщения, социални медии, плащания (WeChat Pay), електронна търговия, доставка на храна, държавни услуги и мини-програми (приложения в приложението).

До 2024 г. WeChat имаше 1.3 милиарда месечни активни потребители, прекарващи средно 82 минути дневно. Над 4 милиона мини-програми функционираха в WeChat, правейки го операционната система на дигиталния живот в Китай.`,
      problem_en: 'Is the super-app model universally applicable, or does it only work in specific market conditions? What makes WeChat\'s ecosystem defensible?',
      problem_bg: 'Универсално приложим ли е моделът на супер-приложението, или работи само при специфични пазарни условия?',
      key_decision_en: 'Tencent chose to transform WeChat into an ecosystem platform rather than keeping it as a focused messaging app. They opened mini-programs to third-party developers, integrated payments deeply into daily life, and leveraged their massive user base to negotiate partnerships.',
      key_decision_bg: 'Tencent избра да трансформира WeChat в екосистемна платформа, вместо да го запази като фокусирано приложение за съобщения. Отвориха мини-програми за трети страни, интегрираха плащанията дълбоко в ежедневието.',
      outcome_en: 'WeChat became arguably the most powerful digital ecosystem in the world. Its lock-in is so strong that switching costs are effectively infinite for Chinese users. However, this model has proven difficult to replicate in Western markets (Meta\'s attempts, Snapchat) where users prefer specialized apps. **Lesson: ecosystem strategies require a critical mass of users AND a market willing to consolidate around one platform. Cultural and regulatory factors matter enormously.**',
      outcome_bg: 'WeChat стана може би най-мощната дигитална екосистема в света. Заключването е толкова силно, че разходите за преминаване са практически безкрайни за китайските потребители. Моделът обаче се оказа труден за възпроизвеждане на западните пазари. **Урок: екосистемните стратегии изискват критична маса потребители И пазар, готов да се консолидира около една платформа.**',
      outcome_type: 'success',
      analytical_questions: [
        { id: 'wc1', question_en: 'Why has the super-app model succeeded in China but not in Western markets? What cultural, regulatory, and market factors explain this difference?', question_bg: 'Защо моделът на супер-приложението успя в Китай, но не и на западните пазари? Какви културни и пазарни фактори обясняват тази разлика?' },
        { id: 'wc2', question_en: 'Evaluate the ethical implications of WeChat\'s ecosystem lock-in. When does a strong ecosystem cross the line from value creation to monopolistic control?', question_bg: 'Оценете етичните импликации от заключването на екосистемата на WeChat. Кога силната екосистема преминава границата от създаване на стойност към монополистичен контрол?' },
      ],
    },
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
    case_transition_bg: 'Току-що научи за дигиталните екосистеми. Сега анализирай как умните градове с AI създават взаимосвързана стойност.',
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
    hook: { en: 'Airbnb spent $0 on marketing in its first year and grew to 10,000 listings. How? By understanding the AARRR funnel.', bg: 'Airbnb похарчи $0 за маркетинг в първата си година и достигна 10 000 обяви. Как? Чрез разбиране на AARRR фунията.' },
    metaphor: { en: 'Marketing is not a megaphone. It\'s a funnel: 1000 people see you → 100 click → 10 try → 3 pay → 1 stays forever.', bg: 'Маркетингът не е мегафон. Той е фуния: 1000 те виждат → 100 кликват → 10 опитват → 3 плащат → 1 остава завинаги.' },
    framework: { name: 'AARRR Pirate Metrics', bullets_en: ['Acquisition: how do users find you?', 'Activation: do they have a great first experience?', 'Retention, Revenue, Referral: do they stay, pay, and invite friends?'], bullets_bg: ['Acquisition: как те намират потребителите?', 'Activation: имат ли страхотно първо изживяване?', 'Retention, Revenue, Referral: остават ли, плащат ли и канят ли приятели?'], apply_en: 'Map your startup\'s AARRR metrics: what is your weakest stage?', apply_bg: 'Начертай AARRR метриките на стартъпа си: кой е най-слабият етап?' },
    provocations: [{ en: 'Is it possible to build a successful product without any marketing at all?', bg: 'Възможно ли е да изградиш успешен продукт без никакъв маркетинг?' }, { en: 'Why do some viral products die after 6 months?', bg: 'Защо някои вирусни продукти умират след 6 месеца?' }],
    level: 2,
    startup_field: 'customer',
    concepts: [
      { id: 'mf-c1', name_en: 'Marketing Funnel', name_bg: 'Маркетингова фуния', explanation_en: 'The stages a customer passes through: Awareness → Interest → Consideration → Conversion → Retention.', explanation_bg: 'Етапите, през които преминава клиент: Осведоменост → Интерес → Обмисляне → Конверсия → Задържане.', example_en: 'Shopify guides merchants from free blog content (awareness) → free trial (consideration) → paid plan (conversion) → app ecosystem (retention).', example_bg: 'Shopify насочва търговци от безплатно съдържание (осведоменост) → безплатен пробен период (обмисляне) → платен план (конверсия) → екосистема от приложения (задържане).', takeaway_en: 'Most startups over-invest in top-of-funnel (acquisition) and under-invest in bottom (retention). Retention is 5-7x cheaper.', takeaway_bg: 'Повечето стартъпи свръхинвестират в горната част на фунията и недоинвестират в долната. Задържането е 5-7 пъти по-евтино.' },
      { id: 'mf-c2', name_en: 'Growth Hacking', name_bg: 'Растежно хакване', explanation_en: 'Combining marketing creativity with data analytics to find scalable, low-cost growth strategies.', explanation_bg: 'Комбинация от маркетингова креативност с анализ на данни за намиране на мащабируеми стратегии с ниска цена.', example_en: 'Hotmail added "Get your free email at Hotmail" to every sent email. Each user became a marketing channel — 12M users in 18 months.', example_bg: 'Hotmail добави „Вземете безплатен имейл в Hotmail" към всеки изпратен имейл. Всеки потребител стана маркетингов канал — 12М потребители за 18 месеца.', takeaway_en: 'The best growth hacks turn your product itself into a marketing channel.', takeaway_bg: 'Най-добрите растежни хакове превръщат самия продукт в маркетингов канал.' },
    ],
    simulator_decision: {
      scenario_en: 'Your startup launched 3 months ago. You have 200 users but growth is flat. Budget: $5,000/month.',
      scenario_bg: 'Вашият стартъп стартира преди 3 месеца. Имате 200 потребители, но растежът е плосък. Бюджет: $5,000/месец.',
      question_en: 'Which marketing strategy do you prioritize?',
      question_bg: 'Коя маркетингова стратегия приоритизирате?',
      options: [
        { id: 'mf-d1', label_en: 'Content marketing', label_bg: 'Контент маркетинг', description_en: 'Create blog posts, guides, and videos. Takes 6+ months but compounds over time.', description_bg: 'Създайте статии, ръководства и видеоклипове. Отнема 6+ месеца, но се натрупва с времето.' },
        { id: 'mf-d2', label_en: 'Paid social ads', label_bg: 'Платена реклама в социални медии', description_en: 'Immediate traffic but expensive. $5K/month gets ~60-100 users at $50-80 CAC.', description_bg: 'Незабавен трафик, но скъпо. $5K/месец = ~60-100 потребители при $50-80 CAC.' },
        { id: 'mf-d3', label_en: 'Community building', label_bg: 'Изграждане на общност', description_en: 'Build a Discord/Slack community. Free acquisition but requires daily engagement.', description_bg: 'Изградете Discord/Slack общност. Безплатно привличане, но изисква ежедневен ангажимент.' },
      ],
    },
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
    case_transition_bg: 'Научи основите на маркетинга. Сега анализирай как FinTech стартъпите привличат и задържат клиенти.',
    sim_transition_en: 'Apply your marketing strategy in the startup simulator to see how channel choices affect growth.',
    sim_transition_bg: 'Приложете маркетинговата си стратегия в стартъп симулатора, за да видите как изборът на канал влияе на растежа.',
    embedded_case: {
      title_en: 'Airbnb: The Growth Hack That Built an Empire',
      title_bg: 'Airbnb: Растежният хак, който изгради империя',
      learning_goal_en: 'Understand how Airbnb used creative growth hacking to solve the supply-side acquisition problem.',
      learning_goal_bg: 'Разберете как Airbnb използва креативно растежно хакване за решаване на проблема с придобиването на предлагане.',
      context_en: `In 2009, Airbnb was struggling. They had a decent product but couldn't attract enough hosts (supply). Their co-founders discovered that many potential hosts were already listing properties on Craigslist — the dominant classifieds platform. Instead of competing head-on, they built a tool that let Airbnb hosts automatically cross-post their listings to Craigslist, reaching millions of potential renters for free.

This "piggyback" strategy was controversial — Craigslist didn't have a public API, so Airbnb reverse-engineered the posting process. But it worked brilliantly: hosts got more bookings, guests found better properties, and Airbnb acquired both sides from an established platform.

Additionally, Airbnb noticed that listings with professional photos got 2.5x more bookings. So they offered free professional photography for hosts — an expensive move, but it dramatically improved conversion rates.`,
      context_bg: `През 2009 г. Airbnb се мъчеше. Имаха добър продукт, но не можеха да привлекат достатъчно домакини. Съоснователите им откриха, че много потенциални домакини вече обявяваха имоти в Craigslist. Вместо да конкурират директно, те построиха инструмент, позволяващ на домакините в Airbnb автоматично да публикуват обявите си в Craigslist, достигайки до милиони потенциални наематели безплатно.

Тази стратегия „на гърба" беше противоречива — Craigslist нямаше публичен API. Но работеше блестящо.

Освен това Airbnb забеляза, че обявите с професионални снимки получават 2.5x повече резервации. Затова предложиха безплатна професионална фотография за домакините.`,
      problem_en: 'When is it ethical to "piggyback" on a competitor\'s platform? How did Airbnb balance aggressive growth tactics with long-term brand building?',
      problem_bg: 'Кога е етично да използвате платформата на конкурент? Как Airbnb балансира агресивните тактики за растеж с дългосрочно изграждане на бранд?',
      key_decision_en: 'Airbnb invested in two unconventional strategies: 1) Technical piggyback on Craigslist for distribution, and 2) Free professional photography for quality improvement. Both were expensive and risky but addressed the core problem: acquiring and converting supply.',
      key_decision_bg: 'Airbnb инвестира в две нетрадиционни стратегии: 1) Техническо „на гърба" на Craigslist за дистрибуция, и 2) Безплатна професионална фотография за подобряване на качеството.',
      outcome_en: 'The Craigslist integration and photography program helped Airbnb grow from 10,000 to 80,000 listings in 2 years. The photography alone increased bookings by 2-3x for participating hosts. By 2024, Airbnb had 7.7 million listings globally. **Lesson: the best growth hacks solve real problems (better photos, wider distribution) rather than tricking users. Quality-driven growth is sustainable.**',
      outcome_bg: 'Интеграцията с Craigslist и програмата за фотография помогнаха на Airbnb да нарасне от 10,000 до 80,000 обяви за 2 години. Фотографията увеличи резервациите с 2-3 пъти. До 2024 г. Airbnb имаше 7.7 милиона обяви. **Урок: най-добрите растежни хакове решават реални проблеми, а не мамят потребители.**',
      outcome_type: 'success',
      analytical_questions: [
        { id: 'ab1', question_en: 'Evaluate the ethics of Airbnb\'s Craigslist integration. Was it a brilliant growth hack or an unfair competitive practice? Where do you draw the line?', question_bg: 'Оценете етиката на интеграцията на Airbnb с Craigslist. Беше ли брилянтен растежен хак или нечестна конкурентна практика?' },
        { id: 'ab2', question_en: 'Why was investing in free professional photography a better use of marketing budget than paid ads? What does this tell us about product-led growth?', question_bg: 'Защо инвестицията в безплатна професионална фотография беше по-добро използване на маркетинговия бюджет от платени реклами?' },
      ],
    },
  },
  {
    slug: 'pricing-and-revenue',
    title_en: 'Pricing & Revenue',
    title_bg: 'Ценообразуване и приходи',
    hook: { en: 'Bird scooters charged $1 to unlock + $0.15/min. Each ride cost them $1.60 to operate. They raised $1B and still lost money.', bg: 'Bird скутерите таксуваха $1 за отключване + $0.15/мин. Всяко пътуване ги струваше $1.60. Привлякоха $1B и пак губеха пари.' },
    metaphor: { en: 'Price is a triangle: what customers will pay (value), what it costs you (cost), what competitors charge (market). Find the sweet spot.', bg: 'Цената е триъгълник: какво ще платят клиентите (стойност), какво те струва (разход), какво таксуват конкурентите (пазар).' },
    framework: { name: 'Value-Based Pricing Triangle', bullets_en: ['Value ceiling: maximum willingness to pay', 'Cost floor: minimum viable price', 'Competitive anchor: what alternatives cost'], bullets_bg: ['Таван на стойност: максимална готовност за плащане', 'Подова цена: минимална жизнеспособна цена', 'Конкурентна котва: колко струват алтернативите'], apply_en: 'Draw the pricing triangle for your product.', apply_bg: 'Начертай ценовия триъгълник за продукта си.' },
    provocations: [{ en: 'When is charging $0 the best pricing strategy?', bg: 'Кога таксуването $0 е най-добрата ценова стратегия?' }, { en: 'Why did Spotify choose freemium instead of a pure subscription model?', bg: 'Защо Spotify избра freemium вместо чист абонаментен модел?' }],
    level: 2,
    startup_field: 'business_model',
    concepts: [
      { id: 'pr-c1', name_en: 'Unit Economics', name_bg: 'Юнит икономика', explanation_en: 'Revenue and costs associated with a single unit of your product (one customer, one transaction). Must be positive for sustainability.', explanation_bg: 'Приходите и разходите, свързани с единица от вашия продукт (един клиент, една транзакция). Трябва да са положителни.', example_en: 'Uber: Revenue per ride = $15. Cost per ride (driver pay + insurance + platform) = $18. Negative unit economics for years.', example_bg: 'Uber: Приход на пътуване = $15. Разход на пътуване (заплата на шофьор + застраховка + платформа) = $18. Негативна юнит икономика с години.', takeaway_en: 'If you lose money on every transaction, more scale = more losses. Fix unit economics before scaling.', takeaway_bg: 'Ако губите пари от всяка транзакция, повече мащаб = повече загуби. Поправете юнит икономиката преди мащабиране.' },
      { id: 'pr-c2', name_en: 'Freemium Model', name_bg: 'Фриймиъм модел', explanation_en: 'Offering a free basic version with paid premium features. Converts 2-5% of free users to paying customers.', explanation_bg: 'Предлагане на безплатна базова версия с платени премиум функции. Конвертира 2-5% от безплатните потребители.', example_en: 'Spotify: 600M free users, 220M paying ($10/mo). Free tier = acquisition engine. Premium = revenue engine.', example_bg: 'Spotify: 600M безплатни потребители, 220M плащащи ($10/мес). Безплатното ниво = двигател за привличане. Премиум = двигател за приходи.', takeaway_en: 'Freemium works when the free version is good enough to attract users but limited enough to motivate upgrading.', takeaway_bg: 'Фриймиъм работи, когато безплатната версия е достатъчно добра, но достатъчно ограничена за мотивиране на ъпгрейд.' },
    ],
    simulator_decision: {
      scenario_en: 'Your SaaS app has 1,000 free users. You need to introduce pricing. Current costs: $3,000/month for infrastructure.',
      scenario_bg: 'Вашето SaaS приложение има 1,000 безплатни потребители. Трябва да въведете ценообразуване. Текущи разходи: $3,000/месец.',
      question_en: 'Which pricing model do you choose?',
      question_bg: 'Кой модел за ценообразуване избирате?',
      options: [
        { id: 'pr-d1', label_en: 'Freemium ($0 free / $19 premium)', label_bg: 'Фриймиъм ($0 безплатно / $19 премиум)', description_en: 'Keep free tier to maintain growth. Need 5% conversion to break even (50 paying users).', description_bg: 'Запазете безплатно ниво за растеж. Нужни 5% конверсия за нулева печалба (50 плащащи потребители).' },
        { id: 'pr-d2', label_en: 'All paid ($9/month)', label_bg: 'Изцяло платено ($9/месец)', description_en: 'Simpler model. Risk losing 80% of users but those who stay are committed.', description_bg: 'По-прост модел. Риск да загубите 80% от потребителите, но останалите са ангажирани.' },
        { id: 'pr-d3', label_en: 'Usage-based pricing', label_bg: 'Ценообразуване на база употреба', description_en: 'Charge per API call or action. Fair for users but revenue is unpredictable.', description_bg: 'Таксувайте на API извикване или действие. Справедливо, но приходите са непредсказуеми.' },
      ],
    },
    embedded_case: {
      title_en: 'Bird Scooters: When Unit Economics Don\'t Work',
      title_bg: 'Bird Scooters: Когато unit economics не работят',
      learning_goal_en: 'Understand why pricing and unit economics must be validated before scaling, even with massive demand.',
      learning_goal_bg: 'Разбери защо ценообразуването и unit economics трябва да се валидират преди мащабиране, дори при огромно търсене.',
      context_en: `Bird launched in 2017 as the first electric scooter-sharing company. The idea was simple: drop scooters around cities, let people unlock them with an app, charge $1 to start + $0.15 per minute. Within 12 months, Bird raised $415 million and was valued at $2 billion — the fastest company in history to reach "unicorn" status.

The growth was explosive. Scooters appeared in over 100 cities. Riders loved the convenience. Cities struggled to regulate them. Bird's revenue grew from $0 to $100+ million in a single year.

But underneath the impressive top-line numbers, a critical problem was brewing: each scooter cost $500+, lasted only 3-4 months on the street (due to vandalism, weather, and abuse), and generated about $3-5 per day in revenue. Bird also had to pay "chargers" — gig workers who collected, charged, and redistributed scooters every night — adding $3-5 per scooter per day in operational costs.

The math was devastating: **Revenue per scooter lifetime ≈ $300-450. Cost per scooter lifetime (hardware + operations) ≈ $600-900.** Bird was losing money on every single ride.`,
      context_bg: `Bird стартира през 2017 г. като първата компания за споделяне на електрически тротинетки. Идеята беше проста: оставяш тротинетки из градовете, хората ги отключват с приложение, таксуваш $1 за старт + $0.15 на минута. В рамките на 12 месеца Bird привлече $415 милиона и беше оценена на $2 милиарда.

Растежът беше експлозивен. Тротинетки се появиха в над 100 града. Приходите нараснаха от $0 до $100+ милиона за една година.

Но под впечатляващите числа се криеше критичен проблем: всяка тротинетка струваше $500+, издържаше само 3-4 месеца и генерираше около $3-5 на ден приходи. Bird също трябваше да плаща на "зарядчици" — gig работници — добавяйки $3-5 на тротинетка на ден.

Математиката беше опустошителна: **Приход за живот на тротинетка ≈ $300-450. Разходи ≈ $600-900.** Bird губеше пари от всяко пътуване.`,
      problem_en: 'Can a company with negative unit economics survive by scaling, or does scaling only make the losses worse? How should Bird have structured its pricing?',
      problem_bg: 'Може ли компания с негативен unit economics да оцелее чрез мащабиране, или мащабирането само влошава загубите?',
      key_decision_en: 'Bird chose to prioritize growth over profitability. They raised billions in venture capital to subsidize operations, hoping that scale would eventually reduce costs. They kept prices low to maximize rides and market share. They also tried switching to cheaper scooters, which broke down even faster.',
      key_decision_bg: 'Bird избра да приоритизира растежа пред рентабилността. Привлякоха милиарди рисков капитал, надявайки се, че мащабът ще намали разходите. Поддържаха ниски цени. Също опитаха по-евтини тротинетки, които се чупеха по-бързо.',
      outcome_en: 'Bird went public in 2021 at a $2.5B valuation but its stock crashed 99%. By 2023, Bird filed for bankruptcy. The core lesson: **no amount of growth fixes broken unit economics.** If you lose money on every transaction, more transactions = more losses.',
      outcome_bg: 'Bird стана публична през 2021 г., но акциите паднаха с 99%. До 2023 г. Bird обяви фалит. Основният урок: **никакъв растеж не поправя счупен unit economics.**',
      outcome_type: 'failure',
      analytical_questions: [
        { id: 'bc1', question_en: 'What was the real problem at Bird — was it pricing too low, scooter durability, operational costs, or all three? Which factor was most critical and why?', question_bg: 'Какъв беше истинският проблем на Bird — прекалено ниски цени, издръжливост на тротинетките, оперативни разходи, или и трите?' },
        { id: 'bc2', question_en: 'Evaluate Bird\'s decision to prioritize growth over profitability. In what situations is this a valid strategy, and when does it become dangerous?', question_bg: 'Оценете решението на Bird да приоритизира растежа пред рентабилността. Кога тази стратегия е валидна и кога е опасна?' },
        { id: 'bc3', question_en: 'Redesign Bird\'s pricing model to achieve profitability. Consider subscription plans, surge pricing, premium tiers, or partnership models.', question_bg: 'Редизайнирайте ценовия модел на Bird за постигане на рентабилност. Помислете за абонаментни планове или динамично ценообразуване.' },
      ],
    },
    theory_en: `Pricing is one of the most powerful levers a startup has. A 1% improvement in pricing can increase profits by 11%, while 1% more volume only increases profits by 3.3%.

**Cost-based pricing** sets price as cost + margin. Simple but ignores customer willingness to pay. **Value-based pricing** sets price based on the value delivered to the customer. Harder to calculate but more profitable.

**Unit economics** measures the revenue and cost per single customer or transaction. The key equation: **LTV > CAC + Cost to Serve**. If this is negative, the business is unsustainable regardless of scale.

Common pricing models for digital products:
- **Subscription** (SaaS): predictable recurring revenue
- **Freemium**: free basic tier + paid premium
- **Usage-based**: pay per API call, transaction, or unit
- **Marketplace commission**: take a percentage of each transaction
- **Advertising**: free product, monetize attention

**Pricing psychology** matters: $9.99 feels cheaper than $10. Annual billing ($99/year vs. $9.99/month) increases commitment. Offering 3 tiers makes the middle option most popular (anchoring effect).

The biggest pricing mistake startups make: **charging too little.** Most early-stage companies undervalue their product out of fear of losing customers. But low prices attract price-sensitive customers who churn faster.`,
    theory_bg: `Ценообразуването е един от най-мощните лостове на стартъпа. 1% подобрение в ценообразуването може да увеличи печалбата с 11%, докато 1% повече обем увеличава само с 3.3%.

**Ценообразуване на база разходи** определя цената като разход + марж. Просто, но игнорира готовността на клиента да плати. **Ценообразуване на база стойност** определя цената на базата на стойността, доставена на клиента.

**Юнит икономика** измерва приходите и разходите на един клиент. Ключовото уравнение: **LTV > CAC + Разход за обслужване**.

Разпространени модели: абонамент (SaaS), фриймиъм, на база употреба, комисионна от маркетплейс, реклама.

**Ценова психология**: $9.99 изглежда по-евтино от $10. Годишно таксуване увеличава ангажимента. Предлагането на 3 нива прави средната опция най-популярна.

Най-голямата ценова грешка: **да таксувате твърде малко.** Повечето ранни стартъпи подценяват продукта си от страх да не загубят клиенти.`,
    quiz_questions: [
      { id: 'pr1', question_en: 'What is unit economics?', question_bg: 'Какво е юнит икономика?', options: [{ id: 'a', en: 'Revenue and cost per single customer or transaction', bg: 'Приход и разход на един клиент или транзакция', correct: true }, { id: 'b', en: 'Total company expenses', bg: 'Общи разходи на компанията', correct: false }, { id: 'c', en: 'Manufacturing cost of one product', bg: 'Производствена цена на един продукт', correct: false }] },
      { id: 'pr2', question_en: 'Why is value-based pricing better than cost-based?', question_bg: 'Защо ценообразуването на база стойност е по-добро?', options: [{ id: 'a', en: 'It captures the willingness to pay, not just your costs', bg: 'Улавя готовността за плащане, не само разходите ви', correct: true }, { id: 'b', en: 'It is easier to calculate', bg: 'По-лесно е за изчисление', correct: false }, { id: 'c', en: 'Customers prefer it', bg: 'Клиентите го предпочитат', correct: false }] },
      { id: 'pr3', question_en: 'What is the biggest pricing mistake startups make?', question_bg: 'Коя е най-голямата ценова грешка на стартъпите?', options: [{ id: 'a', en: 'Charging too much', bg: 'Таксуване на твърде много', correct: false }, { id: 'b', en: 'Charging too little', bg: 'Таксуване на твърде малко', correct: true }, { id: 'c', en: 'Not having a free tier', bg: 'Липса на безплатно ниво', correct: false }] },
    ],
    analytical_question_en: 'Compare subscription, freemium, and usage-based pricing models. For which types of products is each model most appropriate?',
    analytical_question_bg: 'Сравнете абонаментен, фриймиъм и ценообразуване на база употреба. За кои типове продукти е подходящ всеки модел?',
    application_question_en: 'Design a pricing strategy for your startup. What model would you use, what would you charge, and how would you validate that the price is right?',
    application_question_bg: 'Проектирайте ценова стратегия за вашия стартъп. Какъв модел бихте използвали и как бихте валидирали, че цената е правилна?',
    display_order: 7,
    sim_transition_en: 'Test your pricing strategy in the startup simulator to see how pricing affects revenue and growth.',
    sim_transition_bg: 'Тествайте ценовата си стратегия в стартъп симулатора, за да видите как влияе на приходите и растежа.',
  },
  {
    slug: 'team-and-roles',
    title_en: 'Team & Roles',
    title_bg: 'Екип и роли',
    hook: { en: 'Juicero raised $120M for a WiFi juicer. The team had zero food industry experience. The product was a joke. Team matters more than idea.', bg: 'Juicero привлече $120M за WiFi сокоизстисквачка. Екипът нямаше опит в храните. Продуктът беше шега. Екипът е по-важен от идеята.' },
    metaphor: { en: 'A startup team is a band: you need a drummer (ops), guitarist (tech), and vocalist (sales). Three vocalists = no band.', bg: 'Стартъп екипът е група: трябва ти барабанист (операции), китарист (технологии) и вокалист (продажби). Три вокалисти = няма група.' },
    framework: { name: 'RACI Matrix', bullets_en: ['Responsible: who does the work?', 'Accountable: who makes the final call?', 'Consulted & Informed: who gives input and who needs updates?'], bullets_bg: ['Responsible: кой прави работата?', 'Accountable: кой взема крайното решение?', 'Consulted & Informed: кой дава мнение и кой трябва да е информиран?'], apply_en: 'Create a RACI matrix for your startup\'s top 3 tasks.', apply_bg: 'Създай RACI матрица за топ 3 задачи на стартъпа си.' },
    provocations: [{ en: 'Should co-founders be friends? What are the risks?', bg: 'Трябва ли съоснователите да са приятели? Какви са рисковете?' }, { en: 'Is it better to hire generalists or specialists in an early-stage startup?', bg: 'По-добре ли е да наемеш генералисти или специалисти в ранен стартъп?' }],
    level: 2,
    startup_field: 'bmc_key_activities',
    concepts: [
      { id: 'tr-c1', name_en: 'Builder-Seller-Designer Triad', name_bg: 'Триада строител-продавач-дизайнер', explanation_en: 'Every startup needs three core functions: someone who builds (CTO), someone who sells (CEO), and someone who designs the user experience (CPO).', explanation_bg: 'Всеки стартъп се нуждае от три основни функции: някой, който строи (CTO), продава (CEO) и проектира (CPO).', example_en: 'Apple\'s founding: Wozniak (builder) + Jobs (seller/designer). The combination of technical genius and marketing vision was unstoppable.', example_bg: 'Основаването на Apple: Возняк (строител) + Джобс (продавач/дизайнер). Комбинацията от технически гений и маркетингова визия.', takeaway_en: 'All-technical or all-business teams fail most often. Balance is the key to startup team success.', takeaway_bg: 'Изцяло технически или изцяло бизнес екипи се провалят най-често. Баланс е ключът към успеха.' },
      { id: 'tr-c2', name_en: 'Vesting Schedule', name_bg: 'Вестинг график', explanation_en: 'A timeline for earning equity: typically 4 years with a 1-year cliff. Protects the company if a co-founder leaves early.', explanation_bg: 'График за придобиване на дялове: обикновено 4 години с 1-годишен cliff. Защитава компанията при ранно напускане.', example_en: 'Facebook\'s Eduardo Saverin was diluted and eventually removed. With a proper vesting schedule, this would have been cleaner and less litigious.', example_bg: 'Едуардо Саверин от Facebook беше разводнен и впоследствие отстранен. С правилен вестинг график това щеше да е по-чисто.', takeaway_en: 'Always set up vesting for co-founders from day one. It protects everyone and reduces future conflicts.', takeaway_bg: 'Винаги установявайте вестинг за съоснователи от ден първи. Защитава всички и намалява бъдещи конфликти.' },
    ],
    simulator_decision: {
      scenario_en: 'Your startup has 3 co-founders and just got $100K in funding. You need to hire your first employee.',
      scenario_bg: 'Вашият стартъп има 3 съоснователи и току-що получи $100K финансиране. Трябва да наемете първия си служител.',
      question_en: 'Who do you hire first?',
      question_bg: 'Кого наемате първо?',
      options: [
        { id: 'tr-d1', label_en: 'A senior developer', label_bg: 'Старши разработчик', description_en: 'Build faster. But expensive ($80-120K/year) and hard to find for a startup.', description_bg: 'Изграждайте по-бързо. Но скъп ($80-120K/год) и труден за намиране за стартъп.' },
        { id: 'tr-d2', label_en: 'A marketing generalist', label_bg: 'Маркетинг генералист', description_en: 'Start acquiring customers. Cheaper ($40-60K) and validates product-market fit faster.', description_bg: 'Започнете привличане на клиенти. По-евтин ($40-60K) и валидира PMF по-бързо.' },
        { id: 'tr-d3', label_en: 'A part-time advisor', label_bg: 'Съветник на непълно работно време', description_en: 'Get strategic guidance without full-time commitment. Pay with equity (0.5-1%).', description_bg: 'Получете стратегическо напътствие без пълен ангажимент. Платете с дялове (0.5-1%).' },
        { id: 'tr-d4', label_en: 'Two interns', label_bg: 'Двама стажанти', description_en: 'Cheaper, more flexible. But require training and management time.', description_bg: 'По-евтино, по-гъвкаво. Но изискват обучение и време за управление.' },
      ],
    },
    theory_en: `A startup is only as strong as its founding team. Investors often say they bet on people first, ideas second. But building the right team is not just about talent — it's about **complementary skills** and **clear roles**.

Every early-stage startup needs three core functions covered:

1. **The Builder** (CTO / Technical Lead) — builds the product, makes technology decisions, manages development.
2. **The Seller** (CEO / Business Lead) — talks to customers, closes deals, raises funding, sets vision.
3. **The Designer** (CPO / Product Lead) — understands user needs, designs the experience, bridges tech and business.

One person can cover multiple roles, but all three functions must exist. The most common startup failure pattern is **all-technical teams** (great product, no customers) or **all-business teams** (great pitch, no product).

**Equity splits** should be discussed early. The 50/50 split sounds fair but often creates deadlocks. A better approach: give the person with the most commitment and risk a slight majority, and use **vesting schedules** (typically 4 years with a 1-year cliff) to protect against early departures.

**Hiring your first employees** is a critical moment. Early hires shape company culture. Prioritize attitude and learning speed over experience.

Key principle: **Hire slow, fire fast.** A wrong hire at an early stage can destroy team morale and waste months of runway.`,
    theory_bg: `Стартъпът е толкова силен, колкото е основаващият му екип. Инвеститорите често казват, че залагат на хората, а не на идеите. Но изграждането на правилния екип не е само за талант — а за **допълващи се умения** и **ясни роли**.

Всеки ранен стартъп се нуждае от три основни функции:

1. **Строителят** (CTO) — изгражда продукта, взема технологични решения.
2. **Продавачът** (CEO) — говори с клиенти, затваря сделки, привлича финансиране.
3. **Дизайнерът** (CPO) — разбира нуждите на потребителите, проектира преживяването.

Един човек може да покрива няколко роли, но и трите функции трябва да съществуват.

**Разпределението на дялове** трябва да се обсъди рано. Разделянето 50/50 звучи справедливо, но често създава задънки. Използвайте **вестинг график** (обикновено 4 години с 1-годишен cliff).

Ключов принцип: **Наемай бавно, уволнявай бързо.**`,
    quiz_questions: [
      { id: 'tr1', question_en: 'What are the three core functions every startup needs?', question_bg: 'Кои са трите основни функции, от които всеки стартъп се нуждае?', options: [{ id: 'a', en: 'Builder, Seller, Designer', bg: 'Строител, Продавач, Дизайнер', correct: true }, { id: 'b', en: 'CEO, CFO, COO', bg: 'CEO, CFO, COO', correct: false }, { id: 'c', en: 'Marketing, Sales, Support', bg: 'Маркетинг, Продажби, Поддръжка', correct: false }] },
      { id: 'tr2', question_en: 'What is a vesting schedule?', question_bg: 'Какво е вестинг график?', options: [{ id: 'a', en: 'A timeline for earning equity over time to prevent early departures', bg: 'График за придобиване на дялове с времето, за да се предотврати ранно напускане', correct: true }, { id: 'b', en: 'A schedule for team meetings', bg: 'График за екипни срещи', correct: false }, { id: 'c', en: 'A payment plan for investors', bg: 'План за плащане на инвеститори', correct: false }] },
      { id: 'tr3', question_en: 'Why is "hire slow, fire fast" important for startups?', question_bg: 'Защо „наемай бавно, уволнявай бързо" е важно за стартъпи?', options: [{ id: 'a', en: 'A wrong early hire destroys morale and wastes runway', bg: 'Грешен ранен служител унищожава морала и пропилява ресурси', correct: true }, { id: 'b', en: 'It saves money on salaries', bg: 'Спестява пари от заплати', correct: false }, { id: 'c', en: 'It makes the company look more exclusive', bg: 'Прави компанията да изглежда по-ексклузивна', correct: false }] },
    ],
    analytical_question_en: 'Why do all-technical teams or all-business teams often fail? What makes a balanced founding team more likely to succeed?',
    analytical_question_bg: 'Защо изцяло технически или изцяло бизнес екипи често се провалят?',
    application_question_en: 'Define the key roles your startup needs in its first 6 months. Who would you hire first, and what skills would you prioritize? How would you split equity among co-founders?',
    application_question_bg: 'Определете ключовите роли, от които вашият стартъп се нуждае. Кого бихте наели първо и как бихте разпределили дяловете?',
    display_order: 8,
    sim_transition_en: 'Apply your team-building insights in the startup simulator hiring decisions.',
    sim_transition_bg: 'Приложете знанията си за изграждане на екип в решенията за наемане в стартъп симулатора.',
    embedded_case: {
      title_en: 'Juicero: The $400 Juicer That Destroyed a Startup',
      title_bg: 'Juicero: Сокоизстисквачката за $400, която унищожи стартъп',
      learning_goal_en: 'Understand how team composition and founder blind spots can lead to catastrophic product decisions.',
      learning_goal_bg: 'Разбери как съставът на екипа и слепите петна на основателите могат да доведат до катастрофални продуктови решения.',
      context_en: `Juicero was founded in 2013 by Doug Evans, a charismatic entrepreneur who pitched a vision of "the Keurig for juice." The company raised $120 million from top-tier investors including Google Ventures and Kleiner Perkins.

The team was heavily tilted toward hardware engineering and design. Juicero hired former Apple and Tesla engineers to build a beautifully designed, WiFi-connected machine with 4 tons of pressing force. The juicer contained a custom processor, a QR code scanner, and a motor powerful enough to lift two Teslas.

What the team lacked: anyone who deeply understood consumer behavior, pricing psychology, or food industry operations. The machine launched at $699 (later $399), and the proprietary juice packs cost $5-8 each.

In April 2017, Bloomberg reporters discovered: **you could squeeze the juice packs by hand and get the same result.** The $400 machine was unnecessary.`,
      context_bg: `Juicero беше основана през 2013 г. от Дъг Еванс. Компанията привлече $120 милиона от топ инвеститори.

Екипът беше силно наклонен към хардуерно инженерство. Juicero нае бивши инженери от Apple и Tesla. Машината беше свръхинженерирана — съдържаше персонализиран процесор и QR скенер.

Какво липсваше: някой, който разбира потребителското поведение и ценовата психология. Машината стартира на $699, а пакетите сок струваха $5-8.

През април 2017 г. журналисти откриха: **можеше да изстискаш пакетите с ръце.**`,
      problem_en: 'How did an all-engineering team with $120M build a product nobody needed? What role did team composition play?',
      problem_bg: 'Как изцяло инженерен екип с $120 млн. построи продукт, от който никой не се нуждаеше?',
      key_decision_en: 'Evans focused on building the most technologically impressive juicer possible, rather than validating whether consumers actually needed a machine. The team had no one asking "but would people actually pay $400 for this?"',
      key_decision_bg: 'Еванс се фокусира върху създаването на най-впечатляващата технологично сокоизстисквачка, вместо да валидира нуждата.',
      outcome_en: 'Juicero shut down in September 2017, just 16 months after launch. The $120M was a total loss. **Lesson: a balanced team with business, customer, and technical perspectives would have caught this fatal flaw before spending $120M.**',
      outcome_bg: 'Juicero затвори през септември 2017 г. Инвестицията от $120 млн. беше пълна загуба. **Урок: балансиран екип щеше да улови фаталния недостатък преди харченето на $120 млн.**',
      outcome_type: 'failure',
      analytical_questions: [
        { id: 'jc1', question_en: 'What was the real problem at Juicero — the technology, the team, the lack of validation, or the pricing? Rank and explain.', question_bg: 'Какъв беше истинският проблем — технологията, екипът, липсата на валидация или цената? Подредете и обяснете.' },
        { id: 'jc2', question_en: 'If you were an advisor to Juicero before launch, what team changes would you recommend?', question_bg: 'Ако бяхте съветник на Juicero, какви промени в екипа бихте препоръчали?' },
      ],
    },
  },
  {
    slug: 'operations-fundamentals',
    title_en: 'Operations & Processes',
    title_bg: 'Операции и процеси',
    hook: { en: 'Tesla builds 5,000 cars per week. Their factory runs 24/7. One wrong process and the entire line stops. Operations is boring — until it breaks everything.', bg: 'Tesla произвежда 5000 коли седмично. Фабриката работи 24/7. Един грешен процес и цялата линия спира. Операциите са скучни — докато не счупят всичко.' },
    metaphor: { en: 'Operations is the engine of a car. Nobody sees it, but without it, the shiny exterior is just an expensive sculpture.', bg: 'Операциите са двигателят на колата. Никой не го вижда, но без него лъскавата каросерия е просто скъпа скулптура.' },
    framework: { name: 'OKR Framework', bullets_en: ['Objective: what do you want to achieve? (qualitative)', 'Key Results: how do you measure success? (quantitative)', 'Review weekly, reset quarterly'], bullets_bg: ['Objective: какво искаш да постигнеш? (качествено)', 'Key Results: как измерваш успеха? (количествено)', 'Преглеждай седмично, ресетвай на тримесечие'], apply_en: 'Set 3 OKRs for your startup\'s next quarter.', apply_bg: 'Задай 3 OKR-а за следващото тримесечие на стартъпа си.' },
    provocations: [{ en: 'Can a startup succeed with terrible operations but great marketing?', bg: 'Може ли стартъп да успее с ужасни операции, но страхотен маркетинг?' }, { en: 'When should a founder stop doing operations themselves and hire someone?', bg: 'Кога основателят трябва да спре да прави операциите сам и да наеме някого?' }],
    level: 2,
    startup_field: 'bmc_key_resources',
    concepts: [
      { id: 'op-c1', name_en: 'Value Chain', name_bg: 'Верига на стойността', explanation_en: 'Every step from raw input to delivered customer value: sourcing → building → delivering → supporting.', explanation_bg: 'Всяка стъпка от суровия вход до доставената стойност: снабдяване → изграждане → доставка → поддръжка.', example_en: 'Amazon\'s value chain: warehouse management → 1-day delivery → customer support → returns processing — optimized at every step.', example_bg: 'Веригата на стойността на Amazon: управление на складове → доставка за 1 ден → клиентска поддръжка → обработка на връщания.', takeaway_en: 'A bottleneck in any part of the value chain slows everything. Identify and optimize the weakest link first.', takeaway_bg: 'Тесно място в която и да е част забавя всичко. Идентифицирайте и оптимизирайте най-слабото звено.' },
      { id: 'op-c2', name_en: 'Lean Operations', name_bg: 'Lean операции', explanation_en: 'Eliminating waste in every process: unnecessary steps, overproduction, waiting time, and unused talent.', explanation_bg: 'Елиминиране на разхищението: ненужни стъпки, свръхпроизводство, чакане, неизползван талант.', example_en: 'Toyota Production System: by eliminating waste, Toyota makes cars at 1/3 the defect rate of competitors with 1/2 the inventory.', example_bg: 'Производствената система на Toyota: елиминирайки разхищението, Toyota прави коли при 1/3 от дефектите на конкурентите.', takeaway_en: 'Lean is not about doing less — it\'s about eliminating what doesn\'t add value to the customer.', takeaway_bg: 'Lean не е да правиш по-малко — а да елиминираш каквото не добавя стойност за клиента.' },
    ],
    simulator_decision: {
      scenario_en: 'Your app experiences 15% downtime per month. Users are complaining, but your team is busy building new features.',
      scenario_bg: 'Вашето приложение има 15% престой месечно. Потребителите се оплакват, но екипът е зает с нови функции.',
      question_en: 'How do you fix the operations problem?',
      question_bg: 'Как решавате оперативния проблем?',
      options: [
        { id: 'op-d1', label_en: 'Pause features, fix infrastructure', label_bg: 'Спрете нови функции, поправете инфраструктурата', description_en: 'Dedicate 2 weeks to stability. No new features. Risk: lose momentum.', description_bg: 'Посветете 2 седмици на стабилност. Без нови функции. Риск: загуба на инерция.' },
        { id: 'op-d2', label_en: 'Hire a DevOps engineer', label_bg: 'Наемете DevOps инженер', description_en: 'Specialist for infrastructure. Expensive but long-term solution.', description_bg: 'Специалист по инфраструктура. Скъп, но дългосрочно решение.' },
        { id: 'op-d3', label_en: 'Automate monitoring and alerts', label_bg: 'Автоматизирайте мониторинг и алерти', description_en: 'Add tools to detect and respond to issues faster. Quick fix, partial solution.', description_bg: 'Добавете инструменти за бързо засичане и реагиране. Бързо, частично решение.' },
      ],
    },
    theory_en: `Operations is how a startup delivers its promise to customers — repeatedly, reliably, and at scale. A great idea with broken operations will lose to an average idea with excellent execution.

**The value chain** maps every step from raw input to delivered value: sourcing → building → delivering → supporting. Each link must be efficient.

For digital startups, **key operational processes** include:

1. **Product development cycle** — How fast can you ship features? Agile methodology (2-week sprints, daily standups) is the standard.
2. **Customer support** — Response time and resolution quality directly affect retention.
3. **Quality assurance** — Automated testing, staging environments, and monitoring tools are essential.

**Standard Operating Procedures (SOPs)** document how things should be done. They enable scaling — without SOPs, every new team member reinvents processes.

**Automation** is the startup superpower. Automate repetitive tasks to free up human time for creative work.

**Lean operations** means eliminating waste: unnecessary steps, overproduction, waiting time, and unused talent. The Toyota Production System principles apply perfectly to digital startups.`,
    theory_bg: `Операциите са как стартъпът изпълнява обещанието си към клиентите — многократно, надеждно и в мащаб.

**Веригата на стойността** описва всяка стъпка от вход до доставена стойност.

За дигитални стартъпи ключовите процеси включват: цикъл на разработка (Agile), клиентска поддръжка, осигуряване на качеството.

**SOPs** документират как нещата трябва да се правят, позволявайки мащабиране.

**Автоматизацията** е суперсила на стартъпа. **Lean операции** означава елиминиране на разхищение.`,
    quiz_questions: [
      { id: 'op1', question_en: 'What is the value chain?', question_bg: 'Какво е веригата на стойността?', options: [{ id: 'a', en: 'Every step from input to delivered value', bg: 'Всяка стъпка от вход до доставена стойност', correct: true }, { id: 'b', en: 'A blockchain technology', bg: 'Блокчейн технология', correct: false }, { id: 'c', en: 'The company org chart', bg: 'Организационната схема на компанията', correct: false }] },
      { id: 'op2', question_en: 'Why are SOPs important for startups?', question_bg: 'Защо SOPs са важни за стартъпите?', options: [{ id: 'a', en: 'They enable consistent scaling and onboarding', bg: 'Позволяват последователно мащабиране', correct: true }, { id: 'b', en: 'They are legally required', bg: 'Изискват се по закон', correct: false }, { id: 'c', en: 'They replace the need for management', bg: 'Заменят нуждата от управление', correct: false }] },
      { id: 'op3', question_en: 'What is the main principle of lean operations?', question_bg: 'Какъв е основният принцип на lean операциите?', options: [{ id: 'a', en: 'Eliminate waste in every process', bg: 'Елиминирай разхищението', correct: true }, { id: 'b', en: 'Hire as few people as possible', bg: 'Наеми колкото може по-малко хора', correct: false }, { id: 'c', en: 'Use only free tools', bg: 'Използвай само безплатни инструменти', correct: false }] },
    ],
    analytical_question_en: 'Why does operational excellence matter more than a great idea for long-term startup success? Give examples.',
    analytical_question_bg: 'Защо оперативното съвършенство е по-важно от страхотна идея за дългосрочния успех?',
    application_question_en: 'Map the key operational processes your startup needs. Identify one bottleneck and propose how to solve it through automation or process redesign.',
    application_question_bg: 'Опишете ключовите оперативни процеси. Идентифицирайте тесно място и предложете решение чрез автоматизация.',
    display_order: 9,
    sim_transition_en: 'Apply operational thinking in the simulator to optimize your startup execution.',
    sim_transition_bg: 'Приложете оперативно мислене в симулатора.',
  },
  {
    slug: 'supply-chain-basics',
    title_en: 'Supply Chain Basics',
    title_bg: 'Основи на веригата за доставки',
    hook: { en: 'In 2021, one stuck ship in the Suez Canal caused $9.6B in daily trade losses. Supply chains are invisible — until they break.', bg: 'През 2021 г. един заседнал кораб в Суецкия канал причини $9.6B дневни загуби. Веригите за доставки са невидими — докато не се счупят.' },
    metaphor: { en: 'Just-in-Time is like cooking fresh food for each customer. Buffer stock is like a freezer full of pre-made meals. One is efficient, the other is safe.', bg: 'Just-in-Time е като готвене на прясна храна за всеки клиент. Буферен запас е като фризер с готови ястия. Едното е ефективно, другото е безопасно.' },
    framework: { name: 'JIT vs Buffer Model', bullets_en: ['JIT: zero inventory, maximum efficiency, fragile to disruptions', 'Buffer: safety stock, higher costs, resilient to shocks', 'Best practice: hybrid approach based on risk assessment'], bullets_bg: ['JIT: нулев инвентар, максимална ефективност, крехък при прекъсвания', 'Буфер: предпазен запас, по-високи разходи, устойчив на шокове', 'Най-добра практика: хибриден подход базиран на оценка на риска'], apply_en: 'Which model fits your startup: JIT, buffer, or hybrid?', apply_bg: 'Кой модел пасва на стартъпа ти: JIT, буфер или хибрид?' },
    provocations: [{ en: 'Should every startup care about supply chain, even digital-only products?', bg: 'Трябва ли всеки стартъп да се интересува от веригата за доставки, дори при чисто дигитални продукти?' }, { en: 'How did COVID-19 change the global approach to inventory management?', bg: 'Как COVID-19 промени глобалния подход към управлението на инвентара?' }],
    level: 2,
    startup_field: 'bmc_channels',
    concepts: [
      { id: 'sc-c1', name_en: 'Digital Supply Chain', name_bg: 'Дигитална верига за доставки', explanation_en: 'The network of tech services, partners, and processes needed to deliver a digital product: cloud hosting, APIs, payment processors.', explanation_bg: 'Мрежата от технологични услуги, партньори и процеси за доставяне на дигитален продукт: облачен хостинг, API-та, платежни процесори.', example_en: 'Stripe depends on Visa/Mastercard networks, bank partnerships, and AWS infrastructure. A failure in any dependency disrupts payments.', example_bg: 'Stripe зависи от Visa/Mastercard мрежи, банкови партньорства и AWS инфраструктура. Проблем в зависимост нарушава плащанията.', takeaway_en: 'Even "software-only" startups have supply chains. Map your dependencies and plan for failures.', takeaway_bg: 'Дори „само софтуерни" стартъпи имат верига за доставки. Идентифицирайте зависимостите и планирайте за провали.' },
      { id: 'sc-c2', name_en: 'Single Point of Failure', name_bg: 'Единична точка на отказ', explanation_en: 'A dependency that, if disrupted, stops the entire business. Critical to identify and mitigate.', explanation_bg: 'Зависимост, която ако се наруши, спира целия бизнес. Критично е да се идентифицира и смекчи.', example_en: 'Zynga built its entire business on Facebook\'s platform. When Facebook changed its algorithm, Zynga lost 75% of its users overnight.', example_bg: 'Zynga изгради целия си бизнес на платформата на Facebook. Когато Facebook промени алгоритъма, Zynga загуби 75% от потребителите за една нощ.', takeaway_en: 'Never depend on a single platform, supplier, or technology for your core business. Always have a Plan B.', takeaway_bg: 'Никога не зависете от единствена платформа или доставчик за основния си бизнес. Винаги имайте План Б.' },
    ],
    simulator_decision: {
      scenario_en: 'Your app relies 100% on one cloud provider. They announce a 30% price increase next quarter.',
      scenario_bg: 'Вашето приложение разчита 100% на един облачен доставчик. Те обявяват 30% увеличение на цената.',
      question_en: 'How do you handle the supply chain risk?',
      question_bg: 'Как управлявате риска от веригата за доставки?',
      options: [
        { id: 'sc-d1', label_en: 'Negotiate a long-term contract', label_bg: 'Договорете дългосрочен контракт', description_en: 'Lock in current prices for 2 years. But you\'re even more locked in.', description_bg: 'Заключете текущите цени за 2 години. Но ставате още по-заключени.' },
        { id: 'sc-d2', label_en: 'Start multi-cloud migration', label_bg: 'Започнете мулти-клауд миграция', description_en: 'Expensive and time-consuming (3-6 months) but reduces dependency forever.', description_bg: 'Скъпо и времеемко (3-6 месеца), но намалява зависимостта завинаги.' },
        { id: 'sc-d3', label_en: 'Pass costs to customers', label_bg: 'Прехвърлете разходите на клиентите', description_en: 'Raise prices 10-15%. Risk: customer churn. But protects margins immediately.', description_bg: 'Вдигнете цените с 10-15%. Риск: загуба на клиенти. Но защитава маржовете веднага.' },
      ],
    },
    theory_en: `Even digital startups have a supply chain — the network of resources, processes, and partners needed to deliver your product to customers.

**Traditional supply chain**: Raw materials → Manufacturing → Distribution → Retail → Customer.
**Digital supply chain**: Content/Data → Processing/Platform → Distribution (Internet) → User.

**Key concepts**:
- **Upstream vs. Downstream**: Upstream = your suppliers. Downstream = your distribution and customers.
- **Just-in-Time (JIT)**: Minimize inventory and produce on demand.
- **Single point of failure**: If one supplier goes down, can your business survive?

**For digital startups**, supply chain thinking applies to:
1. **Tech stack dependencies** — Which services are you dependent on?
2. **Content pipeline** — Where does your content come from?
3. **Partnership dependencies** — Do you rely on one platform for distribution?
4. **Delivery logistics** — For startups with physical components.

**Cost optimization**: Volume discounts and strategic partnerships can reduce costs by 20-40%.`,
    theory_bg: `Дори дигиталните стартъпи имат верига за доставки — мрежата от ресурси, процеси и партньори.

**Традиционна верига**: Суровини → Производство → Дистрибуция → Клиент.
**Дигитална верига**: Съдържание/Данни → Обработка/Платформа → Потребител.

**Ключови концепции**: Upstream vs. Downstream, Just-in-Time, Единична точка на отказ.

**За дигитални стартъпи**: зависимости от технологичния стак, тръбопровод за съдържание, партньорски зависимости, логистика на доставка.

**Оптимизация**: Отстъпки за обем и партньорства могат да намалят разходите с 20-40%.`,
    quiz_questions: [
      { id: 'sc1', question_en: 'What is a digital supply chain?', question_bg: 'Какво е дигитална верига за доставки?', options: [{ id: 'a', en: 'The network of tech services, partners, and processes needed to deliver a digital product', bg: 'Мрежата от технологични услуги, партньори и процеси за доставяне на дигитален продукт', correct: true }, { id: 'b', en: 'A blockchain for tracking shipments', bg: 'Блокчейн за проследяване на пратки', correct: false }, { id: 'c', en: 'An online store inventory system', bg: 'Система за инвентар на онлайн магазин', correct: false }] },
      { id: 'sc2', question_en: 'What is a "single point of failure" in a supply chain?', question_bg: 'Какво е „единична точка на отказ"?', options: [{ id: 'a', en: 'A dependency that, if disrupted, stops the entire business', bg: 'Зависимост, която ако се наруши, спира целия бизнес', correct: true }, { id: 'b', en: 'The weakest team member', bg: 'Най-слабият член на екипа', correct: false }, { id: 'c', en: 'A bug in the software', bg: 'Бъг в софтуера', correct: false }] },
      { id: 'sc3', question_en: 'Why is platform dependency a supply chain risk?', question_bg: 'Защо зависимостта от платформа е риск?', options: [{ id: 'a', en: 'Algorithm changes can cut your distribution overnight', bg: 'Промени в алгоритъма могат да отрежат дистрибуцията ви', correct: true }, { id: 'b', en: 'Platforms always charge too much', bg: 'Платформите винаги таксуват прекалено', correct: false }, { id: 'c', en: 'Platforms are unreliable technically', bg: 'Платформите са технически ненадеждни', correct: false }] },
    ],
    analytical_question_en: 'How does supply chain thinking apply to digital startups differently from traditional businesses? Identify the key dependencies a SaaS startup has.',
    analytical_question_bg: 'Как мисленето за верига за доставки се различава за дигитални стартъпи?',
    application_question_en: 'Map your startup\'s supply chain — what are your key dependencies? Identify at least one single point of failure and propose a mitigation strategy.',
    application_question_bg: 'Опишете веригата за доставки. Идентифицирайте единична точка на отказ и предложете стратегия за смекчаване.',
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
