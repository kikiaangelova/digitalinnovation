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

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Eye,
  FileText,
  HelpCircle,
  Lightbulb,
  MessageCircle,
  PlayCircle,
  Rocket,
  Search,
  Sparkles,
  Target,
} from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  type PracticeTask,
} from '@/data/practice-first-content';
import { themeById } from '@/data/content-structure';
import type { ThemeId } from '@/data/content-structure';
import KikiInlineHint from '@/components/mentor/KikiInlineHint';
import {
  countReadModules,
  isModuleRead,
  setModuleRead,
} from '@/lib/practice-first-progress';

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
  const { user, userRole, isAdmin } = useAuth();
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

  const uid = user?.id ?? null;
  const moduleIds = useMemo(() => modules.map((m) => m.id), [modules]);
  const [readMap, setReadMap] = useState<Record<string, boolean>>({});

  // Rehydrate read-state from localStorage when the user or module set changes.
  useEffect(() => {
    const next: Record<string, boolean> = {};
    for (const id of moduleIds) next[id] = isModuleRead(uid, id);
    setReadMap(next);
  }, [uid, moduleIds]);

  const toggleRead = useCallback(
    (moduleId: string) => {
      setReadMap((prev) => {
        const nextVal = !prev[moduleId];
        setModuleRead(uid, moduleId, nextVal);
        return { ...prev, [moduleId]: nextVal };
      });
    },
    [uid],
  );

  const readCount = moduleIds.reduce(
    (acc, id) => acc + (readMap[id] ? 1 : 0),
    0,
  );
  // Fallback (SSR / first paint) — use raw storage count so `countReadModules`
  // is exercised and the number is right even before the effect runs.
  const initialReadCount = countReadModules(uid, moduleIds);
  const displayReadCount = Object.keys(readMap).length > 0 ? readCount : initialReadCount;

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
            {showReviewerBadge && (
              <Badge variant="outline" className="text-[10px]">
                {draftBadgeLabel}
              </Badge>
            )}
          </div>
          {showReviewerBadge && (
            <p className="typo-helper max-w-2xl">{draftNotice}</p>
          )}
          {showReviewerBadge && (
            <p className="text-[11px] text-muted-foreground">
              {t(
                'You are viewing this as a reviewer (teacher/admin).',
                'Виждаш това като рецензент (учител/админ).',
              )}
            </p>
          )}
          {modules.length > 0 && (
            <p
              className="text-[11px] text-muted-foreground"
              data-testid="pf-read-summary"
            >
              {t(
                `Read ${displayReadCount} of ${modules.length}`,
                `Прочетени ${displayReadCount} от ${modules.length}`,
              )}
              {' · '}
              <span className="opacity-70">
                {t(
                  'personal read-state, not graded, not shared',
                  'лично отбелязване, без оценка, не се споделя',
                )}
              </span>
            </p>
          )}
        </header>

        {validTheme === 'entrepreneurship' && modules.length > 0 && (
          <EntrepreneurshipDecisionCaseCTA lang={lang as 'bg' | 'en'} t={t} />
        )}

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
                showReviewerBadge={showReviewerBadge}
                isRead={!!readMap[mod.id]}
                onToggleRead={() => toggleRead(mod.id)}
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

const FRIENDLY_CASE_LABELS: Record<string, { en: string; bg: string }> = {
  'school-youth-environment': {
    en: 'Case: problem in a familiar environment',
    bg: 'Казус: проблем в позната среда',
  },
  'food-waste-sustainability': {
    en: 'Case: food waste and sustainability',
    bg: 'Казус: разхищение на храна и устойчивост',
  },
  'chatgpt-ai-business-model': {
    en: 'Case: AI product and business model',
    bg: 'Казус: AI продукт и бизнес модел',
  },
  'revolut-fintech': {
    en: 'Case: fintech value and business model',
    bg: 'Казус: финтех стойност и бизнес модел',
  },
  'fashion-business': {
    en: 'Case: fashion idea and MVP',
    bg: 'Казус: модна идея и MVP',
  },
  'small-business': {
    en: 'Case: small business and decision under uncertainty',
    bg: 'Казус: малък бизнес и решение при несигурност',
  },
};

function friendlyCaseLabel(caseId: string, lang: 'bg' | 'en'): string {
  const found = FRIENDLY_CASE_LABELS[caseId];
  if (found) return lang === 'bg' ? found.bg : found.en;
  return lang === 'bg'
    ? 'Казусът към този модул се подготвя.'
    : 'The case for this module is being prepared.';
}

