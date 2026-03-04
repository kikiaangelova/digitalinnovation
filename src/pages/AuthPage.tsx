import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { GraduationCap, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import PasswordStrengthMeter, { checkPassword, getStrength } from '@/components/auth/PasswordStrengthMeter';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 10 * 60 * 1000; // 10 min

function getLoginAttempts(): { count: number; lockedUntil: number } {
  try {
    const raw = sessionStorage.getItem('auth_attempts');
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lockedUntil: 0 };
}

function setLoginAttempts(data: { count: number; lockedUntil: number }) {
  sessionStorage.setItem('auth_attempts', JSON.stringify(data));
}

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const tx = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user]);

  useEffect(() => {
    setIsLogin(searchParams.get('mode') !== 'signup');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Brute-force check
    const attempts = getLoginAttempts();
    if (attempts.lockedUntil > Date.now()) {
      const mins = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
      toast.error(tx(`Account locked. Try again in ${mins} minutes.`, `Акаунтът е заключен. Опитайте отново след ${mins} минути.`));
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error(t.invalidEmail);
      return;
    }

    if (isLogin) {
      if (password.length < 1) {
        toast.error(tx('Please enter your password', 'Моля, въведете паролата'));
        return;
      }
    } else {
      // Registration password validation
      const checks = checkPassword(password, fullName || trimmedEmail);
      const strength = getStrength(checks);
      if (!checks.minLength) {
        toast.error(tx('Password must be at least 12 characters', 'Паролата трябва да бъде поне 12 символа'));
        return;
      }
      if (!checks.complexityMet) {
        toast.error(tx('Password must include 3 of 4: uppercase, lowercase, number, symbol', 'Паролата трябва да включва 3 от 4: главна, малка, цифра, символ'));
        return;
      }
      if (!checks.notCommon) {
        toast.error(tx('This password is too common. Choose a stronger one.', 'Тази парола е прекалено често срещана. Изберете по-силна.'));
        return;
      }
      if (!checks.notContainsName) {
        toast.error(tx('Password must not contain your name or email.', 'Паролата не трябва да съдържа вашето име или имейл.'));
        return;
      }
      if (password !== confirmPassword) {
        toast.error(tx('Passwords do not match', 'Паролите не съвпадат'));
        return;
      }
      if (password.length > 128) {
        toast.error(t.passwordTooLong);
        return;
      }
    }

    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(trimmedEmail, password);
      if (error) {
        const newCount = attempts.count + 1;
        if (newCount >= MAX_ATTEMPTS) {
          setLoginAttempts({ count: newCount, lockedUntil: Date.now() + LOCKOUT_MS });
          toast.error(tx(`Too many attempts. Locked for 10 minutes.`, `Твърде много опити. Заключен за 10 минути.`));
        } else {
          setLoginAttempts({ count: newCount, lockedUntil: 0 });
          toast.error(error.message);
        }
      } else {
        setLoginAttempts({ count: 0, lockedUntil: 0 });
        toast.success(t.welcomeBack + '!');
        navigate(redirectTo);
      }
    } else {
      const trimmedName = fullName.trim();
      if (!trimmedName || trimmedName.length < 2) {
        toast.error(t.nameTooShort);
        setLoading(false);
        return;
      }
      if (trimmedName.length > 100) {
        toast.error(t.nameTooLong);
        setLoading(false);
        return;
      }
      const { error } = await signUp(trimmedEmail, password, trimmedName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t.accountCreated);
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isLogin && (
                <PasswordStrengthMeter password={password} nameOrEmail={fullName || email} lang={lang} />
              )}
            </div>
            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword">{tx('Confirm Password', 'Потвърдете паролата')}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[11px] text-destructive mt-1">{tx('Passwords do not match', 'Паролите не съвпадат')}</p>
                )}
              </div>
            )}
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
