/**
 * Curriculum 2026–27 · Phase 2 content
 *
 * Expanded sub-modules for the three priority pathways:
 *   - Marketing Foundations       (marketing-foundations)
 *   - AI for Business             (ai-for-business)
 *   - Finance & Unit Economics    (finance-unit-economics)
 *
 * Content is additive. Existing modules in `learning-modules.ts` are not
 * modified — these are lightweight sub-modules referenced from the pathway
 * manifest and rendered by future Phase 3 UI. Nothing here touches the DB.
 */

import type { PathwayLevel } from './curriculum-2026';

export interface SubModule {
  /** Stable id: `<pathway>-<slug>`. */
  id: string;
  pathwayId: string;
  level: PathwayLevel;
  titleEn: string;
  titleBg: string;
  summaryEn: string;
  summaryBg: string;
  /** Core theory in 2–5 short paragraphs. */
  theoryEn: string;
  theoryBg: string;
  /** Concrete named framework the learner will apply. */
  frameworkEn: string;
  frameworkBg: string;
  /** Real-world example (name + 2-sentence summary). */
  exampleEn: string;
  exampleBg: string;
  /** One reflective / provocative prompt to close the loop. */
  reflectionEn: string;
  reflectionBg: string;
  /** Estimated minutes to complete. */
  estMinutes: number;
  /** Dictionary term slugs (English) surfaced alongside this sub-module. */
  relatedTerms: string[];
}

/* ─────────────────────────── Marketing Foundations ─────────────────────────── */

