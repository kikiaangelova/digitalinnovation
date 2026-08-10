/**
 * Pilot content pack for the `network-effects` module.
 *
 * Content quality status: needs_review. Nothing here is classroom-ready
 * until an educator signs it off.
 *
 * Editorial rules applied here:
 *  - No unsupported causal claims about real companies.
 *  - Facts are separated from interpretations and from case assumptions.
 *  - The Airbnb dilemma is an explicitly hypothetical teaching scenario.
 */

import type {
  CasePack,
  EntryTask,
  LearningOutcome,
  Misconception,
  SourceRef,
  TeacherPack,
  Bilingual,
} from './module-pilot-types';
import { SHARED_RUBRIC_ANCHORS, SHARED_RUBRIC_DIMENSIONS } from './teacher-rubric';

/* ------------------------------------------------------------------ */
/* Sources                                                             */
/* ------------------------------------------------------------------ */

export const NETWORK_EFFECTS_SOURCES: SourceRef[] = [
  {
    id: 'S1',
    title: 'Airbnb, Inc. Form 10-K for the fiscal year ended December 31, 2025',
    publisher: 'U.S. Securities and Exchange Commission (EDGAR)',
    date: '2025 fiscal year',
    url: 'https://www.sec.gov/Archives/edgar/data/1559720/000155972026000004/abnb-20251231.htm',
    use_note_en: 'Use for reported scale (Nights and Seats Booked, Gross Booking Value) and for the risks the company itself discloses around trust, safety, fraud, privacy and listing quality.',
    use_note_bg: 'Използвай за отчетения мащаб (Nights and Seats Booked, Gross Booking Value) и за рисковете, които самата компания оповестява около доверие, безопасност, измами, поверителност и качество на обявите.',
  },
  {
    id: 'S2',
    title: 'How does identity verification work on Airbnb?',
    publisher: 'Airbnb Help Center',
    date: 'Accessed 2026',
    url: 'https://www.airbnb.com/help/article/1237',
    use_note_en: 'Use for what identity verification actually checks — and for Airbnb’s own statement that no verification process is perfect and identity is not guaranteed.',
    use_note_bg: 'Използвай за това какво реално проверява верификацията на самоличност — и за собственото твърдение на Airbnb, че никой процес не е перфектен и самоличността не е гарантирана.',
  },
  {
    id: 'S3',
    title: 'Airbnb’s reviews policy',
    publisher: 'Airbnb Help Center',
    date: 'Accessed 2026',
    url: 'https://www.airbnb.com/help/article/2673',
    use_note_en: 'Use for the requirement that reviews are authentic and based on first-hand experience.',
    use_note_bg: 'Използвай за изискването отзивите да са автентични и от личен опит.',
  },
  {
    id: 'S4',
    title: 'Reviews for stays',
    publisher: 'Airbnb Help Center',
    date: 'Accessed 2026',
    url: 'https://www.airbnb.com/help/article/13',
    use_note_en: 'Use for how reviews are collected after a stay and what they can and cannot tell a future guest.',
    use_note_bg: 'Използвай за това как се събират отзивите след престой и какво могат и какво не могат да кажат на бъдещ гост.',
  },
  {
    id: 'S5',
    title: 'AirCover for guests',
    publisher: 'Airbnb Help Center',
    date: 'Accessed 2026',
    url: 'https://www.airbnb.com/help/article/3218',
    use_note_en: 'Use as an example of protection that acts after something goes wrong, rather than preventing it beforehand.',
    use_note_bg: 'Използвай като пример за защита, която действа след като нещо се обърка, а не я предотвратява предварително.',
  },
  {
    id: 'S6',
    title: 'Competition in Two-Sided Markets (Mark Armstrong)',
    publisher: 'UCL Discovery',
    date: '2006',
    url: 'https://discovery.ucl.ac.uk/4324/1/competitionintwosidedmarkets.pdf',
    use_note_en: 'Use for the economics of cross-side effects, why platforms often subsidise one side, and why multi-homing weakens platform power.',
    use_note_bg: 'Използвай за икономиката на кръстосаните ефекти, защо платформите често субсидират едната страна и защо multi-homing отслабва силата на платформата.',
  },
  {
    id: 'S7',
    title: 'Metcalfe’s Law is Wrong (Briscoe, Odlyzko, Tilly)',
    publisher: 'IEEE Spectrum',
    date: '2006',
    url: 'https://spectrum.ieee.org/metcalfes-law-is-wrong',
    use_note_en: 'Use to challenge n² as a valuation rule: not all possible connections have equal value, so n² overstates network value.',
    use_note_bg: 'Използвай, за да оспориш n² като правило за оценка: не всички възможни връзки имат еднаква стойност, затова n² надценява стойността на мрежата.',
  },
  {
    id: 'S8',
    title: 'How we work',
    publisher: 'Booking.com',
    date: 'Accessed 2026',
    url: 'https://www.booking.com/content/how_we_work.html',
    use_note_en: 'Use for how guest review scores and property quality signals are presented to travellers.',
    use_note_bg: 'Използвай за това как оценките от отзиви и сигналите за качество се представят на пътуващите.',
  },
  {
    id: 'S9',
    title: 'Rider verification',
    publisher: 'Uber',
    date: 'Accessed 2026',
    url: 'https://www.uber.com/us/en/safety/rider-verification/',
    use_note_en: 'Use for a verification badge shown to the other side of the marketplace, and for the privacy boundary around what is shared.',
    use_note_bg: 'Използвай за баджа за верификация, показван на другата страна на пазара, и за границата на поверителност какво се споделя.',
  },
  {
    id: 'S10',
    title: 'Etsy Buyer Policy',
    publisher: 'Etsy',
    date: 'Accessed 2026',
    url: 'https://www.etsy.com/legal/buyers/',
    use_note_en: 'Use for reviews tied to an actual purchase and limited to a review window — a mechanism that makes fake reviews harder.',
    use_note_bg: 'Използвай за отзиви, обвързани с реална покупка и ограничени във времеви прозорец — механизъм, който затруднява фалшивите отзиви.',
  },
];

