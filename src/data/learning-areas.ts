/**
 * DigiInnov Learning Areas (V1)
 * -----------------------------
 * Canonical, learner-facing hierarchy that groups the flat
 * `subject-catalog` keys into 6 educational areas.
 *
 * Stable DB keys in `subject-catalog.ts` are unchanged — this file
 * only controls how learners see the subjects grouped in the UI.
 *
 *   Learning Area → Subject/Pathway → Main Topics → Modules → Tasks → Skills
 *
 * The Skills area is cross-cutting: it lists ability families
 * developed across every area, not a stack of subjects to consume.
 */

import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Megaphone,
  Rocket,
  Sparkles,
  Bot,
  Compass,
} from 'lucide-react';

export type LearningAreaId =
  | 'management'
  | 'marketing'
  | 'entrepreneurship'
  | 'innovation'
  | 'ai'
  | 'skills';

export interface LearningArea {
  id: LearningAreaId;
  icon: LucideIcon;
  title_en: string;
  title_bg: string;
  short_en: string;
  short_bg: string;
  /**
   * Ordered list of `subject-catalog` keys that belong to this area.
   * Primary/base subjects come first; deeper pathways after.
   * Cross-cutting areas (skills) may be empty and rely on `topics`.
   */
  subjectKeys: string[];
  /**
   * Learner-facing topics/lenses shown inside the area even when they
   * are not standalone subjects (e.g. Agile/Scrum inside Management,
   * or the Skills families). Purely informational.
   */
  topics: { en: string; bg: string }[];
}

