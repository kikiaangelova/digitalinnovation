import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle2, X, Users } from 'lucide-react';
import PageMeta from '@/components/seo/PageMeta';

export default function JoinClassroom() {
  const { code } = useParams<{ code: string }>();
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [classroom, setClassroom] = useState<{ id: string; name: string; teacher_name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate(`/auth?redirect=/join/${code}`);
      return;
    }
    if (!code) { setError('Invalid code'); setLoading(false); return; }

    const lookup = async () => {
      // Secure RPC: returns only safe fields (name, subject, teacher display name).
      const { data: rows } = await supabase.rpc(
        'preview_classroom_by_code' as any,
        { _code: code.toUpperCase() },
      );
      const cr: any = Array.isArray(rows) ? rows[0] : rows;

      if (!cr) {
        setError(t('Invalid or expired code. Check with your teacher.', 'Невалиден или изтекъл код. Провери с учителя.'));
        setLoading(false);
        return;
      }

      if (cr.already_member) {
        setError(t('You are already in this classroom.', 'Вече си в този клас.'));
        setLoading(false);
        return;
      }

      setClassroom({
        id: cr.id,
        name: cr.name,
        teacher_name: cr.teacher_display_name ?? null,
      });
      setLoading(false);
    };
    lookup();
  }, [user, authLoading, code, navigate, lang]);

  const handleJoin = async () => {
    if (!user || !classroom || !code) return;
    setJoining(true);
    const { error: joinErr } = await supabase.rpc(
      'join_classroom_with_code' as any,
      { _code: code.toUpperCase() },
    );
    if (joinErr) {
      toast.error(joinErr.message);
      setJoining(false);
      return;
    }

    setSuccess(true);
    toast.success(t(`Joined ${classroom.name}!`, `Успешно се присъедини към ${classroom.name}!`));
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <PageMeta
        path="/join"
        title={t('Join a Classroom — DigiInnov Case Lab', 'Присъедини се към клас — DigiInnov Case Lab')}
        description={t(
          'Use your class invite code to join your teacher’s classroom on DigiInnov Case Lab and start working on real business cases.',
          'Използвай кода за покана, за да се присъединиш към класа на своя учител в DigiInnov Case Lab и да започнеш с реални бизнес казуси.',
        )}
      />
      <main className="container mx-auto px-4 py-16 max-w-md">
        <h1 className="typo-h1 text-2xl text-center mb-6">
          {t('Join a Classroom', 'Присъедини се към клас')}
        </h1>
        {loading ? (
          <div className="text-center text-muted-foreground py-20">{t('Loading...', 'Зареждане...')}</div>
        ) : error ? (
          <Card className="p-8 text-center space-y-3">
            <X className="h-10 w-10 text-destructive mx-auto" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>{t('Go to dashboard', 'Към таблото')}</Button>
          </Card>
        ) : success ? (
          <Card className="p-8 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto" />
            <h2 className="text-lg font-bold text-foreground">
              ✅ {t('Successfully joined!', 'Успешно се присъедини!')}
            </h2>
            <p className="text-sm text-muted-foreground">{classroom?.name}</p>
          </Card>
        ) : classroom ? (
          <Card className="p-8 text-center space-y-4">
            <Users className="h-10 w-10 text-primary mx-auto" />
            <h2 className="text-lg font-bold text-foreground">
              {t('Join classroom', 'Присъедини се към класа')}
            </h2>
            <div className="space-y-1">
              <p className="text-base font-medium text-foreground">{classroom.name}</p>
              {classroom.teacher_name && (
                <p className="text-sm text-muted-foreground">
                  {t('Teacher:', 'Учител:')} {classroom.teacher_name}
                </p>
              )}
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleJoin} disabled={joining} className="sim-gradient border-0">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                {joining ? t('Joining...', 'Присъединяване...') : t('Join', 'Присъедини се')}
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>{t('Cancel', 'Отказ')}</Button>
            </div>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