/* ------------------------------------------------------------------ */
/* Outcomes, boundaries, misconceptions                                */
/* ------------------------------------------------------------------ */

export const NETWORK_EFFECTS_OUTCOMES: LearningOutcome[] = [
  {
    id: 'lo-a',
    bloom: 'Apply',
    en: 'Explain what a network effect is and classify a given example as a direct (same-side) or cross-side effect.',
    bg: 'Обясняваш какво е мрежови ефект и класифицираш даден пример като директен (от същата страна) или кръстосан ефект.',
  },
  {
    id: 'lo-b',
    bloom: 'Analyze',
    en: 'Distinguish a sourced fact from an interpretation and from an assumption in a platform case.',
    bg: 'Разграничаваш факт с източник от интерпретация и от допускане в казус за платформа.',
  },
  {
    id: 'lo-c',
    bloom: 'Evaluate',
    en: 'Evaluate how strong a network effect is using at least four criteria, such as multi-homing, local density, switching costs, frequency, differentiation, trust and congestion.',
    bg: 'Оценяваш колко силен е един мрежови ефект по поне четири критерия — например multi-homing, локална плътност, разходи за смяна, честота, диференциация, доверие и претоварване.',
  },
  {
    id: 'lo-d',
    bloom: 'Create',
    en: 'Recommend an intervention for a platform, supported by evidence and with its trade-offs stated openly.',
    bg: 'Препоръчваш интервенция за платформа, подкрепена с доказателства и с открито заявени компромиси.',
  },
];

export const NETWORK_EFFECTS_BOUNDARIES: Bilingual[] = [
  {
    en: 'A network effect exists when the value a user gets changes because other users participate. If value would be the same with far fewer users, you are looking at ordinary growth, not a network effect.',
    bg: 'Мрежови ефект има, когато стойността за един потребител се променя, защото други потребители участват. Ако стойността щеше да е същата и при много по-малко потребители, гледаш обикновен растеж, а не мрежови ефект.',
  },
  {
    en: 'Metcalfe’s n² counts possible pairwise connections. It is a simplifying heuristic, not a valuation law and not a way to calculate a startup’s critical mass. Most possible connections are never used and are not equally valuable (S7).',
    bg: 'n² на Меткалф брои възможните двойки връзки. Това е опростяваща евристика, а не закон за оценка и не начин да изчислиш критичната маса на стартъп. Повечето възможни връзки никога не се използват и не са еднакво ценни (S7).',
  },
  {
    en: 'In marketplaces what matters is relevant local liquidity and matching quality — enough of the right supply, near enough, at the right time. A large global user count can hide a thin local market.',
    bg: 'В пазарите значение имат релевантната локална ликвидност и качеството на съвпаденията — достатъчно подходящо предлагане, достатъчно наблизо, в подходящия момент. Голям глобален брой потребители може да крие тънък локален пазар.',
  },
  {
    en: 'Strong network effects do not automatically produce a winner-take-all market. Local markets, multi-homing, differentiation and regulation all leave room for competitors (S6).',
    bg: 'Силните мрежови ефекти не водят автоматично до пазар „победителят взема всичко“. Локалните пазари, multi-homing, диференциацията и регулацията оставят място за конкуренти (S6).',
  },
  {
    en: 'Network effects can run in reverse and can be negative: congestion, spam and fraud, falling match quality, and users leaving which makes the product worse for those who stay.',
    bg: 'Мрежовите ефекти могат да вървят и назад и да са отрицателни: претоварване, спам и измами, спадащо качество на съвпаденията и напускащи потребители, което влошава продукта за оставащите.',
  },
];

