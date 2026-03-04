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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Lightbulb, Users, Zap, Monitor, DollarSign, TrendingUp,
  Presentation, ChevronRight, Check, Save, Rocket, HelpCircle, Globe, LayoutGrid, ClipboardCheck
} from 'lucide-react';
import { INDUSTRIES } from '@/data/industry-map-data';
import BusinessModelCanvas, { BMC_KEYS, type BMCData } from '@/components/startup/BusinessModelCanvas';
import AIMentorPanel from '@/components/startup/AIMentorPanel';
import IdeaEvaluation from '@/components/startup/IdeaEvaluation';

interface SectionConfig {
  key: string;
  icon: React.ElementType;
  labelEn: string;
  labelBg: string;
  descEn: string;
  descBg: string;
  prompts: { en: string; bg: string }[];
}

const SECTIONS: SectionConfig[] = [
  {
    key: 'problem',
    icon: Lightbulb,
    labelEn: 'Problem',
    labelBg: 'Проблем',
    descEn: 'Describe the real problem your startup will solve.',
    descBg: 'Опишете реалния проблем, който вашият стартъп ще реши.',
    prompts: [
      { en: '💡 What problem are you solving?', bg: '💡 Какъв проблем решавате?' },
      { en: '👥 Who experiences this problem?', bg: '👥 Кой изпитва този проблем?' },
      { en: '❗ Why is this problem important?', bg: '❗ Защо този проблем е важен?' },
    ],
  },
  {
    key: 'customer',
    icon: Users,
    labelEn: 'Customer Segments',
    labelBg: 'Клиентски сегменти',
    descEn: 'Identify and describe your target users.',
    descBg: 'Идентифицирайте и опишете вашите целеви потребители.',
    prompts: [
      { en: '🎯 Who is your primary customer?', bg: '🎯 Кой е основният ви клиент?' },
      { en: '👥 Do you have secondary customers?', bg: '👥 Имате ли вторични клиенти?' },
      { en: '🔍 What are their needs and pain points?', bg: '🔍 Какви са техните нужди и болки?' },
    ],
  },
  {
    key: 'value_proposition',
    icon: Zap,
    labelEn: 'Value Proposition',
    labelBg: 'Стойностно предложение',
    descEn: 'Explain why your solution is valuable and unique.',
    descBg: 'Обяснете защо вашето решение е ценно и уникално.',
    prompts: [
      { en: '⚡ What makes your solution unique?', bg: '⚡ Какво прави решението ви уникално?' },
      { en: '🏆 Why will customers choose you over alternatives?', bg: '🏆 Защо клиентите ще изберат вас пред алтернативите?' },
    ],
  },
  {
    key: 'digital_product',
    icon: Monitor,
    labelEn: 'Digital Product',
    labelBg: 'Дигитален продукт',
    descEn: 'Describe your digital product — app, platform, AI tool, or marketplace.',
    descBg: 'Опишете вашия дигитален продукт — приложение, платформа, AI инструмент или marketplace.',
    prompts: [
      { en: '📱 What is your product? (app, platform, AI tool, marketplace…)', bg: '📱 Какъв е вашият продукт? (приложение, платформа, AI инструмент, marketplace…)' },
      { en: '✨ What are the key features?', bg: '✨ Какви са основните функции?' },
      { en: '🔧 What technology will you use?', bg: '🔧 Каква технология ще използвате?' },
    ],
  },
  {
    key: 'business_model',
    icon: DollarSign,
    labelEn: 'Business Model',
    labelBg: 'Бизнес модел',
    descEn: 'Define how your startup will make money.',
    descBg: 'Определете как стартъпът ви ще печели пари.',
    prompts: [
      { en: '💰 What are your revenue streams? (subscriptions, commissions, ads, freemium…)', bg: '💰 Какви са приходните ви потоци? (абонаменти, комисиони, реклами, freemium…)' },
      { en: '🏷️ What is your pricing strategy?', bg: '🏷️ Каква е ценовата ви стратегия?' },
      { en: '🤝 Who are your key partners?', bg: '🤝 Кои са ключовите ви партньори?' },
    ],
  },
  {
    key: 'growth_strategy',
    icon: TrendingUp,
    labelEn: 'Growth Strategy',
    labelBg: 'Стратегия за растеж',
    descEn: 'Explain how you will grow your startup and attract users.',
    descBg: 'Обяснете как ще развиете стартъпа си и ще привлечете потребители.',
    prompts: [
      { en: '📣 What marketing channels will you use?', bg: '📣 Какви маркетингови канали ще използвате?' },
      { en: '🚀 What is your user acquisition strategy?', bg: '🚀 Каква е стратегията ви за привличане на потребители?' },
      { en: '🤝 What partnerships will help you grow?', bg: '🤝 Какви партньорства ще ви помогнат да растете?' },
    ],
  },
  {
    key: 'final_pitch',
    icon: Presentation,
    labelEn: 'Final Startup Pitch',
    labelBg: 'Финално представяне',
    descEn: 'Create a short, compelling pitch for your startup idea.',
    descBg: 'Създайте кратко и завладяващо представяне на стартъп идеята ви.',
    prompts: [
      { en: '🏷️ What is the name of your startup?', bg: '🏷️ Как се казва вашият стартъп?' },
      { en: '📝 Summarize the problem and your solution in 2–3 sentences.', bg: '📝 Обобщете проблема и решението в 2–3 изречения.' },
      { en: '🌍 Who is your target market?', bg: '🌍 Кой е целевият ви пазар?' },
      { en: '💼 How does the business model work?', bg: '💼 Как работи бизнес моделът?' },
    ],
  },
];

