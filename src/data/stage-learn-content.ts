/**
 * Bilingual learning content for each of the 6 Journey stages.
 * Every stage follows a standardized 5-section structure:
 *   1. Introduction (why this matters)
 *   2. Key Concepts (3–5 bullets explained clearly)
 *   3. Framework (step-by-step thinking model)
 *   4. Example (real or simplified case)
 *   5. Quick Recap (3 key takeaways)
 */

export interface LearnSection {
  titleEn: string;
  titleBg: string;
  bodyEn: string; // Markdown
  bodyBg: string; // Markdown
}

export interface StageLearnData {
  stageId: number;
  titleEn: string;
  titleBg: string;
  subtitleEn: string;
  subtitleBg: string;
  readMinutes: number;
  sections: LearnSection[];
}

export const STAGE_LEARN_CONTENT: StageLearnData[] = [
  /* ══════════════ STAGE 1: Digital Innovation Basics ══════════════ */
  {
    stageId: 1,
    titleEn: 'Digital Innovation Basics',
    titleBg: 'Основи на дигиталните иновации',
    subtitleEn: 'Understand what digital innovation is, why it matters, and how technology transforms industries.',
    subtitleBg: 'Разбери какво е дигитална иновация, защо е важна и как технологиите трансформират индустриите.',
    readMinutes: 6,
    sections: [
      {
        titleEn: 'Why This Matters',
        titleBg: 'Защо е важно',
        bodyEn: `Every industry is being reshaped by technology. Companies that don't innovate get replaced — Kodak, Blockbuster, and Nokia all learned this the hard way.

Understanding digital innovation isn't just for tech founders. Whether you work in healthcare, education, retail, or finance, **the ability to spot opportunities and think digitally is a must-have skill**.

> 💡 This stage gives you the vocabulary and mindset to see the world through an innovator's lens.`,
        bodyBg: `Всяка индустрия се преобразява от технологиите. Компаниите, които не иновират, биват заменени — Kodak, Blockbuster и Nokia научиха това по трудния начин.

Разбирането на дигиталната иновация не е само за технологични основатели. Независимо дали работиш в здравеопазването, образованието, търговията или финансите, **способността да откриваш възможности и да мислиш дигитално е задължително умение**.

> 💡 Този етап ти дава речника и мисленето, за да гледаш света през призмата на иноватор.`,
      },
      {
        titleEn: 'Key Concepts',
        titleBg: 'Ключови понятия',
        bodyEn: `**1. Digital Innovation ≠ Just Adding Technology**
It's about **rethinking how value is created and delivered**. Netflix didn't just put movies online — it reinvented entertainment distribution.

**2. Three Types of Disruption**
- **Sustaining** — Improves existing products (e.g., Apple adding Face ID)
- **Low-End** — "Good enough" at a fraction of the price (e.g., Xiaomi smartphones)
- **New-Market** — Creates a category where none existed (e.g., Airbnb)

**3. Innovation Signals**
Look for: manual processes that could be automated, information that's hard to access, services that are expensive but don't need to be, and industries unchanged for 20+ years.

**4. Value Creation Is the Goal**
Technology is the tool, not the goal. The question is always: *"Does this make something 10x better, cheaper, or more accessible?"*`,
        bodyBg: `**1. Дигитална иновация ≠ Просто добавяне на технология**
Става дума за **преосмисляне как се създава и доставя стойност**. Netflix не просто сложи филми онлайн — преоткри разпространението на забавление.

**2. Три типа дисрупция**
- **Поддържаща** — Подобрява съществуващи продукти (напр. Apple добавя Face ID)
- **Нискобюджетна** — „Достатъчно добра" на малка част от цената (напр. смартфони Xiaomi)
- **На нов пазар** — Създава категория, където преди нямаше (напр. Airbnb)

**3. Сигнали за иновация**
Търси: ръчни процеси, които могат да се автоматизират, информация трудна за достъп, услуги скъпи без причина и индустрии непроменени от 20+ години.

**4. Целта е създаване на стойност**
Технологията е инструментът, не целта. Въпросът винаги е: *„Прави ли това нещо 10 пъти по-добро, по-евтино или по-достъпно?"*`,
      },
      {
        titleEn: 'Framework: Pain → Technology → Market',
        titleBg: 'Рамка: Болка → Технология → Пазар',
        bodyEn: `Use this 3-step model to evaluate any innovation opportunity:

**Step 1 — Identify the Pain** 🎯
What frustrates people? What's slow, expensive, or inaccessible?
- Ask: *"What do people complain about in this industry?"*

**Step 2 — Match with Technology** 🔧
Which digital tools could solve the pain? (AI, mobile apps, cloud, IoT, blockchain)
- Ask: *"What technology exists today that didn't exist 5 years ago?"*

**Step 3 — Validate the Market** 📊
Are enough people willing to pay for the solution?
- Ask: *"How many people have this problem? Would they switch from their current solution?"*

> ⚡ If all three align — Pain + Technology + Market — you have a genuine innovation opportunity.`,
        bodyBg: `Използвай този 3-стъпков модел, за да оцениш всяка иновационна възможност:

**Стъпка 1 — Идентифицирай болката** 🎯
Какво разочарова хората? Какво е бавно, скъпо или недостъпно?
- Попитай: *„От какво се оплакват хората в тази индустрия?"*

**Стъпка 2 — Съпостави с технология** 🔧
Кои дигитални инструменти могат да решат болката? (AI, мобилни приложения, облак, IoT, блокчейн)
- Попитай: *„Каква технология съществува днес, която не съществуваше преди 5 години?"*

**Стъпка 3 — Валидирай пазара** 📊
Достатъчно хора ли са готови да платят за решението?
- Попитай: *„Колко хора имат този проблем? Биха ли сменили текущото си решение?"*

> ⚡ Ако и трите се подреждат — Болка + Технология + Пазар — имаш истинска иновационна възможност.`,
      },
      {
        titleEn: 'Example: Duolingo',
        titleBg: 'Пример: Duolingo',
        bodyEn: `Let's see the PTM framework in action:

**Pain:** Learning a language is expensive (tutors cost $30–60/hr) and boring (textbooks). Most people give up after a few weeks.

**Technology:** Smartphones are everywhere. Gamification mechanics (points, streaks, leaderboards) are proven to boost engagement. AI can personalize lesson difficulty.

**Market:** 1.5 billion people are actively learning a language worldwide. Most can't afford traditional methods.

**Result:** Duolingo built a free, gamified mobile app that adapts to each learner. Today it has 500M+ users and is worth over $7 billion.

| PTM Check | Duolingo |
|-----------|----------|
| Pain | Language learning is expensive & boring |
| Technology | Mobile + gamification + AI |
| Market | 1.5B language learners globally |
| Disruption type | New-market (made learning free) |`,
        bodyBg: `Нека видим рамката БТП в действие:

**Болка:** Изучаването на език е скъпо (частни уроци струват $30–60/час) и скучно (учебници). Повечето хора се отказват след няколко седмици.

**Технология:** Смартфоните са навсякъде. Механиките за геймификация (точки, серии, класации) доказано увеличават ангажираността. AI може да персонализира трудността на урока.

**Пазар:** 1,5 милиарда души активно учат език по света. Повечето не могат да си позволят традиционни методи.

**Резултат:** Duolingo създаде безплатно, геймифицирано мобилно приложение, което се адаптира към всеки учащ. Днес има 500M+ потребители и е на стойност над $7 милиарда.

| БТП проверка | Duolingo |
|-------------|----------|
| Болка | Изучаването на език е скъпо и скучно |
| Технология | Мобилно + геймификация + AI |
| Пазар | 1,5 милиарда учащи езици глобално |
| Тип дисрупция | На нов пазар (направи ученето безплатно) |`,
      },
      {
        titleEn: 'Quick Recap',
        titleBg: 'Бърз преговор',
        bodyEn: `**3 things to remember:**

✅ Digital innovation is about **creating new value**, not just adding tech — ask *"Does this make something 10x better?"*

✅ Disruption comes in three forms: **sustaining, low-end, and new-market** — each requires a different strategy.

✅ Use the **Pain → Technology → Market** framework to evaluate any opportunity before you build.

**Next step:** Complete your first case study to see real digital innovation in action →`,
        bodyBg: `**3 неща за запомняне:**

✅ Дигиталната иновация е за **създаване на нова стойност**, не просто добавяне на технология — питай *„Прави ли това нещо 10 пъти по-добро?"*

✅ Дисрупцията идва в три форми: **поддържаща, нискобюджетна и на нов пазар** — всяка изисква различна стратегия.

✅ Използвай рамката **Болка → Технология → Пазар**, за да оцениш всяка възможност, преди да строиш.

**Следваща стъпка:** Завърши първия си казус, за да видиш реална дигитална иновация в действие →`,
      },
    ],
  },

  /* ══════════════ STAGE 2: Industry & Competitor Analysis ══════════════ */
  {
    stageId: 2,
    titleEn: 'Industry & Competitor Analysis',
    titleBg: 'Анализ на индустрията и конкуренцията',
    subtitleEn: 'Learn to map competitive landscapes and identify what makes digital businesses defensible.',
    subtitleBg: 'Научи се да картографираш конкурентни среди и да идентифицираш какво прави дигиталните бизнеси защитими.',
    readMinutes: 7,
    sections: [
      {
        titleEn: 'Why This Matters',
        titleBg: 'Защо е важно',
        bodyEn: `Building a product without understanding the competition is like entering a race blindfolded. You might run fast, but you'll probably hit a wall.

**Competitor analysis helps you:**
- Find gaps no one is filling
- Avoid building something that already exists
- Position your product so it stands out
- Build defenses that keep copycats away

> 🎯 The goal isn't to be scared of competitors — it's to **outsmart** them by understanding the landscape.`,
        bodyBg: `Създаването на продукт без разбиране на конкуренцията е като да влезеш в състезание със завързани очи. Може да бягаш бързо, но вероятно ще се блъснеш в стена.

**Анализът на конкуренцията ти помага да:**
- Намериш пропуски, които никой не запълва
- Избегнеш създаването на нещо, което вече съществува
- Позиционираш продукта си, за да се отличава
- Изградиш защити, които държат копирачите далеч

> 🎯 Целта не е да се страхуваш от конкуренти — а да ги **надхитриш**, като разбереш средата.`,
      },
      {
        titleEn: 'Key Concepts',
        titleBg: 'Ключови понятия',
        bodyEn: `**1. Three Types of Competitors**

| Type | Definition | Example (food delivery) |
|------|-----------|------------------------|
| **Direct** | Same product, same market | Uber Eats, DoorDash |
| **Indirect** | Different product, same need | Meal kits, restaurant takeout |
| **Substitutes** | Alternative way to solve the need | Cooking at home, eating out |

**2. SWOT Analysis**
Evaluate any company (including yours) across four dimensions:
- **S**trengths — What you do well (internal)
- **W**eaknesses — Where you're limited (internal)
- **O**pportunities — Market trends in your favor (external)
- **T**hreats — Risks and competitors (external)

**3. Competitive Moats**
Four ways digital businesses stay defensible:
- 🌐 **Network effects** — More users = better product (Instagram)
- 🔒 **Switching costs** — Painful to leave (Slack)
- 📊 **Data advantage** — More data = smarter product (Spotify)
- 💎 **Brand trust** — People pay premium for trust (Apple)

**4. Porter's Five Forces (Simplified)**
Assess industry attractiveness by checking: rivalry intensity, threat of new entrants, threat of substitutes, buyer power, and supplier power.`,
        bodyBg: `**1. Три типа конкуренти**

| Тип | Определение | Пример (доставка на храна) |
|-----|-----------|--------------------------|
| **Преки** | Същият продукт, същият пазар | Uber Eats, DoorDash |
| **Непреки** | Различен продукт, същата нужда | Кутии с рецепти, храна за вкъщи |
| **Заместители** | Алтернативен начин за решение | Готвене у дома, хранене навън |

**2. SWOT анализ**
Оцени всяка компания (включително своята) по четири измерения:
- **S**ilni strani — Какво правиш добре (вътрешно)
- **W**eaknesses — Къде си ограничен (вътрешно)
- **O**pportunities — Пазарни тенденции в твоя полза (външно)
- **T**hreats — Рискове и конкуренти (външно)

**3. Конкурентни ровове**
Четири начина дигиталните бизнеси да останат защитими:
- 🌐 **Мрежови ефекти** — Повече потребители = по-добър продукт (Instagram)
- 🔒 **Разходи за смяна** — Болезнено е да напуснеш (Slack)
- 📊 **Предимство от данни** — Повече данни = по-умен продукт (Spotify)
- 💎 **Доверие в марката** — Хората плащат повече за доверие (Apple)

**4. Петте сили на Портър (опростено)**
Оцени привлекателността на индустрията чрез: интензивност на конкуренцията, заплаха от нови участници, заплаха от заместители, сила на купувачите и сила на доставчиците.`,
      },
      {
        titleEn: 'Framework: Competitor Mapping in 4 Steps',
        titleBg: 'Рамка: Картографиране на конкуренти в 4 стъпки',
        bodyEn: `Follow this process to map any competitive landscape:

**Step 1 — List competitors by type** 📋
Write down at least 2 direct, 2 indirect, and 1 substitute competitor. Google the *problem*, not the solution.

**Step 2 — Analyze each competitor** 🔍
For each, answer:
- What do they do well? (Read customer reviews)
- What do customers complain about? (That's your opportunity)
- How do they make money?
- How big are they? (Users, revenue, funding)

**Step 3 — Run a mini-SWOT on yourself** 📊
Be honest. Your strengths should be specific (not "good team"). Compare your SWOT to competitors' to find your unique edge.

**Step 4 — Identify your moat** 🏰
Which of the four moats can you start building from Day 1? Even a small moat (like being hyper-focused on one niche) counts.

> 💡 **Pro tip:** The best competitive advantage is often doing one thing *much* better than everyone else, rather than doing everything a little better.`,
        bodyBg: `Следвай този процес, за да картографираш всяка конкурентна среда:

**Стъпка 1 — Изброй конкуренти по тип** 📋
Запиши поне 2 преки, 2 непреки и 1 заместител. Търси в Google за *проблема*, не за решението.

**Стъпка 2 — Анализирай всеки конкурент** 🔍
За всеки отговори:
- Какво правят добре? (Прочети отзиви на клиенти)
- От какво се оплакват клиентите? (Това е твоята възможност)
- Как печелят пари?
- Колко големи са? (Потребители, приходи, финансиране)

**Стъпка 3 — Направи мини-SWOT за себе си** 📊
Бъди честен. Силните ти страни трябва да са конкретни (не „добър екип"). Сравни своя SWOT с този на конкурентите, за да намериш уникалното си предимство.

**Стъпка 4 — Идентифицирай рова си** 🏰
Кой от четирите рова можеш да започнеш да строиш от Ден 1? Дори малък ров (като хипер-фокус върху една ниша) има значение.

> 💡 **Съвет:** Най-доброто конкурентно предимство често е да правиш едно нещо *много* по-добре от всички останали, вместо да правиш всичко малко по-добре.`,
      },
      {
        titleEn: 'Example: Spotify vs. the Music Industry',
        titleBg: 'Пример: Spotify срещу музикалната индустрия',
        bodyEn: `Let's apply the competitor mapping framework to Spotify when it launched in 2008:

**Competitors identified:**
| Type | Competitor | Weakness spotted |
|------|-----------|-----------------|
| Direct | iTunes | Pay per song, no discovery |
| Direct | Pandora | Radio-only, no on-demand |
| Indirect | YouTube | Bad audio quality, needs screen |
| Substitute | Piracy (Napster era) | Illegal, unreliable |

**Spotify's mini-SWOT:**
| | Helpful | Harmful |
|---|---------|---------|
| Internal | ✅ Instant streaming, great UX | ⚠️ No content (needed label deals) |
| External | ✅ People hate paying per song | ⚠️ Music labels are powerful |

**Moat chosen:** Data advantage — the more you listen, the better the recommendations (Discover Weekly became a killer feature).

**Result:** Spotify became the #1 streaming platform with 600M+ users by doing *one thing* (music streaming + discovery) far better than anyone else.`,
        bodyBg: `Нека приложим рамката за картографиране на конкуренти към Spotify, когато стартира през 2008:

**Идентифицирани конкуренти:**
| Тип | Конкурент | Забелязана слабост |
|-----|-----------|-------------------|
| Пряк | iTunes | Плащане за песен, без откриване |
| Пряк | Pandora | Само радио, без слушане по заявка |
| Непряк | YouTube | Лошо аудио качество, нужен е екран |
| Заместител | Пиратство (ерата на Napster) | Нелегално, ненадеждно |

**Мини-SWOT на Spotify:**
| | Полезно | Вредно |
|---|---------|--------|
| Вътрешно | ✅ Мигновено стрийминг, страхотен UX | ⚠️ Няма съдържание (нужни са договори с лейбъли) |
| Външно | ✅ Хората мразят да плащат за песен | ⚠️ Музикалните лейбъли са мощни |

**Избран ров:** Предимство от данни — колкото повече слушаш, толкова по-добри са препоръките (Discover Weekly стана убийствена функция).

**Резултат:** Spotify стана #1 стрийминг платформа с 600M+ потребители, като прави *едно нещо* (музикално стрийминг + откриване) далеч по-добре от всички останали.`,
      },
      {
        titleEn: 'Quick Recap',
        titleBg: 'Бърз преговор',
        bodyEn: `**3 things to remember:**

✅ Competitors come in three types — **direct, indirect, and substitutes** — analyze all three to see the full picture.

✅ Use **SWOT** to find your unique edge and **Porter's Five Forces** to assess how tough the industry is.

✅ Build a **defensible moat** from Day 1 — network effects, switching costs, data advantage, or brand trust.

**Next step:** Identify 3 competitors for your startup idea and analyze their strengths →`,
        bodyBg: `**3 неща за запомняне:**

✅ Конкурентите са три вида — **преки, непреки и заместители** — анализирай и трите, за да видиш пълната картина.

✅ Използвай **SWOT**, за да намериш уникалното си предимство и **Петте сили на Портър**, за да оцениш колко трудна е индустрията.

✅ Изгради **защитен ров** от Ден 1 — мрежови ефекти, разходи за смяна, предимство от данни или доверие в марката.

**Следваща стъпка:** Идентифицирай 3 конкурента за стартъп идеята си и анализирай силните им страни →`,
      },
    ],
  },

  /* ══════════════ STAGE 3: Startup Idea & Value Proposition ══════════════ */
  {
    stageId: 3,
    titleEn: 'Startup Idea & Value Proposition',
    titleBg: 'Стартъп идея и стойностно предложение',
    subtitleEn: 'Learn to define a clear problem, target customer, and compelling value proposition.',
    subtitleBg: 'Научи се да дефинираш ясен проблем, целеви клиент и убедително стойностно предложение.',
    readMinutes: 6,
    sections: [
      {
        titleEn: 'Why This Matters',
        titleBg: 'Защо е важно',
        bodyEn: `Most startups don't fail because of bad technology. They fail because they **solve a problem nobody cares about**.

The #1 reason startups die is "no market need" — meaning the founders built something people didn't actually want. Before writing a single line of code, you need to answer three questions clearly:

1. **What problem** are you solving?
2. **Who** has this problem?
3. **Why** should they choose you?

> ⚠️ This stage prevents you from building the wrong thing. It's the most important 6 minutes of your startup journey.`,
        bodyBg: `Повечето стартъпи не се провалят заради лоша технология. Те се провалят, защото **решават проблем, който никого не интересува**.

Причина #1 за гибелта на стартъпите е „няма нужда от пазара" — основателите са създали нещо, което хората всъщност не искат. Преди да напишеш един ред код, трябва да отговориш ясно на три въпроса:

1. **Какъв проблем** решаваш?
2. **Кой** има този проблем?
3. **Защо** да изберат теб?

> ⚠️ Този етап те предпазва от създаването на грешното нещо. Това са най-важните 6 минути от стартъп пътешествието ти.`,
      },
      {
        titleEn: 'Key Concepts',
        titleBg: 'Ключови понятия',
        bodyEn: `**1. Problem-Solution Fit**
Every great startup starts with a **real problem**, not a feature or technology. Your problem statement should follow this formula:
> "[Target customer] struggles with [specific problem] because [root cause], which results in [negative outcome]."

**2. Target Customer ≠ "Everyone"**
The more specific your customer, the better your product. Define them by: age, location, occupation, pain point, current solution, and why it's not enough.

**3. The "Mom Test"**
Don't ask *"Would you use my product?"* — people lie to be polite. Instead ask: *"Tell me about the last time you faced this problem. What did you try?"*

**4. Value Proposition**
Your one-sentence answer to: *"Why should the customer choose YOU instead of alternatives?"*
Formula: *"We help [customer] to [job] by [unique approach], unlike [alternative] which [limitation]."*

**5. Validation Before Building**
Talk to 5+ potential users before you build anything. If they don't get excited about the problem, your solution won't matter.`,
        bodyBg: `**1. Съответствие проблем-решение**
Всеки велик стартъп започва с **реален проблем**, не с функция или технология. Формулировката ти на проблема трябва да следва тази формула:
> „[Целеви клиент] се затруднява с [конкретен проблем], защото [основна причина], което води до [негативен резултат]."

**2. Целеви клиент ≠ „Всички"**
Колкото по-конкретен е клиентът ти, толкова по-добър ще е продуктът. Определи го по: възраст, местоположение, занимание, болка, текущо решение и защо не е достатъчно.

**3. „Тестът на мама"**
Не питай *„Би ли използвал продукта ми?"* — хората лъжат от учтивост. Вместо това питай: *„Разкажи ми за последния път, когато срещна този проблем. Какво опита?"*

**4. Стойностно предложение**
Твоят отговор в едно изречение на: *„Защо клиентът да избере ТЕБ вместо алтернативите?"*
Формула: *„Помагаме на [клиент] да [задача] чрез [уникален подход], за разлика от [алтернатива], която [ограничение]."*

**5. Валидация преди създаване**
Говори с 5+ потенциални потребители, преди да създаваш каквото и да е. Ако не се вълнуват от проблема, решението ти няма да има значение.`,
      },
      {
        titleEn: 'Framework: Value Proposition Canvas',
        titleBg: 'Рамка: Канвас за стойностно предложение',
        bodyEn: `This canvas helps you align what customers need with what you offer:

**Step 1 — Map the Customer Side**
| Element | Question to answer |
|---------|-------------------|
| **Jobs** | What are they trying to achieve? |
| **Pains** | What frustrates them about current solutions? |
| **Gains** | What would make them delighted? |

**Step 2 — Map Your Side**
| Element | Question to answer |
|---------|-------------------|
| **Products/Services** | What do you offer? |
| **Pain Relievers** | How do you reduce their frustrations? |
| **Gain Creators** | How do you create delight? |

**Step 3 — Check the Fit**
Draw lines between customer pains and your pain relievers. If most pains are addressed, you have strong fit. If there are gaps, iterate.

**Checklist for a strong value proposition:**
- [ ] Specific to one customer segment
- [ ] Addresses a real, validated pain
- [ ] Clearly different from existing alternatives
- [ ] Explainable in under 15 seconds`,
        bodyBg: `Този канвас ти помага да съгласуваш нуждите на клиентите с това, което предлагаш:

**Стъпка 1 — Картографирай страната на клиента**
| Елемент | Въпрос за отговор |
|---------|------------------|
| **Задачи** | Какво се опитват да постигнат? |
| **Болки** | Какво ги разочарова в текущите решения? |
| **Ползи** | Какво би ги зарадвало? |

**Стъпка 2 — Картографирай твоята страна**
| Елемент | Въпрос за отговор |
|---------|------------------|
| **Продукти/Услуги** | Какво предлагаш? |
| **Облекчаващи болката** | Как намаляваш разочарованията им? |
| **Създатели на ползи** | Как създаваш радост? |

**Стъпка 3 — Провери съответствието**
Начертай линии между болките на клиентите и твоите облекчители. Ако повечето болки са адресирани, имаш силно съответствие. Ако има пропуски, итерирай.

**Чеклист за силно стойностно предложение:**
- [ ] Конкретно за един клиентски сегмент
- [ ] Адресира реална, валидирана болка
- [ ] Ясно различно от съществуващите алтернативи
- [ ] Обяснимо за под 15 секунди`,
      },
      {
        titleEn: 'Example: Career Guidance App',
        titleBg: 'Пример: Приложение за кариерно ориентиране',
        bodyEn: `Let's build a value proposition step by step:

**Problem statement:**
> "High school students struggle with choosing a career path because career counseling is limited to 1-2 sessions per year, which results in uninformed university choices."

**Customer persona:**
| Attribute | Answer |
|-----------|--------|
| Age | 16-19 |
| Location | Urban Bulgaria |
| Occupation | High school student |
| Pain | No structured career guidance |
| Current solution | Asking friends, random Google searches |
| Why it's not enough | Biased advice, information overload |

**Value proposition:**
> "We help high school students make informed career choices by providing AI-powered career matching based on skills and interests, unlike school counselors who have time for only 2 sessions per year."

**Fit check:** The pain (limited guidance) directly maps to the solution (AI-powered matching available anytime). The customer is specific. The differentiation is clear. ✅`,
        bodyBg: `Нека изградим стойностно предложение стъпка по стъпка:

**Формулировка на проблема:**
> „Гимназистите се затрудняват с избора на кариера, защото кариерното консултиране е ограничено до 1-2 сесии годишно, което води до неинформирани избори за университет."

**Клиентска персона:**
| Атрибут | Отговор |
|---------|--------|
| Възраст | 16-19 |
| Местоположение | Градска България |
| Занимание | Гимназист |
| Болка | Няма структурирано кариерно ориентиране |
| Текущо решение | Питане на приятели, случайни търсения в Google |
| Защо не е достатъчно | Пристрастни съвети, претоварване с информация |

**Стойностно предложение:**
> „Помагаме на гимназисти да направят информирани кариерни избори чрез AI-базирано съпоставяне на кариери според уменията и интересите им, за разлика от училищните съветници, които имат време за само 2 сесии годишно."

**Проверка за съответствие:** Болката (ограничено ориентиране) директно се свързва с решението (AI-базирано съпоставяне, достъпно по всяко време). Клиентът е конкретен. Разграничаването е ясно. ✅`,
      },
      {
        titleEn: 'Quick Recap',
        titleBg: 'Бърз преговор',
        bodyEn: `**3 things to remember:**

✅ Start with the **problem**, not the solution — validate with real people before you build anything.

✅ Define your customer with **specifics** (age, pain, current solution) — "everyone" is not a segment.

✅ Your value proposition must be **clear, specific, and differentiated** — use the Value Proposition Canvas to check your fit.

**Next step:** Go to My Startup and write your problem statement and target customer →`,
        bodyBg: `**3 неща за запомняне:**

✅ Започни с **проблема**, не с решението — валидирай с реални хора, преди да строиш каквото и да е.

✅ Определи клиента си с **конкретики** (възраст, болка, текущо решение) — „всички" не е сегмент.

✅ Стойностното ти предложение трябва да е **ясно, конкретно и диференцирано** — използвай Канваса за стойностно предложение, за да провериш съответствието.

**Следваща стъпка:** Отиди в Моят стартъп и напиши формулировка на проблема и целевия клиент →`,
      },
    ],
  },

  /* ══════════════ STAGE 4: Product Design (MVP) ══════════════ */
  {
    stageId: 4,
    titleEn: 'Product Design (MVP)',
    titleBg: 'Продуктов дизайн (MVP)',
    subtitleEn: 'Learn to design a minimum viable product and the 9 blocks of the Business Model Canvas.',
    subtitleBg: 'Научи се да проектираш минимално жизнеспособен продукт и 9-те блока на Business Model Canvas.',
    readMinutes: 7,
    sections: [
      {
        titleEn: 'Why This Matters',
        titleBg: 'Защо е важно',
        bodyEn: `The biggest waste in startups is spending months building something users don't want. An MVP prevents that.

**MVP = the fastest way to learn if your idea works.** It's not about launching a perfect product — it's about testing your biggest assumption with real people, as quickly as possible.

Alongside the MVP, you need a clear business model. The Business Model Canvas gives you a one-page blueprint of how your startup creates, delivers, and captures value.

> 💡 Think of the MVP as your experiment, and the Business Model Canvas as your hypothesis written down.`,
        bodyBg: `Най-голямата загуба при стартъпите е да прекараш месеци в създаване на нещо, което потребителите не искат. MVP предотвратява това.

**MVP = най-бързият начин да научиш дали идеята ти работи.** Не става дума за пускане на перфектен продукт — а за тестване на най-голямото ти предположение с реални хора, възможно най-бързо.

Наред с MVP, ти трябва ясен бизнес модел. Business Model Canvas ти дава едностраничен план за това как стартъпът ти създава, доставя и улавя стойност.

> 💡 Мисли за MVP като за експеримент, а за Business Model Canvas като за хипотезата ти, записана на хартия.`,
      },
      {
        titleEn: 'Key Concepts',
        titleBg: 'Ключови понятия',
        bodyEn: `**1. What an MVP Is (and Isn't)**
- ✅ The **smallest thing** you can build to test your core assumption
- ✅ Something real users can **actually use**
- ❌ NOT a broken product, a demo, or your final product stripped down

**2. Types of MVPs**

| Type | How it works | Example |
|------|-------------|---------|
| **Landing Page** | Describe product + collect sign-ups | Dropbox's explainer video |
| **Wizard of Oz** | Looks automated, done manually | Early Zappos |
| **Concierge** | Do the service manually first | Food delivery before the app |
| **Single-Feature** | Build just ONE core feature | Instagram (only photo filters) |

**3. The Business Model Canvas (BMC)**
A one-page tool with 9 blocks: Customer Segments, Value Proposition, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partners, and Cost Structure.

**4. Revenue Models**
Common digital models: Subscription (Netflix), Freemium (Canva), Commission (Airbnb), Advertising (YouTube), One-time purchase (games).

**5. The Core Question**
*"What is the ONE feature that, without it, my product has no reason to exist?"*`,
        bodyBg: `**1. Какво е MVP (и какво не е)**
- ✅ **Най-малкото нещо**, което можеш да създадеш, за да тестваш основното си предположение
- ✅ Нещо, което реални потребители могат **наистина да използват**
- ❌ НЕ Е счупен продукт, демо или финалният ти продукт в орязана версия

**2. Типове MVP**

| Тип | Как работи | Пример |
|-----|-----------|--------|
| **Целева страница** | Описваш продукта + събираш регистрации | Видеото на Dropbox |
| **Магьосник от Оз** | Изглежда автоматизирано, правено ръчно | Ранният Zappos |
| **Консиерж** | Предоставяш услугата ръчно първо | Доставка на храна преди приложението |
| **Единична функция** | Създай ЕДНА основна функция | Instagram (само филтри за снимки) |

**3. Business Model Canvas (BMC)**
Едностраничен инструмент с 9 блока: Клиентски сегменти, Стойностно предложение, Канали, Отношения с клиенти, Потоци приходи, Ключови ресурси, Ключови дейности, Ключови партньори и Структура на разходите.

**4. Модели на приходи**
Разпространени дигитални модели: Абонамент (Netflix), Freemium (Canva), Комисионна (Airbnb), Реклама (YouTube), Еднократна покупка (игри).

**5. Основният въпрос**
*„Коя е ЕДИНСТВЕНАТА функция, без която продуктът ми няма причина да съществува?"*`,
      },
      {
        titleEn: 'Framework: BMC in 4 Steps',
        titleBg: 'Рамка: BMC в 4 стъпки',
        bodyEn: `Fill out your Business Model Canvas in this order:

**Step 1 — Start with the right side (Value)**
| Block | Question |
|-------|---------|
| Customer Segments | Who exactly are your customers? |
| Value Proposition | Why do they choose you? |
| Channels | How do you reach them? |
| Customer Relationships | How do you keep them? |
| Revenue Streams | How do you make money? |

**Step 2 — Then the left side (Operations)**
| Block | Question |
|-------|---------|
| Key Resources | What do you need to operate? (Tech, people, data) |
| Key Activities | What must you do daily? (Build, sell, support) |
| Key Partners | Who helps you? (Suppliers, platforms, APIs) |
| Cost Structure | What are your main costs? (Hosting, marketing, salaries) |

**Step 3 — Choose your revenue model**
Pick the model that fits your product: subscription for ongoing value, freemium for viral growth, commission for marketplaces.

**Step 4 — Stress-test**
Ask: *"If I remove any one block, does the whole model collapse?"* If yes, that block is a critical risk.`,
        bodyBg: `Попълни Business Model Canvas в този ред:

**Стъпка 1 — Започни с дясната страна (Стойност)**
| Блок | Въпрос |
|------|--------|
| Клиентски сегменти | Кои точно са клиентите ти? |
| Стойностно предложение | Защо те избират? |
| Канали | Как ги достигаш? |
| Отношения с клиенти | Как ги задържаш? |
| Потоци приходи | Как печелиш пари? |

**Стъпка 2 — После лявата страна (Операции)**
| Блок | Въпрос |
|------|--------|
| Ключови ресурси | Какво ти трябва, за да работиш? (Технология, хора, данни) |
| Ключови дейности | Какво трябва да правиш ежедневно? (Създавай, продавай, поддържай) |
| Ключови партньори | Кой ти помага? (Доставчици, платформи, API-та) |
| Структура на разходите | Кои са основните ти разходи? (Хостинг, маркетинг, заплати) |

**Стъпка 3 — Избери модел на приходи**
Избери модела, който пасва на продукта ти: абонамент за постоянна стойност, freemium за вирусен растеж, комисионна за маркетплейси.

**Стъпка 4 — Стрес-тест**
Попитай: *„Ако махна който и да е блок, целият модел ли се срива?"* Ако да, този блок е критичен риск.`,
      },
      {
        titleEn: 'Example: Instagram\'s MVP',
        titleBg: 'Пример: MVP на Instagram',
        bodyEn: `When Instagram launched in 2010, it wasn't the feature-rich app we know today. Here's what they built as their MVP:

**Core assumption:** People want to share beautiful photos from their phone, but phone cameras take ugly photos.

**MVP approach:** Single-Feature — just photo filters + sharing. No stories, no reels, no DMs, no shopping.

**BMC snapshot:**
| Block | Instagram MVP |
|-------|-------------|
| Customer Segments | iPhone users who love photography |
| Value Proposition | Make phone photos look professional in 1 tap |
| Channels | App Store + word of mouth |
| Revenue | None (growth first, monetize later) |
| Key Activity | Build great filters |
| Key Resource | Mobile development team (13 people at launch) |

**What happened:** 25,000 users signed up on Day 1. Within 2 years, Facebook acquired Instagram for $1 billion — with only 13 employees.

> 💡 **Lesson:** They didn't try to be Facebook. They did ONE thing (filters + sharing) extremely well.`,
        bodyBg: `Когато Instagram стартира през 2010, не беше богатото на функции приложение, което познаваме днес. Ето какво създадоха като MVP:

**Основно предположение:** Хората искат да споделят красиви снимки от телефоните си, но телефонните камери правят грозни снимки.

**MVP подход:** Единична функция — само филтри за снимки + споделяне. Без сториз, без рийлс, без DM-ове, без пазаруване.

**BMC моментна снимка:**
| Блок | Instagram MVP |
|------|-------------|
| Клиентски сегменти | Потребители на iPhone, които обичат фотографията |
| Стойностно предложение | Направи телефонните снимки професионални с 1 тап |
| Канали | App Store + от уста на уста |
| Приходи | Няма (растеж първо, монетизация после) |
| Ключова дейност | Създаване на страхотни филтри |
| Ключов ресурс | Екип за мобилна разработка (13 души при стартиране) |

**Какво се случи:** 25 000 потребители се регистрираха на Ден 1. В рамките на 2 години Facebook придоби Instagram за $1 милиард — с едва 13 служители.

> 💡 **Урок:** Не се опитаха да бъдат Facebook. Направиха ЕДНО нещо (филтри + споделяне) изключително добре.`,
      },
      {
        titleEn: 'Quick Recap',
        titleBg: 'Бърз преговор',
        bodyEn: `**3 things to remember:**

✅ Your MVP should test your **core assumption** with real users — build the smallest thing that proves or disproves your idea.

✅ The Business Model Canvas has **9 blocks** — start with Customer Segments + Value Proposition, everything else flows from there.

✅ Choose a **revenue model** that matches your product — and remember, many successful startups combine models.

**Next step:** Go to My Startup and fill out your Business Model Canvas →`,
        bodyBg: `**3 неща за запомняне:**

✅ Твоят MVP трябва да тества **основното ти предположение** с реални потребители — създай най-малкото нещо, което доказва или опровергава идеята ти.

✅ Business Model Canvas има **9 блока** — започни с Клиентски сегменти + Стойностно предложение, всичко останало следва от там.

✅ Избери **модел на приходи**, който пасва на продукта ти — и помни, много успешни стартъпи комбинират модели.

**Следваща стъпка:** Отиди в Моят стартъп и попълни своя Business Model Canvas →`,
      },
    ],
  },

  /* ══════════════ STAGE 5: Business Model & Marketing Strategy ══════════════ */
  {
    stageId: 5,
    titleEn: 'Business Model & Marketing Strategy',
    titleBg: 'Бизнес модел и маркетинг стратегия',
    subtitleEn: 'Learn growth frameworks, marketing channels, and how strategic decisions affect KPIs.',
    subtitleBg: 'Научи рамки за растеж, маркетинг канали и как стратегическите решения влияят на KPI.',
    readMinutes: 7,
    sections: [
      {
        titleEn: 'Why This Matters',
        titleBg: 'Защо е важно',
        bodyEn: `A great product with no growth strategy is like a restaurant in the middle of a desert — amazing food, zero customers.

**Growth is not luck. It's a system.** The best startups track specific numbers (KPIs), experiment with marketing channels, and make data-driven decisions instead of guessing.

This stage teaches you to think like a growth-minded founder: measure what matters, find the right channels, and make strategic trade-offs with limited resources.

> 📊 If you can't measure it, you can't improve it.`,
        bodyBg: `Страхотен продукт без стратегия за растеж е като ресторант в средата на пустиня — прекрасна храна, нула клиенти.

**Растежът не е късмет. Той е система.** Най-добрите стартъпи проследяват конкретни числа (KPI), експериментират с маркетинг канали и вземат решения на база данни, вместо да гадаят.

Този етап те учи да мислиш като основател, ориентиран към растеж: измервай важното, намери правилните канали и вземай стратегически решения с ограничени ресурси.

> 📊 Ако не можеш да го измериш, не можеш да го подобриш.`,
      },
      {
        titleEn: 'Key Concepts',
        titleBg: 'Ключови понятия',
        bodyEn: `**1. The 5 Essential Startup KPIs**

| KPI | What it measures | Good target |
|-----|-----------------|-------------|
| **Users** | How many people use your product | Growing week-over-week |
| **Revenue** | How much money you earn | Positive trend |
| **Conversion** | % of visitors who become users | 2-5% for digital products |
| **Retention** | % of users who come back | >40% after 30 days |
| **CAC** | Cost to get one new customer | Lower than lifetime value |

**2. AARRR Framework (Pirate Metrics)**
A funnel to diagnose where you're losing users:
Acquisition → Activation → Retention → Revenue → Referral

**3. Marketing Channels**
Social media, content marketing, SEO, paid ads, email, partnerships, community — each has different cost and speed characteristics.

**4. Strategic Trade-offs**
Every decision has a cost. Growth vs. profitability, quality vs. speed, broad vs. niche — there are no perfect answers, only informed choices.`,
        bodyBg: `**1. Петте основни KPI за стартъпи**

| KPI | Какво измерва | Добра цел |
|-----|--------------|-----------|
| **Потребители** | Колко хора използват продукта ти | Растеж седмица по седмица |
| **Приходи** | Колко пари печелиш | Положителна тенденция |
| **Конверсия** | % посетители, които стават потребители | 2-5% за дигитални продукти |
| **Задържане** | % потребители, които се връщат | >40% след 30 дни |
| **CAC** | Разход за привличане на един нов клиент | По-ниска от стойността на клиента |

**2. Рамка AARRR (Пиратски метрики)**
Фуния за диагностициране къде губиш потребители:
Привличане → Активиране → Задържане → Приход → Препоръки

**3. Маркетинг канали**
Социални мрежи, маркетинг чрез съдържание, SEO, платена реклама, имейл, партньорства, общност — всеки има различни характеристики по цена и скорост.

**4. Стратегически компромиси**
Всяко решение има цена. Растеж срещу печалба, качество срещу скорост, широко срещу нишово — няма перфектни отговори, само информирани избори.`,
      },
      {
        titleEn: 'Framework: The Bullseye Growth Method',
        titleBg: 'Рамка: Методът Bullseye за растеж',
        bodyEn: `Use this 3-step process to find the best marketing channels for your startup:

**Step 1 — Brainstorm (Outer Ring)** 💭
List ALL possible channels where your customers might be:

| Channel | Best for | Cost |
|---------|---------|------|
| Social Media (Instagram, TikTok) | B2C, young audiences | Low-Medium |
| Content Marketing (blog, YouTube) | Building authority | Low (but slow) |
| SEO (Google search) | Long-term organic traffic | Low (takes time) |
| Paid Ads (Google, Meta) | Fast, scalable reach | High |
| Email Marketing | Retention, upselling | Very Low |
| Partnerships | Reaching new audiences | Varies |
| Community (Discord, Reddit) | Niche products | Low |

**Step 2 — Test (Middle Ring)** 🧪
Pick the 3 most promising channels. Run small, cheap experiments for 1-2 weeks each. Measure results.

**Step 3 — Focus (Bullseye)** 🎯
Double down on the 1-2 channels that worked best. Most startups find that **1-2 channels drive 80% of their growth**.

> 💡 Don't try to be everywhere. Find what works and focus relentlessly.`,
        bodyBg: `Използвай този 3-стъпков процес, за да намериш най-добрите маркетинг канали за стартъпа си:

**Стъпка 1 — Мозъчна атака (Външен пръстен)** 💭
Изброй ВСИЧКИ възможни канали, където клиентите ти може да са:

| Канал | Най-добър за | Цена |
|-------|-------------|------|
| Социални мрежи (Instagram, TikTok) | B2C, млада аудитория | Ниска-Средна |
| Маркетинг чрез съдържание (блог, YouTube) | Изграждане на авторитет | Ниска (но бавна) |
| SEO (търсене в Google) | Дългосрочен органичен трафик | Ниска (отнема време) |
| Платена реклама (Google, Meta) | Бърз, мащабируем обхват | Висока |
| Имейл маркетинг | Задържане, кръстосани продажби | Много ниска |
| Партньорства | Достигане до нови аудитории | Различна |
| Общност (Discord, Reddit) | Нишови продукти | Ниска |

**Стъпка 2 — Тествай (Среден пръстен)** 🧪
Избери 3-те най-обещаващи канала. Проведи малки, евтини експерименти за 1-2 седмици всеки. Измери резултатите.

**Стъпка 3 — Фокусирай се (Bullseye)** 🎯
Удвои усилията за 1-2-та канала, които работиха най-добре. Повечето стартъпи откриват, че **1-2 канала генерират 80% от растежа им**.

> 💡 Не се опитвай да си навсякъде. Намери какво работи и се фокусирай безмилостно.`,
      },
      {
        titleEn: 'Example: How Slack Grew Without Ads',
        titleBg: 'Пример: Как Slack порасна без реклами',
        bodyEn: `Slack is a team communication tool that reached $1B in revenue faster than almost any SaaS company in history. Here's how they applied growth thinking:

**KPIs they tracked:**
| KPI | Slack's result |
|-----|---------------|
| Users | 8,000 on Day 1 → 500K in 1 year |
| Retention | 93% of teams that tried it kept using it |
| Conversion | 30% of free teams upgraded to paid |
| Referral | Users invited teammates organically |

**Growth channels used:**
- ❌ NOT paid ads (initially)
- ✅ **Word of mouth** — the product was so useful, people told colleagues
- ✅ **Freemium model** — free tier let teams try with zero risk
- ✅ **Switching cost moat** — once your history is in Slack, leaving is painful

**Strategic trade-off:** Slack chose **growth over revenue** early on. The free tier cost them money, but it built a massive user base that later converted to paid.

> 💡 **Lesson:** The best marketing is a product people can't stop talking about. Focus on retention first — growth follows.`,
        bodyBg: `Slack е инструмент за екипна комуникация, който достигна $1 милиард приходи по-бързо от почти всяка SaaS компания в историята. Ето как приложиха мислене за растеж:

**KPI, които проследяваха:**
| KPI | Резултат на Slack |
|-----|------------------|
| Потребители | 8 000 на Ден 1 → 500K за 1 година |
| Задържане | 93% от екипите, които го пробваха, продължиха да го ползват |
| Конверсия | 30% от безплатните екипи преминаха на платен план |
| Препоръки | Потребителите канеха колеги органично |

**Използвани канали за растеж:**
- ❌ НЕ платена реклама (първоначално)
- ✅ **От уста на уста** — продуктът беше толкова полезен, че хората го споделяха с колеги
- ✅ **Freemium модел** — безплатното ниво позволяваше на екипи да пробват без риск
- ✅ **Ров от разходи за смяна** — щом историята ти е в Slack, напускането е болезнено

**Стратегически компромис:** Slack избра **растеж пред приходи** в началото. Безплатното ниво им струваше пари, но изгради масивна потребителска база, която по-късно се конвертира в платена.

> 💡 **Урок:** Най-добрият маркетинг е продукт, за който хората не могат да спрат да говорят. Фокусирай се върху задържането първо — растежът следва.`,
      },
      {
        titleEn: 'Quick Recap',
        titleBg: 'Бърз преговор',
        bodyEn: `**3 things to remember:**

✅ Track the **5 essential KPIs** (users, revenue, conversion, retention, CAC) and use the **AARRR framework** to find leaks in your funnel.

✅ Use the **Bullseye method** to find 1-2 marketing channels that work — don't spread yourself thin across all of them.

✅ Strategic decisions are about **trade-offs** — use data and the decision framework (goal → data → reversibility → worst case) instead of gut feeling.

**Next step:** Try the Business Simulator to practice strategic decision-making with real KPIs →`,
        bodyBg: `**3 неща за запомняне:**

✅ Проследявай **5-те основни KPI** (потребители, приходи, конверсия, задържане, CAC) и използвай **рамката AARRR**, за да намериш пропуски във фунията.

✅ Използвай **метода Bullseye**, за да намериш 1-2 маркетинг канала, които работят — не се разпилявай по всички.

✅ Стратегическите решения са за **компромиси** — използвай данни и рамката за решения (цел → данни → обратимост → най-лош сценарий) вместо интуиция.

**Следваща стъпка:** Опитай бизнес симулатора, за да практикуваш вземане на стратегически решения с реални KPI →`,
      },
    ],
  },

  /* ══════════════ STAGE 6: Startup Pitch ══════════════ */
  {
    stageId: 6,
    titleEn: 'Startup Pitch',
    titleBg: 'Стартъп представяне',
    subtitleEn: 'Learn to structure a compelling startup pitch and present confidently.',
    subtitleBg: 'Научи се да структурираш убедително стартъп представяне и да представяш уверено.',
    readMinutes: 6,
    sections: [
      {
        titleEn: 'Why This Matters',
        titleBg: 'Защо е важно',
        bodyEn: `You've built the idea, validated the problem, designed the product, and planned the growth. Now it's time to **sell the vision**.

Every startup founder pitches — to investors, customers, partners, and even their own team. A great pitch doesn't just share information. It **inspires action**.

The difference between a funded startup and a forgotten one is often not the idea — it's the ability to **communicate it clearly and compellingly in 3 minutes or less**.

> 🎤 This stage teaches you the structure, techniques, and mindset to pitch with confidence.`,
        bodyBg: `Изградил си идеята, валидирал си проблема, проектирал си продукта и планирал си растежа. Сега е време да **продадеш визията**.

Всеки стартъп основател представя — пред инвеститори, клиенти, партньори и дори собствения си екип. Страхотното представяне не просто споделя информация. То **вдъхновява действие**.

Разликата между финансиран стартъп и забравен често не е идеята — а способността да я **комуникираш ясно и убедително за 3 минути или по-малко**.

> 🎤 Този етап те учи на структурата, техниките и мисленето, за да представяш с увереност.`,
      },
      {
        titleEn: 'Key Concepts',
        titleBg: 'Ключови понятия',
        bodyEn: `**1. What Investors Look For (in this order)**
- 👥 **Team** — Can these people execute? Do they understand the problem deeply?
- 📈 **Market** — Is the opportunity big enough? Is it growing?
- 🎯 **Product** — Does it solve a real problem? Is there evidence of demand?
- 🚀 **Traction** — User numbers, revenue, growth rate (even small, if trending up)

**2. Story > Data**
Humans remember stories, not spreadsheets. Start with a hook, not "Hi, my name is…"

**3. Show, Don't Tell**
"We have 200 users" beats "Our product is great." Numbers and proof always win over adjectives.

**4. Constructive Feedback**
Giving: start with strengths, be specific, suggest alternatives.
Receiving: listen first, look for patterns, say thank you.

**5. The Ask**
Every pitch must end with a clear call to action: funding, partnership, sign-ups, or feedback.`,
        bodyBg: `**1. Какво търсят инвеститорите (в този ред)**
- 👥 **Екип** — Могат ли тези хора да изпълнят? Разбират ли проблема дълбоко?
- 📈 **Пазар** — Достатъчно голяма ли е възможността? Расте ли?
- 🎯 **Продукт** — Решава ли реален проблем? Има ли доказателства за търсене?
- 🚀 **Тракция** — Брой потребители, приходи, темп на растеж (дори малки, ако тенденцията е нагоре)

**2. История > Данни**
Хората запомнят истории, не таблици. Започни с кука, не с „Здравейте, казвам се…"

**3. Покажи, не казвай**
„Имаме 200 потребители" побеждава „Продуктът ни е страхотен." Числата и доказателствата винаги печелят срещу прилагателни.

**4. Конструктивна обратна връзка**
Даване: започни със силните страни, бъди конкретен, предложи алтернативи.
Получаване: слушай първо, търси модели, кажи благодаря.

**5. Искането**
Всяко представяне трябва да завърши с ясен призив за действие: финансиране, партньорство, регистрации или обратна връзка.`,
      },
      {
        titleEn: 'Framework: The 7-Slide Pitch',
        titleBg: 'Рамка: Представяне от 7 слайда',
        bodyEn: `Structure your 3-minute pitch using this proven framework:

| # | Slide | Time | What to include |
|---|-------|------|----------------|
| 1 | **Hook** | 15 sec | One sentence or statistic that grabs attention |
| 2 | **Problem** | 30 sec | The real pain your customers feel |
| 3 | **Solution** | 30 sec | Your product and how it works |
| 4 | **Market** | 20 sec | How big the opportunity is (TAM/SAM/SOM) |
| 5 | **Business Model** | 20 sec | How you make money |
| 6 | **Traction** | 20 sec | What you've achieved so far |
| 7 | **Ask** | 15 sec | What you need from the audience |

**Delivery tips:**
- **Start with a story or shocking stat** — emotion before logic
- **One idea per slide** — don't overload with text
- **Practice out loud** — it always takes longer than you think
- **Make eye contact** — connect with people, not the screen
- **End strong** — your last sentence is what they'll remember`,
        bodyBg: `Структурирай 3-минутното си представяне, използвайки тази доказана рамка:

| # | Слайд | Време | Какво да включиш |
|---|-------|-------|-----------------|
| 1 | **Кука** | 15 сек | Едно изречение или статистика, която привлича внимание |
| 2 | **Проблем** | 30 сек | Реалната болка, която клиентите ти изпитват |
| 3 | **Решение** | 30 сек | Твоят продукт и как работи |
| 4 | **Пазар** | 20 сек | Колко голяма е възможността (TAM/SAM/SOM) |
| 5 | **Бизнес модел** | 20 сек | Как печелиш пари |
| 6 | **Тракция** | 20 сек | Какво си постигнал досега |
| 7 | **Искане** | 15 сек | Какво ти трябва от аудиторията |

**Съвети за представяне:**
- **Започни с история или шокираща статистика** — емоция преди логика
- **Една идея на слайд** — не претоварвай с текст
- **Упражнявай на глас** — винаги отнема повече, отколкото мислиш
- **Поддържай контакт с очите** — свържи се с хората, не с екрана
- **Завърши силно** — последното ти изречение е, което ще запомнят`,
      },
      {
        titleEn: 'Example: Airbnb\'s Original Pitch',
        titleBg: 'Пример: Оригиналното представяне на Airbnb',
        bodyEn: `Airbnb's 2008 pitch deck is one of the most studied startup pitches ever. Here's how it maps to the 7-slide framework:

| Slide | What Airbnb did |
|-------|----------------|
| **Hook** | "Book rooms with locals, rather than hotels" |
| **Problem** | Hotels are expensive. Travelers want authentic local experiences. Hosts have extra space. |
| **Solution** | A platform connecting travelers with locals who have spare rooms |
| **Market** | 630K+ couchsurfers, 17M budget travelers, $1.9B market |
| **Business Model** | 10% commission on each booking |
| **Traction** | 2 successful pilot tests during conferences |
| **Ask** | $500K seed funding |

**What made it work:**
- Simple, clear problem → simple, clear solution
- Real market numbers (not "everyone who travels")
- Proof that it worked (pilot tests), even at tiny scale
- Specific ask with a clear use of funds

> 💡 **Notice:** The pitch is about the *customer's* story, not the founder's. Great pitches make the audience feel the problem.`,
        bodyBg: `Представянето на Airbnb от 2008 е едно от най-изучаваните стартъп представяния. Ето как се съотнася с рамката от 7 слайда:

| Слайд | Какво направи Airbnb |
|-------|---------------------|
| **Кука** | „Резервирай стаи при местни хора, вместо хотели" |
| **Проблем** | Хотелите са скъпи. Пътуващите искат автентични местни преживявания. Домакините имат допълнително пространство. |
| **Решение** | Платформа, свързваща пътуващи с местни хора, които имат свободни стаи |
| **Пазар** | 630K+ каучсърфъри, 17M бюджетни пътешественици, пазар от $1,9 милиарда |
| **Бизнес модел** | 10% комисионна на всяка резервация |
| **Тракция** | 2 успешни пилотни теста по време на конференции |
| **Искане** | $500K начално финансиране |

**Какво го направи успешно:**
- Прост, ясен проблем → просто, ясно решение
- Реални пазарни числа (не „всеки, който пътува")
- Доказателство, че работи (пилотни тестове), дори в малък мащаб
- Конкретно искане с ясно използване на средствата

> 💡 **Забележи:** Представянето е за историята на *клиента*, не на основателя. Великите представяния карат аудиторията да почувства проблема.`,
      },
      {
        titleEn: 'Quick Recap',
        titleBg: 'Бърз преговор',
        bodyEn: `**3 things to remember:**

✅ Investors care about **team, market, product, and traction** — in that order. Lead with your strongest point.

✅ Structure your pitch with the **7-slide framework** — hook, problem, solution, market, model, traction, ask — and keep it under 3 minutes.

✅ Your pitch is a **story**, not a report — start with emotion, back it up with data, and end with a clear call to action.

**Next step:** Submit your final startup pitch and get peer feedback →`,
        bodyBg: `**3 неща за запомняне:**

✅ Инвеститорите се интересуват от **екип, пазар, продукт и тракция** — в този ред. Води с най-силната си точка.

✅ Структурирай представянето си с **рамката от 7 слайда** — кука, проблем, решение, пазар, модел, тракция, искане — и го дръж под 3 минути.

✅ Представянето ти е **история**, не доклад — започни с емоция, подкрепи с данни и завърши с ясен призив за действие.

**Следваща стъпка:** Подай финалното си стартъп представяне и получи партньорска обратна връзка →`,
      },
    ],
  },
];
