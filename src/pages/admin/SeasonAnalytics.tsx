import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { useSimulator } from '@/context/SimulatorContext';
import KPIDashboard from '@/components/simulator/KPIDashboard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageSquare, Download, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function SeasonAnalytics() {
  const { isAdmin, loading } = useAuth();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    seasons, teams, submissions, outcomeReports,
    getLatestCompanyState, getCompanyStateHistory, addInstructorComment,
  } = useSimulator();

  const season = seasons.find(s => s.id === id);
  const seasonTeams = season ? teams.filter(t => t.season_id === season.id) : [];

  const [selectedTeam, setSelectedTeam] = useState(seasonTeams[0]?.id || '');
  const [comment, setComment] = useState('');
  const [commentRound, setCommentRound] = useState('');

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  if (!season) return <div className="p-8 text-center text-muted-foreground">{t('Season not found', 'Сезонът не е намерен')}</div>;

  const team = seasonTeams.find(t => t.id === selectedTeam);
  const latestState = team ? getLatestCompanyState(team.id) : null;
  const history = team ? getCompanyStateHistory(team.id) : [];
  const teamSubmissions = submissions.filter(s => s.team_id === selectedTeam && !s.is_draft);
  const teamReports = outcomeReports.filter(r => r.team_id === selectedTeam);

  const handleAddComment = () => {
    if (!comment.trim() || !commentRound) return;
    addInstructorComment(selectedTeam, commentRound, comment);
    setComment('');
    setCommentRound('');
    toast.success(t('Comment added', 'Коментарът е добавен'));
  };

  const exportCSV = () => {
    if (!team || !latestState) return;
    const headers = ['Week', 'users_total', 'active_users', 'churn_rate', 'conversion_rate', 'cac', 'arpu', 'revenue', 'burn_rate', 'runway_months', 'nps', 'product_quality', 'tech_debt', 'brand_trust', 'compliance_risk'];
    const rows = history.map(s => {
      const k = s.kpis;
      return [s.week_number, k.users_total, k.active_users, k.churn_rate, k.conversion_rate, k.cac, k.arpu, k.revenue, k.burn_rate, k.runway_months, k.nps, k.product_quality, k.tech_debt, k.brand_trust, k.compliance_risk].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${team.name}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t('CSV exported', 'CSV файлът е експортиран'));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/simulator')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">{season.theme}</h1>
              <p className="text-sm text-muted-foreground">{t('Season Analytics', 'Анализ на сезона')}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV} disabled={!team}>
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Team Selector */}
        <div className="flex gap-2 flex-wrap">
          {seasonTeams.map(t => (
            <Button
              key={t.id}
              variant={selectedTeam === t.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTeam(t.id)}
            >
              {t.name}
            </Button>
          ))}
        </div>

        {/* Current State */}
        {latestState && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Latest KPIs — {team?.name}</h2>
            <KPIDashboard kpis={latestState.kpis} />
          </div>
        )}

        {/* Submission Timeline */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Decision Timeline</h2>
          <div className="space-y-4">
            {teamSubmissions.map(sub => {
              const round = season.rounds.find(r => r.id === sub.round_id);
              const report = teamReports.find(r => r.round_id === sub.round_id);
              return (
                <div key={sub.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">Week {round?.week_number}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {sub.answers.map(ans => {
                      const decision = round?.decisions.find(d => d.id === ans.decision_template_id);
                      const option = decision?.options.find(o => o.id === ans.answer);
                      return (
                        <div key={ans.decision_template_id} className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">{decision?.title}:</span>
                          <span className="font-medium text-foreground">{option?.label || ans.answer}</span>
                        </div>
                      );
                    })}
                  </div>
                  {sub.rationale && (
                    <p className="mt-3 text-sm text-muted-foreground italic">"{sub.rationale.substring(0, 200)}{sub.rationale.length > 200 ? '...' : ''}"</p>
                  )}
                  {report?.instructor_comment && (
                    <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <p className="text-xs font-medium text-primary mb-1">Instructor Comment</p>
                      <p className="text-sm text-foreground">{report.instructor_comment}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Comment */}
        {teamSubmissions.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Add Instructor Comment
            </h3>
            <select
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mb-3"
              value={commentRound}
              onChange={e => setCommentRound(e.target.value)}
            >
              <option value="">Select round...</option>
              {teamSubmissions.map(sub => {
                const round = season.rounds.find(r => r.id === sub.round_id);
                return <option key={sub.round_id} value={sub.round_id}>Week {round?.week_number}</option>;
              })}
            </select>
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Write your feedback..."
              className="mb-3"
            />
            <Button size="sm" onClick={handleAddComment} disabled={!comment.trim() || !commentRound}>
              Add Comment
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
