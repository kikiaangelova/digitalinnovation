import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  xp: number;
  rank: number;
}

interface LeaderboardProps {
  lang: 'en' | 'bg';
  currentUserId?: string;
  limit?: number;
  showTitle?: boolean;
}

const RANK_STYLES = [
  { icon: Trophy, gradient: 'gradient-designer', text: 'text-[hsl(var(--sim-warning))]' },
  { icon: Medal, gradient: 'bg-muted', text: 'text-muted-foreground' },
  { icon: Award, gradient: 'gradient-builder', text: 'text-sim-success' },
];

export default function Leaderboard({ lang, currentUserId, limit = 10, showTitle = true }: LeaderboardProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const [profRes, subsRes, simRes, projRes, progressRes] = await Promise.all([
          supabase.from('profiles').select('user_id, full_name, leaderboard_visible'),
          supabase.from('submissions').select('user_id, is_draft'),
          supabase.from('simulator_progress').select('user_id, current_week, is_complete'),
          supabase.from('startup_projects').select('user_id, problem, customer, value_proposition, digital_product, business_model, growth_strategy, final_pitch, is_submitted'),
          supabase.from('course_progress').select('user_id, metadata').eq('module', 'case_study').eq('status', 'completed'),
        ]);

        const profiles = (profRes.data || []).filter((p: any) => p.leaderboard_visible === true);
        const subs = subsRes.data || [];
        const sims = simRes.data || [];
        const projs = projRes.data || [];
        const progressData = progressRes.data || [];

        // Build per-user case XP map from course_progress metadata
        const userCaseXp: Record<string, number> = {};
        progressData.forEach((row: any) => {
          const meta = row.metadata as any;
          const xpVal = meta?.xp_awarded || 50;
          userCaseXp[row.user_id] = (userCaseXp[row.user_id] || 0) + xpVal;
        });

        const startupSections = ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model', 'growth_strategy', 'final_pitch'];

        const board: LeaderboardEntry[] = profiles.map((p: any) => {
          const sim = sims.find((s: any) => s.user_id === p.user_id);
          const proj = projs.find((pr: any) => pr.user_id === p.user_id);

          const startupFilled = proj
            ? startupSections.filter(s => ((proj as any)[s] || '').trim().length > 20).length
            : 0;

          const xp =
            (userCaseXp[p.user_id] || 0) +
            ((sim?.current_week || 1) - 1) * 100 + (sim?.is_complete ? 100 : 0) +
            startupFilled * 75 +
            (proj?.is_submitted ? 200 : 0);

          return { user_id: p.user_id, full_name: p.full_name || 'Student', xp, rank: 0 };
        });

        board.sort((a, b) => b.xp - a.xp);
        board.forEach((e, i) => { e.rank = i + 1; });

        setEntries(board.slice(0, limit));
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [limit]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="animate-pulse text-center text-sm text-muted-foreground py-4">{t('Loading...', 'Зареждане...')}</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {showTitle && (
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-sim-warning" />
          <h2 className="text-lg font-display font-semibold text-foreground">{t('Leaderboard', 'Класация')}</h2>
        </div>
      )}
      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">{t('No data yet', 'Няма данни')}</p>
        ) : (
          entries.map(e => {
            const isMe = e.user_id === currentUserId;
            const rankStyle = e.rank <= 3 ? RANK_STYLES[e.rank - 1] : null;
            const RankIcon = rankStyle?.icon;

            return (
              <div
                key={e.user_id}
                className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${isMe ? 'bg-accent border border-primary/20' : 'bg-muted/30'}`}
              >
                {RankIcon ? (
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${rankStyle.gradient} shrink-0`}>
                    <RankIcon className={`h-4 w-4 ${e.rank === 1 ? 'text-primary-foreground' : e.rank === 3 ? 'text-primary-foreground' : 'text-foreground'}`} />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                    <span className="text-xs font-bold text-muted-foreground">{e.rank}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isMe ? 'text-primary' : 'text-foreground'}`}>
                    {e.full_name} {isMe && <span className="text-xs text-primary">({t('You', 'Ти')})</span>}
                  </p>
                </div>
                <span className="text-xs font-bold text-sim-warning shrink-0">{e.xp} XP</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
