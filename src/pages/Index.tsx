import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import AppHeader from "@/components/layout/AppHeader";
import heroBg from "@/assets/hero-bg.mp4.asset.json";
import kikiAvatar from "@/assets/kiki-avatar.png";
import {
  ArrowRight, Sparkles, Rocket, Lightbulb, Briefcase, TrendingUp,
  Palette, Brain, Compass, ScrollText, Trophy, Play, Heart,
  MapPin, Check,
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const T = (en: string, bg: string) => (lang === "bg" ? bg : en);

  const go = (path: string) =>
    user ? navigate(path) : navigate(`/auth?redirect=${encodeURIComponent(path)}`);

  // Subject "vibes" — Learn Italian style deck grid
  const vibes = [
    { emoji: "💡", key: "innov",   to: "/pathways",     titleEn: "Digital Innovation", titleBg: "Дигитални иновации",   blurbEn: "How tech eats old industries.",         blurbBg: "Как технологиите изяждат старите индустрии." },
    { emoji: "🚀", key: "startup", to: "/startup-project", titleEn: "Startup Thinking",  titleBg: "Стартъп мислене",       blurbEn: "Idea → customer → business, in weeks.", blurbBg: "Идея → клиент → бизнес, за седмици." },
    { emoji: "🧠", key: "ai",      to: "/pathways",     titleEn: "AI for Business",    titleBg: "AI за бизнеса",         blurbEn: "Prompt like a pro, decide like a founder.", blurbBg: "Пиши промптове като про, решавай като фаундър." },
    { emoji: "📈", key: "market",  to: "/pathways",     titleEn: "Marketing & Growth", titleBg: "Маркетинг и растеж",    blurbEn: "Get seen, get bought, get remembered.", blurbBg: "Да те видят, да те купят, да те запомнят." },
    { emoji: "💰", key: "money",   to: "/pathways",     titleEn: "Finance Basics",     titleBg: "Финансови основи",      blurbEn: "Unit economics without the fear.",      blurbBg: "Unit economics без страха." },
    { emoji: "🎨", key: "design",  to: "/pathways",     titleEn: "Product & Design",   titleBg: "Продукт и дизайн",      blurbEn: "Build things people actually want.",    blurbBg: "Прави неща, които хората наистина искат." },
  ];

  const journey = [
    { emoji: "🧭", titleEn: "Explore",   titleBg: "Откривай",    blurbEn: "Meet the frameworks — Lean, Design Thinking, Blue Ocean.", blurbBg: "Запознай се с рамките — Lean, Design Thinking, Blue Ocean." },
    { emoji: "🔍", titleEn: "Analyze",   titleBg: "Анализирай",  blurbEn: "Real cases: Lovable, Payhawk, Revolut, Payhawk, Notion.",  blurbBg: "Реални казуси: Lovable, Payhawk, Revolut, Notion." },
    { emoji: "🧪", titleEn: "Try",       titleBg: "Опитай",       blurbEn: "The simulator pushes back. You'll make mistakes on purpose.", blurbBg: "Симулаторът ти отговаря. Ще грешиш нарочно." },
    { emoji: "🎨", titleEn: "Design",    titleBg: "Проектирай",  blurbEn: "Your own startup — problem, customer, model, pitch.",      blurbBg: "Твоят стартъп — проблем, клиент, модел, pitch." },
    { emoji: "🎤", titleEn: "Pitch",     titleBg: "Питчвай",     blurbEn: "End of season: you defend your business, live.",            blurbBg: "В края на сезона: защитаваш бизнеса си, на живо." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-4 sm:px-5 sm:pt-6">
        {/* ═══════════ HERO — cinematic video, big Fraunces statement ═══════════ */}
        <section className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl sm:rounded-[2rem]">
          <video
            src={heroBg.url}
            autoPlay loop muted playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/40 to-primary/40" />
          <div className="relative z-10 px-5 py-10 sm:px-10 sm:py-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white backdrop-blur">
              <Sparkles className="h-3 w-3" /> {T("Learn · Apply · Have fun", "Учи · Прилагай · Забавлявай се")}
            </span>
            <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.9] text-white sm:text-7xl">
              {T("Business,", "Бизнес,")}
              <br />
              <span
                className="italic bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-zest)" }}
              >
                {T("the real way.", "по истинския начин.")}
              </span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/85 sm:text-base">
              {T(
                "No lectures. No dead PDFs. You walk into a real case, make a real decision — and watch what happens to your business.",
                "Без лекции. Без мъртви PDF-и. Влизаш в реален казус, взимаш реално решение — и виждаш какво става с бизнеса ти."
              )}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {user ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-foreground transition active:scale-95 sm:hover:scale-105"
                  style={{ boxShadow: "var(--shadow-warm)" }}
                >
                  {T("Open your dashboard", "Отвори таблото")} <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/auth?mode=signup")}
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-foreground transition active:scale-95 sm:hover:scale-105"
                    style={{ boxShadow: "var(--shadow-warm)" }}
                  >
                    {T("Start free", "Започни безплатно")} <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => document.getElementById("vibes")?.scrollIntoView({ behavior: "smooth" })}
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur"
                  >
                    <Play className="h-4 w-4" /> {T("Peek inside", "Надникни")}
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════ Meet Kiki — personal card, floats over hero ═══════════ */}
        <section
          className="mt-4 mx-auto flex max-w-md items-center gap-3 rounded-3xl border border-white/30 bg-white/70 p-3 backdrop-blur-xl sm:-mt-8 sm:gap-4 sm:p-4"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <img
            src={kikiAvatar}
            alt="Kiki, your business mentor"
            width={64}
            height={64}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-primary sm:h-16 sm:w-16"
          />
          <div className="flex-1 min-w-0">
            <div className="font-display text-lg leading-tight">
              {T("I'm Kiki.", "Аз съм Кики.")}
            </div>
            <div className="text-xs text-muted-foreground">
              {T("20 years mentoring founders. Now, yours.", "20 г. mentor на фаундъри. Сега — твой.")}
            </div>
          </div>
          <button
            onClick={() => go("/mentor")}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition hover:scale-105"
          >
            {T("Say hi", "Здрасти")} <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </section>

        {/* ═══════════ Pick your vibe — deck grid ═══════════ */}
        <section id="vibes" className="mt-8">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-3xl font-extrabold">
              {T("Pick your", "Избери си ")}
              <span className="italic text-primary">{T("vibe", "тема")}</span>
            </h2>
            <button onClick={() => go("/pathways")} className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {T("See all", "Всички")}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {vibes.map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={() => go(v.to)}
                className="group text-left rounded-2xl border border-border/60 bg-card p-4 transition active:scale-[0.98] hover:-translate-y-0.5 hover:border-primary/40"
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                <div className="text-2xl">{v.emoji}</div>
                <div className="mt-2 font-display text-base font-semibold leading-tight text-foreground">
                  {T(v.titleEn, v.titleBg)}
                </div>
                <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {T(v.blurbEn, v.blurbBg)}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ═══════════ Story chapter 1 — Learn by doing ═══════════ */}
        <section
          className="mt-8 grid gap-5 rounded-3xl border border-border/60 bg-card p-6 sm:grid-cols-[1.1fr_1fr] sm:items-center sm:gap-8 sm:p-8"
          style={{ boxShadow: "var(--shadow-warm)" }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              {T("Chapter 1", "Глава 1")}
            </p>
            <h3 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              {T("You learn business", "Учиш бизнес,")}
              <br />
              <span className="italic text-primary">{T("by doing business.", "като правиш бизнес.")}</span>
            </h3>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              {T(
                "TEACR loop: Try → Error → Analyze → Correct → Reflect. Every mistake is graded — but nothing is punished. You just get sharper.",
                "TEACR цикъл: Опит → Грешка → Анализ → Корекция → Рефлексия. Всяка грешка се оценява — но нищо не се наказва. Ти просто ставаш по-остър."
              )}
            </p>
          </div>
          <div className="relative aspect-square rounded-2xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-6">
            <div className="absolute -top-3 -left-3 rounded-xl bg-primary px-3 py-1 text-xs font-bold text-primary-foreground rotate-[-4deg]">
              {T("Try", "Опит")}
            </div>
            <div className="absolute top-6 right-6 rounded-xl bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground rotate-[6deg]">
              {T("Error", "Грешка")}
            </div>
            <div className="absolute bottom-16 left-6 rounded-xl bg-accent px-3 py-1 text-xs font-bold text-accent-foreground rotate-[-3deg]">
              {T("Analyze", "Анализ")}
            </div>
            <div className="absolute bottom-6 right-8 rounded-xl bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground rotate-[4deg]">
              {T("Correct", "Корекция")}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-16 w-16 text-primary/40" />
            </div>
          </div>
        </section>

        {/* ═══════════ Story chapter 2 — Journey ═══════════ */}
        <section className="mt-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            {T("Chapter 2", "Глава 2")}
          </p>
          <h3 className="mt-1 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            {T("The journey.", "Пътят.")}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {T("Five moves, six weeks, one real business at the end.", "Пет хода, шест седмици, един реален бизнес накрая.")}
          </p>

          <ol className="relative mt-6 space-y-2 border-l-2 border-dashed border-border/60 pl-5">
            {journey.map((j, i) => (
              <li key={j.titleEn} className="relative">
                <span className="absolute -left-[30px] top-3 grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-4 ring-background">
                  {i + 1}
                </span>
                <div
                  className="rounded-2xl border border-border/60 bg-card p-4"
                  style={{ boxShadow: "var(--shadow-soft)" }}
                >
                  <div className="font-display text-base font-semibold">
                    {j.emoji} {T(j.titleEn, j.titleBg)}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                    {T(j.blurbEn, j.blurbBg)}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ═══════════ Story chapter 3 — Kiki's promise (illustration left, text right) ═══════════ */}
        <section
          className="mt-10 grid gap-5 overflow-hidden rounded-3xl border border-primary/30 p-6 sm:grid-cols-[1fr_1.1fr] sm:items-center sm:gap-8 sm:p-8"
          style={{ background: "var(--gradient-soft)", boxShadow: "var(--shadow-warm)" }}
        >
          <div className="relative">
            <img
              src={kikiAvatar}
              alt="Kiki"
              className="mx-auto h-40 w-40 rounded-3xl object-cover ring-4 ring-primary/40 sm:h-56 sm:w-56"
              style={{ boxShadow: "var(--shadow-warm)" }}
            />
            <div className="absolute -bottom-2 -right-2 rounded-2xl bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground rotate-[-4deg]" style={{ boxShadow: "var(--shadow-sticker)" }}>
              {T("Your mentor", "Твоят ментор")}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              {T("Chapter 3", "Глава 3")}
            </p>
            <h3 className="mt-1 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              {T("I'll be with you", "Ще съм с теб")}
              <br />
              <span className="italic text-primary">{T("the whole way.", "по целия път.")}</span>
            </h3>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              {T(
                "I'm Kirilka — Kiki. I've spent 20 years asking founders the hard questions so they don't get eaten by their own blind spots. On this platform, I'm the AI you can ask anything. Bad ideas welcome. That's how you find the good ones.",
                "Аз съм Кирилка — Кики. 20 години задавам на фаундъри трудните въпроси, за да не ги изяде собствената им слепота. Тук съм AI-ът, който можеш да питаш всичко. Лоши идеи — добре дошли. Така се стига до добрите."
              )}
            </p>
            <button
              onClick={() => go("/mentor")}
              className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition active:scale-95 sm:hover:scale-105"
              style={{ boxShadow: "var(--shadow-warm)" }}
            >
              {T("Meet Kiki", "Запознай се с Кики")} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* ═══════════ Final nudge ═══════════ */}
        {!user && (
          <section
            className="mt-10 overflow-hidden rounded-3xl border border-primary/30 p-6 sm:p-8"
            style={{ background: "var(--gradient-soft)", boxShadow: "var(--shadow-warm)" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              {T("One more thing", "Още едно нещо")}
            </p>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              {T("It's free. Really.", "Безплатно е. Наистина.")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {T(
                "No credit card. No trial timer. Made in Bulgaria, for the next generation of founders — and the teachers who believe in them.",
                "Без карта. Без таймер. Създадено в България, за следващото поколение фаундъри — и учителите, които вярват в тях."
              )}
            </p>
            <button
              onClick={() => navigate("/auth?mode=signup")}
              className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition active:scale-95 sm:hover:scale-105"
              style={{ boxShadow: "var(--shadow-warm)" }}
            >
              {T("Create free account", "Създай безплатен акаунт")} <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        )}

        <p className="mt-12 text-center text-sm italic text-muted-foreground">
          {T("Made with", "Направено с")} <Heart className="inline h-4 w-4 fill-primary text-primary" /> {T("by Kiki — a presto!", "от Кики — до скоро!")}
        </p>
      </main>
    </div>
  );
};

export default Index;
