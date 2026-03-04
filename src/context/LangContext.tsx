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