export const LEARNING_AREAS: LearningArea[] = [
  {
    id: 'management',
    icon: Briefcase,
    title_en: 'Management',
    title_bg: 'Мениджмънт',
    short_en:
      'How work actually gets done — leading people, running projects and making decisions.',
    short_bg:
      'Как работата наистина се случва — водене на хора, управление на проекти и вземане на решения.',
    subjectKeys: [
      'management-fundamentals',
      'project-management',
      'agile',
      'scrum',
    ],
    topics: [
      { en: 'Leadership & delegation', bg: 'Лидерство и делегиране' },
      { en: 'Feedback & team communication', bg: 'Обратна връзка и комуникация в екип' },
      { en: 'Decision-making', bg: 'Вземане на решения' },
      { en: 'Agile & Scrum in practice', bg: 'Agile и Scrum на практика' },
      { en: 'Performance basics', bg: 'Основи на представянето' },
    ],
  },
  {
    id: 'marketing',
    icon: Megaphone,
    title_en: 'Marketing',
    title_bg: 'Маркетинг',
    short_en:
      'Understand customers, create value and reach them — offline and online.',
    short_bg:
      'Разбери клиентите, създай стойност и стигни до тях — офлайн и онлайн.',
    subjectKeys: [
      'marketing-foundations',
      'digital-marketing',
      'sales-customer-relationships',
    ],
    topics: [
      { en: 'Segmentation, targeting, positioning', bg: 'Сегментация, таргетиране, позициониране' },
      { en: 'Value proposition & offer', bg: 'Стойностно предложение и оферта' },
      { en: 'Brand & customer journey', bg: 'Бранд и клиентско пътуване' },
      { en: 'Content, SEO & AI search visibility', bg: 'Съдържание, SEO и видимост в AI търсене' },
      { en: 'Ethics in marketing', bg: 'Етика в маркетинга' },
    ],
  },
  {
    id: 'entrepreneurship',
    icon: Rocket,
    title_en: 'Entrepreneurship',
    title_bg: 'Предприемачество',
    short_en:
      'Mindsets, methods and strategic lenses for turning ideas into real ventures.',
    short_bg:
      'Начини на мислене, методи и стратегически лещи за превръщане на идеи в реален бизнес.',
    subjectKeys: [
      'entrepreneurship-startups',
      'lean-startup',
      'design-thinking',
      'blue-ocean-strategy',
      'black-swan-risk-uncertainty',
    ],
    topics: [
      { en: 'Customer discovery & experiments', bg: 'Откриване на клиенти и експерименти' },
      { en: 'MVP · pivot or persevere', bg: 'MVP · пивот или продължи' },
      { en: 'First customers & pitching', bg: 'Първи клиенти и питчинг' },
      { en: 'Risk & uncertainty (Black Swan)', bg: 'Риск и несигурност (Черен лебед)' },
      { en: 'Blue Ocean vs. red-ocean competition', bg: 'Син океан срещу кървава конкуренция' },
    ],
  },
  {
    id: 'innovation',
    icon: Sparkles,
    title_en: 'Innovation',
    title_bg: 'Иновации',
    short_en:
      'Digital products, platforms and business-model innovation — connected to but distinct from entrepreneurship.',
    short_bg:
      'Дигитални продукти, платформи и иновации в бизнес модела — свързани, но различни от предприемачеството.',
    subjectKeys: ['digital-innovation'],
    topics: [
      { en: 'Platforms & network effects', bg: 'Платформи и мрежови ефекти' },
      { en: 'Business-model innovation', bg: 'Иновации в бизнес модела' },
      { en: 'Product-market fit', bg: 'Съответствие продукт-пазар' },
      { en: 'Data-driven innovation', bg: 'Иновации, водени от данни' },
      { en: 'Technology & change', bg: 'Технологии и промяна' },
    ],
  },
  {
    id: 'ai',
    icon: Bot,
    title_en: 'AI Literacy & AI for Business',
    title_bg: 'AI грамотност и AI за бизнес',
    short_en:
      'Three layers: understand AI, use AI in business, practice AI responsibly.',
    short_bg:
      'Три пласта: разбери AI, използвай AI в бизнеса, работи с AI отговорно.',
    subjectKeys: ['ai-for-business'],
    topics: [
      { en: 'AI Literacy — LLMs, tokens, hallucinations, bias', bg: 'AI грамотност — LLM, токени, халюцинации, пристрастия' },
      { en: 'AI for Business — marketing, management, research, content', bg: 'AI за бизнес — маркетинг, мениджмънт, проучване, съдържание' },
      { en: 'AI Practice — prompting, verification, iteration', bg: 'AI на практика — промптинг, проверка, итерация' },
      { en: 'Responsible AI — privacy, copyright, human oversight', bg: 'Отговорен AI — поверителност, авторско право, човешки контрол' },
      { en: 'Disclosure of AI use', bg: 'Прозрачно ползване на AI' },
    ],
  },
  {
    id: 'skills',
    icon: Compass,
    title_en: 'Business Skills',
    title_bg: 'Бизнес умения',
    short_en:
      'Cross-cutting abilities developed across every area — evidenced through tasks, projects and reflection, not clicks.',
    short_bg:
      'Умения, които се развиват през всички области — доказват се със задачи, проекти и рефлексия, не с кликове.',
    subjectKeys: [],
    topics: [
      { en: 'Critical thinking & problem solving', bg: 'Критично мислене и решаване на проблеми' },
      { en: 'Creativity & entrepreneurial thinking', bg: 'Креативност и предприемаческо мислене' },
      { en: 'Decision-making', bg: 'Вземане на решения' },
      { en: 'Marketing & customer thinking', bg: 'Маркетинг и мислене за клиента' },
      { en: 'Sales & relationship skills', bg: 'Продажби и работа с хора' },
      { en: 'Financial literacy', bg: 'Финансова грамотност' },
      { en: 'Data literacy & research', bg: 'Работа с данни и проучване' },
      { en: 'AI literacy', bg: 'AI грамотност' },
      { en: 'Communication, presentation, negotiation', bg: 'Комуникация, презентация, преговори' },
      { en: 'Collaboration & leadership', bg: 'Сътрудничество и лидерство' },
      { en: 'Project management', bg: 'Управление на проекти' },
      { en: 'Adaptability & resilience', bg: 'Адаптивност и устойчивост' },
      { en: 'Systems thinking', bg: 'Системно мислене' },
      { en: 'Reflection & self-improvement', bg: 'Рефлексия и самоусъвършенстване' },
      { en: 'Responsible & ethical thinking', bg: 'Отговорно и етично мислене' },
    ],
  },
];

/** Reverse lookup: subject key → its learning area (or null if unmapped). */
export const AREA_BY_SUBJECT_KEY: Record<string, LearningAreaId> =
  LEARNING_AREAS.reduce<Record<string, LearningAreaId>>((acc, area) => {
    for (const key of area.subjectKeys) acc[key] = area.id;
    return acc;
  }, {});

export function areaOfSubject(subjectKey: string | null | undefined): LearningAreaId | null {
  if (!subjectKey) return null;
  return AREA_BY_SUBJECT_KEY[subjectKey] ?? null;
}

export function areaTitle(area: LearningArea, lang: 'bg' | 'en'): string {
  return lang === 'bg' ? area.title_bg : area.title_en;
}

export function areaShort(area: LearningArea, lang: 'bg' | 'en'): string {
  return lang === 'bg' ? area.short_bg : area.short_en;
}