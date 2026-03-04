import { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'en' | 'bg';

const translations = {
  en: {
    // Header
    appName: 'DigiInnov Case Lab',
    dashboard: 'Dashboard',
    cases: 'Cases',
    simulator: 'Simulator',
    dictionary: 'Dictionary',
    profile: 'Profile',
    admin: 'Admin',
    cohorts: 'Cohorts',
    analytics: 'Analytics',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    menu: 'Menu',

    // Landing
    heroTitle: 'DigiInnov Case Lab',
    heroSubtitle: 'Master digital innovation through hands-on case studies and real-time business simulation. Analyze, decide, learn.',
    getStarted: 'Get Started',
    goToDashboard: 'Go to Dashboard',
    caseStudies: 'Case Studies',
    caseStudiesDesc: 'Work through multi-step business cases with real-world scenarios, exhibits, and rubric-graded questions.',
    browseCases: 'Browse Cases',
    businessSimulator: 'Business Simulator',
    businessSimulatorDesc: 'Run a virtual startup over 8 weeks. Make strategic decisions that affect KPIs in real-time.',
    simSubtitle: 'Run a digital startup simulation and make strategic decisions.',
    simDescription: 'Students manage a virtual startup for 8 weeks and make strategic business decisions that affect key performance indicators.',
    simInsideTitle: 'Inside the simulator students will:',
    simFeature1: 'Analyze a real digital business scenario',
    simFeature2: 'Make weekly strategic decisions',
    simFeature3: 'Manage KPIs (users, revenue, growth, churn)',
    simFeature4: 'Choose product and marketing strategies',
    simFeature5: 'Work individually or in teams',
    simFeature6: 'See how their decisions change the business results',
    simStructureTitle: 'Simulator Structure',
    simWeekLabel: 'Week',
    simWeek1: 'Market analysis and opportunity',
    simWeek2: 'Business model design',
    simWeek3: 'Product and MVP decisions',
    simWeek4: 'Growth strategy',
    simWeek5: 'Data and AI strategy',
    simWeek6: 'Operations and scaling',
    simWeek7: 'Risk and competition',
    simWeek8: 'Final strategy and results',
    simKpiTitle: 'Students track performance indicators:',
    simKpiUsers: 'Users',
    simKpiRevenue: 'Revenue',
    simKpiConversion: 'Conversion',
    simKpiRetention: 'Retention',
    simKpiGrowth: 'Growth Rate',
    simLearnMore: 'Learn More',
    simShowLess: 'Show Less',
    simStartButton: 'Start Business Simulator',
    launchSimulator: 'Launch Simulator',
    instantFeedback: 'Instant Feedback',
    instantFeedbackDesc: 'Get auto-graded results, model answers, and instructor feedback to accelerate your learning.',
    viewDashboard: 'View Dashboard',

    // Auth
    welcomeBack: 'Welcome back',
    createAccount: 'Create account',
    signInToContinue: 'Sign in to continue',
    getStartedJourney: 'Get started with your learning journey',
    fullName: 'Full Name',
    email: 'Email',
    password: 'Password',
    pleaseWait: 'Please wait...',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    backToHome: '← Back to home',

    // Case Library
    caseLibrary: 'Case Library',
    caseLibraryDesc: 'Browse and start case studies to build your digital innovation skills.',
    searchCases: 'Search cases...',
    allLevels: 'All Levels',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    allTopics: 'All Topics',
    loadingCases: 'Loading cases...',
    noCasesFound: 'No cases found',
    noCasesFilterHint: 'Try adjusting your filters or search query.',
    noCasesEmpty: 'No case studies have been published yet. Check back soon!',

    // Dictionary
    dictionaryTitle: 'Digital Innovation Dictionary',
    dictionaryDesc: 'Key terms and concepts every digital innovator should know.',
    searchTerms: 'Search terms...',
    all: 'All',
    noMatchingTerms: 'No matching terms',
    noMatchingHint: 'Try a different search query or category filter.',
    term: 'term',
    terms: 'terms',

    // About Digital Innovation
    about: 'About',
    aboutTitle: 'What is Digital Innovation?',
    aboutSubtitle: 'This platform was created to help students understand, practice, and properly apply digital innovation concepts through real-world case studies and hands-on simulation.',
    whatIsDIH: 'What is a Digital Innovation Hub?',
    dihExplanation: 'A Digital Innovation Hub (DIH) is a one-stop-shop ecosystem that helps companies — especially SMEs and startups — become more competitive by adopting digital technologies like AI, IoT, blockchain, and cloud computing. The EU has funded over 200 DIHs across Europe through the Digital Europe Programme.',
    pillar_technology: 'Access to Technology',
    pillar_technology_desc: 'AI, IoT, blockchain, cloud, big data tools and infrastructure.',
    pillar_testing: 'Testing & Experimentation',
    pillar_testing_desc: 'Sandbox environments to prototype before investing.',
    pillar_skills: 'Skills & Training',
    pillar_skills_desc: 'Upskilling workforce in digital competencies.',
    pillar_funding: 'Funding & Networking',
    pillar_funding_desc: 'Connecting startups with investors and partners.',
    whyPlatform: 'Why This Platform?',
    whyPlatformDesc: 'DigiInnov Case Lab was built so students can learn by doing — analyzing real business scenarios, making strategic decisions in a simulated environment, and receiving instant feedback. Instead of reading about digital innovation, you experience it.',
    realCaseStudies: 'Real-World Case Studies',
    realCaseStudiesDesc: 'These companies transformed their industries through digital innovation. Study their strategies and learn what made them successful.',
    readyToLearn: 'Ready to Start Learning?',
    readyToLearnDesc: 'Dive into interactive case studies or launch the business simulator to practice digital innovation hands-on.',

    // Case Preview
    prevTypeCaseStudy: 'Case Study',
    prevWorkType: 'Individual or Team',
    prevObjectives: 'Learning Objectives',
    prevObjectivesIntro: 'Students will learn to:',
    prevWhatYouDo: 'What You Will Do',
    prevDo1: 'Analyze a real business scenario',
    prevDo2: 'Review exhibits and market data',
    prevDo3: 'Answer strategic questions',
    prevDo4: 'Develop a business model',
    prevDo5: 'Submit a final recommendation',
    prevStructure: 'Case Structure',
    prevDeliverables: 'Deliverables',
    prevDeliverablesIntro: 'Students must submit:',
    prevDeliv1: 'Answers to all case questions',
    prevDeliv2: 'A final strategy recommendation',
    prevStartCase: 'Start Case Study',

    // Simulator Preview
    simPrevType: 'Business Simulation',
    simPrevDesc: 'Run a digital startup simulation where your strategic decisions affect business performance.',
    simPrevDuration: '8 weeks',
    simPrevWhatTitle: 'What Students Will Do',
    simPrevAct1: 'Analyze market opportunities',
    simPrevAct2: 'Design a digital business model',
    simPrevAct3: 'Choose product and growth strategies',
    simPrevAct4: 'Manage key performance indicators',
    simPrevAct5: 'Respond to market changes',
    simPrevKpiTitle: 'KPI Dashboard',
    simPrevDelivIntro: 'Students must:',
    simPrevDeliv1: 'Submit weekly strategic decisions',
    simPrevDeliv2: 'Explain their reasoning',
    simPrevDeliv3: 'Analyze final results',

    // General
    min: 'min',
  },
  bg: {
    // Header
    appName: 'DigiInnov Case Lab',
    dashboard: 'Табло',
    cases: 'Казуси',
    simulator: 'Симулатор',
    dictionary: 'Речник',
    profile: 'Профил',
    admin: 'Админ',
    cohorts: 'Кохорти',
    analytics: 'Анализи',
    signIn: 'Вход',
    signUp: 'Регистрация',
    signOut: 'Изход',
    menu: 'Меню',

    // Landing
    heroTitle: 'DigiInnov Case Lab',
    heroSubtitle: 'Овладейте дигиталните иновации чрез практически казуси и бизнес симулация в реално време. Анализирайте, решавайте, учете.',
    getStarted: 'Започнете',
    goToDashboard: 'Към таблото',
    caseStudies: 'Казуси',
    caseStudiesDesc: 'Работете по многостъпкови бизнес казуси с реални сценарии, експонати и въпроси с рубрика за оценяване.',
    browseCases: 'Разгледай казуси',
    businessSimulator: 'Бизнес симулатор',
    businessSimulatorDesc: 'Управлявайте виртуален стартъп за 8 седмици. Вземайте стратегически решения, които влияят на KPI в реално време.',
    simSubtitle: 'Стартирайте симулация на дигитален стартъп и вземайте стратегически решения.',
    simDescription: 'Студентите управляват виртуален стартъп в продължение на 8 седмици и вземат стратегически бизнес решения, които влияят на ключови показатели за ефективност.',
    simInsideTitle: 'В симулатора студентите ще:',
    simFeature1: 'Анализират реален дигитален бизнес сценарий',
    simFeature2: 'Вземат седмични стратегически решения',
    simFeature3: 'Управляват KPI (потребители, приходи, растеж, отлив)',
    simFeature4: 'Избират продуктови и маркетингови стратегии',
    simFeature5: 'Работят индивидуално или в екипи',
    simFeature6: 'Виждат как техните решения променят бизнес резултатите',
    simStructureTitle: 'Структура на симулатора',
    simWeekLabel: 'Седмица',
    simWeek1: 'Пазарен анализ и възможности',
    simWeek2: 'Дизайн на бизнес модел',
    simWeek3: 'Продукт и MVP решения',
    simWeek4: 'Стратегия за растеж',
    simWeek5: 'Стратегия за данни и AI',
    simWeek6: 'Операции и мащабиране',
    simWeek7: 'Риск и конкуренция',
    simWeek8: 'Финална стратегия и резултати',
    simKpiTitle: 'Студентите проследяват показатели:',
    simKpiUsers: 'Потребители',
    simKpiRevenue: 'Приходи',
    simKpiConversion: 'Конверсия',
    simKpiRetention: 'Задържане',
    simKpiGrowth: 'Темп на растеж',
    simLearnMore: 'Научи повече',
    simShowLess: 'Скрий',
    simStartButton: 'Стартирай бизнес симулатор',
    launchSimulator: 'Стартирай симулатор',
    instantFeedback: 'Незабавна обратна връзка',
    instantFeedbackDesc: 'Получете автоматично оценени резултати, примерни отговори и обратна връзка от инструктора.',
    viewDashboard: 'Към таблото',

    // Auth
    welcomeBack: 'Добре дошли отново',
    createAccount: 'Създаване на акаунт',
    signInToContinue: 'Влезте, за да продължите',
    getStartedJourney: 'Започнете вашето учебно пътешествие',
    fullName: 'Пълно име',
    email: 'Имейл',
    password: 'Парола',
    pleaseWait: 'Моля, изчакайте...',
    noAccount: 'Нямате акаунт?',
    haveAccount: 'Вече имате акаунт?',
    backToHome: '← Към началото',

    // Case Library
    caseLibrary: 'Библиотека с казуси',
    caseLibraryDesc: 'Разгледайте и започнете казуси, за да развиете уменията си в дигиталните иновации.',
    searchCases: 'Търси казуси...',
    allLevels: 'Всички нива',
    beginner: 'Начинаещ',
    intermediate: 'Средно ниво',
    advanced: 'Напреднал',
    allTopics: 'Всички теми',
    loadingCases: 'Зареждане на казуси...',
    noCasesFound: 'Няма намерени казуси',
    noCasesFilterHint: 'Опитайте да промените филтрите или заявката за търсене.',
    noCasesEmpty: 'Все още няма публикувани казуси. Проверете отново скоро!',

    // Dictionary
    dictionaryTitle: 'Речник за дигитални иновации',
    dictionaryDesc: 'Ключови термини и концепции, които всеки дигитален иноватор трябва да знае.',
    searchTerms: 'Търси термини...',
    all: 'Всички',
    noMatchingTerms: 'Няма съвпадащи термини',
    noMatchingHint: 'Опитайте с друга заявка за търсене или филтър по категория.',
    term: 'термин',
    terms: 'термина',

    // About Digital Innovation
    about: 'За ДИ',
    aboutTitle: 'Какво е дигитална иновация?',
    aboutSubtitle: 'Тази платформа е създадена, за да помогне на студентите да разберат, практикуват и правилно прилагат концепциите за дигитална иновация чрез реални казуси и практическа симулация.',
    whatIsDIH: 'Какво е хъб за дигитални иновации?',
    dihExplanation: 'Хъбът за дигитални иновации (DIH) е екосистема на едно гише, която помага на компаниите — особено МСП и стартъпи — да станат по-конкурентоспособни чрез възприемане на дигитални технологии като AI, IoT, блокчейн и облачни изчисления. ЕС е финансирал над 200 DIH в Европа чрез програмата „Цифрова Европа".',
    pillar_technology: 'Достъп до технологии',
    pillar_technology_desc: 'AI, IoT, блокчейн, облак, инструменти и инфраструктура за големи данни.',
    pillar_testing: 'Тестване и експериментиране',
    pillar_testing_desc: 'Среди за прототипиране преди инвестиране.',
    pillar_skills: 'Умения и обучение',
    pillar_skills_desc: 'Повишаване квалификацията в дигитални компетенции.',
    pillar_funding: 'Финансиране и мрежи',
    pillar_funding_desc: 'Свързване на стартъпи с инвеститори и партньори.',
    whyPlatform: 'Защо тази платформа?',
    whyPlatformDesc: 'DigiInnov Case Lab е създаден, за да могат студентите да учат чрез практика — анализирайки реални бизнес сценарии, вземайки стратегически решения в симулирана среда и получавайки незабавна обратна връзка. Вместо да четете за дигитални иновации, вие ги изживявате.',
    realCaseStudies: 'Реални казуси',
    realCaseStudiesDesc: 'Тези компании трансформираха своите индустрии чрез дигитална иновация. Изучете техните стратегии и научете какво ги направи успешни.',
    readyToLearn: 'Готови ли сте да започнете?',
    readyToLearnDesc: 'Потопете се в интерактивни казуси или стартирайте бизнес симулатора, за да практикувате дигитална иновация на практика.',

    // Case Preview
    prevTypeCaseStudy: 'Казус',
    prevWorkType: 'Индивидуално или в екип',
    prevObjectives: 'Учебни цели',
    prevObjectivesIntro: 'Студентите ще се научат да:',
    prevWhatYouDo: 'Какво ще правите',
    prevDo1: 'Анализирате реален бизнес сценарий',
    prevDo2: 'Преглеждате експонати и пазарни данни',
    prevDo3: 'Отговаряте на стратегически въпроси',
    prevDo4: 'Разработвате бизнес модел',
    prevDo5: 'Подавате финална препоръка',
    prevStructure: 'Структура на казуса',
    prevDeliverables: 'Резултати за предаване',
    prevDeliverablesIntro: 'Студентите трябва да предадат:',
    prevDeliv1: 'Отговори на всички въпроси от казуса',
    prevDeliv2: 'Финална стратегическа препоръка',
    prevStartCase: 'Започни казус',

    // Simulator Preview
    simPrevType: 'Бизнес симулация',
    simPrevDesc: 'Стартирайте симулация на дигитален стартъп, където вашите стратегически решения влияят на бизнес резултатите.',
    simPrevDuration: '8 седмици',
    simPrevWhatTitle: 'Какво ще правят студентите',
    simPrevAct1: 'Анализират пазарни възможности',
    simPrevAct2: 'Проектират дигитален бизнес модел',
    simPrevAct3: 'Избират продуктови стратегии и стратегии за растеж',
    simPrevAct4: 'Управляват ключови показатели за ефективност',
    simPrevAct5: 'Реагират на пазарни промени',
    simPrevKpiTitle: 'KPI Табло',
    simPrevDelivIntro: 'Студентите трябва да:',
    simPrevDeliv1: 'Подават седмични стратегически решения',
    simPrevDeliv2: 'Обяснят своите разсъждения',
    simPrevDeliv3: 'Анализират крайните резултати',

    // General
    min: 'мин',
  },
} as const;

type Translations = Record<keyof typeof translations['en'], string>;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('digiinnov-lang');
    return (saved === 'bg' ? 'bg' : 'en') as Lang;
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem('digiinnov-lang', l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
