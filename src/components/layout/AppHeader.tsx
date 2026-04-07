import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { useJourneyProgress } from '@/hooks/useJourneyProgress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap, LogOut, LayoutDashboard, Play, Shield, User,
  BarChart3, Users, BookOpen, Book, Menu, Globe, Lightbulb,
  Rocket, Map, ChevronDown, X,
} from 'lucide-react';

export default function AppHeader() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const journeyPct = useJourneyProgress();

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setDrawerOpen(false);
    await signOut();
    navigate('/');
  };

  const toggleLang = () => setLang(lang === 'en' ? 'bg' : 'en');

  const isActive = (path: string) => location.pathname === path;

  // Desktop nav: underline-based active style (no pill)
  const navLinkClass = (path: string) =>
    `relative flex items-center gap-1.5 px-3 py-2 text-sm transition-colors whitespace-nowrap ${
      isActive(path)
        ? 'text-foreground font-bold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-primary after:rounded-full'
        : 'text-muted-foreground font-medium hover:text-foreground hover:bg-accent/50 rounded-md'
    }`;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // ─── Primary nav links (desktop left side) ───
  const primaryLinks = user
    ? [
        { to: '/dashboard', icon: LayoutDashboard, label: t.dashboard },
        { to: '/journey', icon: Map, label: lang === 'bg' ? 'Пътешествие' : 'Journey' },
        { to: '/cases', icon: BookOpen, label: t.cases },
        { to: '/learn', icon: GraduationCap, label: lang === 'bg' ? 'Теория' : 'Learn' },
        { to: '/simulator', icon: Play, label: t.simulator },
        { to: '/dictionary', icon: Book, label: t.dictionary },
      ]
    : [
        { to: '/dictionary', icon: Book, label: t.dictionary },
      ];

  // ─── Dropdown menu items ───
  const dropdownItems = [
    { to: '/about', icon: Lightbulb, label: t.about },
    { to: '/profile', icon: User, label: t.profile },
    ...(isAdmin
      ? [
          { to: '/admin', icon: Shield, label: t.admin },
          { to: '/admin/teacher', icon: GraduationCap, label: t.teacher },
          { to: '/admin/cohorts', icon: Users, label: t.cohorts },
          { to: '/admin/analytics', icon: BarChart3, label: t.analytics },
        ]
      : []),
  ];

  // ─── Bottom tab bar items (mobile, logged-in) ───
  const bottomTabs = [
    { to: '/dashboard', icon: LayoutDashboard, label: lang === 'bg' ? 'Начало' : 'Home' },
    { to: '/cases', icon: BookOpen, label: t.cases },
    { to: '/my-startup', icon: Rocket, label: lang === 'bg' ? 'Стартъп' : 'Startup' },
    { to: '/simulator', icon: Play, label: t.simulator },
    { to: '__more__', icon: Menu, label: lang === 'bg' ? 'Още' : 'More' },
  ];

  // ─── "More" drawer links (mobile bottom sheet) ───
  const moreDrawerLinks = user
    ? [
        { to: '/journey', icon: Map, label: lang === 'bg' ? 'Пътешествие' : 'Journey', showProgress: true },
        { to: '/learn', icon: GraduationCap, label: lang === 'bg' ? 'Теория' : 'Learn' },
        { to: '/dictionary', icon: Book, label: t.dictionary },
        { to: '/about', icon: Lightbulb, label: t.about },
        { to: '/profile', icon: User, label: t.profile },
        ...(isAdmin
          ? [
              { to: '/admin', icon: Shield, label: t.admin },
              { to: '/admin/teacher', icon: GraduationCap, label: t.teacher },
            ]
          : []),
      ]
    : [
        { to: '/dictionary', icon: Book, label: t.dictionary },
        { to: '/about', icon: Lightbulb, label: t.about },
      ];

  const displayName = profile?.display_name || profile?.full_name || user?.email || '';
  const initials = displayName
    ? displayName.split(/[\s_]+/).map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      <header className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between px-4 py-2.5">
          {/* Logo — always visible */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg sim-gradient">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">
              {t.appName}
            </span>
          </Link>

          {/* ═══ Desktop nav (left primary links) ═══ */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {primaryLinks.map(l => (
              <Link key={l.to} to={l.to} className={navLinkClass(l.to)}>
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ═══ Right side ═══ */}
          <div className="flex items-center gap-2 ml-auto">
            {/* My Startup — desktop only */}
            {user && (
              <Link to="/my-startup" className={`hidden md:flex ${navLinkClass('/my-startup')}`}>
                <Rocket className="h-4 w-4" />
                {t.startup}
              </Link>
            )}

            {/* Lang toggle — styled as pill */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-muted/50 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={lang === 'en' ? 'Превключи на български' : 'Switch to English'}
            >
              <Globe className="h-3 w-3" />
              {lang === 'en' ? 'BG' : 'EN'}
            </button>

            {/* ─── Desktop: user avatar dropdown or sign-in ─── */}
            {user ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                    {initials}
                  </div>
                  <span className="text-sm text-foreground font-medium max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-56 rounded-lg border border-border bg-card shadow-lg py-1.5 z-50 animate-fade-in">
                    {dropdownItems.map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                          isActive(item.to)
                            ? 'text-primary bg-accent/50 font-medium'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        {item.label}
                      </Link>
                    ))}
                    <div className="my-1.5 border-t border-border" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      {t.signOut}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">{t.signIn}</Link>
                </Button>
                <Button size="sm" asChild className="sim-gradient border-0">
                  <Link to="/auth?mode=signup">{t.signUp}</Link>
                </Button>
              </div>
            )}

            {/* ─── Mobile: avatar circle (logged-in) or sign-in buttons (logged-out) ─── */}
            {user ? (
              <Link
                to="/profile"
                className="md:hidden flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold uppercase shrink-0"
              >
                {initials}
              </Link>
            ) : (
              <div className="md:hidden flex items-center gap-1.5">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">{t.signIn}</Link>
                </Button>
                <Button size="sm" asChild className="sim-gradient border-0">
                  <Link to="/auth?mode=signup">{t.signUp}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ═══ Journey progress bar (below top header, logged-in only) ═══ */}
        {user && (
          <div className="h-[3px] w-full bg-muted">
            <div
              className="h-full sim-gradient transition-all duration-700 ease-out"
              style={{ width: `${journeyPct}%` }}
            />
          </div>
        )}
      </header>

      {/* ═══ Mobile "More" drawer overlay ═══ */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden animate-fade-in"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ═══ Mobile "More" drawer ═══ */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-card border-l border-border shadow-xl md:hidden transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          {user && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold uppercase shrink-0">
                {initials}
              </div>
              <span className="text-sm font-medium text-foreground truncate">
                {displayName}
              </span>
            </div>
          )}
          {!user && <span className="text-sm font-medium text-foreground">{t.menu}</span>}
          <button
            onClick={() => setDrawerOpen(false)}
            className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted transition-colors shrink-0"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex flex-col p-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 60px)' }}>
          {moreDrawerLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setDrawerOpen(false)}
              className={`flex items-center gap-3 px-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(l.to)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
              style={{ minHeight: 48 }}
            >
              <l.icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1">{l.label}</span>
              {'showProgress' in l && l.showProgress && user && (
                <Badge variant="secondary" className="text-xs font-bold tabular-nums">
                  {journeyPct}%
                </Badge>
              )}
            </Link>
          ))}

          <div className="my-2 border-t border-border" />

          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              style={{ minHeight: 48 }}
            >
              <LogOut className="h-4 w-4" />
              {t.signOut}
            </button>
          ) : (
            <>
              <Link
                to="/auth"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center rounded-lg text-sm font-medium text-foreground border border-border hover:bg-muted transition-colors"
                style={{ minHeight: 48 }}
              >
                {t.signIn}
              </Link>
              <Link
                to="/auth?mode=signup"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center rounded-lg text-sm font-medium sim-gradient text-primary-foreground mt-2"
                style={{ minHeight: 48 }}
              >
                {t.signUp}
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* ═══ Mobile bottom tab bar (logged-in only) ═══ */}
      {user && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-sm md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center justify-around">
            {bottomTabs.map(tab => {
              const isMore = tab.to === '__more__';
              const active = isMore ? drawerOpen : isActive(tab.to);
              const Icon = tab.icon;

              const handleClick = () => {
                if (isMore) {
                  setDrawerOpen(prev => !prev);
                } else {
                  navigate(tab.to);
                }
              };

              return (
                <button
                  key={tab.to}
                  onClick={handleClick}
                  className="flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer"
                >
                  <span
                    className={`flex items-center justify-center transition-colors ${
                      active
                        ? 'bg-primary/15 rounded-lg px-3 py-1'
                        : 'px-3 py-1'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                  </span>
                  <span
                    className={`text-[11px] leading-none ${
                      active ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}