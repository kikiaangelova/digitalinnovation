import { useNavigate, useLocation } from 'react-router-dom';
import { useLang } from '@/context/LangContext';
import { ArrowRight, BookOpen, Rocket, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Phase = 'learn' | 'apply' | 'fun' | 'unknown';

// Hub pages only — exclude detail/player pages where user is mid-task
const HUB_PAGES: Record<Phase, string[]> = {
  learn: ['/learn', '/dictionary'],
  apply: ['/cases', '/my-startup', '/startup-simulator'],
  fun: ['/dashboard', '/leaderboard', '/journey'],
  unknown: [],
};

function getPagePhase(pathname: string): Phase {
  // Exclude mid-task detail pages
  if (/^\/case\//.test(pathname)) return 'unknown';        // inside a case study
  if (/^\/learn\/[^/]+/.test(pathname)) return 'unknown';  // inside a learn module player
  if (/^\/simulator\//.test(pathname)) return 'unknown';   // inside simulator round/season

  if (HUB_PAGES.learn.some(p => pathname === p || pathname === p + '/')) return 'learn';
  if (HUB_PAGES.apply.some(p => pathname === p || pathname.startsWith(p))) return 'apply';
  if (HUB_PAGES.fun.some(p => pathname === p || pathname.startsWith(p))) return 'fun';
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
