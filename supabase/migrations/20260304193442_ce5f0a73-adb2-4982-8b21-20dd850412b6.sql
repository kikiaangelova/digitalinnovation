
-- ============================================================
-- Case Study 1: Payhawk – AI Financial Automation
-- ============================================================
INSERT INTO public.case_studies (id, title, title_bg, description, description_bg, topic, topic_bg, difficulty, est_minutes, published, outcomes, outcomes_bg)
VALUES (
  'a1000001-0001-0001-0001-000000000001',
  'Payhawk: AI-Powered Financial Revolution',
  'Payhawk: AI-базирана финансова революция',
  'Explore how a Bulgarian fintech unicorn leveraged AI agents to automate corporate financial workflows and expand globally.',
  'Разгледайте как български финтех еднорог използва AI агенти за автоматизация на корпоративни финансови процеси и глобално разширяване.',
  'Fintech & AI', 'Финтех и AI',
  'intermediate', 45, true,
  ARRAY['Understand digital disruption in financial services', 'Analyze AI automation strategies', 'Evaluate global scaling decisions'],
  ARRAY['Разбиране на дигиталната трансформация във финансите', 'Анализ на AI стратегии за автоматизация', 'Оценка на решения за глобално мащабиране']
);

-- Steps for Payhawk
INSERT INTO public.case_steps (id, case_study_id, step_order, title, title_bg, narrative, narrative_bg, exhibit_text, exhibit_text_bg) VALUES
-- Step 0: Research
('a1000001-0001-0001-0001-000000000010', 'a1000001-0001-0001-0001-000000000001', 0,
 'Research & Reading', 'Проучване',
 'Before analyzing the Payhawk case, research the current state of corporate financial technology. Consider how companies manage expenses, invoices, and financial reporting today.',
 'Преди да анализирате казуса на Payhawk, проучете текущото състояние на корпоративните финансови технологии. Помислете как компаниите управляват разходите, фактурите и финансовата отчетност днес.',
 NULL, NULL),

-- Step 1: Context
('a1000001-0001-0001-0001-000000000011', 'a1000001-0001-0001-0001-000000000001', 1,
 'The Payhawk Story', 'Историята на Payhawk',
 'Payhawk was founded in 2018 in Sofia, Bulgaria, by Hristo Borisov, Boyko Karadzhov, and Konstantin Djengozov. What started as a corporate card and expense management solution quickly evolved into a comprehensive financial operating system for businesses.

By 2024, Payhawk had raised over $400 million in funding, achieving unicorn status with a valuation exceeding $1 billion. The company serves over 3,500 businesses across 32 countries, processing billions of dollars in transactions annually.

The fintech landscape was becoming increasingly competitive, with players like Brex, Ramp, and traditional banks all vying for the corporate finance space. Payhawk''s response was bold: integrate AI agents directly into the financial workflow — not just as analytical tools, but as autonomous decision-makers capable of categorizing expenses, detecting anomalies, and generating financial reports without human intervention.

The AI-powered platform promised to reduce manual financial processing by up to 80%, freeing finance teams to focus on strategic decisions rather than data entry.',
 'Payhawk е основана през 2018 г. в София от Христо Борисов, Бойко Караджов и Константин Дженгозов. Започнала като решение за корпоративни карти и управление на разходи, тя бързо еволюира в цялостна финансова операционна система за бизнеса.

До 2024 г. Payhawk привлича над 400 милиона долара финансиране, достигайки статус на еднорог с оценка над 1 милиард долара. Компанията обслужва над 3 500 бизнеса в 32 държави, обработвайки милиарди долари транзакции годишно.

Финтех пейзажът ставаше все по-конкурентен с играчи като Brex, Ramp и традиционни банки. Отговорът на Payhawk беше смел: интегриране на AI агенти директно във финансовия процес — не само като аналитични инструменти, но като автономни решаващи системи, способни да категоризират разходи, откриват аномалии и генерират финансови отчети без човешка намеса.

AI платформата обещава да намали ръчната финансова обработка с до 80%, освобождавайки финансовите екипи за стратегически решения.',
 NULL, NULL),

