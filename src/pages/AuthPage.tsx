import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { GraduationCap, LogIn, UserPlus, Eye, EyeOff, ArrowLeft } from 'lucide-react';
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
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [school, setSchool] = useState('');
  const [country, setCountry] = useState('');
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
        toast.error(tx('Password must be at least 8 characters', 'Паролата трябва да бъде поне 8 символа'));
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
      const trimmedLastName = lastName.trim();
      if (!trimmedName || trimmedName.length < 2) {
        toast.error(t.nameTooShort);
        setLoading(false);
        return;
      }
      if (!trimmedLastName || trimmedLastName.length < 2) {
        toast.error(tx('Last name must be at least 2 characters', 'Фамилията трябва да бъде поне 2 символа'));
        setLoading(false);
        return;
      }
      if (trimmedName.length > 100 || trimmedLastName.length > 100) {
        toast.error(t.nameTooLong);
        setLoading(false);
        return;
      }
      const displayName = `${trimmedName} ${trimmedLastName}`;
      const { error } = await signUp(trimmedEmail, password, displayName);
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
            {isLogin ? t.signInToContinue : tx('Create your account to start your innovation journey.', 'Създай акаунт, за да започнеш своето иновационно пътешествие.')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="fullName">{tx('First Name', 'Име')}</Label>
                    <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder={tx('e.g. Maria', 'напр. Мария')} required={!isLogin} />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{tx('Last Name', 'Фамилия')}</Label>
                    <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder={tx('e.g. Ivanova', 'напр. Иванова')} required={!isLogin} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="studentClass">{tx('Class', 'Клас')}</Label>
                    <Input id="studentClass" value={studentClass} onChange={e => setStudentClass(e.target.value)} placeholder={tx('e.g. 11A', 'напр. 11А')} required={!isLogin} />
                  </div>
                  <div>
                    <Label htmlFor="country">{tx('Country', 'Държава')}</Label>
                    <Input id="country" value={country} onChange={e => setCountry(e.target.value)} placeholder={tx('e.g. Bulgaria', 'напр. България')} required={!isLogin} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="school">{tx('School (optional)', 'Училище (незадължително)')}</Label>
                  <Input id="school" value={school} onChange={e => setSchool(e.target.value)} placeholder={tx('e.g. Sofia High School', 'напр. СМГ')} />
                </div>
              </>
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

            {!isLogin && (
              <p className="text-[11px] text-muted-foreground text-center mt-2">
                {tx('We collect only minimal information to create your account.', 'Събираме само минимална информация за създаване на акаунта ви.')}
              </p>
            )}

            {isLogin && (
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="block w-full text-center text-xs text-primary hover:underline mt-2"
              >
                {tx('Forgot password?', 'Забравена парола?')}
              </button>
            )}
          </form>

          {/* Forgot password inline form */}
          {showForgot && (
            <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{tx('Reset Password', 'Смяна на парола')}</h3>
                <button onClick={() => setShowForgot(false)} className="text-xs text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-3 w-3 inline mr-1" />{tx('Back', 'Назад')}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {tx('Enter your email and we\'ll send you a reset link.', 'Въведете имейла си и ще ви изпратим линк за смяна.')}
              </p>
              <Input
                type="email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder={tx('Your email', 'Вашият имейл')}
              />
              <Button
                className="w-full"
                variant="outline"
                disabled={forgotLoading}
                onClick={async () => {
                  const trimmed = forgotEmail.trim();
                  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
                    toast.error(t.invalidEmail);
                    return;
                  }
                  setForgotLoading(true);
                  await supabase.auth.resetPasswordForEmail(trimmed, {
                    redirectTo: `${window.location.origin}/reset-password`,
                  });
                  setForgotLoading(false);
                  toast.success(tx(
                    'If this email exists, a password reset link has been sent.',
                    'Ако този имейл съществува, линк за смяна на парола е изпратен.'
                  ));
                  setShowForgot(false);
                  setForgotEmail('');
                }}
              >
                {forgotLoading ? tx('Sending...', 'Изпращане...') : tx('Send Reset Link', 'Изпрати линк')}
              </Button>
            </div>
          )}

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
