import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import {
  Sparkles, Loader2, Target, Users, Zap, Lightbulb, Rocket,
  TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, Search,
  DollarSign, Smile, Brain, Leaf, Accessibility,
} from 'lucide-react';

interface Props {
  lang: 'en' | 'bg';
  startupData: {
    problem: string;
    customer: string;
    value_proposition: string;
    digital_product: string;
    business_model: string;
    industry: string;
  };
}

interface EvalScore {
  criterion: string;
  score: number;
  label: string;
  labelBg: string;
  icon: React.ElementType;
}

interface SimilarStartup {
  name: string;
  description: string;
  descriptionBg: string;
}

const CRITERIA: Omit<EvalScore, 'score'>[] = [
  { criterion: 'problem_importance', label: 'Problem Importance', labelBg: 'Важност на проблема', icon: AlertTriangle },
  { criterion: 'customer_definition', label: 'Customer Definition', labelBg: 'Дефиниране на клиент', icon: Users },
  { criterion: 'value_proposition', label: 'Value Proposition', labelBg: 'Стойностно предложение', icon: Zap },
  { criterion: 'innovation_level', label: 'Innovation Level', labelBg: 'Ниво на иновация', icon: Lightbulb },
  { criterion: 'feasibility', label: 'Feasibility', labelBg: 'Осъществимост', icon: Target },
  { criterion: 'potential_impact', label: 'Potential Impact', labelBg: 'Потенциално въздействие', icon: TrendingUp },
];

const INNOVATION_PROMPTS = [
  { icon: DollarSign, en: 'Lower cost', bg: 'По-ниска цена' },
  { icon: Smile, en: 'Better user experience', bg: 'По-добро потребителско изживяване' },
  { icon: Brain, en: 'AI integration', bg: 'Интеграция на AI' },
  { icon: Leaf, en: 'Sustainability', bg: 'Устойчивост' },
  { icon: Accessibility, en: 'Accessibility', bg: 'Достъпност' },
];

const SIMILAR_DB: Record<string, SimilarStartup[]> = {
  transport: [
    { name: 'Uber', description: 'Ride-hailing platform connecting drivers and riders', descriptionBg: 'Платформа за споделено пътуване, свързваща шофьори и пътници' },
    { name: 'Bolt', description: 'European ride-sharing and micro-mobility platform', descriptionBg: 'Европейска платформа за споделено пътуване и микромобилност' },
  ],
  accommodation: [
    { name: 'Airbnb', description: 'Marketplace for short-term home rentals', descriptionBg: 'Пазар за краткосрочно наемане на жилища' },
    { name: 'Booking.com', description: 'Online travel accommodation booking platform', descriptionBg: 'Онлайн платформа за резервации на настаняване' },
  ],
  education: [
    { name: 'Duolingo', description: 'Gamified language learning app', descriptionBg: 'Геймифицирано приложение за изучаване на езици' },
    { name: 'Coursera', description: 'Online learning platform with university courses', descriptionBg: 'Онлайн платформа за обучение с университетски курсове' },
    { name: 'Khan Academy', description: 'Free educational videos and exercises', descriptionBg: 'Безплатни образователни видеа и упражнения' },
  ],
  food: [
    { name: 'Glovo', description: 'On-demand delivery app for food and goods', descriptionBg: 'Приложение за доставка на храна и стоки при поискване' },
    { name: 'Foodpanda', description: 'Food delivery marketplace', descriptionBg: 'Пазар за доставка на храна' },
  ],
  health: [
    { name: 'Doctolib', description: 'Healthcare appointment booking platform', descriptionBg: 'Платформа за резервация на лекарски часове' },
    { name: 'Headspace', description: 'Meditation and mental health app', descriptionBg: 'Приложение за медитация и психично здраве' },
  ],
  finance: [
    { name: 'Revolut', description: 'Digital banking and payments app', descriptionBg: 'Дигитално банкиране и платежно приложение' },
    { name: 'Stripe', description: 'Online payment processing platform', descriptionBg: 'Платформа за обработка на онлайн плащания' },
  ],
  retail: [
    { name: 'Shopify', description: 'E-commerce platform for online stores', descriptionBg: 'Платформа за електронна търговия' },
    { name: 'Amazon', description: 'Global e-commerce and cloud marketplace', descriptionBg: 'Глобален пазар за електронна търговия' },
  ],
  agriculture: [
    { name: 'FarmLogs', description: 'Farm management and analytics software', descriptionBg: 'Софтуер за управление и анализ на ферми' },
    { name: 'Indigo Agriculture', description: 'AI-driven sustainable farming platform', descriptionBg: 'AI платформа за устойчиво земеделие' },
  ],
  tourism: [
    { name: 'TripAdvisor', description: 'Travel reviews and booking platform', descriptionBg: 'Платформа за отзиви и резервации за пътувания' },
    { name: 'Skyscanner', description: 'Flight and travel price comparison', descriptionBg: 'Сравнение на цени за полети и пътувания' },
  ],
  default: [
    { name: 'Uber', description: 'Ride-hailing platform', descriptionBg: 'Платформа за споделено пътуване' },
    { name: 'Airbnb', description: 'Short-term rental marketplace', descriptionBg: 'Пазар за краткосрочни наеми' },
    { name: 'Duolingo', description: 'Gamified learning app', descriptionBg: 'Геймифицирано приложение за учене' },
  ],
};

