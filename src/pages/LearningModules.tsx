/**
 * LearningModules — /learn ("My Subjects" hub, V1)
 *
 * Subject-first. Replaces the old universal Level 1 → Level 2 gate.
 * Shows one card per subject the learner is enrolled in via their
 * classrooms; without a classroom, offers the honest catalog.
 */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, ClipboardList, Compass, GraduationCap, School } from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import { useMySubjects, type MySubjectEntry } from '@/hooks/useMySubjects';
import {
  SUBJECT_CATALOG,
  SUBJECT_BY_KEY,
  subjectShort,
  subjectTitle,
  type Subject,
} from '@/data/subject-catalog';
import {
  LEARNING_AREAS,
  areaOfSubject,
  areaShort,
  areaTitle,
  type LearningArea,
  type LearningAreaId,
} from '@/data/learning-areas';
import { useModuleCatalog } from '@/hooks/useModuleCatalog';

export default function LearningModules() {
  const { user } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);

  const [showCatalog, setShowCatalog] = useState(false);
  const { entries, loading: subjectsLoading } = useMySubjects();
  const { forSubject } = useModuleCatalog();
  const [progressBySubject, setProgressBySubject] = useState<
    Record<string, { completed: number; total: number }>
  >({});

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/learn');
    }
  }, [user, navigate]);

  // Compute per-subject progress from DB response rows + static module list.
  useEffect(() => {
    if (!user || entries.length === 0) {
      setProgressBySubject({});
      return;
    }
    let cancelled = false;
    (async () => {
      const { data: mods } = await supabase
        .from('learning_modules')
        .select('id, slug');
      const idToSlug: Record<string, string> = {};
      (mods ?? []).forEach((m: any) => {
        idToSlug[m.id] = m.slug;
      });
      const { data: resps } = await supabase
        .from('learning_module_responses')
        .select('module_id, completed_at')
        .eq('user_id', user.id);
      if (cancelled) return;
      const completedSlugs = new Set<string>();
      (resps ?? []).forEach((r: any) => {
        if (r.completed_at) {
          const slug = idToSlug[r.module_id];
          if (slug) completedSlugs.add(slug);
        }
      });
      const map: Record<string, { completed: number; total: number }> = {};
      for (const entry of entries) {
        // Use shared catalog so DB-only modules are counted too.
        const catMods = forSubject(entry.subjectKey);
        map[entry.subjectKey] = {
          completed: catMods.filter((m) => completedSlugs.has(m.slug)).length,
          total: catMods.length,
        };
      }
      setProgressBySubject(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, entries, forSubject]);

  const noSubjects = !subjectsLoading && entries.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
        <header>
          <h1 className="typo-h1 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            {t('My Subjects', 'Моите предмети')}
          </h1>
          <p className="typo-helper mt-1">
            {t(
              'The subjects you study — one card per subject you are enrolled in.',
              'Предметите, които изучаваш — една карта за всеки предмет, в който си записан.',
            )}
          </p>
        </header>

        {subjectsLoading ? (
          <p className="text-sm text-muted-foreground">{t('Loading…', 'Зареждане…')}</p>
        ) : noSubjects ? (
          <NoClassroomState
            lang={lang as 'bg' | 'en'}
            t={t}
            onExplore={() => setShowCatalog(true)}
          />
        ) : (
          <ul className="space-y-3">
            {entries.map((entry) => (
              <SubjectRow
                key={entry.subjectKey}
                entry={entry}
                progress={progressBySubject[entry.subjectKey]}
                lang={lang as 'bg' | 'en'}
                t={t}
                onOpen={() => navigate(`/learn/subject/${entry.subjectKey}`)}
              />
            ))}
            <li className="pt-2 text-right">
              <Button variant="ghost" size="sm" onClick={() => setShowCatalog((v) => !v)}>
                <Compass className="h-4 w-4 mr-1" />
                {showCatalog
                  ? t('Hide subject catalog', 'Скрий каталога')
                  : t('Explore all subjects', 'Разгледай всички предмети')}
              </Button>
            </li>
          </ul>
        )}

        {(showCatalog || noSubjects) && (
          <SubjectCatalog
            lang={lang as 'bg' | 'en'}
            t={t}
            onOpen={(key) => navigate(`/learn/subject/${key}`)}
          />
        )}
      </main>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function SubjectRow({
  entry,
  progress,
  lang,
  t,
  onOpen,
}: {
  entry: MySubjectEntry;
  progress?: { completed: number; total: number };
  lang: 'bg' | 'en';
  t: (en: string, bg: string) => string;
  onOpen: () => void;
}) {
  const subject = entry.subject;
  const title = subject
    ? subjectTitle(subject, lang)
    : entry.subjectKey; // legacy / unknown key fallback
  const short = subject ? subjectShort(subject, lang) : '';
  const completed = progress?.completed ?? 0;
  const total = progress?.total ?? 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <li
      className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 cursor-pointer"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <BookOpen className="h-4 w-4 text-primary shrink-0" />
            <h2 className="text-base font-bold text-foreground">{title}</h2>
            {subject && subject.availability !== 'playable' && (
              <Badge variant="outline" className="text-[10px]">
                {subject.availability === 'preview'
                  ? t('Preview', 'Преглед')
                  : t('Planned', 'Планиран')}
              </Badge>
            )}
          </div>
          {short && <p className="text-xs text-muted-foreground mt-1">{short}</p>}
          <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
            <School className="h-3 w-3" />
            {entry.classrooms.map((c) => c.name).join(' · ')}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Progress value={pct} className="h-1.5 flex-1" />
        <span className="text-xs font-semibold text-muted-foreground tabular-nums">
          {total > 0
            ? `${completed}/${total} ${t('completed', 'завършени')}`
            : t('Content in preparation', 'Съдържанието се подготвя')}
        </span>
      </div>

      {(entry.assignments.length > 0 || entry.nextDueDate) && (
        <div className="mt-3 flex items-center gap-3 flex-wrap text-[11px] text-muted-foreground">
          {entry.assignments.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <ClipboardList className="h-3 w-3" />
              {entry.assignments.length}{' '}
              {t(
                entry.assignments.length === 1 ? 'assignment' : 'assignments',
                entry.assignments.length === 1 ? 'задача' : 'задачи',
              )}
            </span>
          )}
          {entry.nextDueDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {t('Next due', 'Следващ срок')}:{' '}
              {new Date(entry.nextDueDate).toLocaleDateString(
                lang === 'bg' ? 'bg-BG' : 'en-GB',
              )}
            </span>
          )}
        </div>
      )}
    </li>
  );
}

