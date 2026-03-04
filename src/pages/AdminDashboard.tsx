import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
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

export default function AdminDashboard() {
  const { isAdmin, user } = useAuth();
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
      profsRes.data?.forEach(p => { pm[p.user_id] = p.full_name || 'Unknown'; });
      setProfiles(pm);
      setLoading(false);
    };
    fetchData();
  }, [isAdmin]);

  const togglePublish = async (caseId: string, published: boolean) => {
    await supabase.from('case_studies').update({ published: !published }).eq('id', caseId);
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, published: !published } : c));
    toast.success(published ? 'Case unpublished' : 'Case published');
  };

  const createCase = async () => {
    if (!newTitle.trim()) { toast.error('Title required'); return; }
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

    if (error) { toast.error('Failed to create case'); return; }
    if (data) {
      setCases(prev => [data, ...prev]);
      setShowCreate(false);
      setNewTitle(''); setNewDesc(''); setNewTopic(''); setNewReadingUrl(''); setNewReadingLabel('');
      toast.success('Case created');
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
    toast.success('Score updated');
  };

  const exportCSV = () => {
    const headers = ['Student', 'Case', 'Score', 'Max Score', 'Percentage', 'Submitted At'];
    const rows = submissions.map(s => {
      const caseName = cases.find(c => c.id === s.case_study_id)?.title || '';
      const studentName = profiles[s.user_id] || 'Unknown';
      const pct = s.max_score ? Math.round(((s.total_score || 0) / s.max_score) * 100) : 0;
      return [studentName, caseName, s.total_score || 0, s.max_score || 0, `${pct}%`, s.submitted_at || ''].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'grades_export.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Grades exported');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          Admin access required. Contact your instructor.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-1" /> Export Grades
            </Button>
            <Button size="sm" onClick={() => setShowCreate(!showCreate)} className="sim-gradient border-0">
              <Plus className="h-4 w-4 mr-1" /> New Case
            </Button>
          </div>
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Create New Case Study</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Title</Label>
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Case title" />
              </div>
              <div>
                <Label>Topic</Label>
                <Input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="e.g., Digital Strategy" />
              </div>
              <div>
                <Label>Difficulty</Label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={newDiff} onChange={e => setNewDiff(e.target.value)}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <Label>Est. Minutes</Label>
                <Input type="number" value={newMinutes} onChange={e => setNewMinutes(parseInt(e.target.value))} />
              </div>
              <div>
                <Label>Reading URL (optional)</Label>
                <Input value={newReadingUrl} onChange={e => setNewReadingUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label>Reading Button Label</Label>
                <Input value={newReadingLabel} onChange={e => setNewReadingLabel(e.target.value)} placeholder="Open Required Reading" />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Describe the case scenario..." />
            </div>
            <div className="flex gap-2">
              <Button onClick={createCase} className="sim-gradient border-0">Create Case</Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Cases */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Case Studies</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Topic</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Difficulty</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map(c => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{c.title}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.topic || '—'}</td>
                    <td className="px-4 py-3"><Badge variant="outline" className="text-xs capitalize">{c.difficulty}</Badge></td>
                    <td className="px-4 py-3">
                      {c.published ? (
                        <Badge className="bg-sim-success/10 text-sim-success border-0 text-xs">Published</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Draft</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" onClick={() => togglePublish(c.id, c.published)}>
                        {c.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submissions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Submissions</h2>
          <div className="space-y-3">
            {submissions.slice(0, 20).map(s => {
              const caseName = cases.find(c => c.id === s.case_study_id)?.title || 'Unknown';
              const isExpanded = expandedSub === s.id;
              return (
                <div key={s.id} className="rounded-xl border border-border bg-card">
                  <button
                    onClick={() => viewSubmission(s.id)}
                    className="w-full p-4 flex items-center justify-between text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{profiles[s.user_id] || 'Unknown Student'}</p>
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
                            <strong>Answer:</strong> {r.answer ? (typeof r.answer === 'string' ? r.answer : JSON.stringify(r.answer)) : 'No answer'}
                          </p>
                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <Label className="text-xs">Score</Label>
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
                              <Label className="text-xs">Feedback</Label>
                              <Input
                                defaultValue={r.feedback || ''}
                                className="h-8"
                                placeholder="Add feedback..."
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
              <p className="text-center py-8 text-muted-foreground">No submissions yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
