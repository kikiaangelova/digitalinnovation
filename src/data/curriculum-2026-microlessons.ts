/**
 * Curriculum 2026–27 · Interactive 7-minute micro-lessons
 *
 * Each micro-lesson layers on top of an existing SubModule (by id) and adds:
 *   1. Story  — a 60-second scene with a specific person and stakes
 *   2. Framework — reuse SubModule.frameworkXx (rendered by player)
 *   3. Decide  — a live decision (2–4 options + short consequence)
 *   4. Reflect — one question, learner answers in their own words
 *   5. Apply   — one 24-hour homework the learner can actually do
 *
 * Voice: Kiki. Warm, direct, informal "ти" in Bulgarian. No corporate fluff.
 */

export interface MicroLessonDecisionOption {
  labelEn: string;
  labelBg: string;
  /** What actually happens if they pick this. Honest, not moralistic. */
  consequenceEn: string;
  consequenceBg: string;
  /** Kiki's rating of this choice: strong | tradeoff | weak. */
  verdict: 'strong' | 'tradeoff' | 'weak';
}

export interface MicroLesson {
  /** Must match an id from ALL_SUBMODULES_2026. */
  subModuleId: string;
  storyEn: string;
  storyBg: string;
  decisionPromptEn: string;
  decisionPromptBg: string;
  options: MicroLessonDecisionOption[];
  reflectionEn: string;
  reflectionBg: string;
  applyEn: string;
  applyBg: string;
}

