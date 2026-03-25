import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Play, Clock, Users, Target, Lightbulb, ListChecks,
  FileText, CheckSquare, ArrowRight, ChevronRight,
  BarChart3, TrendingUp, LineChart, Brain, Shield, Rocket, Zap
} from 'lucide-react';

const weekIcons = [Target, Rocket, Zap, TrendingUp, Brain, Shield, BarChart3, LineChart];

export default function SimulatorPreview() {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const handleStart = () => {
    if (user) navigate('/simulator');
    else navigate('/auth?redirect=/simulator');
  };

  const activities = [t.simPrevAct1, t.simPrevAct2, t.simPrevAct3, t.simPrevAct4, t.simPrevAct5];
  const weeks = [t.simWeek1, t.simWeek2, t.simWeek3, t.simWeek4, t.simWeek5, t.simWeek6];
  const kpis = [
    { icon: Users, label: t.simKpiUsers },
    { icon: TrendingUp, label: t.simKpiRevenue },
    { icon: BarChart3, label: t.simKpiRetention },
    { icon: Target, label: t.simKpiConversion },
    { icon: LineChart, label: t.simKpiGrowth },
  ];
  const deliverables = [t.simPrevDeliv1, t.simPrevDeliv2, t.simPrevDeliv3];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">{t.appName}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{t.businessSimulator}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent">
              <Play className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="outline" className="text-xs">{t.simPrevType}</Badge>
          </div>
           <h1 className="typo-h1 mb-3">{t.businessSimulator}</h1>
          <p className="typo-helper leading-relaxed">{t.simPrevDesc}</p>
        </div>

        {/* Info badges */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Clock className="h-3.5 w-3.5 mr-1.5" /> {t.simPrevDuration}
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Users className="h-3.5 w-3.5 mr-1.5" /> {t.prevWorkType}
          </Badge>
        </div>

        <Separator className="mb-8" />

        {/* What students will do */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h2 className="typo-h2">{t.simPrevWhatTitle}</h2>
          </div>
          <Card className="p-5 border-border">
            <ul className="space-y-2">
              {activities.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold">•</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Structure */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">{t.simStructureTitle}</h2>
          </div>
          <Card className="p-5 border-border">
            <div className="space-y-2.5">
              {weeks.map((w, i) => {
                const Icon = weekIcons[i];
                return (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 shrink-0">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">{t.simWeekLabel} {i + 1}</span> — {w}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        {/* KPI Dashboard */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">{t.simPrevKpiTitle}</h2>
          </div>
          <Card className="p-5 border-border">
            <p className="text-sm text-foreground/80 mb-4">{t.simKpiTitle}</p>
            <div className="flex flex-wrap gap-2">
              {kpis.map((kpi, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 text-sm font-medium text-foreground/80">
                  <kpi.icon className="h-4 w-4 text-primary" />
                  {kpi.label}
                </span>
              ))}
            </div>
          </Card>
        </section>

        {/* Deliverables */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">{t.prevDeliverables}</h2>
          </div>
          <Card className="p-5 border-border">
            <p className="text-sm font-medium text-foreground/80 mb-3">{t.simPrevDelivIntro}</p>
            <ul className="space-y-2">
              {deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Start Button */}
        <Button size="lg" className="w-full sim-gradient border-0 text-base font-semibold py-6" onClick={handleStart}>
          {t.simStartButton} <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
