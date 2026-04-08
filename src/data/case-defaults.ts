/**
 * Default content generators for case study sections.
 * Designed to include uncertainty, incomplete data, and conflicting signals
 * to teach decision-making under real-world conditions.
 */

export function generateDefaultExhibitContent(
  caseTopic: string | null,
  stepIndex: number,
  lang: 'en' | 'bg'
): string {
  const topic = caseTopic || (lang === 'bg' ? 'Дигитална иновация' : 'Digital Innovation');

  if (lang === 'bg') {
    return generateBG(topic, stepIndex);
  }
  return generateEN(topic, stepIndex);
}

function generateEN(topic: string, step: number): string {
  if (step === 1) {
    return `## Industry Data: ${topic}

### Market Overview

| Metric | Value | Confidence |
| --- | --- | --- |
| TAM (Total Market) | $XX B | ⚠️ Estimated |
| SAM (Serviceable) | $XX B | ⚠️ Estimated |
| SOM (Obtainable) | $XX M | ❓ Unknown |
| CAGR (5yr) | XX% | ✅ Verified |
| Key Segments | 3-5 segments | ✅ Verified |

### Exhibit 1: Market Adoption Trends

| Year | Users | Revenue | Growth |
| --- | --- | --- | --- |
| 2021 | -- | -- | -- |
| 2022 | ~XX K | ~$XX M | ~XX% |
| 2023 | ~XX K | ~$XX M | ❓ Data gap |
| 2024 | ❓ Forecast only | ❓ Forecast only | ❓ Uncertain |

> ⚠️ **Note:** Some data points are estimates from industry reports. Different sources report conflicting numbers for 2023-2024. You must decide which trends to trust and state your assumptions.

### Conflicting Market Signals

- **Source A (Industry Report):** Market growing at 25% annually
- **Source B (Analyst Forecast):** Growth slowing to 12% due to saturation
- **Source C (Startup Data):** New entrants seeing 40%+ growth in niche segments

*Which signal do you trust? Why? There is no single correct answer.*`;
  }

  if (step === 2) {
    return `## Digital Disruption Data

### Exhibit 1: Technology Adoption

| Technology | Adoption Rate | Impact | Data Quality |
| --- | --- | --- | --- |
| AI / ML | ~35% | High | ⚠️ Self-reported |
| Cloud | ~70% | Medium | ✅ Verified |
| IoT | ~20% | ❓ Unclear | ⚠️ Limited sample |
| Blockchain | ~5% | ❓ Debated | ⚠️ Conflicting reports |

### Exhibit 2: Competitive Landscape (Partial View)

| Company | Market % | Strategy | Digital Maturity |
| --- | --- | --- | --- |
| Leader A | ~30% | ❓ Unknown | High |
| Leader B | ~20% | Expansion | Medium |
| Disruptor | ❓ Unknown | ❓ Stealth mode | ❓ Unknown |
| *Others* | ~50% | *Fragmented* | *Varies* |

> ⚠️ **Limited Intelligence:** Competitor strategies are based on public filings and news reports. A major disruptor may be operating in stealth mode — you have no data about their plans.

### Conflicting Technology Assessments

- **Optimists:** AI will transform this industry within 2 years
- **Skeptics:** Current AI adoption is inflated by pilot projects that never scale
- **Pragmatists:** Impact depends heavily on regulatory environment (which is also uncertain)

*Your task: Make a strategic recommendation despite these uncertainties.*`;
  }

  if (step === 3) {
    return `## Strategic Problem Exhibits

### Exhibit 1: Key Performance Indicators

| KPI | Current | Target | Trend |
| --- | --- | --- | --- |
| CAC (Customer Acq Cost) | $-- | $-- | ❓ Increasing or stable? |
| LTV (Lifetime Value) | $-- | $-- | ⚠️ Early data, may change |
| LTV:CAC Ratio | --:1 | 3:1 | ⚠️ Below target |
| Monthly Churn | --% | <5% | ❓ Limited tracking history |
| NPS Score | -- | >50 | ⚠️ Small sample size |

### Exhibit 2: Financial Projections (3 Scenarios)

| Scenario | Q1 Rev | Q4 Rev | Assumptions |
| --- | --- | --- | --- |
| 🟢 Optimistic | $XX K | $XX K | Market grows 25%, no new competitors |
| 🟡 Base Case | $XX K | $XX K | Market grows 15%, 1 new competitor |
| 🔴 Pessimistic | $XX K | $XX K | Market flat, regulation tightens |

> ⚠️ **Key Uncertainty:** You don't know which scenario will materialize. Each choice you make performs differently across scenarios.

### What You Don't Know

- Will the regulation change pass? (50/50 probability, per expert estimates)
- Is Competitor X planning market entry? (Rumored but unconfirmed)
- Will your target customers adopt new technology? (Early signals mixed)

*Real executives make decisions with exactly this level of uncertainty. Choose wisely and explain your reasoning.*`;
  }

  return `## Data & Evidence

Use the data and exhibits from previous sections to support your analysis.

> ⚠️ **Remember:** The data you've seen is incomplete. Some numbers are estimates, some sources conflict, and important information may be missing entirely. This is normal in real business strategy.

**When building your analysis, consider:**
- What assumptions are you making? Are they reasonable?
- What risks does your recommendation carry?
- How would your answer change if the uncertain data points went the other way?
- What additional information would you want before deciding?

**Key metrics to reference:**
- Market size and growth rate (with uncertainty ranges)
- Unit economics (CAC, LTV) — early-stage estimates
- Competitive positioning (based on incomplete intelligence)
- Technology adoption curve (conflicting expert opinions)

*There is no "perfect answer." Your grade depends on the quality of your reasoning, not finding the one right solution.*`;
}

