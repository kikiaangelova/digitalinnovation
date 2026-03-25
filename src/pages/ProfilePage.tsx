import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { User, Save, Award, BookOpen, Users, BarChart3 } from 'lucide-react';

const SKILL_OPTIONS = ['UX', 'Data', 'Strategy', 'PM', 'Marketing', 'AI', 'Engineering', 'Design', 'Finance', 'Operations'];

const COUNTRY_OPTIONS = ['Bulgaria', 'Romania', 'Greece', 'Serbia', 'Turkey', 'Germany', 'UK', 'USA', 'Other'];

export default function ProfilePage() {
  const { user, profile: authProfile } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [skillsTags, setSkillsTags] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [school, setSchool] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [country, setCountry] = useState('');
  const [profileVisible, setProfileVisible] = useState(true);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: p } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
      if (p) {
        setFullName(p.full_name || '');
        setDisplayName((p as any).display_name || '');
        setBio((p as any).bio || '');
        setSkillsTags((p as any).skills_tags || []);
        setInterests((p as any).interests || []);
        const links = (p as any).links_json || {};
        setLinkedIn(links.linkedin || '');
        setPortfolio(links.portfolio || '');
        setSchool(links.school || '');
        setClassGrade(links.class_grade || '');
        setCountry(links.country || '');
        setProfileVisible((p as any).profile_visible ?? true);
        setLeaderboardVisible((p as any).leaderboard_visible ?? false);
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
      display_name: displayName,
      bio,
      skills_tags: skillsTags,
      interests,
      links_json: { linkedin: linkedIn, portfolio, school, class_grade: classGrade, country },
      profile_visible: profileVisible,
      leaderboard_visible: leaderboardVisible,
    } as any).eq('user_id', user.id);
    if (error) toast.error(t.profileSaveFailed);
    else toast.success(t.profileSaved);
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
    return <div className="min-h-screen bg-background"><AppHeader /><div className="flex items-center justify-center py-20 text-muted-foreground">{t.loading}</div></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        <h1 className="typo-h1">{t.myProfile}</h1>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <BookOpen className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{completedCount}</p>
             <p className="text-xs text-muted-foreground">{t.casesDone}</p>
            {completedCount === 0 && (
              <p className="text-xs text-primary mt-1">{lang === 'bg' ? 'Започни от Пътешествието →' : 'Start from the Journey →'}</p>
            )}
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <BarChart3 className="h-5 w-5 text-sim-info mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{avgScore}%</p>
            <p className="text-xs text-muted-foreground">{t.avgScore}</p>
            {avgScore === 0 && (
              <p className="text-xs text-muted-foreground mt-1">{lang === 'bg' ? 'Завърши казус, за да видиш резултат' : 'Complete a case to see your score'}</p>
            )}
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <Award className="h-5 w-5 text-sim-warning mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{badges.length}</p>
            <p className="text-xs text-muted-foreground">{t.badges}</p>
            {badges.length === 0 && (
              <p className="text-[10px] text-sim-warning mt-1">{lang === 'bg' ? 'Спечели първата си значка днес' : 'Earn your first badge today'}</p>
            )}
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-3">{t.badges}</h3>
            <div className="flex flex-wrap gap-2">
              {badges.map((b: any) => (
                <Badge key={b.badge_id} className="bg-accent text-accent-foreground">
                  <Award className="h-3 w-3 mr-1" /> {b.badges?.name || t.badges}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Teams */}
        {teams.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-3">{t.teams}</h3>
            <div className="space-y-2">
              {teams.map((tm: any) => (
                <div key={tm.team_id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{tm.teams?.name || t.teams}</span>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">{tm.role}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit form */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-5">
          <h3 className="font-display font-semibold text-foreground">{t.editProfile}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t.fullName} <span className="text-[10px] text-muted-foreground">({lang === 'bg' ? 'видимо само за теб и учителя' : 'visible only to you and the teacher'})</span></Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div>
              <Label>{lang === 'bg' ? 'Псевдоним (за класацията)' : 'Display Name (for leaderboard)'}</Label>
              <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder={lang === 'bg' ? 'напр. ИноваторБГ' : 'e.g. CoolInnovator'} />
              <p className="text-[10px] text-muted-foreground mt-1">{lang === 'bg' ? 'Това име се показва публично в класацията' : 'This name is shown publicly on the leaderboard'}</p>
            </div>
            <div>
              <Label>{lang === 'bg' ? 'Училище / Университет' : 'School / University'} <span className="text-xs text-muted-foreground">({lang === 'bg' ? 'по избор' : 'optional'})</span></Label>
              <Input value={school} onChange={e => setSchool(e.target.value)} placeholder={lang === 'bg' ? 'напр. СУ Св. Климент Охридски' : 'e.g. Sofia University'} />
            </div>
            <div>
              <Label>{lang === 'bg' ? 'Клас / Курс' : 'Class / Grade'} <span className="text-xs text-muted-foreground">({lang === 'bg' ? 'по избор' : 'optional'})</span></Label>
              <Input value={classGrade} onChange={e => setClassGrade(e.target.value)} placeholder={lang === 'bg' ? 'напр. 11 клас' : 'e.g. 11th grade'} />
            </div>
            <div>
              <Label>{lang === 'bg' ? 'Държава' : 'Country'} <span className="text-xs text-muted-foreground">({lang === 'bg' ? 'по избор' : 'optional'})</span></Label>
              <select value={country} onChange={e => setCountry(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option value="">{lang === 'bg' ? '— Избери —' : '— Select —'}</option>
                {COUNTRY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Label>{t.linkedInUrl}</Label>
            <Input value={linkedIn} onChange={e => setLinkedIn(e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <Label>{t.bio}</Label>
            <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder={t.bioPlaceholder} className="min-h-[80px]" />
          </div>
          <div>
            <Label>{t.portfolioUrl}</Label>
            <Input value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label className="mb-2 block">{t.skills}</Label>
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
            <Label className="mb-2 block">{t.interests}</Label>
            <div className="flex gap-2 mb-2">
              <Input value={interestInput} onChange={e => setInterestInput(e.target.value)} placeholder={t.addInterest} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addInterest())} />
              <Button variant="outline" size="sm" onClick={addInterest}>{t.add}</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map(i => (
                <Badge key={i} variant="outline" className="cursor-pointer" onClick={() => setInterests(prev => prev.filter(x => x !== i))}>{i} ×</Badge>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={profileVisible} onChange={e => setProfileVisible(e.target.checked)} className="rounded" />
              <Label>{t.visibleToClassmates}</Label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={leaderboardVisible} onChange={e => setLeaderboardVisible(e.target.checked)} className="rounded" />
              <Label>{lang === 'bg' ? 'Покажи ме в публичната класация' : 'Show me on public leaderboard'}</Label>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="sim-gradient border-0">
            <Save className="h-4 w-4 mr-1" /> {saving ? t.saving : t.saveProfile}
          </Button>
        </div>
      </main>
    </div>
  );
}
