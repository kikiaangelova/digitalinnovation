import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { GraduationCap, LogIn, UserPlus } from 'lucide-react';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user]);

  useEffect(() => {
    setIsLogin(searchParams.get('mode') !== 'signup');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t.welcomeBack + '!');
        navigate(redirectTo);
      }
    } else {
      if (!fullName.trim()) {
        toast.error('Please enter your full name');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created! Check your email to confirm.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 sim-gradient items-center justify-center p-12">
        <div className="max-w-md text-center">
          <GraduationCap className="h-16 w-16 text-primary-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-primary-foreground mb-4">{t.appName}</h1>
          <p className="text-primary-foreground/80 text-lg">{t.heroSubtitle}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg sim-gradient">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">{t.appName}</h1>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isLogin ? t.welcomeBack : t.createAccount}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isLogin ? t.signInToContinue : t.getStartedJourney}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="fullName">{t.fullName}</Label>
                <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Doe" required={!isLogin} />
              </div>
            )}
            <div>
              <Label htmlFor="email">{t.email}</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu" required />
            </div>
            <div>
              <Label htmlFor="password">{t.password}</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            <Button type="submit" className="w-full sim-gradient border-0" disabled={loading}>
              {loading ? t.pleaseWait : isLogin ? (
                <><LogIn className="h-4 w-4 mr-2" /> {t.signIn}</>
              ) : (
                <><UserPlus className="h-4 w-4 mr-2" /> {t.createAccount}</>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? t.noAccount : t.haveAccount}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
              {isLogin ? t.signUp : t.signIn}
            </button>
          </p>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">{t.backToHome}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
