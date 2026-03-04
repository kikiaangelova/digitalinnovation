import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Play, ArrowRight, ChevronDown, ChevronUp,
  BarChart3, Users, TrendingUp, Target, Calendar,
  Zap, Brain, Shield, Rocket, LineChart
} from 'lucide-react';

const weekIcons = [Target, Rocket, Zap, TrendingUp, Brain, Shield, BarChart3, LineChart];

export default function SimulatorCard() {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (user) navigate('/simulator');
    else navigate('/auth?redirect=/simulator');
  };

  const features: string[] = [
    t.simFeature1, t.simFeature2, t.simFeature3,
    t.simFeature4, t.simFeature5, t.simFeature6,
  ];

  const weeks: string[] = [
    t.simWeek1, t.simWeek2, t.simWeek3, t.simWeek4,
    t.simWeek5, t.simWeek6, t.simWeek7, t.simWeek8,
  ];

  const kpis = [
    { icon: Users, label: t.simKpiUsers },
    { icon: TrendingUp, label: t.simKpiRevenue },
    { icon: Target, label: t.simKpiConversion },
    { icon: BarChart3, label: t.simKpiRetention },
    { icon: LineChart, label: t.simKpiGrowth },
  ];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent mx-auto mb-4">
          <Play className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-display font-bold text-lg text-foreground text-center mb-1">
          {t.businessSimulator}
        </h3>
        <p className="text-sm text-primary/80 font-medium text-center mb-3">
          {t.simSubtitle}
        </p>
        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          {t.simDescription}
        </p>
      </div>

      {/* Feature list — always visible */}
      <div className="px-6 pb-4">
        <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-2">
          {t.simInsideTitle}
        </p>
        <ul className="space-y-1.5">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5">•</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expandable section */}
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-center gap-1 py-2.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors border-t border-border/50 bg-accent/30">
            {expanded ? t.simShowLess : t.simLearnMore}
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 py-5 space-y-6 border-t border-border/50 bg-accent/10">
            {/* Weekly structure */}
            <div>
              <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-3">
                {t.simStructureTitle}
              </p>
              <div className="grid gap-2">
                {weeks.map((w, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 shrink-0">
                      {(() => { const Icon = weekIcons[i]; return <Icon className="h-3.5 w-3.5 text-primary" />; })()}
                    </div>
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">{t.simWeekLabel} {i + 1}</span> — {w}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI dashboard preview */}
            <div>
              <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-3">
                {t.simKpiTitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {kpis.map((kpi, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-foreground/80">
                    <kpi.icon className="h-3 w-3 text-primary" />
                    {kpi.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* CTA Button */}
      <div className="p-5 pt-3 border-t border-border/50">
        <Button
          size="lg"
          className="w-full sim-gradient border-0 text-base font-semibold"
          onClick={handleClick}
        >
          {t.simStartButton} <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
