/**
 * Curriculum 2026-27 · Extra pathways content
 *
 * Sub-modules, dictionary terms and TEACR scenarios for the six pathways
 * added to the landing subject grid:
 *   - digital-marketing
 *   - management-fundamentals
 *   - project-management
 *   - prompting
 *   - skills-ai-era
 *   - core-digital-innovation
 *
 * Tone: mentor-to-founder, conversational. Bulgarian uses informal "ти".
 * Additive only — merged into the existing ALL_ arrays.
 */

import type { SubModule } from './curriculum-2026-content';
import type { DictionaryTerm } from './dictionary-terms';
import type { TEACRScenario } from './curriculum-2026-teacr';

/* ─────────────────────────── Sub-modules ─────────────────────────── */

export const EXTRA_SUBMODULES: SubModule[] = [
  /* Digital Marketing */
  {
    id: 'digital-marketing-funnel',
    pathwayId: 'digital-marketing',
    level: 'foundation',
    titleEn: 'The Digital Marketing Funnel',
    titleBg: 'Дигиталната маркетинг фуния',
    summaryEn: 'Map every euro you spend to a stage: Attract → Engage → Convert → Retain.',
    summaryBg: 'Свържи всяко похарчено евро със стъпка: Привличане → Ангажиране → Конверсия → Задържане.',
    theoryEn:
      'Most beginners throw money at ads and hope. A funnel forces you to measure where humans drop off. Fix the leak with the biggest hole first — usually it is not traffic, it is the landing page or the follow-up email.',
    theoryBg:
      'Повечето начинаещи хвърлят пари в реклами и се надяват. Фунията те кара да измерваш къде хората отпадат. Първо запушваш най-голямата дупка — обикновено не е трафикът, а landing страницата или follow-up имейлът.',
    frameworkEn:
      'AARRR (Pirate Metrics): Acquisition, Activation, Retention, Referral, Revenue. Track one metric per stage weekly.',
    frameworkBg:
      'AARRR (пиратски метрики): Привличане, Активация, Задържане, Препоръка, Приход. Следиш по една метрика на етап седмично.',
    exampleEn:
      'Dropbox unlocked exponential growth by fixing Referral (give storage, get storage) instead of pouring more into Acquisition ads.',
    exampleBg:
      'Dropbox отключи експоненциален растеж, като поправи Препоръка (дай място, получи място) вместо да налива още в реклами.',
    reflectionEn:
      'Look at your last campaign. Which funnel stage has the worst conversion — and what one experiment would you run this week?',
    reflectionBg:
      'Погледни последната си кампания. Кой етап има най-лошата конверсия — и кой един експеримент ще пуснеш тази седмица?',
    estMinutes: 20,
    relatedTerms: ['AARRR', 'Conversion Rate', 'Landing Page', 'CTA'],
  },
  {
    id: 'digital-marketing-channels',
    pathwayId: 'digital-marketing',
    level: 'intermediate',
    titleEn: 'Choosing Your Channels',
    titleBg: 'Избор на канали',
    summaryEn: 'Do fewer channels, better — not all 12 at once.',
    summaryBg: 'По-малко канали, но по-добре — не всички 12 наведнъж.',
    theoryEn:
      'Every channel (SEO, TikTok, LinkedIn, email, paid, community) has a different cost, speed, and audience. A small team wins by owning 1–2 channels deeply before touching a third. Copy-pasting the same content everywhere is the fastest way to look invisible on every platform.',
    theoryBg:
      'Всеки канал (SEO, TikTok, LinkedIn, имейл, платено, общност) има различна цена, скорост и аудитория. Малък екип печели, като владее 1–2 канала преди да пипне трети. Copy-paste на едно и също съдържание навсякъде те прави невидим навсякъде.',
    frameworkEn:
      'Bullseye Framework (Traction, Weinberg & Mares): brainstorm 19 channels, pick 3 to test cheaply, double down on the 1 that works.',
    frameworkBg:
      'Bullseye рамка: brainstorm-ваш 19 канала, тествате 3 евтино, удвоявате на 1-ия, който работи.',
    exampleEn:
      'Notion grew for years mostly through community + Twitter templates before turning on paid — because that channel already worked.',
    exampleBg:
      'Notion расте години чрез общност + Twitter шаблони, преди да пусне платено — защото каналът вече работеше.',
    reflectionEn:
      'If you had to delete every channel except one for the next 90 days, which do you keep and why?',
    reflectionBg:
      'Ако трябва да изтриеш всички канали освен един за следващите 90 дни, кой оставяш и защо?',
    estMinutes: 25,
    relatedTerms: ['Bullseye', 'Channel Fit', 'CAC', 'Organic Reach'],
  },

  /* Management Fundamentals */
  {
    id: 'management-1on1',
    pathwayId: 'management-fundamentals',
    level: 'foundation',
    titleEn: 'The Weekly 1:1',
    titleBg: 'Седмичната 1:1 среща',
    summaryEn: 'The single highest-leverage 30 minutes a manager owns.',
    summaryBg: '30-те минути с най-голям ефект, които мениджърът контролира.',
    theoryEn:
      'A 1:1 is not a status update — Slack does that. It is a protected space for the report to bring blockers, career questions, and honest signal. Skip enough of them and you stop hearing bad news early. That is how teams quietly break.',
    theoryBg:
      '1:1 не е status update — за това има Slack. Това е защитено пространство, в което човекът носи блокери, кариерни въпроси и честен сигнал. Пропуснеш ли достатъчно, спираш да чуваш лошите новини рано. Така екипите тихо се чупят.',
    frameworkEn:
      'Andy Grove\'s rule: the report owns the agenda, the manager listens 70% and asks "what would make next week easier?"',
    frameworkBg:
      'Правилото на Anderby Grove: човекът води дневния ред, мениджърът слуша 70% и пита „какво ще направи следващата седмица по-лесна?"',
    exampleEn:
      'Intel institutionalised the 1:1 in the 80s and Grove credited it with catching most operational problems before they became crises.',
    exampleBg:
      'Intel институционализира 1:1 през 80-те и Grove ѝ приписва улавянето на повечето проблеми, преди да станат кризи.',
    reflectionEn:
      'When was the last time someone told you something in a 1:1 that you did not already know? If never — the meeting is broken.',
    reflectionBg:
      'Кога за последно някой ти каза нещо в 1:1, което не си знаел? Ако — никога, срещата е счупена.',
    estMinutes: 15,
    relatedTerms: ['1:1', 'Feedback Loop', 'Psychological Safety'],
  },
  {
    id: 'management-delegation',
    pathwayId: 'management-fundamentals',
    level: 'intermediate',
    titleEn: 'Delegation Without Dropping Balls',
    titleBg: 'Делегиране без изпускане на топки',
    summaryEn: 'You can delegate the work, never the accountability.',
    summaryBg: 'Можеш да делегираш работата, никога отговорността.',
    theoryEn:
      'Bad delegation sounds like "just handle it". Good delegation names the outcome, the constraints, the deadline, and the moments you want to be pulled back in. Autonomy without clarity is abandonment.',
    theoryBg:
      'Лошото делегиране звучи като „оправи го някак". Доброто дефинира резултата, ограниченията, срока и моментите, в които искаш да те дръпнат обратно. Автономия без яснота е изоставяне.',
    frameworkEn:
      'The 6 levels of delegation (Turn the Ship Around, Marquet): from "wait to be told" up to "act, no need to report".',
    frameworkBg:
      '6-те нива на делегиране (Marquet): от „чакай да ти кажат" до „действай, няма нужда да докладваш".',
    exampleEn:
      'Captain Marquet turned the worst-rated US submarine into the best by pushing decisions to the lowest competent level — with clear intent.',
    exampleBg:
      'Капитан Marquet превръща най-зле оценената подводница в САЩ в най-добрата, като спуска решенията към най-ниското компетентно ниво.',
    reflectionEn:
      'What is one task on your list this week that only you can do — versus what only feels that way because it is faster to do yourself?',
    reflectionBg:
      'Коя една задача тази седмица наистина само ти можеш да свършиш — и коя само усещаш така, защото е по-бързо ти да я направиш?',
    estMinutes: 20,
    relatedTerms: ['Delegation', 'Ownership', 'RACI'],
  },

  /* Project Management */
  {
    id: 'pm-scope-triangle',
    pathwayId: 'project-management',
    level: 'foundation',
    titleEn: 'Scope, Time, Budget — Pick Two',
    titleBg: 'Обхват, време, бюджет — избери две',
    summaryEn: 'You cannot lock all three. Naming the trade-off up front prevents most fights.',
    summaryBg: 'Не можеш да фиксираш и трите. Назоваването на компромиса рано предотвратява повечето кавги.',
    theoryEn:
      'Every stakeholder secretly wants full scope, tomorrow, for free. Your job is to make the trade-off explicit so the choice belongs to them, not to you at 2am on the deadline.',
    theoryBg:
      'Всеки стейкхолдър тайно иска пълен обхват, за утре, безплатно. Работата ти е да направиш компромиса явен, за да е техен изборът — не твой в 2 сутринта на срока.',
    frameworkEn:
      'Iron Triangle: fix any two of Scope / Time / Cost — the third must flex. Add Quality as the diagonal that suffers when all three are forced.',
    frameworkBg:
      'Железен триъгълник: фиксираш две от Обхват / Време / Бюджет — третото трябва да е гъвкаво.',
    exampleEn:
      'The Sydney Opera House shipped 10 years late and 14× over budget partly because political scope kept expanding without renegotiating time or cost.',
    exampleBg:
      'Операта в Сидни е готова с 10 години закъснение и 14× над бюджета, защото политическият обхват расте без предоговаряне.',
    reflectionEn:
      'On your current project — which of the three is silently sliding? Who needs to hear that today?',
    reflectionBg:
      'В настоящия ти проект — кое от трите тихо се плъзга? Кой трябва да го чуе днес?',
    estMinutes: 15,
    relatedTerms: ['Iron Triangle', 'Scope Creep', 'Trade-off', 'Stakeholder'],
  },
  {
    id: 'pm-agile-vs-waterfall',
    pathwayId: 'project-management',
    level: 'intermediate',
    titleEn: 'Agile vs Waterfall — Which Fits',
    titleBg: 'Agile срещу Waterfall — кое приляга',
    summaryEn: 'Method follows uncertainty, not fashion.',
    summaryBg: 'Методът следва несигурността, не модата.',
    theoryEn:
      'Waterfall wins when the outcome is well understood and change is expensive (bridges, ERP rollouts). Agile wins when you are discovering the problem while you build (products, marketing sites). Using the wrong one is a slow-burn disaster you only see at the end.',
    theoryBg:
      'Waterfall печели, когато резултатът е ясен и промяната е скъпа (мостове, ERP внедрявания). Agile печели, когато откриваш проблема, докато строиш (продукти, сайтове). Грешният избор е бавна катастрофа, която виждаш едва накрая.',
    frameworkEn:
      'Cynefin decision map: Clear → best practice (waterfall). Complicated → good practice (hybrid). Complex → probe-sense-respond (agile).',
    frameworkBg:
      'Карта Cynefin: Ясно → best practice (waterfall). Сложно → good practice (хибрид). Комплексно → пробвай-усети-реагирай (agile).',
    exampleEn:
      'Spotify used Squads + Tribes to keep discovery agile while still coordinating across 100+ engineers.',
    exampleBg:
      'Spotify използва Squads + Tribes, за да пази откривателството agile, а координира 100+ инженери.',
    reflectionEn:
      'Is your current project mostly execution or mostly discovery? Your method should follow the answer.',
    reflectionBg:
      'Проектът ти е основно изпълнение или основно откривателство? Методът следва отговора.',
    estMinutes: 25,
    relatedTerms: ['Agile', 'Waterfall', 'Sprint', 'Kanban', 'Cynefin'],
  },

  /* Prompting */
  {
    id: 'prompting-anatomy',
    pathwayId: 'prompting',
    level: 'foundation',
    titleEn: 'Anatomy of a Great Prompt',
    titleBg: 'Анатомия на страхотен prompt',
    summaryEn: 'Role, context, task, format, constraints. Miss one and the model guesses.',
    summaryBg: 'Роля, контекст, задача, формат, ограничения. Пропуснеш ли едно — моделът гадае.',
    theoryEn:
      'Prompting is not magic words — it is briefing a very fast, very literal intern. Give it a role ("act as a copyeditor"), context (who reads this), a specific task, the format you want back, and hard constraints. Vague in = vague out, always.',
    theoryBg:
      'Prompt-ването не е магически думи — това е брифинг на много бърз, много буквален стажант. Дай му роля, контекст, конкретна задача, желан формат и твърди ограничения. Мъгливо влиза = мъгливо излиза, винаги.',
    frameworkEn:
      'RCTF-C: Role, Context, Task, Format, Constraints. Fill each in one line before you press Enter.',
    frameworkBg:
      'RCTF-C: Роля, Контекст, Задача, Формат, Ограничения. Попълваш всяко в един ред преди Enter.',
    exampleEn:
      '"Act as a senior UX writer (role). Our users are first-time home buyers (context). Rewrite this error message so it reduces panic (task). Return 3 options, max 12 words each (format). No jargon, no exclamation marks (constraints)."',
    exampleBg:
      '„Действай като старши UX writer (роля). Потребителите са първо-жилищни купувачи (контекст). Пренапиши това съобщение за грешка, така че да намали паниката (задача). Върни 3 опции, по 12 думи (формат). Без жаргон и удивителни (ограничения)."',
    reflectionEn:
      'Take a prompt you used yesterday. Which of the five parts did you skip — and would adding it have saved a re-prompt?',
    reflectionBg:
      'Вземи prompt, който използва вчера. Кое от петте пропусна — и щеше ли да ти спести пре-prompt-ване?',
    estMinutes: 15,
    relatedTerms: ['Prompt', 'System Prompt', 'Context Window', 'Zero-shot'],
  },
  {
    id: 'prompting-chains',
    pathwayId: 'prompting',
    level: 'intermediate',
    titleEn: 'Prompt Chains & Self-Critique',
    titleBg: 'Prompt вериги и самокритика',
    summaryEn: 'Break a hard task into steps. Then ask the model to grade its own draft.',
    summaryBg: 'Разделяй трудна задача на стъпки. После искай моделът да оцени собствения си чернови.',
    theoryEn:
      'One giant prompt = one giant guess. A chain (outline → draft → critique → rewrite) beats a single-shot answer on almost every non-trivial task. Self-critique catches 30–50% of factual and tone errors before you see them.',
    theoryBg:
      'Един гигантски prompt = едно гигантско предположение. Верига (план → чернова → критика → пренаписване) бие еднократния отговор в почти всяка нетривиална задача. Самокритиката хваща 30–50% от фактическите и тонални грешки.',
    frameworkEn:
      'Chain of Thought + Reflexion: prompt 1 asks for reasoning, prompt 2 asks the model "what is weakest here?", prompt 3 rewrites addressing the critique.',
    frameworkBg:
      'Chain of Thought + Reflexion: prompt 1 иска разсъждение, prompt 2 пита „кое е най-слабото?", prompt 3 пренаписва според критиката.',
    exampleEn:
      'Anthropic and OpenAI research shows Reflexion-style loops meaningfully improve accuracy on math and coding benchmarks without any model change.',
    exampleBg:
      'Изследвания на Anthropic и OpenAI показват, че Reflexion цикли значително подобряват точността, без промяна в модела.',
    reflectionEn:
      'Pick a prompt you re-ran 3+ times last week. How would you break it into a chain of 3 smaller prompts?',
    reflectionBg:
      'Избери prompt, който пусна 3+ пъти миналата седмица. Как ще го разделиш на 3 по-малки?',
    estMinutes: 25,
    relatedTerms: ['Chain of Thought', 'Reflexion', 'Few-shot', 'Temperature'],
  },

  /* Skills in the AI Era */
  {
    id: 'skills-ai-taste',
    pathwayId: 'skills-ai-era',
    level: 'foundation',
    titleEn: 'Taste Is the New Moat',
    titleBg: 'Вкусът е новият защитен ров',
    summaryEn: 'When everyone can generate, only people who know what "good" looks like win.',
    summaryBg: 'Когато всички могат да генерират, печелят само тези, които знаят как изглежда „добро".',
    theoryEn:
      'AI collapses the cost of first drafts to zero. What is still expensive: taste, judgement, and the ability to spot the version that lands. The job is shifting from "make it" to "pick the best one and know why".',
    theoryBg:
      'AI смачква цената на първите чернови до нула. Скъпо остават: вкусът, преценката и способността да разпознаеш версията, която работи. Работата се измества от „направи го" към „избери най-доброто и знай защо".',
    frameworkEn:
      'Generate → Curate → Justify: force yourself to generate 5, pick 1, and write one sentence about why the other 4 lost.',
    frameworkBg:
      'Генерирай → Куратирай → Обоснови: генерираш 5, избираш 1, пишеш едно изречение защо другите 4 губят.',
    exampleEn:
      'Great editors and creative directors were already doing this before AI — the AI era just makes it the default job of every knowledge worker.',
    exampleBg:
      'Добрите редактори и креативни директори го правеха и преди AI — AI ерата просто го прави дефолтна работа на всеки knowledge worker.',
    reflectionEn:
      'Last time you shipped AI-generated work, could you defend in one sentence why it was the best of the options — or did you ship the first one?',
    reflectionBg:
      'Последно, когато пусна AI-генерирана работа, можеше ли с едно изречение да защитиш защо е най-добрата опция — или пусна първата?',
    estMinutes: 15,
    relatedTerms: ['Taste', 'Curation', 'Judgement', 'Human-in-the-loop'],
  },
  {
    id: 'skills-ai-verify',
    pathwayId: 'skills-ai-era',
    level: 'intermediate',
    titleEn: 'Verify Before You Ship',
    titleBg: 'Провери преди да пуснеш',
    summaryEn: 'The model sounds confident even when it is wrong. Build a verification habit or ship errors at scale.',
    summaryBg: 'Моделът звучи уверено дори когато греши. Изградиш ли навик за проверка, или пускаш грешки на скала.',
    theoryEn:
      'Hallucinations are not a bug you patch — they are a property of statistical prediction. Every claim, number, name, and quote from a model is "probably true". Your job is to convert probably into definitely before it reaches a customer.',
    theoryBg:
      'Халюцинациите не са bug за поправяне — това е свойство на статистическото предсказване. Всяко твърдение, число, име и цитат от модел е „вероятно вярно". Работата ти е да го превърнеш в „със сигурност вярно", преди да стигне клиент.',
    frameworkEn:
      'The 3-source rule: never publish a fact from AI without confirming it in 2 independent primary sources (the model itself does not count).',
    frameworkBg:
      'Правилото на 3-те източника: никога не публикуваш факт от AI без 2 независими първоизточника (моделът не се брои).',
    exampleEn:
      'Multiple law firms have been fined after filing AI-generated briefs with invented case citations. Verification would have cost 10 minutes.',
    exampleBg:
      'Няколко адвокатски кантори бяха глобени, защото подадоха AI брифове с измислени казуси. Проверката щеше да отнеме 10 минути.',
    reflectionEn:
      'What is your personal rule for when AI output is "verified enough" to ship? Write it down — most people do not have one.',
    reflectionBg:
      'Кое е твоето лично правило кога AI output е „достатъчно проверен" за пускане? Запиши го — повечето хора нямат такова.',
    estMinutes: 20,
    relatedTerms: ['Hallucination', 'Verification', 'Grounding', 'Citation'],
  },

  /* Innovation & Digital Innovation */
  {
    id: 'innovation-types',
    pathwayId: 'core-digital-innovation',
    level: 'foundation',
    titleEn: 'Four Types of Innovation',
    titleBg: 'Четири вида иновация',
    summaryEn: 'Not every idea has to be a moonshot. Most winning ones aren\'t.',
    summaryBg: 'Не всяка идея трябва да е революция. Повечето печеливши не са.',
    theoryEn:
      'Sustaining (better version), disruptive (new market, worse-then-better), architectural (new combination of old parts), radical (new to the world). Founders overweight radical because it sounds heroic — but disruptive and architectural produce most real returns.',
    theoryBg:
      'Поддържаща (по-добра версия), нарушаваща (нов пазар, по-лошо-после-по-добро), архитектурна (нова комбинация от стари части), радикална (ново за света). Основателите надценяват радикалната, защото звучи героично — но нарушаващата и архитектурната носят повечето реални резултати.',
    frameworkEn:
      'Christensen\'s innovation matrix: plot each idea on axes Market (existing/new) × Technology (existing/new) and see where your bets cluster.',
    frameworkBg:
      'Матрица на Christensen: наносиш идея на оси Пазар (стар/нов) × Технология (стара/нова) и виждаш къде се струпват залозите.',
    exampleEn:
      'Uber was architectural, not radical — smartphones + GPS + payments + drivers all existed. The combination was new.',
    exampleBg:
      'Uber беше архитектурна, не радикална — смартфони, GPS, плащания и шофьори вече съществуваха. Комбинацията беше нова.',
    reflectionEn:
      'Look at your last 3 ideas. Which type dominates — and is that on purpose or by accident?',
    reflectionBg:
      'Погледни последните си 3 идеи. Кой тип доминира — умишлено ли е, или случайно?',
    estMinutes: 20,
    relatedTerms: ['Disruptive Innovation', 'Sustaining Innovation', 'Architectural Innovation'],
  },
  {
    id: 'innovation-digital-transformation',
    pathwayId: 'core-digital-innovation',
    level: 'intermediate',
    titleEn: 'Digital Transformation Isn\'t IT',
    titleBg: 'Дигиталната трансформация не е IT',
    summaryEn: 'Buying software isn\'t the change. Changing how decisions get made is.',
    summaryBg: 'Купуването на софтуер не е промяна. Промяна е как се взимат решенията.',
    theoryEn:
      'Most "digital transformations" fail because they replace paper with PDFs and call it done. Real transformation changes who decides, how fast feedback flows, and what data leadership actually looks at every Monday. Tools are the smallest part.',
    theoryBg:
      'Повечето „дигитални трансформации" се провалят, защото сменят хартия с PDF-и и наричат това „готово". Реалната промяна променя кой решава, колко бързо тече обратната връзка и какви данни ръководството реално гледа всеки понеделник.',
    frameworkEn:
      'McKinsey 4Ds: Discover (customer pain), Design (new journey), Deliver (MVP + iterate), De-risk (governance & talent).',
    frameworkBg:
      '4-те D на McKinsey: Discover, Design, Deliver, De-risk.',
    exampleEn:
      'DBS Bank (Singapore) rebuilt around customer journeys and cloud, moving from "worst bank in Asia" to "best digital bank in the world" in a decade.',
    exampleBg:
      'DBS Bank (Сингапур) се преструктурира около клиентски пътувания и cloud — от „най-лошата банка в Азия" до „най-добра дигитална банка в света" за десетилетие.',
    reflectionEn:
      'Name one weekly meeting in your school or org whose agenda would change if the underlying data were live instead of last month\'s.',
    reflectionBg:
      'Назови една седмична среща, чийто дневен ред би се променил, ако данните бяха на живо, а не от миналия месец.',
    estMinutes: 25,
    relatedTerms: ['Digital Transformation', 'Customer Journey', 'MVP', 'Governance'],
  },
];

