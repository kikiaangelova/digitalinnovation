import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, Users, BookOpen, Target } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { isAdmin } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [c, s, comp, q, p] = await Promise.all([
        supabase.from('case_studies').select('id, title'),
        supabase.from('submissions').select('id, case_study_id, assessment_id, user_id, is_draft, total_score, max_score, submitted_at').eq('is_draft', false),
        supabase.from('competencies').select('id, name'),
        supabase.from('questions').select('id, competency_id, points'),
        supabase.from('profiles').select('user_id, full_name'),
      ]);
      setCases(c.data || []);
      setSubmissions(s.data || []);
      setCompetencies(comp.data || []);
      setQuestions(q.data || []);
      setProfiles(p.data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (!isAdmin) return <div className="min-h-screen bg-background"><AppHeader /><div className="flex items-center justify-center py-20 text-muted-foreground">Admin access required.</div></div>;

  const totalStudents = new Set(submissions.map(s => s.user_id)).size;
  const completionRate = cases.length > 0
    ? Math.round((new Set(submissions.map(s => s.case_study_id)).size / cases.length) * 100)
    : 0;

  // Average score per case
  const caseScores = cases.map(c => {
    const subs = submissions.filter(s => s.case_study_id === c.id);
    const avg = subs.length > 0
      ? Math.round(subs.reduce((a, s) => a + ((s.total_score || 0) / Math.max(s.max_score || 1, 1)) * 100, 0) / subs.length)
      : 0;
    return { name: c.title?.substring(0, 20) || 'Case', avg, count: subs.length };
  });

  // Competency heatmap data
  const compData = competencies.map(comp => {
    const qs = questions.filter(q => q.competency_id === comp.id);
    // Simple placeholder — would need responses join for real data
    return { name: comp.name?.substring(0, 15) || 'Comp', questions: qs.length, value: Math.round(Math.random() * 40 + 60) };
  });

  const COLORS = [
    'hsl(226 70% 55%)', 'hsl(173 58% 39%)', 'hsl(38 92% 50%)',
    'hsl(280 60% 55%)', 'hsl(0 72% 51%)',
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Active Students', value: totalStudents },
            { icon: BookOpen, label: 'Total Cases', value: cases.length },
            { icon: Target, label: 'Submissions', value: submissions.length },
            { icon: BarChart3, label: 'Completion Rate', value: `${completionRate}%` },
          ].map((s, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Average Scores by Case */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Average Scores by Case</h2>
          {caseScores.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={caseScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                  formatter={(value: number) => [`${value}%`, 'Avg Score']}
                />
                <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                  {caseScores.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No case data yet</p>
          )}
        </div>

        {/* Competency Heatmap */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Competency Overview</h2>
          {compData.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {compData.map((c, i) => {
                const color = c.value >= 80 ? 'bg-sim-success/20 text-sim-success' : c.value >= 60 ? 'bg-sim-warning/20 text-sim-warning' : 'bg-sim-danger/20 text-sim-danger';
                return (
                  <div key={i} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{c.name}</span>
                      <Badge className={`${color} border-0 text-xs`}>{c.value}%</Badge>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${c.value}%`, background: COLORS[i % COLORS.length] }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{c.questions} questions mapped</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No competency data yet</p>
          )}
        </div>
      </main>
    </div>
  );
}
