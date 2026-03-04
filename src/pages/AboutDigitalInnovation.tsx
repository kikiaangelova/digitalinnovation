import { useLang } from '@/context/LangContext';
import AppHeader from '@/components/layout/AppHeader';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Lightbulb, Target, Users, Rocket, Globe, TrendingUp,
  ArrowRight, BookOpen, Cpu, BarChart3,
  User, Heart, GraduationCap, Brain,
  CheckCircle2, Sparkles, FlaskConical,
  Network, Banknote, Bot, Layers, Workflow,
  Database, Shield, Leaf, CircuitBoard,
} from 'lucide-react';

/* ── Academic topic data ── */
const academicTopics = [
  {
    id: 'digital-innovation',
    icon: Lightbulb,
    title: { en: 'What is Digital Innovation?', bg: 'Какво е дигитална иновация?' },
    intro: {
      en: 'Digital innovation is the application of digital technologies to create new — or modify existing — business processes, products, and customer experiences. It goes beyond simple digitization (converting analog to digital) and digitalization (using digital tools to improve processes). True digital innovation fundamentally transforms how value is created and delivered.',
      bg: 'Дигиталната иновация е прилагането на дигитални технологии за създаване на нови — или модифициране на съществуващи — бизнес процеси, продукти и клиентски изживявания. Тя надхвърля простата дигитизация (конвертиране от аналогово в дигитално) и дигитализация (използване на дигитални инструменти за подобряване на процеси). Истинската дигитална иновация фундаментално трансформира начина, по който се създава и доставя стойност.',
    },
    points: [
      {
        en: '**Digitization** — Converting physical information into digital format (e.g., scanning paper documents).',
        bg: '**Дигитизация** — Конвертиране на физическа информация в цифров формат (напр. сканиране на хартиени документи).',
      },
      {
        en: '**Digitalization** — Using digital tools to optimize existing workflows (e.g., CRM systems, automated invoicing).',
        bg: '**Дигитализация** — Използване на дигитални инструменти за оптимизиране на съществуващи работни потоци (напр. CRM системи, автоматично фактуриране).',
      },
      {
        en: '**Digital Transformation** — Rethinking the entire business model using technology (e.g., Netflix shifting from DVD rental to a data-driven streaming platform).',
        bg: '**Дигитална трансформация** — Преосмисляне на целия бизнес модел чрез технологии (напр. Netflix преминава от DVD наем към стрийминг платформа, управлявана от данни).',
      },
      {
        en: '**Key enablers:** Cloud computing, AI/ML, IoT, blockchain, big data analytics, 5G connectivity.',
        bg: '**Ключови двигатели:** Облачни изчисления, AI/ML, IoT, блокчейн, анализ на големи данни, 5G свързаност.',
      },
    ],
  },
  {
    id: 'ai-data',
    icon: Bot,
    title: { en: 'AI and the Data Economy', bg: 'AI и икономика на данните' },
    intro: {
      en: 'Artificial Intelligence (AI) and the data economy represent the most transformative forces in modern business. The global AI market is projected to exceed $500 billion by 2027. Organizations that effectively leverage data as a strategic asset and deploy AI for decision-making gain exponential competitive advantages across every industry.',
      bg: 'Изкуственият интелект (AI) и икономиката на данните представляват най-трансформиращите сили в съвременния бизнес. Глобалният AI пазар се очаква да надхвърли $500 милиарда до 2027 г. Организациите, които ефективно използват данните като стратегически актив и прилагат AI за вземане на решения, получават експоненциални конкурентни предимства.',
    },
    points: [
      {
        en: '**Machine Learning** — Algorithms that learn from data to make predictions (e.g., Netflix recommendations, fraud detection in banking).',
        bg: '**Машинно обучение** — Алгоритми, които учат от данни, за да правят прогнози (напр. препоръки на Netflix, откриване на измами в банкирането).',
      },
      {
        en: '**Natural Language Processing (NLP)** — AI that understands and generates human language (e.g., ChatGPT, customer service chatbots).',
        bg: '**Обработка на естествен език (NLP)** — AI, който разбира и генерира човешки език (напр. ChatGPT, чатботове за обслужване на клиенти).',
      },
      {
        en: '**Computer Vision** — AI that interprets images and video (e.g., autonomous vehicles, medical imaging diagnostics).',
        bg: '**Компютърно зрение** — AI, който интерпретира изображения и видео (напр. автономни превозни средства, медицинска диагностика).',
      },
      {
        en: '**Data Monetization** — Turning raw data into revenue through analytics, personalization, and data-as-a-service models.',
        bg: '**Монетизация на данни** — Превръщане на необработени данни в приходи чрез анализи, персонализация и модели данни-като-услуга.',
      },
    ],
  },
  {
    id: 'platform-economy',
    icon: Network,
    title: { en: 'Platform Economy & Network Effects', bg: 'Платформена икономика и мрежови ефекти' },
    intro: {
      en: 'The platform economy is a business model where value is created by facilitating exchanges between two or more interdependent groups — typically consumers and producers. Platforms like Uber, Airbnb, Amazon, and Spotify have disrupted traditional industries by leveraging network effects: the more users join, the more valuable the platform becomes for everyone.',
      bg: 'Платформената икономика е бизнес модел, при който стойността се създава чрез улесняване на обмена между две или повече взаимозависими групи — обикновено потребители и производители. Платформи като Uber, Airbnb, Amazon и Spotify трансформираха традиционните индустрии чрез мрежови ефекти: колкото повече потребители се присъединяват, толкова по-ценна става платформата за всички.',
    },
    points: [
      {
        en: '**Direct Network Effects** — Each new user increases value for all existing users (e.g., WhatsApp — more contacts means more utility).',
        bg: '**Преки мрежови ефекти** — Всеки нов потребител увеличава стойността за всички съществуващи потребители (напр. WhatsApp — повече контакти означава повече полезност).',
      },
      {
        en: '**Indirect Network Effects** — Growth on one side attracts the other (e.g., more Uber drivers attract more riders and vice versa).',
        bg: '**Непреки мрежови ефекти** — Растежът от едната страна привлича другата (напр. повече шофьори на Uber привличат повече пътници и обратно).',
      },
      {
        en: '**Winner-Takes-Most Dynamics** — Platforms tend toward monopoly because switching costs increase as network grows.',
        bg: '**Динамика „Победителят взема почти всичко"** — Платформите клонят към монопол, защото разходите за преминаване се увеличават с растежа на мрежата.',
      },
      {
        en: '**Multi-sided Markets** — Platforms must balance value for all sides (buyers, sellers, advertisers) to sustain growth.',
        bg: '**Многостранни пазари** — Платформите трябва да балансират стойността за всички страни (купувачи, продавачи, рекламодатели) за устойчив растеж.',
      },
    ],
  },
  {
    id: 'startup-ecosystems',
    icon: Rocket,
    title: { en: 'Startup Ecosystems', bg: 'Стартъп екосистеми' },
    intro: {
      en: 'A startup ecosystem is the interconnected network of entrepreneurs, investors, mentors, universities, governments, and support organizations that together create conditions for new ventures to emerge and scale. Successful ecosystems like Silicon Valley, Tel Aviv, Berlin, and Singapore share common elements: access to talent, capital, mentorship, and a culture that tolerates risk and failure.',
      bg: 'Стартъп екосистемата е взаимосвързаната мрежа от предприемачи, инвеститори, ментори, университети, правителства и поддържащи организации, които заедно създават условия за зараждане и мащабиране на нови начинания. Успешните екосистеми като Силициевата долина, Тел Авив, Берлин и Сингапур споделят общи елементи: достъп до таланти, капитал, менторство и култура, която толерира риска и неуспеха.',
    },
    points: [
      {
        en: '**Funding Stages** — Pre-seed → Seed → Series A → Series B → IPO. Each stage has different investors and expectations.',
        bg: '**Етапи на финансиране** — Pre-seed → Seed → Series A → Series B → IPO. Всеки етап има различни инвеститори и очаквания.',
      },
      {
        en: '**Lean Startup Methodology** — Build → Measure → Learn cycle. Validate assumptions with MVPs before scaling.',
        bg: '**Методология Lean Startup** — Цикъл Създай → Измери → Научи. Валидирайте допускания с MVP преди мащабиране.',
      },
      {
        en: '**Accelerators & Incubators** — Programs like Y Combinator, Techstars, and 500 Startups provide mentorship, funding, and network access.',
        bg: '**Акселератори и инкубатори** — Програми като Y Combinator, Techstars и 500 Startups предоставят менторство, финансиране и достъп до мрежи.',
      },
      {
        en: '**EU Startup Support** — Programs like Horizon Europe, EIC Accelerator, and the European Innovation Council fund early-stage deep tech startups.',
        bg: '**Подкрепа за стартъпи в ЕС** — Програми като Horizon Europe, EIC Accelerator и Европейския съвет по иновации финансират стартъпи в ранен етап.',
      },
    ],
  },
];

