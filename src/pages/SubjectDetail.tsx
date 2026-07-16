/**
 * SubjectDetail — /learn/subject/:subjectKey
 *
 * Subject-scoped module list. Progress is calculated ONLY from modules
 * that belong to this subject. Teacher-assigned modules for this
 * subject are surfaced first; assignments from other subjects are
 * shown as a small cross-subject note.
 */

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Info,
  Play,
  School,
} from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge, type ActivityStatus } from '@/components/ui/status-badge';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import {
  getSubject,
  subjectLabel,
  subjectShort,
  subjectTitle,
} from '@/data/subject-catalog';
import { LEARNING_MODULES } from '@/data/learning-modules';
import { useModuleCatalog, type CatalogModule } from '@/hooks/useModuleCatalog';
import { useMySubjects } from '@/hooks/useMySubjects';
import { areaOfSubject } from '@/data/learning-areas';
import { LEARNING_THEMES, type LearningTheme } from '@/data/content-structure';

export default function SubjectDetail() {
  const { subjectKey } = useParams<{ subjectKey: string }>();
  const { user } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);

  const subject = getSubject(subjectKey ?? null);
  const { forSubject, loading: catalogLoading } = useModuleCatalog();
  const modules = useMemo<CatalogModule[]>(
    () => (subjectKey ? forSubject(subjectKey) : []),
    [subjectKey, forSubject],
  );

  const { entries: mySubjects } = useMySubjects();
  const myEntry = subjectKey
    ? mySubjects.find((e) => e.subjectKey === subjectKey)
    : undefined;
  const { bySlug: catalogBySlug } = useModuleCatalog();

  // Resolve each module assignment's TRUE subject via the shared catalog
  // (the classroom's current subject may differ from the module's own subject
  // after a teacher changes the classroom subject).
  const allModuleAssignments = mySubjects.flatMap((e) => e.assignments);
  const assignmentTrueSubject = (slug: string | null, fallback: string) => {
    if (!slug) return fallback;
    return catalogBySlug.get(slug)?.subject_key || fallback;
  };
  const assignedModulesForSubject = subjectKey
    ? allModuleAssignments.filter(
        (a) =>
          a.assignment_type === 'learn_module' &&
          a.module_slug &&
          assignmentTrueSubject(a.module_slug, a.subject_key) === subjectKey,
      )
    : [];
  const otherSubjectAssignments = subjectKey
    ? allModuleAssignments.filter(
        (a) =>
          a.assignment_type === 'learn_module' &&
          a.module_slug &&
          assignmentTrueSubject(a.module_slug, a.subject_key) !== subjectKey,
      )
    : [];

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
      const idToSlug: Record<string, string> = {};
      (mods ?? []).forEach((m: any) => {
        idToSlug[m.id] = m.slug;
      });

      const { data: resps } = await supabase
        .from('learning_module_responses')
        .select('*')
        .eq('user_id', user.id);
      if (cancelled) return;
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

  const assignedModules = assignedModulesForSubject;
  const assignedSlugs = new Set(assignedModules.map((a) => a.module_slug!));
  const additionalModules = modules.filter((m) => !assignedSlugs.has(m.slug));

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
                ? t('Preview', 'В процес на подготовка')
                : t('Planned', 'Планирано')}
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

        {loading || catalogLoading ? (
          <p className="text-sm text-muted-foreground">{t('Loading…', 'Зареждане…')}</p>
        ) : total === 0 ? (
          subjectKey === 'entrepreneurship-startups' ? (
            <EntrepreneurshipDraftCard lang={lang as 'bg' | 'en'} t={t} />
          ) : subjectKey === 'digital-innovation' ? (
            <InnovationDraftCard lang={lang as 'bg' | 'en'} t={t} />
          ) : (
            <SubjectProcessPreview
              subjectKey={subjectKey!}
              availability={subject.availability}
              lang={lang as 'bg' | 'en'}
              t={t}
            />
          )
        ) : (
          <>
            {assignedModules.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  {t('Assigned by your teacher', 'Назначено от учителя')}
                </h2>
                <ul className="space-y-2">
                  {assignedModules.map((a) => {
                    const mod = modules.find((m) => m.slug === a.module_slug);
                    if (!mod) return null;
                    return (
                      <ModuleRow
                        key={`assigned-${a.id}`}
                        mod={mod}
                        response={responseBySlug[mod.slug]}
                        lang={lang as 'bg' | 'en'}
                        t={t}
                        onOpen={
                          mod.hasRichContent
                            ? () => navigate(`/learn/${mod.slug}`)
                            : undefined
                        }
                        assignmentMeta={{
                          classroomName: a.classroom_name,
                          dueDate: a.due_date,
                          note: a.note,
                        }}
                      />
                    );
                  })}
                </ul>
              </section>
            )}

            <section className="space-y-2">
              {assignedModules.length > 0 && additionalModules.length > 0 && (
                <h2 className="text-sm font-semibold text-foreground">
                  {t('More modules in this subject', 'Още модули по предмета')}
                </h2>
              )}
              <ul className="space-y-2">
                {additionalModules.map((mod, idx) => (
                  <ModuleRow
                    key={mod.slug}
                    mod={mod}
                    index={idx + 1}
                    response={responseBySlug[mod.slug]}
                    lang={lang as 'bg' | 'en'}
                    t={t}
                    onOpen={
                      mod.hasRichContent
                        ? () => navigate(`/learn/${mod.slug}`)
                        : undefined
                    }
                  />
                ))}
              </ul>
            </section>

            {otherSubjectAssignments.length > 0 && (
              <section className="rounded-xl border border-dashed border-border bg-muted/30 p-4 space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {t('Assignments from another subject', 'Задачи от друг предмет')}
                </h3>
                <ul className="space-y-1">
                  {otherSubjectAssignments.map((a) => {
                    const trueKey = assignmentTrueSubject(a.module_slug, a.subject_key);
                    const cat = a.module_slug ? catalogBySlug.get(a.module_slug) : null;
                    const title = cat
                      ? (lang === 'bg' ? cat.title_bg : cat.title_en)
                      : a.module_slug;
                    return (
                      <li key={a.id} className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                        <School className="h-3 w-3 shrink-0" />
                        <span className="truncate font-medium text-foreground">{title}</span>
                        <span className="opacity-70">· {a.classroom_name}</span>
                        {a.due_date && (
                          <span className="opacity-70">
                            · {new Date(a.due_date).toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-GB')}
                          </span>
                        )}
                        <Badge variant="outline" className="text-[10px]">
                          {subjectLabel(trueKey, lang as 'bg' | 'en')}
                        </Badge>
                        {a.note && (
                          <span className="italic opacity-70 w-full truncate">“{a.note}”</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </>
        )}

        <p className="text-[11px] text-muted-foreground pt-2">
          {t(
            'This subject is independent — completing other subjects is not required.',
            'Този предмет е независим — не се изисква завършване на други предмети.',
          )}
        </p>

        <span data-total-registry={LEARNING_MODULES.length} className="hidden" />
      </main>
    </div>
  );
}

function EntrepreneurshipDraftCard({
  lang,
  t,
}: {
  lang: 'bg' | 'en';
  t: (en: string, bg: string) => string;
}) {
  const title = lang === 'bg'
    ? 'Практически модули по предприемачество'
    : 'Practice-first entrepreneurship modules';
  const body = lang === 'bg'
    ? 'Шест чернови модула са подготвени за преглед: предприемаческо мислене, откриване на проблеми, факт/мнение/допускане, бизнес модел, MVP, експерименти и pitch.'
    : 'Six draft modules are ready for review: entrepreneurial thinking, problem discovery, fact/opinion/assumption, business model, MVP, experiments and pitch.';
  const status = lang === 'bg'
    ? 'Статус: чернова / за преглед'
    : 'Status: draft / for review';
  const cta = lang === 'bg'
    ? 'Отвори практическите модули'
    : 'Open practice-first modules';

  return (
    <section className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-start gap-2 flex-wrap">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <Badge variant="outline" className="text-[10px]">
          {t('Draft / For review', 'Чернова / За преглед')}
        </Badge>
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed">{body}</p>
      <p className="text-[11px] text-muted-foreground">{status}</p>
      <Button asChild className="w-full sm:w-auto">
        <Link to="/learn/practice/entrepreneurship">{cta}</Link>
      </Button>
    </section>
  );
}

function InnovationDraftCard({
  lang,
  t,
}: {
  lang: 'bg' | 'en';
  t: (en: string, bg: string) => string;
}) {
  const title = lang === 'bg'
    ? 'Практически модули по иновации'
    : 'Practice-first Innovation modules';
  const body = lang === 'bg'
    ? 'Шест чернови модула са подготвени за преглед: идея, изобретение и иновация; видове иновации; подобрение като процес; платформи, екосистеми и network effects; спортни иновации; измерване и версия 2.'
    : 'Six draft modules are ready for review: idea, invention and innovation; types of innovation; improvement as a process; platforms, ecosystems and network effects; sports innovation; measurement and version 2.';
  const status = lang === 'bg'
    ? 'Статус: чернова / за преглед'
    : 'Status: draft / for review';
  const cta = lang === 'bg'
    ? 'Отвори практическите модули'
    : 'Open practice-first modules';

  return (
    <section
      className="rounded-xl border border-border bg-card p-5 space-y-3"
      data-testid="innovation-draft-bridge"
    >
      <div className="flex items-start gap-2 flex-wrap">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <Badge variant="outline" className="text-[10px]">
          {t('Draft / For review', 'Чернова / За преглед')}
        </Badge>
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed">{body}</p>
      <p className="text-[11px] text-muted-foreground">{status}</p>
      <Button asChild className="w-full sm:w-auto">
        <Link to="/learn/practice/innovation">{cta}</Link>
      </Button>
    </section>
  );
}

function SubjectProcessPreview({
  subjectKey,
  availability,
  lang,
  t,
}: {
  subjectKey: string;
  availability: 'playable' | 'preview' | 'planned';
  lang: 'bg' | 'en';
  t: (en: string, bg: string) => string;
}) {
  const areaId = areaOfSubject(subjectKey);
  const theme: LearningTheme | undefined = areaId
    ? LEARNING_THEMES.find((th) => th.learningAreaId === areaId)
    : undefined;

  const framing = lang === 'bg'
    ? 'Този предмет е в процес на подготовка. Вместо празна страница, тук виждаш как ще бъде структуриран учебният процес: кратка теория, практически задачи, казуси, търсене на информация, решения, обратна връзка и подобрение.'
    : 'This subject is in preparation. Instead of showing an empty page, this preview shows how the learning process will work: concise theory, practical tasks, cases, information search, decisions, feedback and improvement.';

  const statusLabel = availability === 'preview'
    ? t('In preparation', 'В процес на подготовка')
    : t('Planned', 'Планирано');

  const practiceMap: Record<string, { en: string; bg: string }> = {
    case_study: { en: 'Case studies', bg: 'Казуси' },
    decision_task: { en: 'Decision tasks', bg: 'Задачи за решения' },
    information_search: { en: 'Information search', bg: 'Търсене на информация' },
    experiment: { en: 'Experiments', bg: 'Експерименти' },
    mvp_build: { en: 'MVP builds', bg: 'MVP разработки' },
    reflection: { en: 'Reflection', bg: 'Рефлексия' },
    peer_review: { en: 'Peer review', bg: 'Оценка от съученици' },
    project: { en: 'Projects', bg: 'Проекти' },
  };

  return (
    <section
      data-testid="subject-process-preview"
      className="rounded-xl border border-dashed border-border bg-card p-5 space-y-5"
    >
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <h2 className="text-sm font-semibold text-foreground">
          {t('How you will work in this subject', 'Как ще работиш по този предмет')}
        </h2>
        <Badge variant="outline" className="text-[10px]">{statusLabel}</Badge>
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed">{framing}</p>

      {theme && (
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t('Short framing', 'Кратка рамка')}
          </h3>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {lang === 'bg' ? theme.short_bg : theme.short_en}
          </p>
        </div>
      )}

      {theme && theme.practiceTypes.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t('What you will do in practice', 'Какво ще правиш на практика')}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {theme.practiceTypes.map((p) => {
              const label = practiceMap[p];
              return (
                <Badge key={p} variant="secondary" className="text-[11px]">
                  {label ? (lang === 'bg' ? label.bg : label.en) : p}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {theme && theme.relatedCaseTags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t('Examples of cases', 'Примери за казуси')}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {theme.relatedCaseTags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[11px]">{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      {theme && theme.relatedDictionaryConcepts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t('Concepts you will meet', 'Понятия, които ще срещнеш')}
          </h3>
          <p className="text-[12px] text-foreground/80 leading-relaxed">
            {theme.relatedDictionaryConcepts.slice(0, 12).join(' · ')}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t('Skills you will evidence', 'Какви умения ще доказваш')}
        </h3>
        <p className="text-[12px] text-foreground/80 leading-relaxed">
          {t(
            'Critical thinking · Problem solving · Decision-making · Research and evidence · Communication · Reflection',
            'Критично мислене · Решаване на проблеми · Вземане на решения · Изследване и доказване · Комуникация · Рефлексия',
          )}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t('Content status', 'Статус на съдържанието')}
        </h3>
        <p className="text-[12px] text-muted-foreground">
          {t(
            'Modules are not published yet. We will add them here as they become playable — no fake content in the meantime.',
            'Модулите още не са публикувани. Ще ги добавим тук, щом станат готови — без фалшиво съдържание междувременно.',
          )}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link to="/dictionary">{t('Open Dictionary', 'Отвори речника')}</Link>
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link to="/cases">{t('Browse Cases', 'Разгледай казусите')}</Link>
        </Button>
        <Button asChild variant="ghost" className="w-full sm:w-auto">
          <Link to="/learn">{t('Back to My Subjects', 'Обратно към Моите предмети')}</Link>
        </Button>
      </div>
    </section>
  );
}

function ModuleRow({
  mod,
  index,
  response,
  lang,
  t,
  onOpen,
  assignmentMeta,
}: {
  mod: CatalogModule;
  index?: number;
  response: any;
  lang: 'bg' | 'en';
  t: (en: string, bg: string) => string;
  onOpen?: () => void;
  assignmentMeta?: { classroomName: string; dueDate: string | null; note: string | null };
}) {
  const isCompleted = !!response?.completed_at;
  const isInProgress = response && !isCompleted;
  const status: ActivityStatus = isCompleted
    ? 'completed'
    : isInProgress
      ? 'in_progress'
      : 'not_started';
  const disabled = !onOpen;
  return (
    <li
      className={`rounded-lg border border-border bg-background p-4 ${
        disabled ? 'opacity-70' : 'hover:border-primary/40 cursor-pointer'
      }`}
      onClick={onOpen}
      aria-disabled={disabled || undefined}
    >
      <div className="flex items-center justify-between gap-4">
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
              <span className="text-xs font-bold text-muted-foreground">{index ?? '•'}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {lang === 'bg' ? mod.title_bg : mod.title_en}
              </h3>
              <StatusBadge status={status} lang={lang} />
              {!mod.hasRichContent && (
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  {t('In preparation', 'В процес на подготовка')}
                </Badge>
              )}
              {!mod.registered && (
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  {t('Draft', 'Чернова')}
                </Badge>
              )}
            </div>
            {assignmentMeta && (
              <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <School className="h-3 w-3" /> {assignmentMeta.classroomName}
                </span>
                {assignmentMeta.dueDate && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(assignmentMeta.dueDate).toLocaleDateString(
                      lang === 'bg' ? 'bg-BG' : 'en-GB',
                    )}
                  </span>
                )}
              </p>
            )}
            {assignmentMeta?.note && (
              <p className="text-[11px] text-muted-foreground italic mt-0.5 line-clamp-1">
                {assignmentMeta.note}
              </p>
            )}
          </div>
        </div>
        {!disabled && (
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </div>
    </li>
  );
}