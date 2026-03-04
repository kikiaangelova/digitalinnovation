import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, LayoutDashboard, Play, Shield, User, BarChart3, Users, BookOpen, Book } from 'lucide-react';

export default function AppHeader() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-20">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg sim-gradient">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground hidden sm:inline">DigiInnov Case Lab</span>
        </Link>

        <nav className="flex items-center gap-1">
          {user && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/cases">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Cases</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/simulator">
                  <Play className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Simulator</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dictionary">
                  <Book className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Dictionary</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </Button>
              {isAdmin && (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin">
                      <Shield className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/cohorts">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Cohorts</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/analytics">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Analytics</span>
                    </Link>
                  </Button>
                </>
              )}
              <div className="ml-2 flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {profile?.full_name || user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
          {!user && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dictionary">
                  <Book className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Dictionary</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="sim-gradient border-0">
                <Link to="/auth?mode=signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
