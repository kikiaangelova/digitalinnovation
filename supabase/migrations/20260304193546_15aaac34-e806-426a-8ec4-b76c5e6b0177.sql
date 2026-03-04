
-- ============================================================
-- Case Study 2: Kelvin Health – AI Healthcare Diagnostics
-- ============================================================
INSERT INTO public.case_studies (id, title, title_bg, description, description_bg, topic, topic_bg, difficulty, est_minutes, published, outcomes, outcomes_bg)
VALUES (
  'a1000001-0001-0001-0002-000000000001',
  'Kelvin Health: AI-Powered Medical Diagnostics',
  'Kelvin Health: AI-базирана медицинска диагностика',
  'Analyze how an AI healthcare startup uses thermal imaging and machine learning to revolutionize early detection of vascular diseases.',
  'Анализирайте как AI здравен стартъп използва термографско изображение и машинно обучение за революция в ранната диагностика на съдови заболявания.',
  'Healthcare & AI', 'Здравеопазване и AI',
  'advanced', 50, true,
  ARRAY['Understand AI applications in healthcare', 'Analyze regulatory vs growth tradeoffs', 'Evaluate healthcare startup strategies'],
  ARRAY['Разбиране на AI приложения в здравеопазването', 'Анализ на регулаторни компромиси', 'Оценка на здравни стартъп стратегии']
);

INSERT INTO public.case_steps (id, case_study_id, step_order, title, title_bg, narrative, narrative_bg, exhibit_text, exhibit_text_bg) VALUES
('a1000001-0001-0001-0002-000000000010', 'a1000001-0001-0001-0002-000000000001', 0,
 'Research & Reading', 'Проучване',
 'Research the current state of AI in medical diagnostics. How are machine learning and computer vision being used to detect diseases earlier?',
 'Проучете текущото състояние на AI в медицинската диагностика. Как машинното обучение и компютърното зрение се използват за по-ранно откриване на заболявания?',
 NULL, NULL),

('a1000001-0001-0001-0002-000000000011', 'a1000001-0001-0001-0002-000000000001', 1,
 'The Kelvin Health Story', 'Историята на Kelvin Health',
 'Kelvin Health is a Bulgarian AI healthcare startup that developed a groundbreaking approach to medical diagnostics. Instead of relying solely on traditional imaging methods like X-rays or MRIs, the company uses thermal imaging combined with proprietary machine learning algorithms to detect vascular diseases at their earliest stages.

The technology works by analyzing thermal patterns on the skin surface, which reveal blood flow abnormalities invisible to the naked eye. The AI system processes thousands of thermal data points to identify early signs of conditions like peripheral artery disease, deep vein thrombosis, and diabetic complications — often before patients show any symptoms.

Clinical trials showed the technology achieving diagnostic accuracy of over 90%, comparable to expensive hospital-grade equipment but at a fraction of the cost. The device is portable, non-invasive, and can deliver results in minutes rather than days.

However, Kelvin Health operates in one of the most heavily regulated industries in the world. Medical device approval requires extensive clinical trials, regulatory submissions (FDA in the US, CE marking in Europe), and partnerships with healthcare institutions — processes that can take years and millions of dollars.',
 'Kelvin Health е български AI здравен стартъп, разработил революционен подход към медицинската диагностика. Вместо да разчита само на традиционни методи като рентген или ЯМР, компанията използва термографско изображение, комбинирано с патентовани алгоритми за машинно обучение, за откриване на съдови заболявания в най-ранните им стадии.

Технологията работи чрез анализ на термални модели на кожната повърхност, разкриващи аномалии в кръвотока, невидими с просто око. AI системата обработва хиляди термални данни за идентифициране на ранни признаци на периферна артериална болест, дълбока венозна тромбоза и диабетни усложнения — често преди пациентите да покажат симптоми.

Клиничните изпитания показват диагностична точност над 90%, сравнима с скъпо болнично оборудване, но на част от цената. Устройството е преносимо, неинвазивно и дава резултати за минути вместо дни.

Въпреки това, Kelvin Health работи в една от най-регулираните индустрии в света. Одобрението на медицински изделия изисква обширни клинични изпитания и регулаторни подавания — процеси, които отнемат години и милиони.',
 NULL, NULL),