export const MARKETING_SUBMODULES: SubModule[] = [
  {
    id: 'marketing-positioning',
    pathwayId: 'marketing-foundations',
    level: 'foundation',
    titleEn: 'Positioning',
    titleBg: 'Позициониране',
    summaryEn: 'Own a distinct place in the customer\'s mind — before you spend a cent on ads.',
    summaryBg: 'Заеми уникално място в съзнанието на клиента — преди да похарчиш и стотинка за реклама.',
    theoryEn:
      'Positioning is the one-sentence answer to: "Who is this for, what does it do better than anything else, and why should I care today?" Weak positioning forces every ad, page, and demo to over-explain. Strong positioning makes the right customers self-identify in seconds. It is a decision, not a slogan.',
    theoryBg:
      'Позиционирането е отговорът в едно изречение на: „За кого е това, какво прави по-добре от всичко друго и защо трябва да ме интересува днес?" Слабото позициониране кара всяка реклама, страница и демо да обяснява прекалено много. Силното позициониране кара правилните клиенти да се разпознаят за секунди. Това е решение, не слоган.',
    frameworkEn:
      'April Dunford\'s 5-part positioning statement: (1) Competitive alternatives, (2) Unique attributes, (3) Value those attributes create, (4) Who cares the most, (5) Market category you belong in.',
    frameworkBg:
      'Позициониращо изявление в 5 части (April Dunford): (1) конкурентни алтернативи, (2) уникални характеристики, (3) стойност, която те създават, (4) кой се интересува най-много, (5) в коя пазарна категория си.',
    exampleEn:
      'Notion positioned against Google Docs + Trello + Confluence as "one workspace, connected docs" — targeting small remote teams tired of stitching 5 tools together.',
    exampleBg:
      'Notion се позиционира срещу Google Docs + Trello + Confluence като „едно работно пространство, свързани документи" — насочено към малки дистанционни екипи, уморени от съшиването на 5 инструмента.',
    reflectionEn:
      'If your product disappeared tomorrow, which competitor would your best 10 customers switch to — and why not the others?',
    reflectionBg:
      'Ако продуктът ти изчезне утре, към кой конкурент ще преминат най-добрите ти 10 клиенти — и защо не към другите?',
    estMinutes: 15,
    relatedTerms: ['Positioning', 'Category', 'ICP'],
  },
  {
    id: 'marketing-seo',
    pathwayId: 'marketing-foundations',
    level: 'foundation',
    titleEn: 'SEO Fundamentals',
    titleBg: 'Основи на SEO',
    summaryEn: 'Get found by people already searching for what you sell — for free, forever.',
    summaryBg: 'Бъди намиран от хора, които вече търсят това, което продаваш — безплатно, завинаги.',
    theoryEn:
      'SEO is the practice of matching search intent to helpful content. Google rewards pages that (a) answer a real query, (b) are technically crawlable, and (c) earn trust signals like links and repeat visits. In 2026 SEO also competes with AI Overviews — pages that are the clearest, most cited answer tend to appear in both.',
    theoryBg:
      'SEO е практиката да съпоставяш търсещото намерение с полезно съдържание. Google награждава страници, които (а) отговарят на реално запитване, (б) са технически проходими, (в) печелят доверителни сигнали като връзки и повторни посещения. През 2026 SEO се конкурира и с AI Overviews — най-ясните, най-цитираните страници се появяват и в двете.',
    frameworkEn:
      'Intent → Keyword → Page mapping: for every high-value query, decide the intent (informational / navigational / transactional), pick one primary keyword, and dedicate one page that fully answers it.',
    frameworkBg:
      'Съпоставяне намерение → ключова дума → страница: за всяко ценно запитване решаваш намерението (информационно / навигационно / транзакционно), избираш една основна ключова дума и посвещаваш една страница, която напълно го покрива.',
    exampleEn:
      'HubSpot built a $2B+ business on "content answering marketing questions" — one blog post per intent, deeply linked, updated for years.',
    exampleBg:
      'HubSpot изгради бизнес за над 2 млрд. долара върху „съдържание, което отговаря на маркетинг въпроси" — по един пост за всяко намерение, дълбоко свързани, обновявани с години.',
    reflectionEn:
      'What are 5 questions your ideal customer types into Google before they know your product exists?',
    reflectionBg:
      'Кои са 5 въпроса, които идеалният ти клиент пише в Google, преди изобщо да знае за продукта ти?',
    estMinutes: 20,
    relatedTerms: ['SEO', 'Keyword', 'Search Intent', 'Backlink'],
  },
  {
    id: 'marketing-content',
    pathwayId: 'marketing-foundations',
    level: 'foundation',
    titleEn: 'Content Marketing',
    titleBg: 'Съдържателен маркетинг',
    summaryEn: 'Teach for free what you sell — earn trust before you ask for the sale.',
    summaryBg: 'Учи безплатно това, което продаваш — печели доверие, преди да поискаш продажба.',
    theoryEn:
      'Content marketing works because buyers research before they buy. Publishing genuinely useful articles, videos, or tools puts your brand into their research phase. The best content is generous, specific, and cheap to produce relative to the trust it earns. Fluff scales — trust does not.',
    theoryBg:
      'Съдържателният маркетинг работи, защото купувачите проучват преди да купят. Публикуването на реално полезни статии, видеа или инструменти те поставя във фазата на проучване. Най-доброто съдържание е щедро, конкретно и евтино за производство спрямо доверието, което печели.',
    frameworkEn:
      'Jobs-To-Be-Done content grid: rows = customer job stages (aware, considering, deciding, using, advocating); columns = format (article, video, tool, template). Fill in one asset per cell.',
    frameworkBg:
      'Мрежа на съдържанието по JTBD: редове = етапи на клиентската работа (осъзнаване, обмисляне, решение, използване, застъпване); колони = формат (статия, видео, инструмент, шаблон). Попълни по един актив на клетка.',
    exampleEn:
      'Ahrefs built a $100M+ SEO tool business almost entirely on YouTube tutorials that give away the workflow their tool automates.',
    exampleBg:
      'Ahrefs изгради SEO бизнес за над 100 млн. долара почти изцяло чрез YouTube уроци, които раздават работния процес, който инструментът им автоматизира.',
    reflectionEn:
      'What is the one thing your customers pay experts to teach them, that you could teach for free?',
    reflectionBg:
      'Кое е нещото, за което клиентите ти плащат на експерти да ги научат, а ти можеш да го научиш безплатно?',
    estMinutes: 15,
    relatedTerms: ['Content Marketing', 'Editorial Calendar', 'Distribution'],
  },
  {
    id: 'marketing-paid',
    pathwayId: 'marketing-foundations',
    level: 'intermediate',
    titleEn: 'Paid Acquisition',
    titleBg: 'Платено привличане',
    summaryEn: 'Rent attention profitably — but only after your unit economics allow it.',
    summaryBg: 'Наемай внимание печелившо — но само след като юнит икономиката ти позволява.',
    theoryEn:
      'Paid ads let you buy customers at a known cost. That is powerful only if the customer\'s lifetime value clearly exceeds acquisition cost, including payback time. Most first-time founders scale paid too early, using debt-financed CAC to inflate growth that collapses when the ads stop.',
    theoryBg:
      'Платените реклами ти позволяват да купуваш клиенти на известна цена. Това е мощно само ако жизнената стойност на клиента ясно надвишава разхода за придобиване, включително срокът за откупуване. Повечето основатели скалират платено твърде рано.',
    frameworkEn:
      'The 3-gate rule: (1) LTV / CAC ≥ 3, (2) Payback < 12 months for B2B, < 3 months for consumer, (3) At least one organic channel already growing. If any gate fails, do not scale paid.',
    frameworkBg:
      'Правило на 3-те бариери: (1) LTV / CAC ≥ 3, (2) Откупуване < 12 месеца за B2B, < 3 месеца за B2C, (3) Поне един органичен канал вече расте. Ако някоя бариера не е минала — не скалирай платено.',
    exampleEn:
      'Casper burned hundreds of millions on paid ads with a payback longer than the mattress replacement cycle — the model never closed.',
    exampleBg:
      'Casper изгори стотици милиони в платени реклами с откупуване, по-дълго от цикъла на смяна на матрак — моделът никога не се затвори.',
    reflectionEn:
      'Given your current LTV and CAC estimates, what is the maximum you can pay per new customer without going broke?',
    reflectionBg:
      'При настоящите ти оценки за LTV и CAC — колко максимум можеш да платиш за нов клиент, без да фалираш?',
    estMinutes: 20,
    relatedTerms: ['CAC', 'LTV', 'ROAS', 'Attribution', 'Payback Period'],
  },
  {
    id: 'marketing-analytics',
    pathwayId: 'marketing-foundations',
    level: 'intermediate',
    titleEn: 'Marketing Analytics',
    titleBg: 'Маркетинг аналитика',
    summaryEn: 'Measure the few numbers that actually change your next decision.',
    summaryBg: 'Измервай малкото числа, които реално променят следващото ти решение.',
    theoryEn:
      'Vanity metrics (pageviews, followers, impressions) feel good but rarely change action. Actionable metrics — activation rate, week-2 retention, cost per qualified lead, contribution margin per channel — tell you what to do next. Every dashboard should trigger a decision or be deleted.',
    theoryBg:
      'Суетните метрики (посещения, последователи, импресии) звучат добре, но рядко променят действие. Действените метрики — активация, задържане седмица 2, цена на квалифициран контакт, принос на канал — ти казват какво следва да правиш.',
    frameworkEn:
      'AARRR pirate funnel: Acquisition → Activation → Retention → Referral → Revenue. Instrument one KPI per stage and fix the weakest one first.',
    frameworkBg:
      'Пиратска фуния AARRR: Придобиване → Активиране → Задържане → Препоръка → Приходи. Измервай един KPI на етап и поправяй първо най-слабия.',
    exampleEn:
      'Airbnb once found that hosts with professional photos got 2–3× bookings — a single activation metric change reshaped growth.',
    exampleBg:
      'Airbnb откри, че хостове с професионални снимки получават 2–3 пъти повече резервации — една промяна в активационната метрика преоформи растежа.',
    reflectionEn:
      'Which dashboard do you check most often, and when did it last change a decision you made?',
    reflectionBg:
      'Коя таблица гледаш най-често и кога за последно тя промени решение, което взе?',
    estMinutes: 15,
    relatedTerms: ['AARRR', 'Activation', 'Retention', 'Vanity Metric'],
  },
];

