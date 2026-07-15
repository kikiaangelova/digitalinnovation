import { useMemo } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useLang } from '@/context/LangContext';
import { isFeatureEnabled } from '@/lib/featureFlags';
import {
  PATHWAYS,
  TRACK_LABELS,
  LEVEL_LABELS,
  CURRICULUM_VERSION,
  pathwaysByTrack,
  type PathwayTrack,
} from '@/data/curriculum-2026';
import { subModulesByPathway, type SubModule } from '@/data/curriculum-2026-content';
import { ALL_TERMS_2026 } from '@/data/curriculum-2026-dictionary';
import { getTeacrScenario } from '@/data/curriculum-2026-teacr';
import DecisionConsequenceReflection from '@/components/learning/DecisionConsequenceReflection';
import { Sparkles, ArrowRight, BookOpen, Clock, Compass, Target } from 'lucide-react';
import { useState } from 'react';

/**
 * Curriculum 2026–27 index — pathway catalog.
 *
 * Gated by the `curriculum-v2026` feature flag. When the flag is off, we
 * redirect to /learn so nothing is exposed prematurely.
 *
 * Enable in preview: /pathways?ff-curriculum-v2026=1
 */
export default function Pathways() {
  const { lang } = useLang();
  const enabled = isFeatureEnabled('curriculum-v2026');
  const grouped = useMemo(() => pathwaysByTrack(), []);
  const subs = useMemo(() => subModulesByPathway(), []);
  const [openId, setOpenId] = useState<string | null>(null);

  if (!enabled) return <Navigate to="/learn" replace />;

  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);

  const trackOrder: PathwayTrack[] = ['core', 'business', 'marketing', 'data_ai', 'human'];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <header className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {t('Preview · Curriculum', 'Преглед · Учебна програма')} {CURRICULUM_VERSION}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          {t('Learning Pathways', 'Учебни пътища')}
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          {t(
            'A Core foundation every learner completes, plus 10 selectable pathways across Business, Marketing, Data & AI, and Human & Future tracks.',
            'Ядрена основа за всеки учащ, плюс 10 избираеми пътя в направленията Бизнес, Маркетинг, Данни и AI, и Хора и бъдеще.',
          )}
        </p>
      </header>

      <div className="space-y-10">
        {trackOrder.map(track => {
          const list = grouped[track];
          if (list.length === 0) return null;
          return (
            <section key={track}>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {t(TRACK_LABELS[track].en, TRACK_LABELS[track].bg)}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  · {list.length}
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map(p => {
                  const levels = new Set(p.references.map(r => r.level));
                  const pathwaySubs = subs[p.id] || [];
                  const isOpen = openId === p.id;
                  return (
                    <article
                      key={p.id}
                      className={`rounded-2xl border bg-card p-5 transition-all ${
                        isOpen
                          ? 'border-primary shadow-md sm:col-span-2 lg:col-span-3'
                          : 'border-border hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenId(pathwaySubs.length ? (isOpen ? null : p.id) : null)
                        }
                        className="w-full text-left"
                        aria-expanded={isOpen}
                        disabled={pathwaySubs.length === 0}
                      >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-base font-semibold text-foreground">
                          {t(p.titleEn, p.titleBg)}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t(p.descriptionEn, p.descriptionBg)}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full bg-accent px-2 py-1 text-muted-foreground">
                          {p.references.length}{' '}
                          {t('references', 'препратки')}
                        </span>
                        {pathwaySubs.length > 0 && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-700 dark:text-emerald-300">
                            {pathwaySubs.length}{' '}
                            {t('new sub-modules', 'нови под-модула')}
                          </span>
                        )}
                        {(['foundation', 'intermediate', 'advanced'] as const).map(lv =>
                          levels.has(lv) ? (
                            <span
                              key={lv}
                              className="rounded-full border border-primary/30 bg-primary/5 px-2 py-1 text-primary"
                            >
                              {t(LEVEL_LABELS[lv].en, LEVEL_LABELS[lv].bg)}
                            </span>
                          ) : null,
                        )}
                      </div>
                      </button>

                      {isOpen && pathwaySubs.length > 0 && (
                        <SubModulesList subs={pathwaySubs} lang={lang} />
                      )}
                      {isOpen && (
                        <StageScenarios
                          stageRefs={p.references.filter(r => r.kind === 'stage').map(r => r.ref)}
                          lang={lang}
                        />
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="mt-12 rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
        {t(
          'Preview only. Enrollment, teacher configuration, and per-pathway progress are shipping in later phases. Nothing here changes your XP, badges, or existing lessons.',
          'Само преглед. Записване, учителски настройки и напредък по път се появяват в следващите фази. Тук нищо не променя твоите XP, значки или съществуващи уроци.',
        )}{' '}
        <Link to="/learn" className="text-primary underline">
          {t('Back to Learn', 'Обратно към Учи')}
        </Link>
        <span className="ml-2">
          · {t('New dictionary terms staged:', 'Нови речникови термини:')}{' '}
          <strong>{ALL_TERMS_2026.length}</strong>
        </span>
      </footer>
    </main>
  );
}

/* ── Expandable sub-modules panel ─────────────────────────────────────── */

function SubModulesList({ subs, lang }: { subs: SubModule[]; lang: 'en' | 'bg' }) {
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);
  return (
    <div className="mt-5 border-t border-border pt-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <BookOpen className="h-4 w-4 text-primary" />
        {t('Sub-modules', 'Под-модули')}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {subs.map(m => (
          <div key={m.id} className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-sm font-semibold text-foreground">
                {t(m.titleEn, m.titleBg)}
              </h4>
              <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Clock className="h-3 w-3" />
                {m.estMinutes} {t('min', 'мин')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {t(m.summaryEn, m.summaryBg)}
            </p>
            <p className="text-xs text-foreground mb-2">
              <strong>{t('Framework:', 'Рамка:')}</strong>{' '}
              {t(m.frameworkEn, m.frameworkBg)}
            </p>
            <p className="text-xs italic text-muted-foreground">
              {t('Reflect:', 'Рефлектирай:')} {t(m.reflectionEn, m.reflectionBg)}
            </p>
            {m.relatedTerms.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {m.relatedTerms.map(term => (
                  <span
                    key={term}
                    className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {term}
                  </span>
                ))}
              </div>
            )}
            <TeacrLoopBlock targetId={m.id} lang={lang} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── TEACR loop (Decide → Consequence → Reflect → Improve) ────────────── */

function TeacrLoopBlock({ targetId, lang }: { targetId: string; lang: 'en' | 'bg' }) {
  const [open, setOpen] = useState(false);
  const scenario = getTeacrScenario(targetId);
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);
  if (!scenario) return null;
  return (
    <div className="mt-3 border-t border-dashed border-border pt-3">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline min-h-[32px]"
        aria-expanded={open}
      >
        <Target className="h-3.5 w-3.5" />
        {open
          ? t('Hide decision loop', 'Скрий цикъла на решение')
          : t('Try the decision loop', 'Опитай цикъла на решение')}
      </button>
      {open && (
        <div className="mt-3">
          <DecisionConsequenceReflection
            lang={lang}
            promptEn={scenario.promptEn}
            promptBg={scenario.promptBg}
            options={scenario.options}
          />
        </div>
      )}
    </div>
  );
}

/* ── Stage-level TEACR scenarios (Core pathways) ──────────────────────── */

function StageScenarios({ stageRefs, lang }: { stageRefs: string[]; lang: 'en' | 'bg' }) {
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);
  const stageScenarios = stageRefs
    .map(id => ({ id, scenario: getTeacrScenario(id) }))
    .filter((x): x is { id: string; scenario: NonNullable<ReturnType<typeof getTeacrScenario>> } => !!x.scenario);
  if (stageScenarios.length === 0) return null;
  return (
    <div className="mt-5 border-t border-border pt-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Compass className="h-4 w-4 text-primary" />
        {t('Stage decision loops', 'Циклите на решение по етапи')}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {stageScenarios.map(({ id, scenario }, i) => (
          <div key={id} className="rounded-xl border border-border bg-background p-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">
              {t(`Stage ${i + 1}`, `Етап ${i + 1}`)}
            </h4>
            <DecisionConsequenceReflection
              lang={lang}
              promptEn={scenario.promptEn}
              promptBg={scenario.promptBg}
              options={scenario.options}
            />
          </div>
        ))}
      </div>
    </div>
  );
}