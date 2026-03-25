import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLang } from '@/context/LangContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { GraduationCap, Eye, EyeOff, KeyRound } from 'lucide-react';
import PasswordStrengthMeter, { checkPassword, getStrength } from '@/components/auth/PasswordStrengthMeter';

export default function ResetPasswordPage() {
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event from the hash fragment
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
      setChecked(true);
    });

    // Also check the hash for type=recovery (in case the event already fired)
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }
    setChecked(true);

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const checks = checkPassword(password, '');
    if (!checks.minLength) {
      toast.error(t('Password must be at least 8 characters', 'Паролата трябва да бъде поне 8 символа'));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t('Passwords do not match', 'Паролите не съвпадат'));
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('Password successfully updated. Please sign in.', 'Паролата е успешно обновена. Моля, влезте.'));
      await supabase.auth.signOut();
      navigate('/auth');
    }
  };

  if (!checked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t('Loading...', 'Зареждане...')}</div>
      </div>
    );
  }

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-sm text-center">
          <KeyRound className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">
            {t('Invalid or Expired Link', 'Невалидна или изтекла връзка')}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {t('This password reset link is invalid or has expired. Please request a new one.', 'Тази връзка за смяна на парола е невалидна или е изтекла. Моля, поискайте нова.')}
          </p>
          <Button onClick={() => navigate('/auth')} variant="outline">
            {t('Back to Sign In', 'Обратно към вход')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg sim-gradient">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
          {t('Set New Password', 'Задайте нова парола')}
        </h2>
        <p className="text-muted-foreground mb-6 text-center text-sm">
          {t('Enter your new password below.', 'Въведете новата си парола по-долу.')}
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <Label htmlFor="newPassword">{t('New Password', 'Нова парола')}</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
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
            <PasswordStrengthMeter password={password} lang={lang} />
          </div>

          <div>
            <Label htmlFor="confirmNewPassword">{t('Confirm Password', 'Потвърдете паролата')}</Label>
            <div className="relative">
              <Input
                id="confirmNewPassword"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
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
              <p className="text-xs text-destructive mt-1">{t('Passwords do not match', 'Паролите не съвпадат')}</p>
            )}
          </div>

          <Button type="submit" className="w-full sim-gradient border-0" disabled={loading}>
            {loading ? t('Updating...', 'Обновяване...') : t('Update Password', 'Обнови паролата')}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={() => navigate('/auth')} className="text-xs text-muted-foreground hover:text-foreground">
            {t('Back to Sign In', 'Обратно към вход')}
          </button>
        </div>
      </div>
    </div>
  );
}
