import { useSimulator } from '@/context/SimulatorContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, BarChart3, CheckCircle2, Clock } from 'lucide-react';

export default function SimulatorAdmin() {
  const { seasons, teams, submissions, currentUser, switchRole } = useSimulator();
  const navigate = useNavigate();

  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Admin access required</p>
          <Button onClick={() => switchRole('admin')}>Switch to Admin</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/simulator')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Simulator Admin</h1>
            <p className="text-sm text-muted-foreground">Manage seasons, teams, and results</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Seasons */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Simulation Seasons</h2>
          <div className="space-y-4">
            {seasons.map(season => {
              const seasonTeams = teams.filter(t => t.season_id === season.id);
              const totalSubmissions = submissions.filter(s =>
                seasonTeams.some(t => t.id === s.team_id) && !s.is_draft
              ).length;

              return (
                <Link
                  key={season.id}
                  to={`/admin/simulator/season/${season.id}`}
                  className="block rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{season.theme}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{season.description}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
                      {season.difficulty}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {seasonTeams.length} teams
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      {totalSubmissions} submissions
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {season.weeks} weeks
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Teams Overview */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">All Teams</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Team</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Season</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Members</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rounds Done</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Join Code</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(team => {
                  const season = seasons.find(s => s.id === team.season_id);
                  const roundsDone = submissions.filter(s => s.team_id === team.id && !s.is_draft).length;
                  return (
                    <tr key={team.id} className="border-t border-border">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{team.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{season?.theme || '—'}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{team.members.length}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{roundsDone}/{season?.weeks || 0}</td>
                      <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{team.join_code}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
