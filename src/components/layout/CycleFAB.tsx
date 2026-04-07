import { useNavigate, useLocation } from 'react-router-dom';
import { useLang } from '@/context/LangContext';
import { ArrowRight, BookOpen, Rocket, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Phase = 'learn' | 'apply' | 'fun' | 'unknown';

function getPagePhase(pathname: string): Phase {
  if (['/learn', '/dictionary'].some(p => pathname.startsWith(p)) && pathname !== '/leaderboard') return 'learn';
  if (['/cases', '/case/', '/simulator', '/my-startup', '/startup-simulator'].some(p => pathname.startsWith(p))) return 'apply';
  if (['/dashboard', '/leaderboard', '/journey'].some(p => pathname.startsWith(p))) return 'fun';
  return 'unknown';
}

export default function CycleFAB() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const phase = getPagePhase(pathname);

  if (phase === 'unknown') return null;

  const config = {
    learn: { label: t('Apply It Now', 'Приложи сега'), icon: Rocket, path: '/cases' },
    apply: { label: t('See Your Rank', 'Виж класацията'), icon: Trophy, path: '/leaderboard' },
    fun: { label: t('Continue Learning', 'Продължи да учиш'), icon: BookOpen, path: '/learn' },
  }[phase];

  // Don't show if already on target page
  if (pathname === config.path) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 z-40">
      <Button
        onClick={() => navigate(config.path)}
        className="sim-gradient border-0 shadow-lg gap-2 rounded-full px-5 h-11 text-sm font-semibold"
      >
        <config.icon className="h-4 w-4" />
        {config.label}
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