export default function AboutDigitalInnovation() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const tx = (en: string, bg: string) => lang === 'bg' ? bg : en;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="py-16 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1 mb-5">
            <GraduationCap className="h-3 w-3 text-primary" />
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
              {tx('Educational Reference', 'Образователен справочник')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            {tx('About Digital Innovation', 'За дигиталните иновации')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {tx(
              'Academic reference material covering the key concepts, frameworks, and ecosystems that drive digital transformation in the modern economy.',
              'Академичен справочен материал, обхващащ ключовите концепции, рамки и екосистеми, които движат дигиталната трансформация в съвременната икономика.'
            )}
          </p>
        </div>
      </section>

      {/* ═══════════════ TOPIC NAVIGATION ═══════════════ */}
      <section className="py-6 px-4 bg-muted/30 border-b border-border sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {academicTopics.map(topic => (
              <a
                key={topic.id}
                href={`#${topic.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-accent transition-colors"
              >
                <topic.icon className="h-3.5 w-3.5 text-primary" />
                {topic.title[lang]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ACADEMIC TOPICS ═══════════════ */}
      {academicTopics.map((topic, idx) => (
        <section
          key={topic.id}
          id={topic.id}
          className={`py-14 px-4 border-b border-border ${idx % 2 === 1 ? 'bg-muted/30' : ''}`}
        >
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-start gap-5 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl sim-gradient shadow-lg shrink-0 mt-1">
                <topic.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">
                  {topic.title[lang]}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {topic.intro[lang]}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 mt-6">
              {topic.points.map((point, pi) => (
                <Card key={pi} className="p-5 border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p
                      className="text-sm text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: (lang === 'bg' ? point.bg : point.en).replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="text-foreground">$1</strong>'
                        ),
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ═══════════════ ABOUT THE CREATOR ═══════════════ */}
      <section className="py-16 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              {tx('About the Creator', 'За създателя на платформата')}
            </h2>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="shrink-0">
                <div className="flex h-28 w-28 items-center justify-center rounded-full sim-gradient shadow-xl glow-primary">
                  <User className="h-14 w-14 text-primary-foreground" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-display font-bold text-foreground mb-1">
                  {tx('Kirilka Angelova', 'Кирилка Ангелова')}
                </h3>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge variant="outline" className="text-xs">{tx('Educator', 'Преподавател')}</Badge>
                  <Badge variant="outline" className="text-xs">{tx('Mentor', 'Ментор')}</Badge>
                  <Badge variant="outline" className="text-xs">{tx('Digital Innovation', 'Дигитални иновации')}</Badge>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>{tx(
                    'This platform was created by Kirilka Angelova, an educator, mentor, and professional specializing in digital innovation, entrepreneurship, and digital business strategy.',
                    'Тази платформа е създадена от Кирилка Ангелова – преподавател и ментор в областта на дигиталните иновации, предприемачеството и дигиталния бизнес.'
                  )}</p>
                  <p>{tx(
                    'Her work focuses on helping students understand how technology transforms industries and how innovative ideas can become successful startups.',
                    'Нейната работа е насочена към това да помогне на учениците да разберат как технологиите трансформират индустриите и как иновативните идеи могат да се превърнат в успешни стартъпи.'
                  )}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">{t.readyToLearn}</h2>
          <p className="text-muted-foreground mb-6">{t.readyToLearnDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="sim-gradient border-0" onClick={() => navigate(user ? '/cases' : '/auth?redirect=/cases')}>
              {t.browseCases} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate(user ? '/simulator' : '/auth?redirect=/simulator')}>
              {t.launchSimulator} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
