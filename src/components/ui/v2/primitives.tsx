import { ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";
import {
  BookOpen, Compass, PenLine, FileText, FlaskConical, Scale, Activity,
  MessageSquare, Sparkles, TrendingUp, Award, ArrowRight, AlertCircle,
  Loader2, Inbox, CheckCircle2, HelpCircle, Briefcase, Search,
} from "lucide-react";

/* ═════════════════════════════════════════════════════════════
   DigiInnov Design System V2 — shared UI primitives.
   Use these instead of ad-hoc cards/headers/shadows.
   ═════════════════════════════════════════════════════════════ */

/** Page shell — consistent width, mobile-safe padding. */
export function PageShell({
  children, className, width = "default",
}: { children: ReactNode; className?: string; width?: "narrow" | "default" | "wide" | "full" }) {
  const w = {
    narrow: "max-w-3xl",
    default: "max-w-5xl",
    wide: "max-w-6xl",
    full: "max-w-none",
  }[width];
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8", w, className)}>
      {children}
    </div>
  );
}

/** Page-level header: eyebrow, title, description, optional actions. */
export function PageHeader({
  eyebrow, title, description, actions, className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <div className="typo-eyebrow text-primary mb-2">{eyebrow}</div>}
        <h1 className="typo-h1">{title}</h1>
        {description && <p className="typo-body text-muted-foreground mt-2 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}

/** In-page section header, softer than PageHeader. */
export function SectionHeader({
  title, description, action, icon: Icon, className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-3", className)}>
      <div className="min-w-0">
        <h2 className="typo-h3 flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          {title}
        </h2>
        {description && <p className="typo-helper mt-1">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Big editorial hero — landing, module intro. Uses restrained warm gradient. */
export function EditorialHero({
  eyebrow, title, description, children, className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-10 sm:px-10 sm:py-14",
        className,
      )}
      style={{ boxShadow: "var(--shadow-lift)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-warm)" }}
      />
      <div className="relative">
        {eyebrow && <div className="typo-eyebrow text-primary mb-3">{eyebrow}</div>}
        <h1 className="typo-display max-w-3xl">{title}</h1>
        {description && <p className="typo-long text-muted-foreground mt-4 max-w-2xl">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

/** Neutral content container. Soft depth, no hard black shadow. */
export const ContentCard = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { padded?: boolean }>(
  ({ className, padded = true, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground",
        "shadow-[var(--shadow-sticker)]",
        padded && "p-5 sm:p-6",
        className,
      )}
      {...rest}
    />
  ),
);
ContentCard.displayName = "ContentCard";

/** Interactive card that acts as a link/button. Adds hover lift + focus ring. */
export function ActionCard({
  title, description, icon: Icon, onClick, href, meta, disabled, className,
}: {
  title: ReactNode;
  description?: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  meta?: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const inner = (
    <>
      {Icon && (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-primary shrink-0"
          style={{ backgroundColor: "hsl(var(--brand-soft))" }}>
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="typo-card-title">{title}</div>
        {description && <div className="typo-helper mt-0.5">{description}</div>}
        {meta && <div className="typo-meta mt-2">{meta}</div>}
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
    </>
  );
  const cls = cn(
    "group flex w-full items-start gap-3 rounded-2xl border border-border bg-card p-4 sm:p-5 text-left",
    "transition-all hover:border-primary/40 hover:shadow-[var(--shadow-lift)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    disabled && "opacity-60 pointer-events-none",
    className,
  );
  if (href) return <a href={href} className={cls}>{inner}</a>;
  return <button type="button" onClick={onClick} disabled={disabled} className={cls}>{inner}</button>;
}

/** Progress card — shows a labelled progress bar with tokens. */
export function ProgressCard({
  title, value, total, description, className,
}: {
  title: ReactNode;
  value: number;
  total: number;
  description?: ReactNode;
  className?: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <ContentCard className={className}>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <div className="typo-card-title">{title}</div>
        <div className="typo-numeric text-sm text-muted-foreground">
          {value}/{total} · {pct}%
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%`, background: "var(--gradient-warm)" }}
        />
      </div>
      {description && <div className="typo-helper mt-3">{description}</div>}
    </ContentCard>
  );
}

/** Compact metric display — for KPI-style numbers. Uses numeric font. */
export function MetricDisplay({
  label, value, delta, hint, tone = "neutral", className,
}: {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  hint?: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "ai";
  className?: string;
}) {
  const toneClass = {
    neutral: "text-foreground",
    success: "text-[hsl(var(--success))]",
    warning: "text-[hsl(var(--warning))]",
    danger: "text-[hsl(var(--danger))]",
    ai: "text-[hsl(var(--ai))]",
  }[tone];
  return (
    <ContentCard className={cn("py-4", className)} padded={false}>
      <div className="px-5">
        <div className="typo-label">{label}</div>
        <div className={cn("typo-numeric text-2xl mt-1", toneClass)}>{value}</div>
        {(delta || hint) && (
          <div className="typo-meta mt-1 flex items-center gap-2">
            {delta}
            {hint && <span>{hint}</span>}
          </div>
        )}
      </div>
    </ContentCard>
  );
}

/** Consistent status pill. Meaning conveyed by icon + label, not color alone. */
export function StatusIndicator({
  status, label, className,
}: {
  status: "todo" | "in_progress" | "done" | "review" | "locked" | "preview";
  label?: ReactNode;
  className?: string;
}) {
  const map = {
    todo:        { text: "text-muted-foreground", bg: "bg-muted", icon: Inbox,        default: "Not started" },
    in_progress: { text: "text-primary",           bg: "bg-brand-soft", icon: Activity, default: "In progress" },
    done:        { text: "text-[hsl(var(--success))]", bg: "bg-[hsl(var(--success-soft))]", icon: CheckCircle2, default: "Completed" },
    review:      { text: "text-[hsl(var(--ai))]",  bg: "bg-[hsl(var(--ai-soft))]", icon: MessageSquare, default: "Awaiting review" },
    locked:      { text: "text-muted-foreground", bg: "bg-muted", icon: AlertCircle, default: "Locked" },
    preview:     { text: "text-[hsl(var(--ai))]",  bg: "bg-[hsl(var(--ai-soft))]", icon: Sparkles,     default: "Preview" },
  } as const;
  const s = map[status];
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", s.text, s.bg, className)}
      style={status === "in_progress" ? { backgroundColor: "hsl(var(--brand-soft))" } : undefined}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label ?? s.default}
    </span>
  );
}

/** Empty state — no data yet, calm and honest. */
export function EmptyState({
  icon: Icon = Inbox, title, description, action, className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-dashed border-border bg-card/60 py-12 px-6 text-center", className)}>
      <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div className="typo-card-title">{title}</div>
      {description && <div className="typo-helper mt-1 max-w-md mx-auto">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Loading state — subtle spinner, quiet. */
export function LoadingState({ label, className }: { label?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground", className)}>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      <span>{label ?? "Loading…"}</span>
    </div>
  );
}

/** Error state — honest, actionable. */
export function ErrorState({
  title, description, action, className,
}: { title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-[hsl(var(--danger)/0.35)] bg-[hsl(var(--danger)/0.06)] p-5", className)}>
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-[hsl(var(--danger))] shrink-0 mt-0.5" aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="typo-card-title">{title}</div>
          {description && <div className="typo-helper mt-1">{description}</div>}
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
}

/** KikiNote — reusable mentor voice card. Not a graduation cap. */
export function KikiNote({
  title, children, tone = "note", className,
}: {
  title?: ReactNode;
  children: ReactNode;
  tone?: "note" | "challenge" | "reflect";
  className?: string;
}) {
  const cfg = {
    note:      { icon: Sparkles,      label: "From Kiki",     accent: "hsl(var(--brand))" },
    challenge: { icon: Scale,         label: "Kiki challenges", accent: "hsl(var(--highlight))" },
    reflect:   { icon: PenLine,       label: "Reflect with Kiki", accent: "hsl(var(--ai))" },
  }[tone];
  const Icon = cfg.icon;
  return (
    <div
      className={cn("relative rounded-2xl border border-border bg-card p-4 sm:p-5", className)}
      style={{ boxShadow: "var(--shadow-sticker)" }}
    >
      <div aria-hidden className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full" style={{ background: cfg.accent }} />
      <div className="pl-3">
        <div className="typo-eyebrow flex items-center gap-1.5 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {title ?? cfg.label}
        </div>
        <div className="typo-body mt-2 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   LearningStageIndicator — the canonical learning-phase system.
   Full model: Discover → Learn → Explore → Apply → Decide →
     See Consequences → Receive Feedback → Reflect → Improve → Continue.
   Activities render only the subset that actually exists.
   ═════════════════════════════════════════════════════════════ */

export type LearningStage =
  | "discover" | "learn" | "explore" | "apply" | "decide"
  | "consequences" | "feedback" | "reflect" | "improve" | "next"
  | "knowledge_check" | "case" | "analysis";

const STAGE_META: Record<LearningStage, {
  icon: React.ComponentType<{ className?: string }>;
  en: string; bg: string;
}> = {
  discover:     { icon: Compass,       en: "Discover",         bg: "Открий" },
  learn:        { icon: BookOpen,      en: "Learn",            bg: "Учи" },
  explore:      { icon: FileText,      en: "Explore",          bg: "Разгледай" },
  apply:        { icon: PenLine,       en: "Apply",            bg: "Приложи" },
  decide:       { icon: Scale,         en: "Decide",           bg: "Реши" },
  consequences: { icon: Activity,      en: "Consequences",     bg: "Последствия" },
  feedback:     { icon: MessageSquare, en: "Feedback",         bg: "Обратна връзка" },
  reflect:      { icon: PenLine,       en: "Reflect",          bg: "Рефлексия" },
  improve:      { icon: TrendingUp,    en: "Improve",          bg: "Подобри" },
  next:         { icon: ArrowRight,    en: "Next step",        bg: "Следваща стъпка" },
  knowledge_check: { icon: HelpCircle, en: "Knowledge check",  bg: "Проверка на разбирането" },
  case:            { icon: Briefcase,  en: "Case",             bg: "Казус" },
  analysis:        { icon: Search,     en: "Analysis",         bg: "Анализ" },
};

export function stageLabel(stage: LearningStage, lang: "en" | "bg"): string {
  return lang === "bg" ? STAGE_META[stage].bg : STAGE_META[stage].en;
}

/**
 * Renders the current activity's phase sequence. Pass ONLY the stages
 * that actually exist in this activity — do not imply phases that are
 * not implemented. Mark uncompleted-but-recommended stages as `recommended`.
 */
export function LearningStageIndicator({
  stages, current, completed = [], recommended = [], lang, className,
}: {
  stages: LearningStage[];
  current?: LearningStage;
  completed?: LearningStage[];
  recommended?: LearningStage[];
  lang: "en" | "bg";
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-wrap items-center gap-1.5", className)} aria-label={lang === "bg" ? "Етапи на активността" : "Activity stages"}>
      {stages.map((s, i) => {
        const meta = STAGE_META[s];
        const Icon = meta.icon;
        const isDone = completed.includes(s);
        const isCurrent = current === s;
        const isRecommended = recommended.includes(s);
        return (
          <li key={s} className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                isCurrent && "border-primary bg-brand-soft text-primary",
                isDone && !isCurrent && "border-[hsl(var(--success)/0.4)] bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]",
                isRecommended && !isCurrent && !isDone && "border-dashed border-border bg-muted text-muted-foreground",
                !isDone && !isCurrent && !isRecommended && "border-border bg-card text-muted-foreground",
              )}
              style={isCurrent ? { backgroundColor: "hsl(var(--brand-soft))" } : undefined}
              aria-current={isCurrent ? "step" : undefined}
            >
              {isDone && !isCurrent ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                : <Icon className="h-3.5 w-3.5" aria-hidden />}
              <span>{lang === "bg" ? meta.bg : meta.en}</span>
              {isRecommended && (
                <span className="ml-1 text-[10px] uppercase tracking-wider opacity-70">
                  {lang === "bg" ? "препор." : "next"}
                </span>
              )}
            </span>
            {i < stages.length - 1 && <span aria-hidden className="text-muted-foreground/50">·</span>}
          </li>
        );
      })}
    </ol>
  );
}

export { Award, FlaskConical }; // convenience re-exports