import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GraduationCap, LogOut, RefreshCw } from 'lucide-react';

export default function PendingApproval() {
  const { user, profile, signOut, refreshRole, userRole } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [checkedOnce, setCheckedOnce] = useState(false);
  const tx = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [institution, setInstitution] = useState('');
  const [className, setClassName] = useState('');

  // Fetch teacher metadata
  useState(() => {
    if (!user) return;
    supabase.from('profiles').select('institution, class_name').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setInstitution((data as any).institution || '');
          setClassName((data as any).class_name || '');
        }
      });
  });

  const handleCheckStatus = async () => {
    setChecking(true);
    await refreshRole();
    setCheckedOnce(true);
    // Re-read from DB
    const { data } = await supabase.from('user_roles').select('role').eq('user_id', user!.id).maybeSingle();
    if (data?.role === 'teacher_verified') {
      toast.success(tx('Your account has been approved!', 'Акаунтът ти беше одобрен!'));
      navigate('/dashboard');
    } else {
      toast.info(tx('Still awaiting approval.', 'Все още изчакваш одобрение.'));
    }
    setChecking(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center space-y-6">
        <div className="text-5xl">👩‍🏫</div>
        <h1 className="text-2xl font-bold text-foreground">
          {tx('Your application has been submitted', 'Заявката ти е изпратена')}
        </h1>
        <div className="space-y-2 text-muted-foreground">
          <p>{tx('Your account has been created successfully.', 'Акаунтът ти е създаден успешно.')}</p>
          <p>{tx('You are awaiting approval from an administrator.', 'Очакваш одобрение от администратор.')}</p>
          <p className="text-sm">
            {tx('You will receive an email when you are approved.', 'Ще получиш имейл, когато бъдеш одобрен/а.')}
          </p>
        </div>

        {(institution || className) && (
          <div className="rounded-lg bg-muted/50 p-4 text-left space-y-1">
            {institution && (
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">{tx('Institution:', 'Институция:')}</span> {institution}
              </p>
            )}
            {className && (
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">{tx('Class/Group:', 'Клас/Група:')}</span> {className}
              </p>
            )}
          </div>
        )}

        {checkedOnce && userRole === 'teacher_pending' && (
          <p className="text-sm text-amber-600 font-medium">
            {tx('Still awaiting approval.', 'Все още изчакваш одобрение.')}
          </p>
        )}

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-1" />
            {tx('Sign Out', 'Излез')}
          </Button>
          <Button onClick={handleCheckStatus} disabled={checking} className="sim-gradient border-0">
            <RefreshCw className={`h-4 w-4 mr-1 ${checking ? 'animate-spin' : ''}`} />
            {checking ? tx('Checking...', 'Проверка...') : tx('Check Status', 'Провери статуса')}
          </Button>
        </div>
      </div>
    </div>
  );
}
