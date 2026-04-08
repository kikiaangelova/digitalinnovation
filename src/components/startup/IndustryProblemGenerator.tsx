import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Heart, Banknote, GraduationCap, Sprout, Plane, ShoppingCart, Building2,
  ChevronRight, Lightbulb, Users, AlertTriangle, Zap, Brain, Leaf,
  Accessibility, Timer, ArrowLeft, Rocket, Check, ClipboardCheck,
} from 'lucide-react';

export interface ProblemValidation {
  affected_who: string;
  frequency: string;
  current_solutions: string;
  why_insufficient: string;
  market_size: string;
}

interface Props {
  lang: 'en' | 'bg';
  onProblemSelected: (problem: ProblemCard, industry: IndustryOption, validation: ProblemValidation) => void;
}

interface IndustryOption {
  id: string;
  nameEn: string;
  nameBg: string;
  icon: React.ElementType;
}

interface ProblemCard {
  titleEn: string;
  titleBg: string;
  descEn: string;
  descBg: string;
  whyEn: string;
  whyBg: string;
  affectedEn: string;
  affectedBg: string;
  opportunityEn: string;
  opportunityBg: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const INDUSTRY_OPTIONS: IndustryOption[] = [
  { id: 'healthtech', nameEn: 'HealthTech', nameBg: 'HealthTech', icon: Heart },
  { id: 'fintech', nameEn: 'FinTech', nameBg: 'FinTech', icon: Banknote },
  { id: 'edtech', nameEn: 'EdTech', nameBg: 'EdTech', icon: GraduationCap },
  { id: 'agritech', nameEn: 'AgriTech', nameBg: 'AgriTech', icon: Sprout },
  { id: 'tourismtech', nameEn: 'TourismTech', nameBg: 'TourismTech', icon: Plane },
  { id: 'retailtech', nameEn: 'RetailTech', nameBg: 'RetailTech', icon: ShoppingCart },
  { id: 'smartcities', nameEn: 'Smart Cities', nameBg: 'Умни градове', icon: Building2 },
];

const PROBLEMS: Record<string, ProblemCard[]> = {
  healthtech: [
    {
      titleEn: 'Long wait times for specialist appointments',
      titleBg: 'Дълго чакане за специалист',
      descEn: 'Patients often wait weeks or months for specialist consultations, delaying diagnosis and treatment.',
      descBg: 'Пациентите често чакат седмици или месеци за консултация със специалист, което забавя диагнозата.',
      whyEn: 'Delayed care leads to worse health outcomes and higher costs.',
      whyBg: 'Забавената грижа води до по-лоши здравни резултати и по-високи разходи.',
      affectedEn: 'Patients in rural and underserved areas',
      affectedBg: 'Пациенти в селски и отдалечени райони',
      opportunityEn: 'Digital health platforms for remote consultations and AI triage.',
      opportunityBg: 'Дигитални здравни платформи за отдалечени консултации и AI триаж.',
      difficulty: 'beginner',
    },
    {
      titleEn: 'Mental health access for young people',
      titleBg: 'Достъп до психично здраве за младежи',
      descEn: 'Many teenagers struggle to find affordable and stigma-free mental health support.',
      descBg: 'Много тийнейджъри трудно намират достъпна и без стигма подкрепа за психичното здраве.',
      whyEn: 'Youth mental health issues are rising globally, but access to care remains low.',
      whyBg: 'Проблемите с психичното здраве при младежите нарастват, но достъпът до грижа остава нисък.',
      affectedEn: 'Teenagers and young adults aged 13–25',
      affectedBg: 'Тийнейджъри и млади хора на възраст 13–25',
      opportunityEn: 'AI chatbots, anonymous peer support platforms, or gamified therapy apps.',
      opportunityBg: 'AI чатботове, анонимни платформи за подкрепа или геймифицирани терапевтични приложения.',
      difficulty: 'intermediate',
    },
    {
      titleEn: 'Chronic disease management across providers',
      titleBg: 'Управление на хронични заболявания между лекари',
      descEn: 'Patients with chronic conditions see multiple doctors but their records are fragmented.',
      descBg: 'Пациентите с хронични заболявания посещават множество лекари, но записите им са фрагментирани.',
      whyEn: 'Fragmented records lead to medication errors and redundant tests.',
      whyBg: 'Фрагментираните записи водят до грешки в лечението и ненужни изследвания.',
      affectedEn: 'Patients with diabetes, heart disease, and other chronic conditions',
      affectedBg: 'Пациенти с диабет, сърдечни заболявания и други хронични състояния',
      opportunityEn: 'Unified patient health dashboard with cross-provider data sharing.',
      opportunityBg: 'Единно табло за здравето на пациента с споделяне на данни между лекарите.',
      difficulty: 'advanced',
    },
  ],
  fintech: [
    {
      titleEn: 'Financial literacy among teenagers',
      titleBg: 'Финансова грамотност сред тийнейджърите',
      descEn: 'Most young people graduate high school without basic financial skills like budgeting or saving.',
      descBg: 'Повечето младежи завършват гимназия без основни финансови умения като бюджетиране или спестяване.',
      whyEn: 'Poor financial habits formed early lead to debt and economic instability.',
      whyBg: 'Лошите финансови навици, формирани рано, водят до дългове и икономическа нестабилност.',
      affectedEn: 'Teenagers aged 14–18',
      affectedBg: 'Тийнейджъри на възраст 14–18',
      opportunityEn: 'Gamified financial education app with simulated budgets.',
      opportunityBg: 'Геймифицирано приложение за финансово образование със симулирани бюджети.',
      difficulty: 'beginner',
    },
    {
      titleEn: 'Access to banking for underserved communities',
      titleBg: 'Достъп до банкиране за уязвими общности',
      descEn: 'Millions of people lack access to basic banking services due to location or documentation barriers.',
      descBg: 'Милиони хора нямат достъп до базови банкови услуги заради местоположение или документи.',
      whyEn: 'Financial exclusion perpetuates poverty cycles.',
      whyBg: 'Финансовото изключване задълбочава бедността.',
      affectedEn: 'Unbanked populations in rural areas',
      affectedBg: 'Хора без банкови сметки в селските райони',
      opportunityEn: 'Mobile-first digital banking with simplified KYC.',
      opportunityBg: 'Мобилно банкиране с опростена верификация.',
      difficulty: 'intermediate',
    },
    {
      titleEn: 'Cross-border payment friction for small businesses',
      titleBg: 'Трудности при международни плащания за малки бизнеси',
      descEn: 'Small businesses face high fees and delays when receiving international payments.',
      descBg: 'Малките бизнеси плащат високи такси и чакат дълго при международни плащания.',
      whyEn: 'High transaction costs reduce profit margins for small exporters.',
      whyBg: 'Високите такси намаляват маржа на малките износители.',
      affectedEn: 'Small and medium businesses with international clients',
      affectedBg: 'Малки и средни предприятия с международни клиенти',
      opportunityEn: 'Blockchain or AI-powered instant cross-border payment platform.',
      opportunityBg: 'Блокчейн или AI платформа за мигновени международни плащания.',
      difficulty: 'advanced',
    },
  ],
  edtech: [
    {
      titleEn: 'Personalized learning paths are missing',
      titleBg: 'Липсват персонализирани учебни пътеки',
      descEn: 'Students learn at different speeds but most schools use a one-size-fits-all approach.',
      descBg: 'Учениците учат с различна скорост, но повечето училища използват единен подход.',
      whyEn: 'Students who fall behind or advance quickly are both underserved.',
      whyBg: 'Изоставащите и напредналите ученици не получават адекватна подкрепа.',
      affectedEn: 'K-12 students and teachers',
      affectedBg: 'Ученици от 1–12 клас и учители',
      opportunityEn: 'AI-powered adaptive learning platform.',
      opportunityBg: 'AI-базирана адаптивна учебна платформа.',
      difficulty: 'beginner',
    },
    {
      titleEn: 'Lack of practical skills training in schools',
      titleBg: 'Липса на обучение по практически умения в училищата',
      descEn: 'Schools focus on theory but students lack coding, entrepreneurship, and digital skills.',
      descBg: 'Училищата наблягат на теорията, но учениците нямат умения по програмиране и дигитални технологии.',
      whyEn: 'The skills gap between education and industry is widening.',
      whyBg: 'Разликата между образование и индустрия се увеличава.',
      affectedEn: 'High school and university students',
      affectedBg: 'Гимназисти и университетски студенти',
      opportunityEn: 'Project-based learning platforms with industry mentorship.',
      opportunityBg: 'Платформи за проектно-базирано учене с индустриално менторство.',
      difficulty: 'intermediate',
    },
    {
      titleEn: 'Teacher burnout and administrative overload',
      titleBg: 'Прегаряне на учители и административна претовареност',
      descEn: 'Teachers spend excessive time on grading, attendance, and reports instead of teaching.',
      descBg: 'Учителите прекарват прекалено много време в оценяване, присъствие и отчети вместо преподаване.',
      whyEn: 'Burnout leads to teacher shortages and lower quality education.',
      whyBg: 'Прегарянето води до недостиг на учители и по-ниско качество на образованието.',
      affectedEn: 'Teachers and school administrators',
      affectedBg: 'Учители и училищни администратори',
      opportunityEn: 'AI teaching assistant that automates grading and progress tracking.',
      opportunityBg: 'AI учителски асистент, който автоматизира оценяването и проследяването.',
      difficulty: 'advanced',
    },
  ],
  agritech: [
    {
      titleEn: 'Small farmers lack access to market data',
      titleBg: 'Малките фермери нямат достъп до пазарни данни',
      descEn: 'Small-scale farmers sell at low prices because they lack real-time market information.',
      descBg: 'Малките фермери продават на ниски цени, защото нямат информация за пазара в реално време.',
      whyEn: 'Information asymmetry keeps farmers in poverty.',
      whyBg: 'Информационната асиметрия задържа фермерите в бедност.',
      affectedEn: 'Small-scale farmers in developing regions',
      affectedBg: 'Малки фермери в развиващите се региони',
      opportunityEn: 'Mobile app with real-time crop prices and buyer connections.',
      opportunityBg: 'Мобилно приложение с цени на реколтата в реално време и връзка с купувачи.',
      difficulty: 'beginner',
    },
    {
      titleEn: 'Water waste in irrigation',
      titleBg: 'Разхищаване на вода при напояването',
      descEn: 'Traditional irrigation wastes up to 60% of water, straining scarce resources.',
      descBg: 'Традиционното напояване разхищава до 60% от водата.',
      whyEn: 'Water scarcity is a growing global crisis affecting food security.',
      whyBg: 'Недостигът на вода е нарастваща глобална криза, засягаща продоволствената сигурност.',
      affectedEn: 'Farmers and communities in drought-prone areas',
      affectedBg: 'Фермери и общности в райони, склонни към засушаване',
      opportunityEn: 'IoT smart irrigation systems with AI-based scheduling.',
      opportunityBg: 'IoT системи за умно напояване с AI-базирано планиране.',
      difficulty: 'intermediate',
    },
    {
      titleEn: 'Food supply chain traceability',
      titleBg: 'Проследимост на хранителната верига',
      descEn: 'Consumers and retailers cannot verify the origin, safety, or sustainability of food products.',
      descBg: 'Потребителите и търговците не могат да проверят произхода и безопасността на храните.',
      whyEn: 'Food fraud and contamination outbreaks damage trust and health.',
      whyBg: 'Хранителните измами и замърсявания увреждат доверието и здравето.',
      affectedEn: 'Consumers, retailers, and regulators',
      affectedBg: 'Потребители, търговци и регулатори',
      opportunityEn: 'Blockchain-based farm-to-table traceability platform.',
      opportunityBg: 'Блокчейн платформа за проследяване от фермата до масата.',
      difficulty: 'advanced',
    },
  ],
  tourismtech: [
    {
      titleEn: 'Over-tourism in popular destinations',
      titleBg: 'Свръхтуризъм в популярни дестинации',
      descEn: 'Popular tourist spots become overcrowded, hurting local communities and the environment.',
      descBg: 'Популярните туристически места стават пренаселени, увреждайки местните общности и околната среда.',
      whyEn: 'Unsustainable tourism degrades cultural sites and natural habitats.',
      whyBg: 'Неустойчивият туризъм деградира културни обекти и природни местообитания.',
      affectedEn: 'Local communities, tourists, and the environment',
      affectedBg: 'Местни общности, туристи и околната среда',
      opportunityEn: 'Smart tourism platform that distributes visitors to lesser-known destinations.',
      opportunityBg: 'Платформа за умен туризъм, насочваща посетителите към по-малко известни дестинации.',
      difficulty: 'beginner',
    },
    {
      titleEn: 'Language barriers for travelers',
      titleBg: 'Езикови бариери за пътуващите',
      descEn: 'Travelers struggle to communicate, navigate, and understand local culture abroad.',
      descBg: 'Пътуващите трудно комуникират и разбират местната култура зад граница.',
      whyEn: 'Language barriers reduce tourism satisfaction and spending.',
      whyBg: 'Езиковите бариери намаляват удовлетвореността и разходите на туристите.',
      affectedEn: 'International travelers and local businesses',
      affectedBg: 'Международни пътуващи и местни бизнеси',
      opportunityEn: 'AI real-time translation app with cultural context.',
      opportunityBg: 'AI приложение за превод в реално време с културен контекст.',
      difficulty: 'intermediate',
    },
    {
      titleEn: 'Accessibility in tourism for disabled travelers',
      titleBg: 'Достъпност в туризма за хора с увреждания',
      descEn: 'People with disabilities face major barriers finding accessible accommodations and transport.',
      descBg: 'Хората с увреждания срещат сериозни пречки при намиране на достъпни настанявания и транспорт.',
      whyEn: 'Over 1 billion people worldwide have disabilities — a massively underserved market.',
      whyBg: 'Над 1 милиард души по света имат увреждания — огромен необслужен пазар.',
      affectedEn: 'Travelers with physical, visual, or cognitive disabilities',
      affectedBg: 'Пътуващи с физически, зрителни или когнитивни увреждания',
      opportunityEn: 'Platform that rates and maps accessible venues, transport, and experiences.',
      opportunityBg: 'Платформа, която оценява и картографира достъпни обекти, транспорт и преживявания.',
      difficulty: 'advanced',
    },
  ],
  retailtech: [
    {
      titleEn: 'High return rates in online shopping',
      titleBg: 'Висок процент на връщане при онлайн пазаруване',
      descEn: 'Online shoppers return up to 30% of purchases due to sizing, color, or expectation mismatches.',
      descBg: 'Онлайн купувачите връщат до 30% от покупките заради размер, цвят или неоправдани очаквания.',
      whyEn: 'Returns cost retailers billions and create massive waste.',
      whyBg: 'Връщанията струват милиарди на търговците и създават огромно разхищение.',
      affectedEn: 'Online retailers and consumers',
      affectedBg: 'Онлайн търговци и потребители',
      opportunityEn: 'AR/AI virtual try-on and smart sizing tools.',
      opportunityBg: 'AR/AI виртуално пробване и интелигентни инструменти за размери.',
      difficulty: 'beginner',
    },
    {
      titleEn: 'Food waste in grocery retail',
      titleBg: 'Хранителни отпадъци в хранителната търговия',
      descEn: 'Supermarkets discard tons of unsold food daily while people go hungry.',
      descBg: 'Супермаркетите изхвърлят тонове непродадена храна ежедневно, докато хора гладуват.',
      whyEn: 'Food waste contributes to climate change and social inequality.',
      whyBg: 'Хранителните отпадъци допринасят за климатичните промени и социалното неравенство.',
      affectedEn: 'Retailers, consumers, and the environment',
      affectedBg: 'Търговци, потребители и околната среда',
      opportunityEn: 'AI demand prediction and surplus food redistribution marketplace.',
      opportunityBg: 'AI предвиждане на търсенето и маркетплейс за преразпределение на излишна храна.',
      difficulty: 'intermediate',
    },
    {
      titleEn: 'Local shops losing to e-commerce giants',
      titleBg: 'Местните магазини губят от е-commerce гиганти',
      descEn: 'Small local retailers struggle to compete with Amazon and other online giants.',
      descBg: 'Малките местни търговци трудно се конкурират с Amazon и другите онлайн гиганти.',
      whyEn: 'Loss of local businesses weakens communities and reduces economic diversity.',
      whyBg: 'Загубата на местни бизнеси отслабва общностите и намалява икономическото разнообразие.',
      affectedEn: 'Small business owners and local communities',
      affectedBg: 'Собственици на малки бизнеси и местни общности',
      opportunityEn: 'Hyper-local delivery and discovery platform for neighborhood shops.',
      opportunityBg: 'Хипер-локална платформа за доставка и откриване на квартални магазини.',
      difficulty: 'advanced',
    },
  ],
  smartcities: [
    {
      titleEn: 'Traffic congestion and commute times',
      titleBg: 'Задръствания и дълго пътуване до работа',
      descEn: 'Urban residents spend hours daily in traffic, wasting time and fuel.',
      descBg: 'Градските жители прекарват часове ежедневно в задръствания, губейки време и гориво.',
      whyEn: 'Congestion costs billions in productivity and increases air pollution.',
      whyBg: 'Задръстванията струват милиарди загубена производителност и увеличават замърсяването.',
      affectedEn: 'Urban commuters, delivery services, and city governments',
      affectedBg: 'Градски пътници, доставчици и градски управи',
      opportunityEn: 'AI traffic management and multimodal transport optimization.',
      opportunityBg: 'AI управление на трафика и оптимизация на мултимодалния транспорт.',
      difficulty: 'beginner',
    },
    {
      titleEn: 'Urban energy waste in buildings',
      titleBg: 'Енергийно разхищение в градски сгради',
      descEn: 'Buildings account for 40% of energy use, much of it wasted through inefficiency.',
      descBg: 'Сградите използват 40% от енергията, голяма част от която се разхищава.',
      whyEn: 'Energy waste accelerates climate change and increases utility costs.',
      whyBg: 'Енергийното разхищение ускорява климатичните промени и увеличава сметките.',
      affectedEn: 'Building owners, tenants, and city planners',
      affectedBg: 'Собственици на сгради, наематели и градски планировчици',
      opportunityEn: 'IoT smart building energy management systems.',
      opportunityBg: 'IoT системи за интелигентно управление на енергията в сградите.',
      difficulty: 'intermediate',
    },
    {
      titleEn: 'Citizen engagement in local governance',
      titleBg: 'Гражданско участие в местното управление',
      descEn: 'Citizens feel disconnected from local government decisions that affect their lives.',
      descBg: 'Гражданите се чувстват откъснати от решенията на местното управление.',
      whyEn: 'Low civic engagement leads to policies that don\'t reflect community needs.',
      whyBg: 'Ниското гражданско участие води до политики, които не отразяват нуждите на общността.',
      affectedEn: 'Citizens and local government officials',
      affectedBg: 'Граждани и местни управленски лица',
      opportunityEn: 'Digital civic engagement platform with participatory budgeting.',
      opportunityBg: 'Дигитална платформа за гражданско участие с партисипативно бюджетиране.',
      difficulty: 'advanced',
    },
  ],
};

const INNOVATION_PROMPTS = [
  { en: '🤖 Could AI help?', bg: '🤖 Може ли AI да помогне?' },
  { en: '📱 Mobile app solution?', bg: '📱 Мобилно приложение?' },
  { en: '🌐 Platform / Marketplace?', bg: '🌐 Платформа / Marketplace?' },
  { en: '📊 Data analytics approach?', bg: '📊 Подход с анализ на данни?' },
  { en: '🔗 Blockchain for trust?', bg: '🔗 Блокчейн за доверие?' },
  { en: '🎮 Gamification?', bg: '🎮 Геймификация?' },
  { en: '🤝 Community-driven?', bg: '🤝 Движено от общността?' },
  { en: '♻️ Sustainability focus?', bg: '♻️ Фокус върху устойчивостта?' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-[hsl(var(--sim-success))]/15 text-[hsl(var(--sim-success))]',
  intermediate: 'bg-[hsl(var(--sim-warning))]/15 text-[hsl(var(--sim-warning))]',
  advanced: 'bg-destructive/15 text-destructive',
};

const DIFFICULTY_LABELS: Record<string, { en: string; bg: string }> = {
  beginner: { en: 'Beginner', bg: 'Начинаещ' },
  intermediate: { en: 'Intermediate', bg: 'Средно' },
  advanced: { en: 'Advanced', bg: 'Напреднал' },
};

const EMPTY_VALIDATION: ProblemValidation = {
  affected_who: '',
  frequency: '',
  current_solutions: '',
  why_insufficient: '',
  market_size: '',
};

export default function IndustryProblemGenerator({ lang, onProblemSelected }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<ProblemCard | null>(null);
  const [innovationAnswer, setInnovationAnswer] = useState('');
  const [step, setStep] = useState<'industry' | 'problems' | 'validate' | 'innovate'>('industry');
  const [validation, setValidation] = useState<ProblemValidation>(EMPTY_VALIDATION);

  const handleSelectIndustry = (id: string) => {
    setSelectedIndustry(id);
    setSelectedProblem(null);
    setStep('problems');
  };

  const handleSelectProblem = (problem: ProblemCard) => {
    setSelectedProblem(problem);
    setValidation(EMPTY_VALIDATION);
    setStep('validate');
  };

  const handleConfirm = () => {
    if (!selectedProblem || !selectedIndustry) return;
    const industry = INDUSTRY_OPTIONS.find(i => i.id === selectedIndustry)!;
    onProblemSelected(selectedProblem, industry, validation);
  };

  // Count filled validation fields
  const filledValidationCount = [
    validation.affected_who.trim().length > 0,
    validation.frequency.length > 0,
    validation.current_solutions.trim().length > 0,
    validation.why_insufficient.trim().length > 0,
    validation.market_size.trim().length > 0,
  ].filter(Boolean).length;
  const validationProgress = Math.round((filledValidationCount / 5) * 100);
  const canContinue = filledValidationCount >= 3;

  // ─── Step 1: Industry Selection ───
  if (step === 'industry') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Lightbulb className="h-4 w-4" />
            {t('Industry Problem Generator', 'Генератор на индустриални проблеми')}
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">
            {t('Choose an Industry', 'Избери индустрия')}
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            {t(
              'Start from a real industry problem instead of a random idea. Select an industry to explore digital innovation opportunities.',
              'Започни от реален индустриален проблем вместо случайна идея. Избери индустрия, за да проучиш възможностите за дигитални иновации.',
            )}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {INDUSTRY_OPTIONS.map(ind => {
            const Icon = ind.icon;
            return (
              <button
                key={ind.id}
                onClick={() => handleSelectIndustry(ind.id)}
                className="group relative flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="font-semibold text-foreground">{lang === 'bg' ? ind.nameBg : ind.nameEn}</span>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Step 2: Problem Cards ───
  if (step === 'problems' && selectedIndustry) {
    const problems = PROBLEMS[selectedIndustry] || [];
    const ind = INDUSTRY_OPTIONS.find(i => i.id === selectedIndustry)!;
    const IndIcon = ind.icon;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setStep('industry')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {t('Back', 'Назад')}
          </Button>
          <div className="flex items-center gap-2">
            <IndIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-bold text-foreground">
              {lang === 'bg' ? ind.nameBg : ind.nameEn} — {t('Real Problems', 'Реални проблеми')}
            </h2>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {t(
            'Select a problem that interests you. You will then validate it before building your startup solution.',
            'Избери проблем, който те интересува. След това ще го валидираш, преди да изградиш стартъп решение.',
          )}
        </p>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSelectProblem(p)}
              className="group text-left rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground leading-snug">
                  {lang === 'bg' ? p.titleBg : p.titleEn}
                </h3>
                <Badge className={`shrink-0 text-xs border-0 ${DIFFICULTY_COLORS[p.difficulty]}`}>
                  {lang === 'bg' ? DIFFICULTY_LABELS[p.difficulty].bg : DIFFICULTY_LABELS[p.difficulty].en}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {lang === 'bg' ? p.descBg : p.descEn}
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-[hsl(var(--sim-warning))] mt-0.5 shrink-0" />
                  <span className="text-foreground/80">
                    <strong>{t('Why it matters:', 'Защо е важно:')}</strong> {lang === 'bg' ? p.whyBg : p.whyEn}
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground/80">
                    <strong>{t('Affected:', 'Засегнати:')}</strong> {lang === 'bg' ? p.affectedBg : p.affectedEn}
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[hsl(var(--sim-success))] mt-0.5 shrink-0" />
                  <span className="text-foreground/80">
                    <strong>{t('Opportunity:', 'Възможност:')}</strong> {lang === 'bg' ? p.opportunityBg : p.opportunityEn}
                  </span>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {t('Select this problem', 'Избери този проблем')} <ChevronRight className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Step 3: Problem Validation ───
  if (step === 'validate' && selectedProblem && selectedIndustry) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setStep('problems')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {t('Back', 'Назад')}
          </Button>
        </div>

        {/* Selected problem summary */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Check className="h-4 w-4" />
            {t('Selected Problem', 'Избран проблем')}
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {lang === 'bg' ? selectedProblem.titleBg : selectedProblem.titleEn}
          </h3>
          <p className="text-sm text-muted-foreground">
            {lang === 'bg' ? selectedProblem.descBg : selectedProblem.descEn}
          </p>
        </div>

        {/* Validation form */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">
              {t('Problem Validation', 'Валидация на проблема')}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {t(
              'Before building a solution, validate that this is a real, significant problem. Answer at least 3 of the 5 questions below.',
              'Преди да изградите решение, потвърдете, че това е реален и значим проблем. Отговорете на поне 3 от 5-те въпроса по-долу.',
            )}
          </p>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {t('Completed', 'Попълнени')}: {filledValidationCount} / 5
              </span>
              <span className={`font-medium ${canContinue ? 'text-[hsl(var(--sim-success))]' : 'text-muted-foreground'}`}>
                {canContinue
                  ? t('✓ You can continue', '✓ Можете да продължите')
                  : t('Fill at least 3 to continue', 'Попълнете поне 3 за да продължите')}
              </span>
            </div>
            <Progress value={validationProgress} className="h-2" />
          </div>

          {/* Q1: Who is most affected */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {t('Who is most affected by this problem?', 'Кой е най-засегнат от този проблем?')}
            </Label>
            <Input
              value={validation.affected_who}
              onChange={e => setValidation(v => ({ ...v, affected_who: e.target.value }))}
              placeholder={t('e.g. Elderly patients in rural areas', 'напр. Възрастни пациенти в селските райони')}
              maxLength={200}
            />
          </div>

          {/* Q2: Frequency */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              {t('How often does this problem occur?', 'Колко често се случва този проблем?')}
            </Label>
            <RadioGroup
              value={validation.frequency}
              onValueChange={v => setValidation(val => ({ ...val, frequency: v }))}
              className="flex flex-wrap gap-4"
            >
              {[
                { value: 'daily', en: 'Daily', bg: 'Ежедневно' },
                { value: 'weekly', en: 'Weekly', bg: 'Седмично' },
                { value: 'occasionally', en: 'Occasionally', bg: 'Понякога' },
              ].map(opt => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.value} id={`freq-${opt.value}`} />
                  <Label htmlFor={`freq-${opt.value}`} className="text-sm cursor-pointer">
                    {lang === 'bg' ? opt.bg : opt.en}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Q3: Current solutions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {t('How do people currently solve this problem?', 'Как хората в момента решават този проблем?')}
            </Label>
            <Textarea
              value={validation.current_solutions}
              onChange={e => setValidation(v => ({ ...v, current_solutions: e.target.value }))}
              placeholder={t('Describe existing solutions or workarounds...', 'Опишете съществуващи решения или заобиколни пътища...')}
              className="min-h-[80px] text-sm resize-y"
              maxLength={500}
            />
          </div>

          {/* Q4: Why insufficient */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {t('Why are current solutions not sufficient?', 'Защо настоящите решения не са достатъчни?')}
            </Label>
            <Textarea
              value={validation.why_insufficient}
              onChange={e => setValidation(v => ({ ...v, why_insufficient: e.target.value }))}
              placeholder={t('What gaps or pain points remain?', 'Какви пропуски или болки остават?')}
              className="min-h-[80px] text-sm resize-y"
              maxLength={500}
            />
          </div>

          {/* Q5: Market size */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {t('How big could the potential market be?', 'Колко голям може да бъде потенциалният пазар?')}
            </Label>
            <Textarea
              value={validation.market_size}
              onChange={e => setValidation(v => ({ ...v, market_size: e.target.value }))}
              placeholder={t('Estimate the number of people affected, market value, etc.', 'Оценете броя на засегнатите хора, пазарна стойност и т.н.')}
              className="min-h-[80px] text-sm resize-y"
              maxLength={500}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('problems')} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('Back', 'Назад')}
          </Button>
          <Button
            onClick={() => setStep('innovate')}
            disabled={!canContinue}
            className="flex-1"
          >
            {t('Continue to Startup Idea', 'Продължи към стартъп идеята')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  // ─── Step 4: Innovation Prompts + Confirm ───
  if (step === 'innovate' && selectedProblem && selectedIndustry) {
    const ind = INDUSTRY_OPTIONS.find(i => i.id === selectedIndustry)!;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setStep('validate')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {t('Back', 'Назад')}
          </Button>
        </div>

        {/* Selected problem summary */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Check className="h-4 w-4" />
            {t('Selected Problem', 'Избран проблем')}
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {lang === 'bg' ? selectedProblem.titleBg : selectedProblem.titleEn}
          </h3>
          <p className="text-sm text-muted-foreground">
            {lang === 'bg' ? selectedProblem.descBg : selectedProblem.descEn}
          </p>
          <Badge className={`text-xs border-0 ${DIFFICULTY_COLORS[selectedProblem.difficulty]}`}>
            {lang === 'bg' ? DIFFICULTY_LABELS[selectedProblem.difficulty].bg : DIFFICULTY_LABELS[selectedProblem.difficulty].en}
          </Badge>
        </div>

        {/* Innovation Challenge */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">
              {t('Innovation Challenge', 'Предизвикателство за иновация')}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {t(
              'How could digital technology solve this problem? Think about these questions:',
              'Как дигиталните технологии биха могли да решат този проблем? Помислете над тези въпроси:',
            )}
          </p>

          <div className="flex flex-wrap gap-2">
            {INNOVATION_PROMPTS.map((p, i) => (
              <Badge
                key={i}
                variant="outline"
                className="cursor-pointer hover:bg-accent transition-colors text-xs py-1.5"
                onClick={() => {
                  const text = lang === 'bg' ? p.bg : p.en;
                  setInnovationAnswer(prev => prev ? `${prev}\n${text}` : text);
                }}
              >
                {lang === 'bg' ? p.bg : p.en}
              </Badge>
            ))}
          </div>

          <Textarea
            value={innovationAnswer}
            onChange={e => setInnovationAnswer(e.target.value)}
            placeholder={t(
              'Describe how you would solve this problem using digital innovation...',
              'Опишете как бихте решили този проблем чрез дигитални иновации...',
            )}
            className="min-h-[140px] text-sm resize-y"
          />
        </div>

        {/* Confirm */}
        {innovationAnswer.length > 0 && innovationAnswer.trim().length < 20 && (
          <p className="text-xs text-destructive text-center">
            {t('Write at least 20 characters to continue', 'Напишете поне 20 знака за да продължите')}
          </p>
        )}
        <Button onClick={handleConfirm} className="w-full" size="lg" disabled={innovationAnswer.trim().length < 20}>
          <Rocket className="h-4 w-4 mr-2" />
          {t('Start Building My Startup Solution', 'Започни изграждането на моето стартъп решение')}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          {t(
            'This will populate the Startup Builder with your chosen problem and open the Sections tab.',
            'Това ще попълни стартъп конструктора с избрания проблем и ще отвори секцията Секции.',
          )}
        </p>
      </div>
    );
  }

  return null;
}
