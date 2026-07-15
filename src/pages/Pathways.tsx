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
import { Sparkles, ArrowRight } from 'lucide-react';

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
                  return (
                    <article
                      key={p.id}
                      className="rounded-2xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
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
      </footer>
    </main>
  );
}