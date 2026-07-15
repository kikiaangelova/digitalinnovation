import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { useProgress } from '@/context/ProgressContext';
import { getCurrentLevel } from '@/components/dashboard/LevelCard';
import { isNavActive } from '@/lib/nav';
import PlayerAvatar from '@/components/avatar/PlayerAvatar';
import { Button } from '@/components/ui/button';
import { DigiInnovMark } from '@/components/brand/DigiInnovMark';
import {
  GraduationCap, LogOut, LayoutDashboard, Play, Shield, User,
  BarChart3, Users, BookOpen, Book, Menu, Globe, Lightbulb,
  Rocket, Map, ChevronDown, Trophy, Zap,
} from 'lucide-react';

export default function AppHeader() {
  const { user, profile, isAdmin, userRole, signOut } = useAuth();
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const authMenuRef = useRef<HTMLDivElement>(null);
  const { xp: userXp, journeyPct } = useProgress();

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setDrawerOpen(false);
    await signOut();
    navigate('/');
  };

  const toggleLang = () => setLang(lang === 'en' ? 'bg' : 'en');

  const isActive = (path: string) => isNavActive(path, location.pathname);

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

  // Close auth mini-menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (authMenuRef.current && !authMenuRef.current.contains(e.target as Node)) {
        setAuthMenuOpen(false);
      }
    };
    if (authMenuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [authMenuOpen]);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
    setDropdownOpen(false);
    setAuthMenuOpen(false);
  }, [location.pathname]);

  const isTeacher = userRole === 'teacher_verified';
  const isPending = userRole === 'teacher_pending';

  // ─── Primary nav links (desktop left side) ───
  const primaryLinks = user
    ? isPending
      ? []
      : isTeacher
        ? [
            { to: '/teacher-dashboard', icon: LayoutDashboard, label: t.dashboard },
            { to: '/teacher', icon: GraduationCap, label: lang === 'bg' ? 'Клас' : 'Class' },
            { to: '/cases', icon: BookOpen, label: t.cases },
            { to: '/learn', icon: GraduationCap, label: lang === 'bg' ? 'Учи' : 'Learn' },
          ]
        : [
            { to: '/dashboard', icon: LayoutDashboard, label: t.dashboard },
            { to: '/journey', icon: Map, label: lang === 'bg' ? 'Пътешествие' : 'Journey' },
            { to: '/cases', icon: BookOpen, label: t.cases },
            { to: '/learn', icon: GraduationCap, label: lang === 'bg' ? 'Учи' : 'Learn' },
            { to: '/simulator', icon: Play, label: t.simulator },
          ]
    : [
        { to: '/dictionary', icon: Book, label: t.dictionary },
      ];

  // ─── Bottom tab bar items (mobile, logged-in) ───
  const bottomTabs = isPending
    ? [
        { to: '/pending', icon: LayoutDashboard, label: lang === 'bg' ? 'Статус' : 'Status' },
        { to: '/profile', icon: User, label: t.profile },
        { to: '/dictionary', icon: Book, label: t.dictionary },
        { to: '/about', icon: Lightbulb, label: t.about },
        { to: '__more__', icon: Menu, label: lang === 'bg' ? 'Още' : 'More' },
      ]
    : isTeacher
    ? [
        { to: '/teacher-dashboard', icon: LayoutDashboard, label: lang === 'bg' ? 'Начало' : 'Home' },
        { to: '/teacher', icon: GraduationCap, label: lang === 'bg' ? 'Клас' : 'Class' },
        { to: '/cases', icon: BookOpen, label: t.cases },
        { to: '/learn', icon: GraduationCap, label: lang === 'bg' ? 'Учи' : 'Learn' },
        { to: '__more__', icon: Menu, label: lang === 'bg' ? 'Още' : 'More' },
      ]
    : [
        { to: '/dashboard', icon: LayoutDashboard, label: lang === 'bg' ? 'Днес' : 'Today' },
        { to: '/learn', icon: GraduationCap, label: lang === 'bg' ? 'Учи' : 'Learn' },
        { to: '/cases', icon: BookOpen, label: t.cases },
        { to: '/my-startup', icon: Rocket, label: lang === 'bg' ? 'Стартъп' : 'Startup' },
        { to: '__more__', icon: Menu, label: lang === 'bg' ? 'Още' : 'More' },
      ];

  const level = getCurrentLevel(userXp);

  const displayName = profile?.display_name || profile?.full_name || user?.email || '';
  const initials = displayName
    ? displayName.split(/[\s_]+/).map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      <header className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between px-4 py-2.5">
          {/* Logo — always visible */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
            aria-label={t.appName}
          >
            <DigiInnovMark size={32} className="transition-transform duration-200 group-hover:-rotate-6 motion-reduce:transition-none motion-reduce:group-hover:transform-none" />
            <span className="font-display font-bold text-foreground text-base md:text-[17px] tracking-tight leading-none">
              <span className="md:hidden">DigiInnov</span>
              <span className="hidden md:inline">DigiInnov <span className="font-normal text-muted-foreground">Case Lab</span></span>
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
            {/* My Startup — desktop only, hidden for teachers */}
            {user && !isTeacher && !isPending && (
              <Link to="/my-startup" className={`hidden md:flex ${navLinkClass('/my-startup')}`}>
                <Rocket className="h-4 w-4" />
                {t.startup}
              </Link>
            )}

            {/* Lang toggle — styled as pill */}
            <button
              onClick={toggleLang}
              className={`${!user ? 'hidden min-[400px]:flex' : 'flex'} items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-accent text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors`}
              title={lang === 'en' ? 'Превключи на български' : 'Switch to English'}
            >
              <Globe className="h-3 w-3 md:inline hidden" />
              {lang === 'en' ? 'BG' : 'EN'}
            </button>

            {/* ─── Desktop: user avatar dropdown or sign-in ─── */}
            {user ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  {profile?.avatar_style ? (
                    <PlayerAvatar style={profile.avatar_style} xp={userXp} size="xs" showBorder={false} />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                      {initials}
                    </div>
                  )}
                    <span className="text-sm text-foreground font-medium max-w-[8rem] truncate" title={displayName}>
                      {displayName}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1 hidden lg:inline">⚡ {userXp}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-56 rounded-lg border border-border bg-card shadow-lg py-1.5 z-50 animate-fade-in">
                    {/* Profile & About */}
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${isActive('/profile') ? 'text-primary bg-accent/50 font-medium' : 'text-foreground hover:bg-muted'}`}
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      {t.profile}
                    </Link>
                    <Link
                      to="/dictionary"
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${isActive('/dictionary') ? 'text-primary bg-accent/50 font-medium' : 'text-foreground hover:bg-muted'}`}
                    >
                      <Book className="h-4 w-4 text-muted-foreground" />
                      {t.dictionary}
                    </Link>
                    <Link
                      to="/about"
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${isActive('/about') ? 'text-primary bg-accent/50 font-medium' : 'text-foreground hover:bg-muted'}`}
                    >
                      <Lightbulb className="h-4 w-4 text-muted-foreground" />
                      {t.about}
                    </Link>

                    {/* Admin section */}
                    {isAdmin && (
                      <>
                        <div className="my-1.5 border-t border-border" />
                        {[
                          { to: '/admin', icon: Shield, label: t.admin },
                          { to: '/admin/teacher', icon: GraduationCap, label: t.teacher },
                          { to: '/admin/cohorts', icon: Users, label: t.cohorts },
                          { to: '/admin/analytics', icon: BarChart3, label: t.analytics },
                        ].map(item => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${isActive(item.to) ? 'text-primary bg-accent/50 font-medium' : 'text-foreground hover:bg-muted'}`}
                          >
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                            {item.label}
                          </Link>
                        ))}
                      </>
                    )}

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

            {/* ─── Mobile: avatar circle (opens bottom sheet) or sign-in buttons ─── */}
            {user ? (
              <button
                onClick={() => setDrawerOpen(prev => !prev)}
                className="md:hidden shrink-0"
              >
                {profile?.avatar_style ? (
                  <PlayerAvatar style={profile.avatar_style} xp={userXp} size="sm" showBorder={false} />
                ) : (
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold uppercase">
                    {initials}
                  </div>
                )}
              </button>
            ) : (
              <div className="md:hidden flex items-center gap-1.5">
                {/* ≥400px: show inline auth buttons */}
                <Button variant="outline" size="sm" asChild className="hidden min-[400px]:inline-flex">
                  <Link to="/auth">{t.signIn}</Link>
                </Button>
                <Button size="sm" asChild className="sim-gradient border-0 hidden min-[400px]:inline-flex">
                  <Link to="/auth?mode=signup">{t.signUp}</Link>
                </Button>

                {/* <400px: collapse into hamburger */}
                <div className="relative min-[400px]:hidden" ref={authMenuRef}>
                  <button
                    onClick={() => setAuthMenuOpen(o => !o)}
                    className="flex items-center justify-center h-11 w-11 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
                    aria-label={lang === 'bg' ? 'Отвори меню' : 'Open menu'}
                    aria-expanded={authMenuOpen}
                  >
                    <Menu className="h-5 w-5 text-foreground" />
                  </button>
                  {authMenuOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-52 rounded-lg border border-border bg-card shadow-lg py-1.5 z-50 animate-fade-in">
                      <Link
                        to="/auth"
                        onClick={() => setAuthMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-foreground hover:bg-muted"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        {t.signIn}
                      </Link>
                      <Link
                        to="/auth?mode=signup"
                        onClick={() => setAuthMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-primary font-semibold hover:bg-muted"
                      >
                        <Rocket className="h-4 w-4" />
                        {t.signUp}
                      </Link>
                      <Link
                        to="/dictionary"
                        onClick={() => setAuthMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-foreground hover:bg-muted"
                      >
                        <Book className="h-4 w-4 text-muted-foreground" />
                        {t.dictionary}
                      </Link>
                      <div className="my-1 border-t border-border" />
                      <button
                        onClick={() => { toggleLang(); setAuthMenuOpen(false); }}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-foreground hover:bg-muted w-full"
                      >
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        {lang === 'en' ? 'Български' : 'English'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ Journey progress bar (below top header, logged-in only) ═══ */}
        {user && (
          <div
            className="h-[3px] w-full bg-muted"
            title={lang === 'bg' ? `Иновационно пътешествие: ${journeyPct}%` : `Innovation Journey: ${journeyPct}%`}
          >
            <div
              className="h-full sim-gradient transition-all duration-700 ease-out"
              style={{ width: `${journeyPct}%` }}
            />
          </div>
        )}
      </header>

      {/* ═══ Mobile bottom sheet overlay ═══ */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden animate-fade-in"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ═══ Mobile bottom sheet ═══ */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card rounded-t-2xl border-t border-border shadow-2xl transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mt-3 mb-4" />

        {/* User card */}
        {user && (
          <div className="flex items-center gap-3 px-5 pb-4 border-b border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-full sim-gradient text-primary-foreground text-sm font-bold uppercase shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-500" />
                {userXp} XP · {lang === 'bg' ? `Ниво ${level.level} — ${level.name.bg}` : `Level ${level.level} ${level.name.en}`}
              </p>
            </div>
          </div>
        )}

        {/* Two-column grid */}
        <div className="grid grid-cols-2 gap-px bg-border">
          {/* Left column — Learn */}
          <div className="bg-card px-5 py-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              {lang === 'bg' ? 'Учене' : 'Learn'}
            </p>
            {(() => {
              // Role-aware learning items — never link to routes the user
              // cannot access (see App.tsx RoleGuard entries).
              const items: { to: string; icon: typeof Book; label: string }[] = [];
              items.push({ to: '/dictionary', icon: Book, label: t.dictionary });
              // Journey + Leaderboard: available to students and admins (exactly once).
              // Not shown to teacher_verified / teacher_pending — routes are not in
              // their permitted RoleGuard scope.
              if ((!isPending && !isTeacher) || isAdmin) {
                items.push({ to: '/journey', icon: Map, label: lang === 'bg' ? 'Пътешествие' : 'Journey' });
                items.push({ to: '/leaderboard', icon: Trophy, label: lang === 'bg' ? 'Класация' : 'Leaderboard' });
              }
              return items;
            })().map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2 py-2.5 text-sm text-foreground min-h-11"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right column — Account */}
          <div className="bg-card px-5 py-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              {lang === 'bg' ? 'Акаунт' : 'Account'}
            </p>
            {[
              { to: '/profile', icon: User, label: t.profile },
              { to: '/about', icon: Lightbulb, label: t.about },
              ...(isAdmin ? [{ to: '/admin', icon: Shield, label: t.admin }] : []),
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2 py-2.5 text-sm text-foreground min-h-11"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Sign out */}
        {user && (
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full border-t border-border py-4 text-sm text-destructive"
          >
            <LogOut className="h-4 w-4" />
            {t.signOut}
          </button>
        )}
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
                  setDrawerOpen(false);
                  navigate(tab.to);
                }
              };

              return (
                <button
                  key={tab.to}
                  onClick={handleClick}
                  aria-label={isMore ? (lang === 'bg' ? 'Отвори още опции за навигация' : 'Open more navigation options') : tab.label}
                  aria-expanded={isMore ? drawerOpen : undefined}
                  className="flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer relative"
                >
                  <span
                    className={`flex items-center justify-center transition-colors relative ${
                      active
                        ? 'bg-primary/15 rounded-lg px-3 py-1'
                        : 'px-3 py-1'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                    {/* Red dot badge on More tab for admins */}
                    {isMore && isAdmin && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-destructive" />
                    )}
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