/* ─────────────────────────── AI for Business ─────────────────────────── */

export const AI_SUBMODULES: SubModule[] = [
  {
    id: 'ai-foundations',
    pathwayId: 'ai-for-business',
    level: 'foundation',
    titleEn: 'AI Foundations for Founders',
    titleBg: 'Основи на AI за основатели',
    summaryEn: 'Understand what modern AI can and can\'t do, in plain language.',
    summaryBg: 'Разбери какво може и не може съвременният AI, на прост език.',
    theoryEn:
      'Modern AI is mostly pattern prediction trained on massive data. Large Language Models predict the next word; image models predict the next pixel. This makes them brilliant at drafting, summarising, translating, and coding — and unreliable at facts, math, and anything outside their training. Treat AI as a fast, cheap junior teammate that needs review.',
    theoryBg:
      'Съвременният AI е основно предсказване на модели, обучено върху огромни данни. Големите езикови модели предсказват следващата дума; моделите за изображения — следващия пиксел. Затова са отлични в чернови, обобщения, превод и код — и ненадеждни за факти, математика и всичко извън обучението им.',
    frameworkEn:
      'The "Automate / Augment / Avoid" grid: for every task, decide if AI should replace the human (automate), assist them (augment), or stay out (avoid — legal, medical, or reputational risk).',
    frameworkBg:
      'Мрежа „Автоматизирай / Подсили / Избягвай": за всяка задача решаваш дали AI да замени човека, да го подпомага или да стои настрана.',
    exampleEn:
      'Klarna cut customer-service headcount using AI for tier-1 queries, then paused expansion when quality on complex cases dropped — a classic Augment > Automate lesson.',
    exampleBg:
      'Klarna намали клиентския екип с AI за прости запитвания, после спря разширяването, когато качеството по сложни казуси падна — класически урок „Подсили > Автоматизирай".',
    reflectionEn:
      'List 3 tasks in your startup where being 80% correct in 5 seconds beats being 100% correct in 5 hours.',
    reflectionBg:
      'Изброй 3 задачи в стартъпа ти, при които 80% верен резултат за 5 секунди бие 100% верен за 5 часа.',
    estMinutes: 15,
    relatedTerms: ['LLM', 'Foundation Model', 'Hallucination', 'Fine-tuning'],
  },
  {
    id: 'ai-genai',
    pathwayId: 'ai-for-business',
    level: 'foundation',
    titleEn: 'Generative AI in Practice',
    titleBg: 'Генеративен AI на практика',
    summaryEn: 'Use GenAI to ship faster: drafts, code, images, and customer support.',
    summaryBg: 'Използвай GenAI, за да доставяш по-бързо: чернови, код, изображения, поддръжка.',
    theoryEn:
      'Generative AI turns a blank page into a first draft in seconds. The winners are teams that build workflows around it — templates, prompt libraries, review checklists — not those who use it ad hoc. GenAI compresses "time to first version" from hours to minutes, letting you test 10× more ideas.',
    theoryBg:
      'Генеративният AI превръща бялата страница в чернова за секунди. Печелят екипите, които изграждат работни процеси около него — шаблони, библиотеки с промптове, чеклистове — не тези, които го използват произволно.',
    frameworkEn:
      'The Draft-Refine-Verify loop: (1) let AI produce a rough draft, (2) refine with structured prompts, (3) verify facts, numbers, and tone with a human before publishing.',
    frameworkBg:
      'Цикъл Чернова-Прецизиране-Проверка: (1) AI прави груба чернова, (2) прецизираш със структурирани промптове, (3) човек проверява факти, числа и тон преди публикуване.',
    exampleEn:
      'Duolingo Max uses GPT-based role-plays and explanations, replacing thousands of hand-authored dialogues.',
    exampleBg:
      'Duolingo Max използва GPT-базирани ролеви игри и обяснения, заменяйки хиляди ръчно написани диалози.',
    reflectionEn:
      'Pick one internal document (job post, sales email, PRD). Draft it in AI in under 5 minutes, then note what a human still had to change.',
    reflectionBg:
      'Избери един вътрешен документ. Направи го с AI за под 5 минути и запиши какво човек трябваше да промени.',
    estMinutes: 20,
    relatedTerms: ['Generative AI', 'Prompt', 'Prompt Library', 'Human-in-the-loop'],
  },
  {
    id: 'ai-prompting',
    pathwayId: 'ai-for-business',
    level: 'intermediate',
    titleEn: 'Prompt Design',
    titleBg: 'Дизайн на промптове',
    summaryEn: 'Get 10× better output from the same model by asking better questions.',
    summaryBg: 'Получи 10× по-добри резултати от същия модел, като питаш по-добре.',
    theoryEn:
      'A prompt is a specification, not a wish. The clearer you are about the role, task, constraints, examples, and format, the more consistent the output. Prompt design is a hiring problem: you\'re briefing a new intern who forgets everything between chats.',
    theoryBg:
      'Промптът е спецификация, не желание. Колкото по-ясно опишеш роля, задача, ограничения, примери и формат, толкова по-стабилен е резултатът.',
    frameworkEn:
      'RTCEF prompt template — Role, Task, Context, Examples, Format. Fill all five slots before sending anything you care about.',
    frameworkBg:
      'Шаблон RTCEF за промптове — Роля, Задача, Контекст, Примери, Формат. Попълвай и петте, преди да изпращаш нещо важно.',
    exampleEn:
      'GitHub Copilot\'s underlying prompts inject repo context, style rules, and few-shot examples — that is why suggestions feel "in-house" instead of generic.',
    exampleBg:
      'Промптовете зад GitHub Copilot добавят контекст на репото, стилови правила и няколко примера — затова предложенията изглеждат „вътрешни", а не общи.',
    reflectionEn:
      'Rewrite your last AI request using the RTCEF template. What information were you missing?',
    reflectionBg:
      'Пренапиши последната си AI молба чрез RTCEF. Каква информация ти липсваше?',
    estMinutes: 20,
    relatedTerms: ['Prompt', 'Few-shot', 'System Prompt', 'Context Window'],
  },
  {
    id: 'ai-ethics',
    pathwayId: 'ai-for-business',
    level: 'intermediate',
    titleEn: 'AI Ethics & EU AI Act',
    titleBg: 'AI етика и EU AI Act',
    summaryEn: 'Build with AI in ways that respect users, the law, and your future self.',
    summaryBg: 'Изграждай с AI по начин, който уважава потребителите, закона и бъдещето ти.',
    theoryEn:
      'AI systems can amplify bias, leak private data, and produce confident nonsense. The EU AI Act (fully in force 2026) classifies systems by risk and bans some outright (e.g. social scoring). Founders who ignore this ship features that later have to be pulled — an expensive lesson.',
    theoryBg:
      'AI системите могат да усилват пристрастия, да изтичат лични данни и да произвеждат уверени глупости. EU AI Act (в сила 2026) класифицира системите по риск и забранява някои (напр. социален рейтинг).',
    frameworkEn:
      'Risk triage before shipping: (1) What data goes in, (2) Who is affected by the output, (3) Is a human in the loop for high-impact decisions, (4) Which EU AI Act tier applies (minimal / limited / high / unacceptable)?',
    frameworkBg:
      'Триаж на риска преди пускане: (1) Какви данни влизат, (2) Кой е засегнат от резултата, (3) Има ли човек в цикъла за важни решения, (4) В коя категория попада (минимален / ограничен / висок / недопустим)?',
    exampleEn:
      'The Dutch tax authority\'s benefit-fraud algorithm falsely accused thousands of parents — the political fallout is still ongoing and shaped the AI Act.',
    exampleBg:
      'Алгоритъмът за помощи на нидерландската данъчна фалшиво обвини хиляди родители — политическите последствия все още продължават и оформиха AI Act.',
    reflectionEn:
      'For your current AI feature, who would be harmed if it were wrong 5% of the time? Is that acceptable?',
    reflectionBg:
      'За текущата ти AI функция — кой би пострадал, ако греши в 5% от случаите? Приемливо ли е това?',
    estMinutes: 20,
    relatedTerms: ['EU AI Act', 'Algorithmic Bias', 'Data Governance', 'Human-in-the-loop'],
  },
  {
    id: 'ai-agents',
    pathwayId: 'ai-for-business',
    level: 'advanced',
    titleEn: 'AI Agents & Automation',
    titleBg: 'AI агенти и автоматизация',
    summaryEn: 'When to move from chat to multi-step agents that take actions.',
    summaryBg: 'Кога да преминеш от чат към многостъпкови агенти, които действат.',
    theoryEn:
      'An AI agent doesn\'t just answer — it plans, calls tools, and iterates until a goal is reached. Powerful, but harder to control: cost, latency, and failure modes all multiply. Start with tightly scoped agents (one job, few tools, human approval on writes) before letting anything roam.',
    theoryBg:
      'AI агент не просто отговаря — той планира, извиква инструменти и итерира, докато постигне целта. Мощно, но по-трудно за контрол.',
    frameworkEn:
      'The Scoped-Agent checklist: single job, ≤ 5 tools, deterministic exit condition, cost cap per run, mandatory human approval before any external write.',
    frameworkBg:
      'Чеклист за ограничен агент: една задача, ≤ 5 инструмента, детерминистично условие за спиране, лимит на разхода, задължително човешко одобрение преди външен запис.',
    exampleEn:
      'Shopify\'s "Sidekick" agent is scoped to store operations — it can draft product copy or set discounts, but sensitive actions require a human click.',
    exampleBg:
      'Агентът „Sidekick" на Shopify е ограничен до магазинни операции — може да пише продуктови текстове или да задава отстъпки, но чувствителните действия изискват човешки клик.',
    reflectionEn:
      'Which one workflow in your startup could an agent own end-to-end? What would you refuse to hand over?',
    reflectionBg:
      'Кой един работен процес в стартъпа ти може да поеме агент от край до край? Какво не би дал?',
    estMinutes: 25,
    relatedTerms: ['AI Agent', 'Tool Use', 'RAG', 'Guardrails'],
  },
];

