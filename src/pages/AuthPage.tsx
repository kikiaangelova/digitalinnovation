import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { GraduationCap, LogIn, UserPlus, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import PasswordStrengthMeter, { checkPassword, getStrength } from '@/components/auth/PasswordStrengthMeter';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 10 * 60 * 1000;

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

type SignupRole = 'student' | 'teacher_pending';

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
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Role selection state
  const [signupRole, setSignupRole] = useState<SignupRole | null>(null);
  // Teacher-specific fields
  const [teacherInstitution, setTeacherInstitution] = useState('');
  const [teacherClassName, setTeacherClassName] = useState('');
  const [teacherInviteCode, setTeacherInviteCode] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const { signIn, signUp, user, userRole } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const tx = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      // Preserve redirect target (e.g. the MCP consent URL) through the OAuth round-trip.
      const nextParam = searchParams.get("redirect");
      const redirectUri = nextParam
        ? `${window.location.origin}/auth?redirect=${encodeURIComponent(nextParam)}`
        : window.location.origin;
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: redirectUri,
      });
      if (result.error) {
        toast.error(result.error.message || tx('Google sign-in failed', 'Влизането с Google не успя'));
      }
    } catch (err: any) {
      toast.error(err?.message || tx('Google sign-in failed', 'Влизането с Google не успя'));
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setLastName('');
    setStudentClass('');
    setSchool('');
    setCountry('');
    setDisplayName('');
    setShowPassword(false);
    setShowConfirm(false);
    setSignupRole(null);
    setTeacherInstitution('');
    setTeacherClassName('');
    setTeacherInviteCode('');
    setConsentChecked(false);
  }, [isLogin]);

  useEffect(() => {
    if (user && userRole) {
      if (userRole === 'teacher_pending') {
        navigate('/pending', { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [user, userRole]);

  useEffect(() => {
    setIsLogin(searchParams.get('mode') !== 'signup');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const attempts = getLoginAttempts();
    if (attempts.lockedUntil > Date.now()) {
      const mins = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
      toast.error(tx(`Account locked. Try again in ${mins} minutes.`, `Акаунтът е заключен. Опитай отново след ${mins} минути.`));
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error(t.invalidEmail);
      return;
    }

    if (isLogin) {
      if (password.length < 1) {
        toast.error(tx('Please enter your password', 'Моля, въведи паролата'));
        return;
      }
    } else {
      if (!signupRole) {
        toast.error(tx('Please select your role', 'Моля, избери ролята си'));
        return;
      }

      const checks = checkPassword(password, fullName || trimmedEmail);
      if (!checks.minLength) {
        toast.error(tx('Password must be at least 8 characters', 'Паролата трябва да бъде поне 8 символа'));
        return;
      }
      if (!checks.complexityMet) {
        toast.error(tx('Password must include 3 of 4: uppercase, lowercase, number, symbol', 'Паролата трябва да включва 3 от 4: главна, малка, цифра, символ'));
        return;
      }
      if (!checks.notCommon) {
        toast.error(tx('This password is too common. Choose a stronger one.', 'Тази парола е прекалено често срещана. Избери по-силна.'));
        return;
      }
      if (!checks.notContainsName) {
        toast.error(tx('Password must not contain your name or email.', 'Паролата не трябва да съдържа името ти или имейл.'));
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

      // Teacher validation
      if (signupRole === 'teacher_pending') {
        const trimmedInstitution = teacherInstitution.trim();
        const trimmedClass = teacherClassName.trim();
        const trimmedName = fullName.trim();
        if (!trimmedName || trimmedName.length < 2) {
          toast.error(tx('Full name must be at least 2 characters', 'Пълното име трябва да бъде поне 2 символа'));
          return;
        }
        if (!trimmedInstitution || trimmedInstitution.length < 3) {
          toast.error(tx('Institution must be at least 3 characters', 'Институцията трябва да бъде поне 3 символа'));
          return;
        }
        if (!trimmedClass || trimmedClass.length < 1) {
          toast.error(tx('Class/Group is required', 'Клас/Група е задължително'));
          return;
        }
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
      }
    } else {
      if (signupRole === 'student') {
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
        const trimmedDisplayName = displayName.trim();
        if (!trimmedDisplayName || trimmedDisplayName.length < 2) {
          toast.error(tx('Display name must be at least 2 characters', 'Псевдонимът трябва да бъде поне 2 символа'));
          setLoading(false);
          return;
        }
        const fullDisplayName = `${trimmedName} ${trimmedLastName}`;
        const { error } = await signUp(trimmedEmail, password, fullDisplayName, trimmedDisplayName, {
          signup_role: 'student',
          class_name: studentClass.trim(),
          school_name: school.trim(),
        });
        if (error) toast.error(error.message);
        else toast.success(t.accountCreated);
      } else {
        // Teacher signup
        const trimmedName = fullName.trim();
        const { error } = await signUp(trimmedEmail, password, trimmedName, trimmedName, {
          signup_role: 'teacher_pending',
          institution: teacherInstitution.trim(),
          class_name: teacherClassName.trim(),
        });
        if (error) toast.error(error.message);
        else toast.success(tx('Application submitted! Check your email to verify your account.', 'Заявката е изпратена! Провери имейла си, за да потвърдиш акаунта.'));
      }
    }
    setLoading(false);
  };

  const roleCards: { value: SignupRole; icon: string; titleEn: string; titleBg: string; subtitleEn: string; subtitleBg: string }[] = [
    {
      value: 'student',
      icon: '🎓',
      titleEn: "I'm a student",
      titleBg: 'Аз съм ученик / студент',
      subtitleEn: 'I learn, solve cases and build my startup idea',
      subtitleBg: 'Уча, решавам казуси и изграждам идея за стартъп',
    },
    {
      value: 'teacher_pending',
      icon: '👩‍🏫',
      titleEn: "I'm a teacher / instructor",
      titleBg: 'Аз съм учител / преподавател',
      subtitleEn: 'I manage a class and track student progress',
      subtitleBg: 'Управлявам клас и следя напредъка на учениците',
    },
  ];

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
        <div className="w-full max-w-md">
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

          <Button
            type="button"
            variant="outline"
            className="w-full mb-4 h-11 font-medium"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.07H2.18a11 11 0 0 0 0 9.87l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
            </svg>
            {googleLoading
              ? tx('Connecting...', 'Свързване...')
              : isLogin
                ? tx('Continue with Google', 'Продължи с Google')
                : tx('Sign up with Google', 'Регистрирай се с Google')}
          </Button>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">{tx('or', 'или')}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ═══ ROLE SELECTION (signup only) ═══ */}
            {!isLogin && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  {tx('Who are you joining as?', 'Как се присъединяваш?')}
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {roleCards.map(card => (
                    <button
                      key={card.value}
                      type="button"
                      onClick={() => setSignupRole(card.value)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        signupRole === card.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{card.icon}</span>
                        <div>
                          <p className="font-semibold text-foreground">
                            {lang === 'bg' ? card.titleBg : card.titleEn}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {lang === 'bg' ? card.subtitleBg : card.subtitleEn}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ STUDENT FIELDS ═══ */}
            {!isLogin && signupRole === 'student' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="fullName">{tx('First Name', 'Име')}</Label>
                    <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder={tx('e.g. Maria', 'напр. Мария')} required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{tx('Last Name', 'Фамилия')}</Label>
                    <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder={tx('e.g. Ivanova', 'напр. Иванова')} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="displayName">{tx('Username / Display Name', 'Псевдоним за класацията')}</Label>
                  <Input id="displayName" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder={tx('Visible publicly as nickname only', 'Видим публично само като псевдоним')} required />
                </div>
                <div>
                  <Label htmlFor="school">{tx('School / University (optional)', 'Училище / Университет (незадължително)')}</Label>
                  <Input id="school" value={school} onChange={e => setSchool(e.target.value)} placeholder={tx('e.g. Sofia High School', 'напр. СМГ')} />
                </div>
                <div>
                  <Label htmlFor="studentClass">{tx('Class / Grade (optional)', 'Клас / Курс (незадължително)')}</Label>
                  <Input id="studentClass" value={studentClass} onChange={e => setStudentClass(e.target.value)} placeholder={tx('e.g. 11A', 'напр. 11А')} />
                </div>
              </>
            )}

            {/* ═══ TEACHER FIELDS ═══ */}
            {!isLogin && signupRole === 'teacher_pending' && (
              <>
                <div>
                  <Label htmlFor="teacherName">{tx('Full Name', 'Пълно име')}</Label>
                  <Input id="teacherName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder={tx('e.g. Maria Ivanova', 'напр. Мария Иванова')} required />
                </div>
                <div>
                  <Label htmlFor="teacherInstitution">{tx('Institution', 'Училище / Университет')}</Label>
                  <Input id="teacherInstitution" value={teacherInstitution} onChange={e => setTeacherInstitution(e.target.value)} placeholder={tx('e.g. Sofia University', 'напр. СУ Св. Климент Охридски')} required />
                </div>
                <div>
                  <Label htmlFor="teacherClass">{tx('Class / Group', 'Клас / Група')}</Label>
                  <Input id="teacherClass" value={teacherClassName} onChange={e => setTeacherClassName(e.target.value)} placeholder={tx('e.g. 12A, Business 2026', 'напр. 12А, Бизнес 2026')} required />
                </div>
                <div>
                  <Label htmlFor="teacherInviteCode">{tx('Invite Code (optional)', 'Код за покана (по избор)')}</Label>
                  <Input id="teacherInviteCode" value={teacherInviteCode} onChange={e => setTeacherInviteCode(e.target.value)} placeholder={tx('Enter code if you have one', 'Въведи код, ако имаш такъв')} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {tx("Don't have a code? Your account will be reviewed manually.", 'Нямаш код? Акаунтът ти ще бъде прегледан ръчно.')}
                  </p>
                </div>
              </>
            )}

            {/* ═══ EMAIL & PASSWORD ═══ */}
            {(isLogin || signupRole) && (
              <>
                <div>
                  <Label htmlFor="email">{t.email}</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" autoComplete="off" required />
                </div>
                <div>
                  <Label htmlFor="password">{t.password}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={isLogin ? '••••••••••••' : tx('Enter a strong password', 'Въведи силна парола')}
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
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
                    <Label htmlFor="confirmPassword">{tx('Confirm Password', 'Потвърди паролата')}</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder={tx('Repeat your password', 'Повтори паролата')}
                        autoComplete="new-password"
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
                      <p className="text-xs text-destructive mt-1">{tx('Passwords do not match', 'Паролите не съвпадат')}</p>
                    )}
                  </div>
                )}
                {/* ═══ CONSENT CHECKBOX (signup only) ═══ */}
                {!isLogin && (
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consentChecked}
                      onChange={e => setConsentChecked(e.target.checked)}
                      className="rounded mt-1 shrink-0"
                    />
                    <label htmlFor="consent" className="text-xs text-muted-foreground leading-snug">
                      {lang === 'bg' ? (
                        <>Прочетох и приемам <Link to="/privacy" target="_blank" className="text-primary hover:underline">Политиката за поверителност</Link> и <Link to="/terms" target="_blank" className="text-primary hover:underline">Условията за ползване</Link> на DigiInnov.</>
                      ) : (
                        <>I have read and accept the <Link to="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</Link> and <Link to="/terms" target="_blank" className="text-primary hover:underline">Terms of Use</Link> of DigiInnov.</>
                      )}
                    </label>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full sim-gradient border-0"
                  disabled={loading || (!isLogin && !signupRole) || (!isLogin && !consentChecked)}
                >
                  {loading ? t.pleaseWait : isLogin ? (
                    <><LogIn className="h-4 w-4 mr-2" /> {t.signIn}</>
                  ) : (
                    <><UserPlus className="h-4 w-4 mr-2" /> {t.createAccount}</>
                  )}
                </Button>

                {!isLogin && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {tx('We collect only minimal information to create your account.', 'Събираме само минимална информация за създаване на акаунта ти.')}
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
              </>
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
                {tx("Enter your email and we'll send you a reset link.", 'Въведи имейла си и ще ти изпратим линк за смяна.')}
              </p>
              <Input
                type="email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder={tx('Your email', 'Твоят имейл')}
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
