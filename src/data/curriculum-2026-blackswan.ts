/**
 * Curriculum 2026-27 · Pilot module — "Черният лебед за предприемачи"
 *
 * Phase 1 pilot: canonical Kiki voice. Two lessons inside the
 * `core-digital-innovation` pathway (angle A + angle B, as picked by Kiki).
 *
 *   Lesson 1 — "Защо планът ти ще се счупи" (angle A: Black Swan + MVP)
 *   Lesson 2 — "Антикрехкост" (angle B: build things that get stronger from chaos)
 *
 * Ships:
 *   - 2 SubModules (theory + framework + real 2020-2026 example + reflection)
 *   - 2 TEACR scenarios (Decide -> Consequence)
 *   - 2 MicroLessons (Story -> Decide -> Reflect -> Apply)
 *   - 3 Dictionary terms (Black Swan, Antifragile, Optionality)
 *
 * Voice rules for this pilot (do NOT drift):
 *   - Bulgarian uses informal "ти", short sentences, no em-dashes.
 *   - No corporate slogans, no "unlock your potential".
 *   - Every idea ends with a move the learner can do this week.
 *   - Examples are 2020-2026 companies students actually know.
 */

import type { SubModule } from './curriculum-2026-content';
import type { TEACRScenario } from './curriculum-2026-teacr';
import type { MicroLesson } from './curriculum-2026-microlessons';
import type { DictionaryTerm } from './dictionary-terms';

/* ─────────────────────────── Sub-modules ─────────────────────────── */

