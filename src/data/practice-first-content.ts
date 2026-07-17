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
        cefe: {
          action_en:
            'Pick a short article, social media post or founder interview (max 500 words). Extract exactly 10 statements. In a three-column table label each as fact / opinion / assumption. For every "fact" add the source that would verify it.',
          action_bg:
            'Избери кратка статия, публикация или интервю на основател (до 500 думи). Извлечи точно 10 твърдения. В таблица с три колони отбележи всяко като факт / мнение / допускане. За всеки „факт“ добави източник, който може да го провери.',
          visibleResult_en:
            'A 10-row table: statement | label | source (only for facts).',
          visibleResult_bg:
            'Таблица от 10 реда: твърдение | етикет | източник (само за фактите).',
          processingQuestions_en: [
            'Which statements were dressed as facts but are actually assumptions?',
            'Which opinion is presented as if everyone shared it?',
            'Which "fact" would be hardest to verify — and why?',
          ],
          processingQuestions_bg: [
            'Кои твърдения са облечени като факти, но всъщност са допускания?',
            'Кое мнение е представено така, сякаш всички го споделят?',
            'Кой „факт“ би бил най-труден за проверка — и защо?',
          ],
          generalizing_en:
            'A confident tone is not evidence. Statements count as facts only when they have a source.',
          generalizing_bg:
            'Уверен тон не е доказателство. Твърденията се броят като факти само ако имат източник.',
          applying_en:
            'Choose the weakest "fact" and rewrite it honestly as an opinion or assumption.',
          applying_bg:
            'Избери най-слабия „факт“ и го пренапиши честно като мнение или допускане.',
          teacherCheck_en:
            'Table has 10 rows; every "fact" has a source; at least one label was reclassified during the task.',
          teacherCheck_bg:
            'Таблицата има 10 реда; всеки „факт“ има източник; поне един етикет е бил преоценен по време на задачата.',
          evidence_en: 'Labeled 10-row table.',
          evidence_bg: 'Таблица с 10 етикетирани твърдения.',
        },
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
        cefe: {
          action_en:
            'From your own idea list 3 unverified assumptions. For each, write one specific question you can answer within 7 days (search, message, 5-minute interview). Set a check-by date.',
          action_bg:
            'От собствената си идея запиши 3 непроверени допускания. За всяко напиши един конкретен въпрос, на който можеш да отговориш до 7 дни (търсене, съобщение, 5-минутно интервю). Задай краен срок.',
          visibleResult_en:
            'An "assumption → question" table with 3 rows and a deadline per row.',
          visibleResult_bg:
            'Таблица „допускане → въпрос“ с 3 реда и срок за всеки ред.',
          processingQuestions_en: [
            'Which assumption were you most tempted to leave unchecked, and why?',
            'Which question is answerable within 7 days without spending money?',
            'Which answer would force you to change the idea?',
          ],
          processingQuestions_bg: [
            'Кое допускане най-много ти се искаше да оставиш непроверено и защо?',
            'Кой въпрос е разрешим за 7 дни без разход?',
            'Кой отговор би те принудил да промениш идеята?',
          ],
          generalizing_en:
            'Assumptions become useful only when they turn into small, answerable questions.',
          generalizing_bg:
            'Допусканията стават полезни само когато се превърнат в малки въпроси, на които може да се отговори.',
          applying_en:
            'Answer one question this week and log the result next to it.',
          applying_bg:
            'Отговори на един въпрос тази седмица и запиши резултата до него.',
          teacherCheck_en:
            'Table has 3 rows; each question is specific and has a source or method plus a date.',
          teacherCheck_bg:
            'Таблицата има 3 реда; всеки въпрос е конкретен и има източник или метод плюс дата.',
          evidence_en: 'Assumption-to-question table.',
          evidence_bg: 'Таблица „допускане → въпрос“.',
        },
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
        cefe: {
          action_en:
            'Write your value proposition using: "For [who], who [problem], our [solution] gives [main benefit], unlike [alternative]." Then challenge every word — cross out any word that is vague or unproven.',
          action_bg:
            'Напиши своето value proposition по формулата: „За [кой], който [проблем], нашето [решение] дава [основна полза], за разлика от [алтернатива].“ След това оспори всяка дума — зачеркни всяка размита или недоказана.',
          visibleResult_en:
            'Two versions of the sentence: original and challenged, plus a short note per crossed-out word explaining why it was weak.',
          visibleResult_bg:
            'Две версии на изречението: оригинал и оспорена, плюс кратка бележка защо всяка зачеркната дума е слаба.',
          processingQuestions_en: [
            'Which word was hardest to defend?',
            'Is your "who" a specific group or a general audience?',
            'Is your "unlike" honest — is that really the current alternative for these users?',
          ],
          processingQuestions_bg: [
            'Коя дума беше най-трудна за защита?',
            'Твоето „кой“ е конкретна група или обща аудитория?',
            'Твоето „за разлика от“ честно ли е — това ли използват тези хора днес?',
          ],
          generalizing_en:
            'A value proposition is a claim that can be checked. Vague words hide untested assumptions.',
          generalizing_bg:
            'Value proposition е твърдение, което подлежи на проверка. Размитите думи крият непроверени допускания.',
          applying_en:
            'Rewrite the sentence in a second version that removes every vague word.',
          applying_bg:
            'Пренапиши изречението във втора версия, която премахва всяка размита дума.',
          teacherCheck_en:
            'Both versions present; at least 2 words challenged with reasons; final version names a specific group and a concrete alternative.',
          teacherCheck_bg:
            'Двете версии присъстват; поне 2 думи са оспорени с причина; финалната версия посочва конкретна група и конкретна алтернатива.',
          evidence_en: 'Two-version value proposition sheet.',
          evidence_bg: 'Лист с две версии на value proposition.',
        },
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
        cefe: {
          action_en:
            'On paper or one page, fill only 5 Lean Canvas blocks: problem, customer segment, unique value proposition, solution, channels. Next to each block write "evidence", "assumption" or "guess".',
          action_bg:
            'На хартия или на една страница попълни само 5 блока от Lean Canvas: проблем, клиентски сегмент, уникално value proposition, решение, канали. До всеки блок напиши „доказателство“, „допускане“ или „предположение“.',
          visibleResult_en:
            'A one-page 5-block canvas with an evidence-quality tag on every block.',
          visibleResult_bg:
            'Едностраничен canvas с 5 блока, всеки маркиран по качеството на доказателството.',
          processingQuestions_en: [
            'Which block is fully evidence — and how strong is that evidence?',
            'Which block is fully guess, and does the whole idea depend on it?',
            'Where does the customer segment not match the channel you chose?',
          ],
          processingQuestions_bg: [
            'Кой блок е изцяло доказателство — и колко силно е това доказателство?',
            'Кой блок е изцяло предположение и зависи ли цялата идея от него?',
            'Къде клиентският сегмент не съвпада с избрания канал?',
          ],
          generalizing_en:
            'A canvas is honest only when each block is labeled by evidence quality. It is a map, not a claim.',
          generalizing_bg:
            'Canvas е честен само когато всеки блок е маркиран по качеството на доказателството. Той е карта, не претенция.',
          applying_en:
            'Pick the weakest block and write one action to convert a guess into evidence within 7 days.',
          applying_bg:
            'Избери най-слабия блок и напиши едно действие, което ще превърне предположение в доказателство за 7 дни.',
          teacherCheck_en:
            '5 blocks filled; every block tagged by evidence quality; at least one improvement action written.',
          teacherCheck_bg:
            '5 блока попълнени; всеки маркиран по качество на доказателството; поне едно действие за подобрение.',
          evidence_en: 'Tagged Lean Canvas page.',
          evidence_bg: 'Маркиран Lean Canvas.',
        },
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
        cefe: {
          action_en:
            'Write 5 lines on one page: (1) what you will build (as small as possible), (2) who will test it, (3) what you want to learn, (4) what result confirms it, (5) what result rejects it. Treat the MVP as a learning tool, not a small final product.',
          action_bg:
            'Напиши 5 реда на една страница: (1) какво ще направиш (възможно най-малко), (2) кой ще го тества, (3) какво искаш да научиш, (4) какъв резултат го потвърждава, (5) какъв резултат го отхвърля. Гледай на MVP като на инструмент за учене, не като на умалена версия на финалния продукт.',
          visibleResult_en:
            'A 5-line MVP card focused on learning, not on shipping a product.',
          visibleResult_bg:
            'MVP-карта от 5 реда, фокусирана върху ученето, не върху издаването на продукт.',
          processingQuestions_en: [
            'Is this the smallest thing that answers the learning question?',
            'Would the confirming result honestly convince someone who doubts you?',
            'What are you refusing to build for now, and why?',
          ],
          processingQuestions_bg: [
            'Това ли е най-малкото нещо, което отговаря на въпроса за учене?',
            'Потвърждаващият резултат би ли убедил честно някой, който се съмнява?',
            'Какво отказваш да направиш засега и защо?',
          ],
          generalizing_en:
            'An MVP is a learning tool, not a small version of the final product. Its job is to produce evidence quickly.',
          generalizing_bg:
            'MVP е инструмент за учене, а не умалена версия на финалния продукт. Задачата му е бързо да произвежда доказателства.',
          applying_en:
            'Cut the MVP in half. What remains that still tests the same thing?',
          applying_bg:
            'Намали MVP наполовина. Какво остава, което пак тества същото нещо?',
          teacherCheck_en:
            'Card has all 5 lines; learning goal is specific; both confirming and rejecting results are testable.',
          teacherCheck_bg:
            'Картата има всичките 5 реда; целта на учене е конкретна; и потвърждаващият, и отхвърлящият резултат са проверими.',
          evidence_en: 'MVP learning card (5 lines).',
          evidence_bg: 'MVP-карта за учене (5 реда).',
        },
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
        cefe: {
          action_en:
            'Write a one-page experiment plan: hypothesis, method, sample (even if 5 people), success signal, honest failure signal, timeline. Keep it doable without spending money, without paid ads and without public social accounts. The MVP behind it stays a learning tool.',
          action_bg:
            'Напиши едностраничен план на експеримент: хипотеза, метод, извадка (дори 5 души), сигнал за успех, честен сигнал за провал, срок. Изпълним без разходи, без платена реклама и без публични профили. MVP-то зад него остава инструмент за учене.',
          visibleResult_en:
            'A one-page experiment plan you could hand to a peer to run.',
          visibleResult_bg:
            'Едностраничен план на експеримент, който можеш да подадеш на съученик за изпълнение.',
          processingQuestions_en: [
            'Which signal is real evidence and which is polite feedback?',
            'What could bias your sample, and how will you note it?',
            'What decision will you take if the failure signal appears?',
          ],
          processingQuestions_bg: [
            'Кой сигнал е реално доказателство и кой е учтива реакция?',
            'Какво може да изкриви извадката и как ще го отбележиш?',
            'Какво решение ще вземеш, ако се появи сигналът за провал?',
          ],
          generalizing_en:
            'Good experiments are decided before they start. You commit to a signal, then respect what the data says.',
          generalizing_bg:
            'Добрите експерименти се решават преди да започнат. Обвързваш се със сигнал и уважаваш какво казват данните.',
          applying_en:
            'Run one small step this week and log what actually happened vs. what you expected.',
          applying_bg:
            'Направи една малка стъпка тази седмица и запиши какво реално се случи спрямо очакваното.',
          teacherCheck_en:
            'Plan states hypothesis, sample, both signals and a decision rule; safe for minors; no public accounts or paid ads required.',
          teacherCheck_bg:
            'Планът съдържа хипотеза, извадка, двата сигнала и правило за решение; безопасен за непълнолетни; не изисква публични профили или платена реклама.',
          evidence_en: 'One-page experiment plan.',
          evidence_bg: 'Едностраничен план на експеримент.',
        },
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
        cefe: {
          action_en:
            'Based on your latest experiment, write a one-page evidence-based decision: what you learned, evidence for and against, explicit choice of pivot / persevere / stop, and concrete next steps for the next 2 weeks.',
          action_bg:
            'Въз основа на последния си експеримент напиши едностранично аргументирано решение: какво научи, доказателства „за“ и „против“, ясен избор pivot / persevere / прекратяване и конкретни следващи стъпки за следващите 2 седмици.',
          visibleResult_en:
            'A one-page decision memo with an explicit pivot / persevere / stop choice and a review date.',
          visibleResult_bg:
            'Едностраничен меморандум за решение с ясен избор pivot / persevere / прекратяване и дата за преглед.',
          processingQuestions_en: [
            'What evidence supports your choice — and what evidence contradicts it?',
            'Are you pivoting because of learning, or because of discomfort?',
            'What would have to be true in 2 weeks for this decision to still hold?',
          ],
          processingQuestions_bg: [
            'Кои доказателства подкрепят избора ти — и кои му противоречат?',
            'Правиш ли pivot заради наученото или заради дискомфорт?',
            'Какво трябва да е вярно след 2 седмици, за да остане това решение валидно?',
          ],
          generalizing_en:
            'A decision under uncertainty is judged by the reasoning behind it, not by outcome alone. Pivot, persevere and stop are all valid — dressing an assumption as a decision is not.',
          generalizing_bg:
            'Решение при несигурност се оценява по аргументите зад него, а не само по резултата. Pivot, persevere и прекратяване са валидни — представянето на допускане за решение — не.',
          applying_en:
            'Add a review date to check the decision against new evidence.',
          applying_bg:
            'Добави дата за преглед, на която ще провериш решението спрямо новите доказателства.',
          teacherCheck_en:
            'Memo includes learnings, evidence on both sides, an explicit pivot / persevere / stop choice, 2-week actions and a review date.',
          teacherCheck_bg:
            'Меморандумът съдържа наученото, доказателства и в двете посоки, ясен избор pivot / persevere / прекратяване, 2-седмични действия и дата за преглед.',
          evidence_en: 'One-page decision memo.',
          evidence_bg: 'Едностраничен меморандум за решение.',
        },
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
        cefe: {
          action_en:
            'Prepare a 90-second spoken pitch: problem, who has it, evidence you gathered, current solution, what you learned, what you are asking for. Time it. Record it once (audio or video for yourself only) or deliver it in front of a peer. No public posting.',
          action_bg:
            'Подготви 90-секунден изговорен pitch: проблем, кой го има, събрани доказателства, текущо решение, какво научи, какво искаш. Засичай времето. Запиши го веднъж (аудио или видео само за себе си) или го представи пред съученик. Без публикуване.',
          visibleResult_en:
            'A short pitch outline plus a 90-second delivery and one line of peer feedback. This is an evidence-based decision to keep, adjust or pivot the story.',
          visibleResult_bg:
            'Кратка структура на pitch плюс 90-секундно изпълнение и един ред обратна връзка от съученик. Това е аргументирано решение дали да запазиш, коригираш или направиш pivot на историята.',
          processingQuestions_en: [
            'Which sentence in your pitch is not backed by evidence?',
            'Where were you tempted to overstate — and what kept you honest?',
            'What did the listener understand differently than you intended?',
          ],
          processingQuestions_bg: [
            'Кое изречение в pitch-а не е подкрепено с доказателство?',
            'Къде беше изкушен(а) да преувеличиш — и какво те задържа честен(а)?',
            'Какво разбра слушателят различно от това, което имаше предвид?',
          ],
          generalizing_en:
            'A pitch is a compressed honest story. Its job is to earn attention and feedback, not to sell a fantasy.',
          generalizing_bg:
            'Pitch е компактна честна история. Задачата му е да спечели внимание и обратна връзка, не да продаде фантазия.',
          applying_en:
            'Deliver version 2 after one round of feedback, changing at most 3 things.',
          applying_bg:
            'Представи версия 2 след един кръг обратна връзка, като промениш най-много 3 неща.',
          teacherCheck_en:
            'Outline present; delivery close to 90 seconds; at least one honest weakness named; no unsupported claims of traction; no public posting required.',
          teacherCheck_bg:
            'Структурата присъства; изпълнението е около 90 секунди; посочена е поне една честна слабост; няма недоказани твърдения за трактион; не се изисква публикуване.',
          evidence_en: 'Pitch outline + 90-second delivery + 1 line of feedback.',
          evidence_bg: 'Структура на pitch + 90-секундно изпълнение + 1 ред обратна връзка.',
        },
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

