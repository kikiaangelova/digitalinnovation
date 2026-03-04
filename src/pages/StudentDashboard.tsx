import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppHeader from '@/components/layout/AppHeader';
import { BookOpen, Clock, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react';

interface CaseStudyRow {
  id: string;
  title: string;
  description: string | null;
  topic: string | null;
  difficulty: string;
  est_minutes: number | null;
  outcomes: string[] | null;
}

interface SubmissionRow {
  case_study_id: string;
  is_draft: boolean;
  total_score: number | null;
  max_score: number | null;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [cases, setCases] = useState<CaseStudyRow[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [casesRes, subsRes] = await Promise.all([
        supabase.from('case_studies').select('id, title, description, topic, difficulty, est_minutes, outcomes').eq('published', true),
        supabase.from('submissions').select('case_study_id, is_draft, total_score, max_score').eq('user_id', user.id),
      ]);
      setCases(casesRes.data || []);
      setSubmissions(subsRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const getSubmission = (caseId: string) => submissions.find(s => s.case_study_id === caseId);

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'beginner': return 'bg-sim-success/10 text-sim-success';
      case 'intermediate': return 'bg-sim-warning/10 text-sim-warning';
      case 'advanced': return 'bg-sim-danger/10 text-sim-danger';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const completedCount = submissions.filter(s => !s.is_draft).length;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{cases.length}</p>
                <p className="text-sm text-muted-foreground">Available Cases</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sim-success/10">
                <CheckCircle2 className="h-5 w-5 text-sim-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sim-info/10">
                <BarChart3 className="h-5 w-5 text-sim-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {completedCount > 0
                    ? Math.round(submissions.filter(s => !s.is_draft && s.total_score).reduce((a, s) => a + (s.total_score || 0), 0) / completedCount)
                    : '—'}
                </p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-4">Case Library</h2>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading cases...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cases.map(c => {
              const sub = getSubmission(c.id);
              const isComplete = sub && !sub.is_draft;
              const isDraft = sub && sub.is_draft;

              return (
                <Link
                  key={c.id}
                  to={isComplete ? `/case/${c.id}/results` : `/case/${c.id}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:border-primary/40"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className={`text-xs ${difficultyColor(c.difficulty)}`}>
                      {c.difficulty}
                    </Badge>
                    {isComplete && (
                      <Badge className="bg-sim-success/10 text-sim-success border-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {sub.total_score}/{sub.max_score}
                      </Badge>
                    )}
                    {isDraft && (
                      <Badge className="bg-sim-warning/10 text-sim-warning border-0">In Progress</Badge>
                    )}
                  </div>

                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {c.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{c.description}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {c.topic && <span className="truncate">{c.topic}</span>}
                    {c.est_minutes && (
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="h-3 w-3" /> {c.est_minutes} min
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    {isComplete ? 'View Results' : isDraft ? 'Continue' : 'Start Case'}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
