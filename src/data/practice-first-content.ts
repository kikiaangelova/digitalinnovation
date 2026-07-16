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
      'Entrepreneurship is not a personality type. It is a way of thinking and acting: noticing real problems in the world around you, forming a small, testable hypothesis about a possible solution, and checking that hypothesis with real people before spending serious time or money. A Startup is one vehicle for this — but the same thinking works inside schools, NGOs, teams and existing companies.',
    theoryBlock_bg:
      'Предприемачеството не е черта на характера. То е начин на мислене и действие: забелязваш реален проблем около теб, формулираш малка проверима хипотеза за възможно решение и я проверяваш с реални хора, преди да вложиш сериозно време или пари. Startup е една от формите — но същият начин на мислене работи и в училище, в екипи, в НПО и в съществуващи компании.',
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
          'List 3 problems you personally observed in the last 7 days (school, family, city, online). For each: who has it, where you saw it, and why it matters. No solutions yet.',
        brief_bg:
          'Опиши 3 проблема, които лично си забелязал(а) през последните 7 дни (училище, семейство, град, онлайн). За всеки: кой го има, къде го видя и защо има значение. Без решения на този етап.',
      },
      {
        id: 'entr-01-t2',
        title_en: 'Turn one observation into a small testable hypothesis',
        title_bg: 'Превърни едно наблюдение в малка проверима хипотеза',
        kind: 'decision',
        brief_en:
          'Pick one problem. Write one sentence: "I believe X people would do Y if we offered Z." State what would have to be true for this hypothesis to hold.',
        brief_bg:
          'Избери един проблем. Напиши едно изречение: „Вярвам, че X хора биха направили Y, ако им предложим Z.“ Опиши какво трябва да е вярно, за да се потвърди тази хипотеза.',
      },
    ],
    caseConnection: {
      caseId: 'school-youth-environment',
      reviewStatus: 'needs_content_review',
      note_en: 'Use as an example of noticing a problem inside a familiar environment.',
      note_bg: 'Използвай като пример за забелязване на проблем в позната среда.',
    },
    kikiQuestions: [
      { en: 'What exactly is the problem — in one sentence, without a solution?', bg: 'Какъв точно е проблемът — в едно изречение, без решение?' },
      { en: 'Who specifically has this problem, and how often?', bg: 'Кой конкретно има този проблем и колко често?' },
      { en: 'What did you actually observe, and what did you assume?', bg: 'Какво реално наблюдава и какво допусна?' },
      { en: 'What is the smallest action you could take this week to learn more?', bg: 'Кое е най-малкото действие, което можеш да направиш тази седмица, за да научиш повече?' },
      { en: 'What would make you decide this is not worth pursuing?', bg: 'Какво би те убедило, че този проблем не си струва да се преследва?' },
    ],
    evidenceOfSkill: ['Problem observation', 'Framing without solution', 'Bias awareness'],
    reflectionPrompt: {
      en: 'Which of your 3 observed problems felt strongest, and why? Was that a fact or a feeling?',
      bg: 'Кой от 3-те наблюдавани проблема ти се стори най-силен и защо? Това факт ли беше или усещане?',
    },
    improvementPrompt: {
      en: 'If you repeated this task next week, how would you observe differently?',
      bg: 'Ако повториш задачата следващата седмица, как би наблюдавал(а) по различен начин?',
    },
  },

  {
    id: 'entr-02-curiosity-and-problem-discovery',
    themeId: 'entrepreneurship',
    title_en: 'Curiosity, observation and problem discovery',
    title_bg: 'Любопитство, наблюдение и откриване на проблеми',
    status: 'needs_review',
    theoryBlock_en:
      'Good problems are found, not invented. Curiosity is a working habit: ask more questions than you answer, watch what people actually do (not what they say), and separate the symptom from the underlying problem.',
    theoryBlock_bg:
      'Добрите проблеми се откриват, а не се измислят. Любопитството е работен навик: задавай повече въпроси, отколкото отговаряш, наблюдавай какво хората реално правят (а не какво казват) и разграничавай симптома от истинския проблем.',
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
          'Spend 20 minutes in a real place (school hallway, cafe, transport). Write only what you see and hear — no explanations. Then list 3 possible problems, marked as observations vs guesses.',
        brief_bg:
          'Прекарай 20 минути на реално място (коридор в училище, кафене, транспорт). Записвай само това, което виждаш и чуваш — без обяснения. После опиши 3 възможни проблема, като отбележиш кое е наблюдение и кое е предположение.',
      },
      {
        id: 'entr-02-t2',
        title_en: 'Five whys on one problem',
        title_bg: '„Пет пъти защо“ върху един проблем',
        kind: 'analysis',
        brief_en:
          'Take one problem from Module 1 and ask "why?" five times in a row. Write down each answer. Note where you had evidence and where you had to guess.',
        brief_bg:
          'Вземи един проблем от Модул 1 и попитай „защо?“ пет пъти подред. Запиши всеки отговор. Отбележи къде имаш доказателство и къде си предположил(а).',
      },
    ],
    informationSearchTask: {
      prompt_en: 'Find 2 sources (article, report, video, interview) that describe the same problem someone else has already investigated. Note who published it and when.',
      prompt_bg: 'Намери 2 източника (статия, доклад, видео, интервю), които описват същия проблем, вече изследван от други. Запиши кой ги е публикувал и кога.',
    },
    caseConnection: {
      caseId: 'food-waste-sustainability',
      reviewStatus: 'needs_content_review',
    },
    kikiQuestions: [
      { en: 'What did you see with your own eyes vs. what did you read online?', bg: 'Какво видя с очите си и какво прочете онлайн?' },
      { en: 'What is the symptom and what might be the real problem underneath?', bg: 'Кое е симптомът и кой може да е реалният проблем под него?' },
      { en: 'Who is affected most, and how do you know?', bg: 'Кой е най-засегнат и откъде знаеш?' },
      { en: 'Which of your questions still has no evidence?', bg: 'Кой от твоите въпроси все още няма доказателство?' },
    ],
    evidenceOfSkill: ['Structured observation', 'Root cause thinking', 'Source triangulation'],
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
      'Facts can be checked. Opinions belong to a person. Assumptions are things you treat as true without checking. Most early startup mistakes are assumptions dressed up as facts. Good entrepreneurs label each statement honestly before making decisions.',
    theoryBlock_bg:
      'Фактите могат да бъдат проверени. Мненията принадлежат на конкретен човек. Допусканията са неща, които приемаш за верни, без да си ги проверил. Повечето ранни грешки в един Startup са допускания, представени като факти. Добрият предприемач честно етикетира всяко твърдение, преди да реши.',
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
          'Take a short article, social post or a founder quote. Extract 10 statements. Label each as fact, opinion or assumption. For every "fact", write the source that could verify it.',
        brief_bg:
          'Вземи кратка статия, публикация в социална мрежа или цитат на основател. Извлечи 10 твърдения. Етикетирай всяко като факт, мнение или допускане. За всеки „факт“ запиши източника, който може да го потвърди.',
      },
      {
        id: 'entr-03-t2',
        title_en: 'Turn 3 assumptions into checkable questions',
        title_bg: 'Превърни 3 допускания в проверими въпроси',
        kind: 'information_search',
        brief_en:
          'From your own idea, list 3 assumptions. For each, write one question you could realistically answer this week (a search, a message, a short interview).',
        brief_bg:
          'От собствената си идея запиши 3 допускания. За всяко напиши един въпрос, на който реалистично можеш да отговориш тази седмица (търсене, съобщение, кратко интервю).',
      },
    ],
    informationSearchTask: {
      prompt_en: 'For one assumption, find 3 independent sources. Note which agree, which disagree, and which are unclear.',
      prompt_bg: 'За едно допускане намери 3 независими източника. Отбележи кои се съгласяват, кои не и кои са неясни.',
    },
    caseConnection: {
      caseId: 'chatgpt-ai-business-model',
      reviewStatus: 'needs_content_review',
      note_en: 'Great source of confidently stated assumptions to test.',
      note_bg: 'Добър пример за уверено изказани допускания за проверка.',
    },
    kikiQuestions: [
      { en: 'Which of your "facts" would fall apart under a serious source check?', bg: 'Кои от твоите „факти“ биха паднали при сериозна проверка на източника?' },
      { en: 'What is the strongest evidence you have — and how strong is it really?', bg: 'Кое е най-силното доказателство, което имаш — и колко силно е наистина?' },
      { en: 'What is still unknown, and does the decision depend on it?', bg: 'Какво все още не знаеш и зависи ли решението от това?' },
      { en: 'Whose opinion are you quoting, and why do you trust them?', bg: 'Чие мнение цитираш и защо му вярваш?' },
      { en: 'What would change your mind?', bg: 'Какво би те накарало да промениш мнението си?' },
    ],
    evidenceOfSkill: ['Source literacy', 'Assumption mapping', 'Critical reading'],
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
      'An opportunity exists when a real problem meets people for whom the problem matters enough to change behavior or pay. Value is what measurably improves in the user\'s life. A business model describes how that value is delivered and how the effort behind it is sustained through revenue, resources or long-term return — often sketched first on a Business Model Canvas or Lean Canvas.',
    theoryBlock_bg:
      'Възможност съществува, когато реален проблем срещне хора, за които този проблем е достатъчно важен, за да променят поведение или да платят. Стойността е това, което измеримо се подобрява в живота на потребителя. Бизнес моделът описва как тази стойност се доставя и как усилието зад нея се поддържа — чрез устойчив приход, ресурс или дългосрочна възвръщаемост. Най-често се скицира първо на Business Model Canvas или Lean Canvas.',
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
          'Напиши: „За [кой], който [проблем], нашето [решение] дава [основна полза], за разлика от [алтернатива].“ След това предизвикай всяка дума.',
      },
      {
        id: 'entr-04-t2',
        title_en: 'Fill a rough Lean Canvas',
        title_bg: 'Попълни груб Lean Canvas',
        kind: 'mvp_definition',
        brief_en:
          'Fill only 5 blocks: problem, customer segment, unique value proposition, solution, and channels. Mark each block as evidence, assumption, or guess.',
        brief_bg:
          'Попълни само 5 блока: проблем, клиентски сегмент, уникално value proposition, решение и канали. Маркирай всеки блок като доказателство, допускане или предположение.',
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
      { en: 'How will value actually reach the user — and how will the work behind it earn a sustainable return in revenue, resources or long-term value?', bg: 'Как реално стойността ще стигне до потребителя — и как работата зад нея ще получи устойчив приход, ресурс или дългосрочна възвръщаемост?' },
    ],
    evidenceOfSkill: ['Value framing', 'Business model literacy', 'Segmentation clarity'],
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
      'An MVP (Minimum Viable Product) is the smallest thing you can put in front of real users to learn one specific thing. It is not a small version of the final product — it is a learning tool. Each experiment must state what you expect, what would surprise you, and what you will do with the answer.',
    theoryBlock_bg:
      'MVP (Minimum Viable Product) е най-малкото нещо, което можеш да покажеш на реални потребители, за да научиш едно конкретно нещо. Не е умалена версия на финалния продукт — това е инструмент за учене. Всеки експеримент трябва да казва какво очакваш, какво би те изненадало и какво ще направиш с отговора.',
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
          'Write: what you will build, who will test it, what you want to learn, what result would confirm it, what result would kill it.',
        brief_bg:
          'Напиши: какво ще направиш, кой ще го тества, какво искаш да научиш, какъв резултат би го потвърдил, какъв резултат би го отхвърлил.',
      },
      {
        id: 'entr-05-t2',
        title_en: 'Plan an experiment you can run in 7 days',
        title_bg: 'Планирай експеримент, който можеш да проведеш за 7 дни',
        kind: 'experiment_design',
        brief_en:
          'Define: hypothesis, method, sample size (even if small), success signal, honest failure signal. No perfect setups — real, small, this week.',
        brief_bg:
          'Дефинирай: хипотеза, метод, размер на извадката (дори малък), сигнал за успех, честен сигнал за провал. Без идеални условия — реално, малко, тази седмица.',
      },
    ],
    caseConnection: {
      caseId: 'fashion-business',
      reviewStatus: 'needs_content_review',
      note_en: 'Use as an example of low-cost MVPs (pre-orders, single drop, one collection).',
      note_bg: 'Пример за евтин MVP (предварителни поръчки, единичен drop, една колекция).',
    },
    kikiQuestions: [
      { en: 'What exactly are you trying to learn from this MVP?', bg: 'Какво точно се опитваш да научиш от този MVP?' },
      { en: 'What result would honestly surprise you?', bg: 'Какъв резултат честно би те изненадал?' },
      { en: 'How will you know it worked vs. that people were just being polite?', bg: 'Как ще разбереш, че е работило, а не че хората просто са били учтиви?' },
      { en: 'What would you refuse to change even if users asked, and why?', bg: 'Какво не би променил(а), дори потребителите да го поискат, и защо?' },
      { en: 'What is the smallest version of this experiment you could run this week?', bg: 'Кой е най-малкият вариант на този експеримент, който можеш да проведеш тази седмица?' },
    ],
    evidenceOfSkill: ['Experiment design', 'Falsifiable hypotheses', 'Learning discipline'],
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
      'After experiments come decisions. Persevere means the evidence supports staying the course. Pivot means changing a key element (segment, problem, solution, channel, business model) while keeping what you learned. A Pitch is not a sales trick — it is the honest, compressed story of the problem, the evidence, the decision and what you need next.',
    theoryBlock_bg:
      'След експериментите идват решенията. Persevere означава, че доказателствата подкрепят продължаване в същата посока. Pivot означава промяна на ключов елемент (сегмент, проблем, решение, канал, бизнес модел), като запазваш наученото. Pitch не е търговски трик — това е честната, кратка история на проблема, доказателствата, решението и това, което ти трябва след това.',
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
          'Based on your last experiment, write a 1-page decision: what you learned, what evidence supports it, which option you choose (pivot / persevere / kill), and what you will do in the next 2 weeks.',
        brief_bg:
          'Въз основа на последния си експеримент напиши решение на 1 страница: какво научи, какви доказателства го подкрепят, кой вариант избираш (pivot / persevere / прекратяване) и какво ще направиш през следващите 2 седмици.',
      },
      {
        id: 'entr-06-t2',
        title_en: 'Deliver a 90-second honest pitch',
        title_bg: 'Направи 90-секунден честен pitch',
        kind: 'iteration',
        brief_en:
          'Structure: problem, who has it, evidence you gathered, current solution, what you learned, what you are asking for. No hype words, no promises you cannot back up.',
        brief_bg:
          'Структура: проблем, кой го има, доказателства, които събра, текущо решение, какво научи, какво искаш. Без хайп думи и без обещания, които не можеш да подкрепиш.',
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
      { en: 'What is still unknown, and how could you learn it before the next decision?', bg: 'Какво все още не знаеш и как би могъл(а) да го научиш преди следващото решение?' },
      { en: 'If someone challenged your strongest claim, could you defend it with data?', bg: 'Ако някой оспори най-силното ти твърдение, можеш ли да го защитиш с данни?' },
    ],
    evidenceOfSkill: ['Argued decision-making', 'Honest communication', 'Iteration under uncertainty'],
    reflectionPrompt: {
      en: 'Where in your pitch were you tempted to overstate? What kept you honest?',
      bg: 'Къде в pitch-а ти беше изкушен(а) да преувеличиш? Какво те задържа честен(а)?',
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
      'An idea is a thought about how something could be different. An invention is a new working thing — a device, method or design. An innovation is an invention or improvement that actually reaches people and creates measurable value in use. Most ideas never become inventions. Most inventions never become innovations. The gap is adoption and value in real conditions.',
    theoryBlock_bg:
      'Идеята е мисъл, че нещо може да е различно. Изобретението е ново работещо нещо — устройство, метод или дизайн. Иновацията е изобретение или подобрение, което реално стига до хора и създава измерима стойност при употреба. Повечето идеи не стават изобретения. Повечето изобретения не стават иновации. Разликата е в приемането и стойността в реални условия.',
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
          'Pick 6 things you know (a product, an app feature, a school project, a service, a method, a device). For each: is it currently an idea, an invention or an innovation? Explain your reasoning in one line per item.',
        brief_bg:
          'Избери 6 неща, които познаваш (продукт, функция в приложение, училищен проект, услуга, метод, устройство). За всяко: в момента идея ли е, изобретение ли е или иновация? Обясни разсъждението си в един ред на елемент.',
      },
      {
        id: 'inno-01-t2',
        title_en: 'Find one invention that never became an innovation',
        title_bg: 'Намери едно изобретение, което не е станало иновация',
        kind: 'information_search',
        brief_en:
          'Search for one invention that was patented or built but did not reach real users at scale. Note two likely reasons: adoption, cost, timing, distribution, or lack of clear value.',
        brief_bg:
          'Намери едно изобретение, което е било патентовано или създадено, но не е стигнало до реални потребители в широк мащаб. Опиши две вероятни причини: приемане, цена, момент, дистрибуция или липса на ясна стойност.',
      },
    ],
    informationSearchTask: {
      prompt_en: 'Find one recent innovation (2023–2026) and one older one. For each, note who uses it, and what measurable thing improved.',
      prompt_bg: 'Намери една скорошна иновация (2023–2026) и една по-стара. За всяка: кой я използва и какво измеримо се е подобрило.',
    },
    caseConnection: {
      caseId: 'chatgpt-ai-business-model',
      reviewStatus: 'needs_content_review',
      note_en: 'Useful to separate the invention (LLM) from the innovation (product accessible to millions).',
      note_bg: 'Полезен, за да отделиш изобретението (LLM) от иновацията (продукт, достъпен за милиони).',
    },
    kikiQuestions: [
      { en: 'What exactly is new here — the idea, the invention or the way it reaches people?', bg: 'Какво точно е ново тук — идеята, изобретението или начинът, по който стига до хората?' },
      { en: 'For whom does this create value, and how do you know?', bg: 'За кого създава стойност това и откъде знаеш?' },
      { en: 'What had to be true for this invention to become an innovation?', bg: 'Какво трябваше да е вярно, за да стане това изобретение иновация?' },
      { en: 'What is the evidence of adoption, not just interest?', bg: 'Кои са доказателствата за реално приемане, а не само за интерес?' },
    ],
    evidenceOfSkill: ['Concept discrimination', 'Adoption reasoning', 'Evidence over enthusiasm'],
    reflectionPrompt: {
      en: 'Which of your 6 examples was hardest to classify, and why?',
      bg: 'Кой от 6-те примера ти беше най-труден за класифициране и защо?',
    },
    improvementPrompt: {
      en: 'Rewrite your reasoning for one item after seeing what adoption really means.',
      bg: 'Пренапиши разсъждението си за един елемент, след като видя какво означава реално приемане.',
    },
  },

  {
    id: 'inno-02-types-of-innovation',
    themeId: 'innovation',
    title_en: 'Types of innovation',
    title_bg: 'Видове иновации',
    status: 'needs_review',
    theoryBlock_en:
      'Innovation is not only new products. There are several types: product innovation (a new or improved product), service innovation (a new or improved service), process innovation (a better way to do the work), business model innovation (a new way to create, deliver and capture value) and digital innovation (using digital tools to change any of the above). One organisation can innovate in more than one type at the same time.',
    theoryBlock_bg:
      'Иновацията не е само нов продукт. Има няколко вида: product innovation (нов или подобрен продукт), service innovation (нова или подобрена услуга), process innovation (по-добър начин работата да се свърши), business model innovation (нов начин за създаване, доставяне и улавяне на стойност) и digital innovation (използване на дигитални инструменти, за да се промени някой от горните). Една организация може да прави няколко вида иновация едновременно.',
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
          'Pick 5 companies or public services you know. For each, name the type of innovation you can observe. Some will be more than one type — say why.',
        brief_bg:
          'Избери 5 компании или обществени услуги, които познаваш. За всяка посочи вида иновация, който наблюдаваш. Някои ще са от повече от един вид — обясни защо.',
      },
      {
        id: 'inno-02-t2',
        title_en: 'Same problem, two types of innovation',
        title_bg: 'Един и същ проблем, два вида иновация',
        kind: 'comparison',
        brief_en:
          'Take one problem (for example: long waiting time in a clinic). Design one product/service innovation and one process or business model innovation that address it. Compare who benefits in each case.',
        brief_bg:
          'Вземи един проблем (например: дълго чакане в клиника). Опиши една product/service иновация и една process или business model иновация, които го адресират. Сравни кой печели във всеки от случаите.',
      },
    ],
    caseConnection: {
      caseId: 'digital-platform',
      reviewStatus: 'needs_content_review',
      note_en: 'Digital platforms often combine service, process and business model innovation.',
      note_bg: 'Дигиталните платформи често комбинират service, process и business model innovation.',
    },
    kikiQuestions: [
      { en: 'Which type of innovation is actually doing the work here?', bg: 'Кой вид иновация реално върши работата тук?' },
      { en: 'What would change if you removed the digital part?', bg: 'Какво би се променило, ако махнеш дигиталната част?' },
      { en: 'Who benefits from each type — and who does not?', bg: 'Кой печели от всеки вид — и кой не?' },
      { en: 'What process quietly had to change to make this work?', bg: 'Кой процес тихо трябваше да се промени, за да работи това?' },
    ],
    evidenceOfSkill: ['Typology use', 'Multi-lens analysis', 'Separating hype from mechanism'],
    reflectionPrompt: {
      en: 'Which type of innovation do you understand least well? Where is your gap?',
      bg: 'Кой вид иновация разбираш най-слабо? Къде е пропускът ти?',
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
      'Most innovation is improvement, not invention from zero. It starts with understanding the current process, finding what does not work well, and deciding what to improve: value, efficiency, experience or access. Implementation must be managed — who does what, by when, with which resources, and how you check that the improvement really happened.',
    theoryBlock_bg:
      'Повечето иновации са подобрение, а не създаване от нулата. Започват с разбиране на текущия процес, откриване на това, което не работи добре, и решение какво да се подобри: стойност, ефективност, преживяване или достъп. Внедряването трябва да е управляван процес — кой какво прави, до кога, с какви ресурси и как проверяваш, че подобрението наистина се е случило.',
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
          'Pick a real process you know well (a school procedure, a café order, a support request). List its steps today. Then rewrite it after one clear improvement. Note what improved: value, efficiency, experience or access.',
        brief_bg:
          'Избери реален процес, който познаваш добре (училищна процедура, поръчка в кафене, заявка към поддръжка). Опиши стъпките му днес. После го пренапиши след едно ясно подобрение. Отбележи какво се подобрява: стойност, ефективност, преживяване или достъп.',
      },
      {
        id: 'inno-03-t2',
        title_en: 'Plan the implementation',
        title_bg: 'Планирай внедряването',
        kind: 'decision',
        brief_en:
          'For the improvement above, write a short plan: who does what, by when, with which resources, and one check that shows whether it worked.',
        brief_bg:
          'За подобрението по-горе напиши кратък план: кой какво прави, до кога, с какви ресурси и една проверка, която показва дали е сработило.',
      },
      {
        id: 'inno-03-t3',
        title_en: 'Identify what could fail',
        title_bg: 'Опиши какво може да се провали',
        kind: 'fact_vs_assumption',
        brief_en:
          'List 3 things that could go wrong during implementation. For each, mark whether it is a known risk (evidence) or an assumption you would need to check.',
        brief_bg:
          'Опиши 3 неща, които може да се объркат по време на внедряването. За всяко отбележи дали е известен риск (с доказателство) или допускане, което би трябвало да провериш.',
      },
    ],
    caseConnection: {
      caseId: 'small-business',
      reviewStatus: 'needs_content_review',
      note_en: 'Small businesses show clearly how process improvements affect daily operations.',
      note_bg: 'Малкият бизнес показва ясно как подобренията на процеса влияят върху ежедневната работа.',
    },
    kikiQuestions: [
      { en: 'What exactly is being improved — value, efficiency, experience or access?', bg: 'Какво точно се подобрява — стойност, ефективност, преживяване или достъп?' },
      { en: 'What process must change for this improvement to survive real use?', bg: 'Кой процес трябва да се промени, за да оцелее това подобрение при реална употреба?' },
      { en: 'What could fail during implementation, and who would notice first?', bg: 'Какво може да се провали при внедряването и кой ще забележи първи?' },
      { en: 'How will you know it worked — with what evidence?', bg: 'Как ще разбереш, че е сработило — с какви доказателства?' },
      { en: 'What would you not change, and why?', bg: 'Какво не би променил(а) и защо?' },
    ],
    evidenceOfSkill: ['Process mapping', 'Implementation planning', 'Risk labeling'],
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
      'A platform connects two or more groups (for example: buyers and sellers, riders and drivers, learners and teachers). An ecosystem is the wider set of companies, tools and rules around a platform. Network effects mean the platform becomes more useful as more people use it. They are powerful, but not automatic — a platform without value on day one usually never gets to day 100.',
    theoryBlock_bg:
      'Платформа свързва две или повече групи (например: купувачи и продавачи, пътници и шофьори, ученици и преподаватели). Екосистемата е по-широкият набор от компании, инструменти и правила около платформата. Network effects означават, че платформата става по-полезна, когато повече хора я използват. Те са силни, но не са автоматични — платформа без стойност на ден 1 обикновено не стига до ден 100.',
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
          'Pick one platform you use. Name the two (or more) groups it connects. For each side: what value do they get, and what value do they give?',
        brief_bg:
          'Избери една платформа, която използваш. Опиши двете (или повече) групи, които тя свързва. За всяка страна: каква стойност получава и каква стойност дава?',
      },
      {
        id: 'inno-04-t2',
        title_en: 'Identify possible network effects',
        title_bg: 'Опиши възможните network effects',
        kind: 'analysis',
        brief_en:
          'For the same platform: describe how it becomes more useful when more users join one side, the other side, or both. Where does more users make it worse, not better?',
        brief_bg:
          'За същата платформа: опиши как става по-полезна, когато се присъединят повече потребители от едната страна, от другата или от двете. Къде повече потребители я правят по-лоша, а не по-добра?',
      },
      {
        id: 'inno-04-t3',
        title_en: 'Sketch its ecosystem',
        title_bg: 'Скицирай нейната екосистема',
        kind: 'analysis',
        brief_en:
          'List 3 companies, tools or rules around the platform that make it work (payment providers, delivery, moderation, regulators). What breaks if one of them disappears?',
        brief_bg:
          'Опиши 3 компании, инструмента или правила около платформата, които я карат да работи (платежни доставчици, доставка, модерация, регулатори). Какво се чупи, ако някой от тях изчезне?',
      },
    ],
    caseConnection: {
      caseId: 'digital-platform',
      reviewStatus: 'needs_content_review',
    },
    kikiQuestions: [
      { en: 'Which side of the platform is harder to attract, and why?', bg: 'Коя страна на платформата е по-трудна за привличане и защо?' },
      { en: 'What value does each side get on day one, before scale?', bg: 'Каква стойност получава всяка страна още в началото, преди да има мащаб?' },
      { en: 'Where do network effects work against the platform?', bg: 'Къде network effects работят срещу платформата?' },
      { en: 'What part of the ecosystem is the biggest single point of failure?', bg: 'Коя част от екосистемата е най-голямата единична точка на провал?' },
    ],
    evidenceOfSkill: ['Platform reasoning', 'Multi-sided value analysis', 'Systems thinking'],
    reflectionPrompt: {
      en: 'Which platform in your own life became less useful as it grew? Why?',
      bg: 'Коя платформа в собствения ти живот стана по-малко полезна, когато нарасна? Защо?',
    },
    improvementPrompt: {
      en: 'Redesign one rule of the platform to improve value for the weaker side.',
      bg: 'Прередактирай едно правило на платформата, за да подобри стойността за по-слабата страна.',
    },
  },

  {
    id: 'inno-05-sports-innovation-applied',
    themeId: 'innovation',
    title_en: 'Sports innovation as an applied case area',
    title_bg: 'Спортни иновации като приложен казус',
    status: 'needs_review',
    theoryBlock_en:
      'Sports innovation is not only new equipment. It can involve the training process, athlete data, wellbeing and recovery, fan experience, club management, digital tools and performance tracking. This makes sports a strong applied area to practice innovation thinking: the goals are measurable and the users (athletes, coaches, fans, clubs) are clearly defined.',
    theoryBlock_bg:
      'Спортната иновация не е само ново оборудване. Тя може да включва тренировъчен процес, данни за спортиста, благополучие и възстановяване, преживяване за феновете, управление на клуба, дигитални инструменти и проследяване на представянето. Това прави спорта силна приложна област за упражняване на иновационно мислене: целите са измерими, а потребителите (спортисти, треньори, фенове, клубове) са ясно дефинирани.',
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
          'Choose one user in sports: athlete, coach, fan, or club manager. Describe one specific job they need to do better. Do not name a solution yet.',
        brief_bg:
          'Избери един потребител в спорта: спортист, треньор, фен или клубен мениджър. Опиши една конкретна задача, която трябва да върши по-добре. Още не назовавай решение.',
      },
      {
        id: 'inno-05-t2',
        title_en: 'Design a small sports innovation concept',
        title_bg: 'Създай малък концепт за спортна иновация',
        kind: 'mvp_definition',
        brief_en:
          'For that user and job, design one small innovation. Say whether it is product, service, process, business model or digital innovation. Describe how it works in one paragraph.',
        brief_bg:
          'За този потребител и задача създай една малка иновация. Посочи дали е product, service, process, business model или digital innovation. Опиши как работи в един абзац.',
      },
      {
        id: 'inno-05-t3',
        title_en: 'Define one performance metric',
        title_bg: 'Дефинирай един показател за представяне',
        kind: 'experiment_design',
        brief_en:
          'Choose one KPI that would show whether your concept helps the chosen user. Explain how you would measure it and over what period.',
        brief_bg:
          'Избери един KPI, който би показал дали твоят концепт помага на избрания потребител. Обясни как би го измервал(а) и в какъв период.',
      },
    ],
    caseConnection: {
      caseId: 'sports-innovation',
      reviewStatus: 'needs_content_review',
      note_en: 'Anchor case for this module.',
      note_bg: 'Основен казус за този модул.',
    },
    kikiQuestions: [
      { en: 'Whose life exactly does your concept improve, and how do they measure it?', bg: 'Чий живот точно подобрява твоят концепт и как този човек го измерва?' },
      { en: 'Is the change in the product, the process, the data or the business model?', bg: 'Промяната в продукта ли е, в процеса, в данните или в бизнес модела?' },
      { en: 'What would you need to observe at a training or a match to test this?', bg: 'Какво би трябвало да наблюдаваш на тренировка или мач, за да провериш това?' },
      { en: 'What could go wrong for the athlete, the coach or the fan?', bg: 'Какво може да се обърка за спортиста, треньора или фена?' },
      { en: 'What is one KPI you can defend as honest?', bg: 'Кой е един KPI, който можеш да защитиш като честен?' },
    ],
    evidenceOfSkill: ['Applied user framing', 'Concept design', 'Metric selection'],
    reflectionPrompt: {
      en: 'What surprised you about the user you chose?',
      bg: 'Какво те изненада относно потребителя, който избра?',
    },
    improvementPrompt: {
      en: 'Improve version 2 of your concept based on one thing that would likely fail in reality.',
      bg: 'Подобри версия 2 на своя концепт въз основа на едно нещо, което вероятно би се провалило в реалността.',
    },
  },

  {
    id: 'inno-06-measuring-communicating-improving',
    themeId: 'innovation',
    title_en: 'Measuring, communicating and improving innovation',
    title_bg: 'Измерване, комуникиране и подобряване на иновации',
    status: 'needs_review',
    theoryBlock_en:
      'An innovation is real when someone can show that something measurably improved. Measurement should be defined before implementation, not after. Communication matters too: users, colleagues and decision-makers must understand what changed, for whom, and what evidence supports it. Version 2 exists because version 1 was measured honestly.',
    theoryBlock_bg:
      'Иновацията е реална, когато някой може да покаже, че нещо измеримо се е подобрило. Измерването се дефинира преди внедряването, а не след него. Комуникацията също е важна: потребителите, колегите и хората, които вземат решения, трябва да разбират какво се е променило, за кого и с какви доказателства. Версия 2 съществува, защото версия 1 е измерена честно.',
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
          'Take one innovation you designed in earlier modules. Write the current baseline (what is happening today) and the target (what you want after the change). Be specific with numbers where possible.',
        brief_bg:
          'Вземи една иновация, която създаде в предходните модули. Опиши текущата базова стойност (какво се случва днес) и целта (какво искаш след промяната). Бъди конкретен(на) с числа, където е възможно.',
      },
      {
        id: 'inno-06-t2',
        title_en: 'Choose 1–2 honest KPIs',
        title_bg: 'Избери 1–2 честни KPI',
        kind: 'decision',
        brief_en:
          'Choose one or two KPIs that would show whether the innovation actually works. Explain why each is honest — that is, hard to fake and connected to real value.',
        brief_bg:
          'Избери един или два KPI, които биха показали дали иновацията реално работи. Обясни защо всеки е честен — тоест труден за манипулиране и свързан с реална стойност.',
      },
      {
        id: 'inno-06-t3',
        title_en: 'Write a 6-line internal update',
        title_bg: 'Напиши 6-редов вътрешен ъпдейт',
        kind: 'reflection',
        brief_en:
          'Write a short update for a colleague or teacher: what changed, for whom, what evidence you have, what is still unknown, what is next. No hype language.',
        brief_bg:
          'Напиши кратък ъпдейт за колега или преподавател: какво се е променило, за кого, с какви доказателства, какво все още не се знае и какво следва. Без хайп език.',
      },
      {
        id: 'inno-06-t4',
        title_en: 'Design version 2',
        title_bg: 'Опиши версия 2',
        kind: 'iteration',
        brief_en:
          'Based on your baseline, KPIs and update, describe two concrete changes for version 2 and why they follow from the evidence.',
        brief_bg:
          'На база базовата стойност, KPI и ъпдейта опиши две конкретни промени за версия 2 и защо следват от доказателствата.',
      },
    ],
    caseConnection: {
      caseId: 'school-youth-environment',
      reviewStatus: 'needs_content_review',
      note_en: 'Small, familiar context to practice honest measurement.',
      note_bg: 'Малък познат контекст за упражняване на честно измерване.',
    },
    kikiQuestions: [
      { en: 'What is the honest evidence that this innovation worked?', bg: 'Кое е честното доказателство, че тази иновация е сработила?' },
      { en: 'Which KPI could be gamed without creating real value?', bg: 'Кой KPI би могъл да бъде манипулиран, без да се създаде реална стойност?' },
      { en: 'Who needs to understand this update — and what would confuse them?', bg: 'Кой трябва да разбере този ъпдейт — и какво би го объркало?' },
      { en: 'What in version 1 would you not repeat?', bg: 'Какво от версия 1 не би повторил(а)?' },
      { en: 'What would you improve in version 2, and what evidence supports that?', bg: 'Какво би подобрил(а) във версия 2 и какво доказателство подкрепя това?' },
    ],
    evidenceOfSkill: ['Honest measurement', 'Clear communication', 'Evidence-based iteration'],
    reflectionPrompt: {
      en: 'Where were you tempted to pick a KPI that looks good instead of one that is honest?',
      bg: 'Къде беше изкушен(а) да избереш KPI, който изглежда добре, вместо такъв, който е честен?',
    },
    improvementPrompt: {
      en: 'Rewrite one line of your update to be more precise and less impressive.',
      bg: 'Пренапиши един ред от ъпдейта, така че да е по-точен и по-малко впечатляващ.',
    },
  },
];

export const PRACTICE_FIRST_MODULES: PracticeFirstModule[] = [
  ...ENTREPRENEURSHIP_MODULES,
  ...INNOVATION_MODULES,
];

