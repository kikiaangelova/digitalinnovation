export interface IndustryDomain {
  id: string;
  nameEn: string;
  nameBg: string;
  icon: string;
  color: string;
  descriptionEn: string;
  descriptionBg: string;
  trendsEn: string[];
  trendsBg: string[];
  /** Maps to case_studies.topic values that belong to this industry */
  topicKeys: string[];
}

export const INDUSTRY_DOMAINS: IndustryDomain[] = [
  {
    id: 'ai-data',
    nameEn: 'AI & Data',
    nameBg: 'ИИ и Данни',
    icon: 'Brain',
    color: 'hsl(var(--chart-1))',
    descriptionEn:
      'Artificial Intelligence and Data Science are reshaping every sector of the economy. From machine learning algorithms that predict consumer behavior to natural language processing powering virtual assistants, AI is the backbone of modern digital innovation. Companies like Google DeepMind, OpenAI, and NVIDIA lead breakthroughs in generative AI, autonomous systems, and data analytics. Digital transformation in this domain focuses on automating decision-making, extracting insights from massive datasets, and building intelligent systems that learn and adapt. Startups leverage AI for personalized recommendations, fraud detection, medical diagnostics, and supply chain optimization. The ethical dimensions — algorithmic bias, data privacy, and job displacement — make this a critical area for strategic analysis.',
    descriptionBg:
      'Изкуственият интелект и науката за данни преобразяват всеки сектор от икономиката. От алгоритми за машинно обучение, прогнозиращи потребителското поведение, до обработка на естествен език, захранващ виртуални асистенти — ИИ е гръбнакът на модерната дигитална иновация. Компании като Google DeepMind, OpenAI и NVIDIA водят пробивите в генеративния ИИ, автономните системи и анализа на данни. Дигиталната трансформация в тази област се фокусира върху автоматизиране на решения, извличане на прозрения от масивни набори от данни и изграждане на интелигентни системи, които учат и се адаптират. Стартъпите използват ИИ за персонализирани препоръки, откриване на измами, медицинска диагностика и оптимизация на веригата за доставки. Етичните измерения — алгоритмична предубеденост, поверителност на данните и изместване на работни места — правят тази област критична за стратегически анализ.',
    trendsEn: ['Generative AI & LLMs', 'Edge AI & TinyML', 'AI Ethics & Governance', 'Autonomous Systems'],
    trendsBg: ['Генеративен ИИ и LLM', 'Edge AI и TinyML', 'Етика и управление на ИИ', 'Автономни системи'],
    topicKeys: ['AI', 'AI & Data', 'Data', 'AI Ethics', 'Algorithm'],
  },
  {
    id: 'fintech',
    nameEn: 'FinTech',
    nameBg: 'Финтех',
    icon: 'Landmark',
    color: 'hsl(var(--chart-2))',
    descriptionEn:
      'Financial Technology — FinTech — is revolutionizing how people and businesses manage money. Digital banking, mobile payments, blockchain, and robo-advisors are disrupting traditional financial institutions. Companies like Revolut, Stripe, Square, and Klarna have redefined payments, lending, and investing. The sector thrives on regulatory innovation (open banking, PSD2), decentralized finance (DeFi), and embedded finance — integrating financial services into non-financial platforms. FinTech startups focus on financial inclusion, reducing transaction costs, and creating seamless user experiences. Understanding customer acquisition cost (CAC), lifetime value (LTV), and regulatory compliance is essential for analyzing this rapidly evolving industry.',
    descriptionBg:
      'Финансовите технологии — FinTech — революционизират начина, по който хората и бизнесите управляват парите. Дигиталното банкиране, мобилните плащания, блокчейн и робо-съветниците разрушават традиционните финансови институции. Компании като Revolut, Stripe, Square и Klarna предефинират плащанията, кредитирането и инвестирането. Секторът процъфтява с регулаторни иновации (отворено банкиране, PSD2), децентрализирани финанси (DeFi) и вградени финанси — интегриране на финансови услуги в нефинансови платформи. FinTech стартъпите се фокусират върху финансово включване, намаляване на транзакционните разходи и създаване на безпроблемни потребителски изживявания.',
    trendsEn: ['Open Banking & BaaS', 'DeFi & Blockchain', 'Embedded Finance', 'RegTech & Compliance AI'],
    trendsBg: ['Отворено банкиране и BaaS', 'DeFi и Блокчейн', 'Вградени финанси', 'RegTech и ИИ за съответствие'],
    topicKeys: ['FinTech', 'Finance', 'Banking', 'Digital Banking'],
  },
  {
    id: 'edtech',
    nameEn: 'EdTech',
    nameBg: 'Образователни технологии',
    icon: 'GraduationCap',
    color: 'hsl(var(--chart-3))',
    descriptionEn:
      'Educational Technology is transforming how knowledge is delivered, consumed, and assessed. From massive open online courses (MOOCs) to AI-powered tutoring systems, EdTech bridges gaps in access and personalization. Companies like Coursera, Duolingo, Khan Academy, and Kahoot! demonstrate how technology can scale high-quality education globally. Key innovations include adaptive learning platforms that adjust to student pace, gamification that increases engagement, and learning analytics that provide data-driven insights to educators. The COVID-19 pandemic accelerated adoption, making digital learning the norm. Strategic challenges include maintaining learning quality, measuring real outcomes versus completion rates, and addressing digital equity.',
    descriptionBg:
      'Образователните технологии трансформират начина, по който знанието се предоставя, потребява и оценява. От масови отворени онлайн курсове (MOOCs) до системи за обучение с ИИ, EdTech преодолява пропуски в достъпа и персонализацията. Компании като Coursera, Duolingo, Khan Academy и Kahoot! демонстрират как технологията може да мащабира качествено образование глобално. Ключовите иновации включват адаптивни платформи за обучение, геймификация и аналитика на ученето.',
    trendsEn: ['AI Tutoring & Adaptive Learning', 'Micro-credentials & Badges', 'Gamification', 'Learning Analytics'],
    trendsBg: ['ИИ обучение и адаптивно учене', 'Микро-сертификати и бадж', 'Геймификация', 'Аналитика на ученето'],
    topicKeys: ['Education', 'EdTech', 'Learning'],
  },
  {
    id: 'smart-cities',
    nameEn: 'Smart Cities',
    nameBg: 'Умни градове',
    icon: 'Building2',
    color: 'hsl(var(--chart-4))',
    descriptionEn:
      'Smart Cities leverage IoT sensors, data platforms, and AI to optimize urban infrastructure — from transportation and energy to public safety and waste management. Cities like Singapore, Barcelona, and Copenhagen are pioneers, using digital twins, connected traffic systems, and citizen engagement platforms. The concept extends to smart buildings, autonomous public transit, and predictive maintenance of urban infrastructure. Digital innovation transforms city governance by enabling real-time decision-making, reducing emissions, and improving quality of life. Challenges include data privacy, interoperability of systems, digital divide, and the massive capital investments required.',
    descriptionBg:
      'Умните градове използват IoT сензори, платформи за данни и ИИ за оптимизиране на градската инфраструктура — от транспорт и енергия до обществена безопасност и управление на отпадъците. Градове като Сингапур, Барселона и Копенхаген са пионери, използващи дигитални близнаци, свързани транспортни системи и платформи за гражданско участие. Дигиталната иновация трансформира градското управление чрез вземане на решения в реално време, намаляване на емисиите и подобряване на качеството на живот.',
    trendsEn: ['Digital Twins', 'IoT & Sensor Networks', 'Smart Mobility', 'Citizen Data Platforms'],
    trendsBg: ['Дигитални близнаци', 'IoT и сензорни мрежи', 'Умна мобилност', 'Граждански платформи за данни'],
    topicKeys: ['Smart Cities', 'Urban', 'Cities', 'Digital Twin'],
  },
  {
    id: 'platform-economy',
    nameEn: 'Platform Economy',
    nameBg: 'Платформена икономика',
    icon: 'Network',
    color: 'hsl(var(--chart-5))',
    descriptionEn:
      'The Platform Economy describes business models built on digital platforms that facilitate exchanges between producers and consumers. Companies like Uber, Airbnb, Amazon, and Spotify have created enormous value through network effects — the more users join, the more valuable the platform becomes. Platform business models differ from traditional linear models by acting as intermediaries that scale without owning inventory. Key strategic concepts include multi-sided markets, winner-take-all dynamics, platform governance, and data-driven personalization. Understanding how platforms create, capture, and distribute value is essential for modern business strategy.',
    descriptionBg:
      'Платформената икономика описва бизнес модели, изградени върху дигитални платформи, които улесняват обмена между производители и потребители. Компании като Uber, Airbnb, Amazon и Spotify са създали огромна стойност чрез мрежови ефекти — колкото повече потребители се присъединяват, толкова по-ценна става платформата. Платформените бизнес модели се различават от традиционните линейни модели, действайки като посредници, които мащабират без да притежават инвентар. Ключовите стратегически концепции включват многостранни пазари, динамики "победител взема всичко" и управление на платформи.',
    trendsEn: ['Network Effects & Virality', 'Creator Economy', 'Platform Governance', 'API-first Business Models'],
    trendsBg: ['Мрежови ефекти и виралност', 'Създателска икономика', 'Управление на платформи', 'API-first бизнес модели'],
    topicKeys: ['Platform Economy', 'Platform', 'Network Effects', 'Marketplace'],
  },
  {
    id: 'digital-health',
    nameEn: 'Digital Health',
    nameBg: 'Дигитално здраве',
    icon: 'HeartPulse',
    color: 'hsl(var(--primary))',
    descriptionEn:
      'Digital Health encompasses the use of technology to improve healthcare delivery, patient outcomes, and medical research. Telemedicine, wearable health devices, electronic health records (EHRs), and AI-powered diagnostics are transforming medicine. Companies like Babylon Health, Fitbit (Google), and Tempus demonstrate how data and algorithms can democratize healthcare access and accelerate drug discovery. The pandemic proved the value of digital health infrastructure — from contact tracing apps to remote patient monitoring. Key challenges include regulatory approval, data interoperability, patient privacy (HIPAA, GDPR), and ensuring equitable access to digital health tools.',
    descriptionBg:
      'Дигиталното здраве обхваща използването на технологии за подобряване на здравното обслужване, резултатите за пациентите и медицинските изследвания. Телемедицина, носими здравни устройства, електронни здравни досиета и ИИ диагностика трансформират медицината. Компании като Babylon Health, Fitbit и Tempus демонстрират как данните и алгоритмите могат да демократизират достъпа до здравеопазване и да ускорят откриването на лекарства.',
    trendsEn: ['Telemedicine & Remote Monitoring', 'AI Diagnostics', 'Wearable Health Tech', 'Genomics & Precision Medicine'],
    trendsBg: ['Телемедицина и дистанционен мониторинг', 'ИИ диагностика', 'Носими здравни технологии', 'Геномика и прецизна медицина'],
    topicKeys: ['Digital Health', 'Health', 'Healthcare', 'MedTech'],
  },
  {
    id: 'industry-4',
    nameEn: 'Industry 4.0',
    nameBg: 'Индустрия 4.0',
    icon: 'Factory',
    color: 'hsl(var(--accent))',
    descriptionEn:
      'Industry 4.0 represents the fourth industrial revolution — the convergence of digital technologies with manufacturing and production. Smart factories use IoT, robotics, AI, and digital twins to optimize production lines, predict equipment failures, and customize products at scale. Companies like Siemens, Tesla, and Bosch lead the transformation with connected manufacturing systems. Key concepts include cyber-physical systems, predictive maintenance, additive manufacturing (3D printing), and supply chain digitalization. Tesla\'s Gigafactories exemplify how software-defined manufacturing creates competitive advantages through continuous optimization and vertical integration.',
    descriptionBg:
      'Индустрия 4.0 представлява четвъртата индустриална революция — сливането на дигиталните технологии с производството. Умните фабрики използват IoT, роботика, ИИ и дигитални близнаци за оптимизиране на производствени линии, прогнозиране на повреди и персонализиране на продукти в мащаб. Компании като Siemens, Tesla и Bosch водят трансформацията. Ключовите концепции включват кибер-физически системи, прогнозна поддръжка, адитивно производство и дигитализация на веригата за доставки.',
    trendsEn: ['Smart Factories & IoT', 'Predictive Maintenance', '3D Printing & Additive Mfg', 'Digital Supply Chains'],
    trendsBg: ['Умни фабрики и IoT', 'Прогнозна поддръжка', '3D принтиране', 'Дигитални вериги за доставки'],
    topicKeys: ['Industry 4.0', 'Manufacturing', 'Tesla', 'Digital Manufacturing'],
  },
  {
    id: 'agritech',
    nameEn: 'Agriculture & AgriTech',
    nameBg: 'Земеделие и АгриТех',
    icon: 'Sprout',
    color: 'hsl(var(--chart-3))',
    descriptionEn:
      'AgriTech applies digital innovation to agriculture — one of the world\'s oldest industries. Precision farming uses drones, satellite imagery, and IoT soil sensors to optimize crop yields while reducing water and fertilizer use. Companies like John Deere (autonomous tractors), Indigo Agriculture, and CropX are digitizing farm management. AI-powered platforms predict weather impacts, detect plant diseases from images, and optimize supply chains from farm to table. Vertical farming and lab-grown food represent frontier innovations. Key challenges include rural connectivity, farmer adoption of technology, and balancing productivity with environmental sustainability.',
    descriptionBg:
      'АгриТех прилага дигитални иновации в земеделието — една от най-старите индустрии в света. Прецизното земеделие използва дронове, сателитни изображения и IoT сензори за почвата за оптимизиране на добивите, като същевременно намалява употребата на вода и торове. Компании като John Deere, Indigo Agriculture и CropX дигитализират управлението на фермите. ИИ платформи предсказват въздействието на времето, откриват болести по растенията от изображения и оптимизират веригите за доставки.',
    trendsEn: ['Precision Farming & Drones', 'AI Crop Analytics', 'Vertical Farming', 'Farm-to-Table Platforms'],
    trendsBg: ['Прецизно земеделие и дронове', 'ИИ анализ на култури', 'Вертикално земеделие', 'Платформи от ферма до маса'],
    topicKeys: ['Agriculture', 'AgriTech', 'Farming'],
  },
  {
    id: 'tourism',
    nameEn: 'Tourism & Digital Platforms',
    nameBg: 'Туризъм и дигитални платформи',
    icon: 'Plane',
    color: 'hsl(var(--chart-1))',
    descriptionEn:
      'Digital platforms have fundamentally reshaped the tourism and hospitality industry. From Booking.com and Airbnb to TripAdvisor and Google Travel, technology has shifted power from traditional operators to platform ecosystems. Innovations include dynamic pricing algorithms, AI-powered personalization, virtual tours, and contactless check-in. The industry faces unique challenges: managing overtourism through data, building sustainable tourism models, and rebuilding post-pandemic. Digital transformation enables small businesses to reach global audiences while large platforms leverage data to optimize the entire travel experience from discovery to post-trip reviews.',
    descriptionBg:
      'Дигиталните платформи фундаментално преобразиха индустрията за туризъм и гостоприемство. От Booking.com и Airbnb до TripAdvisor и Google Travel, технологията прехвърли властта от традиционните оператори към платформени екосистеми. Иновациите включват алгоритми за динамично ценообразуване, персонализация с ИИ, виртуални обиколки и безконтактно настаняване. Дигиталната трансформация позволява на малкия бизнес да достигне глобална аудитория.',
    trendsEn: ['AI Travel Personalization', 'Sustainable Tourism Tech', 'Virtual & AR Tourism', 'Dynamic Pricing'],
    trendsBg: ['ИИ персонализация на пътуванията', 'Устойчив туризъм', 'Виртуален и AR туризъм', 'Динамично ценообразуване'],
    topicKeys: ['Tourism', 'Travel', 'Hospitality'],
  },
  {
    id: 'digital-retail',
    nameEn: 'Digital Retail',
    nameBg: 'Дигитален ритейл',
    icon: 'ShoppingCart',
    color: 'hsl(var(--chart-2))',
    descriptionEn:
      'Digital Retail — or e-commerce — encompasses the transformation of how goods are bought, sold, and delivered. Amazon, Shopify, Alibaba, and Zalando have created massive digital marketplaces that challenge traditional brick-and-mortar retail. Key innovations include omnichannel strategies (seamlessly connecting online and offline), AI-powered product recommendations, same-day delivery logistics, and social commerce. The rise of direct-to-consumer (D2C) brands demonstrates how digital tools reduce intermediaries and build direct customer relationships. Challenges include last-mile delivery costs, return logistics, data privacy in personalization, and competing against platform giants.',
    descriptionBg:
      'Дигиталният ритейл — или електронна търговия — обхваща трансформацията на начина, по който стоките се купуват, продават и доставят. Amazon, Shopify, Alibaba и Zalando са създали масивни дигитални пазари, които предизвикват традиционния физически ритейл. Ключовите иновации включват омниканални стратегии, ИИ препоръки за продукти, логистика за доставка в същия ден и социална търговия. Възходът на D2C марките демонстрира как дигиталните инструменти намаляват посредниците.',
    trendsEn: ['Omnichannel Commerce', 'AI Recommendations', 'Social Commerce', 'D2C & Subscription Models'],
    trendsBg: ['Омниканална търговия', 'ИИ препоръки', 'Социална търговия', 'D2C и абонаментни модели'],
    topicKeys: ['Retail', 'E-commerce', 'Commerce', 'Digital Retail'],
  },
];

/**
 * Match a case study topic to an industry domain.
 * Falls back to 'ai-data' if no match found.
 */
export function matchCaseToIndustry(topic: string | null): string {
  if (!topic) return 'ai-data';
  const lower = topic.toLowerCase();
  for (const domain of INDUSTRY_DOMAINS) {
    if (domain.topicKeys.some(k => lower.includes(k.toLowerCase()))) {
      return domain.id;
    }
  }
  return 'ai-data';
}
