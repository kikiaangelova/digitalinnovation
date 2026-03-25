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
  { icon: Trophy, gradient: 'bg-rank-gold', text: 'text-rank-gold' },
  { icon: Medal, gradient: 'bg-rank-silver', text: 'text-rank-silver' },
  { icon: Award, gradient: 'bg-rank-bronze', text: 'text-rank-bronze' },
];

type Tab = 'weekly' | 'alltime';

export default function Leaderboard({ lang, currentUserId, limit = 10, showTitle = true }: LeaderboardProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [tab, setTab] = useState<Tab>('weekly');
  const [allTimeEntries, setAllTimeEntries] = useState<LeaderboardEntry[]>([]);
  const [weeklyEntries, setWeeklyEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoth = async () => {
      setLoading(true);
      try {
        const [allRes, weekRes] = await Promise.all([
          supabase.rpc('get_leaderboard', { _limit: limit }),
          supabase.rpc('get_weekly_leaderboard' as any, { _limit: limit }),
        ]);

        const mapEntries = (data: any[]) =>
          (data || []).map((row: any, i: number) => ({
            user_id: row.user_id,
            full_name: row.display_name || t('Student', 'Студент'),
            xp: row.total_xp || 0,
            rank: i + 1,
          }));

        setAllTimeEntries(mapEntries(allRes.data));
        setWeeklyEntries(mapEntries(weekRes.data));
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoth();
  }, [limit]);

  const entries = tab === 'weekly' ? weeklyEntries : allTimeEntries;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {showTitle && (
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-5 w-5 text-sim-warning" />
          <h2 className="text-lg font-display font-semibold text-foreground">{t('Leaderboard', 'Класация')}</h2>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 rounded-lg bg-muted p-1">
        <button
          onClick={() => setTab('weekly')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            tab === 'weekly'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          🏆 {t('This Week', 'Тази седмица')}
        </button>
        <button
          onClick={() => setTab('alltime')}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            tab === 'alltime'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('All Time', 'Всички времена')}
        </button>
      </div>

      <p className="text-[10px] text-muted-foreground mb-3 italic">
        {t('The leaderboard shows display names only to protect privacy', 'Класацията показва само псевдоними за защита на личните данни')}
      </p>

      {loading ? (
        <div className="animate-pulse text-center text-sm text-muted-foreground py-4">{t('Loading...', 'Зареждане...')}</div>
      ) : (
        <div className="space-y-2">
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {tab === 'weekly'
                ? t('No XP earned this week yet — be the first!', 'Все още няма спечелени XP тази седмица — бъди първият!')
                : t('No data yet', 'Няма данни')}
            </p>
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
                      <RankIcon className={`h-4 w-4 text-white`} />
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
                  <span className="text-xs font-bold text-xp-gold shrink-0">{e.xp} XP</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
