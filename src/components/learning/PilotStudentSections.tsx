/**
 * Student-safe rendering for the optional pilot content model.
 *
 * Everything in this file is safe to show a learner. Teacher-only
 * material (`teacher_pack`) is deliberately not imported here, so it
 * cannot leak into a student phase by accident.
 *
 * Modules without the optional pilot fields render nothing — each block
 * guards on its own data.
 */

import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle, BookMarked, ExternalLink, ListChecks, Scale,
  ShieldQuestion, Target, Users,
} from 'lucide-react';
import type {
  Bilingual, CasePack, EntryTask, LearningOutcome, Misconception, SourceRef,
} from '@/data/module-pilot-types';
import type { ContentQualityStatus } from '@/data/module-pilot-types';

type Lang = 'en' | 'bg';

const pick = (lang: Lang, en: string, bg: string) => (lang === 'bg' ? bg : en);
const bi = (lang: Lang, v: Bilingual) => (lang === 'bg' ? v.bg : v.en);

const BLOOM_BG: Record<string, string> = {
  Remember: 'Запомняне',
  Understand: 'Разбиране',
  Apply: 'Прилагане',
  Analyze: 'Анализ',
  Evaluate: 'Оценяване',
  Create: 'Създаване',
};

const QUALITY_LABEL: Record<ContentQualityStatus, Bilingual> = {
  draft: { en: 'Draft', bg: 'Чернова' },
  needs_review: { en: 'Needs review', bg: 'За преглед' },
  educator_reviewed: { en: 'Educator reviewed', bg: 'Прегледано от преподавател' },
  pilot_ready: { en: 'Pilot ready', bg: 'Готово за пилот' },
  published: { en: 'Published', bg: 'Публикувано' },
};

