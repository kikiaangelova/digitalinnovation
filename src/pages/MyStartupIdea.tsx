import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Lightbulb, Users, Zap, Monitor, DollarSign, TrendingUp,
  Presentation, ChevronRight, Check, Save, Rocket
} from 'lucide-react';

const SECTIONS = [
  { key: 'problem', icon: Lightbulb, labelEn: 'Problem', labelBg: 'Проблем', hintEn: 'What problem are you solving? Who has this problem? Why does it matter?', hintBg: 'Какъв проблем решавате? Кой има този проблем? Защо е важен?' },
  { key: 'customer', icon: Users, labelEn: 'Customer', labelBg: 'Клиент', hintEn: 'Who are your target users? Describe their age, needs, habits, and pain points.', hintBg: 'Кои са целевите ви потребители? Опишете тяхната възраст, нужди, навици и болки.' },
  { key: 'value_proposition', icon: Zap, labelEn: 'Value Proposition', labelBg: 'Стойностно предложение', hintEn: 'What makes your solution unique? Why would customers choose you over alternatives?', hintBg: 'Какво прави решението ви уникално? Защо клиентите биха избрали вас?' },
  { key: 'digital_product', icon: Monitor, labelEn: 'Digital Product', labelBg: 'Дигитален продукт', hintEn: 'Describe the digital product or platform. What features does it have? How does it work?', hintBg: 'Опишете дигиталния продукт или платформа. Какви функции има? Как работи?' },
  { key: 'business_model', icon: DollarSign, labelEn: 'Business Model', labelBg: 'Бизнес модел', hintEn: 'How will the startup generate revenue? Subscriptions, commissions, ads, freemium?', hintBg: 'Как стартъпът ще генерира приходи? Абонаменти, комисиони, реклами, freemium?' },
  { key: 'growth_strategy', icon: TrendingUp, labelEn: 'Growth Strategy', labelBg: 'Стратегия за растеж', hintEn: 'How will you attract users? Marketing channels, partnerships, viral strategies?', hintBg: 'Как ще привлечете потребители? Маркетингови канали, партньорства, вирални стратегии?' },
  { key: 'final_pitch', icon: Presentation, labelEn: 'Final Pitch', labelBg: 'Финално представяне', hintEn: 'Write a short startup pitch. Summarize your idea in 2-3 paragraphs as if presenting to investors.', hintBg: 'Напишете кратко представяне на стартъпа. Обобщете идеята си в 2-3 параграфа.' },
] as const;

type SectionKey = typeof SECTIONS[number]['key'];

interface ProjectData {
  problem: string;
  customer: string;
  value_proposition: string;
  digital_product: string;
  business_model: string;
  growth_strategy: string;
  final_pitch: string;
  is_submitted: boolean;
}

const EMPTY_PROJECT: ProjectData = {
  problem: '', customer: '', value_proposition: '', digital_product: '',
  business_model: '', growth_strategy: '', final_pitch: '', is_submitted: false,
};