export const BLACKSWAN_SUBMODULES: SubModule[] = [
  {
    id: 'blackswan-why-plans-break',
    pathwayId: 'core-digital-innovation',
    level: 'foundation',
    titleEn: 'Why your plan will break',
    titleBg: 'Защо планът ти ще се счупи',
    summaryEn:
      'The events that decide your future are the ones you did not put in the plan. Stop predicting. Start staying ready.',
    summaryBg:
      'Събитията, които решават бъдещето ти, са тези, които не си сложил в плана. Спри да гадаеш. Започни да си готов.',
    theoryEn:
      "Nassim Taleb calls them Black Swans: rare events, huge impact, obvious in hindsight. COVID in 2020. ChatGPT in late 2022. The war in Ukraine. Nobody had them in the Q4 slide. And yet those three moments decided which companies died and which ones exploded.\n\nYour 3-year plan is a story you tell yourself so you feel in control. The market does not read it. The moment something big and unexpected hits, the founders who win are not the ones with the smartest forecast. They are the ones who bet small, learned fast, and had options ready. That is the whole logic behind MVP, behind Lean, behind pivoting. It is not a trend. It is a defense against a world you cannot predict.",
    theoryBg:
      "Насим Талеб ги нарича Черни лебеди: редки събития, огромно влияние, очевидни едва след като станат. COVID през 2020. ChatGPT в края на 2022. Войната в Украйна. Никой не ги е сложил в Q4 презентацията. И точно тези три момента решиха кои компании умряха и кои избухнаха.\n\n3-годишният ти план е история, която си разказваш, за да си спокоен. Пазарът не я чете. В момента, в който удари нещо голямо и неочаквано, печелят не тези с най-умната прогноза. Печелят тези, които са залагали малко, учели са бързо и са имали готови опции. Това е цялата логика на MVP, на Lean, на pivot-a. Не е мода. Това е защита срещу свят, който не можеш да предвидиш.",
    frameworkEn:
      "Barbell strategy (Taleb): put ~85% of your effort/money into something very safe (skills, cash, day job), and ~15% into a few small, wildly asymmetric bets (an MVP, a side project, an experiment). Never sit in the middle. The middle looks 'reasonable' but has no upside and no protection.",
    frameworkBg:
      "Barbell стратегия (Талеб): ~85% от усилието/парите ти отиват в нещо много сигурно (умения, кеш, основна работа), и ~15% в няколко малки залога с луд потенциал (MVP, side project, експеримент). Никога в средата. Средата изглежда „разумно“, но няма нито таван, нито защита.",
    exampleEn:
      "March 2020. Airbnb watches 80% of bookings disappear in 8 weeks. The 5-year plan is dead. In 6 weeks they rebuild the product around 'stay near home' and long-term rentals. Same infrastructure, different bet. They IPO the same year at $47B. Not because they predicted COVID. Because they could move.",
    exampleBg:
      "Март 2020. Airbnb гледа как 80% от резервациите изчезват за 8 седмици. 5-годишният план е мъртъв. За 6 седмици преправят продукта около „престой близо до дома“ и дългосрочни наеми. Същата инфраструктура, различен залог. Пускат IPO същата година на 47 млрд. долара. Не защото са предвидили COVID. Защото са можели да се движат.",
    reflectionEn:
      "Look at what you are working on. If a Black Swan hit tomorrow (school closed, no internet for a week, your main tool got banned), which piece of your plan survives, and which piece you never touch again?",
    reflectionBg:
      "Погледни това, което работиш в момента. Ако утре удари Черен лебед (училището затвори, седмица без интернет, любимият ти инструмент бъде забранен), коя част от плана ти оцелява и коя вече няма да пипнеш?",
    estMinutes: 7,
    relatedTerms: ['Black Swan', 'Optionality', 'MVP'],
  },
  {
    id: 'blackswan-antifragile',
    pathwayId: 'core-digital-innovation',
    level: 'intermediate',
    titleEn: 'Antifragile: get stronger from chaos',
    titleBg: 'Антикрехкост: ставай по-силен от хаоса',
    summaryEn:
      'Robust survives the hit. Antifragile grows from it. Learn to build projects (and yourself) that need pressure to become good.',
    summaryBg:
      'Устойчивото оцелява удара. Антикрехкото расте от него. Учиш се да строиш проекти (и себе си), които имат нужда от натиск, за да станат добри.',
    theoryEn:
      "Fragile things break under stress: a glass, a startup with one big customer, a plan built for perfect weather. Robust things survive stress but do not change: a rock, a corporate job at a stable company. Antifragile things get better under stress: your muscles after training, a founder after a rejected pitch, a product after real users abuse it.\n\nMost of school teaches you to avoid mistakes. Building anything real teaches you the opposite: seek small, cheap, recoverable failures on purpose. Every 'this did not work' is data your smarter competitor does not have yet. The goal is not zero mistakes. The goal is a system where each mistake makes the next attempt sharper.",
    theoryBg:
      "Крехките неща се чупят от натиск: чаша, стартъп с един голям клиент, план направен за идеално време. Устойчивите преживяват натиска, но не се променят: камък, работа в стабилна корпорация. Антикрехките неща се подобряват от натиск: мускулите ти след тренировка, фаундър след отхвърлен pitch, продукт след като реални потребители го малтретират.\n\nУчилището те учи да избягваш грешки. Правенето на нещо реално те учи на обратното: търсиш малки, евтини, поправими грешки нарочно. Всяко „това не проработи“ е информация, която по-умният ти конкурент още няма. Целта не е нула грешки. Целта е система, в която всяка грешка прави следващия опит по-остър.",
    frameworkEn:
      "The 3-mode test. Before you commit to anything (a decision, a project, a job), ask: 'If this goes wrong, do I break, do I survive unchanged, or do I learn and get stronger?' Fragile = say no. Robust = fine, but boring. Antifragile = say yes, even if scary.",
    frameworkBg:
      "Тестът на 3-те режима. Преди да се закачиш за каквото и да е (решение, проект, работа), питаш: „Ако това се обърка, чупя ли се, оцелявам без промяна, или се уча и ставам по-силен?“ Крехко = не. Устойчиво = ок, но скучно. Антикрехко = да, дори да е страшно.",
    exampleEn:
      "2008 crisis. Every other retailer freezes hiring, cuts R&D, waits it out. Amazon does the opposite: they pour cash into AWS while nobody is watching. By the time competitors wake up in 2011, AWS is a monopoly they cannot catch. The crisis did not hurt Amazon. It fed them. Same story again in 2020 with e-commerce.",
    exampleBg:
      "Кризата 2008. Всички други търговци замразяват наеми, режат R&D, чакат да отмине. Amazon прави обратното: наливат кеш в AWS, докато никой не гледа. Когато конкурентите се събуждат през 2011, AWS вече е монопол, който не могат да догонят. Кризата не нарани Amazon. Тя ги нахрани. Същата история пак през 2020 с e-commerce.",
    reflectionEn:
      "Name one thing in your life you have been avoiding because it feels risky. Now ask: is it actually fragile (you break), or antifragile (you get sharper)? What is the smallest version you could try this week?",
    reflectionBg:
      "Назови едно нещо в живота ти, което избягваш, защото ти изглежда рисковано. Сега питай: то реално крехко ли е (чупиш се) или антикрехко (ставаш по-остър)? Коя най-малка версия можеш да пробваш тази седмица?",
    estMinutes: 7,
    relatedTerms: ['Antifragile', 'Optionality', 'Black Swan'],
  },
];