-- Step 2: Strategic Problem
('a1000001-0001-0001-0001-000000000012', 'a1000001-0001-0001-0001-000000000001', 2,
 'The Strategic Dilemma', 'Стратегическата дилема',
 'Payhawk faces a critical strategic crossroads as it plans its next phase of growth.',
 'Payhawk е изправена пред критична стратегическа кръстовка при планирането на следващата фаза на растеж.',
 'STRATEGIC DILEMMA:

Should Payhawk prioritize deep AI automation (becoming the most intelligent financial platform) or aggressive global expansion (entering new markets quickly with existing features)?

Option A — AI-First Strategy:
• Invest 60% of R&D budget in AI agent capabilities
• Build autonomous financial workflows
• Risk: Slower geographic expansion, competitors may capture new markets

Option B — Global Expansion Strategy:
• Rapidly enter 20+ new markets
• Focus on localization and compliance
• Risk: Product may not differentiate enough against local competitors

KEY METRICS:
┌─────────────────────────┬──────────────┐
│ Metric                  │ Value        │
├─────────────────────────┼──────────────┤
│ Annual Revenue Growth   │ 150% YoY     │
│ Customers               │ 3,500+       │
│ Countries               │ 32           │
│ Transactions Processed  │ $3.5B+       │
│ Manual Processing       │ -80% with AI │
│ Employee Count          │ 500+         │
│ Total Funding           │ $400M+       │
│ Valuation               │ $1B+         │
└─────────────────────────┴──────────────┘',
 'СТРАТЕГИЧЕСКА ДИЛЕМА:

Трябва ли Payhawk да приоритизира дълбоката AI автоматизация (ставайки най-интелигентната финансова платформа) или агресивната глобална експанзия (навлизане в нови пазари бързо с текущите функции)?

Опция А — AI-първа стратегия:
• Инвестиране на 60% от R&D бюджета в AI агенти
• Изграждане на автономни финансови процеси
• Риск: По-бавна географска експанзия

Опция Б — Стратегия за глобална експанзия:
• Бързо навлизане в 20+ нови пазара
• Фокус върху локализация и съответствие
• Риск: Продуктът може да не се отличава достатъчно

КЛЮЧОВИ МЕТРИКИ:
┌─────────────────────────┬──────────────┐
│ Метрика                 │ Стойност     │
├─────────────────────────┼──────────────┤
│ Годишен ръст на приходи │ 150% YoY     │
│ Клиенти                 │ 3 500+       │
│ Държави                 │ 32           │
│ Обработени транзакции   │ $3.5B+       │
│ Ръчна обработка         │ -80% с AI    │
│ Служители               │ 500+         │
│ Общо финансиране        │ $400M+       │
│ Оценка                  │ $1B+         │
└─────────────────────────┴──────────────┘'),

-- Step 3: Analysis Questions
('a1000001-0001-0001-0001-000000000013', 'a1000001-0001-0001-0001-000000000001', 3,
 'Strategic Analysis', 'Стратегически анализ',
 'Analyze Payhawk''s competitive position, the fintech landscape, and the implications of each strategic option.',
 'Анализирайте конкурентната позиция на Payhawk, финтех пейзажа и последиците от всяка стратегическа опция.',
 NULL, NULL),

-- Step 4: Decision
('a1000001-0001-0001-0001-000000000014', 'a1000001-0001-0001-0001-000000000001', 4,
 'Your Strategic Decision', 'Вашето стратегическо решение',
 'Based on your analysis, choose and justify the strategic path Payhawk should take.',
 'На база на вашия анализ, изберете и обосновете стратегическия път на Payhawk.',
 NULL, NULL),

-- Step 5: Insight
('a1000001-0001-0001-0001-000000000015', 'a1000001-0001-0001-0001-000000000001', 5,
 'Case Insight', 'Извод от казуса',
 'Reflect on the key lesson from the Payhawk case and connect it to your own startup project.',
 'Размислете над ключовия урок от казуса на Payhawk и го свържете с вашия стартъп проект.',
 'KEY INSIGHT:
Payhawk''s success demonstrates that in competitive markets, the winning strategy is often a combination: invest in technology differentiation (AI) while strategically expanding into markets where that differentiation matters most. The company chose to do both — leading with AI capabilities in markets where enterprise customers valued automation over price.

LEARNING OUTCOME:
• Digital innovation strategy in financial services
• AI as competitive advantage in B2B platforms
• Balancing product depth with market breadth',
 'КЛЮЧОВ ИЗВОД:
Успехът на Payhawk показва, че в конкурентни пазари печелившата стратегия е комбинация: инвестиране в технологична диференциация (AI), докато стратегически се разширявате в пазари, където тази диференциация има най-голямо значение.

УЧЕБЕН РЕЗУЛТАТ:
• Стратегия за дигитални иновации във финансовите услуги
• AI като конкурентно предимство в B2B платформи
• Баланс между дълбочина на продукта и широчина на пазара');

-- Questions for Payhawk
INSERT INTO public.questions (id, case_step_id, question_order, type, prompt, prompt_bg, options, points) VALUES
-- Step 0: Research notes
('a1000001-0001-0001-0001-000000000100', 'a1000001-0001-0001-0001-000000000010', 1, 'long_answer',
 'Write your research notes about the current state of corporate fintech and expense management. What trends do you see? (minimum 100 words)',
 'Напишете бележки за текущото състояние на корпоративния финтех и управлението на разходи. Какви тенденции забелязвате? (минимум 100 думи)',
 NULL, 10),

-- Step 3: Analysis questions
('a1000001-0001-0001-0001-000000000101', 'a1000001-0001-0001-0001-000000000013', 1, 'long_answer',
 'What competitive advantages does Payhawk''s AI-first approach create compared to traditional expense management tools like SAP Concur or Expensify?',
 'Какви конкурентни предимства създава AI-първият подход на Payhawk в сравнение с традиционни инструменти за управление на разходи като SAP Concur или Expensify?',
 NULL, 15),
('a1000001-0001-0001-0001-000000000102', 'a1000001-0001-0001-0001-000000000013', 2, 'long_answer',
 'What are the main risks Payhawk faces with its AI automation strategy? Consider technical, regulatory, and market risks.',
 'Какви са основните рискове пред Payhawk с тяхната AI стратегия за автоматизация? Помислете за технически, регулаторни и пазарни рискове.',
 NULL, 15),
('a1000001-0001-0001-0001-000000000103', 'a1000001-0001-0001-0001-000000000013', 3, 'ranking',
 'Rank the following factors by their importance for Payhawk''s strategic success (most important first):',
 'Подредете следните фактори по важност за стратегическия успех на Payhawk (най-важният първи):',
 '["AI technology differentiation", "Geographic market expansion", "Regulatory compliance", "Customer retention", "Pricing strategy"]'::jsonb, 10),
('a1000001-0001-0001-0001-000000000104', 'a1000001-0001-0001-0001-000000000013', 4, 'long_answer',
 'How does AI change the competitive structure of the financial services industry? What new opportunities and threats emerge?',
 'Как AI променя конкурентната структура на индустрията за финансови услуги? Какви нови възможности и заплахи се появяват?',
 NULL, 15),

-- Step 4: Decision
('a1000001-0001-0001-0001-000000000105', 'a1000001-0001-0001-0001-000000000014', 1, 'multiple_choice',
 'Which strategic path should Payhawk prioritize?',
 'Кой стратегически път трябва да приоритизира Payhawk?',
 '["AI-First: Deep automation before expansion", "Global Expansion: Rapid market entry with current features", "Hybrid: AI differentiation in premium markets, standard product in new markets", "Partnership: License AI technology to other fintech companies"]'::jsonb, 10),
('a1000001-0001-0001-0001-000000000106', 'a1000001-0001-0001-0001-000000000014', 2, 'long_answer',
 'Justify your strategic choice. Explain how it addresses Payhawk''s competitive challenges and leverages its strengths. What would the 3-year roadmap look like?',
 'Обосновете стратегическия си избор. Обяснете как той адресира конкурентните предизвикателства на Payhawk и използва силните им страни. Как би изглеждала 3-годишната пътна карта?',
 NULL, 20),

-- Step 5: Reflection
('a1000001-0001-0001-0001-000000000107', 'a1000001-0001-0001-0001-000000000015', 1, 'long_answer',
 'How could you apply Payhawk''s approach to AI-driven automation in your own startup idea? What processes could AI automate in your target market?',
 'Как бихте приложили подхода на Payhawk за AI-базирана автоматизация към вашата стартъп идея? Какви процеси може AI да автоматизира на вашия целеви пазар?',
 NULL, 10);
