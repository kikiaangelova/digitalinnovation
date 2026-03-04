import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import AppHeader from '@/components/layout/AppHeader';
import { getCurrentLevel } from '@/components/dashboard/LevelCard';
import { Trophy, Medal, Award, Zap } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface Entry {
  user_id: string;
  full_name: string;
  xp: number;
  cases_completed: number;
  sim_week: number;
  sim_complete: boolean;
  level: ReturnType<typeof getCurrentLevel>;
  rank: number;
}

const RANK_ICONS = [Trophy, Medal, Award];
const RANK_COLORS = ['text-[hsl(var(--sim-warning))]', 'text-muted-foreground', 'text-sim-success'];

function formatName(n: string | null) {
  if (!n) return 'Student';
  const p = n.trim().split(/\s+/);
  return p.length === 1 ? p[0] : `${p[0]} ${p[p.length - 1][0]}.`;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [profRes, subsRes, simRes, projRes] = await Promise.all([
        supabase.from('profiles').select('user_id, full_name, leaderboard_visible'),
        supabase.from('submissions').select('user_id, is_draft'),
        supabase.from('simulator_progress').select('user_id, current_week, is_complete'),
        supabase.from('startup_projects').select('user_id, problem, customer, value_proposition, digital_product, business_model, growth_strategy, final_pitch, is_submitted'),
      ]);

      const profiles = (profRes.data || []).filter((p: any) => p.leaderboard_visible === true);
      const subs = subsRes.data || [];
      const sims = simRes.data || [];
      const projs = projRes.data || [];
      const sections = ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model', 'growth_strategy', 'final_pitch'];

      const board: Entry[] = profiles.map((p: any) => {
        const casesCompleted = subs.filter(s => s.user_id === p.user_id && !s.is_draft).length;
        const sim = sims.find(s => s.user_id === p.user_id);
        const proj = projs.find(pr => pr.user_id === p.user_id);
        const startupFilled = proj ? sections.filter(s => ((proj as any)[s] || '').trim().length > 20).length : 0;
        const xp = casesCompleted * 50 + ((sim?.current_week || 1) - 1) * 100 + (sim?.is_complete ? 100 : 0) + startupFilled * 75 + (proj?.is_submitted ? 200 : 0);

        return {
          user_id: p.user_id,
          full_name: formatName(p.full_name),
          xp,
          cases_completed: casesCompleted,
          sim_week: sim?.current_week || 0,
          sim_complete: sim?.is_complete || false,
          level: getCurrentLevel(xp),
          rank: 0,
        };
      });

      board.sort((a, b) => b.xp - a.xp);
      board.forEach((e, i) => { e.rank = i + 1; });
      setEntries(board);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-[hsl(var(--sim-warning))]" />
            <h1 className="text-3xl font-display font-bold text-foreground">
              {t('Leaderboard', 'Класация')}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {t(
              'Earn XP by solving cases, building your startup, and completing the simulator.',
              'Спечели XP като решаваш казуси, създаваш стартъп и използваш симулатора.'
            )}
          </p>
        </div>

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
                  <TableHead className="text-center hidden md:table-cell">{t('Cases', 'Казуси')}</TableHead>
                  <TableHead className="text-center hidden md:table-cell">{t('Simulator', 'Симулатор')}</TableHead>
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
                          <Zap className="h-3 w-3 text-[hsl(var(--sim-warning))]" />
                          <span className="font-bold font-mono text-sm text-[hsl(var(--sim-warning))]">{e.xp}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {t('Lv', 'Нв')}.{e.level.level} — {e.level.name[lang]}
                        </span>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <span className="text-sm font-medium text-foreground">{e.cases_completed}</span>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <span className="text-sm text-foreground">
                          {e.sim_complete ? '✅' : e.sim_week > 0 ? `${t('Week', 'Седм.')} ${e.sim_week}` : '—'}
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
