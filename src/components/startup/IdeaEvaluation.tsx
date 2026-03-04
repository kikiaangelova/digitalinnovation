import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import {
  Sparkles, Loader2, Target, Users, Zap, Lightbulb, Rocket,
  TrendingUp, AlertTriangle, Search, Map,
  DollarSign, Smile, Brain, Leaf, Accessibility, Timer, Globe2, BarChart3,
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

// ─── Data models ───

interface CriterionScore {
  key: string;
  label: string;
  labelBg: string;
  icon: React.ElementType;
  score: number;
  weight: number;
}

interface Competitor {
  name: string;
  desc: string;
  descBg: string;
  strength: string;
  strengthBg: string;
}

interface MarketInfo {
  size: string;
  sizeBg: string;
  users: string;
  usersBg: string;
  category: string;
  categoryBg: string;
}

// ─── Static data ───

const CRITERIA_DEF = [
  { key: 'problem', label: 'Problem Importance', labelBg: 'Важност на проблема', icon: AlertTriangle, weight: 25 },
  { key: 'customer', label: 'Customer Clarity', labelBg: 'Яснота на клиента', icon: Users, weight: 20 },
  { key: 'innovation', label: 'Innovation Level', labelBg: 'Ниво на иновация', icon: Lightbulb, weight: 20 },
  { key: 'market', label: 'Market Potential', labelBg: 'Пазарен потенциал', icon: TrendingUp, weight: 20 },
  { key: 'feasibility', label: 'Feasibility', labelBg: 'Осъществимост', icon: Target, weight: 15 },
];

const DIFF_QUESTIONS = [
  { icon: DollarSign, en: 'Is it cheaper?', bg: 'По-евтино ли е?' },
  { icon: Timer, en: 'Is it faster?', bg: 'По-бързо ли е?' },
  { icon: Brain, en: 'Does it use AI?', bg: 'Използва ли AI?' },
  { icon: Zap, en: 'Does it solve the problem better?', bg: 'Решава ли проблема по-добре?' },
  { icon: Smile, en: 'Better user experience?', bg: 'По-добро потребителско изживяване?' },
  { icon: Leaf, en: 'More sustainable?', bg: 'По-устойчиво ли е?' },
  { icon: Accessibility, en: 'More accessible?', bg: 'По-достъпно ли е?' },
];

const COMPETITOR_DB: Record<string, Competitor[]> = {
  transport: [
    { name: 'Uber', desc: 'Ride-hailing platform connecting drivers and riders globally', descBg: 'Платформа за споделено пътуване, свързваща шофьори и пътници', strength: 'Massive network effects, global scale', strengthBg: 'Огромни мрежови ефекти, глобален мащаб' },
    { name: 'Lyft', desc: 'US-focused ride-sharing alternative to Uber', descBg: 'Американска алтернатива на Uber за споделено пътуване', strength: 'Strong US market presence', strengthBg: 'Силно присъствие на US пазара' },
    { name: 'Bolt', desc: 'European ride-sharing and micro-mobility platform', descBg: 'Европейска платформа за споделено пътуване и микромобилност', strength: 'Lower fees, European focus', strengthBg: 'По-ниски такси, европейски фокус' },
  ],
  education: [
    { name: 'Duolingo', desc: 'Gamified language learning app with 500M+ users', descBg: 'Геймифицирано приложение за изучаване на езици с 500M+ потребители', strength: 'Gamification, free tier, massive user base', strengthBg: 'Геймификация, безплатен план, огромна потребителска база' },
    { name: 'Coursera', desc: 'Online learning with university-level courses', descBg: 'Онлайн обучение с университетски курсове', strength: 'University partnerships, accredited degrees', strengthBg: 'Партньорства с университети, акредитирани степени' },
    { name: 'Khan Academy', desc: 'Free educational platform for K-12 students', descBg: 'Безплатна образователна платформа за ученици', strength: 'Free, comprehensive, trusted brand', strengthBg: 'Безплатна, всеобхватна, доверен бранд' },
  ],
  food: [
    { name: 'Glovo', desc: 'On-demand delivery for food, groceries, and goods', descBg: 'Доставка при поискване на храна, хранителни стоки и продукти', strength: 'Multi-category delivery', strengthBg: 'Многокатегорийна доставка' },
    { name: 'DoorDash', desc: 'Leading US food delivery marketplace', descBg: 'Водещ US пазар за доставка на храна', strength: 'DashPass loyalty, restaurant partnerships', strengthBg: 'DashPass лоялност, ресторантски партньорства' },
    { name: 'Wolt', desc: 'European food and merchandise delivery', descBg: 'Европейска доставка на храна и стоки', strength: 'Superior UX, curated restaurants', strengthBg: 'Превъзходен UX, подбрани ресторанти' },
  ],
  health: [
    { name: 'Doctolib', desc: 'Healthcare appointment booking platform', descBg: 'Платформа за резервация на лекарски часове', strength: 'European healthcare integration', strengthBg: 'Интеграция с европейското здравеопазване' },
    { name: 'Headspace', desc: 'Meditation and mental wellness app', descBg: 'Приложение за медитация и психическо здраве', strength: 'Brand trust, content library', strengthBg: 'Доверие в бранда, библиотека със съдържание' },
    { name: 'Teladoc', desc: 'Telehealth and virtual doctor visits', descBg: 'Телемедицина и виртуални лекарски прегледи', strength: 'Insurance integrations, convenience', strengthBg: 'Интеграция със застраховки, удобство' },
  ],
  finance: [
    { name: 'Revolut', desc: 'Digital banking, crypto, and global payments', descBg: 'Дигитално банкиране, крипто и глобални плащания', strength: 'Multi-currency, low fees', strengthBg: 'Мулти-валутност, ниски такси' },
    { name: 'Stripe', desc: 'Payment processing for internet businesses', descBg: 'Обработка на плащания за интернет бизнеси', strength: 'Developer-friendly APIs, global reach', strengthBg: 'APIs за разработчици, глобален обхват' },
    { name: 'Wise', desc: 'International money transfers at real exchange rates', descBg: 'Международни парични преводи по реален курс', strength: 'Transparent pricing, real exchange rates', strengthBg: 'Прозрачно ценообразуване, реални валутни курсове' },
  ],
  retail: [
    { name: 'Shopify', desc: 'E-commerce platform for online stores', descBg: 'Платформа за електронна търговия за онлайн магазини', strength: 'Easy to use, massive app ecosystem', strengthBg: 'Лесна за употреба, огромна екосистема от приложения' },
    { name: 'Amazon', desc: 'Global e-commerce and cloud marketplace', descBg: 'Глобален пазар за електронна търговия и облак', strength: 'Logistics, Prime membership, scale', strengthBg: 'Логистика, Prime членство, мащаб' },
    { name: 'Etsy', desc: 'Marketplace for handmade and vintage items', descBg: 'Пазар за ръчно изработени и винтидж артикули', strength: 'Niche focus, artisan community', strengthBg: 'Нишов фокус, общност на занаятчии' },
  ],
  agriculture: [
    { name: 'FarmLogs', desc: 'Farm management and analytics software', descBg: 'Софтуер за управление и анализ на ферми', strength: 'Data-driven farming decisions', strengthBg: 'Решения за земеделие базирани на данни' },
    { name: 'Indigo Agriculture', desc: 'AI-driven sustainable farming platform', descBg: 'AI платформа за устойчиво земеделие', strength: 'Carbon credits, biological solutions', strengthBg: 'Въглеродни кредити, биологични решения' },
    { name: 'John Deere', desc: 'Smart agricultural machinery and precision farming', descBg: 'Интелигентни земеделски машини и прецизно земеделие', strength: 'Hardware + software integration', strengthBg: 'Интеграция на хардуер + софтуер' },
  ],
  tourism: [
    { name: 'TripAdvisor', desc: 'Travel reviews, ratings, and booking', descBg: 'Отзиви за пътувания, рейтинги и резервации', strength: 'User-generated content, trust', strengthBg: 'Съдържание от потребители, доверие' },
    { name: 'Skyscanner', desc: 'Flight and travel price comparison engine', descBg: 'Система за сравнение на цени за полети и пътувания', strength: 'Price comparison, meta-search', strengthBg: 'Сравнение на цени, мета-търсачка' },
    { name: 'Airbnb', desc: 'Short-term rental marketplace for unique stays', descBg: 'Пазар за краткосрочни наеми и уникални престои', strength: 'Community trust, unique experiences', strengthBg: 'Доверие в общността, уникални изживявания' },
  ],
  accommodation: [
    { name: 'Airbnb', desc: 'Marketplace for unique stays worldwide', descBg: 'Пазар за уникални престои по света', strength: 'Brand, host network, experiences', strengthBg: 'Бранд, мрежа от хостове, изживявания' },
    { name: 'Booking.com', desc: 'Largest online accommodation booking platform', descBg: 'Най-голямата платформа за онлайн резервации на настаняване', strength: 'Inventory, flexible cancellations', strengthBg: 'Инвентар, гъвкави отмени' },
  ],
  default: [
    { name: 'Uber', desc: 'Ride-hailing platform', descBg: 'Платформа за споделено пътуване', strength: 'Global scale, network effects', strengthBg: 'Глобален мащаб, мрежови ефекти' },
    { name: 'Airbnb', desc: 'Short-term rental marketplace', descBg: 'Пазар за краткосрочни наеми', strength: 'Community trust, global presence', strengthBg: 'Доверие в общността, глобално присъствие' },
    { name: 'Duolingo', desc: 'Gamified language learning', descBg: 'Геймифицирано учене на езици', strength: 'Gamification, free access', strengthBg: 'Геймификация, безплатен достъп' },
  ],
};

const MARKET_DB: Record<string, MarketInfo> = {
  transport: { size: '$300B+ globally', sizeBg: '$300B+ глобално', users: '1B+ potential riders', usersBg: '1B+ потенциални пътници', category: 'Transportation & Mobility', categoryBg: 'Транспорт и мобилност' },
  education: { size: '$400B+ globally', sizeBg: '$400B+ глобално', users: '1.5B+ students worldwide', usersBg: '1.5B+ ученици по света', category: 'Education Technology', categoryBg: 'Образователни технологии' },
  food: { size: '$150B+ delivery market', sizeBg: '$150B+ пазар за доставки', users: '500M+ users globally', usersBg: '500M+ потребители глобално', category: 'Food & Delivery', categoryBg: 'Храна и доставки' },
  health: { size: '$500B+ digital health', sizeBg: '$500B+ дигитално здраве', users: '2B+ people seeking healthcare', usersBg: '2B+ хора, търсещи здравни грижи', category: 'Digital Health', categoryBg: 'Дигитално здраве' },
  finance: { size: '$200B+ fintech market', sizeBg: '$200B+ финтех пазар', users: '2B+ unbanked/underbanked', usersBg: '2B+ хора без достъп до банки', category: 'Financial Technology', categoryBg: 'Финансови технологии' },
  retail: { size: '$5T+ e-commerce', sizeBg: '$5T+ електронна търговия', users: '2.5B+ online shoppers', usersBg: '2.5B+ онлайн купувачи', category: 'E-Commerce & Retail', categoryBg: 'Електронна търговия' },
  agriculture: { size: '$25B+ agritech', sizeBg: '$25B+ агритех', users: '500M+ farmers', usersBg: '500M+ фермери', category: 'Agriculture Technology', categoryBg: 'Агротехнологии' },
  tourism: { size: '$900B+ travel tech', sizeBg: '$900B+ технологии за пътуване', users: '1.4B+ international travelers', usersBg: '1.4B+ международни пътници', category: 'Travel Technology', categoryBg: 'Технологии за пътуване' },
  accommodation: { size: '$600B+ accommodation', sizeBg: '$600B+ настаняване', users: '800M+ travelers', usersBg: '800M+ пътници', category: 'Hospitality', categoryBg: 'Хотелиерство' },
  default: { size: '$100B+ (estimated)', sizeBg: '$100B+ (приблизително)', users: 'Millions of potential users', usersBg: 'Милиони потенциални потребители', category: 'Technology', categoryBg: 'Технологии' },
};

function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  const keywords: Record<string, string[]> = {
    transport: ['transport', 'ride', 'taxi', 'mobility', 'car', 'drive', 'превоз', 'такси', 'кола'],
    accommodation: ['hotel', 'accommodation', 'rent', 'stay', 'хотел', 'настаняване', 'наем'],
    education: ['learn', 'education', 'teach', 'course', 'student', 'school', 'обучение', 'образование', 'учене', 'курс', 'ученик', 'университет'],
    food: ['food', 'restaurant', 'delivery', 'meal', 'cook', 'храна', 'ресторант', 'доставка', 'готвене'],
    health: ['health', 'medical', 'doctor', 'wellness', 'mental', 'здраве', 'медицин', 'лекар', 'фитнес'],
    finance: ['finance', 'bank', 'payment', 'money', 'invest', 'crypto', 'финанс', 'банк', 'плащане', 'пари'],
    retail: ['shop', 'store', 'ecommerce', 'retail', 'buy', 'sell', 'магазин', 'продажба', 'покупка'],
    agriculture: ['farm', 'agriculture', 'crop', 'harvest', 'земеделие', 'ферма', 'реколта'],
    tourism: ['travel', 'tourism', 'trip', 'tourist', 'туризъм', 'пътуване', 'турист'],
  };
  for (const [cat, words] of Object.entries(keywords)) {
    if (words.some(w => lower.includes(w))) return cat;
  }
  return 'default';
}

