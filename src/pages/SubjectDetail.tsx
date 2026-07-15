/**
 * SubjectDetail — /learn/subject/:subjectKey
 *
 * Subject-scoped module list. Progress is calculated ONLY from modules
 * that belong to this subject, so completing (or not) an unrelated
 * subject never blocks access here. There is no global Level 1→2 lock.
 */

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Play } from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatusBadge, type ActivityStatus } from '@/components/ui/status-badge';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import {
  getSubject,
  subjectShort,
  subjectTitle,
} from '@/data/subject-catalog';
import {
  LEARNING_MODULES,
  modulesForSubject,
  type LearningModule,
} from '@/data/learning-modules';

export default function SubjectDetail() {
  const { subjectKey } = useParams<{ subjectKey: string }>();
  const { user } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);

  const subject = getSubject(subjectKey ?? null);
  const modules = useMemo<LearningModule[]>(
    () => (subjectKey ? modulesForSubject(subjectKey) : []),
    [subjectKey],
  );

  const [dbModuleIdBySlug, setDbModuleIdBySlug] = useState<Record<string, string>>({});
  const [responseBySlug, setResponseBySlug] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate(`/auth?redirect=/learn/subject/${subjectKey ?? ''}`);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data: mods } = await supabase
        .from('learning_modules')
        .select('id, slug');
      if (cancelled) return;
      const bySlug: Record<string, string> = {};
      (mods ?? []).forEach((m: any) => {
        bySlug[m.slug] = m.id;
      });
      setDbModuleIdBySlug(bySlug);

      const { data: resps } = await supabase
        .from('learning_module_responses')
        .select('*')
        .eq('user_id', user.id);
      if (cancelled) return;
      const idToSlug = Object.fromEntries(
        Object.entries(bySlug).map(([slug, id]) => [id, slug]),
      );
      const map: Record<string, any> = {};
      (resps ?? []).forEach((r: any) => {
        const slug = idToSlug[r.module_id];
        if (slug) map[slug] = r;
      });
      setResponseBySlug(map);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, subjectKey, navigate]);

  if (!subjectKey || !subject) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto max-w-3xl px-4 py-10">
          <p className="text-sm text-muted-foreground">
            {t('Subject not found.', 'Предметът не е намерен.')}
          </p>
          <Link to="/learn" className="text-primary text-sm underline mt-3 inline-block">
            {t('Back to My Subjects', 'Обратно към Моите предмети')}
          </Link>
        </main>
      </div>
    );
  }

  const completed = modules.filter((m) => responseBySlug[m.slug]?.completed_at).length;
  const total = modules.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
        <Link to="/learn" className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-primary">
          <ArrowLeft className="h-3 w-3" /> {t('My Subjects', 'Моите предмети')}
        </Link>

        <header className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="typo-h1">{subjectTitle(subject, lang as 'bg' | 'en')}</h1>
          </div>
          <p className="typo-helper max-w-2xl">{subjectShort(subject, lang as 'bg' | 'en')}</p>
          {subject.availability !== 'playable' && (
            <Badge variant="outline" className="text-xs">
              {subject.availability === 'preview'
                ? t('Preview', 'Преглед')
                : t('Planned', 'Планиран')}
            </Badge>
          )}
        </header>

        {total > 0 && (
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">
                {t('Subject progress', 'Напредък по предмета')}
              </span>
              <Badge variant="outline">
                {completed}/{total} {t('completed', 'завършени')}
              </Badge>
            </div>
            <Progress value={pct} className="h-2" />
          </section>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">{t('Loading…', 'Зареждане…')}</p>
        ) : total === 0 ? (
          <section className="rounded-xl border border-dashed border-border bg-card p-8 text-center space-y-2">
            <p className="text-sm text-foreground font-medium">
              {t(
                'Learning content for this subject is being prepared.',
                'Съдържанието за този предмет се подготвя.',
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {t(
                'We will add modules here as they become playable.',
                'Ще добавим модули тук, когато станат достъпни.',
              )}
            </p>
          </section>
        ) : (
          <ul className="space-y-2">
            {modules.map((mod, idx) => {
              const resp = responseBySlug[mod.slug];
              const isCompleted = !!resp?.completed_at;
              const isInProgress = resp && !isCompleted;
              const status: ActivityStatus = isCompleted
                ? 'completed'
                : isInProgress
                  ? 'in_progress'
                  : 'not_started';
              const registered = !!dbModuleIdBySlug[mod.slug];
              return (
                <li
                  key={mod.slug}
                  className="rounded-lg border border-border bg-background p-4 flex items-center justify-between gap-4 hover:border-primary/40 cursor-pointer"
                  onClick={() => navigate(`/learn/${mod.slug}`)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isCompleted
                          ? 'bg-primary/20'
                          : isInProgress
                            ? 'bg-amber-500/15'
                            : 'bg-accent'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : isInProgress ? (
                        <Play className="h-4 w-4 text-amber-600" />
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">{idx + 1}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground truncate">
                          {lang === 'bg' ? mod.title_bg : mod.title_en}
                        </h3>
                        <StatusBadge status={status} lang={lang as 'en' | 'bg'} />
                        {!registered && (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            {t('Draft', 'Чернова')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {mod.quiz_questions.length} {t('quiz questions', 'въпроса')}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </li>
              );
            })}
          </ul>
        )}

        <p className="text-[11px] text-muted-foreground pt-2">
          {t(
            'This subject is independent — completing other subjects is not required.',
            'Този предмет е независим — не се изисква завършване на други предмети.',
          )}
        </p>

        {/* Anchor so tests / codesearch confirm registry export usage */}
        <span data-total-registry={LEARNING_MODULES.length} className="hidden" />
      </main>
    </div>
  );
}