/**
 * Curriculum 2026-27 · TEACR scenarios
 *
 * Decide -> Consequence -> Reflect -> Improve prompts for:
 *   - the 6 Core innovation stages (stage-1 ... stage-6)
 *   - the 15 Phase-2 sub-modules (Marketing, AI for Business, Finance)
 *
 * Consumed by <DecisionConsequenceReflection />. No persistence.
 */

import type { DecisionOption } from '@/components/learning/DecisionConsequenceReflection';
import { EXTRA_TEACR_SCENARIOS } from './curriculum-2026-extra';
import { BLACKSWAN_TEACR } from './curriculum-2026-blackswan';

export interface TEACRScenario {
  /** Matches a stage id (stage-1..stage-6) or a sub-module id. */
  targetId: string;
  promptEn: string;
  promptBg: string;
  options: DecisionOption[];
}

const STAGE_SCENARIOS: TEACRScenario[] = [
  {
    targetId: 'stage-1',
    promptEn: 'You spotted a problem students complain about daily. What is your very next move?',
    promptBg: 'Забеляза проблем, от който ученици се оплакват всеки ден. Кое е най-следващото ти действие?',
    options: [
      { id: 'build', labelEn: 'Start building a prototype this weekend', labelBg: 'Започни прототип през уикенда', outcome: 'negative',
        consequenceEn: 'You burn a weekend on a solution nobody asked for. You still don\u0027t know if the problem is urgent, frequent, or painful enough to pay for.',
        consequenceBg: 'Изгаряш уикенда за решение, което никой не е поискал. Все още не знаеш дали проблемът е достатъчно болезнен.' },
      { id: 'talk', labelEn: 'Interview 5 people who have the problem', labelBg: 'Интервюирай 5 души със същия проблем', outcome: 'positive',
        consequenceEn: 'Two interviews contradict your assumption — you saved weeks. You now know which pain to solve first and in what words your users describe it.',
        consequenceBg: 'Две интервюта опровергават предположението ти — спести седмици. Знаеш коя болка да решиш първо.' },
    ],
  },
  {
    targetId: 'stage-2',
    promptEn: 'Your interviews confirm the problem. How do you validate the solution before writing code?',
    promptBg: 'Интервютата потвърждават проблема. Как валидираш решението, преди да пишеш код?',
    options: [
      { id: 'landing', labelEn: 'Launch a landing page with a waitlist', labelBg: 'Пусни landing страница с чакащ списък', outcome: 'positive',
        consequenceEn: 'In 3 days you have real signup rates by channel — a cheap signal on demand before any product exists.',
        consequenceBg: 'За 3 дни имаш реални записвания по канал — евтин сигнал за търсене.' },
      { id: 'pitch', labelEn: 'Pitch it to friends and family for feedback', labelBg: 'Питай приятели и семейство за мнение', outcome: 'negative',
        consequenceEn: 'Everyone is polite. You mistake encouragement for demand and skip the market you actually need to reach.',
        consequenceBg: 'Всички са учтиви. Приемаш окуражението за търсене и пропускаш реалния пазар.' },
    ],
  },
  {
    targetId: 'stage-3',
    promptEn: 'You are filling the Business Model Canvas. Which block do you commit to first?',
    promptBg: 'Попълваш Business Model Canvas. Кой блок фиксираш първи?',
    options: [
      { id: 'segments', labelEn: 'Customer Segments — pick one narrow beachhead', labelBg: 'Клиентски сегменти — избери една тясна ниша', outcome: 'positive',
        consequenceEn: 'Every other block becomes 3× easier to fill because you can name the exact person you are building for.',
        consequenceBg: 'Всеки друг блок става 3× по-лесен, защото знаеш точно за кого строиш.' },
      { id: 'revenue', labelEn: 'Revenue Streams — decide the business model first', labelBg: 'Приходи — реши бизнес модела първи', outcome: 'neutral',
        consequenceEn: 'You lock into a monetization guess before you know who pays. Half your assumptions get rewritten later.',
        consequenceBg: 'Заключваш се в предположение за монетизация, преди да знаеш кой плаща.' },
    ],
  },
  {
    targetId: 'stage-4',
    promptEn: 'Your MVP has 30 users. Retention is weak. Where do you invest the next 2 weeks?',
    promptBg: 'MVP-ът ти има 30 потребители. Задържането е слабо. В какво инвестираш следващите 2 седмици?',
    options: [
      { id: 'acquire', labelEn: 'Pour effort into getting 300 new users', labelBg: 'Хвърли усилия да докараш 300 нови потребители', outcome: 'negative',
        consequenceEn: 'You fill a leaky bucket. Cost per user climbs, retention stays flat, and you learn nothing new about why people leave.',
        consequenceBg: 'Пълниш пробит съд. Разходът на потребител расте, задържането не мърда.' },
      { id: 'activate', labelEn: 'Fix the activation moment for the 30 you have', labelBg: 'Поправи момента на активация за тези 30', outcome: 'positive',
        consequenceEn: 'Week-2 retention doubles. Now paid acquisition would actually compound instead of burn cash.',
        consequenceBg: 'Задържането на 2-рата седмица се удвоява. Сега платеното привличане би се натрупвало.' },
    ],
  },
  {
    targetId: 'stage-5',
    promptEn: 'Growth is real but a competitor just launched something similar. What do you do?',
    promptBg: 'Растежът е реален, но конкурент току-що пусна нещо подобно. Какво правиш?',
    options: [
      { id: 'copy', labelEn: 'Rush to copy their new features', labelBg: 'Побързай да копираш техните нови функции', outcome: 'negative',
        consequenceEn: 'You dilute your roadmap chasing their game. Your loyal users stop seeing the point of choosing you.',
        consequenceBg: 'Разреждаш roadmap-а си, гонейки чуждата игра.' },
      { id: 'moat', labelEn: 'Double down on your differentiated moat', labelBg: 'Задълбочи диференциращия си защитен ров', outcome: 'positive',
        consequenceEn: 'You become the obvious choice for the segment that values your edge — and the competitor becomes noise for someone else.',
        consequenceBg: 'Ставаш очевидният избор за сегмента, който цени предимството ти.' },
    ],
  },
  {
    targetId: 'stage-6',
    promptEn: 'You have PMF and a working model. Do you raise a big round or scale on revenue?',
    promptBg: 'Имаш PMF и работещ модел. Набираш ли голям рунд или скалираш на приход?',
    options: [
      { id: 'raise', labelEn: 'Raise a large round to grab the market', labelBg: 'Набери голям рунд, за да заемеш пазара', outcome: 'neutral',
        consequenceEn: 'You get speed, but also dilution and a burn rate you must justify to a board every 90 days.',
        consequenceBg: 'Печелиш скорост, но и разводняване и бърн, който трябва да оправдаваш всеки 90 дни.' },
      { id: 'bootstrap', labelEn: 'Scale on revenue, raise only for a clear milestone', labelBg: 'Скалирай на приход, набирай само за ясен етап', outcome: 'positive',
        consequenceEn: 'Slower ceiling, but ownership stays intact and every experiment is judged by unit economics, not FOMO.',
        consequenceBg: 'По-бавен таван, но собствеността се запазва.' },
    ],
  },
];