function SectionCard({
  icon, title, children,
}: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 space-y-3">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}

/* ---------------- quality status ---------------- */

export function QualityStatusBadge({
  status, lang,
}: { status: ContentQualityStatus; lang: Lang }) {
  return (
    <Badge variant="outline" data-testid="quality-status" className="text-[11px]">
      {bi(lang, QUALITY_LABEL[status])}
    </Badge>
  );
}

/* ---------------- outcomes ---------------- */

export function LearningOutcomesBlock({
  outcomes, lang,
}: { outcomes?: LearningOutcome[]; lang: Lang }) {
  if (!outcomes?.length) return null;
  return (
    <SectionCard
      icon={<Target className="h-4 w-4 text-primary" />}
      title={pick(lang, 'What you should be able to do', 'Какво трябва да можеш')}
    >
      <ul className="space-y-2" data-testid="pilot-outcomes">
        {outcomes.map((o) => (
          <li key={o.id} className="text-sm text-foreground/85 flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
            <Badge variant="secondary" className="shrink-0 text-[10px] w-fit">
              {lang === 'bg' ? (BLOOM_BG[o.bloom] ?? o.bloom) : o.bloom}
            </Badge>
            <span>{lang === 'bg' ? o.bg : o.en}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

/* ---------------- boundaries ---------------- */

export function ModelBoundariesBlock({
  boundaries, lang,
}: { boundaries?: Bilingual[]; lang: Lang }) {
  if (!boundaries?.length) return null;
  return (
    <SectionCard
      icon={<Scale className="h-4 w-4 text-primary" />}
      title={pick(lang, 'Where the model stops working', 'Докъде работи моделът')}
    >
      <ul className="space-y-2" data-testid="pilot-boundaries">
        {boundaries.map((b, i) => (
          <li key={i} className="text-sm text-foreground/85 flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>{bi(lang, b)}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

/* ---------------- misconceptions ---------------- */

export function MisconceptionsBlock({
  misconceptions, lang,
}: { misconceptions?: Misconception[]; lang: Lang }) {
  if (!misconceptions?.length) return null;
  return (
    <SectionCard
      icon={<AlertTriangle className="h-4 w-4 text-warning" />}
      title={pick(lang, 'Common mistakes — and the accurate version', 'Често срещани грешки — и точната версия')}
    >
      <div className="space-y-3" data-testid="pilot-misconceptions">
        {misconceptions.map((m) => (
          <div key={m.id} className="rounded-lg border border-border/70 bg-background/60 p-3 space-y-1">
            <p className="text-sm font-medium text-destructive">
              {pick(lang, 'Wrong:', 'Грешно:')} {lang === 'bg' ? m.wrong_bg : m.wrong_en}
            </p>
            <p className="text-sm text-foreground/85">
              {pick(lang, 'Accurate:', 'Точно:')} {lang === 'bg' ? m.correct_bg : m.correct_en}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ---------------- entry task ---------------- */

export function EntryTaskBlock({
  task, lang,
}: { task?: EntryTask; lang: Lang }) {
  if (!task) return null;
  return (
    <SectionCard
      icon={<ListChecks className="h-4 w-4 text-primary" />}
      title={pick(lang, 'Entry check — before the theory', 'Входна проверка — преди теорията')}
    >
      <div className="space-y-3" data-testid="pilot-entry-task">
        <p className="text-sm text-foreground/85">
          {lang === 'bg' ? task.prompt_bg : task.prompt_en}
        </p>
        <div className="flex flex-wrap gap-2">
          {task.categories.map((c, i) => (
            <Badge key={i} variant="outline" className="text-[11px]">{bi(lang, c)}</Badge>
          ))}
        </div>
        <ol className="space-y-2 list-decimal pl-5">
          {task.scenarios.map((s) => (
            <li key={s.id} className="text-sm text-foreground/85">
              {lang === 'bg' ? s.bg : s.en}
            </li>
          ))}
        </ol>
        <p className="text-sm italic text-muted-foreground">
          {lang === 'bg' ? task.followup_bg : task.followup_en}
        </p>
      </div>
    </SectionCard>
  );
}

/* ---------------- source pack ---------------- */

export function SourcePackBlock({
  sources, lang,
}: { sources?: SourceRef[]; lang: Lang }) {
  if (!sources?.length) return null;
  return (
    <SectionCard
      icon={<BookMarked className="h-4 w-4 text-primary" />}
      title={pick(lang, 'Sources you can check yourself', 'Източници, които можеш да провериш сам')}
    >
      <ul className="space-y-3" data-testid="pilot-sources">
        {sources.map((s) => (
          <li key={s.id} className="text-sm space-y-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <Badge variant="secondary" className="text-[10px]">{s.id}</Badge>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={pick(
                  lang,
                  `Open source ${s.id}: ${s.title} (${s.publisher}) in a new tab`,
                  `Отвори източник ${s.id}: ${s.title} (${s.publisher}) в нов таб`,
                )}
                className="font-medium text-primary underline underline-offset-2 inline-flex items-center gap-1"
              >
                {s.title}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">{s.publisher} · {s.date}</p>
            <p className="text-xs text-foreground/75">
              {lang === 'bg' ? s.use_note_bg : s.use_note_en}
            </p>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

/* ---------------- case pack ---------------- */

function ExhibitTable({
  columns, rows, lang,
}: {
  columns: string[];
  rows: { cells_en: string[]; cells_bg: string[] }[];
  lang: Lang;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} scope="col" className="border border-border bg-muted/50 p-2 text-left font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {(lang === 'bg' ? r.cells_bg : r.cells_en).map((cell, ci) => (
                <td key={ci} className="border border-border p-2 align-top text-foreground/85">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CasePackBlock({
  pack, lang,
}: { pack?: CasePack; lang: Lang }) {
  if (!pack) return null;
  return (
    <div className="space-y-4" data-testid="pilot-case-pack">
      <SectionCard
        icon={<ShieldQuestion className="h-4 w-4 text-primary" />}
        title={pick(lang, 'Verified facts (with sources)', 'Проверени факти (с източници)')}
      >
        <ul className="space-y-2" data-testid="case-verified-facts">
          {pack.verified_facts.map((f, i) => (
            <li key={i} className="text-sm text-foreground/85 flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span><span>{bi(lang, f)}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        icon={<Scale className="h-4 w-4 text-primary" />}
        title={pick(lang, 'Interpretations — argued, not proven', 'Интерпретации — аргументирани, не доказани')}
      >
        <ul className="space-y-2" data-testid="case-interpretations">
          {pack.interpretations.map((f, i) => (
            <li key={i} className="text-sm text-foreground/85">{bi(lang, f)}</li>
          ))}
        </ul>
      </SectionCard>

      <section className="rounded-xl border-2 border-warning/40 bg-warning/5 p-5 space-y-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          {pick(lang, 'Case assumptions — challenge these', 'Допускания в казуса — оспори ги')}
        </h3>
        <ul className="space-y-2" data-testid="case-assumptions">
          {pack.case_assumptions.map((f, i) => (
            <li key={i} className="text-sm text-foreground/85">{bi(lang, f)}</li>
          ))}
        </ul>
      </section>

      <SectionCard
        icon={<Users className="h-4 w-4 text-primary" />}
        title={pick(lang, 'Who is affected', 'Кой е засегнат')}
      >
        <ul className="grid gap-2 sm:grid-cols-2" data-testid="case-stakeholders">
          {pack.stakeholders.map((s, i) => (
            <li key={i} className="text-sm text-foreground/85 rounded-lg bg-accent/40 p-2">{bi(lang, s)}</li>
          ))}
        </ul>
      </SectionCard>

      <section className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 space-y-3">
        <h3 className="text-sm font-bold text-foreground">
          {pick(lang, 'The dilemma', 'Дилемата')}
        </h3>
        <p className="text-sm text-foreground/85" data-testid="case-dilemma">
          {lang === 'bg' ? pack.dilemma_bg : pack.dilemma_en}
        </p>
        <div className="grid gap-3 sm:grid-cols-2" data-testid="case-options">
          {pack.decision_options.map((o) => (
            <div key={o.id} className="rounded-lg border border-border bg-card p-3 space-y-2">
              <p className="text-sm font-semibold text-foreground">
                {lang === 'bg' ? o.label_bg : o.label_en}
              </p>
              <p className="text-xs text-foreground/80">
                {lang === 'bg' ? o.description_bg : o.description_en}
              </p>
              <ul className="space-y-1">
                {o.tradeoffs.map((tr, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="mt-0.5">↔</span><span>{bi(lang, tr)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-4" data-testid="case-exhibits">
        {pack.exhibits.map((ex) => (
          <SectionCard
            key={ex.id}
            icon={<BookMarked className="h-4 w-4 text-primary" />}
            title={lang === 'bg' ? ex.title_bg : ex.title_en}
          >
            {ex.lines?.length ? (
              <ul className="space-y-2">
                {ex.lines.map((l, i) => (
                  <li key={i} className="text-sm text-foreground/85 flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span><span>{bi(lang, l)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {ex.rows?.length && (ex.columns_en || ex.columns_bg) ? (
              <ExhibitTable
                columns={(lang === 'bg' ? ex.columns_bg : ex.columns_en) ?? []}
                rows={ex.rows}
                lang={lang}
              />
            ) : null}
            {(ex.caveat_en || ex.caveat_bg) && (
              <p className="text-xs italic text-warning">
                {lang === 'bg' ? ex.caveat_bg : ex.caveat_en}
              </p>
            )}
            {ex.source_ids?.length ? (
              <p className="text-xs text-muted-foreground">
                {pick(lang, 'Sources:', 'Източници:')} {ex.source_ids.join(', ')}
              </p>
            ) : null}
          </SectionCard>
        ))}
      </div>

      <SectionCard
        icon={<ListChecks className="h-4 w-4 text-primary" />}
        title={lang === 'bg' ? pack.deliverable.title_bg : pack.deliverable.title_en}
      >
        <div className="space-y-3" data-testid="case-deliverable">
          <p className="text-sm text-foreground/85">
            {lang === 'bg' ? pack.deliverable.brief_bg : pack.deliverable.brief_en}
          </p>
          <ul className="space-y-1.5">
            {pack.deliverable.requirements.map((r, i) => (
              <li key={i} className="text-sm text-foreground/85 flex items-start gap-2">
                <span className="text-primary mt-0.5">□</span><span>{bi(lang, r)}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            {pick(lang, 'Length:', 'Обем:')} {pack.deliverable.min_words}–{pack.deliverable.max_words}{' '}
            {pick(lang, 'words', 'думи')}
          </p>
        </div>
      </SectionCard>

      <section className="rounded-xl bg-accent/40 p-5 space-y-1">
        <p className="text-sm font-bold text-foreground">
          {pick(lang, 'Reflection', 'Рефлексия')}
        </p>
        <p className="text-sm text-foreground/85" data-testid="case-reflection">
          {lang === 'bg' ? pack.reflection_bg : pack.reflection_en}
        </p>
      </section>
    </div>
  );
}
