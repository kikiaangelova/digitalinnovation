
-- ============================================================
-- Case Study 3: Shkolo – Education Platform Scaling
-- ============================================================
INSERT INTO public.case_studies (id, title, title_bg, description, description_bg, topic, topic_bg, difficulty, est_minutes, published, outcomes, outcomes_bg)
VALUES (
  'a1000001-0001-0001-0003-000000000001',
  'Shkolo: Scaling Under Crisis',
  'Shkolo: Мащабиране по време на криза',
  'Discover how a Bulgarian education platform survived a 100x traffic surge during COVID-19 by migrating to cloud infrastructure under extreme pressure.',
  'Открийте как българска образователна платформа преживя 100-кратно увеличение на трафика по време на COVID-19 чрез миграция към облачна инфраструктура.',
  'EdTech & Cloud', 'Образователни технологии и облак',
  'beginner', 40, true,
  ARRAY['Understand cloud infrastructure scaling', 'Analyze crisis decision-making', 'Evaluate platform business models in education'],
  ARRAY['Разбиране на мащабиране на облачна инфраструктура', 'Анализ на вземане на решения в криза', 'Оценка на платформени бизнес модели в образованието']
);

INSERT INTO public.case_steps (id, case_study_id, step_order, title, title_bg, narrative, narrative_bg, exhibit_text, exhibit_text_bg) VALUES
('a1000001-0001-0001-0003-000000000010', 'a1000001-0001-0001-0003-000000000001', 0,
 'Research & Reading', 'Проучване',
 'Research how cloud platforms like AWS, Azure, or Google Cloud help applications scale during unexpected demand spikes. What is auto-scaling?',
 'Проучете как облачни платформи като AWS, Azure или Google Cloud помагат на приложения да се мащабират при неочаквано търсене. Какво е автоматично мащабиране?',
 NULL, NULL),

('a1000001-0001-0001-0003-000000000011', 'a1000001-0001-0001-0003-000000000001', 1,
 'The Shkolo Story', 'Историята на Shkolo',
 'Shkolo (Школо) was one of Bulgaria''s leading digital education platforms, serving schools across the country with electronic gradebooks, scheduling, and communication tools for teachers, students, and parents.

Before COVID-19, the platform operated smoothly with predictable traffic patterns — peaks during school hours, quiet evenings and weekends. The infrastructure was hosted on traditional servers, adequate for the normal load of a few hundred thousand daily users.

Then came March 2020.

When Bulgaria declared a state of emergency and schools closed overnight, Shkolo became the lifeline for the entire education system. Traffic exploded from manageable levels to over one million simultaneous users. The existing infrastructure buckled immediately — pages wouldn''t load, the database crashed repeatedly, and teachers couldn''t record grades or communicate with students.

The team faced an impossible timeline: migrate the entire platform to AWS cloud infrastructure while millions of users depended on the service daily. They had days, not months, to make architectural decisions that would normally take quarters of careful planning.

Working around the clock, the engineering team performed a live migration to AWS, implementing auto-scaling, database replication, and content delivery networks. The migration happened while the platform was serving hundreds of thousands of active users — like changing the engine of a plane mid-flight.',
 'Школо беше една от водещите дигитални образователни платформи в България, обслужваща училища с електронни дневници, разписания и комуникационни инструменти за учители, ученици и родители.

Преди COVID-19 платформата работеше гладко с предвидими модели на трафик. Инфраструктурата беше на традиционни сървъри, достатъчни за нормалното натоварване от няколкостотин хиляди потребители.

После дойде март 2020.

Когато България обяви извънредно положение и училищата затвориха за една нощ, Школо стана спасителната линия на цялата образователна система. Трафикът експлодира до над милион едновременни потребители. Съществуващата инфраструктура се срина незабавно.

Екипът трябваше да мигрира цялата платформа към AWS облачна инфраструктура, докато милиони потребители зависеха от услугата ежедневно. Имаха дни, не месеци, за архитектурни решения.

Работейки денонощно, инженерният екип извърши миграция на живо към AWS, внедрявайки автоматично мащабиране, репликация на базата данни и мрежи за доставка на съдържание. Миграцията се случи докато платформата обслужваше стотици хиляди активни потребители.',
 NULL, NULL),

