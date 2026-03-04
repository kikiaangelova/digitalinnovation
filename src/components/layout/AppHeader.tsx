import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { GraduationCap, LogOut, LayoutDashboard, Play, Shield, User, BarChart3, Users, BookOpen, Book, Menu, Globe, Lightbulb } from 'lucide-react';

export default function AppHeader() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleLang = () => setLang(lang === 'en' ? 'bg' : 'en');

  const isActive = (path: string) => location.pathname === path;
  const linkClass = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-accent text-accent-foreground'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
    }`;

  const navLinks = [
    ...(user
      ? [
          { to: '/dashboard', icon: LayoutDashboard, label: t.dashboard },
          { to: '/cases', icon: BookOpen, label: t.cases },
          { to: '/simulator', icon: Play, label: t.simulator },
          { to: '/dictionary', icon: Book, label: t.dictionary },
          { to: '/about', icon: Lightbulb, label: t.about },
          { to: '/profile', icon: User, label: t.profile },
        ]
      : [
          { to: '/dictionary', icon: Book, label: t.dictionary },
          { to: '/about', icon: Lightbulb, label: t.about },
        ]),
  ];

  const adminLinks = isAdmin
    ? [
        { to: '/admin', icon: Shield, label: t.admin },
        { to: '/admin/cohorts', icon: Users, label: t.cohorts },
        { to: '/admin/analytics', icon: BarChart3, label: t.analytics },
      ]
    : [];

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-20">
      <div className="container mx-auto flex items-center justify-between px-4 py-2.5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg sim-gradient">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground hidden sm:inline">{t.appName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className={linkClass(l.to)}>
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
          {adminLinks.map(l => (
            <Link key={l.to} to={l.to} className={linkClass(l.to)}>
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Lang toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={lang === 'en' ? 'Превключи на български' : 'Switch to English'}
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === 'en' ? 'BG' : 'EN'}
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {profile?.full_name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut} title={t.signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
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

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-10">
              <nav className="flex flex-col gap-1">
                {navLinks.map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={linkClass(l.to)}>
                    <l.icon className="h-4 w-4" />
                    {l.label}
                  </Link>
                ))}
                {adminLinks.map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={linkClass(l.to)}>
                    <l.icon className="h-4 w-4" />
                    {l.label}
                  </Link>
                ))}

                <div className="my-3 border-t border-border" />

                {user ? (
                  <>
                    <p className="px-3 text-sm text-muted-foreground truncate">{profile?.full_name || user.email}</p>
                    <button onClick={() => { handleSignOut(); setOpen(false); }} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                      <LogOut className="h-4 w-4" />
                      {t.signOut}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors">
                      {t.signIn}
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium sim-gradient text-primary-foreground justify-center">
                      {t.signUp}
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