type SectionKey = string;

interface ProjectData {
  problem: string;
  customer: string;
  value_proposition: string;
  digital_product: string;
  business_model: string;
  growth_strategy: string;
  final_pitch: string;
  is_submitted: boolean;
  industry: string;
  bmc_customer_segments: string;
  bmc_value_proposition: string;
  bmc_channels: string;
  bmc_customer_relationships: string;
  bmc_revenue_streams: string;
  bmc_key_resources: string;
  bmc_key_activities: string;
  bmc_key_partners: string;
  bmc_cost_structure: string;
}

const EMPTY_PROJECT: ProjectData = {
  problem: '', customer: '', value_proposition: '', digital_product: '',
  business_model: '', growth_strategy: '', final_pitch: '', is_submitted: false, industry: '',
  bmc_customer_segments: '', bmc_value_proposition: '', bmc_channels: '',
  bmc_customer_relationships: '', bmc_revenue_streams: '', bmc_key_resources: '',
  bmc_key_activities: '', bmc_key_partners: '', bmc_cost_structure: '',
};

export default function MyStartupIdea() {
  const { user } = useAuth();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [data, setData] = useState<ProjectData>(EMPTY_PROJECT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [hasRecord, setHasRecord] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: proj } = await supabase
        .from('startup_projects')
        .select('problem, customer, value_proposition, digital_product, business_model, growth_strategy, final_pitch, is_submitted, industry, bmc_customer_segments, bmc_value_proposition, bmc_channels, bmc_customer_relationships, bmc_revenue_streams, bmc_key_resources, bmc_key_activities, bmc_key_partners, bmc_cost_structure')
        .eq('user_id', user.id)
        .maybeSingle();
      if (proj) { setData(proj as ProjectData); setHasRecord(true); }
      setLoading(false);
    };
    load();
  }, [user]);

  const saveProject = useCallback(async (newData: ProjectData) => {
    if (!user) return;
    setSaving(true);
    try {
      const { is_submitted, industry, ...rest } = newData;
      const payload = { ...rest };
      if (hasRecord) {
        await supabase.from('startup_projects').update(payload).eq('user_id', user.id);
      } else {
        await supabase.from('startup_projects').insert({ user_id: user.id, ...payload });
        setHasRecord(true);
      }
      setLastSaved(new Date());
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  }, [user, hasRecord]);

  const scheduleAutoSave = useCallback((newData: ProjectData) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveProject(newData), 2000);
  }, [saveProject]);

  const handleChange = (key: SectionKey, value: string) => {
    const newData = { ...data, [key]: value } as ProjectData;
    setData(newData);
    scheduleAutoSave(newData);
  };

  const handleBMCChange = (key: keyof BMCData, value: string) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    scheduleAutoSave(newData);
  };

  const handleSubmit = async () => {
    if (!user) return;
    await saveProject(data);
    await supabase.from('startup_projects').update({
      is_submitted: true, submitted_at: new Date().toISOString(),
    }).eq('user_id', user.id);
    setData(d => ({ ...d, is_submitted: true }));
    toast.success(t('Project submitted!', 'Проектът е предаден!'));
  };

  const filledCount = SECTIONS.filter(s => ((data as any)[s.key] || '').trim().length > 20).length;
  const progressPercent = Math.round((filledCount / SECTIONS.length) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          {t('Loading...', 'Зареждане...')}
        </div>
      </div>
    );
  }

  const section = SECTIONS[activeSection];
  const SectionIcon = section.icon;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">
            {t('Dashboard', 'Табло')}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">
            {t('My Startup Project', 'Моят стартъп проект')}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Rocket className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {t('My Startup Project', 'Моят стартъп проект')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('Build your startup idea step by step', 'Изградете стартъп идеята си стъпка по стъпка')}
              </p>
            </div>
          </div>

          {/* Industry badge */}
          {data.industry && (() => {
            const ind = INDUSTRIES.find(i => i.id === data.industry);
            return ind ? (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-accent/30 px-3 py-2">
                <span className="text-lg">{ind.icon}</span>
                <span className="text-sm text-foreground font-medium">
                  {lang === 'bg' ? ind.nameBg : ind.nameEn}
                </span>
                <Badge variant="secondary" className="text-xs ml-auto">
                  <Globe className="h-3 w-3 mr-1" />
                  {t('Chosen Industry', 'Избрана индустрия')}
                </Badge>
              </div>
            ) : null;
          })()}
          {!data.industry && (
            <Link to="/industries" className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3 py-2 hover:bg-primary/10 transition-colors">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                {t('Choose an industry from the Innovation Map →', 'Изберете индустрия от картата на иновациите →')}
              </span>
            </Link>
          )}

          {/* Progress + save status */}
          <div className="mt-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {t('Project Progress', 'Прогрес на проекта')}
              </span>
              <span className="text-sm font-bold text-primary">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2.5" />
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              {saving ? (
                <span className="flex items-center gap-1"><Save className="h-3 w-3 animate-pulse" /> {t('Saving...', 'Запазване...')}</span>
              ) : lastSaved ? (
                <span className="flex items-center gap-1 text-[hsl(var(--sim-success))]"><Check className="h-3 w-3" /> {t('Progress saved', 'Прогресът е запазен')}</span>
              ) : null}
              {data.is_submitted && (
                <Badge className="bg-[hsl(var(--sim-success))]/10 text-[hsl(var(--sim-success))] border-0 text-xs ml-auto">
                  <Check className="h-3 w-3 mr-1" /> {t('Submitted', 'Предаден')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Tabs: Sections | Business Model Canvas */}
        <Tabs defaultValue="sections" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="sections" className="gap-1.5">
              <Lightbulb className="h-4 w-4" />
              {t('Sections', 'Секции')}
            </TabsTrigger>
            <TabsTrigger value="evaluate" className="gap-1.5">
              <ClipboardCheck className="h-4 w-4" />
              {t('Evaluate', 'Оценка')}
            </TabsTrigger>
            <TabsTrigger value="bmc" className="gap-1.5">
              <LayoutGrid className="h-4 w-4" />
              BMC
            </TabsTrigger>
          </TabsList>

          {/* Sections tab */}
          <TabsContent value="sections">
            <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
              {/* Section nav */}
              <div className="space-y-1">
                {SECTIONS.map((s, i) => {
                  const Icon = s.icon;
                  const filled = ((data as any)[s.key] || '').trim().length > 20;
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

              {/* Active section */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-1">
                  <SectionIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    {lang === 'bg' ? section.labelBg : section.labelEn}
                  </h2>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {activeSection + 1} / {SECTIONS.length}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-5">
                  {lang === 'bg' ? section.descBg : section.descEn}
                </p>

                {/* Guided prompts */}
                <div className="mb-4 rounded-lg bg-accent/50 border border-border p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-accent-foreground mb-1">
                    <HelpCircle className="h-3.5 w-3.5" />
                    {t('Think about these questions:', 'Помислете над тези въпроси:')}
                  </div>
                  {section.prompts.map((p, i) => (
                    <p key={i} className="text-sm text-foreground/80">
                      {lang === 'bg' ? p.bg : p.en}
                    </p>
                  ))}
                </div>

                <Textarea
                  value={(data as any)[section.key] || ''}
                  onChange={e => handleChange(section.key, e.target.value)}
                  placeholder={t('Write your answer here...', 'Напишете вашия отговор тук...')}
                  className="min-h-[220px] text-base leading-relaxed resize-y"
                  disabled={data.is_submitted}
                />

                {/* Navigation */}
                <div className="flex items-center justify-between mt-5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activeSection === 0}
                    onClick={() => setActiveSection(i => i - 1)}
                  >
                    ← {t('Back', 'Назад')}
                  </Button>
                  {activeSection < SECTIONS.length - 1 ? (
                    <Button size="sm" onClick={() => setActiveSection(i => i + 1)}>
                      {t('Next', 'Напред')} →
                    </Button>
                  ) : !data.is_submitted ? (
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground"
                      onClick={handleSubmit}
                      disabled={progressPercent < 100}
                    >
                      <Presentation className="h-4 w-4 mr-1" />
                      {t('Submit Project', 'Предай проект')}
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Evaluate tab */}
          <TabsContent value="evaluate">
            <IdeaEvaluation
              lang={lang as 'en' | 'bg'}
              startupData={{
                problem: data.problem,
                customer: data.customer,
                value_proposition: data.value_proposition,
                digital_product: data.digital_product,
                business_model: data.business_model,
                industry: data.industry,
              }}
            />
          </TabsContent>

          {/* BMC tab */}
          <TabsContent value="bmc">
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <BusinessModelCanvas
                data={data}
                lang={lang as 'en' | 'bg'}
                disabled={data.is_submitted}
                onChange={handleBMCChange}
              />
              <AIMentorPanel data={data} lang={lang as 'en' | 'bg'} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
