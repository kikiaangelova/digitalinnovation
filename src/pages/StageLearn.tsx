import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { useProgress } from '@/context/ProgressContext';
import { STAGE_LEARN_CONTENT } from '@/data/stage-learn-content';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MarkdownContent from '@/components/ui/markdown-content';
import {
  BookOpen, Search, Lightbulb, Palette, TrendingUp, Presentation,
  ArrowLeft, ArrowRight, Clock, ChevronRight, Rocket, Lock,
} from 'lucide-react';
import { useEffect } from 'react';

const STAGE_ICONS = [BookOpen, Search, Lightbulb, Palette, TrendingUp, Presentation];

export default function StageLearn() {
  const { stageId } = useParams<{ stageId: string }>();
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const progress = useProgress();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const stageNum = parseInt(stageId || '1', 10);
  const stageData = STAGE_LEARN_CONTENT.find(s => s.stageId === stageNum);
  const Icon = STAGE_ICONS[stageNum - 1] || BookOpen;

  // Stage locking: Stage N requires Stage N-1 completed
  const isStageUnlocked = stageNum === 1 || (
    progress.stageStatuses[stageNum - 2] === 'completed'
  );

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth?redirect=/journey/learn/' + stageNum);
  }, [user, authLoading, navigate, stageNum]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stageNum]);

  if (!stageData) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-muted-foreground">{t('Stage not found', 'Етапът не е намерен')}</p>
          <Button variant="outline" onClick={() => navigate('/journey')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {t('Back to Journey', 'Обратно към пътешествието')}
          </Button>
        </div>
      </div>
    );
  }

  // If stage is locked, show a locked message
  if (!progress.loading && !isStageUnlocked) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            {t('Stage Locked', 'Етапът е заключен')}
          </h2>
          <p className="text-muted-foreground text-center max-w-md">
            {t(
              `Complete Stage ${stageNum - 1} first to unlock this content.`,
              `Завърши Етап ${stageNum - 1} първо, за да отключиш това съдържание.`
            )}
          </p>
          <Button variant="outline" onClick={() => navigate('/journey')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {t('Back to Journey', 'Обратно към пътешествието')}
          </Button>
        </div>
      </div>
    );
  }

  const hasNext = stageNum < 6;
  const hasPrev = stageNum > 1;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/journey" className="hover:text-foreground transition-colors">
            {t('Startup Journey', 'Стартъп пътешествие')}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">
            {t(`Stage ${stageNum}`, `Етап ${stageNum}`)}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl sim-gradient shadow-md">
              <Icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <Badge variant="outline" className="text-xs mb-1">
                {t(`Stage ${stageNum} of 6`, `Етап ${stageNum} от 6`)}
              </Badge>
              <h1 className="typo-h1 text-2xl sm:text-3xl">
                {lang === 'bg' ? stageData.titleBg : stageData.titleEn}
              </h1>
            </div>
          </div>
          <p className="typo-helper leading-relaxed mt-2">
            {lang === 'bg' ? stageData.subtitleBg : stageData.subtitleEn}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              ~{stageData.readMinutes} {t('min read', 'мин. четене')}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {stageData.sections.length} {t('sections', 'секции')}
            </span>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {stageData.sections.map((section, idx) => (
            <section
              key={idx}
              className="rounded-xl border border-border bg-card p-5 sm:p-6"
            >
              <h2 className="typo-h2 text-lg sm:text-xl mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary shrink-0">
                  {idx + 1}
                </span>
                {lang === 'bg' ? section.titleBg : section.titleEn}
              </h2>
              <div className="prose prose-sm max-w-none text-foreground/90">
                <MarkdownContent content={lang === 'bg' ? section.bodyBg : section.bodyEn} />
              </div>
            </section>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-10 pt-6 border-t border-border">
          {hasPrev ? (
            <Button variant="outline" onClick={() => navigate(`/journey/learn/${stageNum - 1}`)}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t(`Stage ${stageNum - 1}`, `Етап ${stageNum - 1}`)}
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate('/journey')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('Back to Journey', 'Обратно към пътешествието')}
            </Button>
          )}

          <Button onClick={() => navigate('/journey')} variant="ghost" size="sm">
            {t('Journey Overview', 'Преглед на пътешествието')}
          </Button>

          {hasNext ? (
            <Button onClick={() => navigate(`/journey/learn/${stageNum + 1}`)}>
              {t(`Stage ${stageNum + 1}`, `Етап ${stageNum + 1}`)}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button className="sim-gradient border-0" onClick={() => navigate('/my-startup')}>
              <Rocket className="h-4 w-4 mr-1" />
              {t('Submit Your Pitch', 'Подай представянето си')}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
