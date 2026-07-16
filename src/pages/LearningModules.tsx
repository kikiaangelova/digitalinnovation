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
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
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
          <div className="space-y-6">
            {(() => {
              const byArea = new Map<LearningAreaId | '__other__', MySubjectEntry[]>();
              for (const entry of entries) {
                const areaId = areaOfSubject(entry.subjectKey) ?? '__other__';
                const list = byArea.get(areaId) ?? [];
                list.push(entry);
                byArea.set(areaId, list);
              }
              const orderedAreas = LEARNING_AREAS.filter((a) => byArea.has(a.id));
              const otherEntries = byArea.get('__other__') ?? [];
              return (
                <>
                  {orderedAreas.map((area) => {
                    const Icon = area.icon;
                    return (
                      <section key={area.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <h2 className="text-xs uppercase tracking-wide font-bold text-muted-foreground">
                            {areaTitle(area, lang as 'bg' | 'en')}
                          </h2>
                        </div>
                        {area.id === 'entrepreneurship' && (
                          <PracticeFirstDraftLink lang={lang as 'bg' | 'en'} t={t} />
                        )}
                        <ul className="space-y-3">
                          {(byArea.get(area.id) ?? []).map((entry) => (
                            <SubjectRow
                              key={entry.subjectKey}
                              entry={entry}
                              progress={progressBySubject[entry.subjectKey]}
                              lang={lang as 'bg' | 'en'}
                              t={t}
                              onOpen={() => navigate(`/learn/subject/${entry.subjectKey}`)}
                            />
                          ))}
                        </ul>
                      </section>
                    );
                  })}
                  {otherEntries.length > 0 && (
                    <section className="space-y-2">
                      <h2 className="text-xs uppercase tracking-wide font-bold text-muted-foreground">
                        {t('Other', 'Други')}
                      </h2>
                      <ul className="space-y-3">
                        {otherEntries.map((entry) => (
                          <SubjectRow
                            key={entry.subjectKey}
                            entry={entry}
                            progress={progressBySubject[entry.subjectKey]}
                            lang={lang as 'bg' | 'en'}
                            t={t}
                            onOpen={() => navigate(`/learn/subject/${entry.subjectKey}`)}
                          />
                        ))}
                      </ul>
                    </section>
                  )}
                  <div className="pt-2 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setShowCatalog((v) => !v)}>
                      <Compass className="h-4 w-4 mr-1" />
                      {showCatalog
                        ? t('Hide learning areas', 'Скрий учебните области')
                        : t('Explore all learning areas', 'Разгледай всички учебни области')}
                    </Button>
                  </div>
                </>
              );
            })()}
          </div>
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

/* Small link surface for the drafted practice-first modules. */
function PracticeFirstDraftLink({
  lang,
  t,
}: {
  lang: 'bg' | 'en';
  t: (en: string, bg: string) => string;
}) {
  return (
    <Link
      to="/learn/practice/entrepreneurship"
      className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-border bg-background/60 px-3 py-2 hover:border-primary/40"
      data-testid="practice-first-entrepreneurship-link"
    >
      <span className="text-xs text-foreground inline-flex items-center gap-1.5 min-w-0">
        <Sparkles className="h-3 w-3 text-primary shrink-0" />
        <span className="truncate">
          {t(
            'Practice-first drafts (needs review)',
            'Практически чернови (за преглед)',
          )}
        </span>
        <Badge variant="outline" className="text-[10px] shrink-0">
          {t('Draft', 'Чернова')}
        </Badge>
      </span>
      <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
    </Link>
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
  // Subjects that live in a listed area (all of the 14 current subjects).
  const unmapped = useMemo(
    () => SUBJECT_CATALOG.filter((s) => !areaOfSubject(s.key)),
    [],
  );

  return (
    <section className="rounded-xl border border-border bg-card p-5 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          {t('Learning areas', 'Учебни области')}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {t(
            'Subjects are grouped into 6 educational areas — not a flat list. Content status is honest: a subject is marked ready only when it truly is.',
            'Предметите са групирани в 6 учебни области — не са плосък списък. Статусът на съдържанието е честен: маркираме предмет като готов само когато наистина е.',
          )}
        </p>
      </div>

      <div className="space-y-5">
        {LEARNING_AREAS.map((area) => (
          <LearningAreaSection
            key={area.id}
            area={area}
            lang={lang}
            t={t}
            onOpen={onOpen}
          />
        ))}

        {unmapped.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
              {t('Other', 'Други')}
            </h3>
            <SubjectGrid subjects={unmapped} lang={lang} t={t} onOpen={onOpen} />
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Area section with topics + subject grid ─────────────────────── */

function LearningAreaSection({
  area,
  lang,
  t,
  onOpen,
}: {
  area: LearningArea;
  lang: 'bg' | 'en';
  t: (en: string, bg: string) => string;
  onOpen: (subjectKey: string) => void;
}) {
  const subjects = area.subjectKeys
    .map((k) => SUBJECT_BY_KEY[k])
    .filter((s): s is Subject => !!s);
  const Icon = area.icon;
  const isSkillsArea = area.id === 'skills';

  return (
    <div className="rounded-xl border border-border/70 bg-background/60 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-foreground">
            {areaTitle(area, lang)}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {areaShort(area, lang)}
          </p>
        </div>
      </div>

      {area.topics.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {area.topics.map((topic, i) => (
            <li
              key={i}
              className="rounded-full bg-accent/60 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {lang === 'bg' ? topic.bg : topic.en}
            </li>
          ))}
        </ul>
      )}

      {subjects.length > 0 ? (
        <div className="mt-4">
          <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground mb-2">
            {t('Subjects & pathways', 'Предмети и учебни пътеки')}
          </p>
          <SubjectGrid subjects={subjects} lang={lang} t={t} onOpen={onOpen} />
          {area.id === 'entrepreneurship' && (
            <div className="mt-3">
              <PracticeFirstDraftLink lang={lang} t={t} />
            </div>
          )}
        </div>
      ) : isSkillsArea ? (
        <p className="mt-3 text-[11px] italic text-muted-foreground">
          {t(
            'Not a stack of subjects — skills are proven through your tasks, projects, decisions and reflection across every area.',
            'Това не е поредица от предмети — уменията се доказват чрез задачите, проектите, решенията и рефлексията във всяка област.',
          )}
        </p>
      ) : null}
    </div>
  );
}

function SubjectGrid({
  subjects,
  lang,
  t,
  onOpen,
}: {
  subjects: Subject[];
  lang: 'bg' | 'en';
  t: (en: string, bg: string) => string;
  onOpen: (subjectKey: string) => void;
}) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {subjects.map((s) => {
        // Every subject is clickable — preview/planned open a process preview
        // instead of a dead empty state.
        return (
          <li
            key={s.key}
            role="button"
            tabIndex={0}
            data-subject-key={s.key}
            className={`rounded-lg border p-3 min-h-[64px] cursor-pointer transition-colors ${
              s.availability === 'playable'
                ? 'border-border bg-background hover:border-primary/40'
                : s.availability === 'preview'
                  ? 'border-border/70 bg-background/60 hover:border-primary/30'
                  : 'border-dashed border-border/60 bg-background/40 hover:border-primary/30'
            }`}
            onClick={() => onOpen(s.key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpen(s.key);
              }
            }}
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
        );
      })}
    </ul>
  );
}
