import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Award, Zap } from 'lucide-react';
import { getCurrentLevel } from '@/components/dashboard/LevelCard';

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  xp: number;
  rank: number;
  level: ReturnType<typeof getCurrentLevel>;
}

interface LeaderboardProps {
  lang: 'en' | 'bg';
  currentUserId?: string;
  limit?: number;
  showTitle?: boolean;
}

type Tab = 'weekly' | 'alltime';

const PODIUM_CONFIG = [
  { border: 'border-rank-gold', bg: 'bg-rank-gold/10', text: 'text-rank-gold', Icon: Trophy, height: 'h-28', size: 'h-12 w-12', iconSize: 'h-5 w-5', nameSize: 'text-sm font-bold', xpSize: 'text-base' },
  { border: 'border-rank-silver', bg: 'bg-rank-silver/10', text: 'text-rank-silver', Icon: Medal, height: 'h-20', size: 'h-10 w-10', iconSize: 'h-4 w-4', nameSize: 'text-xs font-semibold', xpSize: 'text-sm' },
  { border: 'border-rank-bronze', bg: 'bg-rank-bronze/10', text: 'text-rank-bronze', Icon: Award, height: 'h-16', size: 'h-10 w-10', iconSize: 'h-4 w-4', nameSize: 'text-xs font-semibold', xpSize: 'text-sm' },
];

// Podium order: 2nd | 1st | 3rd
const PODIUM_ORDER = [1, 0, 2];

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

        const mapEntries = (data: any[]): LeaderboardEntry[] =>
          (data || []).map((row: any, i: number) => ({
            user_id: row.user_id,
            display_name: row.display_name || t('Student', 'Студент'),
            xp: row.total_xp || 0,
            rank: i + 1,
            level: getCurrentLevel(row.total_xp || 0),
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
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const myEntry = entries.find(e => e.user_id === currentUserId);
  const myRank = myEntry?.rank;

  const getInitials = (name: string) =>
    name.split(/[\s_]+/).map(w => w[0] || '').join('').toUpperCase().slice(0, 2);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {showTitle && (
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-5 w-5 text-rank-gold" />
          <h2 className="typo-card-title text-lg">{t('Leaderboard', 'Класация')}</h2>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 rounded-lg bg-muted p-1">
        <button
          onClick={() => setTab('weekly')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            tab === 'weekly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          🏆 {t('This Week', 'Тази седмица')}
        </button>
        <button
          onClick={() => setTab('alltime')}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            tab === 'alltime' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('All Time', 'Всички времена')}
        </button>
      </div>

      <p className="text-xs text-muted-foreground mb-4 italic">
        {t('Display names only — privacy protected', 'Само псевдоними — личните данни са защитени')}
      </p>

      {loading ? (
        <div className="animate-pulse text-center text-sm text-muted-foreground py-4">{t('Loading...', 'Зареждане...')}</div>
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          {tab === 'weekly'
            ? t('No XP earned this week yet — be the first!', 'Все още няма спечелени XP тази седмица — бъди първият!')
            : t('No data yet', 'Няма данни')}
        </p>
      ) : (
        <div className="space-y-4">
          {/* ═══ Podium: 2nd | 1st | 3rd ═══ */}
          {top3.length >= 2 && (
            <div className="flex items-end justify-center gap-2">
              {PODIUM_ORDER.map(idx => {
                const entry = top3[idx];
                if (!entry) return <div key={idx} className="flex-1" />;
                const cfg = PODIUM_CONFIG[idx];
                const isMe = entry.user_id === currentUserId;

                return (
                  <div
                    key={entry.user_id}
                    className={`flex-1 flex flex-col items-center rounded-xl border-2 ${cfg.border} ${cfg.bg} p-3 transition-all ${
                      isMe ? 'ring-2 ring-primary/30' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`${cfg.size} rounded-full flex items-center justify-center bg-muted text-xs font-bold text-foreground mb-1`}>
                      {getInitials(entry.display_name)}
                    </div>
                    {/* Icon */}
                    <cfg.Icon className={`${cfg.iconSize} ${cfg.text} mb-1`} />
                    {/* Name */}
                    <p className={`${cfg.nameSize} text-foreground text-center truncate w-full`}>
                      {entry.display_name}
                    </p>
                    {/* Level */}
                    <p className="text-[11px] text-muted-foreground">
                      {t('Lv', 'Нв')}.{entry.level.level}
                    </p>
                    {/* XP */}
                    <div className="flex items-center gap-1 mt-1">
                      <Zap className="h-3 w-3 text-xp-gold" />
                      <span className={`${cfg.xpSize} font-bold text-xp-gold`}>{entry.xp}</span>
                    </div>
                    {isMe && (
                      <span className="text-[10px] text-primary mt-1">({t('You', 'Ти')})</span>
                    )}
                    {/* Pedestal bar */}
                    <div className={`w-full ${cfg.height} rounded-t-md mt-2 ${cfg.bg} border-t-2 ${cfg.border}`} />
                  </div>
                );
              })}
            </div>
          )}

          {/* ═══ Positions 4+ ═══ */}
          {rest.length > 0 && (
            <div className="space-y-1.5">
              {rest.map(e => {
                const isMe = e.user_id === currentUserId;
                return (
                  <div
                    key={e.user_id}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                      isMe ? 'bg-accent border border-primary/20' : 'bg-muted/30'
                    }`}
                  >
                    <span className="w-6 text-center text-xs font-bold text-muted-foreground shrink-0">{e.rank}</span>
                    <div className="h-7 w-7 rounded-full flex items-center justify-center bg-muted text-[10px] font-bold text-foreground shrink-0">
                      {getInitials(e.display_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isMe ? 'text-primary' : 'text-foreground'}`}>
                        {e.display_name}
                        {isMe && <span className="text-xs text-primary ml-1">({t('You', 'Ти')})</span>}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {t('Lv', 'Нв')}.{e.level.level} — {e.level.name[lang]}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Zap className="h-3 w-3 text-xp-gold" />
                      <span className="text-xs font-bold text-xp-gold">{e.xp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ═══ Current user position ═══ */}
          {currentUserId && myRank && (
            <div className="text-center pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {t('Your position', 'Твоята позиция')}: <span className="font-bold text-foreground">#{myRank}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