('a1000001-0001-0001-0003-000000000012', 'a1000001-0001-0001-0003-000000000001', 2,
 'The Strategic Dilemma', 'Стратегическата дилема',
 'The Shkolo team faces a critical architecture decision under extreme time pressure.',
 'Екипът на Школо е изправен пред критично архитектурно решение при екстремен натиск.',
 'STRATEGIC DILEMMA:

Should Shkolo completely redesign its architecture for the cloud (microservices) or rapidly scale the existing monolithic application on AWS?

Option A — Full Cloud-Native Redesign:
• Rewrite as microservices
• Timeline: 3-6 months
• Better long-term scalability
• Risk: Platform may be unusable for weeks during transition

Option B — Lift-and-Shift with Auto-Scaling:
• Move existing application to AWS as-is
• Add auto-scaling and load balancing
• Timeline: 1-2 weeks
• Risk: Technical debt remains, may face scaling limits later

KEY METRICS:
┌──────────────────────────────┬────────────────────┐
│ Metric                       │ Value              │
├──────────────────────────────┼────────────────────┤
│ Pre-COVID Daily Users        │ ~200,000           │
│ Peak COVID Users             │ 1,000,000+         │
│ Traffic Increase             │ 500%               │
│ Server Downtime (first week) │ 12+ hours          │
│ Migration Timeline           │ 72 hours           │
│ AWS Cost (monthly)           │ ~$15,000           │
│ Previous Hosting Cost        │ ~$2,000/month      │
│ Schools Served               │ 2,500+             │
└──────────────────────────────┴────────────────────┘',
 'СТРАТЕГИЧЕСКА ДИЛЕМА:

Трябва ли Школо да преработи напълно архитектурата си за облака (микросървиси) или бързо да мащабира съществуващото приложение на AWS?

Опция А — Пълен облачен редизайн:
• Пренаписване като микросървиси
• Срок: 3-6 месеца
• По-добра дългосрочна мащабируемост
• Риск: Платформата може да е неизползваема седмици

Опция Б — Бърза миграция с авто-мащабиране:
• Преместване на съществуващото приложение към AWS
• Добавяне на авто-мащабиране и балансиране
• Срок: 1-2 седмици
• Риск: Технически дълг остава

КЛЮЧОВИ МЕТРИКИ:
┌──────────────────────────────┬────────────────────┐
│ Метрика                      │ Стойност           │
├──────────────────────────────┼────────────────────┤
│ Потребители преди COVID      │ ~200 000           │
│ Пикови COVID потребители     │ 1 000 000+         │
│ Увеличение на трафика        │ 500%               │
│ Престой на сървъра           │ 12+ часа           │
│ Срок на миграция             │ 72 часа            │
│ AWS цена (месечно)           │ ~$15 000           │
│ Предишна цена за хостинг     │ ~$2 000/месец      │
│ Обслужвани училища           │ 2 500+             │
└──────────────────────────────┴────────────────────┘'),

('a1000001-0001-0001-0003-000000000013', 'a1000001-0001-0001-0003-000000000001', 3,
 'Strategic Analysis', 'Стратегически анализ',
 'Analyze the trade-offs between both options and the unique constraints of a crisis environment.',
 'Анализирайте компромисите между двете опции и уникалните ограничения на кризисна среда.',
 NULL, NULL),

('a1000001-0001-0001-0003-000000000014', 'a1000001-0001-0001-0003-000000000001', 4,
 'Your Strategic Decision', 'Вашето стратегическо решение',
 'Choose and justify the infrastructure strategy for Shkolo.',
 'Изберете и обосновете инфраструктурната стратегия за Школо.',
 NULL, NULL),

('a1000001-0001-0001-0003-000000000015', 'a1000001-0001-0001-0003-000000000001', 5,
 'Case Insight', 'Извод от казуса',
 'Reflect on the key lessons from the Shkolo case.',
 'Размислете над ключовите уроци от казуса на Школо.',
 'KEY INSIGHT:
Shkolo chose Option B — the pragmatic lift-and-shift approach — and it worked. The platform was migrated to AWS in approximately 72 hours and successfully served over one million users. The lesson: in crisis situations, perfect is the enemy of good. A working solution now beats an ideal solution later. After stabilizing, the team gradually refactored toward a more cloud-native architecture.

LEARNING OUTCOME:
• Cloud infrastructure scaling strategies
• Crisis decision-making in technology
• Platform business models in education
• Technical debt management',
 'КЛЮЧОВ ИЗВОД:
Школо избра Опция Б — прагматичния подход за бърза миграция — и проработи. Платформата беше мигрирана към AWS за около 72 часа и успешно обслужи над милион потребители. Урокът: в кризисни ситуации перфектното е враг на доброто.

УЧЕБЕН РЕЗУЛТАТ:
• Стратегии за мащабиране на облачна инфраструктура
• Вземане на решения в криза
• Платформени бизнес модели в образованието
• Управление на технически дълг');

-- Questions for Shkolo
INSERT INTO public.questions (id, case_step_id, question_order, type, prompt, prompt_bg, options, points) VALUES
('a1000001-0001-0001-0003-000000000100', 'a1000001-0001-0001-0003-000000000010', 1, 'long_answer',
 'Research cloud computing and auto-scaling. How do platforms like Netflix or Zoom handle sudden traffic spikes? (minimum 100 words)',
 'Проучете облачните изчисления и авто-мащабирането. Как платформи като Netflix или Zoom се справят с внезапни пикове на трафика? (минимум 100 думи)', NULL, 10),

('a1000001-0001-0001-0003-000000000101', 'a1000001-0001-0001-0003-000000000013', 1, 'long_answer',
 'What are the key advantages and risks of migrating a live application to cloud infrastructure during a crisis?',
 'Какви са ключовите предимства и рискове при миграция на работещо приложение към облачна инфраструктура по време на криза?', NULL, 15),
('a1000001-0001-0001-0003-000000000102', 'a1000001-0001-0001-0003-000000000013', 2, 'long_answer',
 'How does the 500% traffic increase change Shkolo''s business model and revenue potential? What monetization strategies would you recommend?',
 'Как 500% увеличението на трафика променя бизнес модела и потенциала за приходи на Школо? Какви стратегии за монетизация бихте препоръчали?', NULL, 15),
('a1000001-0001-0001-0003-000000000103', 'a1000001-0001-0001-0003-000000000013', 3, 'ranking',
 'Rank these factors by priority when making infrastructure decisions under crisis:',
 'Подредете тези фактори по приоритет при вземане на инфраструктурни решения в криза:',
 '["Speed of implementation", "Long-term scalability", "Cost efficiency", "Data security", "User experience"]'::jsonb, 10),

('a1000001-0001-0001-0003-000000000104', 'a1000001-0001-0001-0003-000000000014', 1, 'multiple_choice',
 'Which infrastructure strategy should Shkolo choose?',
 'Коя инфраструктурна стратегия трябва да избере Школо?',
 '["Full cloud-native redesign (microservices)", "Lift-and-shift to AWS with auto-scaling", "Hybrid: Lift-and-shift now, gradual refactoring later", "Multi-cloud strategy across AWS and Google Cloud"]'::jsonb, 10),
('a1000001-0001-0001-0003-000000000105', 'a1000001-0001-0001-0003-000000000014', 2, 'long_answer',
 'Justify your infrastructure decision. Consider the crisis timeline, user impact, and long-term technical implications.',
 'Обосновете инфраструктурното си решение. Помислете за кризисния срок, влиянието върху потребителите и дългосрочните технически последици.', NULL, 20),

('a1000001-0001-0001-0003-000000000106', 'a1000001-0001-0001-0003-000000000015', 1, 'long_answer',
 'What cloud infrastructure decisions should you plan for your own startup? How would you prepare for unexpected demand spikes?',
 'Какви решения за облачна инфраструктура трябва да планирате за вашия стартъп? Как бихте се подготвили за неочаквани пикове на търсене?', NULL, 10);

-- ============================================================
-- Case Study 4: Schneider Electric Smart Factory
-- ============================================================
INSERT INTO public.case_studies (id, title, title_bg, description, description_bg, topic, topic_bg, difficulty, est_minutes, published, outcomes, outcomes_bg)
VALUES (
  'a1000001-0001-0001-0004-000000000001',
  'Schneider Electric: Industry 4.0 Smart Factory',
  'Schneider Electric: Интелигентна фабрика Индустрия 4.0',
  'Examine how a global corporation transformed its Plovdiv factory into a smart manufacturing facility using IoT, AI, and predictive maintenance.',
  'Разгледайте как глобална корпорация трансформира фабриката си в Пловдив в интелигентно производствено съоръжение чрез IoT, AI и предсказваща поддръжка.',
  'Industry 4.0 & IoT', 'Индустрия 4.0 и IoT',
  'intermediate', 50, true,
  ARRAY['Understand Industry 4.0 technologies', 'Analyze IoT and predictive maintenance ROI', 'Evaluate digital transformation in manufacturing'],
  ARRAY['Разбиране на технологиите на Индустрия 4.0', 'Анализ на ROI на IoT и предсказваща поддръжка', 'Оценка на дигитална трансформация в производството']
);

INSERT INTO public.case_steps (id, case_study_id, step_order, title, title_bg, narrative, narrative_bg, exhibit_text, exhibit_text_bg) VALUES
('a1000001-0001-0001-0004-000000000010', 'a1000001-0001-0001-0004-000000000001', 0,
 'Research & Reading', 'Проучване',
 'Research Industry 4.0 and the concept of smart factories. How do IoT sensors, AI analytics, and automation work together in modern manufacturing?',
 'Проучете Индустрия 4.0 и концепцията за интелигентни фабрики. Как IoT сензори, AI анализи и автоматизация работят заедно в съвременното производство?',
 NULL, NULL),

('a1000001-0001-0001-0004-000000000011', 'a1000001-0001-0001-0004-000000000001', 1,
 'The Smart Factory Story', 'Историята на интелигентната фабрика',
 'Schneider Electric, the global leader in energy management and industrial automation, operates a manufacturing facility in Plovdiv, Bulgaria. In 2021, the company embarked on an ambitious transformation: converting the Plovdiv plant into a fully connected smart factory — a flagship example of Industry 4.0 in Southeast Europe.

The transformation involved deploying hundreds of IoT sensors across the production floor, connecting every machine, conveyor belt, and quality control station to a centralized digital platform. The system collects real-time data on temperature, vibration, energy consumption, production speed, and product quality.

AI algorithms analyze this continuous data stream to predict equipment failures before they happen (predictive maintenance), optimize energy usage across shifts, and automatically adjust production parameters for maximum efficiency. The results were dramatic: unplanned downtime decreased by 30%, energy consumption dropped by 20%, and overall equipment effectiveness improved by 15%.

However, the transformation raised difficult questions. The $5 million investment required significant justification. Workers needed retraining, and some feared their roles would be automated away. The factory''s supply chain partners, many of them smaller Bulgarian companies, lacked compatible digital systems, creating data integration challenges.',
 'Schneider Electric, глобалният лидер в управлението на енергия и индустриалната автоматизация, оперира производствено съоръжение в Пловдив. През 2021 г. компанията започна амбициозна трансформация: превръщане на завода в напълно свързана интелигентна фабрика — водещ пример за Индустрия 4.0 в Югоизточна Европа.

Трансформацията включи разполагане на стотици IoT сензори из производствения етаж, свързващи всяка машина, конвейер и станция за качествен контрол към централизирана дигитална платформа.

AI алгоритми анализират непрекъснатия поток от данни за прогнозиране на повреди, оптимизация на енергията и автоматично настройване на производствените параметри. Резултатите бяха драматични: непланираният престой намаля с 30%, консумацията на енергия с 20%, а общата ефективност на оборудването се подобри с 15%.

Трансформацията обаче повдигна трудни въпроси. Инвестицията от $5 милиона изискваше сериозна обосновка. Работниците се нуждаеха от преквалификация, а партньорите по веригата за доставки нямаха съвместими дигитални системи.',
 NULL, NULL),

('a1000001-0001-0001-0004-000000000012', 'a1000001-0001-0001-0004-000000000001', 2,
 'The Strategic Dilemma', 'Стратегическата дилема',
 'The Plovdiv factory manager must decide the next phase of Industry 4.0 investment.',
 'Мениджърът на фабриката в Пловдив трябва да реши следващата фаза на инвестиция в Индустрия 4.0.',
 'STRATEGIC DILEMMA:

Should the Plovdiv factory invest heavily in full automation (Phase 2) or focus on extending the smart factory ecosystem to supply chain partners?

Option A — Full Automation (Phase 2):
• Deploy robotic process automation on assembly lines
• Implement computer vision for quality control
• Reduce manual labor by additional 40%
• Investment: $3M additional

Option B — Supply Chain Integration:
• Connect 50+ suppliers to the IoT platform
• Share real-time demand and inventory data
• Reduce supply chain delays by 50%
• Investment: $1.5M

KEY METRICS:
┌──────────────────────────────┬──────────────────┐
│ Metric                       │ Value            │
├──────────────────────────────┼──────────────────┤
│ Phase 1 Investment           │ $5M              │
│ Unplanned Downtime Reduction │ -30%             │
│ Energy Savings               │ -20%             │
│ Equipment Effectiveness      │ +15%             │
│ IoT Sensors Deployed         │ 500+             │
│ Data Points per Day          │ 2 million+       │
│ ROI (Phase 1)                │ 18 months        │
│ Workers Retrained            │ 200+             │
│ Supply Chain Partners        │ 85               │
└──────────────────────────────┴──────────────────┘',
 'СТРАТЕГИЧЕСКА ДИЛЕМА:

Трябва ли фабриката в Пловдив да инвестира масово в пълна автоматизация (Фаза 2) или да се фокусира върху разширяване на екосистемата към партньорите по веригата?

Опция А — Пълна автоматизация (Фаза 2):
• Роботизирана автоматизация на поточните линии
• Компютърно зрение за контрол на качеството
• Намаляване на ръчния труд с допълнителни 40%
• Инвестиция: $3M допълнително

Опция Б — Интеграция на веригата за доставки:
• Свързване на 50+ доставчици към IoT платформата
• Споделяне на данни за търсене и инвентар в реално време
• Намаляване на забавянията с 50%
• Инвестиция: $1.5M

КЛЮЧОВИ МЕТРИКИ:
┌──────────────────────────────┬──────────────────┐
│ Метрика                      │ Стойност         │
├──────────────────────────────┼──────────────────┤
│ Инвестиция Фаза 1            │ $5M              │
│ Намаляване на престой        │ -30%             │
│ Енергийни спестявания        │ -20%             │
│ Ефективност на оборудването  │ +15%             │
│ Разпределени IoT сензори     │ 500+             │
│ Данни на ден                 │ 2 милиона+       │
│ ROI (Фаза 1)                │ 18 месеца        │
│ Преквалифицирани работници   │ 200+             │
│ Партньори по веригата        │ 85               │
└──────────────────────────────┴──────────────────┘'),

('a1000001-0001-0001-0004-000000000013', 'a1000001-0001-0001-0004-000000000001', 3,
 'Strategic Analysis', 'Стратегически анализ',
 'Analyze the ROI, workforce implications, and ecosystem effects of both strategic options.',
 'Анализирайте ROI, последиците за работната сила и екосистемните ефекти на двете стратегически опции.',
 NULL, NULL),

('a1000001-0001-0001-0004-000000000014', 'a1000001-0001-0001-0004-000000000001', 4,
 'Your Strategic Decision', 'Вашето стратегическо решение',
 'Choose and justify the next phase of digital transformation for the Plovdiv factory.',
 'Изберете и обосновете следващата фаза на дигитална трансформация за фабриката в Пловдив.',
 NULL, NULL),

('a1000001-0001-0001-0004-000000000015', 'a1000001-0001-0001-0004-000000000001', 5,
 'Case Insight', 'Извод от казуса',
 'Reflect on the key lessons from the Smart Factory case.',
 'Размислете над ключовите уроци от казуса за интелигентната фабрика.',
 'KEY INSIGHT:
The Schneider Electric Plovdiv case demonstrates that Industry 4.0 transformation is not just about technology — it is about ecosystem thinking. The greatest value comes not from automating individual processes, but from connecting entire value chains with shared data. Factories that extend their digital platforms to suppliers and customers create network effects that are nearly impossible for competitors to replicate.

LEARNING OUTCOME:
• Industry 4.0 transformation strategies
• IoT and predictive maintenance implementation
• Digital ecosystem thinking in manufacturing
• ROI analysis for technology investments',
 'КЛЮЧОВ ИЗВОД:
Казусът на Schneider Electric Пловдив показва, че трансформацията към Индустрия 4.0 не е само за технологии — тя е за екосистемно мислене. Най-голямата стойност идва не от автоматизиране на отделни процеси, а от свързване на цели вериги на стойност със споделени данни.

УЧЕБЕН РЕЗУЛТАТ:
• Стратегии за трансформация към Индустрия 4.0
• Внедряване на IoT и предсказваща поддръжка
• Дигитално екосистемно мислене в производството
• ROI анализ за технологични инвестиции');

-- Questions for Schneider Electric
INSERT INTO public.questions (id, case_step_id, question_order, type, prompt, prompt_bg, options, points) VALUES
('a1000001-0001-0001-0004-000000000100', 'a1000001-0001-0001-0004-000000000010', 1, 'long_answer',
 'Research Industry 4.0 and smart factories. What technologies are involved and what benefits do they provide? (minimum 100 words)',
 'Проучете Индустрия 4.0 и интелигентните фабрики. Какви технологии са включени и какви ползи предоставят? (минимум 100 думи)', NULL, 10),

('a1000001-0001-0001-0004-000000000101', 'a1000001-0001-0001-0004-000000000013', 1, 'long_answer',
 'Compare the ROI potential of full automation vs. supply chain integration. Which option delivers more value and why?',
 'Сравнете потенциала за ROI на пълна автоматизация срещу интеграция на веригата за доставки. Коя опция доставя повече стойност и защо?', NULL, 15),
('a1000001-0001-0001-0004-000000000102', 'a1000001-0001-0001-0004-000000000013', 2, 'long_answer',
 'What are the workforce implications of further automation? How should the factory manage the transition?',
 'Какви са последиците за работната сила от допълнителна автоматизация? Как трябва фабриката да управлява прехода?', NULL, 15),
('a1000001-0001-0001-0004-000000000103', 'a1000001-0001-0001-0004-000000000013', 3, 'numeric_allocation',
 'Allocate a $5M budget across these Industry 4.0 priorities:',
 'Разпределете бюджет от $5M между тези приоритети на Индустрия 4.0:',
 '["Robotic Automation", "AI/Predictive Analytics", "Supply Chain Integration", "Worker Training", "Cybersecurity"]'::jsonb, 10),

('a1000001-0001-0001-0004-000000000104', 'a1000001-0001-0001-0004-000000000014', 1, 'multiple_choice',
 'Which strategic direction should the Plovdiv factory take?',
 'Каква стратегическа посока трябва да поеме фабриката в Пловдив?',
 '["Full automation with robotics and computer vision", "Supply chain ecosystem integration", "Balanced approach: moderate automation + key supplier integration", "Digital twin of entire factory before any further investment"]'::jsonb, 10),
('a1000001-0001-0001-0004-000000000105', 'a1000001-0001-0001-0004-000000000014', 2, 'long_answer',
 'Justify your decision. How does it maximize ROI while addressing workforce and ecosystem concerns?',
 'Обосновете решението си. Как то максимизира ROI, докато адресира загриженостите за работната сила и екосистемата?', NULL, 20),

('a1000001-0001-0001-0004-000000000106', 'a1000001-0001-0001-0004-000000000015', 1, 'long_answer',
 'How could Industry 4.0 principles (IoT, predictive analytics, automation) apply to your own startup idea, even if you are not in manufacturing?',
 'Как принципите на Индустрия 4.0 (IoT, предсказващ анализ, автоматизация) биха могли да се приложат към вашата стартъп идея, дори да не сте в производството?', NULL, 10);

-- ============================================================
-- Case Study 5: Digital Twin Sofia – Smart City
-- ============================================================
INSERT INTO public.case_studies (id, title, title_bg, description, description_bg, topic, topic_bg, difficulty, est_minutes, published, outcomes, outcomes_bg)
VALUES (
  'a1000001-0001-0001-0005-000000000001',
  'Digital Twin Sofia: Smart City Data Ecosystem',
  'Дигитален двойник на София: Екосистема за интелигентен град',
  'Explore how a digital replica of Sofia integrates sensor data, simulations, and AI to transform urban planning, transportation, and environmental management.',
  'Разгледайте как дигитален двойник на София интегрира сензорни данни, симулации и AI за трансформация на градоустройството, транспорта и околната среда.',
  'Smart Cities & Data', 'Интелигентни градове и данни',
  'advanced', 55, true,
  ARRAY['Understand digital twin technology', 'Analyze data governance in smart cities', 'Evaluate ethical use of urban data'],
  ARRAY['Разбиране на технологията за дигитални двойници', 'Анализ на управлението на данни в интелигентни градове', 'Оценка на етичното използване на градски данни']
);

INSERT INTO public.case_steps (id, case_study_id, step_order, title, title_bg, narrative, narrative_bg, exhibit_text, exhibit_text_bg) VALUES
('a1000001-0001-0001-0005-000000000010', 'a1000001-0001-0001-0005-000000000001', 0,
 'Research & Reading', 'Проучване',
 'Research the concept of digital twins and smart city technology. How do cities like Singapore, Barcelona, or Helsinki use digital twin platforms for urban planning?',
 'Проучете концепцията за дигитални двойници и технологиите за интелигентен град. Как градове като Сингапур, Барселона или Хелзинки използват дигитални двойници за градоустройство?',
 NULL, NULL),

('a1000001-0001-0001-0005-000000000011', 'a1000001-0001-0001-0005-000000000001', 1,
 'The Digital Twin Sofia Story', 'Историята на дигиталния двойник на София',
 'Sofia, Bulgaria''s capital city of nearly 1.3 million residents, launched an ambitious Digital Twin initiative — creating a complete digital replica of the city that integrates real-time data from thousands of sources to support smarter urban management.

The Digital Twin Sofia platform aggregates data from traffic sensors, air quality monitors, weather stations, public transport GPS systems, energy consumption meters, and building information models. This massive data ecosystem creates a living, breathing digital model of the city that can simulate the impact of policy decisions before they are implemented.

For example, before redesigning a major intersection, urban planners can simulate different configurations in the digital twin and measure their effects on traffic flow, pedestrian safety, air quality, and noise levels. Before approving a new building permit, the system can model how the structure will affect wind patterns, sunlight in neighboring areas, and local infrastructure capacity.

The project involves multiple stakeholders: the municipal government, Sofia University researchers, technology partners, environmental agencies, and private companies. The data collected is extraordinarily detailed — tracking movement patterns, energy usage, and environmental conditions across the entire city.

This raises profound questions about privacy, data governance, and the responsible use of technology in public spaces.',
 'София, столицата на България с почти 1,3 милиона жители, стартира амбициозна инициатива за дигитален двойник — създаване на пълна дигитална реплика на града, интегрираща данни в реално време от хиляди източници за по-интелигентно градско управление.

Платформата агрегира данни от сензори за трафик, мониторинг на качеството на въздуха, метеорологични станции, GPS системи за обществен транспорт, измервателни уреди за енергия и информационни модели на сгради.

Например, преди преустройство на кръстовище, градоустройците могат да симулират различни конфигурации и да измерят ефектите върху трафика, безопасността на пешеходците, качеството на въздуха и нивата на шум.

Проектът включва множество заинтересовани страни: общинското правителство, изследователи от Софийски университет, технологични партньори и частни компании. Събраните данни са изключително детайлни, проследявайки модели на движение, употреба на енергия и условия на околната среда в целия град.

Това повдига дълбоки въпроси за поверителност, управление на данни и отговорното използване на технологии в публичните пространства.',
 NULL, NULL),

('a1000001-0001-0001-0005-000000000012', 'a1000001-0001-0001-0005-000000000001', 2,
 'The Strategic Dilemma', 'Стратегическата дилема',
 'The Digital Twin Sofia project faces a fundamental governance question.',
 'Проектът за дигитален двойник на София е изправен пред фундаментален управленски въпрос.',
 'STRATEGIC DILEMMA:

How should Sofia use its digital twin data responsibly? Should the city prioritize maximum data collection for better services or limit data gathering to protect citizen privacy?

Option A — Maximum Data, Maximum Intelligence:
• Deploy comprehensive sensor networks everywhere
• Track individual mobility patterns for transport optimization
• Use AI for predictive policing and emergency response
• Risk: Privacy backlash, surveillance concerns

Option B — Privacy-First Smart City:
• Collect only aggregated, anonymized data
• Give citizens control over their data contributions
• Limit AI applications to non-personal scenarios
• Risk: Less accurate models, slower optimization

Option C — Open Data Platform:
• Make all non-personal data publicly available
• Enable startups and researchers to build on the platform
• Create a data marketplace for urban innovation
• Risk: Data quality, commercial exploitation

KEY METRICS:
┌──────────────────────────────┬──────────────────┐
│ Metric                       │ Value            │
├──────────────────────────────┼──────────────────┤
│ Data Sources Connected       │ 3,000+           │
│ Data Points per Day          │ 50 million+      │
│ Traffic Reduction (pilot)    │ -15%             │
│ Air Quality Improvement      │ -12% pollutants  │
│ Energy Savings (buildings)   │ -18%             │
│ Urban Planning Time Saved    │ -40%             │
│ Project Cost (3 years)       │ €12M             │
│ Stakeholder Organizations    │ 25+              │
└──────────────────────────────┴──────────────────┘',
 'СТРАТЕГИЧЕСКА ДИЛЕМА:

Как София трябва да използва данните от дигиталния двойник отговорно? Градът трябва ли да приоритизира максимално събиране на данни за по-добри услуги или да ограничи събирането за защита на поверителността?

Опция А — Максимални данни, максимален интелект:
• Сензорни мрежи навсякъде
• Проследяване на индивидуални модели на мобилност
• AI за предсказваща полицейска дейност
• Риск: Обратна реакция за поверителност

Опция Б — Интелигентен град с приоритет на поверителността:
• Само агрегирани, анонимизирани данни
• Контрол на гражданите върху данните им
• Риск: По-малко точни модели

Опция В — Отворена платформа за данни:
• Публично достъпни неперсонални данни
• Стартъпи и изследователи да надграждат платформата
• Риск: Качество на данните

КЛЮЧОВИ МЕТРИКИ:
┌──────────────────────────────┬──────────────────┐
│ Метрика                      │ Стойност         │
├──────────────────────────────┼──────────────────┤
│ Свързани източници на данни  │ 3 000+           │
│ Данни на ден                 │ 50 милиона+      │
│ Намаляване на трафик (пилот) │ -15%             │
│ Подобрение на въздуха        │ -12% замърсители │
│ Енергийни спестявания        │ -18%             │
│ Спестено време планиране     │ -40%             │
│ Цена на проекта (3 г.)      │ €12M             │
│ Организации заинтересовани   │ 25+              │
└──────────────────────────────┴──────────────────┘'),

('a1000001-0001-0001-0005-000000000013', 'a1000001-0001-0001-0005-000000000001', 3,
 'Strategic Analysis', 'Стратегически анализ',
 'Analyze the ethical, technical, and economic trade-offs of each data governance approach.',
 'Анализирайте етичните, техническите и икономическите компромиси на всеки подход за управление на данни.',
 NULL, NULL),

('a1000001-0001-0001-0005-000000000014', 'a1000001-0001-0001-0005-000000000001', 4,
 'Your Strategic Decision', 'Вашето стратегическо решение',
 'Choose and justify the data governance strategy for Digital Twin Sofia.',
 'Изберете и обосновете стратегията за управление на данни за дигиталния двойник на София.',
 NULL, NULL),

('a1000001-0001-0001-0005-000000000015', 'a1000001-0001-0001-0005-000000000001', 5,
 'Case Insight', 'Извод от казуса',
 'Reflect on the key lessons about responsible data use in smart cities.',
 'Размислете над ключовите уроци за отговорно използване на данни в интелигентните градове.',
 'KEY INSIGHT:
The Digital Twin Sofia case reveals that the most sustainable smart city strategies balance data utility with citizen trust. Cities that adopt transparent data governance frameworks — allowing citizens to understand and control how their data is used — build stronger public support and ultimately collect better quality data through voluntary participation. The open data platform approach (Option C) has proven most successful globally, creating innovation ecosystems that generate economic value while respecting privacy boundaries.

LEARNING OUTCOME:
• Smart city data ecosystem design
• Data governance and privacy frameworks
• Ethical technology deployment in public spaces
• Stakeholder management in complex digital projects',
 'КЛЮЧОВ ИЗВОД:
Казусът на дигиталния двойник на София разкрива, че най-устойчивите стратегии за интелигентен град балансират полезността на данните с доверието на гражданите. Градовете, които приемат прозрачни рамки за управление на данни, изграждат по-силна обществена подкрепа и в крайна сметка събират по-качествени данни.

УЧЕБЕН РЕЗУЛТАТ:
• Дизайн на екосистема за данни в интелигентен град
• Управление на данни и рамки за поверителност
• Етично внедряване на технологии в публичните пространства
• Управление на заинтересовани страни в сложни дигитални проекти');

-- Questions for Digital Twin Sofia
INSERT INTO public.questions (id, case_step_id, question_order, type, prompt, prompt_bg, options, points) VALUES
('a1000001-0001-0001-0005-000000000100', 'a1000001-0001-0001-0005-000000000010', 1, 'long_answer',
 'Research digital twin technology and smart city initiatives. How do cities use real-time data to improve urban life? (minimum 100 words)',
 'Проучете технологията за дигитални двойници и инициативите за интелигентен град. Как градовете използват данни в реално време за подобряване на градския живот? (минимум 100 думи)', NULL, 10),

('a1000001-0001-0001-0005-000000000101', 'a1000001-0001-0001-0005-000000000013', 1, 'long_answer',
 'What are the main ethical concerns with comprehensive urban data collection? How should cities balance innovation with privacy?',
 'Какви са основните етични загрижености при всеобхватно събиране на градски данни? Как градовете трябва да балансират иновациите с поверителността?', NULL, 15),
('a1000001-0001-0001-0005-000000000102', 'a1000001-0001-0001-0005-000000000013', 2, 'long_answer',
 'How could an open data platform create economic value and encourage startup innovation in a smart city ecosystem?',
 'Как отворена платформа за данни може да създаде икономическа стойност и да насърчи стартъп иновации в екосистема за интелигентен град?', NULL, 15),
('a1000001-0001-0001-0005-000000000103', 'a1000001-0001-0001-0005-000000000013', 3, 'ranking',
 'Rank these smart city priorities from most to least important:',
 'Подредете тези приоритети за интелигентен град от най-важен към най-маловажен:',
 '["Citizen Privacy", "Traffic Optimization", "Environmental Monitoring", "Economic Innovation", "Public Safety"]'::jsonb, 10),
('a1000001-0001-0001-0005-000000000104', 'a1000001-0001-0001-0005-000000000013', 4, 'long_answer',
 'What technology risks exist in creating a digital twin of an entire city? Consider cybersecurity, data accuracy, and system failures.',
 'Какви технологични рискове съществуват при създаване на дигитален двойник на цял град? Помислете за киберсигурност, точност на данните и системни повреди.', NULL, 15),

('a1000001-0001-0001-0005-000000000105', 'a1000001-0001-0001-0005-000000000014', 1, 'multiple_choice',
 'Which data governance strategy should Digital Twin Sofia adopt?',
 'Коя стратегия за управление на данни трябва да приеме дигиталният двойник на София?',
 '["Maximum data collection for best city services", "Privacy-first with only anonymized data", "Open data platform for public innovation", "Tiered approach: open environmental data, restricted personal data"]'::jsonb, 10),
('a1000001-0001-0001-0005-000000000106', 'a1000001-0001-0001-0005-000000000014', 2, 'long_answer',
 'Justify your data governance decision. How does it build citizen trust while enabling innovation?',
 'Обосновете решението си за управление на данни. Как то изгражда доверие у гражданите, докато позволява иновации?', NULL, 20),

('a1000001-0001-0001-0005-000000000107', 'a1000001-0001-0001-0005-000000000015', 1, 'long_answer',
 'How could your startup idea leverage data from smart city platforms? What data would you need and how would you handle privacy responsibly?',
 'Как вашата стартъп идея може да използва данни от платформи за интелигентен град? Какви данни ще ви трябват и как бихте се отнесли отговорно към поверителността?', NULL, 10);
