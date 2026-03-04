import { useLang } from '@/context/LangContext';
import AppHeader from '@/components/layout/AppHeader';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Lightbulb, Target, Users, Rocket, Globe, TrendingUp,
  ArrowRight, BookOpen, Cpu, BarChart3, ShoppingCart,
  Music, Ship, Tractor, CreditCard, Factory
} from 'lucide-react';

const caseStudies = [
  {
    company: 'Netflix',
    icon: Globe,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    innovation: { en: 'From DVD rental to AI-driven streaming platform', bg: 'От DVD под наем до стрийминг платформа с изкуствен интелект' },
    impact: { en: '280M+ subscribers; disrupted the entire entertainment industry with personalized recommendations', bg: '280M+ абонати; преобрази цялата развлекателна индустрия с персонализирани препоръки' },
    lesson: { en: 'Digital transformation means rethinking your entire business model, not just digitizing existing processes.', bg: 'Дигиталната трансформация означава преосмисляне на целия бизнес модел, а не просто дигитализиране на съществуващи процеси.' },
  },
  {
    company: 'Zara (Inditex)',
    icon: ShoppingCart,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    innovation: { en: 'Real-time supply chain with RFID inventory tracking', bg: 'Верига за доставки в реално време с RFID проследяване на инвентара' },
    impact: { en: 'Design-to-shelf in 2 weeks vs industry average of 6 months', bg: 'От дизайн до рафт за 2 седмици срещу средно 6 месеца в индустрията' },
    lesson: { en: 'Speed and data-driven decisions create unbeatable competitive advantage in traditional industries.', bg: 'Бързината и решенията, базирани на данни, създават непобедимо конкурентно предимство в традиционните индустрии.' },
  },
  {
    company: 'John Deere',
    icon: Tractor,
    color: 'text-green-600',
    bgColor: 'bg-green-600/10',
    innovation: { en: 'IoT sensors and precision agriculture platform', bg: 'IoT сензори и платформа за прецизно земеделие' },
    impact: { en: 'Farmers reduced water usage by 20% and increased crop yields', bg: 'Фермерите намалиха потреблението на вода с 20% и увеличиха добивите' },
    lesson: { en: 'IoT transforms even the oldest industries. Digital innovation is not only for tech companies.', bg: 'IoT трансформира дори най-старите индустрии. Дигиталните иновации не са само за технологични компании.' },
  },
  {
    company: 'Revolut',
    icon: CreditCard,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    innovation: { en: 'Mobile-first neobank with API-driven financial services', bg: 'Необанка с приоритет към мобилни устройства и API-базирани финансови услуги' },
    impact: { en: '40M+ users; challenged traditional banking with zero-fee transfers', bg: '40M+ потребители; предизвика традиционното банкиране с безплатни трансфери' },
    lesson: { en: 'Platform thinking and API ecosystems enable startups to compete with century-old institutions.', bg: 'Платформеното мислене и API екосистемите позволяват на стартъпи да се конкурират със столетни институции.' },
  },
  {
    company: 'Siemens',
    icon: Factory,
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
    innovation: { en: 'Digital twin technology for smart manufacturing', bg: 'Технология за цифров двойник за интелигентно производство' },
    impact: { en: '30% reduction in time-to-market for new products', bg: '30% намаление на времето за пускане на нови продукти' },
    lesson: { en: 'Digital twins allow companies to simulate, test, and optimize before spending real resources.', bg: 'Цифровите двойници позволяват на компаниите да симулират, тестват и оптимизират преди да изразходват реални ресурси.' },
  },
  {
    company: 'Spotify',
    icon: Music,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    innovation: { en: 'ML-powered recommendation engine (Discover Weekly)', bg: 'Препоръчващ механизъм с ML (Discover Weekly)' },
    impact: { en: '600M+ users; transformed how people discover music', bg: '600M+ потребители; промени начина, по който хората откриват музика' },
    lesson: { en: 'AI and machine learning create massive value by personalizing user experiences at scale.', bg: 'AI и машинното обучение създават огромна стойност чрез персонализиране на потребителското изживяване в мащаб.' },
  },
  {
    company: 'Maersk & IBM',
    icon: Ship,
    color: 'text-sky-600',
    bgColor: 'bg-sky-600/10',
    innovation: { en: 'TradeLens blockchain for global shipping logistics', bg: 'TradeLens блокчейн за глобална корабна логистика' },
    impact: { en: 'Digitized 10M+ shipping events, reduced paperwork by 80%', bg: 'Дигитализирани 10M+ транспортни събития, намалена документация с 80%' },
    lesson: { en: 'Blockchain solves real problems in trust and transparency across complex supply chains.', bg: 'Блокчейн решава реални проблеми на доверие и прозрачност в сложни вериги за доставки.' },
  },
];

const pillars = [
  { icon: Cpu, key: 'technology' as const },
  { icon: Target, key: 'testing' as const },
  { icon: Users, key: 'skills' as const },
  { icon: TrendingUp, key: 'funding' as const },
];

export default function AboutDigitalInnovation() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Hero */}
      <section className="py-16 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl sim-gradient shadow-lg">
              <Lightbulb className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            {t.aboutTitle}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.aboutSubtitle}
          </p>
        </div>
      </section>

      {/* What is a DIH */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">{t.whatIsDIH}</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">{t.dihExplanation}</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(p => (
              <Card key={p.key} className="p-5 text-center border-border hover:border-primary/40 transition-colors">
                <div className="flex justify-center mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <p.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{t[`pillar_${p.key}` as keyof typeof t]}</h3>
                <p className="text-xs text-muted-foreground">{t[`pillar_${p.key}_desc` as keyof typeof t]}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why this platform */}
      <section className="py-12 px-4 bg-accent/30 border-y border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0 mt-1">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-2">{t.whyPlatform}</h2>
              <p className="text-muted-foreground leading-relaxed">{t.whyPlatformDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Case Studies */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-display font-bold text-foreground">{t.realCaseStudies}</h2>
          </div>
          <p className="text-muted-foreground mb-8">{t.realCaseStudiesDesc}</p>

          <div className="space-y-4">
            {caseStudies.map(cs => (
              <Card key={cs.company} className="p-5 border-border hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cs.bgColor} shrink-0`}>
                    <cs.icon className={`h-5 w-5 ${cs.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-semibold text-foreground">{cs.company}</h3>
                    </div>
                    <p className="text-sm text-foreground/80 mb-1">
                      <span className="font-medium">{lang === 'bg' ? 'Иновация:' : 'Innovation:'}</span>{' '}
                      {cs.innovation[lang]}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">{lang === 'bg' ? 'Въздействие:' : 'Impact:'}</span>{' '}
                      {cs.impact[lang]}
                    </p>
                    <div className="bg-accent/50 rounded px-3 py-2">
                      <p className="text-xs text-foreground/70">
                        <span className="font-semibold">💡 {lang === 'bg' ? 'Урок:' : 'Lesson:'}</span>{' '}
                        {cs.lesson[lang]}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-border">
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
