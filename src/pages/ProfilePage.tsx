import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Save, Award, BookOpen, Users, BarChart3 } from 'lucide-react';

const SKILL_OPTIONS = ['UX', 'Data', 'Strategy', 'PM', 'Marketing', 'AI', 'Engineering', 'Design', 'Finance', 'Operations'];

export default function ProfilePage() {
  const { user, profile: authProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [skillsTags, setSkillsTags] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [profileVisible, setProfileVisible] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: p } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (p) {
        setFullName(p.full_name || '');
        setBio((p as any).bio || '');
        setSkillsTags((p as any).skills_tags || []);
        setInterests((p as any).interests || []);
        const links = (p as any).links_json || {};
        setLinkedIn(links.linkedin || '');
        setPortfolio(links.portfolio || '');
        setProfileVisible((p as any).profile_visible ?? true);
      }
      const { data: subs } = await supabase.from('submissions').select('case_study_id, total_score, max_score, is_draft').eq('user_id', user.id).eq('is_draft', false);
      setSubmissions(subs || []);
      const { data: ub } = await supabase.from('user_badges').select('badge_id, earned_at, badges(name, description, icon)').eq('user_id', user.id);
      setBadges(ub || []);
      const { data: tm } = await supabase.from('team_members').select('team_id, role, teams(name, cohort_id)').eq('user_id', user.id);
      setTeams(tm || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      full_name: fullName,
      bio,
      skills_tags: skillsTags,
      interests,
      links_json: { linkedin: linkedIn, portfolio },
      profile_visible: profileVisible,
    } as any).eq('user_id', user.id);
    if (error) toast.error('Failed to save profile');
    else toast.success('Profile saved');
    setSaving(false);
  };

  const toggleSkill = (skill: string) => {
    setSkillsTags(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests(prev => [...prev, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const completedCount = submissions.length;
  const avgScore = completedCount > 0
    ? Math.round(submissions.reduce((a, s) => a + ((s.total_score || 0) / (s.max_score || 1)) * 100, 0) / completedCount)
    : 0;

  if (loading) {
    return <div className="min-h-screen bg-background"><AppHeader /><div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        <h1 className="text-2xl font-display font-bold text-foreground">My Profile</h1>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <BookOpen className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Cases Done</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <BarChart3 className="h-5 w-5 text-sim-info mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{avgScore}%</p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <Award className="h-5 w-5 text-sim-warning mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{badges.length}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-3">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {badges.map((b: any) => (
                <Badge key={b.badge_id} className="bg-accent text-accent-foreground">
                  <Award className="h-3 w-3 mr-1" /> {b.badges?.name || 'Badge'}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Teams */}
        {teams.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-3">Teams</h3>
            <div className="space-y-2">
              {teams.map((t: any) => (
                <div key={t.team_id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{t.teams?.name || 'Team'}</span>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">{t.role}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit form */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-5">
          <h3 className="font-display font-semibold text-foreground">Edit Profile</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Full Name</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div>
              <Label>LinkedIn URL</Label>
              <Input value={linkedIn} onChange={e => setLinkedIn(e.target.value)} placeholder="https://linkedin.com/in/..." />
            </div>
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." className="min-h-[80px]" />
          </div>
          <div>
            <Label>Portfolio URL</Label>
            <Input value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label className="mb-2 block">Skills</Label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    skillsTags.includes(skill) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Interests</Label>
            <div className="flex gap-2 mb-2">
              <Input value={interestInput} onChange={e => setInterestInput(e.target.value)} placeholder="Add interest..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addInterest())} />
              <Button variant="outline" size="sm" onClick={addInterest}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map(i => (
                <Badge key={i} variant="outline" className="cursor-pointer" onClick={() => setInterests(prev => prev.filter(x => x !== i))}>{i} ×</Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={profileVisible} onChange={e => setProfileVisible(e.target.checked)} className="rounded" />
            <Label>Visible to classmates in my cohort</Label>
          </div>
          <Button onClick={handleSave} disabled={saving} className="sim-gradient border-0">
            <Save className="h-4 w-4 mr-1" /> {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </main>
    </div>
  );
}
