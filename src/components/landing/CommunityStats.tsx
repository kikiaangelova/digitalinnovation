import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentLevel } from '@/components/dashboard/LevelCard';
import { Users, Trophy, Zap, Crown, Medal, Award } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface LeaderEntry {
  user_id: string;
  display_name: string;
  xp: number;
  level: ReturnType<typeof getCurrentLevel>;
}

const RANK_ICONS = [Crown, Medal, Award];
const RANK_COLORS = [
  'text-[hsl(var(--sim-warning))]',
  'text-muted-foreground',
  'text-primary',
];

function formatName(fullName: string | null): string {
  if (!fullName) return 'Student';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

interface Props {
  lang: 'en' | 'bg';
}

export default function CommunityStats({ lang }: Props) {
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use RPC to get count (bypasses RLS for unauthenticated users)
        const countRes = await supabase.rpc('get_registered_user_count');
        if (countRes.data != null) {
          setUserCount(countRes.data as number);
        }

        // Use RPC to get leaderboard (bypasses RLS)
        const { data: lbData } = await supabase.rpc('get_leaderboard', { _limit: 5 });
        
        const board: LeaderEntry[] = (lbData || []).map((row: any) => ({
          user_id: row.user_id,
          display_name: row.display_name || 'Student',
          xp: row.total_xp || 0,
          level: getCurrentLevel(row.total_xp || 0),
        }));

        setLeaders(board);
      } catch (err) {
        console.error('CommunityStats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  const hasLeaders = leaders.length > 0 && leaders.some(l => l.xp > 0);

  return (
    <section className="py-20 px-4 border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Community Counter */}
          <div className="rounded-2xl border border-border bg-card p-8 text-center flex flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl sim-gradient shadow-lg mb-5">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {t('Join the Community of Digital Innovators', 'Присъедини се към общността на дигиталните иноватори')}
            </h3>
            <p className="text-5xl font-display font-bold text-foreground mb-2">
              {userCount != null && userCount > 0 ? userCount : null}
              {userCount === 0 || userCount == null ? (
                <span className="text-lg">{t('Community is growing...', 'Общността расте...')}</span>
              ) : null}
            </p>
            {userCount != null && userCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {t('Registered students', 'Регистрирани студенти')}
              </p>
            )}
          </div>

          {/* Top 5 Leaderboard */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Trophy className="h-5 w-5 text-primary" />
              <h3 className="font-display font-bold text-foreground">
                {t('Top Innovators', 'Топ иноватори')}
              </h3>
            </div>

            {hasLeaders ? (
              <div className="space-y-2.5">
                {leaders.map((entry, i) => {
                  const RankIcon = i < 3 ? RANK_ICONS[i] : null;
                  const initials = entry.display_name
                    .split(' ')
                    .map(w => w[0])
                    .join('')
                    .toUpperCase();

                  return (
                    <div
                      key={entry.user_id}
                      className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                        i === 0
                          ? 'bg-[hsl(var(--sim-warning))]/5 border border-[hsl(var(--sim-warning))]/20'
                          : 'border border-border hover:border-primary/20'
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex h-8 w-8 items-center justify-center shrink-0">
                        {RankIcon ? (
                          <RankIcon className={`h-5 w-5 ${RANK_COLORS[i]}`} />
                        ) : (
                          <span className="text-sm font-bold text-muted-foreground font-mono">
                            {i + 1}
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className={`${entry.level.gradient} text-primary-foreground text-xs font-bold`}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* Name & Level */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {entry.display_name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {t('Level', 'Ниво')} {entry.level.level}
                        </p>
                      </div>

                      {/* XP */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Zap className="h-3.5 w-3.5 text-[hsl(var(--sim-warning))]" />
                        <span className="text-sm font-bold font-mono text-[hsl(var(--sim-warning))]">
                          {entry.xp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {t(
                    'No rankings yet. Be the first to earn XP!',
                    'Все още няма класиране. Бъди първият!'
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
