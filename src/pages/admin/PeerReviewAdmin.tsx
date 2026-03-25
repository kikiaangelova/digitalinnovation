import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ChevronRight, Users, Shuffle, Star, Edit3, Check, Search } from 'lucide-react';

interface ReviewRow {
  id: string;
  reviewer_user_id: string;
  reviewee_user_id: string;
  clarity_score: number;
  problem_importance_score: number;
  innovation_score: number;
  feasibility_score: number;
  market_potential_score: number;
  average_score: number;
  comments: string | null;
  teacher_override_score: number | null;
  target_type: string;
  created_at: string;
}

interface ProfileMap { [uid: string]: string }

export default function PeerReviewAdmin() {
  const { isAdmin } = useAuth();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileMap>({});
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [search, setSearch] = useState('');
  const [editingOverride, setEditingOverride] = useState<string | null>(null);
  const [overrideValue, setOverrideValue] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const [{ data: revs }, { data: profs }] = await Promise.all([
        supabase.from('peer_reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('user_id, full_name'),
      ]);
      setReviews((revs || []) as ReviewRow[]);
      const map: ProfileMap = {};
      (profs || []).forEach((p: any) => { map[p.user_id] = p.full_name || 'Unknown'; });
      setProfiles(map);
      setLoading(false);
    };
    load();
  }, [isAdmin]);

  const assignPeerReviews = async () => {
    setAssigning(true);
    try {
      // Get all submitted startup projects and case submissions
      const [{ data: startups }, { data: subs }] = await Promise.all([
        supabase.from('startup_projects').select('id, user_id').eq('is_submitted', true),
        supabase.from('submissions').select('id, user_id, case_study_id').eq('is_draft', false),
      ]);

      const assignments: any[] = [];

      // Assign startup reviews: each submitted startup gets 2 random reviewers
      if (startups && startups.length >= 3) {
        const userIds = startups.map(s => s.user_id);
        for (const startup of startups) {
          const candidates = userIds.filter(u => u !== startup.user_id);
          const shuffled = candidates.sort(() => Math.random() - 0.5);
          const reviewers = shuffled.slice(0, 2);
          for (const reviewer of reviewers) {
            assignments.push({
              reviewer_user_id: reviewer,
              reviewee_user_id: startup.user_id,
              target_type: 'startup_project',
              target_id: startup.id,
              status: 'pending',
            });
          }
        }
      }

      // Assign case submission reviews: each submission gets 2 random reviewers from same case
      if (subs && subs.length >= 3) {
        const byCaseId: Record<string, typeof subs> = {};
        for (const s of subs) {
          if (!byCaseId[s.case_study_id]) byCaseId[s.case_study_id] = [];
          byCaseId[s.case_study_id].push(s);
        }
        for (const [caseId, caseSubs] of Object.entries(byCaseId)) {
          if (caseSubs.length < 3) continue;
          const userIds = caseSubs.map(s => s.user_id);
          for (const sub of caseSubs) {
            const candidates = userIds.filter(u => u !== sub.user_id);
            const shuffled = candidates.sort(() => Math.random() - 0.5);
            const reviewers = shuffled.slice(0, 2);
            for (const reviewer of reviewers) {
              assignments.push({
                reviewer_user_id: reviewer,
                reviewee_user_id: sub.user_id,
                target_type: 'case_submission',
                target_id: sub.id,
                submission_id: sub.id,
                status: 'pending',
              });
            }
          }
        }
      }

      if (assignments.length === 0) {
        toast.info(t('Not enough submissions to assign reviews (need at least 3)', 'Недостатъчно предадени работи за разпределение (нужни са поне 3)'));
        setAssigning(false);
        return;
      }

      // Upsert to avoid duplicates
      const { error } = await supabase.from('peer_review_assignments').upsert(assignments, { onConflict: 'reviewer_user_id,target_type,target_id' });
      if (error) throw error;

      toast.success(t(`Assigned ${assignments.length} peer reviews!`, `Разпределени ${assignments.length} рецензии!`));
    } catch (e: any) {
      toast.error(e?.message || 'Error assigning reviews');
    } finally {
      setAssigning(false);
    }
  };

  const saveOverride = async (reviewId: string) => {
    const val = parseFloat(overrideValue);
    if (isNaN(val) || val < 0 || val > 4) {
      toast.error(t('Score must be 0–4', 'Оценката трябва да е 0–4'));
      return;
    }
    const { error } = await supabase.from('peer_reviews').update({ teacher_override_score: val }).eq('id', reviewId);
    if (error) { toast.error('Error'); return; }
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, teacher_override_score: val } : r));
    setEditingOverride(null);
    toast.success(t('Override saved', 'Оценката е запазена'));
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">Access denied</div>
      </div>
    );
  }

  const filtered = reviews.filter(r => {
    if (!search) return true;
    const name = (profiles[r.reviewee_user_id] || '').toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{t('Peer Reviews', 'Партньорски рецензии')}</span>
        </nav>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{t('Peer Review Management', 'Управление на рецензии')}</h1>
            <p className="text-sm text-muted-foreground">{t(`${reviews.length} reviews total`, `${reviews.length} рецензии общо`)}</p>
          </div>
          <Button onClick={assignPeerReviews} disabled={assigning}>
            <Shuffle className="h-4 w-4 mr-2" /> {assigning ? '...' : t('Auto-Assign Reviews', 'Автоматично разпределяне')}
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t('Search by student...', 'Търсене по ученик...')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        {loading ? (
          <p className="text-center py-10 text-muted-foreground">{t('Loading...', 'Зареждане...')}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground">{t('No reviews yet. Click "Auto-Assign Reviews" to distribute work.', 'Няма рецензии. Натиснете "Автоматично разпределяне" за разпределение.')}</p>
        ) : (
          <div className="space-y-3">
            {filtered.map(r => (
              <div key={r.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{profiles[r.reviewee_user_id] || 'Unknown'}</span>
                    <span className="text-xs text-muted-foreground">← {t('reviewed by', 'рецензирано от')} {profiles[r.reviewer_user_id] || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {r.target_type === 'startup_project' ? t('Startup', 'Стартъп') : t('Case', 'Казус')}
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-bold">
                      <Star className="h-3 w-3 mr-1" /> {Number(r.average_score).toFixed(1)}/4
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center mb-3">
                  {[
                    { label: t('Clarity', 'Яснота'), val: r.clarity_score },
                    { label: t('Problem', 'Проблем'), val: r.problem_importance_score },
                    { label: t('Innovation', 'Иновация'), val: r.innovation_score },
                    { label: t('Feasibility', 'Осъществ.'), val: r.feasibility_score },
                    { label: t('Market', 'Пазар'), val: r.market_potential_score },
                  ].map((c, i) => (
                    <div key={i}>
                      <p className="text-sm font-bold text-foreground">{c.val}</p>
                      <p className="text-xs text-muted-foreground">{c.label}</p>
                    </div>
                  ))}
                </div>
                {r.comments && <p className="text-sm text-foreground/80 italic mb-2">"{r.comments}"</p>}
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    {editingOverride === r.id ? (
                      <>
                        <Input type="number" min="0" max="4" step="0.1" value={overrideValue} onChange={e => setOverrideValue(e.target.value)} className="w-20 h-8 text-sm" />
                        <Button size="sm" variant="outline" onClick={() => saveOverride(r.id)}><Check className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingOverride(null)}>✕</Button>
                      </>
                    ) : (
                      <>
                        {r.teacher_override_score !== null && (
                          <Badge className="bg-primary/10 text-primary border-0 text-xs">
                            {t('Override', 'Преоценка')}: {r.teacher_override_score}
                          </Badge>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => { setEditingOverride(r.id); setOverrideValue(r.teacher_override_score?.toString() || ''); }}>
                          <Edit3 className="h-3.5 w-3.5" /> <span className="ml-1 text-xs">{t('Override', 'Преоценка')}</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
