/**
 * PracticeFirstThemePage — /learn/practice/:themeId
 *
 * Surfaces the drafted practice-first modules from
 * `src/data/practice-first-content.ts` inside the existing Learn shell,
 * for review inside the platform. Read-only. No submissions, no XP,
 * no progress writes. All content is `needs_review`.
 *
 * V1A only surfaces the Entrepreneurship theme; other themeIds render
 * an honest "content not yet drafted" empty state.
 */

import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileText, Lightbulb, MessageCircle, Rocket, Search, Sparkles, Target } from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import {
  PRACTICE_FIRST_MODULES,
  type PracticeFirstModule,
} from '@/data/practice-first-content';
import { themeById } from '@/data/content-structure';
import type { ThemeId } from '@/data/content-structure';

const KNOWN_THEME_IDS: ThemeId[] = [
  'entrepreneurship',
  'innovation',
  'marketing',
  'management',
  'ai',
];

function isThemeId(x: string | undefined): x is ThemeId {
  return !!x && (KNOWN_THEME_IDS as string[]).includes(x);
}

export default function PracticeFirstThemePage() {
  const { themeId } = useParams<{ themeId: string }>();
  const { lang } = useLang();
  const { userRole, isAdmin } = useAuth();
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);

  const validTheme = isThemeId(themeId) ? themeId : null;
  const theme = validTheme ? themeById(validTheme) : undefined;
  const modules = useMemo<PracticeFirstModule[]>(
    () =>
      validTheme
        ? PRACTICE_FIRST_MODULES.filter((m) => m.themeId === validTheme)
        : [],
    [validTheme],
  );

  const showReviewerBadge =
    isAdmin || userRole === 'admin' || userRole === 'teacher_verified';

  const draftBadgeLabel = lang === 'bg' ? 'Чернова / за преглед' : 'Draft / for review';
  const draftBadgeShort = lang === 'bg' ? 'Чернова' : 'Draft';
  const draftNotice = t(
    'This content is a draft and still needs educator review.',
    'Съдържанието е в чернова и предстои преподавателски преглед.',
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
        <Link
          to="/learn"
          className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-primary"
        >
          <ArrowLeft className="h-3 w-3" /> {t('My Subjects', 'Моите предмети')}
        </Link>

        <header className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Rocket className="h-5 w-5 text-primary" />
            <h1 className="typo-h1">
              {theme
                ? lang === 'bg'
                  ? theme.title_bg
                  : theme.title_en
                : t('Practice-first drafts', 'Практически чернови')}
            </h1>
            <Badge variant="outline" className="text-[10px]">
              {draftBadgeLabel}
            </Badge>
          </div>
          <p className="typo-helper max-w-2xl">{draftNotice}</p>
          {showReviewerBadge && (
            <p className="text-[11px] text-muted-foreground">
              {t(
                'You are viewing this as a reviewer (teacher/admin).',
                'Виждаш това като рецензент (учител/админ).',
              )}
            </p>
          )}
        </header>

        {!validTheme ? (
          <EmptyState
            title={t('Unknown theme', 'Непозната тема')}
            body={t(
              'This theme does not exist yet.',
              'Тази тема все още не съществува.',
            )}
          />
        ) : modules.length === 0 ? (
          <EmptyState
            title={t('Not drafted yet', 'Все още няма чернова')}
            body={t(
              'Practice-first content for this theme has not been drafted yet.',
              'Практическо съдържание за тази тема все още не е разработено.',
            )}
          />
        ) : (
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
          >
            {modules.map((mod, idx) => (
              <ModuleAccordionItem
                key={mod.id}
                mod={mod}
                index={idx + 1}
                lang={lang as 'bg' | 'en'}
                t={t}
                draftBadgeShort={draftBadgeShort}
              />
            ))}
          </Accordion>
        )}
      </main>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-xl border border-dashed border-border bg-card p-8 text-center space-y-2">
      <p className="text-sm text-foreground font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{body}</p>
    </section>
  );
}