function NoClassroomState({
  lang,
  t,
  onExplore,
}: {
  lang: 'bg' | 'en';
  t: (en: string, bg: string) => string;
  onExplore: () => void;
}) {
  return (
    <section className="rounded-xl border border-dashed border-border bg-card p-6 text-center space-y-3">
      <Compass className="h-6 w-6 text-primary mx-auto" />
      <h2 className="text-base font-semibold text-foreground">
        {t("You haven't joined a class yet", 'Все още не си се присъединил към клас')}
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        {t(
          'Join a class with an invite code to see the subjects your teacher assigned — or browse the subject catalog below.',
          'Присъедини се към клас с код за покана, за да видиш предметите, зададени от учителя ти — или разгледай каталога по-долу.',
        )}
      </p>
      <Button variant="outline" size="sm" onClick={onExplore}>
        {t('Explore Subjects', 'Разгледай предметите')}
      </Button>
    </section>
  );
}

function SubjectCatalog({
  lang,
  t,
  onOpen,
}: {
  lang: 'bg' | 'en';
  t: (en: string, bg: string) => string;
  onOpen: (subjectKey: string) => void;
}) {
  const grouped = useMemo(() => {
    const g: Record<'playable' | 'preview' | 'planned', Subject[]> = {
      playable: [],
      preview: [],
      planned: [],
    };
    for (const s of SUBJECT_CATALOG) g[s.availability].push(s);
    return g;
  }, []);

  const section = (
    label: string,
    items: Subject[],
    tone: 'primary' | 'muted' | 'faint',
  ) => {
    if (items.length === 0) return null;
    return (
      <div>
        <h3 className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
          {label}
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {items.map((s) => (
            <li
              key={s.key}
              className={`rounded-lg border p-3 ${
                tone === 'primary'
                  ? 'border-border bg-background hover:border-primary/40 cursor-pointer'
                  : tone === 'muted'
                    ? 'border-border/70 bg-background/60 hover:border-primary/30 cursor-pointer'
                    : 'border-border/50 bg-background/40 opacity-80'
              }`}
              onClick={() =>
                tone === 'faint' ? undefined : onOpen(s.key)
              }
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground truncate">
                  {subjectTitle(s, lang)}
                </p>
                {s.availability !== 'playable' && (
                  <Badge variant="outline" className="text-[10px]">
                    {s.availability === 'preview'
                      ? t('Preview', 'Преглед')
                      : t('Planned', 'Планиран')}
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                {subjectShort(s, lang)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5 space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          {t('Subject catalog', 'Каталог на предметите')}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {t(
            'Content status — we only mark a subject as ready when it truly is.',
            'Състояние на съдържанието — маркираме предмет като готов, само когато наистина е.',
          )}
        </p>
      </div>
      {section(t('Available now', 'Достъпни сега'), grouped.playable, 'primary')}
      {section(t('Preview', 'Преглед'), grouped.preview, 'muted')}
      {section(t('Planned', 'Планирани'), grouped.planned, 'faint')}
    </section>
  );
}
