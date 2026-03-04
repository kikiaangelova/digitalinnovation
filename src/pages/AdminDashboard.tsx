import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  BookOpen, Users, FileText, Download, Plus, Eye, EyeOff,
  Trash2, ChevronDown, ChevronRight, MessageSquare,
} from 'lucide-react';

interface CaseStudyAdmin {
  id: string;
  title: string;
  topic: string | null;
  difficulty: string;
  published: boolean;
  created_at: string;
}

interface SubmissionAdmin {
  id: string;
  case_study_id: string;
  user_id: string;
  is_draft: boolean;
  total_score: number | null;
  max_score: number | null;
  submitted_at: string | null;
}

const DIFFICULTY_LABELS: Record<string, { en: string; bg: string }> = {
  beginner: { en: 'Beginner', bg: 'Начинаещ' },
  intermediate: { en: 'Intermediate', bg: 'Средно ниво' },
  advanced: { en: 'Advanced', bg: 'Напреднал' },
};

export default function AdminDashboard() {
  const { isAdmin, user } = useAuth();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [cases, setCases] = useState<CaseStudyAdmin[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionAdmin[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [showCreate, setShowCreate] = useState(false);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [subResponses, setSubResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newDiff, setNewDiff] = useState('intermediate');
  const [newMinutes, setNewMinutes] = useState(60);
  const [newReadingUrl, setNewReadingUrl] = useState('');
  const [newReadingLabel, setNewReadingLabel] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      const [casesRes, subsRes, profsRes] = await Promise.all([
        supabase.from('case_studies').select('id, title, topic, difficulty, published, created_at').order('created_at', { ascending: false }),
        supabase.from('submissions').select('id, case_study_id, user_id, is_draft, total_score, max_score, submitted_at').eq('is_draft', false).order('submitted_at', { ascending: false }),
        supabase.from('profiles').select('user_id, full_name'),
      ]);
      setCases(casesRes.data || []);
      setSubmissions(subsRes.data || []);
      const pm: Record<string, string> = {};
      profsRes.data?.forEach(p => { pm[p.user_id] = p.full_name || t('Unknown', 'Неизвестен'); });
      setProfiles(pm);
      setLoading(false);
    };
    fetchData();
  }, [isAdmin]);

  const togglePublish = async (caseId: string, published: boolean) => {
    await supabase.from('case_studies').update({ published: !published }).eq('id', caseId);
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, published: !published } : c));
    toast.success(published ? t('Case unpublished', 'Казусът е скрит') : t('Case published', 'Казусът е публикуван'));
  };

  const createCase = async () => {
    if (!newTitle.trim()) { toast.error(t('Title required', 'Заглавието е задължително')); return; }
    const { data, error } = await supabase.from('case_studies').insert({
      title: newTitle,
      description: newDesc,
      topic: newTopic,
      difficulty: newDiff as any,
      est_minutes: newMinutes,
      reading_url: newReadingUrl || null,
      reading_button_label: newReadingLabel || null,
      published: false,
      created_by: user?.id,
    }).select('id, title, topic, difficulty, published, created_at').single();

    if (error) { toast.error(t('Failed to create case', 'Грешка при създаване на казус')); return; }
    if (data) {
      setCases(prev => [data, ...prev]);
      setShowCreate(false);
      setNewTitle(''); setNewDesc(''); setNewTopic(''); setNewReadingUrl(''); setNewReadingLabel('');
      toast.success(t('Case created', 'Казусът е създаден'));
    }
  };

  const viewSubmission = async (subId: string) => {
    if (expandedSub === subId) { setExpandedSub(null); return; }
    setExpandedSub(subId);
    const { data } = await supabase.from('responses').select('id, question_id, answer, score, feedback').eq('submission_id', subId);
    setSubResponses(data || []);
  };

  const updateScore = async (responseId: string, score: number, feedback: string) => {
    await supabase.from('responses').update({ score, feedback }).eq('id', responseId);
    setSubResponses(prev => prev.map(r => r.id === responseId ? { ...r, score, feedback } : r));
    toast.success(t('Score updated', 'Оценката е обновена'));
  };

  const exportCSV = () => {
    const headers = [t('Student', 'Ученик'), t('Case', 'Казус'), t('Score', 'Оценка'), t('Max Score', 'Макс. оценка'), '%', t('Submitted At', 'Подадено на')];
    const rows = submissions.map(s => {
      const caseName = cases.find(c => c.id === s.case_study_id)?.title || '';
      const studentName = profiles[s.user_id] || t('Unknown', 'Неизвестен');
      const pct = s.max_score ? Math.round(((s.total_score || 0) / s.max_score) * 100) : 0;
      return [studentName, caseName, s.total_score || 0, s.max_score || 0, `${pct}%`, s.submitted_at || ''].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'grades_export.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success(t('Grades exported', 'Оценките са експортирани'));
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          {t('Admin access required. Contact your instructor.', 'Необходим е администраторски достъп. Свържете се с преподавателя си.')}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('Admin Dashboard', 'Администраторско табло')}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-1" /> {t('Export Grades', 'Експорт на оценки')}
            </Button>
            <Button size="sm" onClick={() => setShowCreate(!showCreate)} className="sim-gradient border-0">
              <Plus className="h-4 w-4 mr-1" /> {t('New Case', 'Нов казус')}
            </Button>
          </div>
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-foreground">{t('Create New Case Study', 'Създай нов казус')}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>{t('Title', 'Заглавие')}</Label>
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder={t('Case title', 'Заглавие на казуса')} />
              </div>
              <div>
                <Label>{t('Topic', 'Тема')}</Label>
                <Input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder={t('e.g., Digital Strategy', 'напр. Дигитална стратегия')} />
              </div>
              <div>
                <Label>{t('Difficulty', 'Трудност')}</Label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={newDiff} onChange={e => setNewDiff(e.target.value)}>
                  <option value="beginner">{t('Beginner', 'Начинаещ')}</option>
                  <option value="intermediate">{t('Intermediate', 'Средно ниво')}</option>
                  <option value="advanced">{t('Advanced', 'Напреднал')}</option>
                </select>
              </div>
              <div>
                <Label>{t('Est. Minutes', 'Прибл. минути')}</Label>
                <Input type="number" value={newMinutes} onChange={e => setNewMinutes(parseInt(e.target.value))} />
              </div>
              <div>
                <Label>{t('Reading URL (optional)', 'URL за четене (незадълж.)')}</Label>
                <Input value={newReadingUrl} onChange={e => setNewReadingUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label>{t('Reading Button Label', 'Етикет на бутон за четене')}</Label>
                <Input value={newReadingLabel} onChange={e => setNewReadingLabel(e.target.value)} placeholder={t('Open Required Reading', 'Отвори задължително четиво')} />
              </div>
            </div>
            <div>
              <Label>{t('Description', 'Описание')}</Label>
              <Textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder={t('Describe the case scenario...', 'Опишете сценария на казуса...')} />
            </div>
            <div className="flex gap-2">
              <Button onClick={createCase} className="sim-gradient border-0">{t('Create Case', 'Създай казус')}</Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>{t('Cancel', 'Отказ')}</Button>
            </div>
          </div>
        )}

        {/* Cases */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('Case Studies', 'Казуси')}</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Title', 'Заглавие')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Topic', 'Тема')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Difficulty', 'Трудност')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Status', 'Статус')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Actions', 'Действия')}</th>
                </tr>
              </thead>
              <tbody>
                {cases.map(c => {
                  const diffLabel = DIFFICULTY_LABELS[c.difficulty];
                  return (
                    <tr key={c.id} className="border-t border-border">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{c.title}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{c.topic || '—'}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{diffLabel ? (lang === 'bg' ? diffLabel.bg : diffLabel.en) : c.difficulty}</Badge></td>
                      <td className="px-4 py-3">
                        {c.published ? (
                          <Badge className="bg-sim-success/10 text-sim-success border-0 text-xs">{t('Published', 'Публикуван')}</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">{t('Draft', 'Чернова')}</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => togglePublish(c.id, c.published)}>
                          {c.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submissions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('Recent Submissions', 'Скорошни подавания')}</h2>
          <div className="space-y-3">
            {submissions.slice(0, 20).map(s => {
              const caseName = cases.find(c => c.id === s.case_study_id)?.title || t('Unknown', 'Неизвестен');
              const isExpanded = expandedSub === s.id;
              return (
                <div key={s.id} className="rounded-xl border border-border bg-card">
                  <button
                    onClick={() => viewSubmission(s.id)}
                    className="w-full p-4 flex items-center justify-between text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{profiles[s.user_id] || t('Unknown Student', 'Неизвестен ученик')}</p>
                      <p className="text-xs text-muted-foreground">{caseName} · {s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{s.total_score || 0}/{s.max_score || 0}</Badge>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-border p-4 space-y-3">
                      {subResponses.map(r => (
                        <div key={r.id} className="rounded-lg border border-border p-3 space-y-2">
                          <p className="text-sm text-foreground">
                            <strong>{t('Answer:', 'Отговор:')}</strong> {r.answer ? (typeof r.answer === 'string' ? r.answer : JSON.stringify(r.answer)) : t('No answer', 'Няма отговор')}
                          </p>
                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <Label className="text-xs">{t('Score', 'Оценка')}</Label>
                              <Input
                                type="number"
                                defaultValue={r.score || 0}
                                className="h-8"
                                onBlur={e => {
                                  const newScore = parseInt(e.target.value);
                                  if (!isNaN(newScore)) updateScore(r.id, newScore, r.feedback || '');
                                }}
                              />
                            </div>
                            <div className="flex-[3]">
                              <Label className="text-xs">{t('Feedback', 'Обратна връзка')}</Label>
                              <Input
                                defaultValue={r.feedback || ''}
                                className="h-8"
                                placeholder={t('Add feedback...', 'Добавете обратна връзка...')}
                                onBlur={e => updateScore(r.id, r.score || 0, e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {submissions.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">{t('No submissions yet', 'Все още няма подавания')}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
