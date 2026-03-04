import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Users, Copy, Plus, ArrowLeft, FileText, MessageSquare } from 'lucide-react';

export default function TeamWorkspace() {
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuth();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [sharedNotes, setSharedNotes] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;
    const fetch = async () => {
      const { data: td } = await supabase.from('teams').select('*').eq('id', teamId).single();
      if (td) { setTeam(td); setJoinCode(td.join_code || ''); }
      const { data: m } = await supabase.from('team_members').select('id, user_id, role, profiles(full_name, avatar_url)').eq('team_id', teamId);
      setMembers(m || []);
      const { data: s } = await supabase.from('submissions').select('id, case_study_id, total_score, max_score, is_draft, submitted_at, case_studies(title)').eq('team_id', teamId);
      setSubmissions(s || []);
      setLoading(false);
    };
    fetch();
  }, [teamId]);

  const copyJoinCode = () => {
    navigator.clipboard.writeText(joinCode);
    toast.success(t('Join code copied!', 'Кодът за присъединяване е копиран!'));
  };

  if (loading) return <div className="min-h-screen bg-background"><AppHeader /><div className="flex items-center justify-center py-20 text-muted-foreground">{t('Loading...', 'Зареждане...')}</div></div>;
  if (!team) return <div className="min-h-screen bg-background"><AppHeader /><div className="flex items-center justify-center py-20 text-muted-foreground">{t('Team not found', 'Екипът не е намерен')}</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <Button variant="ghost" size="sm" asChild><Link to="/dashboard"><ArrowLeft className="h-4 w-4 mr-1" /> {t('Dashboard', 'Табло')}</Link></Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{team.name}</h1>
            <p className="text-sm text-muted-foreground">{t('Team Workspace', 'Работно пространство на екипа')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">{joinCode}</Badge>
            <Button variant="outline" size="sm" onClick={copyJoinCode}><Copy className="h-3 w-3" /></Button>
          </div>
        </div>

        {/* Members */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> {t('Members', 'Членове')}</h3>
          <div className="space-y-2">
            {members.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <span className="text-sm font-medium text-foreground">{(m.profiles as any)?.full_name || t('Unknown', 'Неизвестен')}</span>
                <Badge variant="outline" className="text-xs capitalize">{m.role === 'member' ? t('Member', 'Член') : m.role}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Notes */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> {t('Shared Notes', 'Споделени бележки')}</h3>
          <Textarea
            value={sharedNotes}
            onChange={e => setSharedNotes(e.target.value)}
            placeholder={t('Collaborate with your team — notes, ideas, plans...', 'Сътрудничете с екипа си — бележки, идеи, планове...')}
            className="min-h-[120px]"
          />
        </div>

        {/* Submissions */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> {t('Submissions', 'Предадени работи')}</h3>
          {submissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('No submissions yet', 'Все още няма предадени работи')}</p>
          ) : (
            <div className="space-y-2">
              {submissions.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                  <span className="text-sm text-foreground">{(s.case_studies as any)?.title || t('Assessment', 'Оценка')}</span>
                  <div className="flex items-center gap-2">
                    {s.is_draft ? (
                      <Badge className="bg-sim-warning/10 text-sim-warning border-0 text-xs">{t('Draft', 'Чернова')}</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">{s.total_score}/{s.max_score}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