export const NETWORK_EFFECTS_MISCONCEPTIONS: Misconception[] = [
  {
    id: 'mc-1',
    wrong_en: 'User growth proves a network effect.',
    wrong_bg: 'Ръстът на потребители доказва мрежови ефект.',
    correct_en: 'Growth can come from advertising, discounts or a good product alone. The test is whether each user’s value depends on other users’ participation.',
    correct_bg: 'Ръстът може да идва от реклама, отстъпки или просто добър продукт. Тестът е дали стойността за всеки потребител зависи от участието на другите.',
  },
  {
    id: 'mc-2',
    wrong_en: 'Value equals n², so I can calculate my critical mass.',
    wrong_bg: 'Стойността е n², значи мога да изчисля критичната си маса.',
    correct_en: 'n² counts potential connections, not realised value. Use it as intuition for why density matters, never as a number in a valuation or a plan (S7).',
    correct_bg: 'n² брои потенциални връзки, не реализирана стойност. Ползвай го като интуиция защо плътността има значение, никога като число в оценка или план (S7).',
  },
  {
    id: 'mc-3',
    wrong_en: 'Once a platform leads, competitors cannot enter.',
    wrong_bg: 'Щом една платформа води, конкуренти не могат да влязат.',
    correct_en: 'Users often multi-home, and many markets are local. A competitor can win one city, one niche or one segment (S6).',
    correct_bg: 'Потребителите често използват няколко платформи, а много пазари са локални. Конкурент може да спечели един град, една ниша или един сегмент (S6).',
  },
  {
    id: 'mc-4',
    wrong_en: 'Verified identity means a trustworthy user.',
    wrong_bg: 'Проверена самоличност значи надежден потребител.',
    correct_en: 'Verification checks information against documents or third-party sources; Airbnb states that no process is perfect and identity is not guaranteed (S2).',
    correct_bg: 'Верификацията сверява информация с документи или трети източници; Airbnb заявява, че никой процес не е перфектен и самоличността не е гарантирана (S2).',
  },
  {
    id: 'mc-5',
    wrong_en: 'More users always improve the experience.',
    wrong_bg: 'Повече потребители винаги подобряват изживяването.',
    correct_en: 'Beyond some point you get congestion, spam and lower match quality — negative network effects.',
    correct_bg: 'След определена точка идват претоварване, спам и по-лошо качество на съвпаденията — отрицателни мрежови ефекти.',
  },
];

export const NETWORK_EFFECTS_ENTRY_TASK: EntryTask = {
  prompt_en: 'Before the theory: classify each scenario as ordinary scale/adoption, a direct (same-side) network effect, or a cross-side network effect.',
  prompt_bg: 'Преди теорията: класифицирай всеки сценарий като обикновен мащаб/приемане, директен (от същата страна) мрежови ефект или кръстосан мрежови ефект.',
  categories: [
    { en: 'Ordinary scale / adoption', bg: 'Обикновен мащаб / приемане' },
    { en: 'Direct (same-side) network effect', bg: 'Директен мрежови ефект (от същата страна)' },
    { en: 'Cross-side network effect', bg: 'Кръстосан мрежови ефект' },
  ],
  scenarios: [
    {
      id: 'et-1',
      en: 'A note-taking app doubles its downloads after a large ad campaign. Users work alone and never share notes.',
      bg: 'Приложение за бележки удвоява свалянията си след голяма рекламна кампания. Потребителите работят сами и никога не споделят бележки.',
    },
    {
      id: 'et-2',
      en: 'A school messaging group becomes more useful to each student as more classmates join, because more of the people they need are reachable.',
      bg: 'Училищна група за съобщения става по-полезна за всеки ученик, когато се включат повече съученици, защото повече от хората, които са им нужни, са достижими.',
    },
    {
      id: 'et-3',
      en: 'A food-delivery app in one town adds more restaurants; customers now find what they want more often, and the extra orders attract still more restaurants.',
      bg: 'Приложение за доставка на храна в един град добавя повече ресторанти; клиентите по-често намират каквото искат, а допълнителните поръчки привличат още ресторанти.',
    },
  ],
  followup_en: 'Pick one answer and explain in two or three sentences how you decided — what would have to change for your classification to be wrong?',
  followup_bg: 'Избери един от отговорите и обясни в две-три изречения как реши — какво трябва да се промени, за да е грешна класификацията ти?',
};