/* ─────────────────────────── Dictionary terms ─────────────────────────── */

export const EXTRA_TERMS_2026: DictionaryTerm[] = [
  /* Digital Marketing */
  { term: 'AARRR', termBg: 'AARRR', category: 'Marketing', difficulty: 'intermediate',
    definition: 'Acquisition, Activation, Retention, Referral, Revenue — the 5 stages every product funnel passes through. Track one metric per stage and you always know where to focus.',
    definitionBg: 'Придобиване, Активация, Задържане, Препоръка, Приход — 5-те етапа, през които минава всеки продуктов фуния. По една метрика на етап и винаги знаеш къде да фокусираш.',
    example: 'Dropbox\'s famous "give 500MB, get 500MB" fixed the R (Referral) — not more ad spend.' },
  { term: 'CTA', termBg: 'CTA (призив за действие)', category: 'Marketing', difficulty: 'beginner',
    definition: 'Call To Action — the button or line that tells the visitor the next physical thing to do. Vague CTAs ("Learn more") convert half as well as specific ones ("Start free 7-day trial").',
    definitionBg: 'Призивът, който казва на посетителя следващото физическо действие. Мъгливите („Научи повече") конвертират наполовина спрямо конкретните („Пусни 7-дневен безплатен пробен период").' },
  { term: 'Landing Page', termBg: 'Landing страница', category: 'Marketing', difficulty: 'beginner',
    definition: 'A single-purpose page built to convert one specific audience on one specific offer. Not your homepage — homepage tries to please everyone and converts no one.',
    definitionBg: 'Страница с една цел: да конвертира една конкретна аудитория за едно предложение. Не е началната ти страница — тя се опитва да угоди на всички и не конвертира никого.' },
  { term: 'Bullseye', termBg: 'Bullseye рамка', category: 'Marketing', difficulty: 'intermediate',
    definition: 'The Traction book\'s framework: brainstorm 19 possible channels, test 3 cheaply, double down on the 1 that works. Beats the temptation to do "a bit of everything".',
    definitionBg: 'Рамката от книгата Traction: brainstorm-ваш 19 канала, тествате 3 евтино, удвоявате на 1-ия, който работи.' },

  /* Management */
  { term: '1:1', termBg: 'Индивидуална среща', category: 'Leadership', difficulty: 'beginner',
    definition: 'A recurring private 30-minute meeting owned by the direct report, not the manager. The place where bad news is supposed to arrive first — before it becomes a crisis.',
    definitionBg: 'Повтаряща се 30-минутна лична среща, водена от подчинения, не от мениджъра. Мястото, където лошите новини идват първо — преди да станат криза.' },
  { term: 'Psychological Safety', termBg: 'Психологическа безопасност', category: 'Leadership', difficulty: 'intermediate',
    definition: 'Google\'s Project Aristotle finding: the single biggest predictor of team performance is whether people feel safe to say "I don\'t know" or "I messed up" without punishment.',
    definitionBg: 'Откритие на Google Project Aristotle: най-големият предиктор за екипна ефективност е дали хората се чувстват сигурни да кажат „не знам" или „сгреших" без наказание.' },
  { term: 'RACI', termBg: 'RACI матрица', category: 'Leadership', difficulty: 'intermediate',
    definition: 'Responsible, Accountable, Consulted, Informed — a one-line-per-task grid that ends the "I thought you were doing it" conversation forever.',
    definitionBg: 'Отговорен, Носещ отчетност, Консултиран, Информиран — таблица по един ред на задача, която приключва завинаги разговора „мислех, че ти го правиш".' },

  /* Project Management */
  { term: 'Iron Triangle', termBg: 'Железен триъгълник', category: 'Operations', difficulty: 'beginner',
    definition: 'Scope, Time, Budget — you can lock any two, the third must flex. If a stakeholder tries to lock all three, quality secretly becomes the flex.',
    definitionBg: 'Обхват, време, бюджет — фиксираш две, третото трябва да е гъвкаво. Ако стейкхолдър се опита да фиксира и трите, качеството тайно става гъвкавото.' },
  { term: 'Scope Creep', termBg: 'Пълзене на обхвата', category: 'Operations', difficulty: 'beginner',
    definition: 'When "just one more small thing" quietly triples the work without anyone renegotiating the deadline or budget. The silent killer of most projects.',
    definitionBg: 'Когато „само още едно малко нещо" тихо утроява работата, без някой да предоговаря срока или бюджета. Тихият убиец на повечето проекти.' },
  { term: 'Sprint', termBg: 'Спринт', category: 'Operations', difficulty: 'beginner',
    definition: 'A fixed short timebox (usually 1–2 weeks) during which the team ships a specific set of things. The point is not speed — it is predictable rhythm.',
    definitionBg: 'Фиксиран кратък период (обикновено 1–2 седмици), в който екипът пуска конкретен набор от неща. Целта не е скорост — а предвидим ритъм.' },
  { term: 'Kanban', termBg: 'Kanban', category: 'Operations', difficulty: 'beginner',
    definition: 'A visual board with columns (To Do / Doing / Done) and a limit on how many things can be "Doing" at once. Forces you to finish before you start.',
    definitionBg: 'Визуална дъска с колони (За правене / В процес / Готово) и лимит колко неща могат да са едновременно „в процес". Кара те да завършваш преди да започваш ново.' },

  /* Prompting */
  { term: 'Prompt', termBg: 'Prompt', category: 'AI', difficulty: 'beginner',
    definition: 'The instructions you give an AI model. Think brief-to-an-intern, not magic words: the more clearly you name role, task, format and constraints, the better the output.',
    definitionBg: 'Инструкциите, които даваш на AI модел. Мисли за брифинг към стажант, не за магически думи.' },
  { term: 'System Prompt', termBg: 'Системен prompt', category: 'AI', difficulty: 'intermediate',
    definition: 'The hidden top-level instruction that sets the model\'s persona and rules for the whole conversation. Users don\'t see it, but it drives every reply.',
    definitionBg: 'Скритата водеща инструкция, която задава ролята и правилата на модела за целия разговор.' },
  { term: 'Chain of Thought', termBg: 'Chain of Thought', category: 'AI', difficulty: 'intermediate',
    definition: 'Asking the model to reason step by step before answering. Big accuracy boost on math, logic and multi-step tasks — costs a few extra tokens, worth it.',
    definitionBg: 'Караш модела да разсъждава стъпка по стъпка преди да отговори. Голям буст в точността за математика, логика и многостъпкови задачи.' },
  { term: 'Reflexion', termBg: 'Reflexion', category: 'AI', difficulty: 'advanced',
    definition: 'A prompting pattern where the model critiques its own draft and then rewrites it. Catches 30–50% of errors without changing the model.',
    definitionBg: 'Prompting модел, при който моделът критикува собствения си чернови и го пренаписва.' },
  { term: 'Few-shot', termBg: 'Few-shot', category: 'AI', difficulty: 'intermediate',
    definition: 'Giving the model 2–5 examples of the input→output pairs you want, before asking for a new one. Usually beats writing a long instruction.',
    definitionBg: 'Даваш на модела 2–5 примера входно-изходни двойки, преди да поискаш нов. Обикновено бие дълга инструкция.' },
  { term: 'Hallucination', termBg: 'Халюцинация', category: 'AI', difficulty: 'beginner',
    definition: 'When the model confidently makes something up — a fake quote, wrong number, invented citation. It\'s not lying, it\'s statistically guessing. Verify before you ship.',
    definitionBg: 'Когато моделът уверено измисля — фалшив цитат, грешно число, изсмукана справка. Не лъже, статистически гадае. Проверявай преди да пускаш.' },
  { term: 'Context Window', termBg: 'Контекстен прозорец', category: 'AI', difficulty: 'intermediate',
    definition: 'How much text a model can "remember" in one conversation. Blow past it and earlier turns silently fall off the back of the truck.',
    definitionBg: 'Колко текст моделът „помни" в един разговор. Прехвърлиш ли го, ранните реплики тихо изпадат.' },

  /* Skills AI Era */
  { term: 'Taste', termBg: 'Вкус', category: 'AI', difficulty: 'intermediate',
    definition: 'The ability to look at 5 AI-generated options and say which one lands — and why. As generation gets free, taste becomes the scarce, valuable skill.',
    definitionBg: 'Способността да погледнеш 5 AI-генерирани опции и да кажеш коя работи — и защо. Докато генерирането става безплатно, вкусът става оскъдното, ценно умение.' },
  { term: 'Human-in-the-loop', termBg: 'Човек-в-цикъла', category: 'AI', difficulty: 'intermediate',
    definition: 'A workflow where AI drafts and a human checks/approves before anything ships. The default safe pattern for anything customer-facing, legal, or medical.',
    definitionBg: 'Работен процес, при който AI прави чернова, а човек проверява/одобрява преди пускане.' },
  { term: 'Grounding', termBg: 'Заземяване', category: 'AI', difficulty: 'advanced',
    definition: 'Forcing the model to answer only from a specific set of documents you provide (RAG-style). Cuts hallucinations dramatically for factual tasks.',
    definitionBg: 'Караш модела да отговаря само от конкретни документи, които му даваш (RAG). Драстично намалява халюцинациите.' },

  /* Innovation */
  { term: 'Disruptive Innovation', termBg: 'Нарушаваща иновация', category: 'Innovation', difficulty: 'intermediate',
    definition: 'Christensen\'s term: a product that starts cheaper/worse, serves a new or ignored market, then improves until it eats the incumbent\'s lunch. Netflix vs Blockbuster.',
    definitionBg: 'Термин на Christensen: продукт, който започва по-евтин/по-лош, обслужва нов или пренебрегнат пазар, после се подобрява, докато изяде обяда на голямата компания.' },
  { term: 'Architectural Innovation', termBg: 'Архитектурна иновация', category: 'Innovation', difficulty: 'advanced',
    definition: 'A new combination of components that already exist. Uber didn\'t invent smartphones, GPS or drivers — the combination was the innovation.',
    definitionBg: 'Нова комбинация от вече съществуващи компоненти. Uber не измисли смартфон, GPS или шофьори — комбинацията беше иновацията.' },
  { term: 'Digital Transformation', termBg: 'Дигитална трансформация', category: 'Innovation', difficulty: 'intermediate',
    definition: 'Rebuilding how an organisation makes decisions and serves customers, using digital tools. Not the same as "buying more software" — that\'s IT.',
    definitionBg: 'Преизграждане как една организация взима решения и обслужва клиенти, чрез дигитални инструменти. Не е „купуване на още софтуер".' },
  { term: 'Customer Journey', termBg: 'Клиентско пътуване', category: 'Innovation', difficulty: 'beginner',
    definition: 'The full path a person walks from "never heard of you" to "loyal advocate", including every moment of friction along the way. Map it and the fixes become obvious.',
    definitionBg: 'Пълният път на човек от „никога не е чувал за теб" до „лоялен адвокат", с всяка точка на триене по пътя.' },
];