/* ─────────────────────────── TEACR scenarios ─────────────────────────── */

export const BLACKSWAN_TEACR: TEACRScenario[] = [
  {
    targetId: 'blackswan-why-plans-break',
    promptEn:
      "It is Monday morning. Overnight the AI tool your whole side project depends on changed its pricing and killed the free tier. Your 3-month launch plan is on fire. What is your very next move?",
    promptBg:
      "Понеделник сутрин. През нощта AI инструментът, от който зависи целият ти side project, смени цените и уби безплатния план. 3-месечният ти launch план гори. Кое е най-следващото ти действие?",
    options: [
      {
        id: 'stall',
        labelEn: 'Wait a week. Maybe they will roll it back after complaints.',
        labelBg: 'Изчакай седмица. Може да го върнат след оплакванията.',
        outcome: 'negative',
        consequenceEn:
          "You lose 7 days waiting for someone else to save your plan. They do not roll it back. Your launch date slips into a crowded month and momentum dies.",
        consequenceBg:
          "Губиш 7 дни в изчакване някой друг да ти спаси плана. Не го връщат. Launch датата се измества в претъпкан месец и инерцията умира.",
      },
      {
        id: 'options',
        labelEn: 'Spend 48 hours testing 2 alternative tools and 1 non-AI workaround.',
        labelBg: 'Отдели 48 часа да тестваш 2 алтернативни инструмента и 1 не-AI решение.',
        outcome: 'positive',
        consequenceEn:
          "You lose 2 days but end the week with 3 real options and honest cost numbers. Your plan is not dead. It just got a better spine.",
        consequenceBg:
          "Губиш 2 дни, но завършваш седмицата с 3 реални опции и честни цифри за цената. Планът не е мъртъв. Получи по-здрав гръбнак.",
      },
      {
        id: 'panic-rebuild',
        labelEn: 'Rewrite the whole product on a different stack this week.',
        labelBg: 'Пренапиши целия продукт на друг стек тази седмица.',
        outcome: 'negative',
        consequenceEn:
          "You over-react to one shock by burning your only advantage: focus. You end the week exhausted with a half-broken rebuild and no launch.",
        consequenceBg:
          "Реагираш прекалено на един шок, като изгаряш единственото си предимство: фокуса. Приключваш седмицата изтощен, с полусчупен rebuild и без launch.",
      },
    ],
  },
  {
    targetId: 'blackswan-antifragile',
    promptEn:
      "You show your MVP to 6 real users. 4 say 'meh'. 1 says it changed her week. 1 tells you exactly why she hates it. What do you do with this?",
    promptBg:
      "Показваш MVP-то на 6 реални потребители. 4 казват „окей“. 1 казва, че ѝ е променил седмицата. 1 ти казва точно защо го мрази. Какво правиш с това?",
    options: [
      {
        id: 'average',
        labelEn: 'Average the feedback and design for the middle.',
        labelBg: 'Усредни фийдбека и проектирай за средното.',
        outcome: 'negative',
        consequenceEn:
          "You build a beige product nobody loves. The 1 fan drifts away, the hater stays a hater, and the 4 'meh' users never come back.",
        consequenceBg:
          "Строиш беж продукт, който никой не обича. Единственият фен се разсейва, мразещият си остава такъв, а 4-те „окей“ не се връщат.",
      },
      {
        id: 'chase-fan',
        labelEn: 'Interview the 1 fan for 30 minutes and the hater for 30 minutes.',
        labelBg: 'Интервюирай фена 30 минути и мразещия 30 минути.',
        outcome: 'positive',
        consequenceEn:
          "The fan tells you the exact job you are solving. The hater tells you exactly who you are NOT for. Together they draw a sharper ICP than any survey.",
        consequenceBg:
          "Фенът ти казва точно каква задача решаваш. Мразещият ти казва точно за кого НЕ си. Заедно рисуват по-остър ICP от всяка анкета.",
      },
      {
        id: 'ignore-hater',
        labelEn: 'Ignore the hater. Negative feedback kills motivation.',
        labelBg: 'Игнорирай мразещия. Негативният фийдбек убива мотивацията.',
        outcome: 'negative',
        consequenceEn:
          "You throw away the most useful data you got all week. Every next 'hater' will teach the same lesson until you finally listen.",
        consequenceBg:
          "Изхвърляш най-полезните данни за седмицата. Всеки следващ „мразещ“ ще ти преподава същия урок, докато най-накрая слушаш.",
      },
    ],
  },
];