('a1000001-0001-0001-0002-000000000012', 'a1000001-0001-0001-0002-000000000001', 2,
 'The Strategic Dilemma', 'Стратегическата дилема',
 'Kelvin Health must decide its strategic priority for the next two years.',
 'Kelvin Health трябва да реши стратегическия си приоритет за следващите две години.',
 'STRATEGIC DILEMMA:

Should Kelvin Health prioritize regulatory approval (FDA/CE) or build hospital partnerships to generate clinical evidence and revenue?

Option A — Regulatory-First:
• Pursue FDA 510(k) clearance and CE marking
• Timeline: 18-24 months
• Cost: $2-5M in regulatory expenses
• Benefit: Opens global markets once approved

Option B — Partnership-First:
• Partner with hospitals for clinical use and evidence
• Generate revenue through research collaborations
• Build real-world clinical data
• Benefit: Faster revenue, stronger approval application later

KEY METRICS:
┌──────────────────────────┬──────────────────┐
│ Metric                   │ Value            │
├──────────────────────────┼──────────────────┤
│ Diagnostic Accuracy      │ 90%+             │
│ Scan Time                │ 3-5 minutes      │
│ Cost per Scan            │ $15-25           │
│ Traditional MRI Cost     │ $500-3,000       │
│ Clinical Trial Patients  │ 2,000+           │
│ Hospital Partners        │ 8                │
│ Conditions Detected      │ 5 vascular types │
│ Regulatory Status        │ Pre-submission   │
└──────────────────────────┴──────────────────┘',
 'СТРАТЕГИЧЕСКА ДИЛЕМА:

Трябва ли Kelvin Health да приоритизира регулаторно одобрение (FDA/CE) или изграждане на болнични партньорства за генериране на клинични доказателства и приходи?

Опция А — Регулаторен приоритет:
• Преследване на FDA 510(k) одобрение и CE маркировка
• Срок: 18-24 месеца
• Цена: $2-5M регулаторни разходи

Опция Б — Партньорски приоритет:
• Партньорство с болници за клинична употреба
• Генериране на приходи чрез изследователски колаборации
• Изграждане на реални клинични данни

КЛЮЧОВИ МЕТРИКИ:
┌──────────────────────────┬──────────────────┐
│ Метрика                  │ Стойност         │
├──────────────────────────┼──────────────────┤
│ Диагностична точност     │ 90%+             │
│ Време за сканиране       │ 3-5 минути       │
│ Цена на сканиране        │ $15-25           │
│ Цена на традиционен ЯМР  │ $500-3,000       │
│ Пациенти от изпитания    │ 2 000+           │
│ Болнични партньори       │ 8                │
│ Засечени състояния       │ 5 съдови типа    │
│ Регулаторен статус       │ Преди подаване   │
└──────────────────────────┴──────────────────┘'),

('a1000001-0001-0001-0002-000000000013', 'a1000001-0001-0001-0002-000000000001', 3,
 'Strategic Analysis', 'Стратегически анализ',
 'Analyze Kelvin Health''s position in the AI healthcare market and the implications of each strategic option.',
 'Анализирайте позицията на Kelvin Health на пазара за AI здравеопазване и последиците от всяка стратегическа опция.',
 NULL, NULL),

('a1000001-0001-0001-0002-000000000014', 'a1000001-0001-0001-0002-000000000001', 4,
 'Your Strategic Decision', 'Вашето стратегическо решение',
 'Choose and justify the strategic path for Kelvin Health.',
 'Изберете и обосновете стратегическия път за Kelvin Health.',
 NULL, NULL),

('a1000001-0001-0001-0002-000000000015', 'a1000001-0001-0001-0002-000000000001', 5,
 'Case Insight', 'Извод от казуса',
 'Reflect on the key lessons from the Kelvin Health case.',
 'Размислете над ключовите уроци от казуса на Kelvin Health.',
 'KEY INSIGHT:
In healthcare innovation, the tension between regulatory compliance and market speed defines startup success. Kelvin Health''s approach shows that building clinical evidence through partnerships can simultaneously generate revenue, strengthen regulatory applications, and create market trust — a virtuous cycle that pure regulatory-first approaches miss.

LEARNING OUTCOME:
• AI applications in healthcare diagnostics
• Navigating regulatory barriers in medtech
• Building clinical evidence as a growth strategy',
 'КЛЮЧОВ ИЗВОД:
В здравните иновации напрежението между регулаторно съответствие и пазарна бързина определя успеха на стартъпа. Подходът на Kelvin Health показва, че изграждането на клинични доказателства чрез партньорства може едновременно да генерира приходи и да укрепи регулаторните заявления.

УЧЕБЕН РЕЗУЛТАТ:
• AI приложения в здравната диагностика
• Навигиране на регулаторни бариери в медтех
• Изграждане на клинични доказателства като стратегия за растеж');

-- Questions for Kelvin Health
INSERT INTO public.questions (id, case_step_id, question_order, type, prompt, prompt_bg, options, points) VALUES
('a1000001-0001-0001-0002-000000000100', 'a1000001-0001-0001-0002-000000000010', 1, 'long_answer',
 'Research and write about how AI and machine learning are currently being used in medical diagnostics. What are the main barriers to adoption? (minimum 100 words)',
 'Проучете и напишете как AI и машинното обучение се използват в медицинската диагностика. Какви са основните бариери пред приемането? (минимум 100 думи)', NULL, 10),

('a1000001-0001-0001-0002-000000000101', 'a1000001-0001-0001-0002-000000000013', 1, 'long_answer',
 'What competitive advantages does Kelvin Health have over traditional diagnostic methods? Consider cost, speed, accuracy, and accessibility.',
 'Какви конкурентни предимства има Kelvin Health пред традиционните диагностични методи? Обмислете цена, бързина, точност и достъпност.', NULL, 15),
('a1000001-0001-0001-0002-000000000102', 'a1000001-0001-0001-0002-000000000013', 2, 'long_answer',
 'What are the biggest risks Kelvin Health faces? Consider regulatory, technical, competitive, and ethical risks.',
 'Какви са най-големите рискове пред Kelvin Health? Обмислете регулаторни, технически, конкурентни и етични рискове.', NULL, 15),
('a1000001-0001-0001-0002-000000000103', 'a1000001-0001-0001-0002-000000000013', 3, 'numeric_allocation',
 'Allocate 100 points across these factors based on their importance for Kelvin Health''s success:',
 'Разпределете 100 точки между тези фактори по важност за успеха на Kelvin Health:',
 '["Regulatory Approval", "Hospital Partnerships", "Technology R&D", "Clinical Evidence", "Fundraising"]'::jsonb, 10),

('a1000001-0001-0001-0002-000000000104', 'a1000001-0001-0001-0002-000000000014', 1, 'multiple_choice',
 'Which strategic path should Kelvin Health prioritize?',
 'Кой стратегически път трябва да приоритизира Kelvin Health?',
 '["Regulatory-First: Pursue FDA/CE approval immediately", "Partnership-First: Build hospital partnerships and clinical evidence", "Hybrid: Pursue CE marking in Europe while building US hospital partnerships", "Pivot: License the technology to established medical device companies"]'::jsonb, 10),
('a1000001-0001-0001-0002-000000000105', 'a1000001-0001-0001-0002-000000000014', 2, 'long_answer',
 'Justify your strategic decision. How does it balance risk, speed, and long-term growth potential?',
 'Обосновете стратегическото си решение. Как балансира риск, бързина и дългосрочен потенциал за растеж?', NULL, 20),

('a1000001-0001-0001-0002-000000000106', 'a1000001-0001-0001-0002-000000000015', 1, 'long_answer',
 'How could you apply lessons from Kelvin Health''s regulatory strategy to your own startup? What regulatory or compliance challenges might your product face?',
 'Как бихте приложили уроците от регулаторната стратегия на Kelvin Health към вашия стартъп? Какви регулаторни предизвикателства може да срещне вашият продукт?', NULL, 10);
