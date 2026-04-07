import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useProgress } from '@/context/ProgressContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { LEARNING_MODULES, LEVEL_1_MODULES, LEVEL_2_MODULES, LEVEL_INFO } from '@/data/learning-modules';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle2, ArrowRight, Brain, Target, Lightbulb, Rocket, Lock, Unlock, TrendingUp } from 'lucide-react';

export default function LearningModules() {
  const { user } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [dbModules, setDbModules] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) { navigate('/auth?redirect=/learn'); return; }
    supabase.from('learning_module_responses').select('*').eq('user_id', user.id)
      .then(({ data }) => {
        const map: Record<string, any> = {};
        (data || []).forEach((r: any) => { map[r.module_id] = r; });
        setResponses(map);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    supabase.from('learning_modules').select('id, slug').then(({ data }) => {
      const map: Record<string, string> = {};
      (data || []).forEach((m: any) => { map[m.slug] = m.id; });
      setDbModules(map);
    });
  }, []);

  // Map responses by slug
  const responseBySlug: Record<string, any> = {};
  Object.values(responses).forEach((r: any) => {
    const slug = Object.entries(dbModules).find(([, id]) => id === r.module_id)?.[0];
    if (slug) responseBySlug[slug] = r;
  });

  // Level completion
  const level1Completed = LEVEL_1_MODULES.filter(m => responseBySlug[m.slug]?.completed_at).length;
  const level1Total = LEVEL_1_MODULES.length;
  const level1Done = level1Completed === level1Total;

  const level2Completed = LEVEL_2_MODULES.filter(m => responseBySlug[m.slug]?.completed_at).length;
  const level2Total = LEVEL_2_MODULES.length;
  const level2Unlocked = level1Done;

  const completedCount = level1Completed + level2Completed;
  const totalModules = LEARNING_MODULES.length;
  const overallPct = Math.round((completedCount / totalModules) * 100);

  // Aggregate scores
  const avgScores = { concept: 0, analytical: 0, strategic: 0, application: 0 };
  const scored = Object.values(responseBySlug).filter((r: any) => r.completed_at);
  if (scored.length > 0) {
    scored.forEach((r: any) => {
      avgScores.concept += r.concept_score || 0;
      avgScores.analytical += r.analytical_score || 0;
      avgScores.strategic += r.strategic_score || 0;
      avgScores.application += r.application_score || 0;
    });
    avgScores.concept = Math.round(avgScores.concept / scored.length);
    avgScores.analytical = Math.round(avgScores.analytical / scored.length);
    avgScores.strategic = Math.round(avgScores.strategic / scored.length);
    avgScores.application = Math.round(avgScores.application / scored.length);
  }

  const outcomeCategories = [
    { key: 'concept', en: 'Concept Understanding', bg: 'Разбиране на концепции', icon: Brain, score: avgScores.concept },
    { key: 'analytical', en: 'Analytical Thinking', bg: 'Аналитично мислене', icon: Target, score: avgScores.analytical },
    { key: 'strategic', en: 'Strategic Reasoning', bg: 'Стратегическо мислене', icon: Lightbulb, score: avgScores.strategic },
    { key: 'application', en: 'Startup Application', bg: 'Приложение в стартъп', icon: Rocket, score: avgScores.application },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">{t('Loading...', 'Зареждане...')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="typo-h1 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            {t('Learning Modules', 'Учебни модули')}
          </h1>
          <p className="typo-helper mt-1">
            {t('Master key concepts in digital innovation and entrepreneurship', 'Овладейте ключови концепции в дигиталните иновации и предприемачеството')}
          </p>
        </div>

        {/* Overall Progress */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">{t('Overall Progress', 'Общ напредък')}</span>
            <Badge variant="outline">{completedCount}/{totalModules} {t('completed', 'завършени')}</Badge>
          </div>
          <Progress value={overallPct} className="h-2 mb-4" />

          {scored.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {outcomeCategories.map(cat => (
                <div key={cat.key} className="rounded-lg bg-accent/50 p-3 text-center">
                  <cat.icon className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{cat.score}%</p>
                  <p className="text-xs text-muted-foreground">{t(cat.en, cat.bg)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Level 1 */}
        <LevelSection
          levelNum={1}
          modules={LEVEL_1_MODULES}
          responseBySlug={responseBySlug}
          completedCount={level1Completed}
          totalCount={level1Total}
          unlocked={true}
          lang={lang}
          t={t}
          navigate={navigate}
        />

        {/* Level 2 */}
        <LevelSection
          levelNum={2}
          modules={LEVEL_2_MODULES}
          responseBySlug={responseBySlug}
          completedCount={level2Completed}
          totalCount={level2Total}
          unlocked={level2Unlocked}
          lang={lang}
          t={t}
          navigate={navigate}
          unlockMessage={
            !level2Unlocked
              ? t(
                  `Complete all ${level1Total} Level 1 modules to unlock (${level1Completed}/${level1Total} done)`,
                  `Завършете всичките ${level1Total} модула от Ниво 1 за отключване (${level1Completed}/${level1Total} готови)`
                )
              : undefined
          }
        />
      </main>
    </div>
  );
}

/* ── Level Section Component ── */

interface LevelSectionProps {
  levelNum: number;
  modules: typeof LEARNING_MODULES;
  responseBySlug: Record<string, any>;
  completedCount: number;
  totalCount: number;
  unlocked: boolean;
  lang: string;
  t: (en: string, bg: string) => string;
  navigate: (path: string) => void;
  unlockMessage?: string;
}

function LevelSection({ levelNum, modules, responseBySlug, completedCount, totalCount, unlocked, lang, t, navigate, unlockMessage }: LevelSectionProps) {
  const info = LEVEL_INFO[levelNum as keyof typeof LEVEL_INFO];
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isDone = completedCount === totalCount;

  return (
    <div className={`rounded-xl border-2 ${unlocked ? (isDone ? 'border-primary/40' : 'border-border') : 'border-border/50'} bg-card overflow-hidden`}>
      {/* Level Header */}
      <div className={`p-5 ${unlocked ? '' : 'opacity-60'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${unlocked ? 'sim-gradient' : 'bg-muted'}`}>
              {unlocked ? (
                isDone ? <CheckCircle2 className="h-5 w-5 text-primary-foreground" /> : <BookOpen className="h-5 w-5 text-primary-foreground" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">
                  {t('Level', 'Ниво')} {levelNum}: {lang === 'bg' ? info.bg : info.en}
                </h2>
                {isDone && unlocked && (
                  <Badge className="bg-primary/15 text-primary border-0 text-xs">
                    {t('Complete', 'Завършено')} ✓
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {lang === 'bg' ? info.desc_bg : info.desc_en}
              </p>
            </div>
          </div>
          {unlocked && (
            <span className="text-sm font-semibold text-muted-foreground">{completedCount}/{totalCount}</span>
          )}
        </div>
        {unlocked && (
          <Progress value={pct} className="h-1.5" />
        )}
        {unlockMessage && (
          <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-accent/50 border border-border">
            <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">{unlockMessage}</p>
          </div>
        )}
      </div>

      {/* Module cards */}
      {unlocked && (
        <div className="px-5 pb-5 space-y-2">
          {modules.map((mod, idx) => {
            const resp = responseBySlug[mod.slug];
            const isCompleted = resp?.completed_at;
            return (
              <div
                key={mod.slug}
                className={`rounded-lg border bg-background p-4 flex items-center justify-between gap-4 transition-colors hover:border-primary/40 cursor-pointer ${isCompleted ? 'border-primary/30' : 'border-border'}`}
                onClick={() => navigate(`/learn/${mod.slug}`)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isCompleted ? 'bg-primary/20' : 'bg-accent'}`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">{idx + 1}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{lang === 'bg' ? mod.title_bg : mod.title_en}</h3>
                    <p className="text-xs text-muted-foreground">
                      {mod.quiz_questions.length} {t('quiz questions', 'въпроса')} • {t('1 analytical', '1 аналитичен')} • {t('1 application', '1 приложение')}
                    </p>
                    {isCompleted && resp && (
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{t('Quiz', 'Тест')}: {resp.quiz_score}/{resp.quiz_max}</Badge>
                        <Badge variant="outline" className="text-xs">{t('Concept', 'Концепция')}: {resp.concept_score}%</Badge>
                      </div>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
