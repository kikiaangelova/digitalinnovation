/**
 * Bilingual learning content for each of the 6 Journey stages.
 * Each stage follows a structured lesson format:
 *   1. Introduction
 *   2. Key Concepts (with examples)
 *   3. Framework / Model
 *   4. Real-World Example
 *   5. Key Takeaways
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
    readMinutes: 8,
    sections: [
      {
        titleEn: 'What is Digital Innovation?',
        titleBg: 'Какво е дигитална иновация?',
        bodyEn: `Digital innovation is the process of using **digital technologies** to create new — or improve existing — products, services, or business models.

It's not just about adding technology. It's about **rethinking how value is created and delivered**.

**Examples:**
- **Netflix** didn't just put movies online — it reinvented how entertainment is distributed and consumed.
- **Uber** didn't invent taxis — it reimagined urban transportation through a smartphone app.
- **Duolingo** didn't create new language content — it gamified learning and made it free.

> 💡 Digital innovation = Technology + New Value Creation`,
        bodyBg: `Дигиталната иновация е процесът на използване на **дигитални технологии** за създаване на нови — или подобряване на съществуващи — продукти, услуги или бизнес модели.

Не става само за добавяне на технология. Става за **преосмисляне как се създава и доставя стойност**.

**Примери:**
- **Netflix** не просто сложи филми онлайн — преоткри как се разпространява и консумира забавлението.
- **Uber** не изобрети таксита — преосмисли градския транспорт чрез мобилно приложение.
- **Duolingo** не създаде ново езиково съдържание — геймифицира ученето и го направи безплатно.

> 💡 Дигитална иновация = Технология + Ново създаване на стойност`,
      },
      {
        titleEn: '3 Types of Digital Disruption',
        titleBg: '3 вида дигитална дисрупция',
        bodyEn: `Not all disruption is the same. Clayton Christensen identified three patterns:

**1. Sustaining Innovation**
Improves existing products for current customers.
- *Example:* Apple adding Face ID to iPhones.

**2. Low-End Disruption**
Offers a "good enough" product at a much lower price.
- *Example:* Xiaomi offering smartphones at 1/3 the price of Samsung.

**3. New-Market Disruption**
Creates an entirely new market where none existed before.
- *Example:* Airbnb turned spare rooms into a global hospitality network.

| Type | Target | Strategy |
|------|--------|----------|
| Sustaining | Existing customers | Better features |
| Low-End | Price-sensitive users | Simpler & cheaper |
| New-Market | Non-consumers | New category |`,
        bodyBg: `Не всяка дисрупция е еднаква. Клейтън Кристенсен идентифицира три модела:

**1. Поддържаща иновация**
Подобрява съществуващи продукти за настоящите клиенти.
- *Пример:* Apple добавя Face ID към iPhone.

**2. Нискобюджетна дисрупция**
Предлага „достатъчно добър" продукт на много по-ниска цена.
- *Пример:* Xiaomi предлага смартфони на 1/3 от цената на Samsung.

**3. Дисрупция на нов пазар**
Създава изцяло нов пазар, където преди не е имало такъв.
- *Пример:* Airbnb превърна свободните стаи в глобална мрежа за настаняване.

| Тип | Целева група | Стратегия |
|-----|-------------|-----------|
| Поддържаща | Настоящи клиенти | По-добри функции |
| Нискобюджетна | Чувствителни към цената | По-просто и евтино |
| Нов пазар | Не-потребители | Нова категория |`,
      },
      {
        titleEn: 'How to Spot Innovation Opportunities',
        titleBg: 'Как да откриеш иновационни възможности',
        bodyEn: `Every industry has pain points waiting for a digital solution. Here's a simple framework:

**The Pain-Technology-Market (PTM) Framework:**

1. **Pain** — What frustrates people? What's slow, expensive, or inaccessible?
2. **Technology** — What digital tools could solve it? (AI, mobile, cloud, IoT, blockchain)
3. **Market** — Are enough people willing to pay for the solution?

**Exercise:** Think about your daily life. What's something you do that feels outdated or frustrating? Could technology make it 10x better?

**Signs of an innovation opportunity:**
- ❌ Manual processes that could be automated
- ❌ Information that's hard to access or compare
- ❌ Services that are expensive but don't need to be
- ❌ Industries that haven't changed in 20+ years`,
        bodyBg: `Всяка индустрия има болки, които чакат дигитално решение. Ето проста рамка:

**Рамка Болка-Технология-Пазар (БТП):**

1. **Болка** — Какво разочарова хората? Какво е бавно, скъпо или недостъпно?
2. **Технология** — Кои дигитални инструменти могат да го решат? (AI, мобилни, облак, IoT, блокчейн)
3. **Пазар** — Достатъчно хора ли са готови да платят за решението?

**Упражнение:** Помисли за ежедневието си. Какво правиш, което ти се струва остаряло или разочароващо? Може ли технологията да го направи 10 пъти по-добро?

**Признаци на иновационна възможност:**
- ❌ Ръчни процеси, които могат да бъдат автоматизирани
- ❌ Информация, която е трудна за достъп или сравнение
- ❌ Услуги, които са скъпи, но не е задължително
- ❌ Индустрии, които не са се променили от 20+ години`,
      },
      {
        titleEn: 'Key Takeaways',
        titleBg: 'Ключови изводи',
        bodyEn: `✅ Digital innovation is about **creating new value**, not just adding technology.

✅ Disruption comes in three flavors: **sustaining, low-end, and new-market**.

✅ Opportunities exist where there's **pain + available technology + willing market**.

✅ The best innovations make something **10x better, cheaper, or more accessible**.

**Next step:** Complete your first case study to see real digital innovation in action →`,
        bodyBg: `✅ Дигиталната иновация е за **създаване на нова стойност**, а не просто добавяне на технология.

✅ Дисрупцията идва в три форми: **поддържаща, нискобюджетна и на нов пазар**.

✅ Възможности съществуват където има **болка + налична технология + готов пазар**.

✅ Най-добрите иновации правят нещо **10 пъти по-добро, по-евтино или по-достъпно**.

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
    readMinutes: 10,
    sections: [
      {
        titleEn: 'Mapping the Competitive Landscape',
        titleBg: 'Картографиране на конкурентната среда',
        bodyEn: `Before building anything, you need to understand **who else is solving the same problem** — and how well they're doing it.

A competitive landscape map helps you find gaps and position your idea.

**Three types of competitors:**

| Type | Definition | Example (for a food delivery app) |
|------|-----------|-----------------------------------|
| **Direct** | Same product, same market | Uber Eats, DoorDash |
| **Indirect** | Different product, same need | Restaurant takeout, meal kits |
| **Substitutes** | Alternative way to solve the need | Cooking at home, eating out |

> 🎯 Your startup doesn't compete only with similar apps — it competes with **every way customers currently solve their problem**.

**How to research competitors:**
1. Google the problem (not the solution)
2. Check app stores and Product Hunt
3. Read customer reviews — what do they complain about?
4. Look at competitor pricing and features`,
        bodyBg: `Преди да създаваш каквото и да е, трябва да разбереш **кой друг решава същия проблем** — и колко добре го прави.

Картата на конкурентната среда ти помага да намериш пропуски и да позиционираш идеята си.

**Три типа конкуренти:**

| Тип | Определение | Пример (за приложение за доставка на храна) |
|-----|-----------|---------------------------------------------|
| **Преки** | Същият продукт, същият пазар | Uber Eats, DoorDash |
| **Непреки** | Различен продукт, същата нужда | Ресторантска храна за вкъщи, кутии с рецепти |
| **Заместители** | Алтернативен начин за задоволяване на нуждата | Готвене у дома, хранене навън |

> 🎯 Твоят стартъп не се конкурира само с подобни приложения — конкурира се с **всеки начин, по който клиентите в момента решават проблема си**.

**Как да проучиш конкурентите:**
1. Търси в Google за проблема (не за решението)
2. Провери магазини за приложения и Product Hunt
3. Прочети отзиви на клиенти — от какво се оплакват?
4. Разгледай ценообразуването и функциите на конкурентите`,
      },
      {
        titleEn: 'SWOT Analysis (Simplified)',
        titleBg: 'SWOT анализ (опростен)',
        bodyEn: `SWOT is one of the most popular strategic frameworks. It helps you evaluate any company — including your own.

| | Helpful | Harmful |
|---|---------|---------|
| **Internal** | **Strengths** — What you do well | **Weaknesses** — Where you're limited |
| **External** | **Opportunities** — Market trends in your favor | **Threats** — Risks and competitors |

**Example: A student building an eco-friendly packaging startup**

| | Helpful | Harmful |
|---|---------|---------|
| Internal | ✅ Passionate team, low costs | ⚠️ No manufacturing experience |
| External | ✅ Growing demand for sustainability | ⚠️ Big players entering the space |

**Tips for a good SWOT:**
- Be **specific** — "good team" is weak; "team has chemistry background" is strong
- Focus on what's **actionable** — can you leverage strengths or address weaknesses?
- Compare your SWOT to competitors' to find your **unique advantage**`,
        bodyBg: `SWOT е една от най-популярните стратегически рамки. Помага ти да оцениш всяка компания — включително своята.

| | Полезно | Вредно |
|---|---------|--------|
| **Вътрешно** | **Силни страни** — Какво правиш добре | **Слабости** — Къде си ограничен |
| **Външно** | **Възможности** — Пазарни тенденции в твоя полза | **Заплахи** — Рискове и конкуренти |

**Пример: Ученик, който създава стартъп за екологични опаковки**

| | Полезно | Вредно |
|---|---------|--------|
| Вътрешно | ✅ Мотивиран екип, ниски разходи | ⚠️ Няма производствен опит |
| Външно | ✅ Нарастващо търсене на устойчивост | ⚠️ Големи играчи навлизат |

**Съвети за добър SWOT:**
- Бъди **конкретен** — „добър екип" е слабо; „екипът има знания по химия" е силно
- Фокусирай се върху **приложимото** — можеш ли да използваш силните страни или да адресираш слабостите?
- Сравни своя SWOT с този на конкурентите, за да намериш **уникалното си предимство**`,
      },
      {
        titleEn: 'Porter\'s Five Forces (Lite)',
        titleBg: 'Петте сили на Портър (опростено)',
        bodyEn: `Michael Porter's framework helps you understand **how attractive an industry is** and how hard it will be to succeed in it.

**The 5 Forces:**

1. 🏭 **Rivalry among competitors** — How intense is the competition?
   - Many similar products = high rivalry
2. 🚪 **Threat of new entrants** — How easy is it for new players to enter?
   - Low barriers = more competition coming
3. 🔄 **Threat of substitutes** — Can customers solve the problem differently?
   - Many alternatives = harder to retain users
4. 💰 **Bargaining power of buyers** — Can customers easily switch?
   - Low switching costs = less loyalty
5. 🏗️ **Bargaining power of suppliers** — Do you depend on a few key suppliers?
   - Fewer suppliers = they have more power

**Quick assessment example (ride-sharing industry):**
- Rivalry: ⬆️ High (Uber, Lyft, Bolt)
- New entrants: ⬇️ Moderate (need capital + drivers)
- Substitutes: ⬆️ High (public transport, bikes, walking)
- Buyer power: ⬆️ High (easy to switch apps)
- Supplier power: ⬆️ High (drivers can switch platforms)

> This tells us ride-sharing is a **tough industry** — margins are thin and loyalty is low.`,
        bodyBg: `Рамката на Майкъл Портър ти помага да разбереш **колко привлекателна е една индустрия** и колко трудно ще е да успееш в нея.

**Петте сили:**

1. 🏭 **Конкуренция между компаниите** — Колко интензивна е?
   - Много подобни продукти = висока конкуренция
2. 🚪 **Заплаха от нови участници** — Колко лесно е за нови играчи да навлязат?
   - Ниски бариери = идва повече конкуренция
3. 🔄 **Заплаха от заместители** — Могат ли клиентите да решат проблема по друг начин?
   - Много алтернативи = по-трудно задържане на потребители
4. 💰 **Пазарна сила на купувачите** — Могат ли клиентите лесно да сменят?
   - Ниски разходи за смяна = по-малка лоялност
5. 🏗️ **Пазарна сила на доставчиците** — Зависиш ли от малко ключови доставчици?
   - По-малко доставчици = повече власт за тях

**Пример за бърза оценка (индустрия за споделено пътуване):**
- Конкуренция: ⬆️ Висока (Uber, Lyft, Bolt)
- Нови участници: ⬇️ Умерена (нужен е капитал + шофьори)
- Заместители: ⬆️ Висока (обществен транспорт, велосипеди, ходене)
- Сила на купувачите: ⬆️ Висока (лесно се сменя приложение)
- Сила на доставчиците: ⬆️ Висока (шофьорите могат да сменят платформи)

> Това ни казва, че споделеното пътуване е **трудна индустрия** — маржовете са тънки и лоялността е ниска.`,
      },
      {
        titleEn: 'What Makes a Digital Business Defensible?',
        titleBg: 'Какво прави дигиталния бизнес защитим?',
        bodyEn: `A defensible business is one that's **hard for competitors to copy**. In the digital world, there are four main "moats":

**1. Network Effects** 🌐
The product gets better as more people use it.
- *Example:* Instagram — more users = more content = more users

**2. Switching Costs** 🔒
It's painful for customers to leave.
- *Example:* Slack — all your team history and integrations are there

**3. Data Advantage** 📊
More data leads to better products.
- *Example:* Spotify's recommendation algorithm improves with every listen

**4. Brand & Trust** 💎
People choose you because they trust you.
- *Example:* Apple — customers pay premium prices for the brand

> ⚡ **The strongest startups have at least one moat from Day 1**, even if it's small. Your job is to identify which moat your startup can build.`,
        bodyBg: `Защитимият бизнес е такъв, който е **труден за копиране от конкурентите**. В дигиталния свят има четири основни „рова":

**1. Мрежови ефекти** 🌐
Продуктът става по-добър, когато повече хора го използват.
- *Пример:* Instagram — повече потребители = повече съдържание = повече потребители

**2. Разходи за смяна** 🔒
Болезнено е за клиентите да напуснат.
- *Пример:* Slack — цялата история на екипа и интеграциите ти са там

**3. Предимство от данни** 📊
Повече данни водят до по-добри продукти.
- *Пример:* Алгоритъмът за препоръки на Spotify се подобрява с всяко слушане

**4. Марка и доверие** 💎
Хората те избират, защото ти имат доверие.
- *Пример:* Apple — клиентите плащат премиум цени заради марката

> ⚡ **Най-силните стартъпи имат поне един ров от Ден 1**, дори и малък. Твоята задача е да идентифицираш кой ров може да изгради твоят стартъп.`,
      },
      {
        titleEn: 'Key Takeaways',
        titleBg: 'Ключови изводи',
        bodyEn: `✅ Competitors come in three types: **direct, indirect, and substitutes** — analyze all three.

✅ Use **SWOT** to evaluate strengths vs. threats — be specific, not generic.

✅ Use **Porter's Five Forces** to assess how hard the industry is.

✅ Build a **defensible moat**: network effects, switching costs, data advantage, or brand trust.

**Next step:** Identify 3 competitors for your startup idea and analyze their strengths →`,
        bodyBg: `✅ Конкурентите са три вида: **преки, непреки и заместители** — анализирай и трите.

✅ Използвай **SWOT** за оценка на силни страни срещу заплахи — бъди конкретен, не общ.

✅ Използвай **Петте сили на Портър** за оценка колко трудна е индустрията.

✅ Изгради **защитен ров**: мрежови ефекти, разходи за смяна, предимство от данни или марка.

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
    readMinutes: 8,
    sections: [
      {
        titleEn: 'The Problem-Solution Fit',
        titleBg: 'Съответствие проблем-решение',
        bodyEn: `Every great startup starts with a **real problem**. Not a feature, not a technology — a problem.

**The Problem Statement Formula:**
> "[Target customer] struggles with [specific problem] because [root cause], which results in [negative outcome]."

**Good example:**
> "High school students struggle with choosing a career path because career counseling is limited to 1-2 sessions per year, which results in uninformed university choices."

**Bad example:**
> "People need a better app." ← Too vague!

**How to validate your problem:**
1. 🗣️ Ask 5 people: "Have you experienced this problem?"
2. 📊 Search for data: How many people are affected?
3. 💰 Check willingness to pay: Would they pay for a solution?

> ⚠️ **Common mistake:** Falling in love with your solution before proving the problem exists.`,
        bodyBg: `Всеки велик стартъп започва с **реален проблем**. Не функция, не технология — проблем.

**Формула за формулировка на проблема:**
> „[Целеви клиент] се затруднява с [конкретен проблем], защото [основна причина], което води до [негативен резултат]."

**Добър пример:**
> „Учениците от гимназията се затрудняват с избора на кариера, защото кариерното консултиране е ограничено до 1-2 сесии годишно, което води до неинформирани избори за университет."

**Лош пример:**
> „Хората имат нужда от по-добро приложение." ← Твърде неясно!

**Как да валидираш проблема си:**
1. 🗣️ Попитай 5 души: „Преживявал/а ли си този проблем?"
2. 📊 Потърси данни: Колко хора са засегнати?
3. 💰 Провери готовността за плащане: Биха ли платили за решение?

> ⚠️ **Честа грешка:** Да се влюбиш в решението си, преди да докажеш, че проблемът съществува.`,
      },
      {
        titleEn: 'Defining Your Target Customer',
        titleBg: 'Определяне на целевия клиент',
        bodyEn: `"Everyone" is not a customer segment. The more specific you are, the better your product will be.

**Customer Persona Template:**

| Attribute | Your Answer |
|-----------|------------|
| **Age range** | e.g., 16-19 |
| **Location** | e.g., Urban Bulgaria |
| **Occupation** | e.g., High school student |
| **Pain point** | e.g., No structured career guidance |
| **Current solution** | e.g., Asking friends, random Google searches |
| **Why it's not enough** | e.g., Biased advice, information overload |

**The "Mom Test" Questions:**
Instead of asking "Would you use my product?", ask:
- "Tell me about the last time you faced [problem]."
- "What did you try? Why didn't it work?"
- "How much time/money do you spend dealing with this?"

> 🎯 **Rule of thumb:** If you can't describe your customer in one sentence, you haven't defined them well enough.`,
        bodyBg: `„Всички" не е клиентски сегмент. Колкото по-конкретен си, толкова по-добър ще е продуктът ти.

**Шаблон за клиентска персона:**

| Атрибут | Твоят отговор |
|---------|--------------|
| **Възрастов диапазон** | напр. 16-19 |
| **Местоположение** | напр. Градска България |
| **Занимание** | напр. Гимназист |
| **Болка** | напр. Няма структурирано кариерно ориентиране |
| **Текущо решение** | напр. Питане на приятели, случайни търсения в Google |
| **Защо не е достатъчно** | напр. Пристрастни съвети, претоварване с информация |

**Въпроси по „Теста на мама":**
Вместо да питаш „Би ли използвал продукта ми?", питай:
- „Разкажи ми за последния път, когато срещна [проблема]."
- „Какво опита? Защо не проработи?"
- „Колко време/пари харчиш за справяне с това?"

> 🎯 **Правило:** Ако не можеш да опишеш клиента си в едно изречение, не си го дефинирал достатъчно добре.`,
      },
      {
        titleEn: 'Crafting Your Value Proposition',
        titleBg: 'Създаване на стойностно предложение',
        bodyEn: `Your value proposition answers: **"Why should the customer choose YOU instead of the alternatives?"**

**Value Proposition Canvas (Simplified):**

| Customer Side | Your Side |
|---------------|-----------|
| **Jobs** — What are they trying to achieve? | **Products/Services** — What do you offer? |
| **Pains** — What frustrates them? | **Pain Relievers** — How do you reduce their frustrations? |
| **Gains** — What would delight them? | **Gain Creators** — How do you create delight? |

**Formula:**
> "We help [target customer] to [job to be done] by [unique approach], unlike [alternative] which [limitation]."

**Example:**
> "We help high school students make informed career choices by providing AI-powered career matching based on their skills and interests, unlike school counselors who have time for only 2 sessions per year."

**Checklist for a strong value proposition:**
- [ ] Specific to one customer segment
- [ ] Addresses a real, validated pain
- [ ] Clearly different from existing alternatives
- [ ] Can be explained in under 15 seconds`,
        bodyBg: `Стойностното ти предложение отговаря на: **„Защо клиентът да избере ТЕБ вместо алтернативите?"**

**Канвас за стойностно предложение (опростен):**

| Страна на клиента | Твоята страна |
|-------------------|---------------|
| **Задачи** — Какво се опитват да постигнат? | **Продукти/Услуги** — Какво предлагаш? |
| **Болки** — Какво ги разочарова? | **Облекчаващи болката** — Как намаляваш разочарованията им? |
| **Ползи** — Какво би ги зарадвало? | **Създатели на ползи** — Как създаваш радост? |

**Формула:**
> „Помагаме на [целеви клиент] да [задача за изпълнение] чрез [уникален подход], за разлика от [алтернатива], която [ограничение]."

**Пример:**
> „Помагаме на гимназисти да направят информирани кариерни избори чрез AI-базирано съпоставяне на кариери според уменията и интересите им, за разлика от училищните съветници, които имат време за само 2 сесии годишно."

**Чеклист за силно стойностно предложение:**
- [ ] Конкретно за един клиентски сегмент
- [ ] Адресира реална, валидирана болка
- [ ] Ясно различно от съществуващите алтернативи
- [ ] Може да се обясни за под 15 секунди`,
      },
      {
        titleEn: 'Key Takeaways',
        titleBg: 'Ключови изводи',
        bodyEn: `✅ Start with the **problem**, not the solution. Validate before you build.

✅ Define your customer with **specifics**: age, location, pain, current solution.

✅ Your value proposition must be **clear, specific, and differentiated**.

✅ Use the **Value Proposition Canvas** to align customer needs with your offering.

**Next step:** Go to My Startup and write your problem statement and target customer →`,
        bodyBg: `✅ Започни с **проблема**, не с решението. Валидирай, преди да строиш.

✅ Определи клиента си с **конкретики**: възраст, местоположение, болка, текущо решение.

✅ Стойностното ти предложение трябва да е **ясно, конкретно и диференцирано**.

✅ Използвай **Канваса за стойностно предложение**, за да съгласуваш нуждите на клиента с предложението си.

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
    readMinutes: 10,
    sections: [
      {
        titleEn: 'What is an MVP?',
        titleBg: 'Какво е MVP?',
        bodyEn: `MVP stands for **Minimum Viable Product** — the simplest version of your product that delivers value to early users.

**The MVP is NOT:**
- ❌ A broken or ugly product
- ❌ A demo with no real functionality
- ❌ Your final product stripped down

**The MVP IS:**
- ✅ The **smallest thing you can build** to test your core assumption
- ✅ Something real users can **actually use**
- ✅ A learning tool, not a revenue tool

**Types of MVPs:**

| Type | Description | Example |
|------|-------------|---------|
| **Landing Page** | A website describing the product + sign-up | Dropbox's explainer video |
| **Wizard of Oz** | Looks automated, but you do it manually behind the scenes | Early Zappos (manually bought shoes) |
| **Concierge** | Do the service manually for first users | Food delivery before the app exists |
| **Single-Feature** | Build just ONE core feature | Instagram started with only photo filters |

> 🎯 **Ask yourself:** "What is the ONE feature that, without it, my product has no reason to exist?"`,
        bodyBg: `MVP означава **Minimum Viable Product (Минимално жизнеспособен продукт)** — най-простата версия на продукта ти, която доставя стойност на ранни потребители.

**MVP НЕ е:**
- ❌ Счупен или грозен продукт
- ❌ Демо без реална функционалност
- ❌ Финалният ти продукт в орязана версия

**MVP Е:**
- ✅ **Най-малкото нещо, което можеш да създадеш**, за да тестваш основното си предположение
- ✅ Нещо, което реални потребители могат **наистина да използват**
- ✅ Инструмент за учене, не за приходи

**Типове MVP:**

| Тип | Описание | Пример |
|-----|----------|--------|
| **Целева страница** | Уебсайт, описващ продукта + регистрация | Обяснителното видео на Dropbox |
| **Магьосник от Оз** | Изглежда автоматизирано, но го правиш ръчно зад кулисите | Ранният Zappos (ръчно купуваше обувки) |
| **Консиерж** | Предоставяш услугата ръчно за първите потребители | Доставка на храна преди приложението да съществува |
| **Единична функция** | Създай ЕДНА основна функция | Instagram започна само с филтри за снимки |

> 🎯 **Попитай себе си:** „Коя е ЕДИНСТВЕНАТА функция, без която продуктът ми няма причина да съществува?"`,
      },
      {
        titleEn: 'The Business Model Canvas',
        titleBg: 'Business Model Canvas',
        bodyEn: `The Business Model Canvas (BMC) is a **one-page strategic tool** that describes how your business creates, delivers, and captures value.

**The 9 Building Blocks:**

| # | Block | Key Question |
|---|-------|-------------|
| 1 | **Customer Segments** | Who are your customers? |
| 2 | **Value Proposition** | Why do they buy from you? |
| 3 | **Channels** | How do you reach them? |
| 4 | **Customer Relationships** | How do you keep them? |
| 5 | **Revenue Streams** | How do you make money? |
| 6 | **Key Resources** | What do you need to operate? |
| 7 | **Key Activities** | What must you do daily? |
| 8 | **Key Partners** | Who helps you? |
| 9 | **Cost Structure** | What are your main costs? |

**Tips for filling out your BMC:**
- Start with **Customer Segments** and **Value Proposition** — everything else flows from these
- Be specific: "Instagram ads targeting 16-25 year olds" is better than "social media marketing"
- Revenue Streams should include **pricing model** (subscription, freemium, commission, etc.)`,
        bodyBg: `Business Model Canvas (BMC) е **едностраничен стратегически инструмент**, който описва как бизнесът ти създава, доставя и улавя стойност.

**Деветте градивни блока:**

| # | Блок | Ключов въпрос |
|---|------|--------------|
| 1 | **Клиентски сегменти** | Кои са клиентите ти? |
| 2 | **Стойностно предложение** | Защо купуват от теб? |
| 3 | **Канали** | Как ги достигаш? |
| 4 | **Отношения с клиенти** | Как ги задържаш? |
| 5 | **Потоци приходи** | Как печелиш пари? |
| 6 | **Ключови ресурси** | Какво ти трябва, за да работиш? |
| 7 | **Ключови дейности** | Какво трябва да правиш ежедневно? |
| 8 | **Ключови партньори** | Кой ти помага? |
| 9 | **Структура на разходите** | Кои са основните ти разходи? |

**Съвети за попълване на BMC:**
- Започни с **Клиентски сегменти** и **Стойностно предложение** — всичко останало произтича от тях
- Бъди конкретен: „Instagram реклами, насочени към 16-25 годишни" е по-добре от „маркетинг в социални мрежи"
- Потоците приходи трябва да включват **ценови модел** (абонамент, freemium, комисионна и т.н.)`,
      },
      {
        titleEn: 'Revenue Models for Digital Products',
        titleBg: 'Модели на приходи за дигитални продукти',
        bodyEn: `How will your startup make money? Here are the most common digital revenue models:

| Model | How it works | Example |
|-------|-------------|---------|
| **Subscription** | Monthly/yearly fee for access | Netflix, Spotify |
| **Freemium** | Free basic tier + paid premium | Canva, Slack |
| **Commission** | Take a % of each transaction | Airbnb (3-15%), Uber (25%) |
| **Advertising** | Free for users, paid by advertisers | Instagram, YouTube |
| **One-time purchase** | Pay once to own | Games, digital downloads |
| **Data licensing** | Sell insights derived from usage data | Waze sells traffic data |

**Choosing your model:**
- **Subscription** works when users get ongoing value
- **Freemium** works when the free version drives word-of-mouth
- **Commission** works in marketplace/platform businesses
- **Advertising** works when you have millions of users

> 💡 Many startups combine models. Spotify uses freemium (free with ads) + subscription (premium without ads).`,
        bodyBg: `Как ще печели пари стартъпът ти? Ето най-разпространените модели на дигитални приходи:

| Модел | Как работи | Пример |
|-------|-----------|--------|
| **Абонамент** | Месечна/годишна такса за достъп | Netflix, Spotify |
| **Freemium** | Безплатно основно ниво + платено премиум | Canva, Slack |
| **Комисионна** | Вземаш % от всяка транзакция | Airbnb (3-15%), Uber (25%) |
| **Реклама** | Безплатно за потребителите, платено от рекламодатели | Instagram, YouTube |
| **Еднократна покупка** | Плащаш веднъж, за да притежаваш | Игри, дигитални продукти |
| **Лицензиране на данни** | Продажба на анализи от данни за използване | Waze продава данни за трафика |

**Избиране на модел:**
- **Абонамент** работи, когато потребителите получават постоянна стойност
- **Freemium** работи, когато безплатната версия генерира „от уста на уста"
- **Комисионна** работи за маркетплейс/платформени бизнеси
- **Реклама** работи, когато имаш милиони потребители

> 💡 Много стартъпи комбинират модели. Spotify използва freemium (безплатно с реклами) + абонамент (премиум без реклами).`,
      },
      {
        titleEn: 'Key Takeaways',
        titleBg: 'Ключови изводи',
        bodyEn: `✅ Your MVP should test your **core assumption** with real users — keep it minimal.

✅ The Business Model Canvas has **9 blocks** — start with Customer Segments + Value Proposition.

✅ Choose a **revenue model** that matches your product type and audience.

✅ Revenue = Value. If customers won't pay, reassess your value proposition.

**Next step:** Go to My Startup and fill out your Business Model Canvas →`,
        bodyBg: `✅ Твоят MVP трябва да тества **основното ти предположение** с реални потребители — дръж го минимално.

✅ Business Model Canvas има **9 блока** — започни с Клиентски сегменти + Стойностно предложение.

✅ Избери **модел на приходи**, който съответства на типа продукт и аудитория.

✅ Приход = Стойност. Ако клиентите не плащат, преосмисли стойностното си предложение.

**Следваща стъпка:** Отиди в Моят стартъп и попълни своя Business Model Canvas →`,
      },
    ],
  },

  /* ══════════════ STAGE 5: Business Model & Marketing ══════════════ */
  {
    stageId: 5,
    titleEn: 'Business Model & Marketing Strategy',
    titleBg: 'Бизнес модел и маркетинг стратегия',
    subtitleEn: 'Learn growth frameworks, marketing channels, and how strategic decisions affect KPIs.',
    subtitleBg: 'Научи рамки за растеж, маркетинг канали и как стратегическите решения влияят на KPI.',
    readMinutes: 9,
    sections: [
      {
        titleEn: 'KPIs That Matter for Startups',
        titleBg: 'KPI-та, които имат значение за стартъпи',
        bodyEn: `KPIs (Key Performance Indicators) are the **numbers that tell you if your startup is healthy**.

**The 5 Essential Startup KPIs:**

| KPI | What it measures | Good target |
|-----|-----------------|-------------|
| **Users/Customers** | How many people use your product | Growing week-over-week |
| **Revenue** | How much money you earn | Positive trend |
| **Conversion Rate** | % of visitors who become users | 2-5% for digital products |
| **Retention** | % of users who come back | >40% after 30 days |
| **CAC** (Customer Acquisition Cost) | Cost to get one new customer | Lower than customer lifetime value |

**The AARRR Framework (Pirate Metrics):**

1. **Acquisition** — How do users find you?
2. **Activation** — Do they have a good first experience?
3. **Retention** — Do they come back?
4. **Revenue** — Do they pay?
5. **Referral** — Do they tell friends?

> 📊 **Focus on retention first.** If users don't come back, spending more on acquisition is like pouring water into a leaky bucket.`,
        bodyBg: `KPI (ключови показатели за ефективност) са **числата, които ти казват дали стартъпът ти е здрав**.

**Петте основни KPI за стартъпи:**

| KPI | Какво измерва | Добра цел |
|-----|--------------|-----------|
| **Потребители/Клиенти** | Колко хора използват продукта ти | Растеж седмица по седмица |
| **Приходи** | Колко пари печелиш | Положителна тенденция |
| **Конверсия** | % посетители, които стават потребители | 2-5% за дигитални продукти |
| **Задържане** | % потребители, които се връщат | >40% след 30 дни |
| **CAC** (Цена за привличане на клиент) | Разход за привличане на един нов клиент | По-ниска от стойността на клиента |

**Рамка AARRR (Пиратски метрики):**

1. **Привличане** — Как потребителите те намират?
2. **Активиране** — Имат ли добро първо преживяване?
3. **Задържане** — Връщат ли се?
4. **Приход** — Плащат ли?
5. **Препоръки** — Казват ли на приятели?

> 📊 **Фокусирай се върху задържането първо.** Ако потребителите не се връщат, да харчиш повече за привличане е като да наливаш вода в пробита кофа.`,
      },
      {
        titleEn: 'Growth & Marketing Channels',
        titleBg: 'Канали за растеж и маркетинг',
        bodyEn: `There are many ways to reach customers. The key is finding the **right channel for your audience**.

**Digital Marketing Channels:**

| Channel | Best for | Cost |
|---------|---------|------|
| **Social Media** (Instagram, TikTok) | B2C, young audiences | Low-Medium |
| **Content Marketing** (blog, YouTube) | Building authority | Low (but slow) |
| **SEO** (Google search) | Long-term organic traffic | Low (takes time) |
| **Paid Ads** (Google, Meta) | Fast, scalable reach | High |
| **Email Marketing** | Retention, upselling | Very Low |
| **Partnerships** | Reaching new audiences | Varies |
| **Community** (Discord, Reddit) | Niche products | Low |

**Choosing your channel — the Bullseye Framework:**
1. **Outer ring:** Brainstorm ALL possible channels
2. **Middle ring:** Test the 3 most promising with small experiments
3. **Bullseye:** Double down on the 1-2 that work best

> 💡 **Most startups find that 1-2 channels drive 80% of their growth.** Don't try to be everywhere — find what works and focus.`,
        bodyBg: `Има много начини да достигнеш клиентите. Ключът е да намериш **правилния канал за твоята аудитория**.

**Дигитални маркетинг канали:**

| Канал | Най-добър за | Цена |
|-------|-------------|------|
| **Социални мрежи** (Instagram, TikTok) | B2C, млада аудитория | Ниска-Средна |
| **Съдържание** (блог, YouTube) | Изграждане на авторитет | Ниска (но бавна) |
| **SEO** (търсене в Google) | Дългосрочен органичен трафик | Ниска (отнема време) |
| **Платена реклама** (Google, Meta) | Бърз, мащабируем обхват | Висока |
| **Имейл маркетинг** | Задържане, кръстосани продажби | Много ниска |
| **Партньорства** | Достигане до нови аудитории | Различна |
| **Общност** (Discord, Reddit) | Нишови продукти | Ниска |

**Избиране на канал — рамката Bullseye:**
1. **Външен пръстен:** Направи мозъчна атака за ВСИЧКИ възможни канали
2. **Среден пръстен:** Тествай 3-те най-обещаващи с малки експерименти
3. **Bullseye:** Удвои усилията за 1-2-та, които работят най-добре

> 💡 **Повечето стартъпи откриват, че 1-2 канала генерират 80% от растежа им.** Не се опитвай да си навсякъде — намери какво работи и се фокусирай.`,
      },
      {
        titleEn: 'Strategic Decisions & Trade-offs',
        titleBg: 'Стратегически решения и компромиси',
        bodyEn: `Running a startup means making decisions with **limited resources**. Every choice has trade-offs.

**Common strategic dilemmas:**

| Dilemma | Option A | Option B |
|---------|----------|----------|
| **Growth vs. Profitability** | Spend aggressively to grow fast | Grow slowly but stay profitable |
| **Quality vs. Speed** | Build a polished product slowly | Ship fast and iterate |
| **Broad vs. Niche** | Target everyone | Dominate a small segment first |

**Decision-Making Framework:**
1. **What is our #1 goal right now?** (Growth? Revenue? Validation?)
2. **What data do we have?** (User feedback, KPI trends)
3. **What's reversible?** (Prefer reversible decisions — less risky)
4. **What's the worst case?** (Can we survive if this fails?)

> ⚡ **Speed matters more than perfection.** In the startup world, a good decision made quickly beats a perfect decision made too late.`,
        bodyBg: `Воденето на стартъп означава вземане на решения с **ограничени ресурси**. Всеки избор има компромиси.

**Чести стратегически дилеми:**

| Дилема | Вариант А | Вариант Б |
|--------|-----------|-----------|
| **Растеж vs. Печалба** | Харчи агресивно за бърз растеж | Расти бавно, но остани печеливш |
| **Качество vs. Скорост** | Създай полиран продукт бавно | Пусни бързо и итерирай |
| **Широк vs. Нишов** | Таргетирай всички | Доминирай малък сегмент първо |

**Рамка за вземане на решения:**
1. **Коя е целта ни #1 в момента?** (Растеж? Приходи? Валидация?)
2. **Какви данни имаме?** (Обратна връзка от потребители, тенденции в KPI)
3. **Какво е обратимо?** (Предпочитай обратими решения — по-малко рискови)
4. **Какъв е най-лошият сценарий?** (Можем ли да оцелеем, ако това се провали?)

> ⚡ **Скоростта е по-важна от перфекцията.** В стартъп света доброто решение, взето бързо, побеждава перфектното решение, взето твърде късно.`,
      },
      {
        titleEn: 'Key Takeaways',
        titleBg: 'Ключови изводи',
        bodyEn: `✅ Track the **5 essential KPIs**: users, revenue, conversion, retention, CAC.

✅ Use the **AARRR framework** to find leaks in your growth funnel.

✅ Find 1-2 **marketing channels** that work and focus on them.

✅ Strategic decisions are about **trade-offs** — use data, not gut feeling.

**Next step:** Try the Business Simulator to practice strategic decision-making with real KPIs →`,
        bodyBg: `✅ Проследявай **5-те основни KPI**: потребители, приходи, конверсия, задържане, CAC.

✅ Използвай **рамката AARRR**, за да намериш пропуските в своята фуния за растеж.

✅ Намери 1-2 **маркетинг канала**, които работят, и се фокусирай върху тях.

✅ Стратегическите решения са за **компромиси** — използвай данни, не интуиция.

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
    readMinutes: 7,
    sections: [
      {
        titleEn: 'What Investors Look For',
        titleBg: 'Какво търсят инвеститорите',
        bodyEn: `When investors evaluate a startup pitch, they look for **four things** (in this order):

**1. Team** 👥 — Can these people execute?
- Do they understand the problem deeply?
- Do they have relevant skills or experience?

**2. Market** 📈 — Is the opportunity big enough?
- How many potential customers exist?
- Is the market growing?

**3. Product** 🎯 — Does it solve a real problem?
- Is there evidence of demand (users, sign-ups, interest)?
- What's the unique advantage?

**4. Traction** 🚀 — Is there proof it works?
- User numbers, revenue, growth rate
- Even small numbers matter if the trend is up

> 💡 **Key insight:** Investors bet on teams more than ideas. A great team with a mediocre idea will pivot. A mediocre team with a great idea will fail.`,
        bodyBg: `Когато инвеститорите оценяват стартъп представяне, те търсят **четири неща** (в този ред):

**1. Екип** 👥 — Могат ли тези хора да изпълнят?
- Разбират ли проблема дълбоко?
- Имат ли подходящи умения или опит?

**2. Пазар** 📈 — Достатъчно голяма ли е възможността?
- Колко потенциални клиенти съществуват?
- Расте ли пазарът?

**3. Продукт** 🎯 — Решава ли реален проблем?
- Има ли доказателства за търсене (потребители, регистрации, интерес)?
- Какво е уникалното предимство?

**4. Тракция** 🚀 — Има ли доказателство, че работи?
- Брой потребители, приходи, темп на растеж
- Дори малки числа имат значение, ако тенденцията е нагоре

> 💡 **Ключов извод:** Инвеститорите залагат на екипи повече от идеи. Страхотен екип с посредствена идея ще се пренасочи. Посредствен екип със страхотна идея ще се провали.`,
      },
      {
        titleEn: 'The 3-Minute Pitch Structure',
        titleBg: 'Структура на 3-минутно представяне',
        bodyEn: `A great pitch tells a **story** in a structured way. Here's the proven format:

**The 7-Slide Framework:**

| # | Slide | Duration | Content |
|---|-------|----------|---------|
| 1 | **Hook** | 15 sec | One sentence that captures attention |
| 2 | **Problem** | 30 sec | The pain your customers feel |
| 3 | **Solution** | 30 sec | Your product and how it solves the problem |
| 4 | **Market** | 20 sec | How big is the opportunity (TAM/SAM/SOM) |
| 5 | **Business Model** | 20 sec | How you make money |
| 6 | **Traction** | 20 sec | What you've achieved so far |
| 7 | **Ask** | 15 sec | What you need (funding, partnership, feedback) |

**Pitch tips:**
- **Start with a story or a shocking statistic** — don't start with "Hi, my name is..."
- **Show, don't tell** — "We have 200 users" beats "Our product is great"
- **One idea per slide** — don't overload with text
- **Practice out loud** — it's always longer than you think
- **End with a clear call to action** — what do you want the audience to do?`,
        bodyBg: `Страхотното представяне разказва **история** по структуриран начин. Ето доказаният формат:

**Рамката от 7 слайда:**

| # | Слайд | Продължителност | Съдържание |
|---|-------|----------------|-----------|
| 1 | **Кука** | 15 сек | Едно изречение, което привлича внимание |
| 2 | **Проблем** | 30 сек | Болката, която клиентите ти изпитват |
| 3 | **Решение** | 30 сек | Твоят продукт и как решава проблема |
| 4 | **Пазар** | 20 сек | Колко голяма е възможността (TAM/SAM/SOM) |
| 5 | **Бизнес модел** | 20 сек | Как печелиш пари |
| 6 | **Тракция** | 20 сек | Какво си постигнал досега |
| 7 | **Искане** | 15 сек | Какво ти трябва (финансиране, партньорство, обратна връзка) |

**Съвети за представяне:**
- **Започни с история или шокираща статистика** — не започвай с „Здравейте, казвам се..."
- **Покажи, не казвай** — „Имаме 200 потребители" побеждава „Продуктът ни е страхотен"
- **Една идея на слайд** — не претоварвай с текст
- **Упражнявай на глас** — винаги е по-дълго, отколкото мислиш
- **Завърши с ясен призив за действие** — какво искаш аудиторията да направи?`,
      },
      {
        titleEn: 'Giving & Receiving Feedback',
        titleBg: 'Даване и получаване на обратна връзка',
        bodyEn: `Peer feedback is one of the most valuable parts of the entrepreneurial process.

**Giving constructive feedback:**
- ✅ Start with what's **strong** — "Your problem statement is very clear"
- ✅ Be **specific** — "The revenue model section needs more detail on pricing"
- ✅ Suggest **alternatives** — "Have you considered a freemium model instead?"
- ❌ Avoid vague criticism — "It's not good enough" helps nobody

**Receiving feedback gracefully:**
- Listen first, defend later (or not at all)
- Look for patterns — if 3 people say the same thing, they're probably right
- Not all feedback needs to be acted on — you decide what's valuable
- Say "thank you" — it takes courage to give honest feedback

**Feedback rubric for peer reviews:**

| Criterion | What to evaluate |
|-----------|-----------------|
| **Clarity** | Is the idea easy to understand? |
| **Problem importance** | Is this a real, significant problem? |
| **Innovation** | Is the solution new or creative? |
| **Feasibility** | Can it actually be built and delivered? |
| **Market potential** | Is there a real market for this? |`,
        bodyBg: `Партньорската обратна връзка е една от най-ценните части на предприемаческия процес.

**Даване на конструктивна обратна връзка:**
- ✅ Започни с това, което е **силно** — „Формулировката ти на проблема е много ясна"
- ✅ Бъди **конкретен** — „Секцията за модел на приходи се нуждае от повече детайли за ценообразуването"
- ✅ Предложи **алтернативи** — „Обмислял ли си freemium модел вместо това?"
- ❌ Избягвай неясна критика — „Не е достатъчно добро" не помага на никого

**Получаване на обратна връзка с достойнство:**
- Слушай първо, защитавай се по-късно (или въобще не)
- Търси модели — ако 3 души казват едно и също, вероятно са прави
- Не всяка обратна връзка трябва да се следва — ти решаваш какво е ценно
- Кажи „благодаря" — нужна е смелост да дадеш честна обратна връзка

**Рубрика за партньорски ревюта:**

| Критерий | Какво да оцениш |
|----------|----------------|
| **Яснота** | Лесна ли е за разбиране идеята? |
| **Важност на проблема** | Реален и значим ли е проблемът? |
| **Иновация** | Новаторско или креативно ли е решението? |
| **Осъществимост** | Може ли реално да бъде създадено и доставено? |
| **Пазарен потенциал** | Има ли реален пазар за това? |`,
      },
      {
        titleEn: 'Key Takeaways',
        titleBg: 'Ключови изводи',
        bodyEn: `✅ Investors care about **team, market, product, and traction** — in that order.

✅ Structure your pitch with the **7-slide framework** — keep it under 3 minutes.

✅ Give **specific, constructive feedback** — not vague criticism.

✅ Your pitch is a **story**, not a report. Make it compelling and human.

**Next step:** Submit your final startup pitch and get peer feedback →`,
        bodyBg: `✅ Инвеститорите се интересуват от **екип, пазар, продукт и тракция** — в този ред.

✅ Структурирай представянето си с **рамката от 7 слайда** — дръж го под 3 минути.

✅ Давай **конкретна, конструктивна обратна връзка** — не неясна критика.

✅ Представянето ти е **история**, не доклад. Направи го убедително и човешко.

**Следваща стъпка:** Подай финалното си стартъп представяне и получи партньорска обратна връзка →`,
      },
    ],
  },
];