function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  const keywords: Record<string, string[]> = {
    transport: ['transport', 'ride', 'taxi', 'mobility', 'car', 'drive', 'превоз', 'такси'],
    accommodation: ['hotel', 'accommodation', 'rent', 'stay', 'хотел', 'настаняване', 'наем'],
    education: ['learn', 'education', 'teach', 'course', 'student', 'school', 'обучение', 'образование', 'учене', 'курс', 'ученик'],
    food: ['food', 'restaurant', 'delivery', 'meal', 'cook', 'храна', 'ресторант', 'доставка', 'готвене'],
    health: ['health', 'medical', 'doctor', 'wellness', 'mental', 'здраве', 'медицин', 'лекар'],
    finance: ['finance', 'bank', 'payment', 'money', 'invest', 'финанс', 'банк', 'плащане', 'пари'],
    retail: ['shop', 'store', 'ecommerce', 'retail', 'buy', 'sell', 'магазин', 'продажба', 'покупка'],
    agriculture: ['farm', 'agriculture', 'crop', 'harvest', 'земеделие', 'ферма', 'реколта'],
    tourism: ['travel', 'tourism', 'trip', 'tourist', 'туризъм', 'пътуване', 'турист'],
  };
  for (const [cat, words] of Object.entries(keywords)) {
    if (words.some(w => lower.includes(w))) return cat;
  }
  return 'default';
}

function scoreIdea(data: Props['startupData']): EvalScore[] {
  return CRITERIA.map(c => {
    let score = 1;
    const all = `${data.problem} ${data.customer} ${data.value_proposition} ${data.digital_product} ${data.business_model}`;
    const wordCount = all.trim().split(/\s+/).length;

    switch (c.criterion) {
      case 'problem_importance':
        score = data.problem.trim().length > 100 ? 8 : data.problem.trim().length > 40 ? 6 : data.problem.trim().length > 10 ? 4 : 2;
        if (/why|important|impact|значим|важен|въздействие/i.test(data.problem)) score = Math.min(10, score + 1);
        break;
      case 'customer_definition':
        score = data.customer.trim().length > 80 ? 8 : data.customer.trim().length > 30 ? 6 : data.customer.trim().length > 10 ? 4 : 2;
        if (/age|demographic|segment|възраст|сегмент/i.test(data.customer)) score = Math.min(10, score + 1);
        break;
      case 'value_proposition':
        score = data.value_proposition.trim().length > 80 ? 8 : data.value_proposition.trim().length > 30 ? 6 : data.value_proposition.trim().length > 10 ? 4 : 2;
        if (/unique|different|better|уникал|различн|по-добр/i.test(data.value_proposition)) score = Math.min(10, score + 1);
        break;
      case 'innovation_level':
        score = /ai|machine learning|blockchain|iot|ar|vr|automation|изкуствен интелект|автоматизация/i.test(all) ? 8 : 5;
        if (/new|novel|first|innovat|нов|иновати|първ/i.test(all)) score = Math.min(10, score + 1);
        break;
      case 'feasibility':
        score = data.digital_product.trim().length > 60 ? 7 : data.digital_product.trim().length > 20 ? 5 : 3;
        if (data.business_model.trim().length > 30) score = Math.min(10, score + 1);
        break;
      case 'potential_impact':
        score = wordCount > 150 ? 8 : wordCount > 80 ? 6 : wordCount > 30 ? 4 : 2;
        if (/scale|global|millions|growth|мащаб|глобал|милион|растеж/i.test(all)) score = Math.min(10, score + 1);
        break;
    }
    return { ...c, score: Math.max(1, Math.min(10, score)) };
  });
}