const SUBMODULE_SCENARIOS: TEACRScenario[] = [
  { targetId: 'marketing-positioning',
    promptEn: 'Two segments love your product for different reasons. Which do you position for on the homepage?',
    promptBg: 'Два сегмента харесват продукта ти по различни причини. За кой позиционираш на началната страница?',
    options: [
      { id: 'both', labelEn: 'Speak to both to keep options open', labelBg: 'Говори на двата, за да не се затвориш', outcome: 'negative',
        consequenceEn: 'Neither segment self-identifies. Conversion drops and paid ads underperform because the message is generic.',
        consequenceBg: 'Никой не се разпознава. Конверсията пада заради общото послание.' },
      { id: 'one', labelEn: 'Pick the segment with faster payback and go all-in', labelBg: 'Избери сегмента с по-бързо откупуване и се фокусирай', outcome: 'positive',
        consequenceEn: 'Conversion doubles for that segment. The other still buys — they just recognise themselves in your case studies.',
        consequenceBg: 'Конверсията за този сегмент се удвоява.' },
    ] },
  { targetId: 'marketing-seo',
    promptEn: 'You have budget for 10 pages this quarter. How do you pick which keywords they target?',
    promptBg: 'Имаш бюджет за 10 страници. Как избираш ключовите думи?',
    options: [
      { id: 'volume', labelEn: 'Chase the highest-volume keywords in your space', labelBg: 'Гони думите с най-голям обем', outcome: 'negative',
        consequenceEn: 'You compete head-on with incumbents and rank on page 4. Six months, near-zero traffic.',
        consequenceBg: 'Конкурираш се челно с гиганти и си на 4-та страница.' },
      { id: 'intent', labelEn: 'Target lower-volume, high-intent buyer questions', labelBg: 'Насочи се към по-нискообемни, но купувачески въпроси', outcome: 'positive',
        consequenceEn: 'Traffic is smaller but converts. Each ranking page pays for itself within the quarter.',
        consequenceBg: 'Трафикът е по-малък, но конвертира.' },
    ] },
  { targetId: 'marketing-content',
    promptEn: 'A competitor is publishing 3 posts a week. Do you match their volume or change the game?',
    promptBg: 'Конкурент публикува 3 поста седмично. Изравняваш обема или сменяш играта?',
    options: [
      { id: 'match', labelEn: 'Publish 3 posts a week too', labelBg: 'Публикувай и ти 3 поста седмично', outcome: 'negative',
        consequenceEn: 'Quality tanks. Nothing memorable ships. You burn out the one writer you have.',
        consequenceBg: 'Качеството пада. Нищо запомнящо се не излиза.' },
      { id: 'flagship', labelEn: 'Ship one deep, generous flagship piece per month', labelBg: 'Пусни един задълбочен, щедър флагман на месец', outcome: 'positive',
        consequenceEn: 'One piece earns backlinks and becomes the reference in the space. Trust compounds.',
        consequenceBg: 'Един материал печели линкове и става референция.' },
    ] },
  { targetId: 'marketing-paid',
    promptEn: 'LTV/CAC is 1.8 and payback is 14 months. An investor pushes you to scale paid ads. Do you?',
    promptBg: 'LTV/CAC е 1.8 и откупуването е 14 месеца. Инвеститор те бута да скалираш платено. Ти?',
    options: [
      { id: 'scale', labelEn: 'Scale paid — growth will fix the ratios', labelBg: 'Скалирай платено — растежът ще оправи съотношенията', outcome: 'negative',
        consequenceEn: 'You buy revenue at a loss. Cash runs out before retention improvements can catch up.',
        consequenceBg: 'Купуваш приходи на загуба. Парите свършват.' },
      { id: 'fix', labelEn: 'Fix activation and pricing first, then scale', labelBg: 'Първо оправи активацията и цените, после скалирай', outcome: 'positive',
        consequenceEn: 'A quarter later LTV/CAC clears 3. Every paid dollar now compounds instead of leaks.',
        consequenceBg: 'След тримесечие LTV/CAC минава 3.' },
    ] },
  { targetId: 'marketing-analytics',
    promptEn: 'Your dashboard has 22 metrics. Leadership wants a single "north star". What do you pick?',
    promptBg: 'Таблото ти има 22 метрики. Ръководството иска една „северна звезда". Коя избираш?',
    options: [
      { id: 'vanity', labelEn: 'Monthly signups — big and easy to grow', labelBg: 'Месечни регистрации — голямо и лесно за растене', outcome: 'negative',
        consequenceEn: 'The team optimises for signup pop-ups. Retention and revenue drift while the chart looks great.',
        consequenceBg: 'Екипът оптимизира изскачащи прозорци. Задържането пада, а графиката изглежда чудесно.' },
      { id: 'value', labelEn: 'Weekly active users who reached the "aha" action', labelBg: 'Седмични активни, стигнали „аха"-действието', outcome: 'positive',
        consequenceEn: 'Every team starts asking "does this move activation?" Retention finally moves and so does revenue.',
        consequenceBg: 'Задържането най-накрая се движи — и приходите също.' },
    ] },
  { targetId: 'ai-foundations',
    promptEn: 'A student proposes an AI feature that gives medical advice. What is your call?',
    promptBg: 'Ученик предлага AI функция, която дава медицински съвети. Какво решаваш?',
    options: [
      { id: 'ship', labelEn: 'Ship it — the model is impressive in demos', labelBg: 'Пусни го — моделът е впечатляващ в демо', outcome: 'negative',
        consequenceEn: 'One confident wrong answer harms a user. Legal, reputational, and possibly regulatory fallout.',
        consequenceBg: 'Един уверен грешен отговор наранява потребител.' },
      { id: 'avoid', labelEn: 'Move to the Avoid column of the Automate/Augment/Avoid grid', labelBg: 'Премести го в „Избягвай" в мрежата', outcome: 'positive',
        consequenceEn: 'You keep AI for low-risk drafts and let licensed humans own the medical call. Trust protected.',
        consequenceBg: 'Оставяш AI за нискорискови чернови. Доверието е защитено.' },
    ] },
  { targetId: 'ai-genai',
    promptEn: 'You need to write 40 product descriptions this week. How do you use GenAI?',
    promptBg: 'Трябват ти 40 продуктови описания тази седмица. Как използваш GenAI?',
    options: [
      { id: 'raw', labelEn: 'Auto-publish whatever the model outputs', labelBg: 'Публикувай директно каквото моделът върне', outcome: 'negative',
        consequenceEn: 'Two descriptions invent features you don\u0027t offer. Customer support drowns in returns.',
        consequenceBg: 'Две описания измислят функции, които нямаш.' },
      { id: 'drv', labelEn: 'Draft with AI, refine with brand prompts, verify with a human', labelBg: 'Чернова с AI, прецизиране с брандови промптове, човешка проверка', outcome: 'positive',
        consequenceEn: 'You ship 40 solid descriptions in a day. The workflow is now a repeatable template.',
        consequenceBg: 'Пускаш 40 добри описания за ден.' },
    ] },
  { targetId: 'ai-prompting',
    promptEn: 'The model keeps producing generic output. Which fix helps most?',
    promptBg: 'Моделът продължава да връща общи резултати. Кое помага най-много?',
    options: [
      { id: 'longer', labelEn: 'Write a longer, wordier prompt', labelBg: 'Напиши по-дълъг, по-многословен промпт', outcome: 'neutral',
        consequenceEn: 'Output gets marginally better but still inconsistent. You still don\u0027t know what changed.',
        consequenceBg: 'Резултатът се подобрява леко, но остава непостоянен.' },
      { id: 'rtcef', labelEn: 'Restructure using RTCEF (Role, Task, Context, Examples, Format)', labelBg: 'Пренапиши по RTCEF (Роля, Задача, Контекст, Примери, Формат)', outcome: 'positive',
        consequenceEn: 'Two examples and a strict format field push quality up 10×. You save the prompt as a template.',
        consequenceBg: 'Два примера и строг формат вдигат качеството 10×.' },
    ] },
  { targetId: 'ai-ethics',
    promptEn: 'Your AI feature scores school admissions. How do you comply with the EU AI Act?',
    promptBg: 'AI функцията ти скорира училищни кандидатури. Как спазваш EU AI Act?',
    options: [
      { id: 'ignore', labelEn: 'Ship it now, fix compliance if regulators complain', labelBg: 'Пусни сега, оправи съответствието, ако регулаторите се обадят', outcome: 'negative',
        consequenceEn: 'The system falls in a High-Risk tier. You face fines, a mandatory audit, and have to rebuild.',
        consequenceBg: 'Системата е в „висок риск". Глоби, задължителен одит.' },
      { id: 'triage', labelEn: 'Run risk triage, add human-in-the-loop for every decision', labelBg: 'Направи риск триаж, добави човек в цикъла за всяко решение', outcome: 'positive',
        consequenceEn: 'You launch inside High-Risk rules: documented, auditable, with an appeals path.',
        consequenceBg: 'Пускаш в рамките на „висок риск": документирано, одитируемо.' },
    ] },
  { targetId: 'ai-agents',
    promptEn: 'You want an agent to handle customer refunds end-to-end. What is the safest first version?',
    promptBg: 'Искаш агент да поеме връщанията изцяло. Коя е най-безопасната първа версия?',
    options: [
      { id: 'auto', labelEn: 'Full autonomy: agent refunds up to any amount', labelBg: 'Пълна автономия: агентът връща до всякаква сума', outcome: 'negative',
        consequenceEn: 'One prompt-injection attack triggers refunds worth thousands overnight.',
        consequenceBg: 'Една prompt-инжекция задейства връщания за хиляди.' },
      { id: 'scoped', labelEn: 'Scoped agent: capped amount, 5 tools, human approval above threshold', labelBg: 'Ограничен агент: лимит, 5 инструмента, човешко одобрение над праг', outcome: 'positive',
        consequenceEn: 'You automate 80% of refunds safely. Support team focuses on the 20% edge cases.',
        consequenceBg: 'Автоматизираш 80% от връщанията безопасно.' },
    ] },
  { targetId: 'finance-unit-economics-basics',
    promptEn: 'Contribution margin per customer is negative but growth is fast. What do you do?',
    promptBg: 'Приносът на клиент е отрицателен, но растежът е бърз. Какво правиш?',
    options: [
      { id: 'grow', labelEn: 'Keep growing — scale will fix margins', labelBg: 'Продължи да растеш — мащабът ще оправи маржа', outcome: 'negative',
        consequenceEn: 'Losses grow proportionally. When the next round is delayed, you can\u0027t afford to stay open.',
        consequenceBg: 'Загубите растат пропорционално.' },
      { id: 'pause', labelEn: 'Pause growth, fix the margin per customer first', labelBg: 'Спри растежа, оправи първо маржа', outcome: 'positive',
        consequenceEn: 'Growth slows for a quarter. When you re-open the taps, every new customer adds cash instead of consuming it.',
        consequenceBg: 'Растежът пада за тримесечие, но всеки нов клиент добавя пари.' },
    ] },
  { targetId: 'finance-ltv-cac',
    promptEn: 'LTV/CAC is 4 but payback is 18 months. Do you scale?',
    promptBg: 'LTV/CAC е 4, но откупуването е 18 месеца. Скалираш ли?',
    options: [
      { id: 'scale', labelEn: 'Scale hard — LTV/CAC looks great', labelBg: 'Скалирай агресивно — LTV/CAC е чудесно', outcome: 'negative',
        consequenceEn: 'You need 18 months of cash per cohort. Runway hits zero long before those LTVs materialise.',
        consequenceBg: 'Трябват 18 месеца пари на кохорта. Пистата свършва.' },
      { id: 'shorten', labelEn: 'Shorten payback with an annual plan discount', labelBg: 'Скъси откупуването с отстъпка за годишен план', outcome: 'positive',
        consequenceEn: 'Payback drops to 9 months. Now the same LTV/CAC actually finances your next 12 months of growth.',
        consequenceBg: 'Откупуването пада на 9 месеца.' },
    ] },
  { targetId: 'finance-burn-runway',
    promptEn: 'You have 5 months of runway and no term sheet. What is your first move?',
    promptBg: 'Имаш 5 месеца писта и никакъв term sheet. Кой е първият ти ход?',
    options: [
      { id: 'raise', labelEn: 'Focus 100% on raising the next round', labelBg: 'Фокусирай 100% върху набиране', outcome: 'negative',
        consequenceEn: 'Investors smell desperation. You take a down-round at terrible terms — or nothing at all.',
        consequenceBg: 'Инвеститорите усещат отчаянието.' },
      { id: 'cut', labelEn: 'Cut burn to double runway, then raise from strength', labelBg: 'Намали бърна, за да удвоиш пистата, после набирай от позиция на сила', outcome: 'positive',
        consequenceEn: 'You buy 10 months and negotiate with real leverage. Any round you close is on your terms.',
        consequenceBg: 'Купуваш 10 месеца и преговаряш с реален лост.' },
    ] },
  { targetId: 'finance-pricing-power',
    promptEn: 'Users love the product but you have never raised prices. What do you test?',
    promptBg: 'Потребителите обичат продукта, но никога не си вдигал цени. Какво тестваш?',
    options: [
      { id: 'freeze', labelEn: 'Keep prices low to protect goodwill', labelBg: 'Задръж ниските цени, за да пазиш добро отношение', outcome: 'negative',
        consequenceEn: 'Margin stays thin, hiring stalls, product falls behind. Users leave for a competitor who invested more.',
        consequenceBg: 'Маржът остава тънък, продуктът изостава.' },
      { id: 'testup', labelEn: 'Raise prices 15% for new customers only', labelBg: 'Вдигни цените с 15% само за нови клиенти', outcome: 'positive',
        consequenceEn: 'Conversion barely moves; margin per new customer jumps. Existing users are untouched.',
        consequenceBg: 'Конверсията едва мърда; маржът скача.' },
    ] },
  { targetId: 'finance-fundraising',
    promptEn: 'A top VC offers 2× the money you need at the same terms. Do you take it?',
    promptBg: 'Топ VC ти предлага 2× повече пари при същите условия. Взимаш ли?',
    options: [
      { id: 'take', labelEn: 'Take it — bigger cushion, same dilution', labelBg: 'Вземи — по-голям буфер, същото разводняване', outcome: 'neutral',
        consequenceEn: 'You spend the extra money because it exists. Burn doubles, milestones don\u0027t — next round is harder.',
        consequenceBg: 'Харчиш екстра парите. Бърнът се удвоява, етапите не.' },
      { id: 'right', labelEn: 'Raise only what the milestone + 6-month buffer needs', labelBg: 'Набери само колкото трябва за етапа + 6 месеца буфер', outcome: 'positive',
        consequenceEn: 'You keep ownership, force discipline, and can raise the next round at a higher valuation with clear proof.',
        consequenceBg: 'Запазваш собственост и налагаш дисциплина.' },
    ] },
];

export const ALL_TEACR_SCENARIOS: TEACRScenario[] = [
  ...STAGE_SCENARIOS,
  ...SUBMODULE_SCENARIOS,
  ...EXTRA_TEACR_SCENARIOS,
  ...BLACKSWAN_TEACR,
];

const BY_ID = new Map(ALL_TEACR_SCENARIOS.map(s => [s.targetId, s] as const));

/** Lookup by stage id or sub-module id. */
export function getTeacrScenario(targetId: string): TEACRScenario | undefined {
  return BY_ID.get(targetId);
}

export const STAGE_TEACR_IDS = STAGE_SCENARIOS.map(s => s.targetId);