/* ------------------------------------------------------------------ */
/* Airbnb trust case pack                                              */
/* ------------------------------------------------------------------ */

export const AIRBNB_TRUST_CASE_PACK: CasePack = {
  verified_facts: [
    {
      en: 'Airbnb is a platform that matches hosts offering stays with guests looking for them; trust and safety between strangers is material to how the model works (S1).',
      bg: 'Airbnb е платформа, която свързва домакини, предлагащи престой, с гости, които го търсят; доверието и безопасността между непознати са съществени за начина, по който работи моделът (S1).',
    },
    {
      en: 'Airbnb identity verification checks the information a person provides against trusted third-party sources or a government ID, and Airbnb states explicitly that no verification process is perfect and that verification does not guarantee a person’s identity (S2).',
      bg: 'Верификацията на самоличност в Airbnb сверява подадената информация с надеждни външни източници или документ за самоличност, а Airbnb изрично заявява, че никой процес на верификация не е перфектен и че верификацията не гарантира самоличността на човека (S2).',
    },
    {
      en: 'Airbnb’s 2025 Form 10-K reports 533 million Nights and Seats Booked and $91.273 billion in Gross Booking Value for the fiscal year ended 31 December 2025 (S1).',
      bg: 'Формуляр 10-K на Airbnb за 2025 г. отчита 533 милиона Nights and Seats Booked и 91.273 милиарда долара Gross Booking Value за финансовата година, приключила на 31 декември 2025 г. (S1).',
    },
    {
      en: 'The same 10-K discloses trust and safety failures, fraud, privacy and data protection, listing quality and the limits of identity verification as material risks to the business (S1).',
      bg: 'Същият 10-K оповестява провали в доверието и безопасността, измами, поверителност и защита на данните, качество на обявите и ограниченията на верификацията като съществени рискове за бизнеса (S1).',
    },
    {
      en: 'Airbnb’s reviews policy requires authentic, first-hand reviews, and reviews for stays are collected after the stay (S3, S4). AirCover for guests provides support and protections when a booking goes wrong (S5).',
      bg: 'Политиката за отзиви на Airbnb изисква автентични отзиви от личен опит, а отзивите за престой се събират след престоя (S3, S4). AirCover за гости осигурява поддръжка и защити, когато резервация се обърка (S5).',
    },
  ],
  interpretations: [
    {
      en: 'Interpretation: global scale is not evidence that every city, neighbourhood or date has enough supply, or the same level of trust. Liquidity and trust are local.',
      bg: 'Интерпретация: глобалният мащаб не е доказателство, че всеки град, квартал или дата имат достатъчно предлагане или същото ниво на доверие. Ликвидността и доверието са локални.',
    },
    {
      en: 'Interpretation: reviews work best for users with a history. A first-time guest and a first-time host are exactly the case where the trust stack has the least to say.',
      bg: 'Интерпретация: отзивите работят най-добре за потребители с история. Гост за първи път и домакин за първи път са точно случаят, в който стекът на доверие има най-малко какво да каже.',
    },
    {
      en: 'Interpretation: protections that pay out after a problem change who carries the cost, but they do not prevent the harm from happening.',
      bg: 'Интерпретация: защитите, които компенсират след проблем, променят кой носи разхода, но не предотвратяват самата вреда.',
    },
  ],
  case_assumptions: [
    {
      en: 'CASE ASSUMPTION: the product team, the four policy options and the decision deadline below are a hypothetical teaching scenario. They are not a description of any real Airbnb decision.',
      bg: 'ДОПУСКАНЕ В КАЗУСА: продуктовият екип, четирите варианта на политика и срокът за решение по-долу са хипотетичен учебен сценарий. Те не описват реално решение на Airbnb.',
    },
    {
      en: 'CASE ASSUMPTION: “higher-risk context” means a first-time guest, a same-day booking, or a listing type with a higher incident rate. You may challenge this definition.',
      bg: 'ДОПУСКАНЕ В КАЗУСА: „контекст с по-висок риск“ означава гост за първи път, резервация за същия ден или тип обява с по-висока честота на инциденти. Можеш да оспориш тази дефиниция.',
    },
    {
      en: 'CASE ASSUMPTION: all Low/Medium/High ratings in Exhibit D are the case author’s estimates for discussion, not measured data.',
      bg: 'ДОПУСКАНЕ В КАЗУСА: всички оценки Ниско/Средно/Високо в Приложение D са оценки на автора на казуса за дискусия, а не измерени данни.',
    },
  ],
  stakeholders: [
    { en: 'First-time guests, who have no review history to rely on', bg: 'Гости за първи път, които нямат история от отзиви, на която да стъпят' },
    { en: 'Repeat guests, who already carry a reputation', bg: 'Редовни гости, които вече носят репутация' },
    { en: 'Occasional hosts renting one home a few times a year', bg: 'Случайни домакини, които отдават едно жилище няколко пъти годишно' },
    { en: 'Professional hosts managing many listings', bg: 'Професионални домакини, които управляват много обяви' },
    { en: 'Airbnb as the platform, carrying liability and operating cost', bg: 'Airbnb като платформа, която носи отговорност и оперативен разход' },
    { en: 'Local communities and regulators', bg: 'Местните общности и регулаторите' },
    { en: 'People with limited access to accepted identity documents', bg: 'Хора с ограничен достъп до приемани документи за самоличност' },
  ],
  dilemma_en:
    'HYPOTHETICAL DILEMMA. A product team must choose a trust policy for higher-risk or first-time booking contexts. Every option buys trust with something else: friction, privacy, access or cost. No option is universally correct — your job is to recommend one for a defined context and say what safeguards go with it.',
  dilemma_bg:
    'ХИПОТЕТИЧНА ДИЛЕМА. Продуктов екип трябва да избере политика за доверие в контексти с по-висок риск или при първа резервация. Всеки вариант купува доверие с нещо друго: триене, поверителност, достъп или разход. Няма универсално верен вариант — твоята задача е да препоръчаш един за ясно определен контекст и да кажеш какви предпазни мерки вървят с него.',
  decision_options: [
    {
      id: 'opt-a',
      label_en: 'A. Universal enhanced verification',
      label_bg: 'A. Универсална разширена верификация',
      description_en: 'Every guest and host completes enhanced verification before any booking.',
      description_bg: 'Всеки гост и домакин минава през разширена верификация преди всяка резервация.',
      tradeoffs: [
        { en: 'Most consistent signal; easiest to explain to users and regulators.', bg: 'Най-последователен сигнал; най-лесен за обяснение на потребители и регулатори.' },
        { en: 'Highest friction and the largest amount of personal data collected from people who posed no risk.', bg: 'Най-високо триене и най-много лични данни, събрани от хора, които не са носили риск.' },
        { en: 'Excludes people without accepted documents, which is an access and fairness problem.', bg: 'Изключва хора без приемани документи, което е проблем с достъпа и справедливостта.' },
      ],
    },
    {
      id: 'opt-b',
      label_en: 'B. Risk-based enhanced verification',
      label_bg: 'B. Разширена верификация на база риск',
      description_en: 'Enhanced checks are triggered only in defined higher-risk contexts.',
      description_bg: 'Разширените проверки се задействат само в ясно определени контексти с по-висок риск.',
      tradeoffs: [
        { en: 'Keeps friction low for most bookings while targeting the riskiest ones.', bg: 'Държи триенето ниско за повечето резервации, като се фокусира върху най-рисковите.' },
        { en: 'The risk model can be wrong or biased, and false positives fall on specific groups.', bg: 'Рисковият модел може да греши или да е предубеден, а фалшивите положителни резултати падат върху конкретни групи.' },
        { en: 'Harder to explain; needs an appeal route and monitoring.', bg: 'По-трудно за обяснение; изисква път за обжалване и наблюдение.' },
      ],
    },
    {
      id: 'opt-c',
      label_en: 'C. Host-controlled verification threshold',
      label_bg: 'C. Праг на верификация, контролиран от домакина',
      description_en: 'Each host decides what level of verification a guest must have to book.',
      description_bg: 'Всеки домакин решава какво ниво на верификация трябва да има гостът, за да резервира.',
      tradeoffs: [
        { en: 'Respects that hosts carry the direct risk in their own home.', bg: 'Зачита факта, че домакините носят прекия риск в собствения си дом.' },
        { en: 'Rules become inconsistent across the marketplace, which weakens the trust signal.', bg: 'Правилата стават непоследователни в целия пазар, което отслабва сигнала за доверие.' },
        { en: 'Creates a real discrimination risk if hosts use thresholds as a proxy for something else.', bg: 'Създава реален риск от дискриминация, ако домакините ползват праговете като заместител на нещо друго.' },
      ],
    },
    {
      id: 'opt-d',
      label_en: 'D. Rely mainly on transaction and reputation protections',
      label_bg: 'D. Разчитане основно на защити при транзакцията и репутация',
      description_en: 'Keep verification light and lean on reviews, payment controls and after-the-fact protection.',
      description_bg: 'Верификацията остава лека, а тежестта пада върху отзиви, контрол на плащанията и защита след факта.',
      tradeoffs: [
        { en: 'Lowest friction and the least personal data collected.', bg: 'Най-ниско триене и най-малко събрани лични данни.' },
        { en: 'Weakest exactly where the case bites: first-time users with no history (S3, S4).', bg: 'Най-слабо точно там, където казусът боли: потребители за първи път без история (S3, S4).' },
        { en: 'Shifts cost to compensation after harm rather than prevention (S5).', bg: 'Измества разхода към компенсация след вреда вместо към предотвратяване (S5).' },
      ],
    },
  ],
  exhibits: [
    {
      id: 'A',
      kind: 'facts',
      title_en: 'Exhibit A — Airbnb reported scale and disclosed risks (2025)',
      title_bg: 'Приложение A — Отчетен мащаб и оповестени рискове на Airbnb (2025)',
      lines: [
        { en: '533 million Nights and Seats Booked in the fiscal year ended 31 December 2025 (Form 10-K, S1).', bg: '533 милиона Nights and Seats Booked за финансовата година, приключила на 31 декември 2025 г. (Формуляр 10-K, S1).' },
        { en: '$91.273 billion Gross Booking Value for the same period (Form 10-K, S1).', bg: '91.273 милиарда долара Gross Booking Value за същия период (Формуляр 10-K, S1).' },
        { en: 'Disclosed material risks include trust and safety incidents, fraud, privacy and data protection, listing quality, and the limits of identity verification (S1).', bg: 'Оповестените съществени рискове включват инциденти с доверие и безопасност, измами, поверителност и защита на данните, качество на обявите и ограниченията на верификацията (S1).' },
        { en: 'Read carefully: these are global totals. They say nothing about how many suitable listings exist in one town on one weekend.', bg: 'Чети внимателно: това са глобални суми. Те не казват нищо за това колко подходящи обяви има в един град през един уикенд.' },
      ],
      source_ids: ['S1'],
    },
    {
      id: 'B',
      kind: 'mechanisms',
      title_en: 'Exhibit B — The trust stack: what each layer can and cannot prove',
      title_bg: 'Приложение B — Стекът на доверието: какво може и какво не може да докаже всеки слой',
      lines: [
        { en: 'Identity verification — CAN check submitted information against a document or third-party source. CANNOT guarantee identity or predict behaviour; Airbnb states no process is perfect (S2).', bg: 'Верификация на самоличност — МОЖЕ да сравни подадената информация с документ или външен източник. НЕ МОЖЕ да гарантира самоличност или да предскаже поведение; Airbnb заявява, че никой процес не е перфектен (S2).' },
        { en: 'Authentic reviews — CAN summarise how past stays actually went. CANNOT say anything about a user with no history, and policy exists precisely because fake reviews are a threat (S3, S4).', bg: 'Автентични отзиви — МОГАТ да обобщят как реално са минали предишни престои. НЕ МОГАТ да кажат нищо за потребител без история, а политиката съществува точно защото фалшивите отзиви са заплаха (S3, S4).' },
        { en: 'Platform protection and support — CAN reduce the financial damage after an incident. CANNOT prevent the incident, and depends on being claimed and processed (S5).', bg: 'Защита и поддръжка от платформата — МОГАТ да намалят финансовата щета след инцидент. НЕ МОГАТ да предотвратят инцидента и зависят от подаване и обработка на претенция (S5).' },
      ],
      source_ids: ['S2', 'S3', 'S4', 'S5'],
    },
    {
      id: 'C',
      kind: 'comparison',
      title_en: 'Exhibit C — How three other platforms build trust (sourced mechanisms only)',
      title_bg: 'Приложение C — Как още три платформи изграждат доверие (само механизми с източник)',
      columns_en: ['Platform', 'Mechanism', 'What it does not solve', 'Source'],
      columns_bg: ['Платформа', 'Механизъм', 'Какво не решава', 'Източник'],
      rows: [
        {
          label_en: 'Booking.com',
          label_bg: 'Booking.com',
          cells_en: ['Booking.com', 'Guest review scores and property quality information are published for travellers to compare.', 'Says little about a first-time traveller; the signal is about the property, not the guest.', 'S8'],
          cells_bg: ['Booking.com', 'Оценки от отзиви на гости и информация за качеството на имота се публикуват, за да могат пътуващите да сравняват.', 'Казва малко за пътуващ за първи път; сигналът е за имота, не за госта.', 'S8'],
        },
        {
          label_en: 'Uber',
          label_bg: 'Uber',
          cells_en: ['Uber', 'A rider verification badge signals to the driver that the rider’s details were checked, with a stated boundary on what is shared.', 'A badge is a signal, not a promise about behaviour on the trip.', 'S9'],
          cells_bg: ['Uber', 'Бадж за верификация на пътника сигнализира на шофьора, че данните му са проверени, с изрична граница какво се споделя.', 'Баджът е сигнал, а не обещание за поведението по време на пътуването.', 'S9'],
        },
        {
          label_en: 'Etsy',
          label_bg: 'Etsy',
          cells_en: ['Etsy', 'Reviews are tied to an actual purchase and can be left within a defined review window.', 'Ties trust to completed transactions, so new sellers still start from zero.', 'S10'],
          cells_bg: ['Etsy', 'Отзивите са обвързани с реална покупка и могат да се оставят в определен времеви прозорец.', 'Обвързва доверието със завършени сделки, така че новите продавачи пак тръгват от нула.', 'S10'],
        },
      ],
      source_ids: ['S8', 'S9', 'S10'],
    },
    {
      id: 'D',
      kind: 'matrix',
      title_en: 'Exhibit D — Decision matrix (qualitative case estimates, challenge them)',
      title_bg: 'Приложение D — Матрица за решение (качествени оценки в казуса, оспори ги)',
      columns_en: ['Option', 'Trust gain', 'User friction', 'Privacy/data burden', 'Inclusion/access', 'Operational cost', 'Reversibility'],
      columns_bg: ['Вариант', 'Печалба за доверието', 'Триене за потребителя', 'Тежест за поверителност/данни', 'Включване/достъп', 'Оперативен разход', 'Обратимост'],
      rows: [
        { label_en: 'A. Universal', label_bg: 'A. Универсална', cells_en: ['A. Universal', 'High', 'High', 'High', 'Low', 'High', 'Low'], cells_bg: ['A. Универсална', 'Високо', 'Високо', 'Високо', 'Ниско', 'Висок', 'Ниска'] },
        { label_en: 'B. Risk-based', label_bg: 'B. На база риск', cells_en: ['B. Risk-based', 'Medium', 'Low', 'Medium', 'Medium', 'Medium', 'Medium'], cells_bg: ['B. На база риск', 'Средно', 'Ниско', 'Средно', 'Средно', 'Среден', 'Средна'] },
        { label_en: 'C. Host-controlled', label_bg: 'C. Контролирана от домакина', cells_en: ['C. Host-controlled', 'Medium', 'Medium', 'Medium', 'Low', 'Low', 'High'], cells_bg: ['C. Контролирана от домакина', 'Средно', 'Средно', 'Средно', 'Ниско', 'Нисък', 'Висока'] },
        { label_en: 'D. Protections only', label_bg: 'D. Само защити', cells_en: ['D. Protections only', 'Low', 'Low', 'Low', 'High', 'Medium', 'High'], cells_bg: ['D. Само защити', 'Ниско', 'Ниско', 'Ниско', 'Високо', 'Среден', 'Висока'] },
      ],
      caveat_en: 'These Low/Medium/High ratings are case assumptions, not measured data. If you disagree with a rating, say so in your memo and justify the change.',
      caveat_bg: 'Оценките Ниско/Средно/Високо са допускания в казуса, а не измерени данни. Ако не си съгласен с дадена оценка, кажи го в меморандума си и обоснови промяната.',
    },
  ],
  deliverable: {
    title_en: 'Deliverable — one-page decision memo',
    title_bg: 'Резултат — меморандум за решение на една страница',
    brief_en: 'Write a one-page decision memo to the product team recommending one trust policy for a context you define. Use the exhibits and sources; label what is fact, what is your interpretation and what you are assuming.',
    brief_bg: 'Напиши меморандум за решение на една страница до продуктовия екип, в който препоръчваш една политика за доверие в контекст, който сам определяш. Използвай приложенията и източниците; отбележи кое е факт, кое е твоя интерпретация и какво допускаш.',
    requirements: [
      { en: 'Your decision and the exact segment or context it applies to.', bg: 'Твоето решение и точният сегмент или контекст, за който важи.' },
      { en: 'Three verified facts, each with a source or exhibit ID (S1–S10, A–D).', bg: 'Три проверени факта, всеки с идентификатор на източник или приложение (S1–S10, A–D).' },
      { en: 'Two interpretations, clearly labelled as interpretation.', bg: 'Две интерпретации, ясно обозначени като интерпретация.' },
      { en: 'Two explicit assumptions you are making.', bg: 'Две изрични допускания, които правиш.' },
      { en: 'A comparison with at least two other platforms (Exhibit C).', bg: 'Сравнение с поне две други платформи (Приложение C).' },
      { en: 'Benefits, harms and trade-offs for at least three stakeholder groups.', bg: 'Ползи, вреди и компромиси за поне три групи заинтересовани страни.' },
      { en: 'Two success metrics and two guardrails that would stop the rollout.', bg: 'Два показателя за успех и две предпазни граници, които биха спрели въвеждането.' },
      { en: 'One small reversible pilot: where, how long, and how you would undo it.', bg: 'Един малък обратим пилот: къде, за колко време и как би го отменил.' },
    ],
    min_words: 250,
    max_words: 450,
  },
  reflection_en: 'What evidence could change your decision? Name the specific result you would need to see to switch to a different option.',
  reflection_bg: 'Какво доказателство би променило решението ти? Назови конкретния резултат, който трябва да видиш, за да минеш към друг вариант.',
  source_ids: ['S1', 'S2', 'S3', 'S4', 'S5', 'S8', 'S9', 'S10'],
};

