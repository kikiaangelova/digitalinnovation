/**
 * Default content generators for case study sections.
 * Used when a case step is missing Data/Exhibits content.
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

| Metric | Value |
| --- | --- |
| TAM (Total Market) | $XX B |
| SAM (Serviceable) | $XX B |
| SOM (Obtainable) | $XX M |
| CAGR (5yr) | XX% |
| Key Segments | 3-5 segments |

### Exhibit 1: Market Adoption Trends

| Year | Users | Revenue | Growth |
| --- | --- | --- | --- |
| 2021 | -- | -- | -- |
| 2022 | -- | -- | -- |
| 2023 | -- | -- | -- |
| 2024 | -- | -- | -- |

*Note: Research the specific data for this case.*`;
  }

  if (step === 2) {
    return `## Digital Disruption Data

### Exhibit 1: Technology Adoption

| Technology | Adoption | Impact |
| --- | --- | --- |
| AI / ML | -- | High |
| Cloud | -- | Medium |
| IoT | -- | Medium |
| Blockchain | -- | Low |

### Exhibit 2: Competitive Landscape

| Company | Market % | Strategy | Digital |
| --- | --- | --- | --- |
| Leader A | -- | -- | -- |
| Leader B | -- | -- | -- |
| Disruptor | -- | -- | -- |

*Assumptions: Data based on industry reports and public filings.*`;
  }

  if (step === 3) {
    return `## Strategic Problem Exhibits

### Exhibit 1: Key Performance Indicators

| KPI | Current | Target |
| --- | --- | --- |
| CAC (Customer Acq Cost) | $-- | $-- |
| LTV (Lifetime Value) | $-- | $-- |
| LTV:CAC Ratio | --:1 | 3:1 |
| Monthly Churn | --% | <5% |
| NPS Score | -- | >50 |

### Exhibit 2: Financial Projections

| Quarter | Revenue | Costs | Margin |
| --- | --- | --- | --- |
| Q1 | -- | -- | -- |
| Q2 | -- | -- | -- |
| Q3 | -- | -- | -- |
| Q4 | -- | -- | -- |

*Assumptions: Projections assume current growth trajectory.*`;
  }

  return `## Data & Evidence

Use the data and exhibits from previous sections to support your analysis.

**Key metrics to consider:**
- Market size and growth rate
- Unit economics (CAC, LTV)
- Competitive positioning
- Technology adoption curve`;
}

function generateBG(topic: string, step: number): string {
  if (step === 1) {
    return `## Индустриални данни: ${topic}

### Пазарен преглед

| Метрика | Стойност |
| --- | --- |
| TAM (Общ пазар) | $XX млрд |
| SAM (Обслужваем) | $XX млрд |
| SOM (Достижим) | $XX млн |
| CAGR (5 год.) | XX% |
| Ключови сегменти | 3-5 сегмента |

### Приложение 1: Тенденции на пазарно усвояване

| Година | Потреб. | Приходи | Растеж |
| --- | --- | --- | --- |
| 2021 | -- | -- | -- |
| 2022 | -- | -- | -- |
| 2023 | -- | -- | -- |
| 2024 | -- | -- | -- |

*Забележка: Проучете конкретните данни за този казус.*`;
  }

  if (step === 2) {
    return `## Данни за дигитална трансформация

### Приложение 1: Усвояване на технологии

| Технология | Усвояване | Въздействие |
| --- | --- | --- |
| AI / ML | -- | Високо |
| Облак | -- | Средно |
| IoT | -- | Средно |
| Блокчейн | -- | Ниско |

### Приложение 2: Конкурентна среда

| Компания | Пазар % | Стратегия | Дигитал. |
| --- | --- | --- | --- |
| Лидер A | -- | -- | -- |
| Лидер B | -- | -- | -- |
| Дисръптор | -- | -- | -- |

*Предположения: Данни на база индустриални доклади.*`;
  }

  if (step === 3) {
    return `## Стратегически приложения

### Приложение 1: Ключови показатели

| KPI | Текущ | Цел |
| --- | --- | --- |
| CAC (Цена за клиент) | $-- | $-- |
| LTV (Стойност на клиент) | $-- | $-- |
| LTV:CAC Съотношение | --:1 | 3:1 |
| Месечен отток | --% | <5% |
| NPS Оценка | -- | >50 |

### Приложение 2: Финансови прогнози

| Тримес. | Приходи | Разходи | Марж |
| --- | --- | --- | --- |
| Q1 | -- | -- | -- |
| Q2 | -- | -- | -- |
| Q3 | -- | -- | -- |
| Q4 | -- | -- | -- |

*Предположения: Прогнози при текуща траектория на растеж.*`;
  }

  return `## Данни и доказателства

Използвайте данните от предишните секции за вашия анализ.

**Ключови метрики:**
- Размер и растеж на пазара
- Единична икономика (CAC, LTV)
- Конкурентно позициониране
- Крива на усвояване на технологии`;
}