export const MICROLESSONS_2026: MicroLesson[] = [
  /* ── Marketing ────────────────────────────────────────────────────────── */
  {
    subModuleId: 'marketing-positioning',
    storyEn:
      "Maria makes cold-pressed juice from ugly fruit that supermarkets throw away. She's pitching to a small café chain in Sofia. The owner shrugs: 'Cool, but why should I care? I already have a juice supplier.' Maria has 30 seconds.",
    storyBg:
      "Мария прави студено-пресован сок от 'грозни' плодове, които супермаркетите изхвърлят. Пич­и на малка кафе-верига в София. Собственикът свива рамене: 'Готино, ама защо да ми пука? Имам си доставчик.' Мария има 30 секунди.",
    decisionPromptEn: "What should Maria lead with?",
    decisionPromptBg: "С какво трябва да започне Мария?",
    options: [
      {
        labelEn: "'Our juice is 100% organic and cold-pressed.'",
        labelBg: "'Сокът ни е 100% био и студено-пресован.'",
        consequenceEn: "Owner nods politely. Every supplier says this. Meeting ends in 4 minutes.",
        consequenceBg: "Собственикът учтиво кима. Всеки доставчик казва това. Срещата приключва след 4 мин.",
        verdict: 'weak',
      },
      {
        labelEn: "'We save 800kg of fruit a week from the trash — your customers see it on the bottle.'",
        labelBg: "'Спасяваме 800кг плодове седмично от кофите — клиентите ти го виждат на бутилката.'",
        consequenceEn: "He leans in. This is a story his customers repost. He asks for a sample.",
        consequenceBg: "Той се навежда напред. Това е история, която клиентите му ще споделят. Иска мостра.",
        verdict: 'strong',
      },
      {
        labelEn: "'We can beat your supplier's price by 15%.'",
        labelBg: "'Можем да бием цената на доставчика ти с 15%.'",
        consequenceEn: "Now you're a commodity. He'll use your quote to squeeze his current guy.",
        consequenceBg: "Сега си commodity. Ще използва офертата ти, за да смачка сегашния си доставчик.",
        verdict: 'weak',
      },
    ],
    reflectionEn:
      "Which word in your own startup pitch is doing the least work? Rewrite one sentence so a stranger would repeat it.",
    reflectionBg:
      "Коя дума в собствения ти pitch работи най-малко? Пренапиши едно изречение така, че непознат да го повтори.",
    applyEn:
      "In the next 24 hours: say your one-sentence pitch to 3 people who are NOT in your target market. If they can repeat it back a minute later, keep it. If not, cut a word and try again.",
    applyBg:
      "В следващите 24 часа: кажи едно-изреченския си pitch на 3 души, които НЕ са в целевия ти пазар. Ако могат да го повторят след минута — задръж го. Ако не — махни дума и опитай пак.",
  },

  {
    subModuleId: 'marketing-funnels',
    storyEn:
      "Ivan runs Instagram ads for his handmade leather wallets. 12,000 views, 400 clicks, 3 sales. He's ready to blame the ad. His cousin says 'boost it more'.",
    storyBg:
      "Иван върти реклами в Instagram за ръчно изработени кожени портфейли. 12 000 показвания, 400 клика, 3 продажби. Готов е да обвини рекламата. Братовчед му казва 'бустни го още'.",
    decisionPromptEn: "Where should Ivan look FIRST?",
    decisionPromptBg: "Къде трябва Иван да погледне ПЪРВО?",
    options: [
      {
        labelEn: "Double the ad budget — get to 24,000 views.",
        labelBg: "Удвои рекламния бюджет — до 24 000 показвания.",
        consequenceEn: "You'll get ~6 sales instead of 3. Same broken funnel, more expensive.",
        consequenceBg: "Ще получиш ~6 продажби вместо 3. Същият счупен фуния, но по-скъп.",
        verdict: 'weak',
      },
      {
        labelEn: "Open the landing page on your own phone as if you'd never seen it.",
        labelBg: "Отвори landing страницата на своя телефон, все едно я виждаш за пръв път.",
        consequenceEn: "You find checkout takes 6 taps and asks for a company VAT. You fix it in one afternoon.",
        consequenceBg: "Откриваш, че checkout-ът е 6 тапа и иска ДДС номер. Оправяш го за един следобед.",
        verdict: 'strong',
      },
      {
        labelEn: "Change the ad photo.",
        labelBg: "Смени снимката на рекламата.",
        consequenceEn: "Might help. But 400 people already said yes to the ad — they said no to the site.",
        consequenceBg: "Може да помогне. Но 400 души вече казаха 'да' на рекламата — казаха 'не' на сайта.",
        verdict: 'tradeoff',
      },
    ],
    reflectionEn:
      "In your funnel, which step do you have zero data on right now? What's the cheapest way to look at it tomorrow?",
    reflectionBg:
      "В твоята фуния — за коя стъпка нямаш никакви данни в момента? Кой е най-евтиният начин да я видиш утре?",
    applyEn:
      "Screen-record yourself buying your own product on your phone. Every hesitation you feel = a real fix. Ship one of them this week.",
    applyBg:
      "Запиши екрана си, докато купуваш собствения си продукт от телефона. Всяко колебание, което усетиш = реален фикс. Пусни един от тях тази седмица.",
  },

  /* ── AI for Business ─────────────────────────────────────────────────── */
  {
    subModuleId: 'ai-prompting-basics',
    storyEn:
      "Alex works at a school events team. Their principal wants a newsletter draft by 5pm. Alex opens ChatGPT and types: 'Write a school newsletter'. Gets back three paragraphs of generic mush.",
    storyBg:
      "Алекс е в отбор за училищни събития. Директорът иска чернова на newsletter до 17:00. Алекс отваря ChatGPT и пише: 'Напиши училищен newsletter'. Получава три параграфа обща каша.",
    decisionPromptEn: "What's the ONE thing missing from Alex's prompt?",
    decisionPromptBg: "Кое е ЕДНОТО нещо, което липсва в prompt-а на Алекс?",
    options: [
      {
        labelEn: "A more polite tone ('please write...').",
        labelBg: "По-учтив тон ('моля, напиши...').",
        consequenceEn: "The model doesn't care. Politeness doesn't change output quality.",
        consequenceBg: "На модела не му пука. Учтивостта не сменя качеството.",
        verdict: 'weak',
      },
      {
        labelEn: "Context: audience, length, tone, 2 things to include, 1 thing to avoid.",
        labelBg: "Контекст: аудитория, дължина, тон, 2 неща за включване, 1 нещо за избягване.",
        consequenceEn: "Draft comes back specific enough to edit in 5 minutes instead of rewrite.",
        consequenceBg: "Черновата се връща достатъчно конкретна, за да я редактираш за 5 мин, а не да я пишеш наново.",
        verdict: 'strong',
      },
      {
        labelEn: "A bigger model.",
        labelBg: "По-голям модел.",
        consequenceEn: "Same vague prompt = same vague answer, just slower and more expensive.",
        consequenceBg: "Същият мъгляв prompt = същият мъгляв отговор, само по-бавен и по-скъп.",
        verdict: 'weak',
      },
    ],
    reflectionEn:
      "Look at your last AI prompt. If a new intern read it with zero context, could they do the task? If no — what would you add?",
    reflectionBg:
      "Виж последния си prompt към AI. Ако нов стажант го прочете без контекст, може ли да свърши задачата? Ако не — какво би добавил?",
    applyEn:
      "Pick one repetitive task this week. Write ONE prompt for it that includes: role, audience, format, 2 examples, 1 constraint. Save it. Reuse it 3 times.",
    applyBg:
      "Избери една повтаряща се задача тази седмица. Напиши ЕДИН prompt с: роля, аудитория, формат, 2 примера, 1 ограничение. Запази го. Използвай го 3 пъти.",
  },

  /* ── Finance & Unit Economics ────────────────────────────────────────── */
  {
    subModuleId: 'finance-unit-economics',
    storyEn:
      "Elena sells handmade candles online. Each candle: materials 4лв, shipping 5лв, packaging 1лв, ad cost per sale 6лв. She sells them for 15лв and celebrates every order. Her bank account keeps shrinking.",
    storyBg:
      "Елена продава ръчни свещи онлайн. Всяка свещ: материали 4лв, доставка 5лв, опаковка 1лв, реклама на продажба 6лв. Продава ги за 15лв и празнува всяка поръчка. Банковата ѝ сметка се топи.",
    decisionPromptEn: "What should Elena do this week?",
    decisionPromptBg: "Какво трябва да направи Елена тази седмица?",
    options: [
      {
        labelEn: "Sell more candles — volume will fix it.",
        labelBg: "Продавай повече свещи — обемът ще оправи всичко.",
        consequenceEn: "You lose 1лв on every candle. More candles = more losses. Faster bankruptcy.",
        consequenceBg: "Губиш 1лв на свещ. Повече свещи = повече загуби. По-бърз фалит.",
        verdict: 'weak',
      },
      {
        labelEn: "Raise price to 22лв and test if 3 in 10 people still buy.",
        labelBg: "Вдигни цената на 22лв и тествай дали 3 от 10 души още купуват.",
        consequenceEn: "Even at half the volume, you make real profit per candle for the first time.",
        consequenceBg: "Дори при половин обем — за пръв път имаш реална печалба на свещ.",
        verdict: 'strong',
      },
      {
        labelEn: "Cheapen the packaging.",
        labelBg: "Направи опаковката по-евтина.",
        consequenceEn: "Saves 40 стотинки. Doesn't fix a 1лв loss. Also hurts the gift-buyer segment.",
        consequenceBg: "Спестява 40 стотинки. Не оправя загуба от 1лв. Освен това ощетява подарък-купувачите.",
        verdict: 'tradeoff',
      },
    ],
    reflectionEn:
      "For your own product — write your unit margin (price minus every variable cost per sale). If it's negative, no marketing budget will save you. What's your real number?",
    reflectionBg:
      "За твоя продукт — напиши unit margin (цена минус всички променливи разходи на продажба). Ако е отрицателен, никой рекламен бюджет няма да те спаси. Кое е реалното ти число?",
    applyEn:
      "Take one product. On paper, list every single cost that scales with a sale (materials, shipping, packaging, fees, ad cost). Subtract from price. Do this before you launch anything else.",
    applyBg:
      "Вземи един продукт. На хартия изброй всеки разход, който расте с всяка продажба (материали, доставка, опаковка, такси, реклама). Извади го от цената. Направи това преди да пускаш каквото и да е друго.",
  },

  /* ── Project Management ──────────────────────────────────────────────── */
  {
    subModuleId: 'pm-iron-triangle',
    storyEn:
      "Rado's team promised a demo for a school hackathon in 2 weeks. Halfway through, a teacher asks for 'just one more feature — parent notifications'. Rado wants to say yes. His designer is already sleeping 4 hours a night.",
    storyBg:
      "Отборът на Радо обеща демо за училищен хакатон след 2 седмици. По средата, учител моли за 'само една функция още — известия за родители'. Радо иска да каже да. Дизайнерът му спи по 4 часа.",
    decisionPromptEn: "What's Rado's honest move?",
    decisionPromptBg: "Кой е честният ход на Радо?",
    options: [
      {
        labelEn: "Say yes and 'push through'.",
        labelBg: "Кажи да и 'прегризи'.",
        consequenceEn: "Demo ships buggy, designer quits, teacher didn't actually need it for the demo.",
        consequenceBg: "Демото е бъгаво, дизайнерът напуска, учителят даже не му е трябвало за демото.",
        verdict: 'weak',
      },
      {
        labelEn: "'Yes — but the demo date moves by a week, OR we cut the leaderboard screen.' Let them choose.",
        labelBg: "'Да — но датата се мести с седмица, ИЛИ махаме leaderboard екрана.' Остави ги да избират.",
        consequenceEn: "Teacher picks the smaller cut. Now everyone owns the tradeoff, not just Rado.",
        consequenceBg: "Учителят избира по-малкото. Сега компромисът е общ, не само на Радо.",
        verdict: 'strong',
      },
      {
        labelEn: "Just say no.",
        labelBg: "Просто кажи не.",
        consequenceEn: "Protects the team, but you didn't teach the teacher what a real request costs.",
        consequenceBg: "Пази отбора, но не научи учителя колко струва реална заявка.",
        verdict: 'tradeoff',
      },
    ],
    reflectionEn:
      "Last time scope, time, or quality slipped on your project — which of the three did you silently sacrifice? Was that your call to make alone?",
    reflectionBg:
      "Последният път, когато обхват, време или качество се промени в твой проект — кое от трите пожертва тихо? Твоят ли беше този избор?",
    applyEn:
      "Next scope-creep request you get this week: reply with 'yes if we move X, or drop Y — which?' Say it out loud once before you type it.",
    applyBg:
      "Следващата заявка за scope-creep тази седмица: отговори с 'да, ако преместим X, или махнем Y — кое?' Кажи го на глас веднъж, преди да го напишеш.",
  },

  /* ── Digital Marketing (funnel-adjacent, distinct story) ─────────────── */
  {
    subModuleId: 'digital-marketing-channels',
    storyEn:
      "Nia has a language-learning app for teens. Budget: 200лв/month. Her advisor says 'do TikTok, Instagram, YouTube Shorts, and Google Ads — omnichannel'. Nia has 5 hours a week to spend on marketing.",
    storyBg:
      "Ния има app за учене на езици за тийнейджъри. Бюджет: 200лв/мес. Съветникът ѝ казва 'прави TikTok, Instagram, YouTube Shorts и Google Ads — омниканално'. Ния има 5 часа седмично за маркетинг.",
    decisionPromptEn: "What should Nia actually do?",
    decisionPromptBg: "Какво трябва Ния реално да направи?",
    options: [
      {
        labelEn: "Split 5 hours across all 4 channels.",
        labelBg: "Раздели 5 часа между всички 4 канала.",
        consequenceEn: "1 hour per channel = 4 mediocre channels. No algorithm learns you. Nothing works.",
        consequenceBg: "1 час на канал = 4 посредствени канала. Никой алгоритъм не те научава. Нищо не тръгва.",
        verdict: 'weak',
      },
      {
        labelEn: "Pick ONE channel her actual users already scroll on. Post 4x/week for 6 weeks. Measure. Then decide.",
        labelBg: "Избери ЕДИН канал, на който реалните ѝ юзъри вече скролват. Постни 4х/седмица за 6 седмици. Измери. После решавай.",
        consequenceEn: "By week 6 she has real signal on 1 channel. That signal beats 4 guesses.",
        consequenceBg: "До 6-та седмица има реален сигнал за 1 канал. Този сигнал бие 4 предположения.",
        verdict: 'strong',
      },
      {
        labelEn: "Hire a freelancer with the 200лв.",
        labelBg: "Нает freelancer със 200лв.",
        consequenceEn: "200лв buys ~4 hours of anyone decent. They'll leave you with content nobody owns.",
        consequenceBg: "200лв стигат за ~4 часа на приличен човек. Оставят те със съдържание, което никой не поддържа.",
        verdict: 'weak',
      },
    ],
    reflectionEn:
      "How many marketing channels are you 'sort of' doing right now? Which one would hurt least if you paused it for a month?",
    reflectionBg:
      "Колко маркетинг канала правиш 'горе-долу' в момента? Кой от тях би заболял най-малко, ако го спреш за месец?",
    applyEn:
      "Pick one channel. Pause the rest. Set a 6-week test with one number to watch (followers, clicks, DMs — pick ONE). Put it on your calendar.",
    applyBg:
      "Избери един канал. Спри останалите. Направи 6-седмичен тест с ЕДНО число за следене (последователи, кликове, DMs — избери ЕДНО). Сложи го в календара.",
  },
];

/** Lookup by sub-module id. Returns undefined when no micro-lesson exists yet. */
export function getMicroLesson(subModuleId: string): MicroLesson | undefined {
  return MICROLESSONS_2026.find(m => m.subModuleId === subModuleId);
}