/* ─────────────────────────── Micro-lessons ─────────────────────────── */

export const BLACKSWAN_MICROLESSONS: MicroLesson[] = [
  {
    subModuleId: 'blackswan-why-plans-break',
    storyEn:
      "November 2022. Alex, 19, is 3 weeks from launching a paid tutoring startup. Google Docs plans, sales calls booked, price set. On November 30, ChatGPT drops. Free. Instant. Better at explaining chemistry than half his tutors. His whole positioning ('smart humans on demand') just aged 5 years overnight. He has one week before his first paid cohort starts.",
    storyBg:
      "Ноември 2022. Алекс, 19-годишен, е на 3 седмици от launch на платен tutoring стартъп. Планове в Google Docs, sales обаждания резервирани, цена фиксирана. На 30 ноември излиза ChatGPT. Безплатно. Мигновено. По-добро в обясняването на химия от половината му тюутори. Цялото му позициониране („умни хора при поискване“) остаря с 5 години за една нощ. Има една седмица преди първата платена група.",
    decisionPromptEn: "What should Alex do this week?",
    decisionPromptBg: "Какво трябва да направи Алекс тази седмица?",
    options: [
      {
        labelEn: "Cancel the launch. Take a month to rethink everything.",
        labelBg: "Отмени launch-a. Отдели месец да преосмисли всичко.",
        consequenceEn: "He loses momentum, the cohort of 12 who already paid, and his own belief. A month later the shock is even bigger and he is starting from further back.",
        consequenceBg: "Губи инерцията, групата от 12 души, които вече са платили, и собствената си вяра. Месец по-късно шокът е още по-голям и започва от още по-назад.",
        verdict: 'weak',
      },
      {
        labelEn: "Launch anyway. Change the hook to 'AI + human coach', drop price 30%, ship the first session on time.",
        labelBg: "Пусни launch-a. Смени hook-a на „AI + човешки коуч“, намали цената с 30%, задръж първата сесия навреме.",
        consequenceEn: "The cohort shows up. Two people churn. Ten stay and become his first real proof that a human coach on top of AI is worth more than either alone. This becomes the whole company.",
        consequenceBg: "Групата се появява. Двама си тръгват. Десет остават и стават първото му реално доказателство, че човешки коуч над AI струва повече от всеки поотделно. Това става цялата компания.",
        verdict: 'strong',
      },
      {
        labelEn: "Pretend ChatGPT is a fad. Keep the original pitch.",
        labelBg: "Прави се, че ChatGPT е моден каприз. Задръж оригиналния pitch.",
        consequenceEn: "By month 3 he is competing with a free tool his customers use daily. He loses the cohort and the momentum. He learned the wrong lesson: that reality was wrong.",
        consequenceBg: "До 3-ия месец се конкурира с безплатен инструмент, който клиентите му ползват всеки ден. Губи групата и инерцията. Научил е грешния урок: че реалността е сгрешила.",
        verdict: 'weak',
      },
    ],
    reflectionEn:
      "Which part of your current plan assumes the world stays exactly as it is today? What is the smallest version of that plan you could ship in 2 weeks so you find out?",
    reflectionBg:
      "Коя част от текущия ти план приема, че светът ще остане същият както днес? Коя е най-малката версия на този план, която можеш да пуснеш за 2 седмици, за да разбереш?",
    applyEn:
      "In the next 24 hours: write your current plan on one page. Cross out every sentence that starts with a prediction ('the market will…', 'users are going to…'). Whatever is left is the real plan. Send it to 1 person who will tell you the truth.",
    applyBg:
      "В следващите 24 часа: напиши текущия си план на една страница. Задраскай всяко изречение, което започва с прогноза („пазарът ще…“, „потребителите ще…“). Каквото остане е реалният план. Изпрати го на 1 човек, който ще ти каже истината.",
  },
  {
    subModuleId: 'blackswan-antifragile',
    storyEn:
      "Rita runs a 4-person content studio in Sofia. Her biggest client (60% of revenue) calls on a Tuesday to 'pause the contract'. She has 6 weeks of runway. Two of her people are already asking if they should look for jobs. Her first instinct is to pitch the same service to 20 similar clients, fast.",
    storyBg:
      "Рита води 4-членно content студио в София. Най-големият ѝ клиент (60% от приходите) звъни във вторник, за да „паузира договора“. Има 6 седмици runway. Двама от хората ѝ вече питат дали да си търсят работа. Първият ѝ инстинкт е бързо да питчне същата услуга на 20 подобни клиента.",
    decisionPromptEn: "What is the antifragile move here?",
    decisionPromptBg: "Кой е антикрехкият ход тук?",
    options: [
      {
        labelEn: "Chase 20 similar clients with the same service, same price.",
        labelBg: "Гони 20 подобни клиента със същата услуга, същата цена.",
        consequenceEn: "She sends 20 identical emails. 2 replies, 0 close in the 6 weeks she has. She just rebuilt the same fragile structure that broke: one service, one type of client.",
        consequenceBg: "Изпраща 20 еднакви имейла. 2 отговора, 0 сключени в 6-те седмици. Току-що възстанови същата крехка структура, която се счупи: една услуга, един тип клиент.",
        verdict: 'weak',
      },
      {
        labelEn: "Cut cost to 8 weeks runway, and use week 1 to package what she learned from the lost client into a paid audit sold to 5 new companies.",
        labelBg: "Свий разходите до 8 седмици runway и използвай седмица 1, за да опаковаш наученото от загубения клиент като платен audit, продаден на 5 нови компании.",
        consequenceEn: "The audit is a new, small offer she could never have shipped while the big client was paying. Three of the audits turn into monthly retainers. The shock forced her to invent the product that later becomes 40% of revenue.",
        consequenceBg: "Audit-ът е нова, малка оферта, която никога не би пуснала, докато големият клиент плащаше. 3 от audit-ите се превръщат в месечни договори. Шокът я принуди да измисли продукта, който по-късно става 40% от приходите.",
        verdict: 'strong',
      },
      {
        labelEn: "Fire 2 people immediately to extend runway to 12 weeks.",
        labelBg: "Уволни 2 души веднага, за да удължиш runway на 12 седмици.",
        consequenceEn: "She buys time but loses the exact skills she needs to invent a new offer. Runway feels safer, but the studio can only sell the old service the market just rejected.",
        consequenceBg: "Купува си време, но губи точно уменията, с които може да измисли нова оферта. Runway-ът изглежда по-сигурен, но студиото може да продава само старата услуга, която пазарът току-що отхвърли.",
        verdict: 'tradeoff',
      },
    ],
    reflectionEn:
      "Where in your work is 'losing one thing' catastrophic (fragile)? Where is 'losing one thing' actually a chance to invent a better version (antifragile)? Name one of each.",
    reflectionBg:
      "Къде в работата ти „загубата на едно нещо“ е катастрофа (крехко)? Къде „загубата на едно нещо“ всъщност е шанс да измислиш по-добра версия (антикрехко)? Назови по едно от двете.",
    applyEn:
      "In the next 24 hours: run the 3-mode test on your 3 biggest current decisions. Write next to each: Fragile / Robust / Antifragile. Keep only the ones that are at least Robust. Kill or redesign the Fragile ones this week.",
    applyBg:
      "В следващите 24 часа: пусни теста на 3-те режима върху 3-те ти най-големи текущи решения. До всяко напиши: Крехко / Устойчиво / Антикрехко. Задръж само тези, които са поне Устойчиви. Убий или преправи крехките тази седмица.",
  },
];