function generateBG(topic: string, step: number): string {
  if (step === 1) {
    return `## Индустриални данни: ${topic}

### Пазарен преглед

| Метрика | Стойност | Надеждност |
| --- | --- | --- |
| TAM (Общ пазар) | $XX млрд | ⚠️ Приблизително |
| SAM (Обслужваем) | $XX млрд | ⚠️ Приблизително |
| SOM (Достижим) | $XX млн | ❓ Неизвестно |
| CAGR (5 год.) | XX% | ✅ Потвърдено |
| Ключови сегменти | 3-5 сегмента | ✅ Потвърдено |

### Приложение 1: Тенденции на пазарно усвояване

| Година | Потреб. | Приходи | Растеж |
| --- | --- | --- | --- |
| 2021 | -- | -- | -- |
| 2022 | ~XX K | ~$XX M | ~XX% |
| 2023 | ~XX K | ~$XX M | ❓ Липса на данни |
| 2024 | ❓ Само прогноза | ❓ Само прогноза | ❓ Несигурно |

> ⚠️ **Бележка:** Някои данни са приблизителни. Различни източници дават противоречиви числа за 2023-2024. Вие решавате на кои тенденции да се доверите и трябва да посочите допусканията си.

### Противоречиви пазарни сигнали

- **Източник A (Индустриален доклад):** Пазарът расте с 25% годишно
- **Източник B (Анализатор):** Растежът се забавя до 12% поради насищане
- **Източник C (Стартъп данни):** Нови участници виждат 40%+ растеж в нишови сегменти

*На кой сигнал се доверявате? Защо? Няма единствен правилен отговор.*`;
  }

  if (step === 2) {
    return `## Данни за дигитална трансформация

### Приложение 1: Усвояване на технологии

| Технология | Усвояване | Въздействие | Качество на данните |
| --- | --- | --- | --- |
| AI / ML | ~35% | Високо | ⚠️ Самооценка |
| Облак | ~70% | Средно | ✅ Потвърдено |
| IoT | ~20% | ❓ Неясно | ⚠️ Малка извадка |
| Блокчейн | ~5% | ❓ Спорно | ⚠️ Противоречиви доклади |

### Приложение 2: Конкурентна среда (Частичен изглед)

| Компания | Пазар % | Стратегия | Дигит. зрялост |
| --- | --- | --- | --- |
| Лидер A | ~30% | ❓ Неизвестна | Висока |
| Лидер B | ~20% | Разширяване | Средна |
| Дисръптор | ❓ Неизвестно | ❓ Скрит режим | ❓ Неизвестно |
| *Други* | ~50% | *Фрагментирани* | *Различно* |

> ⚠️ **Ограничена информация:** Стратегиите на конкурентите са базирани на публични отчети и новини. Голям дисръптор може да работи в скрит режим — нямате данни за плановете им.

### Противоречиви технологични оценки

- **Оптимисти:** AI ще трансформира индустрията в рамките на 2 години
- **Скептици:** Настоящото AI усвояване е раздуто от пилотни проекти, които никога не скалират
- **Прагматици:** Въздействието зависи силно от регулаторната среда (която също е несигурна)

*Твоята задача: Направи стратегическа препоръка въпреки тези несигурности.*`;
  }

  if (step === 3) {
    return `## Стратегически приложения

### Приложение 1: Ключови показатели

| KPI | Текущ | Цел | Тенденция |
| --- | --- | --- | --- |
| CAC (Цена за клиент) | $-- | $-- | ❓ Расте или стабилен? |
| LTV (Стойност на клиент) | $-- | $-- | ⚠️ Ранни данни, може да се промени |
| LTV:CAC Съотношение | --:1 | 3:1 | ⚠️ Под целта |
| Месечен отток | --% | <5% | ❓ Ограничена история |
| NPS Оценка | -- | >50 | ⚠️ Малка извадка |

### Приложение 2: Финансови прогнози (3 сценария)

| Сценарий | Q1 Прих. | Q4 Прих. | Допускания |
| --- | --- | --- | --- |
| 🟢 Оптимистичен | $XX K | $XX K | Пазарът расте 25%, без нови конкуренти |
| 🟡 Базов | $XX K | $XX K | Пазарът расте 15%, 1 нов конкурент |
| 🔴 Песимистичен | $XX K | $XX K | Пазарът е плосък, регулацията се затяга |

> ⚠️ **Ключова несигурност:** Не знаете кой сценарий ще се реализира. Всеки ваш избор се представя различно при различните сценарии.

### Какво не знаете

- Ще бъде ли приета промяната в регулацията? (50/50 вероятност, по експертни оценки)
- Планира ли Конкурент X навлизане на пазара? (Слухове, но непотвърдени)
- Ще приемат ли целевите клиенти новата технология? (Ранните сигнали са смесени)

*Реалните мениджъри вземат решения с точно такова ниво на несигурност. Избери мъдро и обясни аргументацията си.*`;
  }

  return `## Данни и доказателства

Използвай данните от предишните секции за твоя анализ.

> ⚠️ **Помнете:** Данните, които видяхте, са непълни. Някои числа са приблизителни, някои източници си противоречат и важна информация може да липсва изцяло. Това е нормално в реалната бизнес стратегия.

**При изграждане на анализа, помислете:**
- Какви допускания правите? Разумни ли са?
- Какви рискове крие препоръката ви?
- Как би се променил отговорът ви, ако несигурните данни се окажат в другата посока?
- Каква допълнителна информация бихте искали преди да решите?

**Ключови метрики:**
- Размер и растеж на пазара (с диапазони на несигурност)
- Единична икономика (CAC, LTV) — ранни оценки
- Конкурентно позициониране (базирано на непълни данни)
- Крива на усвояване на технологии (противоречиви експертни мнения)

*Няма "перфектен отговор." Оценката ви зависи от качеството на аргументацията, а не от намирането на единственото правилно решение.*`;
}