function computeScores(data: Props['startupData']): CriterionScore[] {
  const all = `${data.problem} ${data.customer} ${data.value_proposition} ${data.digital_product} ${data.business_model}`;
  const wordCount = all.trim().split(/\s+/).length;

  const raw = (text: string, bonusRe: RegExp) => {
    const len = text.trim().length;
    let s = len > 120 ? 9 : len > 80 ? 7 : len > 40 ? 5 : len > 15 ? 3 : 1;
    if (bonusRe.test(text)) s = Math.min(10, s + 1);
    return s;
  };

  return CRITERIA_DEF.map(c => {
    let score = 1;
    switch (c.key) {
      case 'problem':
        score = raw(data.problem, /why|important|impact|pain|значим|важен|въздействие|болка/i);
        break;
      case 'customer':
        score = raw(data.customer, /age|segment|demographic|persona|възраст|сегмент|демограф/i);
        break;
      case 'innovation':
        score = /ai|machine learning|blockchain|iot|ar|vr|automation|изкуствен интелект|автоматизация/i.test(all) ? 8 : 5;
        if (/unique|novel|first|innovat|disrupt|уникал|нов|иновати|първ/i.test(all)) score = Math.min(10, score + 1);
        break;
      case 'market':
        score = wordCount > 120 ? 8 : wordCount > 60 ? 6 : wordCount > 25 ? 4 : 2;
        if (/scale|global|millions|growth|мащаб|глобал|милион|растеж/i.test(all)) score = Math.min(10, score + 1);
        break;
      case 'feasibility':
        score = raw(data.digital_product, /app|platform|api|website|приложение|платформа|сайт/i);
        if (data.business_model.trim().length > 30) score = Math.min(10, score + 1);
        break;
    }
    return { ...c, score: Math.max(1, Math.min(10, score)) };
  });
}