/* ─────────────────────────── Finance & Unit Economics ─────────────────────────── */

export const FINANCE_SUBMODULES: SubModule[] = [
  {
    id: 'finance-unit-economics-basics',
    pathwayId: 'finance-unit-economics',
    level: 'foundation',
    titleEn: 'Unit Economics 101',
    titleBg: 'Юнит икономика 101',
    summaryEn: 'Does one customer make money before you pay for the next one?',
    summaryBg: 'Един клиент прави ли пари, преди да платиш за следващия?',
    theoryEn:
      'Unit economics answers whether a single customer is profitable on a contribution basis: revenue per customer, minus variable cost to serve them, minus the cost to acquire them. If the number is negative at scale, more growth means more losses. This is the number that separates a business from a subsidy.',
    theoryBg:
      'Юнит икономиката отговаря дали един клиент е печеливш на база принос: приход на клиент минус променливи разходи за обслужване минус разход за придобиване.',
    frameworkEn:
      'Contribution margin per customer = ARPU − variable serving cost − allocated CAC. Positive at scale = viable. Negative = subsidy.',
    frameworkBg:
      'Принос на клиент = ARPU − променлив разход за обслужване − разпределен CAC.',
    exampleEn:
      'MoviePass sold a $10/mo pass for unlimited cinema tickets that cost them $12–15 each — unit economics were negative from day one.',
    exampleBg:
      'MoviePass продаваше абонамент за 10$/месец за неограничени билети, които им струваха 12–15$ всеки — юнит икономиката беше отрицателна от първия ден.',
    reflectionEn:
      'What is the contribution margin per customer in your startup this month? If you don\'t know, that is the problem.',
    reflectionBg:
      'Какъв е приносът на клиент в стартъпа ти този месец? Ако не знаеш — това е проблемът.',
    estMinutes: 20,
    relatedTerms: ['Contribution Margin', 'ARPU', 'Gross Margin', 'Unit Economics'],
  },
  {
    id: 'finance-ltv-cac',
    pathwayId: 'finance-unit-economics',
    level: 'foundation',
    titleEn: 'LTV, CAC & Payback',
    titleBg: 'LTV, CAC и откупуване',
    summaryEn: 'The three numbers investors ask about first — and why.',
    summaryBg: 'Трите числа, за които инвеститорите питат първо — и защо.',
    theoryEn:
      'LTV (lifetime value) is how much a customer pays over time. CAC is what it costs to acquire them. Payback is how many months until CAC is recovered. Healthy SaaS benchmarks: LTV/CAC ≥ 3, payback ≤ 12 months. These ratios shape how much you can spend on growth and still survive to the next round.',
    theoryBg:
      'LTV (жизнена стойност) е колко плаща клиент за времето си при теб. CAC е разходът за придобиване. Откупуване е броят месеци до възстановяване на CAC.',
    frameworkEn:
      'LTV = ARPU × Gross Margin ÷ Monthly Churn. CAC = total sales+marketing spend ÷ new customers. Payback = CAC ÷ (ARPU × Gross Margin).',
    frameworkBg:
      'LTV = ARPU × брутен марж ÷ месечен отток. CAC = общ разход за продажби и маркетинг ÷ нови клиенти. Откупуване = CAC ÷ (ARPU × брутен марж).',
    exampleEn:
      'Slack\'s early free-to-paid conversion pushed payback below 6 months at team plans — the reason it could out-spend rivals on growth safely.',
    exampleBg:
      'Ранната конверсия на Slack сваляше откупуването под 6 месеца — затова можеше безопасно да харчи повече от конкурентите.',
    reflectionEn:
      'Estimate your LTV/CAC and payback with today\'s numbers. Which of the three is most fragile?',
    reflectionBg:
      'Изчисли LTV/CAC и откупуване с днешните числа. Кое от трите е най-крехко?',
    estMinutes: 25,
    relatedTerms: ['LTV', 'CAC', 'Payback Period', 'Gross Margin', 'Churn'],
  },
  {
    id: 'finance-burn-runway',
    pathwayId: 'finance-unit-economics',
    level: 'intermediate',
    titleEn: 'Burn Rate & Runway',
    titleBg: 'Бърн и писта',
    summaryEn: 'How many months until the money runs out — and how to buy more time.',
    summaryBg: 'Колко месеца до края на парите — и как да купиш още време.',
    theoryEn:
      'Burn rate is monthly net cash outflow. Runway is cash on hand divided by burn. A startup with 6 months of runway must either raise, cut, or grow revenue — usually all three. Every founder should know their runway to the week.',
    theoryBg:
      'Бърн е месечният нетен изходящ поток. Пистата е налични пари ÷ бърн.',
    frameworkEn:
      'The Runway Triangle: to extend runway you can (a) cut burn (fastest, most controllable), (b) accelerate collections, (c) raise more capital (slowest, most dilutive). Prioritize in that order.',
    frameworkBg:
      'Триъгълник на пистата: (а) намали бърн, (б) ускори събирания, (в) набери капитал. Приоритизирай в този ред.',
    exampleEn:
      'In 2022–23 hundreds of well-funded startups did "efficiency layoffs" to double runway rather than raise at down-rounds — a burn-first playbook.',
    exampleBg:
      'През 2022–23 стотици добре финансирани стартъпи направиха „ефективни съкращения", за да удвоят пистата вместо да набират капитал при по-ниски оценки.',
    reflectionEn:
      'If revenue stopped growing tomorrow, how many months of runway do you have? What would you cut first?',
    reflectionBg:
      'Ако приходите спрат да растат утре — колко месеца писта имаш? Какво ще намалиш първо?',
    estMinutes: 20,
    relatedTerms: ['Burn Rate', 'Runway', 'Cash Flow', 'Efficiency'],
  },
  {
    id: 'finance-pricing-power',
    pathwayId: 'finance-unit-economics',
    level: 'intermediate',
    titleEn: 'Pricing Power',
    titleBg: 'Ценова сила',
    summaryEn: 'Charging more is the fastest, cheapest way to fix a broken model.',
    summaryBg: 'Да таксуваш повече е най-бързият, най-евтиният начин да поправиш модел.',
    theoryEn:
      'Most founders under-price. A 10% price increase, if churn stays flat, drops almost entirely to gross margin. Value-based pricing anchors the price to the outcome the customer gets, not to your costs or the competitor\'s list price.',
    theoryBg:
      'Повечето основатели подценяват. 10% ръст на цената, при равен отток, влиза почти изцяло в брутен марж.',
    frameworkEn:
      'Van Westendorp price sensitivity: ask 4 questions ("At what price is it too cheap / a bargain / expensive / too expensive?") to find the acceptable price range for each segment.',
    frameworkBg:
      'Ценова чувствителност по Van Westendorp — 4 въпроса, които очертават приемливия ценови диапазон.',
    exampleEn:
      'Figma raised prices 3× in 5 years without losing its base, because customers priced it against the outcome (faster design), not competitor tools.',
    exampleBg:
      'Figma вдигна цените си 3 пъти за 5 години, без да загуби потребители — защото те сравняваха с резултата, не с конкурентите.',
    reflectionEn:
      'Test one small price increase with new customers this month. What would you actually risk?',
    reflectionBg:
      'Тествай малко увеличение на цената този месец с нови клиенти. Какво реално рискуваш?',
    estMinutes: 20,
    relatedTerms: ['Willingness to Pay', 'Value-Based Pricing', 'Price Elasticity', 'Van Westendorp'],
  },
  {
    id: 'finance-fundraising',
    pathwayId: 'finance-unit-economics',
    level: 'advanced',
    titleEn: 'Fundraising Basics',
    titleBg: 'Основи на набирането на капитал',
    summaryEn: 'What investors actually price — and how dilution really works.',
    summaryBg: 'Какво реално ценят инвеститорите — и как работи разводняването.',
    theoryEn:
      'Investors don\'t buy your product — they buy a slice of your future cash flows at a valuation that reflects risk. Every round you raise costs you ownership. The best founders raise the least money that will get them to the next major milestone with buffer.',
    theoryBg:
      'Инвеститорите не купуват продукта ти — купуват дял от бъдещите ти парични потоци при оценка, отразяваща риска.',
    frameworkEn:
      'The Milestone-Based Raise: define the next major de-risking milestone (PMF, first $1M ARR, first enterprise), estimate the burn to get there + 6 months buffer, raise that amount at a valuation your milestone can defend.',
    frameworkBg:
      'Набиране на базата на етапи: дефинираш следващия ключов етап, изчисляваш бърна до там + 6 месеца буфер, набираш точно това при оценка, която етапът може да защити.',
    exampleEn:
      'Zoom raised comparatively little and reached IPO with founder ownership intact — a case study in capital efficiency.',
    exampleBg:
      'Zoom набра сравнително малко и стигна до IPO със запазена собственост на основателя — казус за капиталова ефективност.',
    reflectionEn:
      'What is the smallest amount that would get your startup to its next major milestone with 6 months buffer?',
    reflectionBg:
      'Кое е най-малкото количество, което би стигнало стартъпа ти до следващия голям етап с 6 месеца буфер?',
    estMinutes: 25,
    relatedTerms: ['Valuation', 'Dilution', 'Runway', 'Milestone', 'SAFE'],
  },
];

export const ALL_SUBMODULES_2026: SubModule[] = [
  ...MARKETING_SUBMODULES,
  ...AI_SUBMODULES,
  ...FINANCE_SUBMODULES,
  ...EXTRA_SUBMODULES,
];

/** Group sub-modules by pathway id for quick lookup. */
export function subModulesByPathway(): Record<string, SubModule[]> {
  const out: Record<string, SubModule[]> = {};
  for (const m of ALL_SUBMODULES_2026) {
    (out[m.pathwayId] ||= []).push(m);
  }
  return out;
}