function ModuleAccordionItem({
  mod,
  index,
  lang,
  t,
  draftBadgeShort,
}: {
  mod: PracticeFirstModule;
  index: number;
  lang: 'bg' | 'en';
  t: (en: string, bg: string) => string;
  draftBadgeShort: string;
}) {
  const title = lang === 'bg' ? mod.title_bg : mod.title_en;
  const theory = lang === 'bg' ? mod.theoryBlock_bg : mod.theoryBlock_en;
  const info = mod.informationSearchTask;
  return (
    <AccordionItem
      value={mod.id}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <AccordionTrigger className="px-4 py-4 hover:no-underline gap-3 items-start">
        <div className="flex items-start gap-3 min-w-0 text-left w-full">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-muted-foreground">
            {index}
          </span>
          <span className="text-sm font-semibold text-foreground leading-snug break-words min-w-0 flex-1">
            {title}
          </span>
          <Badge variant="outline" className="text-[10px] shrink-0 mt-0.5">
            {draftBadgeShort}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-6 pt-1 space-y-6 border-t border-border/60">
        {/* 2. Short theory */}
        <Section
          icon={BookOpen}
          label={t('Short theory', 'Кратка теория')}
          muted
        >
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {theory}
          </p>
        </Section>

        {/* 3. Practice tasks — prominent */}
        <Section
          icon={Target}
          label={t('Practice tasks', 'Практически задачи')}
          emphasize
        >
          <ul className="space-y-3">
            {mod.practiceTasks.map((task) => (
              <li
                key={task.id}
                className="rounded-lg border border-border bg-background p-3"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">
                    {lang === 'bg' ? task.title_bg : task.title_en}
                  </p>
                  <Badge variant="secondary" className="text-[10px]">
                    {task.kind}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {lang === 'bg' ? task.brief_bg : task.brief_en}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        {/* 4. Information search */}
        {info && (
          <Section
            icon={Search}
            label={t('Information search', 'Търсене на информация')}
          >
            <p className="text-sm text-foreground/90 leading-relaxed">
              {lang === 'bg' ? info.prompt_bg : info.prompt_en}
            </p>
          </Section>
        )}

        {/* 5. Case connection */}
        {mod.caseConnection && (
          <Section icon={FileText} label={t('Case connection', 'Връзка с казус')}>
            <p className="text-xs">
              <span className="font-semibold text-foreground">
                {mod.caseConnection.caseId}
              </span>{' '}
              <Badge variant="outline" className="text-[10px] ml-1">
                {t('needs content review', 'нуждае се от преглед на съдържанието')}
              </Badge>
            </p>
            {(mod.caseConnection.note_en || mod.caseConnection.note_bg) && (
              <p className="text-xs text-muted-foreground mt-1">
                {lang === 'bg'
                  ? mod.caseConnection.note_bg ?? mod.caseConnection.note_en
                  : mod.caseConnection.note_en ?? mod.caseConnection.note_bg}
              </p>
            )}
          </Section>
        )}

        {/* 6. Kiki questions */}
        <Section icon={MessageCircle} label={t('Kiki questions', 'Въпроси от Kiki')}>
          <ul className="space-y-1.5">
            {mod.kikiQuestions.map((q, i) => (
              <li
                key={i}
                className="text-sm text-foreground/90 leading-relaxed pl-3 border-l-2 border-primary/40"
              >
                {lang === 'bg' ? q.bg : q.en}
              </li>
            ))}
          </ul>
        </Section>

        {/* 7. Reflection + improvement */}
        <Section
          icon={Lightbulb}
          label={t('Reflection & improvement', 'Рефлексия и подобрение')}
        >
          <p className="text-sm text-foreground/90 leading-relaxed">
            <span className="font-semibold">{t('Reflect: ', 'Рефлексия: ')}</span>
            {lang === 'bg' ? mod.reflectionPrompt.bg : mod.reflectionPrompt.en}
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed mt-2">
            <span className="font-semibold">{t('Improve: ', 'Подобрение: ')}</span>
            {lang === 'bg' ? mod.improvementPrompt.bg : mod.improvementPrompt.en}
          </p>
        </Section>

        {/* 8. Key concepts / dictionary */}
        <Section
          icon={Sparkles}
          label={t('Key & dictionary concepts', 'Ключови и речникови понятия')}
        >
          <div className="space-y-2">
            {mod.keyConcepts.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {mod.keyConcepts.map((c) => (
                  <span
                    key={`k-${c}`}
                    className="rounded-full bg-accent/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
            {mod.dictionaryConcepts.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {mod.dictionaryConcepts.map((c) => (
                  <span
                    key={`d-${c}`}
                    className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
            {mod.evidenceOfSkill.length > 0 && (
              <p className="text-[11px] text-muted-foreground pt-1">
                <span className="font-semibold">
                  {t('Evidence of skill: ', 'Доказателство за умение: ')}
                </span>
                {mod.evidenceOfSkill.join(' · ')}
              </p>
            )}
          </div>
        </Section>
      </AccordionContent>
    </AccordionItem>
  );
}

function Section({
  icon: Icon,
  label,
  emphasize,
  muted,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  emphasize?: boolean;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3
        className={`text-[10px] uppercase tracking-wide flex items-center gap-1.5 mb-2 ${
          emphasize
            ? 'text-primary font-bold'
            : muted
              ? 'text-muted-foreground/70 font-medium'
              : 'text-muted-foreground font-bold'
        }`}
      >
        <Icon className="h-3 w-3" />
        {label}
      </h3>
      {children}
    </section>
  );
}