function getStartupScore(scores: CriterionScore[]): number {
  const totalWeight = scores.reduce((a, s) => a + s.weight, 0);
  const weighted = scores.reduce((a, s) => a + (s.score / 10) * s.weight, 0);
  return Math.round((weighted / totalWeight) * 100);
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
    if (MATURITY_STAGES[i].fields.every(f => ((data as any)[f] || '').trim().length > 15)) return i;
  }
  return 0;
}

// ─── Component ───

export default function IdeaEvaluation({ lang, startupData }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [evaluated, setEvaluated] = useState(false);
  const [scores, setScores] = useState<CriterionScore[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [market, setMarket] = useState<MarketInfo | null>(null);
  const [diffAnswer, setDiffAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  const maturityStage = getMaturityStage(startupData);
  const hasEnoughData = startupData.problem.trim().length > 10 && startupData.customer.trim().length > 10;

  const runEvaluation = () => {
    if (!hasEnoughData) {
      toast.warning(t('Please fill in Problem and Customer sections first.', 'Моля, попълнете секциите Проблем и Клиент.'));
      return;
    }
    const s = computeScores(startupData);
    setScores(s);
    const combined = `${startupData.problem} ${startupData.customer} ${startupData.value_proposition} ${startupData.digital_product} ${startupData.industry}`;
    const cat = detectCategory(combined);
    setCompetitors(COMPETITOR_DB[cat] || COMPETITOR_DB.default);
    setMarket(MARKET_DB[cat] || MARKET_DB.default);
    setEvaluated(true);
  };

  const startupScore = getStartupScore(scores);

  const requestAIFeedback = async () => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-feedback', {
        body: {
          type: 'startup_project',
          data: { ...startupData, differentiation: diffAnswer, startup_score: startupScore },
          lang,
        },
      });
      if (error) throw error;
      if (data?.rateLimited) { toast.error(data.error); return; }
      setAiFeedback(data?.feedback || '');
      if (data?.remaining !== undefined) setRemaining(data.remaining);
    } catch {
      toast.error(t('Failed to get AI feedback', 'Грешка при получаване на AI обратна връзка'));
    } finally {
      setAiLoading(false);
    }
  };

  const scoreColor = (pct: number) => pct >= 70 ? 'text-green-600 dark:text-green-400' : pct >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
  const barColor = (pct: number) => pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500';
  const scoreGrade = (pct: number) => pct >= 80 ? t('Excellent', 'Отличен') : pct >= 60 ? t('Good', 'Добър') : pct >= 40 ? t('Needs Work', 'Нуждае се от работа') : t('Early Stage', 'Начален етап');

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
      <div className="text-center">
        <Button onClick={runEvaluation} size="lg" className="gap-2" disabled={!hasEnoughData}>
          <Sparkles className="h-5 w-5" />
          {evaluated ? t('Re-evaluate My Startup Idea', 'Преоцени моята стартъп идея') : t('Evaluate My Startup Idea', 'Оцени моята стартъп идея')}
        </Button>
        {!hasEnoughData && (
          <p className="text-xs text-muted-foreground mt-2">
            {t('Fill in Problem and Customer to enable evaluation.', 'Попълнете Проблем и Клиент, за да активирате оценката.')}
          </p>
        )}
      </div>

      {evaluated && (
        <>
          {/* ═══ STARTUP SCORE ═══ */}
          <div className="rounded-xl border-2 border-primary/30 bg-card p-6 text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {t('Startup Score', 'Стартъп резултат')}
            </p>
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                  strokeDasharray={`${startupScore * 2.64} 264`} strokeLinecap="round" />
              </svg>
              <span className={`absolute text-3xl font-bold ${scoreColor(startupScore)}`}>{startupScore}</span>
            </div>
            <Badge variant={startupScore >= 60 ? 'default' : 'secondary'} className="text-sm px-3">
              {scoreGrade(startupScore)}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              {t('Evaluated like MIT & Y Combinator accelerators', 'Оценено като MIT & Y Combinator акселератори')}
            </p>
          </div>

          {/* Criteria Breakdown */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {t('Evaluation Criteria', 'Критерии за оценка')}
            </h3>
            <div className="space-y-3">
              {scores.map(s => {
                const Icon = s.icon;
                const pct = s.score * 10;
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {lang === 'bg' ? s.labelBg : s.label}
                        </span>
                        <span className={`text-sm font-bold ${scoreColor(pct)}`}>{s.score}/10</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${barColor(pct)}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">{s.weight}%</Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══ MARKET ANALYSIS ═══ */}
          {market && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-primary" />
                {t('Market Analysis', 'Пазарен анализ')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  'A simplified market overview to help you understand your opportunity.',
                  'Опростен преглед на пазара, за да разберете възможностите си.'
                )}
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{t('Est. Market Size', 'Прибл. размер на пазара')}</p>
                  <p className="text-lg font-bold text-foreground">{lang === 'bg' ? market.sizeBg : market.size}</p>
                </div>
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{t('Potential Users', 'Потенциални потребители')}</p>
                  <p className="text-lg font-bold text-foreground">{lang === 'bg' ? market.usersBg : market.users}</p>
                </div>
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{t('Industry Category', 'Индустриална категория')}</p>
                  <p className="text-lg font-bold text-primary">{lang === 'bg' ? market.categoryBg : market.category}</p>
                </div>
              </div>
            </div>
          )}

          {/* ═══ COMPETITOR LANDSCAPE ═══ */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              {t('Competitor Landscape', 'Конкурентна среда')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                'These companies operate in a similar space. Study them to find your unique advantage.',
                'Тези компании работят в подобна сфера. Проучете ги, за да намерите уникалното си предимство.'
              )}
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {competitors.map((c, i) => (
                <div key={i} className="rounded-lg border border-border bg-accent/20 p-4">
                  <p className="font-semibold text-foreground text-sm mb-1">{c.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">{lang === 'bg' ? c.descBg : c.desc}</p>
                  <div className="flex items-start gap-1">
                    <Zap className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-primary font-medium">{lang === 'bg' ? c.strengthBg : c.strength}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ MARKET MAP ═══ */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              {t('Market Positioning Map', 'Карта на пазарно позициониране')}
            </h3>
            <div className="relative rounded-lg border border-border bg-muted/30 p-6" style={{ minHeight: 260 }}>
              {/* Axes */}
              <div className="absolute bottom-4 left-4 right-4 h-px bg-border" />
              <div className="absolute top-4 bottom-4 left-4 w-px bg-border" />
              <span className="absolute bottom-0 right-4 text-[10px] text-muted-foreground">{t('Innovation →', 'Иновация →')}</span>
              <span className="absolute top-0 left-6 text-[10px] text-muted-foreground">{t('↑ Market Size', '↑ Размер на пазара')}</span>

              {/* Competitors */}
              {competitors.map((c, i) => {
                const positions = [
                  { left: '55%', top: '25%' },
                  { left: '70%', top: '40%' },
                  { left: '40%', top: '55%' },
                ];
                const pos = positions[i % positions.length];
                return (
                  <div key={i} className="absolute flex flex-col items-center" style={{ left: pos.left, top: pos.top }}>
                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                      {c.name.charAt(0)}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{c.name}</span>
                  </div>
                );
              })}

              {/* Your idea */}
              <div className="absolute flex flex-col items-center" style={{ left: '25%', top: '35%' }}>
                <div className="w-10 h-10 rounded-full bg-primary border-2 border-primary flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-[10px] text-primary font-bold mt-0.5">{t('Your Idea', 'Вашата идея')}</span>
              </div>

              {/* Problem label */}
              <div className="absolute bottom-8 left-8 rounded bg-destructive/10 px-2 py-1">
                <span className="text-[10px] font-medium text-destructive">{t('Problem Space', 'Пространство на проблема')}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">
              {t(
                'This map shows where your idea sits relative to competitors. Move towards higher innovation and larger market to increase potential.',
                'Тази карта показва къде е вашата идея спрямо конкурентите. Движете се към по-висока иновация и по-голям пазар.'
              )}
            </p>
          </div>

          {/* ═══ DIFFERENTIATION CHECK ═══ */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              {t('Differentiation Check', 'Проверка за различие')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('How is your idea different or better than existing solutions?', 'Как вашата идея е различна или по-добра от съществуващите решения?')}
            </p>

            <div className="grid sm:grid-cols-2 gap-2 mb-4">
              {DIFF_QUESTIONS.map((q, i) => {
                const Icon = q.icon;
                return (
                  <button
                    key={i}
                    className="flex items-center gap-2 rounded-lg border border-border p-3 text-left text-sm text-foreground hover:bg-accent/50 transition-colors"
                    onClick={() => setDiffAnswer(prev => prev ? `${prev}\n• ${lang === 'bg' ? q.bg : q.en}` : `• ${lang === 'bg' ? q.bg : q.en}`)}
                  >
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    {lang === 'bg' ? q.bg : q.en}
                  </button>
                );
              })}
            </div>

            <Textarea
              value={diffAnswer}
              onChange={e => setDiffAnswer(e.target.value)}
              placeholder={t('Explain what makes your startup unique...', 'Обяснете какво прави вашия стартъп уникален...')}
              className="min-h-[120px]"
            />
          </div>

          <Separator />

          {/* ═══ AI FEEDBACK ═══ */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                {t('AI Startup Validator', 'AI Стартъп валидатор')}
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
                    'Get AI-powered analysis: Strengths, Risks, Improvement Suggestions, and Next Steps — just like a real accelerator review.',
                    'Получете AI анализ: Силни страни, Рискове, Предложения за подобрение и Следващи стъпки — точно като реален акселераторен преглед.'
                  )}
                </p>
                <Button onClick={requestAIFeedback} disabled={aiLoading} size="sm" className="gap-1.5">
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {aiLoading ? t('Validating...', 'Валидиране...') : t('Get AI Analysis', 'Получи AI анализ')}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">{t('Limited to 3 requests per day.', 'Лимит: 3 заявки на ден.')}</p>
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