/* ------------------------------------------------------------------ */
/* Teacher pack (never rendered in the student player)                 */
/* ------------------------------------------------------------------ */

export const NETWORK_EFFECTS_TEACHER_PACK: TeacherPack = {
  rubric_dimensions: SHARED_RUBRIC_DIMENSIONS,
  rubric_anchors: SHARED_RUBRIC_ANCHORS,
  evidence_checklist: [
    { en: 'Facts are cited with a source or exhibit ID.', bg: 'Фактите са цитирани с идентификатор на източник или приложение.' },
    { en: 'Interpretations are labelled as interpretations.', bg: 'Интерпретациите са обозначени като интерпретации.' },
    { en: 'Assumptions are stated explicitly.', bg: 'Допусканията са заявени изрично.' },
    { en: 'At least two other platforms are compared.', bg: 'Сравнени са поне още две платформи.' },
    { en: 'At least three stakeholder groups are considered.', bg: 'Разгледани са поне три групи заинтересовани страни.' },
    { en: 'Success metrics and guardrails are both present.', bg: 'Има както показатели за успех, така и предпазни граници.' },
    { en: 'The pilot is small and genuinely reversible.', bg: 'Пилотът е малък и наистина обратим.' },
    { en: 'No fabricated data or invented sources.', bg: 'Няма измислени данни или измислени източници.' },
  ],
  model_answer_en:
    'Strong sample recommendation: risk-based enhanced verification (Option B) for a defined higher-risk context, paired with safeguards — a human appeal route and an alternative path for users without accepted documents, data minimisation, a clear explanation shown to the user, limited retention, and active monitoring for false positives and for exclusion of specific groups. Other options can earn full marks: A, C or D are all defensible when the student defines the context, uses the exhibits, weighs trade-offs honestly and names the groups who carry the cost. Grade the reasoning and the evidence, not the option chosen.',
  model_answer_bg:
    'Силна примерна препоръка: разширена верификация на база риск (Вариант B) за ясно определен контекст с по-висок риск, придружена с предпазни мерки — човешки път за обжалване и алтернативен път за хора без приемани документи, минимизиране на данните, ясно обяснение към потребителя, ограничен срок на съхранение и активно наблюдение за фалшиви положителни резултати и за изключване на определени групи. Другите варианти също могат да получат пълна оценка: A, C и D са защитими, когато ученикът определи контекста, използва приложенията, претегли честно компромисите и назове кой носи разхода. Оценявай разсъжденията и доказателствата, а не избрания вариант.',
  common_errors: [
    { en: 'Equating user growth with a network effect.', bg: 'Приравняване на ръста на потребители с мрежови ефект.' },
    { en: 'Treating n² as a valuation or as a critical-mass calculation.', bg: 'Третиране на n² като оценка или като изчисление на критична маса.' },
    { en: 'Assuming a winner-take-all outcome.', bg: 'Допускане, че резултатът е „победителят взема всичко“.' },
    { en: 'Using global totals as evidence of local liquidity.', bg: 'Използване на глобални суми като доказателство за локална ликвидност.' },
    { en: 'Ignoring multi-homing.', bg: 'Игнориране на multi-homing.' },
    { en: 'Treating verification as a guarantee of trustworthiness.', bg: 'Третиране на верификацията като гаранция за надеждност.' },
    { en: 'Ignoring privacy and inclusion costs.', bg: 'Игнориране на разходите за поверителност и включване.' },
    { en: 'Citing an exhibit without actually using it in the argument.', bg: 'Цитиране на приложение, без то реално да се използва в аргумента.' },
  ],
  feedback_prompts: [
    { en: 'Which claim needs a source?', bg: 'Кое твърдение има нужда от източник?' },
    { en: 'Which assumption is doing the most work?', bg: 'Кое допускане върши най-много работа?' },
    { en: 'What is the strongest counterargument?', bg: 'Кой е най-силният контрааргумент?' },
    { en: 'Who bears the cost or the risk?', bg: 'Кой носи разхода или риска?' },
    { en: 'What would make the pilot reversible?', bg: 'Какво би направило пилота обратим?' },
    { en: 'What evidence would change your decision?', bg: 'Какво доказателство би променило решението ти?' },
  ],
};