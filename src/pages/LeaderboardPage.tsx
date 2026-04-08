import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import AppHeader from '@/components/layout/AppHeader';
import { getCurrentLevel } from '@/components/dashboard/LevelCard';
import { Trophy, Medal, Award, Zap } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import PhaseBadge from '@/components/ui/phase-badge';

interface Entry {
  user_id: string;
  full_name: string;
  xp: number;
  level: ReturnType<typeof getCurrentLevel>;
  rank: number;
}

const RANK_ICONS = [Trophy, Medal, Award];
const RANK_COLORS = ['text-rank-gold', 'text-rank-silver', 'text-rank-bronze'];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profiles directly to get real names + XP for all users
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('user_id, full_name, display_name, total_xp')
          .gt('total_xp', 0)
          .order('total_xp', { ascending: false })
          .limit(100);
        if (profileErr) throw profileErr;
        const data = (profileData || []).map(p => ({
          user_id: p.user_id,
          display_name: p.full_name || p.display_name || t('Student', 'Студент'),
          total_xp: p.total_xp,
        }));

        const board: Entry[] = (data || []).map((row: any, i: number) => ({
          user_id: row.user_id,
          full_name: row.display_name || t('Student', 'Студент'),
          xp: row.total_xp || 0,
          level: getCurrentLevel(row.total_xp || 0),
          rank: i + 1,
        }));

        setEntries(board);
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const myEntry = entries.find(e => e.user_id === user?.id);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-rank-gold" />
             <h1 className="typo-h1">
              {t('Leaderboard', 'Класация')}
            </h1>
            <PhaseBadge phase="fun" lang={lang} />
          </div>
          <p className="text-muted-foreground">
            {t(
              'Earn XP by solving cases, building your startup, and completing the simulator.',
              'Спечели XP като решаваш казуси, създаваш стартъп и използваш симулатора.'
            )}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2 italic">
            {t('The leaderboard shows display names only to protect privacy', 'Класацията показва само псевдоними за защита на личните данни')}
          </p>
        </div>

        {/* Current user rank highlight */}
        {!loading && myEntry && (
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full sim-gradient text-primary-foreground font-bold">
                #{myEntry.rank}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {t('Your rank this week', 'Твоята класация тази седмица')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {myEntry.full_name} — {t('Level', 'Ниво')} {myEntry.level.level}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-5 w-5 text-xp-gold" />
              <span className="text-xl font-bold text-xp-gold">{myEntry.xp}</span>
              <span className="text-xs text-muted-foreground">XP</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-muted-foreground animate-pulse">{t('Loading...', 'Зареждане...')}</div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {t(
                'No innovators yet. Be the first to earn XP and appear on the leaderboard.',
                'Все още няма класирани иноватори. Бъди първият.'
              )}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>{t('Student', 'Студент')}</TableHead>
                  <TableHead className="text-right">{t('XP Points', 'XP точки')}</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">{t('Level', 'Ниво')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map(e => {
                  const isMe = e.user_id === user?.id;
                  const RankIcon = e.rank <= 3 ? RANK_ICONS[e.rank - 1] : null;
                  const initials = e.full_name.split(' ').map(w => w[0]).join('').toUpperCase();

                  return (
                    <TableRow key={e.user_id} className={isMe ? 'bg-accent/50' : ''}>
                      <TableCell>
                        {RankIcon ? (
                          <RankIcon className={`h-5 w-5 ${RANK_COLORS[e.rank - 1]}`} />
                        ) : (
                          <span className="text-sm font-bold text-muted-foreground">{e.rank}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={`${e.level.gradient} text-primary-foreground text-xs font-bold`}>
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className={`text-sm font-medium ${isMe ? 'text-primary' : 'text-foreground'}`}>
                              {e.full_name} {isMe && <span className="text-xs text-primary">({t('You', 'Ти')})</span>}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Zap className="h-3 w-3 text-xp-gold" />
                          <span className="font-bold font-mono text-sm text-xp-gold">{e.xp}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {t('Lv', 'Нв')}.{e.level.level} — {e.level.name[lang]}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
