/**
 * Practice-first content seed V1 — draft learning modules for the 5
 * approved themes in `content-structure.ts`. All modules are
 * `needs_review`. Nothing here is educator_approved.
 */
import { PRACTICE_THEORY_RATIO, type ThemeId } from './content-structure';

export type ModuleReviewStatus =
  | 'needs_review'
  | 'needs_content_review'
  | 'ready_for_educator_review'
  | 'educator_approved';

export interface PracticeTask {
  id: string;
  title_en: string;
  title_bg: string;
  kind:
    | 'observation'
    | 'information_search'
    | 'fact_vs_assumption'
    | 'analysis'
    | 'comparison'
    | 'mvp_definition'
    | 'experiment_design'
    | 'case_evaluation'
    | 'decision'
    | 'reflection'
    | 'iteration';
  brief_en: string;
  brief_bg: string;
  /**
   * Optional CEFE-style experiential learning block. Non-breaking:
   * when present the practice page can render an action → visible result →
   * processing → generalizing → applying flow with a teacher check and a
   * named evidence artifact. Content-only — no submissions, no XP.
   */
  cefe?: {
    action_en: string;
    action_bg: string;
    visibleResult_en: string;
    visibleResult_bg: string;
    processingQuestions_en: string[];
    processingQuestions_bg: string[];
    generalizing_en: string;
    generalizing_bg: string;
    applying_en: string;
    applying_bg: string;
    teacherCheck_en: string;
    teacherCheck_bg: string;
    evidence_en: string;
    evidence_bg: string;
  };
}

export interface CaseConnection {
  caseId: string;
  reviewStatus: 'needs_content_review';
  note_en?: string;
  note_bg?: string;
}

export interface PracticeFirstModule {
  id: string;
  themeId: ThemeId;
  title_en: string;
  title_bg: string;
  status: ModuleReviewStatus;
  theoryBlock_en: string;
  theoryBlock_bg: string;
  practiceRatio: typeof PRACTICE_THEORY_RATIO;
  keyConcepts: string[];
  dictionaryConcepts: string[];
  practiceTasks: PracticeTask[];
  // TODO(v1b): evidenceOfSkill is currently EN-only string[]. When we
  // introduce bilingual evidence descriptors, refactor to { en; bg } pairs
  // across all themes in one pass instead of ad-hoc per module.
  informationSearchTask?: { prompt_en: string; prompt_bg: string };
  caseConnection?: CaseConnection;
  kikiQuestions: { en: string; bg: string }[];
  evidenceOfSkill: string[];
  reflectionPrompt: { en: string; bg: string };
  improvementPrompt: { en: string; bg: string };
}

const R = PRACTICE_THEORY_RATIO;

/**
 * Batch 1 — Entrepreneurship theme only.
 * All modules are drafts (`needs_review`). No educator approval implied.
 * Standard English terms (MVP, Lean Startup, BMC, Lean Canvas, Go-to-market,
 * Pitch, Product-market fit, Pivot, Persevere, Startup) are kept as-is in
 * both languages.
 */