/* ─────────────────────────── Dictionary terms ─────────────────────────── */

export const BLACKSWAN_TERMS: DictionaryTerm[] = [
  {
    term: 'Black Swan',
    termBg: 'Черен лебед',
    category: 'Strategy',
    difficulty: 'intermediate',
    definition:
      "A rare, high-impact event nobody predicted, that seems obvious in hindsight. COVID-19 and ChatGPT are recent Black Swans. Concept from Nassim Taleb. The point is not to predict them, it is to build so you survive (and use) them.",
    definitionBg:
      "Рядко събитие с огромно влияние, което никой не е предвидил и което изглежда очевидно едва след като стане. COVID-19 и ChatGPT са скорошни Черни лебеди. Концепция на Насим Талеб. Смисълът не е да ги предвидиш, а да строиш така, че да ги преживееш (и да ги използваш).",
  },
  {
    term: 'Antifragile',
    termBg: 'Антикрехък',
    category: 'Strategy',
    difficulty: 'intermediate',
    definition:
      "The opposite of fragile. Not just 'survives stress' (that is robust). Actively gets stronger from stress, disorder, and small failures. Your muscles are antifragile. A startup that treats every rejected pitch as data is antifragile.",
    definitionBg:
      "Обратното на крехко. Не просто „преживява натиска“ (това е устойчиво). Активно става по-силно от натиск, безредие и малки грешки. Мускулите ти са антикрехки. Стартъп, който третира всеки отхвърлен pitch като данни, е антикрехък.",
  },
  {
    term: 'Optionality',
    termBg: 'Опционалност',
    category: 'Strategy',
    difficulty: 'intermediate',
    definition:
      "Having several small doors open, so when the world shifts you can walk through one of them fast. An MVP is optionality. Learning a new skill on the side is optionality. The practical opposite of 'betting everything on one plan'.",
    definitionBg:
      "Да имаш няколко малки отворени врати, така че когато светът се измести, да можеш бързо да минеш през една от тях. MVP е опционалност. Да учиш ново умение отстрани е опционалност. Практическото обратно на „залагам всичко на един план“.",
  },
];
