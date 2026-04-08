import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Save, Award, BookOpen, Users, BarChart3, Lock, X, AlertTriangle, Shield, School, Zap, Rocket, Target, TrendingUp } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const SKILL_OPTIONS = ['UX', 'Data', 'Strategy', 'PM', 'Marketing', 'AI', 'Engineering', 'Design', 'Finance', 'Operations'];

const COUNTRY_OPTIONS = ['Bulgaria', 'Romania', 'Greece', 'Serbia', 'Turkey', 'Germany', 'UK', 'USA', 'Other'];

export default function ProfilePage() {
  const { user, profile: authProfile } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [skillsTags, setSkillsTags] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [school, setSchool] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [country, setCountry] = useState('');
  const [profileVisible, setProfileVisible] = useState(true);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [simData, setSimData] = useState<any>(null);
  const [startupData, setStartupData] = useState<any>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [classroomInfo, setClassroomInfo] = useState<{ id: string; name: string; teacher_name: string | null } | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [showGdprBanner, setShowGdprBanner] = useState(() => {
    return localStorage.getItem('gdpr_banner_dismissed') !== 'true';
  });

  const tx = (en: string, bg: string) => lang === 'bg' ? bg : en;

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, subsRes, badgesRes, teamsRes, quizRes, simRes, startupRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('submissions').select('case_study_id, total_score, max_score, is_draft, submitted_at').eq('user_id', user.id).eq('is_draft', false),
        supabase.from('user_badges').select('badge_id, earned_at, badges(name, description, icon)').eq('user_id', user.id),
        supabase.from('team_members').select('team_id, role, teams(name, cohort_id)').eq('user_id', user.id),
        supabase.from('quiz_results').select('id, score, max_score, category, quiz_type, created_at, xp_earned').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('simulator_progress').select('current_week, is_complete, grade, created_at').eq('user_id', user.id).maybeSingle(),
        supabase.from('startup_projects').select('problem, customer, value_proposition, digital_product, business_model, growth_strategy, final_pitch, is_submitted, bmc_customer_segments, bmc_value_proposition, bmc_channels, bmc_customer_relationships, bmc_revenue_streams, bmc_key_resources, bmc_key_activities, bmc_key_partners, bmc_cost_structure').eq('user_id', user.id).maybeSingle(),
      ]);
      const p = profileRes.data as any;
      if (p) {
        setFullName(p.full_name || '');
        setDisplayName(p.display_name || '');
        setSkillsTags(p.skills_tags || []);
        setInterests(p.interests || []);
        const links = p.links_json || {};
        setPortfolio(links.portfolio || '');
        setSchool(links.school || '');
        setClassGrade(links.class_grade || '');
        setCountry(links.country || '');
        setProfileVisible(p.profile_visible ?? true);
        setLeaderboardVisible(p.leaderboard_visible ?? false);
        setTotalXp(p.total_xp || 0);
      }
      setSubmissions(subsRes.data || []);
      setBadges(badgesRes.data || []);
      setTeams(teamsRes.data || []);
      setQuizHistory(quizRes.data || []);
      setSimData(simRes.data || null);
      setStartupData(startupRes.data || null);
      // Fetch classroom membership
      const { data: membership } = await supabase
        .from('classroom_students')
        .select('classroom_id')
        .eq('student_id', user.id)
        .maybeSingle();
      const { data: membership } = await supabase
        .from('classroom_students')
        .select('classroom_id')
        .eq('student_id', user.id)
        .maybeSingle();
      if (membership) {
        const { data: cr } = await supabase
          .from('classrooms')
          .select('id, name, teacher_id')
          .eq('id', membership.classroom_id)
          .maybeSingle();
        if (cr) {
          const { data: tp } = await supabase.from('profiles').select('display_name, full_name').eq('user_id', cr.teacher_id).maybeSingle();
          setClassroomInfo({ id: cr.id, name: cr.name, teacher_name: tp?.display_name || tp?.full_name || null });
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      full_name: fullName || null,
      display_name: displayName,
      skills_tags: skillsTags,
      interests,
      links_json: { portfolio, school, class_grade: classGrade, country },
      profile_visible: profileVisible,
      leaderboard_visible: leaderboardVisible,
    } as any).eq('user_id', user.id);
    if (error) toast.error(t.profileSaveFailed);
    else toast.success(t.profileSaved);
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-account');
      if (error) throw error;
      await supabase.auth.signOut();
      navigate('/');
      toast.success(tx('Account deleted successfully.', 'Акаунтът беше изтрит успешно.'));
    } catch (err: any) {
      toast.error(tx('Failed to delete account. Please try again.', 'Неуспешно изтриване. Моля, опитай отново.'));
    }
    setDeleting(false);
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

  const dismissGdprBanner = () => {
    localStorage.setItem('gdpr_banner_dismissed', 'true');
    setShowGdprBanner(false);
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

        {/* GDPR Info Banner */}
        {showGdprBanner && (
          <div className="relative rounded-lg border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-foreground">
                {tx(
                  '🔒 Your profile data is protected. Only your nickname is shown publicly. Your full name is visible only to you and your teacher.',
                  '🔒 Данните в профила ти са защитени. Публично се показва само псевдонимът ти. Пълното ти име е видимо само за теб и твоя учител.'
                )}
              </p>
              <Link to="/privacy" className="text-xs text-primary hover:underline mt-1 inline-block">
                {tx('Read the Privacy Policy →', 'Прочети политиката за поверителност →')}
              </Link>
            </div>
            <button onClick={dismissGdprBanner} className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Classroom Section */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-3">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <School className="h-4 w-4 text-primary" />
            {tx('My Classroom', 'Моят клас')}
          </h3>
          {classroomInfo ? (
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                {tx('Class:', 'Клас:')} <strong>{classroomInfo.name}</strong>
                {classroomInfo.teacher_name && <> · {tx('Teacher:', 'Учител:')} {classroomInfo.teacher_name}</>}
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="text-xs text-destructive hover:underline">
                    {tx('Leave classroom', 'Напусни класа')}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{tx('Leave classroom?', 'Напусни класа?')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {tx('You will lose access to class assignments but keep your progress.', 'Ще загубиш достъп до задачите на класа, но ще запазиш прогреса си.')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{tx('Cancel', 'Отказ')}</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground"
                      onClick={async () => {
                        if (!user || !classroomInfo) return;
                        await supabase.from('classroom_students').delete().eq('classroom_id', classroomInfo.id).eq('student_id', user.id);
                        setClassroomInfo(null);
                        toast.success(tx('Left the classroom', 'Напусна класа'));
                      }}
                    >
                      {tx('Leave', 'Напусни')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {tx("You're not in a classroom. Have a code from your teacher?", 'Нямаш класна стая. Имаш ли код от учителя си?')}
              </p>
              <div className="flex gap-2">
                <Input
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                  placeholder={tx('Class code (6 chars)', 'Код на класа (6 знака)')}
                  maxLength={6}
                  className="max-w-[200px] font-mono uppercase"
                />
                <Button
                  size="sm"
                  disabled={joinCode.length !== 6 || joinLoading}
                  onClick={async () => {
                    if (!user) return;
                    setJoinLoading(true);
                    const { data: cr } = await supabase.from('classrooms').select('id, name, teacher_id').eq('class_code', joinCode).eq('is_active', true).maybeSingle();
                    if (!cr) { toast.error(tx('Invalid or expired code.', 'Невалиден или изтекъл код.')); setJoinLoading(false); return; }
                    const { data: existing } = await supabase.from('classroom_students').select('id').eq('classroom_id', cr.id).eq('student_id', user.id).maybeSingle();
                    if (existing) { toast.error(tx('Already in this class.', 'Вече си в този клас.')); setJoinLoading(false); return; }
                    const { error } = await supabase.from('classroom_students').insert({ classroom_id: cr.id, student_id: user.id });
                    if (error) { toast.error(error.message); setJoinLoading(false); return; }
                    const { data: tp } = await supabase.from('profiles').select('display_name, full_name').eq('user_id', cr.teacher_id).maybeSingle();
                    setClassroomInfo({ id: cr.id, name: cr.name, teacher_name: tp?.display_name || tp?.full_name || null });
                    setJoinCode('');
                    toast.success(tx(`Joined ${cr.name}!`, `Присъедини се към ${cr.name}!`));
                    setJoinLoading(false);
                  }}
                >
                  {joinLoading ? '...' : tx('Join', 'Присъедини се')}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <BookOpen className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{completedCount}</p>
            <p className="text-xs text-muted-foreground">{t.casesDone}</p>
            {completedCount === 0 && (
              <p className="text-xs text-primary mt-1">{tx('Start from the Journey →', 'Започни от Пътешествието →')}</p>
            )}
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <BarChart3 className="h-5 w-5 text-sim-info mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{avgScore}%</p>
            <p className="text-xs text-muted-foreground">{t.avgScore}</p>
            {avgScore === 0 && (
              <p className="text-xs text-muted-foreground mt-1">{tx('Complete a case to see your score', 'Завърши казус, за да видиш резултат')}</p>
            )}
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <Award className="h-5 w-5 text-sim-warning mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{badges.length}</p>
            <p className="text-xs text-muted-foreground">{t.badges}</p>
            {badges.length === 0 && (
              <p className="text-xs text-xp-gold mt-1">{tx('Earn your first badge today', 'Спечели първата си значка днес')}</p>
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
              <Label className="flex items-center gap-1.5">
                {tx('Full Name (optional)', 'Пълно име (по избор)')}
                <Lock className="h-3 w-3 text-muted-foreground" />
              </Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">
                {tx('Visible only to you and your teacher. Never public.', 'Видимо само за теб и твоя учител. Никога публично.')}
              </p>
            </div>
            <div>
              <Label>{tx('Nickname (for leaderboard)', 'Псевдоним (за класацията)')}</Label>
              <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder={tx('e.g. CoolInnovator', 'напр. ИноваторБГ')} />
              <p className="text-xs text-muted-foreground mt-1">{tx('This name is shown publicly on the leaderboard', 'Това име се показва публично в класацията')}</p>
            </div>
            <div>
              <Label>{tx('School / University (optional)', 'Училище / Университет (по избор)')}</Label>
              <Input value={school} onChange={e => setSchool(e.target.value)} placeholder={tx('e.g. Sofia University', 'напр. СУ Св. Климент Охридски')} />
            </div>
            <div>
              <Label>{tx('Class / Grade (optional)', 'Клас / Курс (по избор)')}</Label>
              <Input value={classGrade} onChange={e => setClassGrade(e.target.value)} placeholder={tx('e.g. 11th grade', 'напр. 11 клас')} />
            </div>
            <div>
              <Label>{tx('Country (optional)', 'Държава (по избор)')}</Label>
              <select value={country} onChange={e => setCountry(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option value="">{tx('— Select —', '— Избери —')}</option>
                {COUNTRY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
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
              <Label>{tx('Show me on public leaderboard', 'Покажи ме в публичната класация')}</Label>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="sim-gradient border-0">
            <Save className="h-4 w-4 mr-1" /> {saving ? t.saving : t.saveProfile}
          </Button>
        </div>

        {/* Delete Account — Danger Zone */}
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 space-y-3">
          <h3 className="font-display font-semibold text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {tx('Danger Zone', 'Опасна зона')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {tx(
              'Deleting your account is permanent. All data, progress, and XP will be lost forever.',
              'Изтриването на акаунта е необратимо. Всички данни, напредък и XP ще бъдат загубени завинаги.'
            )}
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {tx('Delete my account', 'Изтрий профила ми')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {tx('Are you sure?', 'Сигурен ли си?')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {tx(
                    'All data, progress, and XP will be permanently deleted. This action cannot be undone.',
                    'Всички данни, напредък и XP ще бъдат изтрити завинаги. Това действие е необратимо.'
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{tx('Cancel', 'Отказ')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? tx('Deleting...', 'Изтриване...') : tx('Yes, delete my account', 'Да, изтрий акаунта ми')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </div>
  );
}