export const ENTREPRENEURSHIP_MODULES: PracticeFirstModule[] = [
  {
    id: 'entr-01-thinking-and-action',
    themeId: 'entrepreneurship',
    title_en: 'What entrepreneurship means as thinking and action',
    title_bg: 'Какво означава предприемачество като мислене и действие',
    status: 'needs_review',
    theoryBlock_en:
      'Entrepreneurship is a way of thinking and acting, not a personality type. You notice a real problem, form a small testable hypothesis about a possible solution, and check it with real people before spending serious time or money. A Startup is one form. The same thinking works inside schools, teams, NGOs and existing companies.',
    theoryBlock_bg:
      'Предприемачеството е начин на мислене и действие, не черта на характера. Забелязваш реален проблем, формулираш малка проверима хипотеза за възможно решение и я проверяваш с реални хора, преди да вложиш време или пари. Startup е една от формите. Същият начин на мислене работи в училище, в екипи, в НПО и в съществуващи компании.',
    practiceRatio: R,
    keyConcepts: ['Entrepreneurial mindset', 'Action vs intention', 'Startup', 'Small bets'],
    dictionaryConcepts: ['Entrepreneurship', 'Entrepreneurial mindset', 'Startup', 'Lean Startup'],
    practiceTasks: [
      {
        id: 'entr-01-t1',
        title_en: 'Map three real problems you noticed this week',
        title_bg: 'Опиши три реални проблема, които забеляза тази седмица',
        kind: 'observation',
        brief_en:
          'List 3 problems you saw in the last 7 days (school, family, city, online). For each: who has it, where you saw it, why it matters. No solutions.',
        brief_bg:
          'Опиши 3 проблема, които видя през последните 7 дни (училище, семейство, град, онлайн). За всеки: кой го има, къде го видя, защо има значение. Без решения.',
        cefe: {
          action_en:
            'Spend 30 minutes walking through 2 different environments (school, home, transport, a shop). Record 3 concrete problems in a short log with time, place and who was affected.',
          action_bg:
            'Отдели 30 минути и премини през 2 различни среди (училище, дом, транспорт, магазин). Запиши 3 конкретни проблема в кратък журнал с час, място и кого засяга.',
          visibleResult_en:
            'A written observation log with 3 dated entries. Each entry: time, place, who, what happened, why it matters. No solutions in the problem line.',
          visibleResult_bg:
            'Писмен журнал с 3 датирани записа. Всеки запис: час, място, кой, какво се случи, защо има значение. В реда за проблема не се появява решение.',
          processingQuestions_en: [
            'Which of the 3 problems did you see with your own eyes, and which did you only hear about?',
            'For each problem, what did you observe vs. what did you assume?',
            'Which problem repeats and which was a one-off?',
          ],
          processingQuestions_bg: [
            'Кои от 3-те проблема видя с очите си, а за кои само чу?',
            'За всеки проблем: какво наблюдава и какво допусна?',
            'Кой проблем се повтаря и кой беше еднократен?',
          ],
          generalizing_en:
            'Real problems are located in time, place and people. A problem you can point to is more useful than a problem you can only describe.',
          generalizing_bg:
            'Реалните проблеми имат време, място и хора. Проблем, който можеш да посочиш, е по-полезен от такъв, който само описваш.',
          applying_en:
            'Rewrite one entry as a one-sentence problem statement without a solution, ready for the next task.',
          applying_bg:
            'Пренапиши един запис като изречение-проблем без решение, готово за следващата задача.',
          teacherCheck_en:
            'Log has 3 dated entries; each names a person or group; no solution appears in the problem line.',
          teacherCheck_bg:
            'Журналът има 3 датирани записа; всеки посочва човек или група; в реда за проблема няма решение.',
          evidence_en: 'Observation log with 3 entries.',
          evidence_bg: 'Журнал с 3 наблюдения.',
        },
      },
      {
        id: 'entr-01-t2',
        title_en: 'Turn one observation into a small testable hypothesis',
        title_bg: 'Превърни едно наблюдение в малка проверима хипотеза',
        kind: 'decision',
        brief_en:
          'Pick one problem. Write: "I believe X people would do Y if we offered Z." Add what would have to be true for this to hold.',
        brief_bg:
          'Избери един проблем. Напиши: „Вярвам, че X хора биха направили Y, ако им предложим Z.“ Добави какво трябва да е вярно, за да е така.',
        cefe: {
          action_en:
            'Pick one problem from your log. Write it as: "I believe [X people] would [do Y] if we offered [Z], because [reason]. This is true if [measurable signal]. This is false if [measurable signal]."',
          action_bg:
            'Избери един проблем от журнала. Напиши го така: „Вярвам, че [X хора] биха [направили Y], ако им предложим [Z], защото [причина]. Ще е вярно, ако [измерим сигнал]. Ще е грешно, ако [измерим сигнал].“',
          visibleResult_en:
            'One written hypothesis card with an explicit confirming signal and an explicit disconfirming signal.',
          visibleResult_bg:
            'Една хипотеза-карта с ясен сигнал за потвърждение и ясен сигнал за опровергаване.',
          processingQuestions_en: [
            'What in your hypothesis is evidence and what is guess?',
            'How would you know within 7 days that the hypothesis is wrong?',
            'Which word could you delete without weakening the hypothesis?',
          ],
          processingQuestions_bg: [
            'Кое в хипотезата е доказателство и кое е предположение?',
            'Как за 7 дни ще разбереш, че хипотезата е грешна?',
            'Коя дума можеш да махнеш, без да отслабиш хипотезата?',
          ],
          generalizing_en:
            'A hypothesis is only useful if it can be shown wrong. Vague hypotheses cannot be tested.',
          generalizing_bg:
            'Хипотезата е полезна само ако може да бъде показана като грешна. Размитите хипотези не се тестват.',
          applying_en:
            'Rewrite the hypothesis after a peer challenges the weakest word.',
          applying_bg:
            'Пренапиши хипотезата, след като съученик оспори най-слабата дума.',
          teacherCheck_en:
            'Card includes a specific group, an action, an offer and at least one measurable disconfirming signal.',
          teacherCheck_bg:
            'Картата съдържа конкретна група, действие, предложение и поне един измерим сигнал за опровергаване.',
          evidence_en: 'Hypothesis card.',
          evidence_bg: 'Хипотеза-карта.',
        },
      },
    ],
    caseConnection: {
      caseId: 'school-youth-environment',
      reviewStatus: 'needs_content_review',
      note_en: 'Use as an example of noticing a problem inside a familiar environment.',
      note_bg: 'Използвай като пример за забелязване на проблем в позната среда.',
    },
    kikiQuestions: [
      { en: 'What is the problem — in one sentence, without a solution?', bg: 'Какъв е проблемът — в едно изречение, без решение?' },
      { en: 'Who has this problem, and how often?', bg: 'Кой има този проблем и колко често?' },
      { en: 'What did you observe, and what did you assume?', bg: 'Какво наблюдава и какво допусна?' },
      { en: 'What is the smallest action you can take this week to learn more?', bg: 'Кое е най-малкото действие тази седмица, за да научиш повече?' },
      { en: 'What evidence would tell you this is not worth pursuing?', bg: 'Кое доказателство би показало, че не си струва?' },
    ],
    evidenceOfSkill: ['Наблюдение на проблем', 'Формулиране без готово решение', 'Разграничаване на факт и допускане'],
    reflectionPrompt: {
      en: 'Which of the 3 problems felt strongest, and why? Fact or feeling?',
      bg: 'Кой от 3-те проблема ти се стори най-силен и защо? Факт или усещане?',
    },
    improvementPrompt: {
      en: 'If you repeated this next week, what would you observe differently?',
      bg: 'Ако повториш задачата следващата седмица, какво би наблюдавал(а) различно?',
    },
  },

  {
    id: 'entr-02-curiosity-and-problem-discovery',
    themeId: 'entrepreneurship',
    title_en: 'Curiosity, observation and problem discovery',
    title_bg: 'Любопитство, наблюдение и откриване на проблеми',
    status: 'needs_review',
    theoryBlock_en:
      'Good problems are found, not invented. Curiosity is a working habit: ask more than you answer, watch what people do (not what they say), separate the symptom from the underlying problem.',
    theoryBlock_bg:
      'Добрите проблеми се откриват, а не се измислят. Любопитството е работен навик: питай повече, отколкото отговаряш, гледай какво хората правят (не какво казват), разграничавай симптома от истинския проблем.',
    practiceRatio: R,
    keyConcepts: ['Curiosity as method', 'Observation vs interpretation', 'Symptom vs root cause'],
    dictionaryConcepts: ['Problem discovery', 'Customer interview', 'Root cause'],
    practiceTasks: [
      {
        id: 'entr-02-t1',
        title_en: 'Silent observation, 20 minutes',
        title_bg: 'Тиха наблюдателна сесия, 20 минути',
        kind: 'observation',
        brief_en:
          '20 minutes in a real place (school hallway, cafe, transport). Write only what you see and hear — no explanations. Then list 3 possible problems, marked as observation or guess.',
        brief_bg:
          '20 минути на реално място (коридор, кафене, транспорт). Записвай само това, което виждаш и чуваш — без обяснения. После опиши 3 възможни проблема, като отбележиш кое е наблюдение и кое предположение.',
        cefe: {
          action_en:
            'Go to a real public place (school corridor, canteen, bus, cafe). For 20 minutes record only what you see and hear. No interpretation. Add a timestamp every 2–3 minutes.',
          action_bg:
            'Отиди на реално обществено място (коридор, столова, автобус, кафене). За 20 минути записвай само какво виждаш и чуваш. Без интерпретации. Слагай часова отметка на всеки 2–3 минути.',
          visibleResult_en:
            'A raw observation sheet with timestamps and a second column that separates "observed" from "assumed".',
          visibleResult_bg:
            'Суров лист за наблюдение с часови отметки и втора колона, която разделя „наблюдавано“ от „допуснато“.',
          processingQuestions_en: [
            'Where did you slip from observation into interpretation?',
            'What surprised you compared to what you expected before you started?',
            'Which 3 possible problems emerged — and are they problems for the users or for you?',
          ],
          processingQuestions_bg: [
            'Къде премина от наблюдение към интерпретация?',
            'Какво те изненада спрямо това, което очакваше преди началото?',
            'Кои 3 възможни проблема излязоха — и проблем ли са за потребителите или за теб?',
          ],
          generalizing_en:
            'Observation without interpretation is a discipline. Most people describe what they think, not what actually happened.',
          generalizing_bg:
            'Наблюдението без интерпретация е дисциплина. Повечето хора описват какво си мислят, а не какво се случи.',
          applying_en:
            'Design one 10-minute follow-up observation focused on one behavior you noticed.',
          applying_bg:
            'Проектирай едно допълващо 10-минутно наблюдение, фокусирано върху едно поведение, което забеляза.',
          teacherCheck_en:
            'Sheet has ≥8 timestamped entries; observed and assumed columns are separated; 3 candidate problems listed.',
          teacherCheck_bg:
            'Листът има ≥8 записа с часови отметки; колоните „наблюдавано“ и „допуснато“ са отделени; 3 възможни проблема са изброени.',
          evidence_en: 'Timestamped observation sheet.',
          evidence_bg: 'Лист за наблюдение с часови отметки.',
        },
      },
      {
        id: 'entr-02-t2',
        title_en: 'Five whys on one problem',
        title_bg: '„Пет пъти защо“ върху един проблем',
        kind: 'analysis',
        brief_en:
          'Take one problem from Module 1. Ask "why?" five times. Write each answer. Mark where you had evidence and where you guessed.',
        brief_bg:
          'Вземи един проблем от Модул 1. Попитай „защо?“ пет пъти. Запиши всеки отговор. Отбележи къде имаш доказателство и къде си предположил(а).',
        cefe: {
          action_en:
            'Take one problem from Module 1. Write it at the top. Ask "why does this happen?" five times, writing each answer on a new line. After each answer, mark [evidence] or [guess].',
          action_bg:
            'Вземи един проблем от Модул 1. Напиши го най-отгоре. Попитай „защо се случва това?“ пет пъти, като записваш всеки отговор на нов ред. След всеки отговор отбележи [доказателство] или [предположение].',
          visibleResult_en:
            'A five-level "why" chain, each level marked evidence or guess.',
          visibleResult_bg:
            'Верига „защо“ с 5 нива, всяко ниво отбелязано като доказателство или предположение.',
          processingQuestions_en: [
            'At which level did guesses start replacing evidence?',
            'Does the root cause you reached match the symptom you started from?',
            'Which "why" would need an interview or a source to be answered honestly?',
          ],
          processingQuestions_bg: [
            'На кое ниво предположенията започнаха да заменят доказателствата?',
            'Съвпада ли достигнатата коренова причина със симптома, от който тръгна?',
            'Кое „защо“ се нуждае от интервю или източник, за да получи честен отговор?',
          ],
          generalizing_en:
            'Symptoms are what you notice. Root causes are one or two "whys" deeper than most people go.',
          generalizing_bg:
            'Симптомите са това, което забелязваш. Кореновите причини са едно-две „защо“ по-дълбоко от там, докъдето стигат повечето хора.',
          applying_en:
            'Turn the deepest "why" without evidence into a question you can answer with one interview or 3 sources.',
          applying_bg:
            'Превърни най-дълбокото „защо“ без доказателство във въпрос, на който можеш да отговориш с едно интервю или 3 източника.',
          teacherCheck_en:
            'Chain has 5 levels; at least one level marked as guess; the final line reframes the problem, not just the symptom.',
          teacherCheck_bg:
            'Веригата има 5 нива; поне едно ниво е отбелязано като предположение; последният ред преформулира проблема, а не симптома.',
          evidence_en: 'Five whys chain.',
          evidence_bg: 'Верига „пет пъти защо“.',
        },
      },
    ],
    informationSearchTask: {
      prompt_en: 'Find 2 sources (article, report, video, interview) on the same problem. Note who published, when.',
      prompt_bg: 'Намери 2 източника (статия, доклад, видео, интервю) за същия проблем. Запиши кой и кога го е публикувал.',
    },
    caseConnection: {
      caseId: 'food-waste-sustainability',
      reviewStatus: 'needs_content_review',
    },
    kikiQuestions: [
      { en: 'What did you see with your own eyes vs. read online?', bg: 'Какво видя с очите си и какво прочете онлайн?' },
      { en: 'What is the symptom and what may be the real problem under it?', bg: 'Кое е симптомът и кой може да е реалният проблем под него?' },
      { en: 'Who is affected most, and how do you know?', bg: 'Кой е най-засегнат и откъде знаеш?' },
      { en: 'Which of your questions still has no evidence?', bg: 'Кой въпрос все още няма доказателство?' },
    ],
    evidenceOfSkill: ['Структурирано наблюдение', 'Мислене за коренова причина', 'Съпоставяне на източници'],
    reflectionPrompt: {
      en: 'Where did you interpret instead of observe? Give one concrete example.',
      bg: 'Къде интерпретира вместо да наблюдаваш? Дай един конкретен пример.',
    },
    improvementPrompt: {
      en: 'What one question would you add to your observation next time?',
      bg: 'Един въпрос, който би добавил(а) към наблюдението следващия път?',
    },
  },

  {
    id: 'entr-03-fact-opinion-assumption',
    themeId: 'entrepreneurship',
    title_en: 'Fact, opinion, assumption and information search',
    title_bg: 'Факт, мнение, допускане и търсене на информация',
    status: 'needs_review',
    theoryBlock_en:
      'Facts can be checked. Opinions belong to a person. Assumptions are things you treat as true without checking. Most early Startup mistakes are assumptions dressed up as facts. Label each statement honestly before you decide.',
    theoryBlock_bg:
      'Фактите могат да се проверят. Мненията принадлежат на човек. Допусканията са неща, които приемаш за верни, без да си ги проверил. Повечето ранни грешки в един Startup са допускания, представени като факти. Етикетирай честно всяко твърдение, преди да решиш.',
    practiceRatio: R,
    keyConcepts: ['Fact vs opinion vs assumption', 'Evidence', 'Source quality'],
    dictionaryConcepts: ['Assumptions', 'Evidence', 'Information search'],
    practiceTasks: [
      {
        id: 'entr-03-t1',
        title_en: 'Label 10 statements',
        title_bg: 'Етикетирай 10 твърдения',
        kind: 'fact_vs_assumption',
        brief_en:
          'Take a short article, social post or founder quote. Extract 10 statements. Label each: fact, opinion, assumption. For every "fact" write the source that could verify it.',
        brief_bg:
          'Вземи кратка статия, публикация или цитат на основател. Извлечи 10 твърдения. Етикетирай всяко: факт, мнение, допускане. За всеки „факт“ запиши източника, който може да го потвърди.',
      },
      {
        id: 'entr-03-t2',
        title_en: 'Turn 3 assumptions into checkable questions',
        title_bg: 'Превърни 3 допускания в проверими въпроси',
        kind: 'information_search',
        brief_en:
          'From your own idea, list 3 assumptions. For each, write one question you can answer this week — a search, a message, a short interview.',
        brief_bg:
          'От собствената си идея запиши 3 допускания. За всяко напиши един въпрос, на който можеш да отговориш тази седмица — търсене, съобщение, кратко интервю.',
      },
    ],
    informationSearchTask: {
      prompt_en: 'For one assumption, find 3 independent sources. Note which agree, which disagree, which are unclear.',
      prompt_bg: 'За едно допускане намери 3 независими източника. Отбележи кои се съгласяват, кои не, кои са неясни.',
    },
    caseConnection: {
      caseId: 'chatgpt-ai-business-model',
      reviewStatus: 'needs_content_review',
      note_en: 'Great source of confidently stated assumptions to test.',
      note_bg: 'Добър пример за уверено изказани допускания за проверка.',
    },
    kikiQuestions: [
      { en: 'Which of your "facts" would fail a serious source check?', bg: 'Кои от твоите „факти“ биха паднали при сериозна проверка на източника?' },
      { en: 'What is your strongest evidence — and how strong is it really?', bg: 'Кое е най-силното ти доказателство — и колко силно е наистина?' },
      { en: 'What is still unknown, and does the decision depend on it?', bg: 'Какво все още не знаеш и зависи ли решението от това?' },
      { en: 'Whose opinion are you quoting, and why trust them?', bg: 'Чие мнение цитираш и защо му вярваш?' },
      { en: 'What would change your mind?', bg: 'Какво би те накарало да промениш мнението си?' },
    ],
    evidenceOfSkill: ['Работа с източници', 'Разграничаване на факт, мнение и допускане', 'Критично четене'],
    reflectionPrompt: {
      en: 'Which assumption were you most attached to, and why?',
      bg: 'Към кое допускане беше най-привързан(а) и защо?',
    },
    improvementPrompt: {
      en: 'How will you check assumptions earlier next time?',
      bg: 'Как ще проверяваш допусканията по-рано следващия път?',
    },
  },

  {
    id: 'entr-04-opportunity-value-business-model',
    themeId: 'entrepreneurship',
    title_en: 'Opportunity, value creation and business model',
    title_bg: 'Възможност, създаване на стойност и бизнес модел',
    status: 'needs_review',
    theoryBlock_en:
      'An opportunity exists when a real problem meets people who care enough to change behavior or pay. Value is what measurably improves in the user\'s life. A business model describes how that value is delivered and how the effort behind it is sustained — through revenue, resources or long-term return. It is often first sketched on a Business Model Canvas or Lean Canvas.',
    theoryBlock_bg:
      'Възможност съществува, когато реален проблем срещне хора, за които той е достатъчно важен, за да променят поведение или да платят. Стойност е това, което измеримо се подобрява в живота на потребителя. Бизнес моделът описва как тази стойност стига до потребителя и как усилието зад нея се поддържа — чрез приход, ресурс или дългосрочна възвръщаемост. Най-често се скицира първо на Business Model Canvas или Lean Canvas.',
    practiceRatio: R,
    keyConcepts: ['Opportunity', 'Value proposition', 'Business Model Canvas', 'Lean Canvas'],
    dictionaryConcepts: ['Opportunity recognition', 'Value proposition', 'Business model'],
    practiceTasks: [
      {
        id: 'entr-04-t1',
        title_en: 'Draft a one-line value proposition',
        title_bg: 'Скицирай value proposition в едно изречение',
        kind: 'analysis',
        brief_en:
          'Write: "For [who], who [problem], our [solution] gives [main benefit], unlike [alternative]." Then challenge every word.',
        brief_bg:
          'Напиши: „За [кой], който [проблем], нашето [решение] дава [основна полза], за разлика от [алтернатива].“ След това оспори всяка дума.',
      },
      {
        id: 'entr-04-t2',
        title_en: 'Fill a rough Lean Canvas',
        title_bg: 'Попълни груб Lean Canvas',
        kind: 'mvp_definition',
        brief_en:
          'Fill only 5 blocks: problem, customer segment, unique value proposition, solution, channels. Mark each as evidence, assumption, or guess.',
        brief_bg:
          'Попълни само 5 блока: проблем, клиентски сегмент, уникално value proposition, решение, канали. Маркирай всеки като доказателство, допускане или предположение.',
      },
    ],
    caseConnection: {
      caseId: 'revolut-fintech',
      reviewStatus: 'needs_content_review',
      note_en: 'Use to compare Revolut\'s early value proposition with today\'s.',
      note_bg: 'Използвай, за да сравниш ранното value proposition на Revolut с днешното.',
    },
    kikiQuestions: [
      { en: 'Who exactly is this for, and who is it not for?', bg: 'За кого точно е това и за кого не е?' },
      { en: 'What changes in the user\'s life if this works?', bg: 'Какво се променя в живота на потребителя, ако това работи?' },
      { en: 'What are they using today instead, and why?', bg: 'Какво използват днес вместо това и защо?' },
      { en: 'Which block on your canvas has the weakest evidence?', bg: 'Кой блок в твоя canvas има най-слабо доказателство?' },
      { en: 'How does value reach the user, and how does the work behind it sustain itself?', bg: 'Как стойността стига до потребителя и как работата зад нея се поддържа?' },
    ],
    evidenceOfSkill: ['Формулиране на стойност', 'Разбиране на бизнес модел', 'Ясен клиентски сегмент'],
    reflectionPrompt: {
      en: 'Which block did you fill from real evidence, and which from imagination?',
      bg: 'Кой блок попълни от реални доказателства и кой от въображение?',
    },
    improvementPrompt: {
      en: 'What one block will you strengthen with evidence this week?',
      bg: 'Кой един блок ще подсилиш с доказателства тази седмица?',
    },
  },

  {
    id: 'entr-05-mvp-experiments-learning',
    themeId: 'entrepreneurship',
    title_en: 'MVP, experiments and learning',
    title_bg: 'MVP, експерименти и учене',
    status: 'needs_review',
    theoryBlock_en:
      'An MVP is the smallest thing you can put in front of real users to learn one specific thing. It is not a small version of the final product — it is a learning tool. Every experiment states what you expect, what would surprise you, and what you will do with the answer.',
    theoryBlock_bg:
      'MVP е най-малкото нещо, което показваш на реални потребители, за да научиш едно конкретно нещо. Не е умалена версия на финалния продукт — инструмент за учене е. Всеки експеримент казва какво очакваш, какво би те изненадало и какво ще направиш с отговора.',
    practiceRatio: R,
    keyConcepts: ['MVP', 'Experiment design', 'Learning goal', 'Lean Startup'],
    dictionaryConcepts: ['MVP (Minimum Viable Product)', 'Experiment', 'Lean Startup'],
    practiceTasks: [
      {
        id: 'entr-05-t1',
        title_en: 'Design one MVP in 5 lines',
        title_bg: 'Проектирай един MVP в 5 реда',
        kind: 'mvp_definition',
        brief_en:
          'Write: what you will build, who will test it, what you want to learn, what result confirms it, what result kills it.',
        brief_bg:
          'Напиши: какво ще направиш, кой ще го тества, какво искаш да научиш, какъв резултат го потвърждава, какъв резултат го отхвърля.',
      },
      {
        id: 'entr-05-t2',
        title_en: 'Plan an experiment you can run in 7 days',
        title_bg: 'Планирай експеримент, който можеш да проведеш за 7 дни',
        kind: 'experiment_design',
        brief_en:
          'Define: hypothesis, method, sample size (even if small), success signal, honest failure signal. Real, small, this week.',
        brief_bg:
          'Дефинирай: хипотеза, метод, размер на извадката (дори малък), сигнал за успех, честен сигнал за провал. Реално, малко, тази седмица.',
      },
    ],
    caseConnection: {
      caseId: 'fashion-business',
      reviewStatus: 'needs_content_review',
      note_en: 'Use as an example of low-cost MVPs (pre-orders, single drop, one collection).',
      note_bg: 'Пример за евтин MVP (предварителни поръчки, единичен drop, една колекция).',
    },
    kikiQuestions: [
      { en: 'What are you trying to learn from this MVP?', bg: 'Какво се опитваш да научиш от този MVP?' },
      { en: 'What result would honestly surprise you?', bg: 'Какъв резултат честно би те изненадал?' },
      { en: 'How will you tell success from polite feedback?', bg: 'Как ще разграничиш успех от учтив отговор?' },
      { en: 'What would you refuse to change even if users asked, and why?', bg: 'Какво не би променил(а), дори потребителите да го поискат, и защо?' },
      { en: 'What is the smallest version of this experiment you can run this week?', bg: 'Кой е най-малкият вариант на този експеримент тази седмица?' },
    ],
    evidenceOfSkill: ['Формулиране на хипотеза', 'Дизайн на експеримент', 'Дисциплина на учене'],
    reflectionPrompt: {
      en: 'What did you learn that you could not have learned by thinking alone?',
      bg: 'Какво научи, което не би могъл(а) да научиш само чрез размисъл?',
    },
    improvementPrompt: {
      en: 'What would version 2 of this experiment look like?',
      bg: 'Как би изглеждала версия 2 на този експеримент?',
    },
  },

  {
    id: 'entr-06-decision-pivot-pitch',
    themeId: 'entrepreneurship',
    title_en: 'Argued decision, pivot / persevere and pitch',
    title_bg: 'Аргументирано решение, pivot / persevere и pitch',
    status: 'needs_review',
    theoryBlock_en:
      'After experiments come decisions. Persevere means the evidence supports staying the course. Pivot means changing a key element — segment, problem, solution, channel, business model — while keeping what you learned. A Pitch is not a sales trick. It is the honest, compressed story of the problem, the evidence, the decision and what you need next.',
    theoryBlock_bg:
      'След експериментите идват решенията. Persevere значи, че доказателствата подкрепят същата посока. Pivot значи промяна на ключов елемент — сегмент, проблем, решение, канал, бизнес модел — като запазваш наученото. Pitch не е търговски трик. Той е честна, кратка история за проблема, доказателствата, решението и това, което ти трябва оттук нататък.',
    practiceRatio: R,
    keyConcepts: ['Argued decision', 'Pivot', 'Persevere', 'Pitch', 'Product-market fit'],
    dictionaryConcepts: ['Pivot', 'Go-to-market', 'Product-market fit'],
    practiceTasks: [
      {
        id: 'entr-06-t1',
        title_en: 'Write an argued pivot-or-persevere decision',
        title_bg: 'Напиши аргументирано решение pivot или persevere',
        kind: 'decision',
        brief_en:
          'Based on your last experiment, write a 1-page decision: what you learned, what evidence supports it, which option you choose (pivot / persevere / kill), what you will do in the next 2 weeks.',
        brief_bg:
          'Въз основа на последния си експеримент напиши решение на 1 страница: какво научи, какви доказателства го подкрепят, кой вариант избираш (pivot / persevere / прекратяване), какво ще направиш през следващите 2 седмици.',
      },
      {
        id: 'entr-06-t2',
        title_en: 'Deliver a 90-second honest pitch',
        title_bg: 'Направи 90-секунден честен pitch',
        kind: 'iteration',
        brief_en:
          'Structure: problem, who has it, evidence you gathered, current solution, what you learned, what you are asking for. No hype, no promises you cannot back up.',
        brief_bg:
          'Структура: проблем, кой го има, доказателства, които събра, текущо решение, какво научи, какво искаш. Без хайп и без обещания, които не можеш да подкрепиш.',
      },
    ],
    caseConnection: {
      caseId: 'small-business',
      reviewStatus: 'needs_content_review',
      note_en: 'Use to compare small-business decisions vs Startup decisions under uncertainty.',
      note_bg: 'Използвай, за да сравниш решения в малък бизнес спрямо решения в Startup при несигурност.',
    },
    kikiQuestions: [
      { en: 'What evidence supports your decision — and what evidence contradicts it?', bg: 'Кои доказателства подкрепят твоето решение — и кои му противоречат?' },
      { en: 'Are you pivoting because of learning or because of fear?', bg: 'Правиш ли pivot заради наученото или заради страх?' },
      { en: 'What would you change in version 2 of your pitch?', bg: 'Какво би променил(а) във версия 2 на твоя pitch?' },
      { en: 'What is still unknown, and how will you learn it before the next decision?', bg: 'Какво все още не знаеш и как ще го научиш преди следващото решение?' },
      { en: 'If someone challenged your strongest claim, could you defend it with data?', bg: 'Ако някой оспори най-силното ти твърдение, можеш ли да го защитиш с данни?' },
    ],
    evidenceOfSkill: ['Аргументирано решение', 'Честна комуникация', 'Итерация при несигурност'],
    reflectionPrompt: {
      en: 'Where in your pitch were you tempted to overstate? What kept you honest?',
      bg: 'Къде в pitch-а беше изкушен(а) да преувеличиш? Какво те задържа честен(а)?',
    },
    improvementPrompt: {
      en: 'What is one concrete change for the next iteration?',
      bg: 'Коя е една конкретна промяна за следващата итерация?',
    },
  },
];