const MATURITY_STAGES = [
  { en: 'Idea', bg: 'Идея', fields: ['problem'] },
  { en: 'Validated Idea', bg: 'Валидирана идея', fields: ['problem', 'customer'] },
  { en: 'Business Model', bg: 'Бизнес модел', fields: ['problem', 'customer', 'value_proposition', 'business_model'] },
  { en: 'Product Concept', bg: 'Продуктова концепция', fields: ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model'] },
  { en: 'Growth Strategy', bg: 'Стратегия за растеж', fields: ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model'] },
];

function getMaturityStage(data: Props['startupData']): number {
  for (let i = MATURITY_STAGES.length - 1; i >= 0; i--) {
    const allFilled = MATURITY_STAGES[i].fields.every(f => ((data as any)[f] || '').trim().length > 15);
    if (allFilled) return i;
  }
  return 0;
}

export default function IdeaEvaluation({ lang, startupData }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [evaluated, setEvaluated] = useState(false);
  const [scores, setScores] = useState<EvalScore[]>([]);
  const [similarStartups, setSimilarStartups] = useState<SimilarStartup[]>([]);
  const [innovationAnswer, setInnovationAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  const maturityStage = getMaturityStage(startupData);
  const hasEnoughData = startupData.problem.trim().length > 10 && startupData.customer.trim().length > 10;

  const runEvaluation = () => {
    if (!hasEnoughData) {
      toast.warning(t(
        'Please fill in at least Problem and Customer sections first.',
        'Моля, попълнете поне секции Проблем и Клиент.'
      ));
      return;
    }
    const s = scoreIdea(startupData);
    setScores(s);
    const combined = `${startupData.problem} ${startupData.customer} ${startupData.value_proposition} ${startupData.digital_product} ${startupData.industry}`;
    const cat = detectCategory(combined);
    setSimilarStartups(SIMILAR_DB[cat] || SIMILAR_DB.default);
    setEvaluated(true);
  };

  const totalScore = scores.reduce((a, s) => a + s.score, 0);
  const maxTotal = scores.length * 10;
  const percentage = maxTotal > 0 ? Math.round((totalScore / maxTotal) * 100) : 0;

  const requestAIFeedback = async () => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-feedback', {
        body: {
          type: 'startup_project',
          data: {
            ...startupData,
            innovation_answer: innovationAnswer,
            evaluation_score: percentage,
          },
          lang,
        },
      });
      if (error) throw error;
      if (data?.rateLimited) {
        toast.error(data.error);
        return;
      }
      setAiFeedback(data?.feedback || '');
      if (data?.remaining !== undefined) setRemaining(data.remaining);
    } catch (e: any) {
      toast.error(t('Failed to get AI feedback', 'Грешка при получаване на AI обратна връзка'));
    } finally {
      setAiLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400';
    if (score >= 5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const progressColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Maturity Progress */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          {t('Idea Maturity', 'Зрялост на идеята')}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          {MATURITY_STAGES.map((stage, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className={`w-full h-2 rounded-full ${i <= maturityStage ? 'bg-primary' : 'bg-muted'}`} />
              <span className={`text-[10px] mt-1 text-center leading-tight ${i <= maturityStage ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {lang === 'bg' ? stage.bg : stage.en}
              </span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {t('Current stage:', 'Текущ етап:')} <strong className="text-foreground">{lang === 'bg' ? MATURITY_STAGES[maturityStage].bg : MATURITY_STAGES[maturityStage].en}</strong>
        </p>
      </div>

      {/* Evaluate Button */}
      {!evaluated && (
        <div className="text-center">
          <Button onClick={runEvaluation} size="lg" className="gap-2" disabled={!hasEnoughData}>
            <Sparkles className="h-5 w-5" />
            {t('Evaluate My Idea', 'Оцени моята идея')}
          </Button>
          {!hasEnoughData && (
            <p className="text-xs text-muted-foreground mt-2">
              {t('Fill in Problem and Customer sections to enable evaluation.', 'Попълнете секциите Проблем и Клиент, за да активирате оценката.')}
            </p>
          )}
        </div>
      )}

      {evaluated && (
        <>
          {/* Score Overview */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {t('Idea Evaluation Score', 'Оценка на идеята')}
              </h3>
              <div className="text-right">
                <span className={`text-3xl font-bold ${scoreColor(percentage / 10)}`}>{totalScore}</span>
                <span className="text-lg text-muted-foreground">/{maxTotal}</span>
                <Badge variant={percentage >= 70 ? 'default' : percentage >= 40 ? 'secondary' : 'destructive'} className="ml-2">
                  {percentage}%
                </Badge>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {scores.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.criterion} className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground flex-1">
                        {lang === 'bg' ? s.labelBg : s.label}
                      </span>
                      <span className={`text-sm font-bold ${scoreColor(s.score)}`}>{s.score}/10</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${progressColor(s.score)}`}
                        style={{ width: `${s.score * 10}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <Button variant="outline" size="sm" onClick={runEvaluation} className="mt-4 gap-1">
              <Sparkles className="h-4 w-4" />
              {t('Re-evaluate', 'Преоцени')}
            </Button>
          </div>

          {/* Similar Startups */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              {t('Similar Startups', 'Подобни стартъпи')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                'These existing startups solve similar problems. Study them to find your unique angle.',
                'Тези съществуващи стартъпи решават подобни проблеми. Проучете ги, за да намерите своя уникален подход.'
              )}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {similarStartups.map((s, i) => (
                <div key={i} className="rounded-lg border border-border bg-accent/30 p-4">
                  <p className="font-semibold text-foreground text-sm mb-1">{s.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lang === 'bg' ? s.descriptionBg : s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Innovation Challenge */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              {t('Innovation Challenge', 'Предизвикателство за иновация')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                'How can your idea improve or innovate compared to existing solutions?',
                'Как вашата идея може да подобри или иновира в сравнение със съществуващите решения?'
              )}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {INNOVATION_PROMPTS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <Badge
                    key={i}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent transition-colors gap-1 py-1.5"
                    onClick={() => {
                      const label = lang === 'bg' ? p.bg : p.en;
                      setInnovationAnswer(prev => prev ? `${prev}, ${label}` : label);
                    }}
                  >
                    <Icon className="h-3 w-3" />
                    {lang === 'bg' ? p.bg : p.en}
                  </Badge>
                );
              })}
            </div>

            <Textarea
              value={innovationAnswer}
              onChange={e => setInnovationAnswer(e.target.value)}
              placeholder={t(
                'Describe how your idea innovates beyond what exists today...',
                'Опишете как вашата идея иновира отвъд това, което съществува днес...'
              )}
              className="min-h-[120px]"
            />
          </div>

          <Separator />

          {/* AI Mentor Feedback */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                {t('AI Mentor Analysis', 'AI Ментор анализ')}
              </h3>
              {remaining !== null && (
                <Badge variant="outline" className="text-xs">
                  {remaining} {t('left today', 'остават днес')}
                </Badge>
              )}
            </div>

            {!aiFeedback ? (
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  {t(
                    'Get AI-powered analysis of your startup idea with strengths, risks, and suggestions.',
                    'Получете AI анализ на стартъп идеята ви със силни страни, рискове и предложения.'
                  )}
                </p>
                <Button onClick={requestAIFeedback} disabled={aiLoading} size="sm" className="gap-1.5">
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {aiLoading ? t('Analyzing...', 'Анализиране...') : t('Get AI Analysis', 'Получи AI анализ')}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  {t('Limited to 3 requests per day.', 'Лимит: 3 заявки на ден.')}
                </p>
              </div>
            ) : (
              <div>
                <div className="rounded-lg bg-accent/50 p-4 text-sm text-foreground leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{aiFeedback}</ReactMarkdown>
                </div>
                <Button variant="outline" size="sm" onClick={requestAIFeedback} disabled={aiLoading} className="mt-3 gap-1">
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {t('Refresh Analysis', 'Обнови анализа')}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
