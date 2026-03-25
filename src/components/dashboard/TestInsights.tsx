import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Brain, TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TestInsightsProps {
  lang: string;
  userId: string | undefined;
}

interface Stats {
  count: number;
  avg: number;
  best: number;
  lastScore: number | null;
  strongCategory: string | null;
  weakCategory: string | null;
  improving: boolean;
  recommendedNextTest: string | null;
}

export default function TestInsights({ lang, userId }: TestInsightsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data } = await supabase
        .from('quiz_results')
        .select('score, category, created_at')
        .eq('user_id', userId)
        .eq('quiz_type', 'dictionary')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!data || data.length === 0) return;

      const avg = Math.round(data.reduce((s, r) => s + r.score, 0) / data.length);
      const best = Math.max(...data.map(r => r.score));
      const lastScore = data[0]?.score ?? null;

      // Category analysis
      const catScores: Record<string, { total: number; count: number }> = {};
      data.forEach(r => {
        const cat = r.category || 'All';
        if (!catScores[cat]) catScores[cat] = { total: 0, count: 0 };
        catScores[cat].total += r.score;
        catScores[cat].count++;
      });

      let strongCategory: string | null = null;
      let weakCategory: string | null = null;
      let highAvg = 0;
      let lowAvg = 101;
      Object.entries(catScores).forEach(([cat, { total, count }]) => {
        if (cat === 'All') return;
        const catAvg = total / count;
        if (catAvg > highAvg) { highAvg = catAvg; strongCategory = cat; }
        if (catAvg < lowAvg) { lowAvg = catAvg; weakCategory = cat; }
      });

      // Check improvement trend (last 3 vs previous 3)
      let improving = false;
      if (data.length >= 4) {
        const recent = data.slice(0, 3).reduce((s, r) => s + r.score, 0) / 3;
        const older = data.slice(3, 6).reduce((s, r) => s + r.score, 0) / Math.min(3, data.length - 3);
        improving = recent > older;
      }

      setStats({ count: data.length, avg, best, lastScore, strongCategory, weakCategory, improving });
    })();
  }, [userId]);

  if (!stats || stats.count === 0) return null;

  const catTranslations: Record<string, string> = {
    Marketing: 'Маркетинг',
    'Pricing & Revenue': 'Ценообразуване',
    'Team & Roles': 'Екип и роли',
    Operations: 'Операции',
    'Supply Chain': 'Верига на доставки',
  };

  return (
    <div className="dash-section">
      <div className="flex items-center justify-between mb-3">
        <h3 className="typo-card-title flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          {t('Test Learning Insights', 'Анализ на тестовете')}
        </h3>
        <Button variant="outline" size="sm" onClick={() => navigate('/dictionary')}>
          {t('Take Test', 'Направи тест')}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        <div className="rounded-lg bg-accent/50 p-2.5 text-center">
          <p className="text-lg font-bold text-foreground">{stats.count}</p>
          <p className="text-[10px] text-muted-foreground uppercase">{t('Tests', 'Тестове')}</p>
        </div>
        <div className="rounded-lg bg-accent/50 p-2.5 text-center">
          <p className="text-lg font-bold text-foreground">{stats.avg}%</p>
          <p className="text-[10px] text-muted-foreground uppercase">{t('Average', 'Среден')}</p>
        </div>
        <div className="rounded-lg bg-accent/50 p-2.5 text-center">
          <p className="text-lg font-bold text-foreground">{stats.best}%</p>
          <p className="text-[10px] text-muted-foreground uppercase">{t('Best', 'Най-добър')}</p>
        </div>
        <div className="rounded-lg bg-accent/50 p-2.5 text-center">
          <div className="flex items-center justify-center gap-1">
            {stats.improving ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : (
              <Target className="h-4 w-4 text-amber-500" />
            )}
            <p className="text-xs font-bold text-foreground">
              {stats.improving ? t('Improving', 'Подобрява се') : t('Steady', 'Стабилно')}
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase">{t('Trend', 'Тенденция')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {stats.strongCategory && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-2">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{t('Strongest', 'Най-силна')}</p>
              <p className="text-xs font-semibold text-foreground">
                {lang === 'bg' ? (catTranslations[stats.strongCategory] || stats.strongCategory) : stats.strongCategory}
              </p>
            </div>
          </div>
        )}
        {stats.weakCategory && (
          <div className="flex items-center gap-2 rounded-lg bg-amber-500/5 border border-amber-500/10 p-2">
            <TrendingDown className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{t('Needs Work', 'За подобрение')}</p>
              <p className="text-xs font-semibold text-foreground">
                {lang === 'bg' ? (catTranslations[stats.weakCategory] || stats.weakCategory) : stats.weakCategory}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
