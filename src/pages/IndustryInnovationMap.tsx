import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ChevronRight, ChevronLeft, ArrowRight, Lightbulb, AlertTriangle,
  Rocket, Cpu, Globe, Check
} from 'lucide-react';
import { INDUSTRIES, type IndustryData } from '@/data/industry-map-data';

export default function IndustryInnovationMap() {
  const { user } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<IndustryData | null>(null);

  const chooseIndustry = async (industry: IndustryData) => {
    if (!user) {
      toast.error(lang === 'bg' ? 'Трябва да влезете в профила си' : 'Please sign in first');
      return;
    }
    // Update or insert industry on startup_projects
    const { data: existing } = await supabase
      .from('startup_projects')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      await supabase.from('startup_projects').update({ industry: industry.id }).eq('user_id', user.id);
    } else {
      await supabase.from('startup_projects').insert({ user_id: user.id, industry: industry.id });
    }
    toast.success(
      lang === 'bg'
        ? `Индустрия "${industry.nameBg}" е свързана с твоя стартъп проект!`
        : `Industry "${industry.nameEn}" linked to your startup project!`
    );
    navigate('/my-startup');
  };

  // Industry grid view
  if (!selected) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              {lang === 'bg' ? 'Табло' : 'Dashboard'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">
              {lang === 'bg' ? 'Карта на индустриалните иновации' : 'Industry Innovation Map'}
            </span>
          </nav>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  {lang === 'bg' ? 'Карта на индустриалните иновации' : 'Industry Innovation Map'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {lang === 'bg'
                    ? 'Изследвайте как дигиталните иновации трансформират различни индустрии'
                    : 'Explore how digital innovation is transforming different industries'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map(ind => (
              <button
                key={ind.id}
                onClick={() => setSelected(ind)}
                className="group rounded-xl border border-border bg-card p-5 text-left transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="text-3xl mb-3">{ind.icon}</div>
                <h3 className="text-lg font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                  {lang === 'bg' ? ind.nameBg : ind.nameEn}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {lang === 'bg' ? ind.overviewBg : ind.overviewEn}
                </p>
                <div className="flex items-center gap-1 mt-3 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  {lang === 'bg' ? 'Разгледай' : 'Explore'} <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Industry detail view
  const ind = selected;
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">
            {lang === 'bg' ? 'Табло' : 'Dashboard'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <button onClick={() => setSelected(null)} className="hover:text-foreground transition-colors">
            {lang === 'bg' ? 'Индустрии' : 'Industries'}
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{lang === 'bg' ? ind.nameBg : ind.nameEn}</span>
        </nav>

        <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" /> {lang === 'bg' ? 'Всички индустрии' : 'All Industries'}
        </Button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl">{ind.icon}</span>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {lang === 'bg' ? ind.nameBg : ind.nameEn}
            </h1>
            <div className="flex flex-wrap gap-2 mt-1">
              {(lang === 'bg' ? ind.technologiesBg : ind.technologiesEn).map(t => (
                <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {/* 1 — Overview */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-base font-display font-semibold text-foreground mb-2">
              <Globe className="h-4 w-4 text-primary" />
              {lang === 'bg' ? 'Преглед на индустрията' : 'Industry Overview'}
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {lang === 'bg' ? ind.overviewBg : ind.overviewEn}
            </p>
          </section>

          {/* 2 — Digital Disruption */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-base font-display font-semibold text-foreground mb-2">
              <Cpu className="h-4 w-4 text-primary" />
              {lang === 'bg' ? 'Дигитална трансформация' : 'Digital Disruption'}
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {lang === 'bg' ? ind.disruptionBg : ind.disruptionEn}
            </p>
          </section>

          {/* 3 — Key Problems */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-base font-display font-semibold text-foreground mb-2">
              <AlertTriangle className="h-4 w-4 text-[hsl(var(--sim-warning))]" />
              {lang === 'bg' ? 'Ключови проблеми' : 'Key Problems'}
            </h2>
            <ul className="space-y-2">
              {(lang === 'bg' ? ind.problemsBg : ind.problemsEn).map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[hsl(var(--sim-warning))] shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </section>

          {/* 4 — Innovation Opportunities */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-base font-display font-semibold text-foreground mb-2">
              <Lightbulb className="h-4 w-4 text-[hsl(var(--sim-success))]" />
              {lang === 'bg' ? 'Иновационни възможности' : 'Innovation Opportunities'}
            </h2>
            <ul className="space-y-2">
              {(lang === 'bg' ? ind.opportunitiesBg : ind.opportunitiesEn).map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <Check className="h-4 w-4 text-[hsl(var(--sim-success))] shrink-0 mt-0.5" />
                  {o}
                </li>
              ))}
            </ul>
          </section>

          {/* 5 — Startup Ideas */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-base font-display font-semibold text-foreground mb-3">
              <Rocket className="h-4 w-4 text-primary" />
              {lang === 'bg' ? 'Примерни стартъп идеи' : 'Example Startup Ideas'}
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {(lang === 'bg' ? ind.startupIdeasBg : ind.startupIdeasEn).map((idea, i) => (
                <div key={i} className="rounded-lg border border-border bg-accent/30 p-3">
                  <h4 className="text-sm font-semibold text-foreground mb-1">{idea.name}</h4>
                  <p className="text-xs text-muted-foreground">{idea.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CTA */}
        {user && (
          <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="text-base font-display font-semibold text-foreground">
                {lang === 'bg'
                  ? 'Искате да създадете стартъп в тази индустрия?'
                  : 'Want to build a startup in this industry?'}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {lang === 'bg'
                  ? 'Свържи тази индустрия с твоя стартъп проект и започни да работиш по идеята си.'
                  : 'Link this industry to your startup project and start building your idea.'}
              </p>
            </div>
            <Button onClick={() => chooseIndustry(ind)} className="shrink-0">
              <Rocket className="h-4 w-4 mr-1.5" />
              {lang === 'bg' ? 'Избери тази индустрия' : 'Choose This Industry'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