/**
 * Batch 3 — Digital Marketing (Marketing theme).
 * V1A seeds first two modules. Drafts only (`needs_review`).
 */
export const MARKETING_MODULES: PracticeFirstModule[] = [
  {
    id: 'mkt-01-brand-foundations-2026',
    themeId: 'marketing',
    title_en: 'Brand foundations 2026',
    title_bg: 'Основи на бранда 2026',
    status: 'needs_review',
    theoryBlock_en:
      'A brand is not a logo. A brand is a promise, an expectation, a tone and a reason to be trusted. In digital marketing you build a brand by being clear about Why you exist, How you deliver value and What you actually offer. Name, logo, tone of voice, visual identity, slogan and key messages must line up so the same audience recognises you across channels. AI can help draft options, but clarity, truthfulness and judgment stay with you.',
    theoryBlock_bg:
      'Брандът не е лого. Брандът е обещание, очакване, тон и причина да ти вярват. В дигиталния маркетинг го изграждаш, като си ясен за Защо съществуваш, Как създаваш стойност и Какво всъщност предлагаш. Име, лого, тон на комуникация, визуална идентичност, слоган и ключови послания трябва да си пасват, за да те разпознава една и съща аудитория в различни канали. AI може да помогне с чернови, но яснотата, честността и преценката остават твои.',
    practiceRatio: R,
    keyConcepts: ['Brand promise', 'Why/How/What', 'Tone of voice', 'Positioning', 'AI-assisted content'],
    dictionaryConcepts: [
      'Brand',
      'Brand Promise',
      'Brand Identity',
      'Tone of Voice',
      'Slogan',
      'Key Message',
      'Target Audience',
      'Positioning',
      'AI-assisted Content',
      'Human Oversight',
    ],
    practiceTasks: [
      {
        id: 'mkt-01-t1',
        title_en: 'Brand DNA Card',
        title_bg: 'Карта на бранда (Brand DNA)',
        kind: 'decision',
        brief_en:
          'Create a one-page Brand DNA Card for a student brand, school project, club or fictional product: name, Why/How/What, audience, brand promise, tone of voice, 3 key messages, 1 slogan and 3 words the brand must NOT sound like.',
        brief_bg:
          'Направи едностранична Карта на бранда за ученически бранд, училищен проект, клуб или измислен продукт: име, Защо/Как/Какво, аудитория, обещание, тон на комуникация, 3 ключови послания, 1 слоган и 3 думи, на които брандът НЕ трябва да звучи.',
        cefe: {
          action_en:
            'Fill in a Brand DNA Card for one chosen brand. All fields must be written by you (AI is not used here). Keep it on one page.',
          action_bg:
            'Попълни Карта на бранда за един избран бранд. Всички полета се пишат от теб (без AI на тази стъпка). Помести се на една страница.',
          visibleResult_en:
            'A completed one-page Brand DNA Card with all fields filled in: name, Why/How/What, audience, promise, tone, 3 key messages, slogan, 3 forbidden tones.',
          visibleResult_bg:
            'Готова едностранична Карта на бранда с всички попълнени полета: име, Защо/Как/Какво, аудитория, обещание, тон, 3 ключови послания, слоган, 3 забранени тона.',
          processingQuestions_en: [
            'Which field is clear and which sounds generic?',
            'Would your audience understand the promise in 5 seconds?',
            'Which key message could confuse a first-time viewer?',
          ],
          processingQuestions_bg: [
            'Кое поле е ясно и кое звучи общо?',
            'Аудиторията би ли разбрала обещанието за 5 секунди?',
            'Кое ключово послание може да обърка човек, който вижда бранда за първи път?',
          ],
          generalizing_en:
            'A brand gives people a reason to remember and trust the product. Vague promises produce vague trust.',
          generalizing_bg:
            'Брандът дава на хората причина да запомнят и да се доверят. Размитите обещания раждат размито доверие.',
          applying_en:
            'Rewrite one weak key message into a sharper one, using concrete words about who the audience is and what they get.',
          applying_bg:
            'Пренапиши едно слабо ключово послание в по-ясно — с конкретни думи за кого е аудиторията и какво получава.',
          teacherCheck_en:
            'Card fits on one page, all fields are filled, promise names a specific audience and a concrete benefit, 3 forbidden tones are listed.',
          teacherCheck_bg:
            'Картата е на една страница, всички полета са попълнени, обещанието посочва конкретна аудитория и конкретна полза, изброени са 3 забранени тона.',
          evidence_en: 'One-page Brand DNA Card.',
          evidence_bg: 'Едностранична Карта на бранда.',
        },
      },
      {
        id: 'mkt-01-t2',
        title_en: 'AI-assisted brand draft — before / after',
        title_bg: 'Чернова на бранд с AI — преди / след',
        kind: 'iteration',
        brief_en:
          'Ask an AI tool for 3 brand name or slogan options, then improve them by hand. Document what AI generated, what you changed, which suggestion was too generic and which was most useful.',
        brief_bg:
          'Помоли AI за 3 варианта на име или слоган на бранда, след което ги подобри на ръка. Запиши какво генерира AI, какво промени, кое предложение звучеше най-общо и кое беше най-полезно.',
        cefe: {
          action_en:
            'Generate 3 AI options for the brand name or slogan. In a two-column sheet write "AI draft" on the left and your "Human-edited version" on the right for each option.',
          action_bg:
            'Генерирай с AI 3 варианта за име или слоган на бранда. Направи таблица с 2 колони: „AI чернова“ вляво и „Редакция от мен“ вдясно за всеки от вариантите.',
          visibleResult_en:
            'A before/after sheet with 3 AI drafts, 3 edited versions, 1 short note per option on what changed and why.',
          visibleResult_bg:
            'Лист „преди / след“ с 3 AI чернови, 3 редактирани версии и по 1 кратка бележка какво е променено и защо.',
          processingQuestions_en: [
            'Which AI suggestion sounded empty or exaggerated?',
            'Which suggestion was most useful and why?',
            'What did you keep as your own responsibility, not the tool’s?',
          ],
          processingQuestions_bg: [
            'Кое AI предложение звучеше празно или преувеличено?',
            'Кое беше най-полезно и защо?',
            'Кое остана твоя отговорност, а не на инструмента?',
          ],
          generalizing_en:
            'AI can support variation and speed, but brand judgment — who we are, what we promise, how we sound — belongs to the marketer.',
          generalizing_bg:
            'AI подпомага вариацията и скоростта, но преценката за бранда — кои сме, какво обещаваме, как звучим — остава при маркетолога.',
          applying_en:
            'Choose one final version of the name or slogan and write 2 sentences explaining why it fits the audience in the Brand DNA Card.',
          applying_bg:
            'Избери една финална версия на името или слогана и напиши 2 изречения защо пасва на аудиторията от Картата на бранда.',
          teacherCheck_en:
            'Sheet shows 3 clearly separated AI drafts and human-edited versions, one reasoned final choice, and no invented facts.',
          teacherCheck_bg:
            'Листът показва 3 ясно разделени AI чернови и редактирани версии, един аргументиран финален избор и няма измислени факти.',
          evidence_en: 'Before/after sheet + final choice note.',
          evidence_bg: 'Лист „преди / след“ и бележка за финалния избор.',
        },
      },
    ],
    kikiQuestions: [
      { en: 'What is your brand promising, in one sentence?', bg: 'Какво обещава брандът ти в едно изречение?' },
      { en: 'Would your audience understand it in 5 seconds?', bg: 'Аудиторията ти би ли го разбрала за 5 секунди?' },
      { en: 'Which part still sounds too generic?', bg: 'Коя част още звучи прекалено общо?' },
      { en: 'What did you change from the AI draft, and why?', bg: 'Какво промени спрямо AI черновата и защо?' },
      { en: 'What here should not be delegated to AI?', bg: 'Кое тук не бива да се делегира на AI?' },
    ],
    evidenceOfSkill: [
      'Попълнена Карта на бранда',
      'Подобрено ключово послание или слоган',
      'Кратка рефлексия за ползата и границите на AI',
    ],
    reflectionPrompt: {
      en: 'Where did AI help, and where did you have to overrule it?',
      bg: 'Къде AI помогна и къде трябваше да го отхвърлиш?',
    },
    improvementPrompt: {
      en: 'Rewrite the slogan once more, aiming for one concrete promise instead of a general mood.',
      bg: 'Пренапиши слогана още веднъж — с едно конкретно обещание вместо общо настроение.',
    },
  },

  {
    id: 'mkt-02-content-strategy-and-creation',
    themeId: 'marketing',
    title_en: 'Content strategy and creation',
    title_bg: 'Стратегия и създаване на съдържание',
    status: 'needs_review',
    theoryBlock_en:
      'Marketing content always has a goal: attract attention, explain value, build trust, support a decision or trigger action. Strong content has a hook (why keep reading), value (what the audience gets), proof (why to believe it) and a call to action (what to do next). Content pillars organise messages around goals instead of random posting. Formats matter in 2026 — short-form video, carousels, educational posts and creator-style content each behave differently. Put key information in text, not only inside an image, so people and AI search can read it. Platform practices change; check current sources instead of assuming yesterday’s formula still works.',
    theoryBlock_bg:
      'Маркетинговото съдържание винаги има цел: да привлече внимание, да обясни стойност, да изгради доверие, да подкрепи решение или да предизвика действие. Силното съдържание има hook (защо да продължа да чета), стойност (какво получавам), proof (защо да вярвам) и call to action (какво следва). Content pillars подреждат посланията около цели, вместо да пускаш случайни постове. Форматите през 2026 значат много — short-form видео, carousels, образователни постове и creator-style съдържание работят различно. Основната информация се пише като текст, не само в картинка, за да я четат и хора, и AI търсене. Практиките в платформите се променят; проверявай актуални източници, вместо да разчиташ на вчерашна формула.',
    practiceRatio: R,
    keyConcepts: ['Content goal', 'Hook / Value / Proof / CTA', 'Content pillars', 'Platform fit', 'AI-visible content'],
    dictionaryConcepts: [
      'Marketing Content',
      'Content Strategy',
      'Content Pillar',
      'Hook',
      'Call to Action',
      'Proof',
      'Carousel',
      'Short-form Video',
      'Educational Post',
      'Platform Fit',
      'Content Calendar',
    ],
    practiceTasks: [
      {
        id: 'mkt-02-t1',
        title_en: 'Content pillars for a student brand',
        title_bg: 'Content pillars за ученически бранд',
        kind: 'analysis',
        brief_en:
          'Using the brand from Module 1, define 4 content pillars — educational, trust/proof, product/service, community/story — with 3 concrete content ideas under each.',
        brief_bg:
          'Използвай бранда от Модул 1 и дефинирай 4 content pillars — образователен, доверие/proof, продукт/услуга, общност/история — с по 3 конкретни идеи за съдържание във всеки.',
        cefe: {
          action_en:
            'Build a simple 4-column table. In each column: pillar name, its goal, audience it serves, and 3 concrete content ideas that could actually be produced by one person.',
          action_bg:
            'Направи проста таблица с 4 колони. Във всяка: име на pillar, целта му, аудиторията, за която е, и 3 конкретни идеи за съдържание, които реалистично може да направи един човек.',
          visibleResult_en:
            'A one-page content pillar map: 4 pillars × 3 ideas, each idea named clearly enough that another student could recognise it.',
          visibleResult_bg:
            'Едностранична карта на pillars: 4 pillars × 3 идеи, всяка идея описана достатъчно ясно, че друг ученик да я разпознае.',
          processingQuestions_en: [
            'Which pillar is strongest and why?',
            'Which pillar is vague and needs a sharper goal?',
            'Which pillar actually builds trust vs. only entertains?',
          ],
          processingQuestions_bg: [
            'Кой pillar е най-силен и защо?',
            'Кой pillar е размит и има нужда от по-ясна цел?',
            'Кой pillar реално гради доверие, а не само забавлява?',
          ],
          generalizing_en:
            'Content strategy is not random posting. It organises messages around a small number of goals, so the audience recognises a pattern.',
          generalizing_bg:
            'Стратегията на съдържание не е случайно пускане на постове. Тя подрежда посланията около малък брой цели, за да разпознае аудиторията модел.',
          applying_en:
            'Improve one weak pillar: rewrite its goal and add one stronger, more specific content idea in its place.',
          applying_bg:
            'Подобри един слаб pillar: пренапиши целта му и добави една по-силна и по-конкретна идея за съдържание.',
          teacherCheck_en:
            'Map has 4 pillars, each with a stated goal, audience and 3 concrete ideas; at least one pillar has been rewritten in the applying step.',
          teacherCheck_bg:
            'Картата има 4 pillars, всеки с посочена цел, аудитория и 3 конкретни идеи; поне един pillar е пренаписан в стъпката „приложи“.',
          evidence_en: 'Content pillar map (one page).',
          evidence_bg: 'Едностранична карта на content pillars.',
        },
      },
      {
        id: 'mkt-02-t2',
        title_en: 'One message, three formats',
        title_bg: 'Едно послание, три формата',
        kind: 'iteration',
        brief_en:
          'Take one key message from the brand and adapt it into 3 drafts: an Instagram carousel outline, a TikTok short-video concept and a LinkedIn educational post. Each draft has hook, value, proof and CTA.',
        brief_bg:
          'Вземи едно ключово послание от бранда и го адаптирай в 3 чернови: план за Instagram carousel, концепт за TikTok short-video и образователен пост за LinkedIn. Всяка чернова има hook, value, proof и call to action.',
        cefe: {
          action_en:
            'For each of the 3 formats, write: a 1-sentence hook, 2–3 lines of value, 1 line of proof (evidence, example, source or reasoning), and a specific CTA. No public posting is required.',
          action_bg:
            'За всеки от 3-те формата напиши: 1 изречение hook, 2–3 реда стойност, 1 ред proof (доказателство, пример, източник или логика) и конкретен call to action. Не се изисква публикуване.',
          visibleResult_en:
            'Three side-by-side drafts (carousel, short-video, educational post) with hook / value / proof / CTA visible for each.',
          visibleResult_bg:
            'Три чернови една до друга (carousel, short-video, образователен пост), с ясни hook / value / proof / CTA за всяка.',
          processingQuestions_en: [
            'What changed between formats — tone, length, hook?',
            'What stayed the same — the core message and the promise?',
            'Which claim in your drafts still needs real proof?',
          ],
          processingQuestions_bg: [
            'Какво се промени между форматите — тон, дължина, hook?',
            'Какво остана същото — основното послание и обещанието?',
            'Кое твърдение в черновите ти още се нуждае от реален proof?',
          ],
          generalizing_en:
            'Good marketing adapts format and tone without losing the core message. Platform fit is a translation task, not a rewrite of the promise.',
          generalizing_bg:
            'Добрият маркетинг адаптира формата и тона, без да губи основното послание. Platform fit е задача по превод, не пренаписване на обещанието.',
          applying_en:
            'Choose the strongest of the 3 drafts and revise it once, tightening hook and CTA. Explain in 1–2 sentences why this platform fits the message.',
          applying_bg:
            'Избери най-силната от 3-те чернови и я редактирай веднъж, като изостриш hook и CTA. Обясни в 1–2 изречения защо тази платформа пасва на посланието.',
          teacherCheck_en:
            'Three drafts exist; each shows hook, value, proof and CTA; the chosen draft has a revised, tighter version and a short platform-fit note.',
          teacherCheck_bg:
            'Има 3 чернови; всяка показва hook, value, proof и CTA; избраната чернова има преработена, по-стегната версия и кратка бележка за platform fit.',
          evidence_en: 'Three format drafts + revised strongest draft + platform-fit note.',
          evidence_bg: 'Три чернови по формати + подобрената най-силна + бележка за platform fit.',
        },
      },
    ],
    kikiQuestions: [
      { en: 'What is the goal of this content?', bg: 'Каква е целта на това съдържание?' },
      { en: 'Who is it for, exactly?', bg: 'За кого точно е?' },
      { en: 'What should the audience understand or do after seeing it?', bg: 'Какво трябва аудиторията да разбере или да направи, след като го види?' },
      { en: 'Which claim in your draft needs real proof?', bg: 'Кое твърдение в черновата ти има нужда от реален proof?' },
      { en: 'What would you improve after honest feedback?', bg: 'Какво би подобрил(а) след честен feedback?' },
    ],
    evidenceOfSkill: [
      'Карта на content pillars',
      '3 адаптирани чернови по формати',
      'Кратко обяснение за platform fit',
    ],
    reflectionPrompt: {
      en: 'Which format felt easiest, and which felt fake? Why?',
      bg: 'Кой формат ти беше най-лесен и кой ти прозвуча фалшиво? Защо?',
    },
    improvementPrompt: {
      en: 'Rewrite the hook of the weakest draft so it names the audience and the value in one line.',
      bg: 'Пренапиши hook-а на най-слабата чернова така, че в един ред да назове аудиторията и стойността.',
    },
  },

  {
    id: 'mkt-03-channels-and-platform-logic',
    themeId: 'marketing',
    title_en: 'Channels and platform logic',
    title_bg: 'Канали и логика на платформите',
    status: 'needs_review',
    theoryBlock_en:
      'A marketing channel is a route to reach a specific audience with a specific message. Organic channels rely on content, community and search visibility; paid channels use budget to reach people faster or more precisely. Platform fit matters: Instagram is visual and community-driven; TikTok rewards short-form video with a strong hook and native tone; LinkedIn is a professional context for B2B, career and expertise; Facebook / Meta is strong for local business, groups and campaign objectives such as awareness, traffic, engagement, leads and sales. The same message must be adapted per platform — format, hook, tone and proof change even when the promise stays the same. Platform practices shift often; check current sources instead of memorising old rules. Choose a channel because it fits audience, objective, format, resources and the evidence you can collect, not because it is popular.',
    theoryBlock_bg:
      'Маркетинговият канал е път да достигнеш до конкретна аудитория с конкретно послание. Органичните канали разчитат на съдържание, общност и видимост в търсенето; платените използват бюджет за по-бърз или по-точен обхват. Platform fit има значение: Instagram е визуален и общностен; TikTok залага на кратко видео със силен hook и естествен тон; LinkedIn е професионален контекст за B2B, кариера и експертиза; Facebook / Meta работи за локален бизнес, групи и кампанийни цели като awareness, трафик, engagement, лийдове и продажби. Едно и също послание се адаптира за всяка платформа — формат, hook, тон и proof се променят, дори обещанието да остава същото. Практиките в платформите се менят често; проверявай актуални източници, вместо да помниш стари правила. Избирай канал, защото пасва на аудитория, цел, формат, ресурси и доказателства, а не защото е популярен.',
    practiceRatio: R,
    keyConcepts: ['Organic vs paid', 'Platform fit', 'Channel choice', 'Message adaptation', 'KPI per channel'],
    dictionaryConcepts: [
      'Marketing Channel',
      'Organic Channel',
      'Paid Channel',
      'Platform Fit',
      'Instagram Marketing',
      'TikTok Marketing',
      'LinkedIn Marketing',
      'Facebook Marketing',
      'Meta Ads',
      'Channel Strategy',
      'Audience Segment',
      'Campaign Objective',
      'Engagement',
      'Reach',
    ],
    practiceTasks: [
      {
        id: 'mkt-03-t1',
        title_en: 'Channel fit decision',
        title_bg: 'Решение за channel fit',
        kind: 'decision',
        brief_en:
          'Using the brand from Module 1, choose 3 channels from Instagram, TikTok, LinkedIn and Facebook / Meta. For each channel decide why this channel, which audience segment is there, what format fits, how the message changes, what proof or KPI makes sense and what the brand should NOT do there.',
        brief_bg:
          'С бранда от Модул 1 избери 3 канала измежду Instagram, TikTok, LinkedIn и Facebook / Meta. За всеки канал реши защо точно този канал, коя аудитория е там, какъв формат пасва, как се променя посланието, кой proof или KPI има смисъл и какво брандът НЕ трябва да прави там.',
        cefe: {
          action_en:
            'Fill in a channel-fit table with 3 channels. Columns: channel, audience segment, objective, format, adapted message, proof / KPI, one thing you will not do there.',
          action_bg:
            'Попълни таблица за channel fit с 3 канала. Колони: канал, аудитория, цел, формат, адаптирано послание, proof / KPI, едно нещо, което няма да правиш там.',
          visibleResult_en:
            'A completed channel-fit table with 3 channels, one row per channel, every column filled.',
          visibleResult_bg:
            'Готова таблица за channel fit с 3 канала, по един ред на канал и всяка колона попълнена.',
          processingQuestions_en: [
            'Which channel is strongest for this brand and why?',
            'Which channel is popular but weak for this brand?',
            'Where did the message need the biggest adaptation?',
            'Which choice is based on evidence, and which is still assumption?',
          ],
          processingQuestions_bg: [
            'Кой канал е най-силен за този бранд и защо?',
            'Кой канал е популярен, но слаб за този бранд?',
            'Къде посланието имаше нужда от най-голяма адаптация?',
            'Кой избор е на база доказателство и кой все още е допускане?',
          ],
          generalizing_en:
            'A channel is a strategic choice, not a place to copy-paste content. The right channel is where audience, message, format and evidence line up.',
          generalizing_bg:
            'Каналът е стратегически избор, а не място за copy-paste на съдържание. Правилният канал е там, където аудитория, послание, формат и доказателства си пасват.',
          applying_en:
            'Remove one weak channel or rewrite the reason for choosing it. Add one stronger alternative or a better justification.',
          applying_bg:
            'Махни един слаб канал или пренапиши причината за избора му. Добави един по-силен алтернативен канал или по-добра обосновка.',
          teacherCheck_en:
            'Table has 3 channels; each row has audience, objective, format, adapted message, proof / KPI and a "do not do" note. At least one channel choice is challenged or improved.',
          teacherCheck_bg:
            'Таблицата има 3 канала; всеки ред включва аудитория, цел, формат, адаптирано послание, proof / KPI и бележка „няма да правя“. Поне един избор е преосмислен или подобрен.',
          evidence_en: 'Channel-fit decision table.',
          evidence_bg: 'Таблица за channel fit.',
        },
      },
      {
        id: 'mkt-03-t2',
        title_en: 'One core message, four platform adaptations',
        title_bg: 'Едно основно послание, четири адаптации по платформи',
        kind: 'iteration',
        brief_en:
          'Take one core message from Module 1 or Module 2 and adapt it into 4 mini drafts for Instagram, TikTok, LinkedIn and Facebook / Meta. Do not publish anything. Each draft has platform, format, hook, tone, proof, CTA and one risk or mistake to avoid.',
        brief_bg:
          'Вземи едно основно послание от Модул 1 или Модул 2 и го адаптирай в 4 мини чернови за Instagram, TikTok, LinkedIn и Facebook / Meta. Не се публикува нищо. Всяка чернова има платформа, формат, hook, тон, proof, call to action и един риск или грешка, която да избегнеш.',
        cefe: {
          action_en:
            'Write four platform-specific mini drafts side by side. For each: platform, format, hook, tone, proof, CTA and one risk or mistake to avoid.',
          action_bg:
            'Напиши четири мини чернови по платформи една до друга. За всяка: платформа, формат, hook, тон, proof, call to action и един риск или грешка, която да избегнеш.',
          visibleResult_en:
            'Four mini drafts (Instagram, TikTok, LinkedIn, Facebook / Meta), each with all fields visible.',
          visibleResult_bg:
            'Четири мини чернови (Instagram, TikTok, LinkedIn, Facebook / Meta), всяка с всички полета.',
          processingQuestions_en: [
            'What stayed consistent across all four platforms?',
            'What changed because of platform behaviour, not personal taste?',
            'Which draft sounds forced or fake?',
            'Which draft has the weakest proof?',
          ],
          processingQuestions_bg: [
            'Какво остана еднакво във всичките четири платформи?',
            'Какво се промени заради поведението на платформата, а не заради личен вкус?',
            'Коя чернова звучи изкуствено или фалшиво?',
            'Коя чернова има най-слаб proof?',
          ],
          generalizing_en:
            'Platform adaptation keeps the core promise stable while changing format, tone and evidence. Consistency is not sameness.',
          generalizing_bg:
            'Адаптацията по платформи запазва основното обещание, но променя формат, тон и доказателства. Последователността не означава еднаквост.',
          applying_en:
            'Choose the weakest platform draft and revise it once. Make the hook clearer and the proof stronger.',
          applying_bg:
            'Избери най-слабата чернова и я редактирай веднъж. Направи hook-а по-ясен и proof-а по-силен.',
          teacherCheck_en:
            'Four drafts exist, one per platform; each has hook, tone, proof, CTA and risk / mistake. One draft is revised after critique.',
          teacherCheck_bg:
            'Има четири чернови — по една на платформа; всяка с hook, тон, proof, CTA и риск / грешка. Една чернова е преработена след критика.',
          evidence_en: 'Four platform-adapted drafts and one revised draft.',
          evidence_bg: 'Четири адаптирани чернови и една преработена чернова.',
        },
      },
    ],
    kikiQuestions: [
      { en: 'Why this channel, not just why this platform is popular?', bg: 'Защо точно този канал, а не просто защото платформата е популярна?' },
      { en: 'Where is your audience actually likely to pay attention?', bg: 'Къде наистина е вероятно аудиторията ти да обърне внимание?' },
      { en: 'What changes when the same message moves from Instagram to LinkedIn?', bg: 'Какво се променя, когато същото послание мине от Instagram към LinkedIn?' },
      { en: 'Which KPI would show that this channel is working?', bg: 'Кой KPI би показал, че този канал работи?' },
      { en: 'What is the biggest mistake your brand could make on this platform?', bg: 'Коя е най-голямата грешка, която брандът ти може да направи на тази платформа?' },
    ],
    evidenceOfSkill: [
      'Таблица за channel fit',
      'Четири адаптации по платформи',
      'Аргументиран избор на канали',
      'Разграничаване на популярност от стратегическо съответствие',
    ],
    reflectionPrompt: {
      en: 'Which channel choice would you defend to a teacher, and which one is still weak?',
      bg: 'Кой избор на канал би защитил(а) пред учител и кой все още е слаб?',
    },
    improvementPrompt: {
      en: 'Rewrite the weakest platform draft so the hook and the proof both get sharper.',
      bg: 'Пренапиши най-слабата чернова по платформа така, че и hook-ът, и proof-ът да станат по-ясни.',
    },
  },

  {
    id: 'mkt-04-marketing-planning',
    themeId: 'marketing',
    title_en: 'Marketing planning',
    title_bg: 'Маркетингово планиране',
    status: 'needs_review',
    theoryBlock_en:
      'A marketing plan is a set of connected decisions, not a wish list. It links a measurable goal to a specific audience, a clear positioning, chosen channels, a message, realistic resources, a timeline and evidence you will collect. A goal describes an outcome; a task describes an action. Segmentation groups the market by shared traits; targeting picks the segment you will actually serve; positioning explains why this audience should choose you. A persona is a portrait of one person inside a segment. The customer journey shows how people move from not knowing you to trusting you. Safe classroom marketing uses no personal data, no ad spend and no public posting requirement. A plan is only useful when it names what will be measured and what will be improved after the first version.',
    theoryBlock_bg:
      'Маркетинговият план е набор от свързани решения, а не списък с желания. Той свързва измерима цел с конкретна аудитория, ясно позициониране, избрани канали, послание, реалистични ресурси, времева рамка и доказателства, които ще събереш. Целта описва резултат; задачата описва действие. Сегментирането групира пазара по общи характеристики; таргетирането избира сегмента, на който наистина ще служиш; позиционирането обяснява защо тази аудитория да избере теб. Персоната е портрет на един човек от сегмента. Клиентското пътуване показва как хората минават от „не те познават“ до „вярват ти“. Безопасен класен маркетинг не използва лични данни, няма рекламен бюджет и не изисква публично публикуване. Планът е полезен само когато казва какво ще се измерва и какво ще се подобри след първата версия.',
    practiceRatio: R,
    keyConcepts: ['Goal vs task', 'Segment and persona', 'Positioning', 'Resources and timeline', 'KPIs vs vanity metrics'],
    dictionaryConcepts: [
      'Marketing Plan',
      'Marketing Goal',
      'Segmentation',
      'Targeting',
      'Positioning',
      'Persona',
      'Customer Journey',
      'Resource Planning',
      'Timeline',
      'KPI',
      'Vanity Metric',
      'Marketing Risk',
      'Marketing Budget',
    ],
    practiceTasks: [
      {
        id: 'mkt-04-t1',
        title_en: 'Audience segment and customer problem',
        title_bg: 'Аудиторен сегмент и проблем на клиента',
        kind: 'analysis',
        brief_en:
          'Define one primary audience segment for your brand. Describe who they are, what problem or need they have, what they care about, what they hesitate about, where they search for information, where they trust information, what evidence you have and what is still an assumption.',
        brief_bg:
          'Дефинирай една основна аудитория за бранда. Опиши кои са, какъв проблем или нужда имат, какво им е важно, за какво се колебаят, къде търсят информация, къде вярват на информация, кое имаш като доказателство и кое още е допускане.',
        cefe: {
          action_en:
            'Fill in a one-page audience segment sheet with two visible columns for each field: what you actually know (evidence) and what you assume (assumption).',
          action_bg:
            'Попълни едностраничен лист за аудиторен сегмент с две видими колони за всяко поле: какво реално знаеш (доказателство) и какво предполагаш (допускане).',
          visibleResult_en:
            'A one-page audience segment sheet with problem, motivation, hesitation, search behaviour, trust sources, evidence and assumptions.',
          visibleResult_bg:
            'Едностраничен лист за аудиторен сегмент с проблем, мотивация, колебание, поведение при търсене, източници на доверие, доказателства и допускания.',
          processingQuestions_en: [
            'Which part is based on evidence?',
            'Which part is only your guess?',
            'What would you need to ask or research?',
            'Where could this audience be misunderstood?',
          ],
          processingQuestions_bg: [
            'Коя част е на база доказателство?',
            'Коя част е само твое предположение?',
            'Какво трябва да попиташ или да проучиш?',
            'Къде тази аудитория може да бъде разбрана погрешно?',
          ],
          generalizing_en:
            'A target audience is not "everyone who might like this." It is a specific group with a problem, context, motivation and hesitation.',
          generalizing_bg:
            'Целевата аудитория не е „всеки, на когото може да му хареса“. Тя е конкретна група с проблем, контекст, мотивация и колебание.',
          applying_en:
            'Rewrite the audience segment more narrowly and add one question you need to answer before planning the campaign.',
          applying_bg:
            'Пренапиши аудиторния сегмент по-тясно и добави един въпрос, на който трябва да отговориш, преди да планираш кампанията.',
          teacherCheck_en:
            'Audience segment is specific, not "everyone." It includes problem, motivation, hesitation, search / trust behaviour, evidence and assumptions.',
          teacherCheck_bg:
            'Аудиторният сегмент е конкретен, а не „всички“. Включва проблем, мотивация, колебание, поведение при търсене / доверие, доказателства и допускания.',
          evidence_en: 'Audience segment sheet.',
          evidence_bg: 'Лист за аудиторен сегмент.',
        },
      },
      {
        id: 'mkt-04-t2',
        title_en: 'One-page marketing plan',
        title_bg: 'Едностраничен маркетингов план',
        kind: 'decision',
        brief_en:
          'Build a one-page marketing plan for the same brand and audience. Include a marketing goal, the audience segment, a positioning statement, 3 channels, 3 content ideas, a timeline, resources, 3 KPIs, one risk or constraint and one improvement step. Keep it realistic for a student project with limited time and no ad spend.',
        brief_bg:
          'Направи едностраничен маркетингов план за същия бранд и аудитория. Включи маркетингова цел, аудиторен сегмент, позициониращо изречение, 3 канала, 3 идеи за съдържание, времева рамка, ресурси, 3 KPI, един риск или ограничение и една стъпка за подобрение. Дръж го реалистичен за ученически проект с ограничено време и без бюджет за реклама.',
        cefe: {
          action_en:
            'Write a one-page marketing plan with all required sections visible on a single page. No ad spend, no personal customer data.',
          action_bg:
            'Напиши едностраничен маркетингов план с всички задължителни секции, видими на една страница. Без бюджет за реклама, без лични клиентски данни.',
          visibleResult_en:
            'A one-page marketing plan showing goal, audience, positioning, 3 channels, 3 content ideas, timeline, resources, 3 KPIs, risk and improvement step.',
          visibleResult_bg:
            'Едностраничен маркетингов план с цел, аудитория, позициониране, 3 канала, 3 идеи за съдържание, времева рамка, ресурси, 3 KPI, риск и стъпка за подобрение.',
          processingQuestions_en: [
            'Is the goal measurable, or just a wish?',
            'Do the channels match the audience?',
            'Are the resources realistic for one student and a limited timeframe?',
            'Which KPI is useful and which is a vanity metric?',
            'What could fail first?',
          ],
          processingQuestions_bg: [
            'Целта измерима ли е, или е само пожелание?',
            'Каналите пасват ли на аудиторията?',
            'Ресурсите реалистични ли са за един ученик и ограничено време?',
            'Кой KPI е полезен и кой е vanity metric?',
            'Кое би се провалило първо?',
          ],
          generalizing_en:
            'A marketing plan connects choices. It is useful only when goal, audience, message, channels, resources and evidence line up.',
          generalizing_bg:
            'Маркетинговият план свързва избори. Полезен е само когато цел, аудитория, послание, канали, ресурси и доказателства си пасват.',
          applying_en:
            'Revise one part of the plan after critique — goal, audience, channel, KPI or timeline — and note in one sentence why you changed it.',
          applying_bg:
            'Редактирай една част от плана след критика — цел, аудитория, канал, KPI или времева рамка — и запиши в едно изречение защо си го променил(а).',
          teacherCheck_en:
            'Plan fits on one page and includes goal, audience, positioning, channels, content ideas, timeline, resources, KPIs, risk and improvement step. At least one part is revised.',
          teacherCheck_bg:
            'Планът се събира на една страница и включва цел, аудитория, позициониране, канали, идеи за съдържание, времева рамка, ресурси, KPI, риск и стъпка за подобрение. Поне една част е преработена.',
          evidence_en: 'One-page marketing plan and revised decision note.',
          evidence_bg: 'Едностраничен маркетингов план и бележка за преработеното решение.',
        },
      },
    ],
    kikiQuestions: [
      { en: 'Is your goal measurable or just a nice sentence?', bg: 'Целта ти измерима ли е, или е просто хубаво изречение?' },
      { en: 'Who exactly are you trying to reach?', bg: 'До кого точно се опитваш да достигнеш?' },
      { en: 'What problem does this audience actually care about?', bg: 'Кой проблем наистина вълнува тази аудитория?' },
      { en: 'Which part of your plan is based on assumption?', bg: 'Коя част от плана ти е на база допускане?' },
      { en: 'Which KPI would help you make a better decision?', bg: 'Кой KPI би ти помогнал да вземеш по-добро решение?' },
      { en: 'What will you improve after the first version?', bg: 'Какво ще подобриш след първата версия?' },
    ],
    evidenceOfSkill: [
      'Аудиторен сегмент с разделени доказателства и допускания',
      'Едностраничен маркетингов план',
      'Аргументирано подобрение след критика',
      'Разграничаване на KPI и vanity metric',
    ],
    reflectionPrompt: {
      en: 'Which part of the plan would collapse first if reality does not match your assumptions?',
      bg: 'Коя част от плана ще падне първа, ако реалността не съвпадне с допусканията ти?',
    },
    improvementPrompt: {
      en: 'Rewrite the marketing goal so it names an audience, an outcome and a timeframe.',
      bg: 'Пренапиши маркетинговата цел така, че да назове аудитория, резултат и срок.',
    },
  },

  {
    id: 'mkt-05-campaigns-codes-and-kpi',
    themeId: 'marketing',
    title_en: 'Campaigns, codes and KPI',
    title_bg: 'Кампании, кодове и KPI',
    status: 'needs_review',
    theoryBlock_en:
      'A marketing campaign is a planned set of actions with a goal, an audience, a message, a channel mix, a timeline, resources, measurement and an improvement cycle. A campaign goal is the outcome you want (awareness, traffic, engagement, leads, sales); a channel action is what happens on a platform; a KPI is the number that tells you whether the goal is moving. Organic and paid campaigns follow different logic — this module stays in a safe classroom simulation, no ad spend and no personal customer data. Campaign codes, promo codes, referral codes, coupon codes, campaign keywords, UTMs and tracking links are all ways to connect a visible action to a decision. Useful metrics support decisions; vanity metrics only look impressive. Optimisation means learning from evidence, not guessing.',
    theoryBlock_bg:
      'Маркетинговата кампания е планиран набор от действия с цел, аудитория, послание, комбинация от канали, времева рамка, ресурси, измерване и цикъл на подобрение. Целта на кампанията е резултатът, който искаш (awareness, traffic, engagement, leads, sales); действието в канала е какво се случва на платформата; KPI е числото, което ти казва дали целта се движи. Органичните и платените кампании имат различна логика — този модул остава в безопасна класна симулация, без реален бюджет за реклама и без лични клиентски данни. Кампанийни кодове, промо кодове, referral кодове, купон кодове, кампанийни ключови думи, UTM и tracking линкове са начини да свържеш видимо действие с решение. Полезните метрики подкрепят решения; vanity metrics само изглеждат впечатляващо. Оптимизацията е учене от доказателства, а не гадаене.',
    practiceRatio: R,
    keyConcepts: ['Campaign objective', 'Campaign / promo / referral codes', 'UTM and tracking links', 'KPI vs vanity metric', 'Evidence-based optimisation'],
    dictionaryConcepts: [
      'Marketing Campaign',
      'Campaign Objective',
      'Promo Code',
      'Referral Code',
      'Campaign Code',
      'UTM',
      'Tracking Link',
      'CTR',
      'CPA',
      'CAC',
      'Conversion Rate',
      'CLV',
      'ROI',
      'Lead',
      'Remarketing',
      'Optimization',
      'Vanity Metric',
    ],
    practiceTasks: [
      {
        id: 'mkt-05-t1',
        title_en: 'Campaign code simulation',
        title_bg: 'Симулация на кампаниен код',
        kind: 'decision',
        brief_en:
          'Design a simulated campaign for the student brand from previous modules. Define the campaign name, objective, audience, main message, 2 channels, one campaign / promo / referral code (for example BRAND10, CLASS2026, TRYDIGI, START25, CLUBFIRST), what the code is supposed to measure, where it would appear, what result would count as success and what would make the result unreliable. Do not run a real campaign and do not collect personal data.',
        brief_bg:
          'Проектирай симулирана кампания за ученическия бранд от предишните модули. Дефинирай име на кампанията, цел, аудитория, основно послание, 2 канала, един кампаниен / промо / referral код (например BRAND10, CLASS2026, TRYDIGI, START25, CLUBFIRST), какво трябва да измерва кодът, къде би се появил, какво би се броило за успех и какво би направило резултата ненадежден. Не пускай реална кампания и не събирай лични данни.',
        cefe: {
          action_en:
            'Create a campaign code card for your student brand and show where the code would be used in a simulated campaign. Use only fictional or classroom data.',
          action_bg:
            'Направи карта с кампаниен код за ученическия бранд и покажи къде би се използвал кодът в симулирана кампания. Използвай само измислени или класни данни.',
          visibleResult_en:
            'A campaign code card with campaign name, objective, audience, message, channels, code, what it measures, success signal and one named limitation.',
          visibleResult_bg:
            'Карта с кампаниен код: име на кампанията, цел, аудитория, послание, канали, код, какво измерва, сигнал за успех и едно посочено ограничение.',
          processingQuestions_en: [
            'What does the code actually measure?',
            'What does the code not measure?',
            'Could someone use the code without being a real customer?',
            'What would make the result misleading?',
            'Is the code connected to the campaign objective?',
          ],
          processingQuestions_bg: [
            'Какво реално измерва кодът?',
            'Какво кодът не измерва?',
            'Може ли някой да използва кода, без да е реален клиент?',
            'Какво би направило резултата подвеждащ?',
            'Кодът свързан ли е с целта на кампанията?',
          ],
          generalizing_en:
            'A campaign code is useful only when it connects a visible action to a decision. Codes do not prove everything; they give one piece of evidence.',
          generalizing_bg:
            'Кампанийният код е полезен само когато свързва видимо действие с решение. Кодовете не доказват всичко; те дават едно парче доказателство.',
          applying_en:
            'Improve the code logic by adding one limitation (who or when it should not count) and one stronger measurement rule.',
          applying_bg:
            'Подобри логиката на кода, като добавиш едно ограничение (кой или кога да не се брои) и едно по-силно правило за измерване.',
          teacherCheck_en:
            'Card includes objective, audience, channels, code, measurement logic, success signal and one limitation. All data is fictional or simulated.',
          teacherCheck_bg:
            'Картата включва цел, аудитория, канали, код, логика на измерване, сигнал за успех и едно ограничение. Всички данни са измислени или симулирани.',
          evidence_en: 'Campaign code card.',
          evidence_bg: 'Карта с кампаниен код.',
        },
      },
      {
        id: 'mkt-05-t2',
        title_en: 'KPI decision board',
        title_bg: 'KPI дъска за решения',
        kind: 'analysis',
        brief_en:
          'Choose one campaign goal and build a KPI decision board. Include one attention metric, one action metric, one business / result metric and one vanity metric you will not use as main evidence. For each metric write why it matters, what high means, what low means and what decision follows. Suggested metrics: Reach, Impressions, Engagement Rate, CTR, Conversion Rate, CPA, CAC, CLV, ROI, Leads, Email sign-ups, Coupon / code uses, Landing page visits, Demo requests.',
          brief_bg:
          'Избери една цел на кампанията и направи KPI дъска за решения. Включи една метрика за внимание, една за действие, една бизнес / резултатна и една vanity metric, която няма да използваш като основно доказателство. За всяка метрика запиши защо е важна, какво означава високо, какво означава ниско и какво решение следва. Възможни метрики: Reach, Impressions, Engagement Rate, CTR, Conversion Rate, CPA, CAC, CLV, ROI, Leads, регистрации за имейл, използвания на код / купон, посещения на landing page, заявки за демо.',
        cefe: {
          action_en:
            'Build a KPI decision board as a table with columns: metric, type, why it matters, what high means, what low means, decision that follows.',
          action_bg:
            'Направи KPI дъска като таблица с колони: метрика, тип, защо е важна, какво означава високо, какво означава ниско, решение, което следва.',
          visibleResult_en:
            'A KPI table with 3 useful metrics and 1 named vanity metric, each with interpretation and a decision rule.',
          visibleResult_bg:
            'KPI таблица с 3 полезни метрики и 1 посочена vanity metric, всяка с тълкуване и правило за решение.',
          processingQuestions_en: [
            'Which metric helps you decide what to change?',
            'Which metric only looks impressive?',
            'Which metric is closest to business value?',
            'Which metric could be misleading without context?',
          ],
          processingQuestions_bg: [
            'Коя метрика ти помага да решиш какво да промениш?',
            'Коя метрика само изглежда впечатляващо?',
            'Коя метрика е най-близо до бизнес стойност?',
            'Коя метрика може да е подвеждаща без контекст?',
          ],
          generalizing_en:
            'KPIs are not decoration. A useful KPI helps you decide whether to continue, change, stop or investigate.',
          generalizing_bg:
            'KPI не са украса. Полезният KPI ти помага да решиш дали да продължиш, да промениш, да спреш или да проучиш.',
          applying_en:
            'Replace one weak metric with a stronger one and explain why the new metric supports a better decision.',
          applying_bg:
            'Замени една слаба метрика с по-силна и обясни защо новата метрика подкрепя по-добро решение.',
          teacherCheck_en:
            'Board includes attention / action / result metrics, one named vanity metric, interpretation of high / low and a decision rule for each metric.',
          teacherCheck_bg:
            'Дъската включва метрики за внимание / действие / резултат, една посочена vanity metric, тълкуване на високо / ниско и правило за решение за всяка метрика.',
          evidence_en: 'KPI decision board.',
          evidence_bg: 'KPI дъска за решения.',
        },
      },
    ],
    kikiQuestions: [
      { en: 'What is the campaign trying to achieve?', bg: 'Какво се опитва да постигне кампанията?' },
      { en: 'What does your campaign code actually measure?', bg: 'Какво реално измерва кампанийният ти код?' },
      { en: 'What could make the code result misleading?', bg: 'Какво би направило резултата от кода подвеждащ?' },
      { en: 'Which KPI would help you make a decision?', bg: 'Кой KPI би ти помогнал да вземеш решение?' },
      { en: 'Which metric looks good but does not prove real value?', bg: 'Коя метрика изглежда добре, но не доказва реална стойност?' },
      { en: 'What would you change if the KPI is weak?', bg: 'Какво би променил(а), ако KPI е слаб?' },
    ],
    evidenceOfSkill: [
      'Ясно формулирана цел на кампанията',
      'Симулиран кампаниен код с ограничение',
      'Избор на метрики за решения',
      'Разграничаване на KPI и vanity metric',
      'Решение за оптимизация на база доказателство',
    ],
    reflectionPrompt: {
      en: 'Which metric would you defend as real evidence, and which one is only decoration?',
      bg: 'Коя метрика би защитил(а) като реално доказателство и коя е само украса?',
    },
    improvementPrompt: {
      en: 'Rewrite one KPI so it names what will be measured, when, and what decision it will support.',
      bg: 'Пренапиши един KPI така, че да казва какво ще се измерва, кога и какво решение ще подкрепи.',
    },
  },

  {
    id: 'mkt-06-seo-search-and-aio-visibility',
    themeId: 'marketing',
    title_en: 'SEO, search and AIO visibility',
    title_bg: 'SEO, търсене и AIO видимост',
    status: 'needs_review',
    theoryBlock_en:
      'SEO is the practice of making content easier for people and search systems to find, understand and trust. A keyword is a clue about what someone is trying to learn, compare or do; search intent is the reason behind it. People search differently on Google, TikTok, Instagram, LinkedIn and AI tools, so the same question may need different content. AIO / AI visibility means being useful and readable enough that AI-generated answers can safely refer to your content; AEO and GEO are labels people use for similar ideas. There is no guaranteed trick for AI Overviews or AI Mode. Google Search Central says standard SEO fundamentals still apply and no special optimisation is required for AI features. Visibility improves with clear topic, real search intent, useful answer, reliable evidence, readable structure, descriptive headings, internal links where relevant, crawlable and indexable text, structured data that matches visible content, up-to-date information and human usefulness first. Put important information in text, not only in images. Check current sources instead of yesterday’s hacks.',
    theoryBlock_bg:
      'SEO е практиката да правиш съдържанието по-лесно за намиране, разбиране и доверие от хора и от търсещи системи. Ключовата дума е сигнал какво човек се опитва да научи, сравни или направи; search intent е причината зад това. Хората търсят различно в Google, TikTok, Instagram, LinkedIn и AI инструменти, затова един и същи въпрос може да иска различно съдържание. AIO / AI видимост означава да си достатъчно полезен и четим, че AI отговорите да могат безопасно да се позоват на съдържанието ти; AEO и GEO са етикети, които хората използват за подобни идеи. Няма гарантиран трик за AI Overviews или AI Mode. Google Search Central посочва, че стандартните SEO основи продължават да важат и не се изисква специална оптимизация за AI функциите. Видимостта се подобрява с ясна тема, реален search intent, полезен отговор, надеждни доказателства, четима структура, описателни заглавия, вътрешни връзки където е уместно, crawlable и indexable текст, структурирани данни, които съвпадат с видимото съдържание, актуална информация и полза за хората на първо място. Важната информация се пише като текст, не само в изображение. Проверявай актуални източници вместо вчерашни трикове.',
    practiceRatio: R,
    keyConcepts: ['Keyword vs search intent', 'Platform-aware search behaviour', 'AIO fundamentals, not hacks', 'Structured, cite-worthy writing', 'Proof and current sources'],
    dictionaryConcepts: [
      'SEO',
      'Keyword',
      'Search Intent',
      'Search Query',
      'AIO',
      'AEO',
      'GEO',
      'AI Visibility',
      'AI Overview',
      'AI Mode',
      'Zero-click Search',
      'Structured Content',
      'Internal Linking',
      'Schema Markup',
      'Crawlability',
      'Indexability',
      'Helpful Content',
      'Cite-worthy Content',
      'Source Credibility',
    ],
    practiceTasks: [
      {
        id: 'mkt-06-t1',
        title_en: 'Keyword and search intent map',
        title_bg: 'Карта на ключови думи и search intent',
        kind: 'analysis',
        brief_en:
          'Create a keyword and intent map for your student brand. Include one main keyword, 5 related keywords, 5 questions the audience might ask, the search intent behind each question (informational, comparison, transactional / action, local / community), the likely search place (Google, TikTok, Instagram, LinkedIn, AI assistant) and the content format that would answer it best.',
        brief_bg:
          'Направи карта на ключови думи и intent за ученическия бранд. Включи една основна ключова дума, 5 свързани ключови думи, 5 въпроса, които аудиторията може да задава, search intent зад всеки въпрос (informational, сравнителен, transactional / действие, локален / общностен), вероятното място за търсене (Google, TikTok, Instagram, LinkedIn, AI асистент) и формата на съдържание, което би отговорило най-добре.',
        cefe: {
          action_en:
            'Build a table with columns: keyword, user question, search intent, likely search place and best content format. Connect each keyword to a real question and a reason someone would search.',
          action_bg:
            'Направи таблица с колони: ключова дума, въпрос на потребителя, search intent, вероятно място за търсене и най-подходящ формат на съдържание. Свържи всяка ключова дума с реален въпрос и причина, поради която някой би търсил.',
          visibleResult_en:
            'A keyword and intent map with main keyword, related keywords, audience questions, intent labels, likely search place and content format.',
          visibleResult_bg:
            'Карта на ключови думи и intent с основна ключова дума, свързани ключови думи, въпроси от аудиторията, етикети за intent, вероятно място за търсене и формат на съдържание.',
          processingQuestions_en: [
            'Which keyword is too broad?',
            'Which question shows real intent?',
            'Which platform changes how the answer should be written?',
            'Which search phrase would need proof or a source?',
          ],
          processingQuestions_bg: [
            'Коя ключова дума е прекалено обща?',
            'Кой въпрос показва реален intent?',
            'Коя платформа променя как трябва да е написан отговорът?',
            'Коя фраза за търсене би поискала доказателство или източник?',
          ],
          generalizing_en:
            'Keywords are not magic words. They are clues about what people are trying to understand, compare or do.',
          generalizing_bg:
            'Ключовите думи не са магически думи. Те са сигнали за това какво хората се опитват да разберат, сравнят или направят.',
          applying_en:
            'Rewrite one broad keyword into a more specific question and choose a better content format for it.',
          applying_bg:
            'Пренапиши една обща ключова дума в по-конкретен въпрос и избери по-подходящ формат за съдържание.',
          teacherCheck_en:
            'Map has main keyword, related keywords, audience questions, intent labels, likely search place and content format. At least one broad keyword is improved.',
          teacherCheck_bg:
            'Картата има основна ключова дума, свързани ключови думи, въпроси от аудиторията, етикети за intent, вероятно място за търсене и формат на съдържание. Поне една обща ключова дума е подобрена.',
          evidence_en: 'Keyword and search intent map.',
          evidence_bg: 'Карта на ключови думи и search intent.',
        },
      },
      {
        id: 'mkt-06-t2',
        title_en: 'AIO / AI-visible content rewrite',
        title_bg: 'AIO / AI-видимо пренаписване на съдържание',
        kind: 'iteration',
        brief_en:
          'Take a deliberately weak paragraph about your brand — for example: "We are an innovative brand that helps young people succeed with modern solutions." — and rewrite it to be clearer, more useful and more cite-worthy. The rewrite must have a clear title, a direct answer in the first 1–2 sentences, a useful explanation, evidence or example, descriptive headings, readable bullet points if useful, an updated date if relevant, a source or proof note for any factual claim and no unsupported hype. There is no trick that guarantees AI Overviews — clarity, structure and trust come first.',
        brief_bg:
          'Вземи умишлено слаб абзац за бранда — например: „Ние сме иновативен бранд, който помага на младите хора да успяват с модерни решения.“ — и го пренапиши да е по-ясен, по-полезен и по-cite-worthy. Пренаписаното трябва да има ясно заглавие, директен отговор в първите 1–2 изречения, полезно обяснение, доказателство или пример, описателни заглавия, четими bullet points ако са полезни, актуализирана дата ако е уместно, бележка за източник или доказателство при всяко фактологично твърдение и без необосновани обещания. Няма трик, който гарантира AI Overviews — първо идват яснотата, структурата и доверието.',
        cefe: {
          action_en:
            'Produce a before / after rewrite. Keep the weak version visible for comparison and place the improved version next to it.',
          action_bg:
            'Направи пренаписване „преди / след“. Остави слабата версия видима за сравнение и постави подобрената версия до нея.',
          visibleResult_en:
            'Before / after content rewrite with title, direct answer, structured explanation, evidence and clearer language.',
          visibleResult_bg:
            'Пренаписване „преди / след“ със заглавие, директен отговор, структурирано обяснение, доказателство и по-ясен език.',
          processingQuestions_en: [
            'What became clearer?',
            'Which claim still needs evidence?',
            'What did you remove because it was hype?',
            'Would a reader understand the value without seeing an image?',
            'Would AI or search systems have enough text to understand the topic?',
          ],
          processingQuestions_bg: [
            'Кое стана по-ясно?',
            'Кое твърдение все още има нужда от доказателство?',
            'Какво премахна, защото беше празно обещание?',
            'Читателят би ли разбрал стойността, без да види изображение?',
            'AI и търсещите системи биха ли имали достатъчно текст, за да разберат темата?',
          ],
          generalizing_en:
            'AI visibility starts with clarity, structure and trust. If a human cannot understand or verify the content, AI visibility should not be the goal.',
          generalizing_bg:
            'AI видимостта започва с яснота, структура и доверие. Ако човек не може да разбере или провери съдържанието, AI видимостта не бива да е целта.',
          applying_en:
            'Improve the rewritten version one more time by adding a stronger proof point or removing one unsupported claim.',
          applying_bg:
            'Подобри пренаписаната версия още веднъж, като добавиш по-силно доказателство или премахнеш едно необосновано твърдение.',
          teacherCheck_en:
            'Before / after rewrite is present. Final version has title, direct answer, structured explanation, proof or source note for factual claims and no empty hype.',
          teacherCheck_bg:
            'Пренаписването „преди / след“ е налице. Финалната версия има заглавие, директен отговор, структурирано обяснение, бележка за източник или доказателство при фактологичните твърдения и без празни обещания.',
          evidence_en: 'AIO / AI-visible content rewrite.',
          evidence_bg: 'AIO / AI-видимо пренаписване на съдържание.',
        },
      },
    ],
    kikiQuestions: [
      { en: 'What is the audience really searching for?', bg: 'Какво реално търси аудиторията?' },
      { en: 'Is this keyword a word, or a real question?', bg: 'Тази ключова дума е просто дума или реален въпрос?' },
      { en: 'What would make this content trustworthy?', bg: 'Какво би направило това съдържание достойно за доверие?' },
      { en: 'Which claim needs proof?', bg: 'Кое твърдение има нужда от доказателство?' },
      { en: 'What did you write as readable text instead of hiding inside an image?', bg: 'Какво написа като четим текст, вместо да го скриеш в изображение?' },
      { en: 'Are you trying to help the reader or trick the algorithm?', bg: 'Опитваш ли се да помогнеш на читателя или да излъжеш алгоритъма?' },
    ],
    evidenceOfSkill: [
      'Карта на ключови думи и search intent',
      'Разграничаване на keyword и въпрос с реален intent',
      'Пренаписване на съдържание с ясна структура',
      'Бележка за източник или доказателство при фактологично твърдение',
      'Отговорно отношение към AI видимост, без обещания за трикове',
    ],
    reflectionPrompt: {
      en: 'Where were you tempted to add hype, and what did you replace it with?',
      bg: 'Къде беше изкушен(а) да добавиш празно обещание и с какво го замени?',
    },
    improvementPrompt: {
      en: 'Rewrite the opening sentence so it answers the reader’s question directly, without marketing decoration.',
      bg: 'Пренапиши първото изречение така, че директно да отговаря на въпроса на читателя, без маркетингова украса.',
    },
  },
  {
    id: 'mkt-07-case-lab-2026',
    themeId: 'marketing',
    title_en: 'Case Lab 2026',
    title_bg: 'Case Lab 2026',
    status: 'needs_review',
    theoryBlock_en:
      'A case analysis is not admiration. A campaign example is something to question, not copy. Current examples are useful only when you check the source, date, platform context and evidence — platform norms change fast. When you study a case, separate fact, platform claim, interpretation, assumption and improvement idea. Connect message, audience, channel, format, KPI and risk. No campaign is universal or guaranteed; strong marketers learn the logic behind an example instead of the surface.',
    theoryBlock_bg:
      'Анализът на кейс не е възхищение. Кампанията е за поставяне под въпрос, не за сляпо копиране. Текущите примери са полезни само когато проверяваш източник, дата, контекст на платформата и доказателства — правилата на платформите се променят бързо. Когато изучаваш кейс, разделяй факт, твърдение на платформата, интерпретация, допускане и идея за подобрение. Свързвай посланието, аудиторията, канала, формата, KPI и риска. Никоя кампания не е универсално правилна или гарантирана; силните маркетолози учат логиката зад примера, не повърхността.',
    practiceRatio: R,
    keyConcepts: ['Fact vs claim vs interpretation', 'Platform-aware analysis', 'Current source check', 'KPI and risk reasoning', 'Safe case adaptation'],
    dictionaryConcepts: [
      'Case Analysis',
      'Campaign Analysis',
      'Platform Claim',
      'Current Source Check',
      'Creative Analysis',
      'Source Evidence',
      'Case Redesign',
      'Campaign Risk',
      'AI Content Optimization',
      'Search Visibility Audit',
    ],
    practiceTasks: [
      {
        id: 'mkt-07-t1',
        title_en: 'Current Case Analysis',
        title_bg: 'Анализ на актуален кейс',
        kind: 'analysis',
        brief_en:
          'Choose one case direction — Lovable positioning, LinkedIn AI content optimization guidance, a TikTok Creative Center example, a Meta objective simulation, or a Google SEO / AIO audit. Use only teacher-provided materials, public pages, screenshots or simulated examples. Do not use personal accounts and do not publish anything. Fill in a structured Current Case Analysis table with: product / service, audience, main message, channel, format, campaign objective, expected action, evidence, platform claim, assumption, KPI that would make sense, risk and one improvement idea for 2026.',
        brief_bg:
          'Избери една посока за кейс — позициониране на Lovable, насоки на LinkedIn за AI оптимизация на съдържание, пример от TikTok Creative Center, симулация на Meta цели или Google SEO / AIO одит. Използвай само материали, дадени от учителя, публични страници, скрийншотове или симулирани примери. Не използвай личен акаунт и не публикувай нищо. Попълни структурирана таблица „Анализ на актуален кейс“ с: продукт / услуга, аудитория, основно послание, канал, формат, цел на кампанията, очаквано действие, доказателство, твърдение на платформата, допускане, KPI който има смисъл, риск и една идея за подобрение за 2026.',
        cefe: {
          action_en:
            'Fill in the Current Case Analysis table for one chosen case direction. Separate what is fact, what is platform claim, what is your interpretation and what is assumption.',
          action_bg:
            'Попълни таблицата „Анализ на актуален кейс“ за избраната посока. Раздели кое е факт, кое е твърдение на платформата, кое е твоя интерпретация и кое е допускане.',
          visibleResult_en:
            'A completed Current Case Analysis table with product, audience, message, channel, format, objective, action, evidence, claim, assumption, KPI, risk and improvement.',
          visibleResult_bg:
            'Попълнена таблица с продукт, аудитория, послание, канал, формат, цел, действие, доказателство, твърдение, допускане, KPI, риск и подобрение.',
          processingQuestions_en: [
            'Which part is fact and which part is platform claim?',
            'Which part is your interpretation?',
            'What evidence is missing?',
            'Which KPI would actually support a decision?',
            'What should not be copied blindly?',
          ],
          processingQuestions_bg: [
            'Кое е факт и кое е твърдение на платформата?',
            'Кое е твоя интерпретация?',
            'Какви доказателства липсват?',
            'Кой KPI наистина би подкрепил решение?',
            'Какво не бива да се копира сляпо?',
          ],
          generalizing_en:
            'Case analysis is disciplined questioning. A strong marketer learns from examples without treating them as universal formulas.',
          generalizing_bg:
            'Анализът на кейс е дисциплинирано задаване на въпроси. Силният маркетолог се учи от примери, без да ги приема като универсални формули.',
          applying_en:
            'Rewrite one improvement recommendation so it is specific, evidence-based and safe for a student brand.',
          applying_bg:
            'Пренапиши една препоръка за подобрение така, че да е конкретна, базирана на доказателства и безопасна за ученически бранд.',
          teacherCheck_en:
            'The table separates fact, claim, interpretation and assumption. It names one useful KPI, one risk and one specific improvement. No public posting, personal account, ad spend or real customer data is required.',
          teacherCheck_bg:
            'Таблицата разделя факт, твърдение, интерпретация и допускане. Посочен е един полезен KPI, един риск и едно конкретно подобрение. Не се изисква публикуване, личен акаунт, платена реклама или реални клиентски данни.',
          evidence_en: 'Current Case Analysis table.',
          evidence_bg: 'Таблица „Анализ на актуален кейс“.',
        },
      },
      {
        id: 'mkt-07-t2',
        title_en: 'Case Redesign Challenge',
        title_bg: 'Предизвикателство за редизайн на кейс',
        kind: 'iteration',
        brief_en:
          'Take the same case and redesign one part of it for a student brand or a fictional small brand. Adapt audience, message, channel, format, proof, CTA, KPI and one risk / constraint. Do not copy the original campaign — translate the logic into a safe, small-scale version. No public posting, no personal account, no ad spend, no real customer data.',
        brief_bg:
          'Вземи същия кейс и редизайнирай една част от него за ученически бранд или измислен малък бранд. Адаптирай аудитория, послание, канал, формат, доказателство, CTA, KPI и един риск / ограничение. Не копирай оригиналната кампания — преведи логиката в безопасна, малка версия. Без публикуване, без личен акаунт, без платена реклама, без реални клиентски данни.',
        cefe: {
          action_en:
            'Produce a one-page Case Redesign Card with original insight, adapted audience, message, channel, format, proof, CTA, KPI and risk.',
          action_bg:
            'Направи едностранична карта за редизайн с оригиналната идея, адаптирана аудитория, послание, канал, формат, доказателство, CTA, KPI и риск.',
          visibleResult_en:
            'A one-page Case Redesign Card visibly different from the original case.',
          visibleResult_bg:
            'Едностранична карта за редизайн, видимо различна от оригиналния кейс.',
          processingQuestions_en: [
            'What did you keep from the case logic?',
            'What did you change because the context is different?',
            'What would be unsafe or unrealistic to copy?',
            'Which assumption in your redesign still needs testing?',
          ],
          processingQuestions_bg: [
            'Какво запази от логиката на кейса?',
            'Какво промени, защото контекстът е различен?',
            'Какво би било небезопасно или нереалистично да се копира?',
            'Кое допускане в редизайна ти все още иска проверка?',
          ],
          generalizing_en:
            'A case becomes useful when its logic is translated to a new context. Copying the surface usually fails.',
          generalizing_bg:
            'Кейсът става полезен, когато логиката му се преведе в нов контекст. Копирането на повърхността обикновено не работи.',
          applying_en:
            'Improve the redesign by removing one unrealistic element and adding one stronger proof point.',
          applying_bg:
            'Подобри редизайна, като премахнеш един нереалистичен елемент и добавиш едно по-силно доказателство.',
          teacherCheck_en:
            'The redesign is visibly different from the original case, fits a student / fictional brand, includes KPI and risk, and avoids real posting, real ads and personal data.',
          teacherCheck_bg:
            'Редизайнът е видимо различен от оригинала, подхожда за ученически / измислен бранд, включва KPI и риск и избягва реално публикуване, реални реклами и лични данни.',
          evidence_en: 'Case Redesign Card.',
          evidence_bg: 'Карта за редизайн на кейс.',
        },
      },
    ],
    kikiQuestions: [
      { en: 'What exactly are you learning from this case?', bg: 'Какво точно научаваш от този кейс?' },
      { en: 'Which part is fact and which part is a brand or platform claim?', bg: 'Кое е факт и кое е твърдение на бранда или платформата?' },
      { en: 'What evidence is missing?', bg: 'Какви доказателства липсват?' },
      { en: 'What would be risky to copy?', bg: 'Какво би било рисковано да се копира?' },
      { en: 'Which KPI would help you decide whether the idea works?', bg: 'Кой KPI би ти помогнал да решиш дали идеята работи?' },
      { en: 'How would you adapt this for a smaller student brand?', bg: 'Как би адаптирал(а) това за по-малък ученически бранд?' },
    ],
    evidenceOfSkill: [
      'Структуриран анализ на кейс',
      'Разграничаване на факт / твърдение / допускане',
      'Мислене, съобразено с платформата',
      'Разсъждение около KPI',
      'Безопасна адаптация на кейс',
      'Подобрение, базирано на доказателства',
    ],
    reflectionPrompt: {
      en: 'Where did you almost accept a platform claim as fact, and how did you catch it?',
      bg: 'Къде почти прие твърдение на платформата за факт и как го хвана?',
    },
    improvementPrompt: {
      en: 'Rewrite one recommendation so it is safe, specific and testable for a student brand.',
      bg: 'Пренапиши една препоръка така, че да е безопасна, конкретна и проверима за ученически бранд.',
    },
  },
  {
    id: 'mkt-08-final-project-digital-marketing-plan-2026',
    themeId: 'marketing',
    title_en: 'Final Project: Digital Marketing Plan 2026',
    title_bg: 'Финален проект: Дигитален маркетинг план 2026',
    status: 'needs_review',
    theoryBlock_en:
      'The final marketing plan connects brand, audience, content, channels, campaign, KPI, SEO / AIO and reflection into one document. It must be realistic for limited resources and include evidence, assumptions and one improvement after feedback. AI can support drafts, but you must log what AI generated, what you verified and what you changed. Self-assessment and revision are part of the evidence. This is not a perfect final answer — it is your best current strategy, honestly explained.',
    theoryBlock_bg:
      'Финалният маркетинг план свързва бранд, аудитория, съдържание, канали, кампания, KPI, SEO / AIO и рефлексия в един документ. Той трябва да е реалистичен за ограничени ресурси и да включва доказателства, допускания и едно подобрение след обратна връзка. AI може да помага при чернови, но трябва да документираш какво е генерирал AI, какво си проверил(а) и какво си променил(а). Самооценката и ревизията са част от доказателствата. Това не е перфектен финален отговор — това е най-добрата ти текуща стратегия, честно обяснена.',
    practiceRatio: R,
    keyConcepts: ['Integrated marketing plan', 'Evidence and assumptions', 'KPI logic', 'Responsible AI use', 'Self-assessment and revision'],
    dictionaryConcepts: [
      'Digital Marketing Plan',
      'Marketing Portfolio',
      'AI-use Log',
      'Self-Assessment',
      'Feedback-based Revision',
      'Presentation Evidence',
      'Risk and Constraint',
      'Strategy Fit',
      'Final Project',
    ],
    practiceTasks: [
      {
        id: 'mkt-08-t1',
        title_en: 'Build the Digital Marketing Plan 2026',
        title_bg: 'Изгради Дигитален маркетинг план 2026',
        kind: 'iteration',
        brief_en:
          'Compile your strongest work from Modules 1–7 into one Digital Marketing Plan 2026. Required sections: brand name, Why / How / What, brand promise, target audience, positioning statement, 4 content pillars, 3 chosen channels and why, campaign objective, campaign message, campaign code simulation, 3 KPIs, SEO / AIO keyword and intent map, 3 sample content drafts, risk / constraint and next improvement. Use simulated / fictional / classroom-safe data only. No public posting, no personal account, no paid ads, no real customer data, no real tracking pixels.',
        brief_bg:
          'Събери най-силните си работи от Модули 1–7 в един Дигитален маркетинг план 2026. Задължителни секции: име на бранда, Why / How / What, обещание на бранда, целева аудитория, позициониране, 4 съдържателни стълба, 3 избрани канала и защо, цел на кампанията, послание на кампанията, симулация на кампаниен код, 3 KPI, карта на ключови думи и intent за SEO / AIO, 3 примерни съдържателни чернови, риск / ограничение и следващо подобрение. Използвай само симулирани / измислени / безопасни за клас данни. Без публикуване, без личен акаунт, без платена реклама, без реални клиентски данни, без реални tracking pixels.',
        cefe: {
          action_en:
            'Assemble the full plan. Rewrite weak parts instead of copy-pasting old drafts.',
          action_bg:
            'Сглоби целия план. Пренапиши слабите части, вместо да копираш стари чернови.',
          visibleResult_en:
            'A complete Digital Marketing Plan 2026 with all required sections.',
          visibleResult_bg:
            'Пълен Дигитален маркетинг план 2026 с всички задължителни секции.',
          processingQuestions_en: [
            'Which section is strongest?',
            'Which section is still based on assumption?',
            'Which KPI best supports a decision?',
            'Which claim needs better proof?',
            'Which part would fail first in real use?',
          ],
          processingQuestions_bg: [
            'Коя секция е най-силна?',
            'Коя секция все още е базирана на допускане?',
            'Кой KPI най-добре подкрепя решение?',
            'Кое твърдение има нужда от по-добро доказателство?',
            'Коя част би се пропукала първа в реална употреба?',
          ],
          generalizing_en:
            'A marketing plan is valuable when its parts fit together. Brand, audience, message, channel, campaign, KPI and search visibility must support the same strategy.',
          generalizing_bg:
            'Маркетинговият план е ценен, когато частите му си пасват. Бранд, аудитория, послание, канал, кампания, KPI и видимост в търсенето трябва да подкрепят една и съща стратегия.',
          applying_en:
            'Revise one weak section after feedback and explain what changed and why.',
          applying_bg:
            'Ревизирай една слаба секция след обратна връзка и обясни какво и защо си променил(а).',
          teacherCheck_en:
            'The plan includes all required sections, uses safe simulated data, identifies assumptions, includes KPIs and has at least one revised section after critique.',
          teacherCheck_bg:
            'Планът включва всички задължителни секции, използва безопасни симулирани данни, посочва допускания, включва KPI и има поне една ревизирана секция след критика.',
          evidence_en: 'Complete Digital Marketing Plan 2026.',
          evidence_bg: 'Пълен Дигитален маркетинг план 2026.',
        },
      },
      {
        id: 'mkt-08-t2',
        title_en: 'AI-use log, reflection and presentation',
        title_bg: 'AI-use лог, рефлексия и презентация',
        kind: 'reflection',
        brief_en:
          'Prepare a 3–5 minute presentation and an AI-use log. The AI-use log must answer: what did AI generate, what did you verify, which claims needed evidence, what did you change, what did you reject, what remained your responsibility, and what information should not be shared with AI. The presentation must include brand, audience, main message, channel choices, campaign idea, KPI logic, SEO / AIO visibility logic, one risk and one improvement after feedback. Present to a peer, teacher or small group — no public posting required.',
          brief_bg:
          'Подготви 3–5 минутна презентация и AI-use лог. Логът трябва да отговаря на: какво генерира AI, какво провери, кои твърдения имаха нужда от доказателство, какво промени, какво отхвърли, какво остана твоя отговорност и каква информация не бива да се споделя с AI. Презентацията трябва да включва бранд, аудитория, основно послание, избор на канали, идея за кампания, логика на KPI, логика за SEO / AIO видимост, един риск и едно подобрение след обратна връзка. Презентирай пред съученик, учител или малка група — не се изисква публично публикуване.',
        cefe: {
          action_en:
            'Deliver the 3–5 minute presentation with the AI-use log attached, then note one improvement made after feedback.',
          action_bg:
            'Изнеси 3–5 минутната презентация с прикачен AI-use лог и запиши едно подобрение след обратна връзка.',
          visibleResult_en:
            'Presentation outline, AI-use log and one feedback-based revision.',
          visibleResult_bg:
            'План на презентацията, AI-use лог и една ревизия след обратна връзка.',
          processingQuestions_en: [
            'Which part of your plan did the listener understand quickly?',
            'Which part caused confusion?',
            'Where did AI help and where did it weaken the work?',
            'Which claim did you have to verify?',
            'What would you improve before version 2?',
          ],
          processingQuestions_bg: [
            'Коя част от плана слушателят разбра бързо?',
            'Коя част създаде объркване?',
            'Къде AI помогна и къде отслаби работата?',
            'Кое твърдение трябваше да провериш?',
            'Какво би подобрил(а) преди версия 2?',
          ],
          generalizing_en:
            'Responsible digital marketing combines creation, evidence, explanation and revision. AI can speed up drafts, but judgment and accountability stay human.',
          generalizing_bg:
            'Отговорният дигитален маркетинг съчетава създаване, доказателства, обяснение и ревизия. AI може да ускори черновите, но преценката и отговорността остават човешки.',
          applying_en:
            'Revise one slide, one message or one KPI after feedback.',
          applying_bg:
            'Ревизирай един слайд, едно послание или един KPI след обратна връзка.',
          teacherCheck_en:
            'Presentation is 3–5 minutes, includes the required elements, AI-use log is completed honestly, and one improvement is made after feedback.',
          teacherCheck_bg:
            'Презентацията е 3–5 минути, включва задължителните елементи, AI-use логът е попълнен честно и е направено едно подобрение след обратна връзка.',
          evidence_en: 'Presentation outline + AI-use log + feedback-based revision.',
          evidence_bg: 'План на презентация + AI-use лог + ревизия след обратна връзка.',
        },
      },
    ],
    kikiQuestions: [
      { en: 'Does your plan connect brand, audience, channel and KPI clearly?', bg: 'Планът ти свързва ли ясно бранд, аудитория, канал и KPI?' },
      { en: 'Which part is evidence and which part is still assumption?', bg: 'Кое е доказателство и кое все още е допускане?' },
      { en: 'What did AI help with, and what did you change yourself?', bg: 'С какво помогна AI и какво промени сам(а)?' },
      { en: 'Which claim needs a source?', bg: 'Кое твърдение има нужда от източник?' },
      { en: 'What would you improve after feedback?', bg: 'Какво би подобрил(а) след обратна връзка?' },
      { en: 'Could someone understand your strategy in 3 minutes?', bg: 'Някой би ли разбрал стратегията ти за 3 минути?' },
    ],
    evidenceOfSkill: [
      'Интегриран дигитален маркетинг план',
      'Безопасно кампанийно мислене',
      'Разсъждение за канали и KPI',
      'SEO / AIO видимост без митове',
      'Отговорна употреба на AI',
      'Презентация и рефлексия',
      'Подобрение след обратна връзка',
    ],
    reflectionPrompt: {
      en: 'Which part of your plan changed the most between draft and final version, and why?',
      bg: 'Коя част от плана се промени най-много между черновата и финала и защо?',
    },
    improvementPrompt: {
      en: 'Choose one section and revise it after feedback; describe what changed and what evidence supports the change.',
      bg: 'Избери една секция и я ревизирай след обратна връзка; опиши какво се промени и какви доказателства подкрепят промяната.',
    },
  },
];

export const PRACTICE_FIRST_MODULES: PracticeFirstModule[] = [
  ...ENTREPRENEURSHIP_MODULES,
  ...INNOVATION_MODULES,
  ...MARKETING_MODULES,
];