/**
 * Batch 2 — Innovation & Digital Innovation theme.
 * All modules are drafts (`needs_review`). Standard English terms
 * (platform, ecosystem, network effects, MVP, KPI, prototype, iteration,
 * case study, product/service/process/business model/digital innovation)
 * are kept as-is where they read more clearly than a forced translation.
 */
export const INNOVATION_MODULES: PracticeFirstModule[] = [
  {
    id: 'inno-01-idea-invention-innovation',
    themeId: 'innovation',
    title_en: 'Idea, invention and innovation',
    title_bg: 'Идея, изобретение и иновация',
    status: 'needs_review',
    theoryBlock_en:
      'An idea is a thought that something could be different. An invention is a new working thing: a device, a method, a design. An innovation is an invention or improvement that reaches real users and measurably changes what they do. Most ideas never become inventions. Most inventions never become innovations. The gap is adoption.',
    theoryBlock_bg:
      'Идеята е мисъл, че нещо може да е различно. Изобретението е ново работещо нещо: устройство, метод, дизайн. Иновацията е изобретение или подобрение, което стига до реални потребители и измеримо променя какво правят. Повечето идеи не стават изобретения. Повечето изобретения не стават иновации. Разликата е в реалното приемане.',
    practiceRatio: R,
    keyConcepts: ['Idea', 'Invention', 'Innovation', 'Adoption', 'Value in use'],
    dictionaryConcepts: ['Innovation', 'Invention', 'Adoption', 'Value creation'],
    practiceTasks: [
      {
        id: 'inno-01-t1',
        title_en: 'Sort 6 examples into idea, invention or innovation',
        title_bg: 'Подреди 6 примера като идея, изобретение или иновация',
        kind: 'comparison',
        brief_en:
          'Pick 6 things you know: a product, an app feature, a school project, a service, a method, a device. Label each as idea, invention or innovation. One line of reasoning per item.',
        brief_bg:
          'Избери 6 неща, които познаваш: продукт, функция в приложение, училищен проект, услуга, метод, устройство. Определи всяко като идея, изобретение или иновация. По един ред обосновка на елемент.',
      },
      {
        id: 'inno-01-t2',
        title_en: 'Find one invention that never became an innovation',
        title_bg: 'Намери едно изобретение, което не е станало иновация',
        kind: 'information_search',
        brief_en:
          'Find an invention that was patented or built but never reached real users at scale. Name two likely reasons: adoption, cost, timing, distribution or unclear value.',
        brief_bg:
          'Намери изобретение, което е патентовано или създадено, но не е стигнало до реални потребители в мащаб. Посочи две вероятни причини: приемане, цена, момент, дистрибуция или неясна стойност.',
      },
    ],
    informationSearchTask: {
      prompt_en: 'Find one recent innovation (2023–2026) and one older one. For each: who uses it and what measurably improved.',
      prompt_bg: 'Намери една скорошна иновация (2023–2026) и една по-стара. За всяка: кой я използва и какво измеримо се подобри.',
    },
    caseConnection: {
      caseId: 'chatgpt-ai-business-model',
      reviewStatus: 'needs_content_review',
      note_en: 'Separate the invention (LLM) from the innovation (a product used by millions).',
      note_bg: 'Отдели изобретението (LLM) от иновацията (продукт, използван от милиони).',
    },
    kikiQuestions: [
      { en: 'What is new here: the idea, the invention, or the way it reaches people?', bg: 'Какво е новото: идеята, изобретението или начинът, по който стига до хората?' },
      { en: 'For whom does this create value, and how do you know?', bg: 'За кого създава стойност това и откъде знаеш?' },
      { en: 'What had to be true for this invention to become an innovation?', bg: 'Какво трябваше да е вярно, за да стане това изобретение иновация?' },
      { en: 'What evidence shows real adoption, not just interest?', bg: 'Какво доказателство показва реално приемане, а не само интерес?' },
    ],
    evidenceOfSkill: ['Разграничаване на понятия', 'Работа с доказателства', 'Аргументирано класифициране'],
    reflectionPrompt: {
      en: 'Which of your 6 examples was hardest to classify, and why?',
      bg: 'Кой от 6-те примера ти беше най-труден за класифициране и защо?',
    },
    improvementPrompt: {
      en: 'Rewrite your reasoning for one item after checking what adoption really means.',
      bg: 'Пренапиши обосновката за един елемент, след като провериш какво означава реално приемане.',
    },
  },

  {
    id: 'inno-02-types-of-innovation',
    themeId: 'innovation',
    title_en: 'Types of innovation',
    title_bg: 'Видове иновации',
    status: 'needs_review',
    theoryBlock_en:
      'Innovation is not only new products. Main types: product innovation (new or improved product), service innovation (new or improved service), process innovation (a better way to do the work), business model innovation (a new way to earn from the value delivered) and digital innovation (using digital tools to change any of these). One organisation can combine several types at once.',
    theoryBlock_bg:
      'Иновацията не е само нов продукт. Основни видове: product innovation (нов или подобрен продукт), service innovation (нова или подобрена услуга), process innovation (по-добър начин работата да се свърши), business model innovation (нов начин да се печели от доставената стойност) и digital innovation (използване на дигитални инструменти, за да се промени някой от горните). Една организация може да комбинира няколко вида едновременно.',
    practiceRatio: R,
    keyConcepts: [
      'Product innovation',
      'Service innovation',
      'Process innovation',
      'Business model innovation',
      'Digital innovation',
    ],
    dictionaryConcepts: [
      'Product innovation',
      'Service innovation',
      'Process innovation',
      'Business model innovation',
      'Digital innovation',
    ],
    practiceTasks: [
      {
        id: 'inno-02-t1',
        title_en: 'Classify 5 real examples by type',
        title_bg: 'Класифицирай 5 реални примера по вид',
        kind: 'analysis',
        brief_en:
          'Pick 5 companies or public services you know. Name the type of innovation you observe in each. If more than one type applies, say which and why.',
        brief_bg:
          'Избери 5 компании или обществени услуги, които познаваш. За всяка посочи вида иновация, който наблюдаваш. Ако важат повече от един, кажи кои и защо.',
      },
      {
        id: 'inno-02-t2',
        title_en: 'Same problem, two types of innovation',
        title_bg: 'Един и същ проблем, два вида иновация',
        kind: 'comparison',
        brief_en:
          'Take one problem (e.g. long waiting time in a clinic). Design one product or service innovation and one process or business model innovation for it. Compare who benefits in each.',
        brief_bg:
          'Вземи един проблем (напр. дълго чакане в клиника). Опиши една product или service иновация и една process или business model иновация за него. Сравни кой печели във всеки случай.',
      },
    ],
    caseConnection: {
      caseId: 'digital-platform',
      reviewStatus: 'needs_content_review',
      note_en: 'Digital platforms usually combine service, process and business model innovation.',
      note_bg: 'Дигиталните платформи обикновено комбинират service, process и business model innovation.',
    },
    kikiQuestions: [
      { en: 'Which type of innovation is doing the real work here?', bg: 'Кой вид иновация върши реалната работа тук?' },
      { en: 'What would change if you removed the digital part?', bg: 'Какво би се променило, ако махнеш дигиталната част?' },
      { en: 'Who benefits from each type, and who does not?', bg: 'Кой печели от всеки вид и кой не?' },
      { en: 'Which process had to change behind the scenes for this to work?', bg: 'Кой процес трябваше да се промени зад кулисите, за да работи това?' },
    ],
    evidenceOfSkill: ['Използване на класификация', 'Анализ от няколко ъгъла', 'Разграничаване на промяна и хайп'],
    reflectionPrompt: {
      en: 'Which type of innovation do you understand least well?',
      bg: 'Кой вид иновация разбираш най-слабо?',
    },
    improvementPrompt: {
      en: 'Redo one classification after checking one source about the company.',
      bg: 'Направи отново една класификация, след като провериш един източник за компанията.',
    },
  },

  {
    id: 'inno-03-improvement-and-managed-process',
    themeId: 'innovation',
    title_en: 'Innovation as improvement and a managed process',
    title_bg: 'Иновацията като подобрение и управляван процес',
    status: 'needs_review',
    theoryBlock_en:
      'Most innovation is improvement, not invention from zero. Start by understanding the current process. Find what does not work. Decide what to improve: value, efficiency, experience or access. Then manage the change: who does what, by when, with which resources, and how you check the result.',
    theoryBlock_bg:
      'Повечето иновации са подобрение, не създаване от нулата. Започваш с това да разбереш текущия процес. Намираш какво не работи. Решаваш какво да подобриш: стойност, ефективност, преживяване или достъп. След това управляваш промяната: кой какво прави, до кога, с какви ресурси и как проверяваш резултата.',
    practiceRatio: R,
    keyConcepts: ['Improvement', 'Process understanding', 'Implementation', 'Managed change'],
    dictionaryConcepts: ['Process innovation', 'Continuous improvement', 'Implementation'],
    practiceTasks: [
      {
        id: 'inno-03-t1',
        title_en: 'Map a process before and after',
        title_bg: 'Опиши процес преди и след',
        kind: 'analysis',
        brief_en:
          'Pick a real process you know: a school procedure, a café order, a support request. List its steps today. Rewrite the steps after one clear improvement. Mark what improved: value, efficiency, experience or access.',
        brief_bg:
          'Избери реален процес, който познаваш: училищна процедура, поръчка в кафене, заявка към поддръжка. Опиши стъпките днес. Пренапиши ги след едно ясно подобрение. Отбележи какво се подобрява: стойност, ефективност, преживяване или достъп.',
      },
      {
        id: 'inno-03-t2',
        title_en: 'Plan the implementation',
        title_bg: 'Планирай внедряването',
        kind: 'decision',
        brief_en:
          'Write a short plan for that improvement: who does what, by when, with which resources, and one check that shows whether it worked.',
        brief_bg:
          'Напиши кратък план за това подобрение: кой какво прави, до кога, с какви ресурси и една проверка, която показва дали е сработило.',
      },
      {
        id: 'inno-03-t3',
        title_en: 'Identify what could fail',
        title_bg: 'Опиши какво може да се провали',
        kind: 'fact_vs_assumption',
        brief_en:
          'List 3 things that could go wrong during implementation. Mark each as a known risk (with evidence) or an assumption you still need to check.',
        brief_bg:
          'Опиши 3 неща, които може да се объркат при внедряването. Отбележи всяко като известен риск (с доказателство) или допускане, което още трябва да провериш.',
      },
    ],
    caseConnection: {
      caseId: 'small-business',
      reviewStatus: 'needs_content_review',
      note_en: 'Small businesses show clearly how process changes affect daily operations.',
      note_bg: 'Малкият бизнес показва ясно как промените в процеса влияят на ежедневната работа.',
    },
    kikiQuestions: [
      { en: 'What exactly is being improved: value, efficiency, experience or access?', bg: 'Какво точно се подобрява: стойност, ефективност, преживяване или достъп?' },
      { en: 'Which process must change for this improvement to hold in real use?', bg: 'Кой процес трябва да се промени, за да се задържи подобрението при реална употреба?' },
      { en: 'What could fail during implementation, and who notices first?', bg: 'Какво може да се провали при внедряването и кой ще забележи първи?' },
      { en: 'How will you know it worked, and with what evidence?', bg: 'Как ще разбереш, че е сработило, и с какво доказателство?' },
      { en: 'What would you leave unchanged, and why?', bg: 'Какво не би променил(а) и защо?' },
    ],
    evidenceOfSkill: ['Процесно мислене', 'Планиране на внедряване', 'Разграничаване на риск и допускане'],
    reflectionPrompt: {
      en: 'Where did your process map skip a step you actually rely on?',
      bg: 'Къде в описанието на процеса пропусна стъпка, на която реално разчиташ?',
    },
    improvementPrompt: {
      en: 'Rewrite one step of the plan with a clearer owner and a clearer check.',
      bg: 'Пренапиши една стъпка от плана с по-ясен отговорник и по-ясна проверка.',
    },
  },

  {
    id: 'inno-04-platforms-ecosystems-network-effects',
    themeId: 'innovation',
    title_en: 'Platforms, ecosystems and network effects',
    title_bg: 'Платформи, екосистеми и network effects',
    status: 'needs_review',
    theoryBlock_en:
      'A platform connects two or more groups: buyers and sellers, riders and drivers, learners and teachers. An ecosystem is the wider set of companies, tools and rules around it. Network effects mean the platform gets more useful as more people use it. They are powerful but not automatic. A platform without value on day one rarely reaches day 100.',
    theoryBlock_bg:
      'Платформа свързва две или повече групи: купувачи и продавачи, пътници и шофьори, ученици и преподаватели. Екосистемата е по-широкият набор от компании, инструменти и правила около нея. Network effects означават, че платформата става по-полезна, когато повече хора я използват. Силни са, но не са автоматични. Платформа без стойност на ден 1 рядко стига до ден 100.',
    practiceRatio: R,
    keyConcepts: ['Platform', 'Ecosystem', 'Network effects', 'Two-sided market'],
    dictionaryConcepts: ['Platform', 'Ecosystem', 'Network effects'],
    practiceTasks: [
      {
        id: 'inno-04-t1',
        title_en: 'Map one platform and its two sides',
        title_bg: 'Опиши една платформа и двете ѝ страни',
        kind: 'analysis',
        brief_en:
          'Pick one platform you use. Name the groups it connects. For each side: what value does it get, and what value does it give?',
        brief_bg:
          'Избери една платформа, която използваш. Опиши групите, които тя свързва. За всяка страна: каква стойност получава и каква дава?',
      },
      {
        id: 'inno-04-t2',
        title_en: 'Identify possible network effects',
        title_bg: 'Опиши възможните network effects',
        kind: 'analysis',
        brief_en:
          'For the same platform: describe how it becomes more useful when more users join one side, the other, or both. Where do more users make it worse?',
        brief_bg:
          'За същата платформа: опиши как става по-полезна, когато се присъединят повече потребители от едната страна, другата или и двете. Къде повече потребители я правят по-лоша?',
      },
      {
        id: 'inno-04-t3',
        title_en: 'Sketch its ecosystem',
        title_bg: 'Скицирай нейната екосистема',
        kind: 'analysis',
        brief_en:
          'List 3 companies, tools or rules around the platform that make it work: payments, delivery, moderation, regulators. What breaks if one of them disappears?',
        brief_bg:
          'Опиши 3 компании, инструмента или правила около платформата, които я карат да работи: разплащания, доставка, модерация, регулатори. Какво се чупи, ако един от тях изчезне?',
      },
    ],
    caseConnection: {
      caseId: 'digital-platform',
      reviewStatus: 'needs_content_review',
    },
    kikiQuestions: [
      { en: 'Which side of the platform is harder to attract, and why?', bg: 'Коя страна на платформата е по-трудна за привличане и защо?' },
      { en: 'What value does each side get on day one, before scale?', bg: 'Каква стойност получава всяка страна на ден 1, преди мащаб?' },
      { en: 'Where do network effects work against the platform?', bg: 'Къде network effects работят срещу платформата?' },
      { en: 'Which part of the ecosystem is the biggest single point of failure?', bg: 'Коя част от екосистемата е най-голямата единична точка на провал?' },
    ],
    evidenceOfSkill: ['Разбиране на платформи', 'Анализ на многостранна стойност', 'Системно мислене'],
    reflectionPrompt: {
      en: 'Which platform in your life became less useful as it grew? Why?',
      bg: 'Коя платформа в живота ти стана по-малко полезна, когато нарасна? Защо?',
    },
    improvementPrompt: {
      en: 'Redesign one platform rule to improve value for the weaker side.',
      bg: 'Промени едно правило на платформата, за да подобри стойността за по-слабата страна.',
    },
  },

  {
    id: 'inno-05-sports-innovation-applied',
    themeId: 'innovation',
    title_en: 'Sports innovation as an applied case area',
    title_bg: 'Спортни иновации като приложен казус',
    status: 'needs_review',
    theoryBlock_en:
      'Sports innovation is not only new equipment. It can involve the training process, athlete data, wellbeing and recovery, fan experience, club management, digital tools and performance tracking. Sports is a strong applied area: goals are measurable and the users are clear — athletes, coaches, fans, clubs.',
    theoryBlock_bg:
      'Спортната иновация не е само ново оборудване. Може да засяга тренировъчния процес, данните на спортиста, възстановяването, преживяването на феновете, управлението на клуба, дигиталните инструменти и проследяването на представянето. Спортът е силна приложна област: целите са измерими, а потребителите са ясни — спортисти, треньори, фенове, клубове.',
    practiceRatio: R,
    keyConcepts: [
      'Training process',
      'Athlete data',
      'Wellbeing',
      'Fan experience',
      'Club management',
      'Performance tracking',
    ],
    dictionaryConcepts: ['Sports innovation', 'Performance data', 'Fan experience'],
    practiceTasks: [
      {
        id: 'inno-05-t1',
        title_en: 'Pick a user and a job to be improved',
        title_bg: 'Избери потребител и задача, която да се подобри',
        kind: 'decision',
        brief_en:
          'Choose one user in sports: athlete, coach, fan or club manager. Describe one specific job they need to do better. Do not name a solution yet.',
        brief_bg:
          'Избери един потребител в спорта: спортист, треньор, фен или клубен мениджър. Опиши една конкретна задача, която трябва да върши по-добре. Още без решение.',
      },
      {
        id: 'inno-05-t2',
        title_en: 'Design a small sports innovation concept',
        title_bg: 'Създай малък концепт за спортна иновация',
        kind: 'mvp_definition',
        brief_en:
          'For that user and job, design one small innovation. Say whether it is product, service, process, business model or digital innovation. Describe how it works in one short paragraph.',
        brief_bg:
          'За този потребител и задача създай една малка иновация. Посочи дали е product, service, process, business model или digital innovation. Опиши как работи в кратък абзац.',
      },
      {
        id: 'inno-05-t3',
        title_en: 'Define one performance metric',
        title_bg: 'Дефинирай един показател за представяне',
        kind: 'experiment_design',
        brief_en:
          'Choose one KPI that would show whether the concept helps the chosen user. State how you would measure it and over what period.',
        brief_bg:
          'Избери един KPI, който би показал дали концептът помага на избрания потребител. Посочи как ще го измерваш и за какъв период.',
      },
    ],
    caseConnection: {
      caseId: 'sports-innovation',
      reviewStatus: 'needs_content_review',
      note_en: 'Anchor case for this module.',
      note_bg: 'Основен казус за този модул.',
    },
    kikiQuestions: [
      { en: 'Whose work does the concept improve, and how would that person measure it?', bg: 'Чия работа подобрява концептът и как този човек би я измерил?' },
      { en: 'Is the change in the product, the process, the data or the business model?', bg: 'Промяната в продукта ли е, в процеса, в данните или в бизнес модела?' },
      { en: 'What would you need to observe at a training or a match to test this?', bg: 'Какво би трябвало да наблюдаваш на тренировка или мач, за да провериш това?' },
      { en: 'What could go wrong for the athlete, the coach or the fan?', bg: 'Какво може да се обърка за спортиста, треньора или фена?' },
      { en: 'Which KPI can you defend as honest?', bg: 'Кой KPI можеш да защитиш като честен?' },
    ],
    evidenceOfSkill: ['Работа с конкретен потребител', 'Дизайн на концепт', 'Избор на честен показател'],
    reflectionPrompt: {
      en: 'What surprised you about the user you chose?',
      bg: 'Какво те изненада относно потребителя, който избра?',
    },
    improvementPrompt: {
      en: 'Improve version 2 of the concept based on one thing that would likely fail in real conditions.',
      bg: 'Подобри версия 2 на концепта на база едно нещо, което вероятно би се провалило в реални условия.',
    },
  },

  {
    id: 'inno-06-measuring-communicating-improving',
    themeId: 'innovation',
    title_en: 'Measuring, communicating and improving innovation',
    title_bg: 'Измерване, комуникиране и подобряване на иновации',
    status: 'needs_review',
    theoryBlock_en:
      'An innovation is real when someone can show that something measurably improved. Define the measurement before implementation, not after. Communication matters too. Users, colleagues and decision-makers need to know what changed, for whom, and with what evidence. Version 2 exists because version 1 was measured honestly.',
    theoryBlock_bg:
      'Иновацията е реална, когато някой може да покаже, че нещо измеримо се е подобрило. Измерването се дефинира преди внедряването, не след. Комуникацията също има значение. Потребители, колеги и хора, които вземат решения, трябва да знаят какво се е променило, за кого и с какво доказателство. Версия 2 съществува, защото версия 1 е измерена честно.',
    practiceRatio: R,
    keyConcepts: ['KPI', 'Baseline', 'Evidence of impact', 'Iteration'],
    dictionaryConcepts: ['KPI', 'Baseline', 'Iteration', 'Impact measurement'],
    practiceTasks: [
      {
        id: 'inno-06-t1',
        title_en: 'Define baseline and target',
        title_bg: 'Дефинирай базова стойност и цел',
        kind: 'experiment_design',
        brief_en:
          'Take one innovation from earlier modules. Write the baseline (what is happening today) and the target (what you want after the change). Use numbers where possible.',
        brief_bg:
          'Вземи една иновация от предходните модули. Опиши базовата стойност (какво се случва днес) и целта (какво искаш след промяната). Използвай числа, където е възможно.',
      },
      {
        id: 'inno-06-t2',
        title_en: 'Choose 1–2 honest KPIs',
        title_bg: 'Избери 1–2 честни KPI',
        kind: 'decision',
        brief_en:
          'Choose 1–2 KPIs that would show whether the innovation works. Explain why each is honest: hard to fake and tied to real value.',
        brief_bg:
          'Избери 1–2 KPI, които биха показали дали иновацията работи. Обясни защо всеки е честен: труден за манипулиране и свързан с реална стойност.',
      },
      {
        id: 'inno-06-t3',
        title_en: 'Write a 6-line internal update',
        title_bg: 'Напиши 6-редов вътрешен ъпдейт',
        kind: 'reflection',
        brief_en:
          'Write a short update for a colleague or teacher: what changed, for whom, what evidence you have, what is still unknown, what is next. No hype.',
        brief_bg:
          'Напиши кратък ъпдейт за колега или преподавател: какво се промени, за кого, какви доказателства имаш, какво още не се знае, какво следва. Без хайп.',
      },
      {
        id: 'inno-06-t4',
        title_en: 'Design version 2',
        title_bg: 'Опиши версия 2',
        kind: 'iteration',
        brief_en:
          'Based on the baseline, KPIs and update, describe two concrete changes for version 2 and why they follow from the evidence.',
        brief_bg:
          'На база базовата стойност, KPI и ъпдейта опиши две конкретни промени за версия 2 и защо следват от доказателствата.',
      },
    ],
    caseConnection: {
      caseId: 'school-youth-environment',
      reviewStatus: 'needs_content_review',
      note_en: 'A small, familiar context to practise honest measurement.',
      note_bg: 'Малък познат контекст за упражняване на честно измерване.',
    },
    kikiQuestions: [
      { en: 'What is the honest evidence that this innovation worked?', bg: 'Кое е честното доказателство, че тази иновация е сработила?' },
      { en: 'Which KPI could be gamed without creating real value?', bg: 'Кой KPI би могъл да бъде манипулиран, без да се създаде реална стойност?' },
      { en: 'Who needs to understand this update, and what would confuse them?', bg: 'Кой трябва да разбере този ъпдейт и какво би го объркало?' },
      { en: 'What in version 1 would you not repeat?', bg: 'Какво от версия 1 не би повторил(а)?' },
      { en: 'What would you improve in version 2, and what evidence supports that?', bg: 'Какво би подобрил(а) във версия 2 и какво доказателство подкрепя това?' },
    ],
    evidenceOfSkill: ['Честно измерване', 'Ясна комуникация', 'Итерация на база доказателства'],
    reflectionPrompt: {
      en: 'Where were you tempted to pick a KPI that looks good instead of one that is honest?',
      bg: 'Къде беше изкушен(а) да избереш KPI, който изглежда добре, вместо честен?',
    },
    improvementPrompt: {
      en: 'Rewrite one line of the update to be more precise and less impressive.',
      bg: 'Пренапиши един ред от ъпдейта да е по-точен и по-малко впечатляващ.',
    },
  },
];

export const PRACTICE_FIRST_MODULES: PracticeFirstModule[] = [
  ...ENTREPRENEURSHIP_MODULES,
  ...INNOVATION_MODULES,
];