export default function MyStartupIdea() {
  const { user } = useAuth();
  const { lang } = useLang();
  const [data, setData] = useState<ProjectData>(EMPTY_PROJECT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [hasRecord, setHasRecord] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load existing project
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: proj } = await supabase
        .from('startup_projects')
        .select('problem, customer, value_proposition, digital_product, business_model, growth_strategy, final_pitch, is_submitted')
        .eq('user_id', user.id)
        .maybeSingle();
      if (proj) {
        setData(proj as ProjectData);
        setHasRecord(true);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  // Auto-save with debounce
  const saveProject = useCallback(async (newData: ProjectData) => {
    if (!user) return;
    setSaving(true);
    try {
      if (hasRecord) {
        await supabase.from('startup_projects').update({
          problem: newData.problem,
          customer: newData.customer,
          value_proposition: newData.value_proposition,
          digital_product: newData.digital_product,
          business_model: newData.business_model,
          growth_strategy: newData.growth_strategy,
          final_pitch: newData.final_pitch,
        }).eq('user_id', user.id);
      } else {
        await supabase.from('startup_projects').insert({
          user_id: user.id,
          problem: newData.problem,
          customer: newData.customer,
          value_proposition: newData.value_proposition,
          digital_product: newData.digital_product,
          business_model: newData.business_model,
          growth_strategy: newData.growth_strategy,
          final_pitch: newData.final_pitch,
        });
        setHasRecord(true);
      }
      setLastSaved(new Date());
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  }, [user, hasRecord]);

  const handleChange = (key: SectionKey, value: string) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    // Debounced auto-save (2 seconds)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveProject(newData), 2000);
  };

  const handleSubmit = async () => {
    if (!user) return;
    await saveProject(data);
    await supabase.from('startup_projects').update({
      is_submitted: true,
      submitted_at: new Date().toISOString(),
    }).eq('user_id', user.id);
    setData(d => ({ ...d, is_submitted: true }));
    toast.success(lang === 'bg' ? 'Проектът е предаден!' : 'Project submitted!');
  };

  // Calculate progress
  const filledCount = SECTIONS.filter(s => (data[s.key] || '').trim().length > 20).length;
  const progressPercent = Math.round((filledCount / SECTIONS.length) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          {lang === 'bg' ? 'Зареждане...' : 'Loading...'}
        </div>
      </div>
    );
  }

  const section = SECTIONS[activeSection];
  const SectionIcon = section.icon;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">
            {lang === 'bg' ? 'Табло' : 'Dashboard'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">
            {lang === 'bg' ? 'Моята стартъп идея' : 'My Startup Idea'}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg sim-gradient">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {lang === 'bg' ? 'Моята стартъп идея' : 'My Startup Idea'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {lang === 'bg' ? 'Разработете стартъп идеята си стъпка по стъпка' : 'Develop your startup idea step by step'}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-3">
            <Progress value={progressPercent} className="h-2.5 flex-1" />
            <span className="text-sm font-medium text-foreground shrink-0">{progressPercent}%</span>
          </div>

          {/* Save indicator */}
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            {saving ? (
              <span className="flex items-center gap-1"><Save className="h-3 w-3 animate-pulse" /> {lang === 'bg' ? 'Запазване...' : 'Saving...'}</span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1 text-[hsl(var(--sim-success))]"><Check className="h-3 w-3" /> {lang === 'bg' ? 'Прогресът е запазен' : 'Progress saved'}</span>
            ) : null}
            {data.is_submitted && (
              <Badge className="bg-[hsl(var(--sim-success))]/10 text-[hsl(var(--sim-success))] border-0 text-xs ml-auto">
                <Check className="h-3 w-3 mr-1" /> {lang === 'bg' ? 'Предаден' : 'Submitted'}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          {/* Section nav */}
          <div className="space-y-1">
            {SECTIONS.map((s, i) => {
              const Icon = s.icon;
              const filled = (data[s.key] || '').trim().length > 20;
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(i)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                    i === activeSection
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{lang === 'bg' ? s.labelBg : s.labelEn}</span>
                  {filled && <Check className="h-3.5 w-3.5 text-[hsl(var(--sim-success))] shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Active section editor */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <SectionIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-display font-semibold text-foreground">
                {lang === 'bg' ? section.labelBg : section.labelEn}
              </h2>
              <Badge variant="outline" className="text-xs ml-auto">
                {activeSection + 1} / {SECTIONS.length}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {lang === 'bg' ? section.hintBg : section.hintEn}
            </p>
            <Textarea
              value={data[section.key] || ''}
              onChange={e => handleChange(section.key, e.target.value)}
              placeholder={lang === 'bg' ? 'Напишете тук...' : 'Write here...'}
              className="min-h-[200px] text-base leading-relaxed resize-y"
              disabled={data.is_submitted}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={activeSection === 0}
                onClick={() => setActiveSection(i => i - 1)}
              >
                ← {lang === 'bg' ? 'Назад' : 'Back'}
              </Button>
              {activeSection < SECTIONS.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => setActiveSection(i => i + 1)}
                >
                  {lang === 'bg' ? 'Напред' : 'Next'} →
                </Button>
              ) : !data.is_submitted ? (
                <Button
                  size="sm"
                  className="sim-gradient border-0"
                  onClick={handleSubmit}
                  disabled={progressPercent < 100}
                >
                  <Presentation className="h-4 w-4 mr-1" />
                  {lang === 'bg' ? 'Предай проект' : 'Submit Project'}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