function ModuleAccordionItem({
  mod,
  index,
  lang,
  t,
  draftBadgeShort,
  showReviewerBadge,
  isRead,
  onToggleRead,
}: {
  mod: PracticeFirstModule;
  index: number;
  lang: 'bg' | 'en';
  t: (en: string, bg: string) => string;
  draftBadgeShort: string;
  showReviewerBadge: boolean;
  isRead: boolean;
  onToggleRead: () => void;
}) {
  const title = lang === 'bg' ? mod.title_bg : mod.title_en;
  const theory = lang === 'bg' ? mod.theoryBlock_bg : mod.theoryBlock_en;
  const info = mod.informationSearchTask;
  const [showAllKiki, setShowAllKiki] = useState(false);
  const kikiTotal = mod.kikiQuestions?.length ?? 0;
  const kikiVisible = showAllKiki ? kikiTotal : Math.min(2, kikiTotal);
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
          {isRead && (
            <Badge
              variant="outline"
              className="text-[10px] shrink-0 mt-0.5 border-primary/40 text-primary"
              data-testid={`pf-read-badge-${mod.id}`}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {t('Read', 'Прочетено')}
            </Badge>
          )}
          {showReviewerBadge && (
            <Badge variant="outline" className="text-[10px] shrink-0 mt-0.5">
              {draftBadgeShort}
            </Badge>
          )}
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
                {task.cefe && (
                  <CefeBlock task={task} lang={lang} t={t} />
                )}
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
            <p className="text-xs" data-testid={`pf-case-label-${mod.id}`}>
              <span className="font-semibold text-foreground">
                {friendlyCaseLabel(mod.caseConnection.caseId, lang)}
              </span>
              {showReviewerBadge && (
                <>
                  {' '}
                  <Badge variant="outline" className="text-[10px] ml-1">
                    {t('needs content review', 'нуждае се от преглед на съдържанието')}
                  </Badge>
                  <span className="ml-1 text-[10px] text-muted-foreground/70">
                    ({mod.caseConnection.caseId})
                  </span>
                </>
              )}
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

        {/* 6. Kiki mentor questions — inline, static */}
        <Section
          icon={MessageCircle}
          label={t('Check your thinking', 'Провери мисленето си')}
        >
          <p className="text-[11px] text-muted-foreground italic mb-2">
            {t(
              'These are self-check questions. Kiki does not answer automatically here.',
              'Това са въпроси за самопроверка. Kiki не отговаря автоматично тук.',
            )}
          </p>
          <KikiInlineHint
            questions={mod.kikiQuestions}
            lang={lang}
            max={kikiVisible}
            mood={isRead ? 'approved' : 'thinking'}
          />
          {kikiTotal > 2 && (
            <button
              type="button"
              onClick={() => setShowAllKiki((v) => !v)}
              data-testid={`pf-kiki-toggle-${mod.id}`}
              className="mt-2 text-[11px] font-medium text-primary hover:underline"
            >
              {showAllKiki
                ? t('Hide extra questions', 'Скрий допълнителните въпроси')
                : t('Show more questions', 'Покажи още въпроси')}
            </button>
          )}
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
              <div
                className="flex flex-wrap gap-1.5"
                data-testid={`pf-dict-chips-${mod.id}`}
              >
                {mod.dictionaryConcepts.map((c) => (
                  <Link
                    key={`d-${c}`}
                    to={`/dictionary?q=${encodeURIComponent(c)}`}
                    className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground hover:border-primary/60 hover:text-primary transition-colors"
                    data-testid="pf-dict-chip"
                  >
                    {c}
                  </Link>
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

        {/* 9. Personal read-state — client-only, not graded */}
        <div className="pt-1 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={isRead ? 'outline' : 'default'}
            onClick={onToggleRead}
            data-testid={`pf-read-toggle-${mod.id}`}
          >
            {isRead
              ? t('Mark unread', 'Отмени прочитане')
              : t('Mark as read', 'Маркирай като прочетено')}
          </Button>
          <span className="text-[11px] text-muted-foreground">
            {t(
              'Personal read-state — not graded, not shared.',
              'Лично отбелязване — без оценка, не се споделя.',
            )}
          </span>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function CefeBlock({
  task,
  lang,
  t,
}: {
  task: PracticeTask;
  lang: 'bg' | 'en';
  t: (en: string, bg: string) => string;
}) {
  const c = task.cefe!;
  const pick = (en: string, bg: string) => (lang === 'bg' ? bg : en);
  const questions = lang === 'bg' ? c.processingQuestions_bg : c.processingQuestions_en;

  return (
    <div
      className="mt-3 rounded-md border border-border/80 bg-muted/30 p-3 space-y-3"
      data-testid={`pf-cefe-${task.id}`}
    >
      <CefeRow
        icon={PlayCircle}
        label={t('Action', 'Действие')}
        body={pick(c.action_en, c.action_bg)}
        emphasize
      />
      <CefeRow
        icon={Eye}
        label={t('Visible result', 'Видим резултат')}
        body={pick(c.visibleResult_en, c.visibleResult_bg)}
      />
      <div>
        <CefeLabel icon={HelpCircle} label={t('Processing questions', 'Въпроси за анализ')} />
        <ul className="mt-1 space-y-1">
          {questions.map((q, i) => (
            <li
              key={i}
              className="text-xs text-foreground/90 leading-relaxed pl-3 border-l border-primary/30"
            >
              {q}
            </li>
          ))}
        </ul>
      </div>
      <CefeRow
        icon={Compass}
        label={t('Generalizing principle', 'Принцип')}
        body={pick(c.generalizing_en, c.generalizing_bg)}
      />
      <CefeRow
        icon={Rocket}
        label={t('Apply', 'Приложи')}
        body={pick(c.applying_en, c.applying_bg)}
      />
      <CefeRow
        icon={ClipboardCheck}
        label={t('Teacher check', 'Проверка от учител')}
        body={pick(c.teacherCheck_en, c.teacherCheck_bg)}
      />
      <CefeRow
        icon={FileText}
        label={t('Evidence', 'Доказателство')}
        body={pick(c.evidence_en, c.evidence_bg)}
      />
    </div>
  );
}

function CefeLabel({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <h5 className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground flex items-center gap-1.5">
      <Icon className="h-3 w-3" />
      {label}
    </h5>
  );
}

function CefeRow({
  icon,
  label,
  body,
  emphasize,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  body: string;
  emphasize?: boolean;
}) {
  return (
    <div>
      <CefeLabel icon={icon} label={label} />
      <p
        className={
          'text-xs leading-relaxed mt-1 ' +
          (emphasize ? 'text-foreground font-medium' : 'text-foreground/90')
        }
      >
        {body}
      </p>
    </div>
  );
}

/**
 * Entrepreneurship decision-case CTA (V1).
 *
 * We intentionally do NOT link to a specific case route — no dynamic case
 * catalog is available on the client here, and the seed case for
 * "MVP vs full product" has not been content-reviewed yet. Render the
 * card in a "content pending" state so we never point students at a
 * broken or fabricated route.
 */
function EntrepreneurshipDecisionCaseCTA({
  lang,
  t,
}: {
  lang: 'bg' | 'en';
  t: (en: string, bg: string) => string;
}) {
  const title = lang === 'bg' ? 'Казуси по предприемачество' : 'Entrepreneurship cases';
  const body = lang === 'bg'
    ? 'Приложи темата в казуси с избор, доказателства и рефлексия. Започни с ниво, което отговаря на готовността ти.'
    : 'Apply the theme in cases with choices, evidence and reflection. Start with a level that matches your readiness.';
  const buttonLabel = lang === 'bg' ? 'Виж казусите' : 'View cases';
  const reviewerNote = lang === 'bg'
    ? 'Следваща стъпка: съдържателен upgrade на избрани казуси с последствия и рефлексия.'
    : 'Next step: content upgrade of selected cases with consequences and reflection.';
  const { userRole, isAdmin } = useAuth();
  const showReviewerNote = isAdmin || userRole === 'admin' || userRole === 'teacher_verified';

  return (
    <section
      className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 space-y-2"
      data-testid="pf-decision-case-cta"
    >
      <div className="flex items-start gap-2 flex-wrap">
        <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-semibold text-foreground leading-snug">
            {title}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button asChild size="sm" data-testid="pf-decision-case-cta-link">
          <Link to="/cases?theme=entrepreneurship">{buttonLabel}</Link>
        </Button>
      </div>
      {showReviewerNote && (
        <p
          className="text-[11px] text-muted-foreground pt-1"
          data-testid="pf-decision-case-cta-reviewer-note"
        >
          {reviewerNote}
        </p>
      )}
    </section>
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