/* ─────────────────────────── TEACR scenarios ─────────────────────────── */

export const EXTRA_TEACR_SCENARIOS: TEACRScenario[] = [
  { targetId: 'digital-marketing-funnel',
    promptEn: 'Your funnel shows 10k visitors, 200 signups, 4 paying. Where do you focus this week?',
    promptBg: 'Фунията ти показва 10к посетители, 200 регистрации, 4 плащащи. Къде фокусираш тази седмица?',
    options: [
      { id: 'ads', labelEn: 'Buy more ads to double traffic', labelBg: 'Купи повече реклами, за да удвоиш трафика', outcome: 'negative',
        consequenceEn: 'You now have 400 leaky signups instead of 200. Cost doubled, paying customers barely move.',
        consequenceBg: 'Сега имаш 400 „течащи" регистрации вместо 200. Разходите се удвоиха, плащащите почти не мърдат.' },
      { id: 'activation', labelEn: 'Fix the signup→paying step first', labelBg: 'Първо поправи стъпката регистрация→плащане', outcome: 'positive',
        consequenceEn: 'Doubling activation from 2% to 4% doubles revenue at zero extra ad cost — the biggest leak was after the door.',
        consequenceBg: 'Удвояването на активацията от 2% на 4% удвоява прихода при 0 допълнителни разходи.' },
    ] },
  { targetId: 'digital-marketing-channels',
    promptEn: 'You have 10 hours a week for marketing. What do you do?',
    promptBg: 'Имаш 10 часа седмично за маркетинг. Какво правиш?',
    options: [
      { id: 'all', labelEn: 'Post on TikTok, Instagram, LinkedIn, X and YouTube', labelBg: 'Пускай в TikTok, Instagram, LinkedIn, X и YouTube', outcome: 'negative',
        consequenceEn: 'Two hours per channel = mediocre everywhere. Algorithms punish inconsistency and you\'re invisible on all 5.',
        consequenceBg: 'По 2 часа на канал = средно навсякъде. Алгоритмите наказват непоследователността.' },
      { id: 'one', labelEn: 'Go deep on one channel for 90 days', labelBg: 'Влез дълбоко в един канал за 90 дни', outcome: 'positive',
        consequenceEn: 'You learn the channel\'s real levers, build a signal, and know whether to keep or kill it before touching a second.',
        consequenceBg: 'Научаваш реалните лостове на канала и знаеш дали да го задържиш или спреш преди да пипнеш втори.' },
    ] },
  { targetId: 'management-1on1',
    promptEn: 'Your report skipped their last two 1:1s citing "too busy". What do you do?',
    promptBg: 'Подчиненият ти пропусна последните две 1:1 срещи с оправдание „много работа". Какво правиш?',
    options: [
      { id: 'let', labelEn: 'Let it slide — respect their time', labelBg: 'Пусни го — уважавай времето му', outcome: 'negative',
        consequenceEn: 'Three months later you learn about a burnout and a job offer — both would have surfaced in a 1:1.',
        consequenceBg: 'Три месеца по-късно научаваш за прегаряне и оферта за работа — и двете щяха да излязат в 1:1.' },
      { id: 'protect', labelEn: 'Reschedule and protect the slot as non-negotiable', labelBg: 'Пренасрочи и защити слота като непреговарящ', outcome: 'positive',
        consequenceEn: 'You surface a scope-creep problem early and fix it before it burns them out.',
        consequenceBg: 'Откриваш scope-creep рано и го поправяш преди да прегорят.' },
    ] },
  { targetId: 'management-delegation',
    promptEn: 'A task on your plate could go to a junior — but they\'ll do it 60% as well. What do you do?',
    promptBg: 'Задача на бюрото ти може да отиде на джуниър — но той ще я направи на 60%. Какво правиш?',
    options: [
      { id: 'self', labelEn: 'Do it yourself — quality matters', labelBg: 'Направи я сам — качеството е важно', outcome: 'negative',
        consequenceEn: 'The junior never grows, you become the bottleneck, and next quarter you\'re doing the same task again.',
        consequenceBg: 'Джуниърът не расте, ти ставаш тесното място, а следващото тримесечие пак ти я вършиш.' },
      { id: 'delegate', labelEn: 'Delegate with clear intent + a 24h check-in', labelBg: 'Делегирай с ясен intent + check-in след 24ч', outcome: 'positive',
        consequenceEn: 'They deliver at 75% now, 90% in a month, 110% in a quarter — and you get a lever.',
        consequenceBg: 'Той доставя 75% сега, 90% след месец, 110% след тримесечие — а ти печелиш лост.' },
    ] },
  { targetId: 'pm-scope-triangle',
    promptEn: 'Sponsor asks for 3 extra features. Same deadline, same budget. What do you say?',
    promptBg: 'Спонсорът иска 3 допълнителни функции. Същият срок, същият бюджет. Какво казваш?',
    options: [
      { id: 'yes', labelEn: '"We\'ll make it work"', labelBg: '„Ще се справим"', outcome: 'negative',
        consequenceEn: 'The team crunches, quality drops, you ship late anyway. Trust erodes on both sides.',
        consequenceBg: 'Екипът се преработва, качеството пада, пак пускаш със закъснение. Доверието изтича от двете страни.' },
      { id: 'tradeoff', labelEn: 'Show the trade-off and ask what to drop or move', labelBg: 'Покажи компромиса и попитай какво да отпаднe или премести', outcome: 'positive',
        consequenceEn: 'Sponsor picks the 1 feature that actually matters and drops 2. Team ships on time with what mattered.',
        consequenceBg: 'Спонсорът избира 1 функция, която наистина има значение, и отпадат 2.' },
    ] },
  { targetId: 'pm-agile-vs-waterfall',
    promptEn: 'You\'re building a brand new product feature nobody has proof will land. Which method?',
    promptBg: 'Строиш чисто нова функция, за която никой няма доказателство, че ще работи. Кой метод?',
    options: [
      { id: 'waterfall', labelEn: 'Plan the full 6-month roadmap up front', labelBg: 'Планирай целия 6-месечен roadmap отпред', outcome: 'negative',
        consequenceEn: 'Month 5 you learn the core assumption was wrong. 5 months of work rewritten.',
        consequenceBg: 'На 5-ия месец разбираш, че основното допускане е грешно. 5 месеца работа за пренаписване.' },
      { id: 'agile', labelEn: 'Ship a small MVP every 2 weeks and measure', labelBg: 'Пускай малък MVP на всеки 2 седмици и мери', outcome: 'positive',
        consequenceEn: 'Week 4 the wrong assumption dies cheap. You pivot and ship the right thing by month 3.',
        consequenceBg: 'На седмица 4 грешното допускане умира евтино. Правиш pivot и пускаш правилното нещо до 3-и месец.' },
    ] },
  { targetId: 'prompting-anatomy',
    promptEn: 'You need marketing copy from an AI. Which prompt gets you a usable draft?',
    promptBg: 'Трябва ти маркетинг текст от AI. Кой prompt ти дава използваема чернова?',
    options: [
      { id: 'vague', labelEn: '"Write marketing copy for my app"', labelBg: '„Напиши маркетинг текст за приложението ми"', outcome: 'negative',
        consequenceEn: 'You get generic SaaS soup. Rewrite it 6 times and end up doing it yourself.',
        consequenceBg: 'Получаваш генерична SaaS супа. Пренаписваш 6 пъти и накрая го правиш сам.' },
      { id: 'structured', labelEn: 'Include role, audience, task, format, and 2 examples of tone', labelBg: 'Включи роля, аудитория, задача, формат и 2 примера за тон', outcome: 'positive',
        consequenceEn: 'First draft is 80% usable. You edit for 5 minutes and ship.',
        consequenceBg: 'Първата чернова е 80% използваема. Редактираш 5 минути и пускаш.' },
    ] },
  { targetId: 'prompting-chains',
    promptEn: 'A complex research task keeps producing shallow answers from one big prompt. What do you try?',
    promptBg: 'Сложна изследователска задача дава плитки отговори от един голям prompt. Какво пробваш?',
    options: [
      { id: 'longer', labelEn: 'Write an even longer, more detailed prompt', labelBg: 'Напиши още по-дълъг, по-детайлен prompt', outcome: 'neutral',
        consequenceEn: 'The model latches onto the last instruction and ignores half of the earlier ones. Marginal improvement.',
        consequenceBg: 'Моделът се фиксира върху последната инструкция и игнорира половината преди нея.' },
      { id: 'chain', labelEn: 'Break it into outline → draft → self-critique → rewrite', labelBg: 'Раздели го на план → чернова → самокритика → пренаписване', outcome: 'positive',
        consequenceEn: 'Each step is focused and small, so the model does each well. Final output is 2× better.',
        consequenceBg: 'Всяка стъпка е фокусирана и малка, така моделът я прави добре. Финалният резултат е 2× по-добър.' },
    ] },
  { targetId: 'skills-ai-taste',
    promptEn: 'You have 30 minutes to produce a client proposal with AI. What\'s your play?',
    promptBg: 'Имаш 30 минути да направиш клиентско предложение с AI. Какъв е ходът?',
    options: [
      { id: 'first', labelEn: 'Take the first output and ship', labelBg: 'Вземи първия резултат и пусни', outcome: 'negative',
        consequenceEn: 'It reads like every other AI proposal. Client can smell it and disengages.',
        consequenceBg: 'Чете се като всяко друго AI предложение. Клиентът го подушва и се отдръпва.' },
      { id: 'curate', labelEn: 'Generate 5 versions, pick the sharpest, edit with your voice', labelBg: 'Генерирай 5 версии, избери най-острата, редактирай със свой глас', outcome: 'positive',
        consequenceEn: 'Client feels a human made a decision. You still finish in 25 minutes.',
        consequenceBg: 'Клиентът усеща, че човек е взел решение. Пак свършваш за 25 минути.' },
    ] },
  { targetId: 'skills-ai-verify',
    promptEn: 'The AI cites a legal case that would perfectly win your argument. Deadline is in 1 hour.',
    promptBg: 'AI цитира правен казус, който перфектно печели аргумента ти. Срокът е след 1 час.',
    options: [
      { id: 'trust', labelEn: 'Cite it — the model sounds confident', labelBg: 'Цитирай го — моделът звучи уверено', outcome: 'negative',
        consequenceEn: 'The case doesn\'t exist. You\'re fined, publicly named, and lose the client. Real precedent, multiple times.',
        consequenceBg: 'Казусът не съществува. Глобяват те, назовават те публично, губиш клиента.' },
      { id: 'verify', labelEn: 'Take 10 minutes to verify in 2 primary sources', labelBg: 'Отдели 10 минути и провери в 2 първоизточника', outcome: 'positive',
        consequenceEn: 'Two of the three cites check out; one was fabricated. You ship the argument that\'s actually true.',
        consequenceBg: 'Два от трите цитата се потвърждават; един е измислен. Пускаш аргумент, който наистина е верен.' },
    ] },
  { targetId: 'innovation-types',
    promptEn: 'Your team pitches you 4 ideas. Which category deserves your first bet?',
    promptBg: 'Екипът ти пита 4 идеи. Коя категория заслужава първия ти залог?',
    options: [
      { id: 'radical', labelEn: 'The moonshot — brand new science', labelBg: 'Moonshot-ът — чисто нова наука', outcome: 'neutral',
        consequenceEn: 'Exciting story, 10-year payoff, high chance of zero. Great if you can afford to wait — most can\'t.',
        consequenceBg: 'Впечатляваща история, 10-годишен резултат, висока вероятност за нула.' },
      { id: 'architectural', labelEn: 'The architectural — new combination of things that exist', labelBg: 'Архитектурната — нова комбинация от неща, които съществуват', outcome: 'positive',
        consequenceEn: 'You can prototype in weeks, validate cheaply, and most historical Ubers/Airbnbs live in this quadrant.',
        consequenceBg: 'Можеш да прототипираш за седмици и да валидираш евтино — тук живеят повечето исторически Uber-и и Airbnb-та.' },
    ] },
  { targetId: 'innovation-digital-transformation',
    promptEn: 'A school buys a new LMS. What determines whether it actually transforms teaching?',
    promptBg: 'Училище купува нова LMS. Кое определя дали наистина трансформира преподаването?',
    options: [
      { id: 'tool', labelEn: 'The features of the software', labelBg: 'Функциите на софтуера', outcome: 'negative',
        consequenceEn: 'Teachers keep old workflows and upload PDFs into the new tool. Nothing changes except the login.',
        consequenceBg: 'Учителите пазят старите workflow-и и качват PDF-и в новия tool. Нищо не се променя освен login-а.' },
      { id: 'decisions', labelEn: 'Whether Monday decisions (grading, grouping, support) now use live data', labelBg: 'Дали решенията в понеделник (оценки, групиране, подкрепа) вече използват живи данни', outcome: 'positive',
        consequenceEn: 'Struggling students are spotted in week 2 instead of month 3. That\'s transformation — not the tool.',
        consequenceBg: 'Затрудняващи се ученици се откриват през 2-ра седмица вместо 3-ти месец. Това е трансформация.' },
    ] },
];
