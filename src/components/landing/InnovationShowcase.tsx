import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentLevel } from '@/components/dashboard/LevelCard';
import { Trophy, Medal, Award, Zap, Rocket, ArrowRight, Sparkles, Factory } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface InnovatorEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  xp: number;
  cases_completed: number;
  level: { level: number; name: { en: string; bg: string }; gradient: string };
}

interface StartupEntry {
  id: string;
  founder_name: string;
  industry: string;
  problem: string;
  value_proposition: string;
  score: number;
  sections_filled: number;
}

const RANK_ICONS = [Trophy, Medal, Award];
const RANK_GRADIENTS = ['gradient-designer', 'bg-muted', 'gradient-builder'];

const INDUSTRY_ICONS: Record<string, typeof Factory> = {};

function formatName(fullName: string | null): string {
  if (!fullName) return 'Student';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

interface Props {
  lang: 'en' | 'bg';
}

export default function InnovationShowcase({ lang }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const navigate = useNavigate();
  const [innovators, setInnovators] = useState<InnovatorEntry[]>([]);
  const [startups, setStartups] = useState<StartupEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        const [lbRes, projRes, profRes] = await Promise.all([
          supabase.rpc('get_leaderboard', { _limit: 3 }),
          supabase.from('startup_projects').select('id, user_id, problem, customer, value_proposition, digital_product, business_model, growth_strategy, final_pitch, is_submitted, industry'),
          supabase.from('profiles').select('user_id, full_name, leaderboard_visible'),
        ]);

        const projs = projRes.data || [];
        const allProfiles = profRes.data || [];
        const startupSections = ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model', 'growth_strategy', 'final_pitch'];

        // Build innovators from leaderboard RPC
        const board: InnovatorEntry[] = (lbRes.data || []).map((row: any) => ({
          user_id: row.user_id,
          display_name: row.display_name || 'Student',
          avatar_url: null,
          xp: row.total_xp || 0,
          cases_completed: 0,
          level: getCurrentLevel(row.total_xp || 0),
        }));

      setInnovators(board.slice(0, 3));

      // Build startup rankings
      const startupBoard: StartupEntry[] = projs
        .filter((p: any) => p.is_submitted)
        .map((p: any) => {
          const filled = startupSections.filter(s => ((p as any)[s] || '').trim().length > 20).length;
          const founderProfile = allProfiles.find((pr: any) => pr.user_id === p.user_id);
          const founderVisible = founderProfile && (founderProfile as any).leaderboard_visible;
          return {
            id: p.id,
            founder_name: founderVisible ? formatName((founderProfile as any)?.full_name) : t('Anonymous', 'Анонимен'),
            industry: p.industry || t('Technology', 'Технологии'),
            problem: p.problem || '',
            value_proposition: p.value_proposition || '',
            score: Math.round((filled / startupSections.length) * 100),
            sections_filled: filled,
          };
        });

      startupBoard.sort((a, b) => b.score - a.score);
      setStartups(startupBoard.slice(0, 3));
      setLoading(false);
    };

    fetchData();
    // Cache: re-fetch every 5 min
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <>
        <section className="py-20 px-4 border-t border-border bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="animate-pulse text-muted-foreground py-8">{t('Loading...', 'Зареждане...')}</div>
          </div>
        </section>
      </>
    );
  }

  const hasInnovators = innovators.length > 0;
  const hasStartups = startups.length > 0;

  return (
    <>
      {/* ═══════════ TOP INNOVATORS ═══════════ */}
      <section className="py-20 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1">
              <Trophy className="h-3 w-3 text-primary" />
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                {t('Innovation Showcase', 'Витрина на иновациите')}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">
              {t('Top Innovators', 'Най-добрите иноватори')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t(
                'Earn XP by solving cases, building your startup, and completing the simulator.',
                'Спечели XP като решаваш казуси, създаваш стартъп и използваш симулатора.'
              )}
            </p>
          </div>

          {hasInnovators ? (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                {innovators.map((inv, i) => {
                  const RankIcon = RANK_ICONS[i] || Award;
                  const initials = inv.display_name.split(' ').map(w => w[0]).join('').toUpperCase();
                  return (
                    <div key={inv.user_id} className="group rounded-2xl border border-border bg-card p-6 text-center hover:border-primary/40 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                      {/* Rank badge */}
                      <div className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full ${RANK_GRADIENTS[i]} shadow-md`}>
                        <RankIcon className={`h-4 w-4 ${i === 0 ? 'text-primary-foreground' : i === 1 ? 'text-foreground' : 'text-primary-foreground'}`} />
                      </div>

                      <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-primary/20">
                        <AvatarFallback className={`${inv.level.gradient} text-primary-foreground font-bold text-lg`}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <h3 className="font-display font-bold text-foreground text-base mb-1">{inv.display_name}</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        {t('Level', 'Ниво')} {inv.level.level} — {inv.level.name[lang]}
                      </p>

                      <div className="flex items-center justify-center gap-1.5">
                        <Zap className="h-4 w-4 text-[hsl(var(--sim-warning))]" />
                        <span className="text-lg font-bold font-mono text-[hsl(var(--sim-warning))]">{inv.xp}</span>
                        <span className="text-xs text-muted-foreground">{t('XP Points', 'XP точки')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-8">
                <Button variant="outline" onClick={() => navigate('/leaderboard')}>
                  {t('View Full Leaderboard', 'Виж цялата класация')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {t(
                  'No innovators yet. Be the first to earn XP and appear on the leaderboard.',
                  'Все още няма класирани иноватори. Бъди първият.'
                )}
              </p>
              <Button className="sim-gradient border-0" onClick={() => navigate('/auth?mode=signup')}>
                {t('Start Learning', 'Започни да учиш')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ TOP STARTUP IDEAS ═══════════ */}
      {hasStartups && (
        <section className="py-20 px-4 border-t border-border">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1">
                <Rocket className="h-3 w-3 text-primary" />
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  {t('Demo Day', 'Ден на демонстрацията')}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">
                {t('Top Startup Ideas', 'Най-добрите стартъп идеи')}
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                {t(
                  'The best startup projects created by our students.',
                  'Най-добрите стартъп проекти, създадени от нашите студенти.'
                )}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {startups.map((s, i) => (
                <div key={s.id} className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  {/* Innovation badge */}
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-bold text-primary">{s.score}%</span>
                    </div>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl sim-gradient shadow-md mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Rocket className="h-5 w-5 text-primary-foreground" />
                  </div>

                  <h3 className="font-display font-bold text-foreground text-sm mb-1 line-clamp-2">
                    {s.value_proposition ? s.value_proposition.slice(0, 60) + (s.value_proposition.length > 60 ? '...' : '') : t('Startup Project', 'Стартъп проект')}
                  </h3>

                  <p className="text-xs text-muted-foreground mb-2">
                    {t('Founder', 'Основател')}: {s.founder_name}
                  </p>

                  <div className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 mb-3">
                    <Factory className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{s.industry}</span>
                  </div>

                  {s.problem && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{s.problem.slice(0, 100)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
