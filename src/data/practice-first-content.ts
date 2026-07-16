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
      'Entrepreneurship is not a personality type. It is a way of thinking and acting: noticing real problems in the world around you, forming a small bet about a possible solution, and testing that bet with real people before spending serious time or money. A Startup is one vehicle for this — but the same thinking works inside schools, NGOs, teams and existing companies.',
    theoryBlock_bg:
      'Предприемачеството не е черта на характера. То е начин на мислене и действие: забелязваш реален проблем около теб, формулираш малка хипотеза за възможно решение и я проверяваш с реални хора, преди да вложиш сериозно време или пари. Startup е една от формите — но същият начин на мислене работи и в училище, в екипи, в НПО и в съществуващи компании.',
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
        title_en: 'Turn one observation into a small bet',
        title_bg: 'Превърни едно наблюдение в малък експеримент',
        kind: 'decision',
        brief_en:
          'Pick one problem. Write one sentence: "I believe X people would do Y if we offered Z." State what would have to be true for this bet to make sense.',
        brief_bg:
          'Избери един проблем. Напиши едно изречение: „Вярвам, че X хора биха направили Y, ако им предложим Z.“ Опиши какво трябва да е вярно, за да има смисъл този залог.',
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
      'An opportunity exists when a real problem meets people who care enough to change behavior or pay. Value is what improves in the user\'s life. A business model describes how that value is delivered, captured and sustained — often sketched first on a Business Model Canvas or Lean Canvas.',
    theoryBlock_bg:
      'Възможност съществува, когато реален проблем срещне хора, на които им пука достатъчно, за да променят поведение или да платят. Стойността е това, което се подобрява в живота на потребителя. Бизнес моделът описва как тази стойност се доставя, улавя и поддържа — най-често се скицира първо на Business Model Canvas или Lean Canvas.',
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
      { en: 'How will value actually reach the user — and how will you capture some of it back?', bg: 'Как реално стойността ще стигне до потребителя — и как ще уловиш част от нея обратно?' },
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

export const PRACTICE_FIRST_MODULES: PracticeFirstModule[] = [
  ...ENTREPRENEURSHIP_MODULES,
];

