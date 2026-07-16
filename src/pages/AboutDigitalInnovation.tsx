import { useLang } from '@/context/LangContext';
import AppHeader from '@/components/layout/AppHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import creatorPortrait from '@/assets/avatars/female-founder-1.png';

export default function AboutDigitalInnovation() {
  const { lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const tx = (en: string, bg: string) => (lang === 'bg' ? bg : en);

  const badges = lang === 'bg'
    ? ['Преподавател', 'Ментор', 'Дигитални иновации', 'Предприемачество']
    : ['Educator', 'Mentor', 'Digital Innovation', 'Entrepreneurship'];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>
        {/* Hero */}
        <section className="py-16 px-4 border-b border-border">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1 mb-5">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {tx('About', 'За нас')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-foreground mb-4">
              {tx('About DigiInnov', 'За DigiInnov')}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {tx(
                'A learning environment for digital innovation, entrepreneurship, marketing, management and responsible use of AI.',
                'Учебна среда за дигитални иновации, предприемачество, маркетинг, мениджмънт и отговорно използване на AI.'
              )}
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-14 px-4 border-b border-border">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4">
              {tx('Our mission', 'Нашата мисия')}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {tx(
                'DigiInnov helps students and young learners study through theory, practical tasks, cases, decisions, reflection and improvement. The goal is not just to memorize concepts, but to understand how value is created, how ideas are tested and how better decisions are made.',
                'DigiInnov помага на ученици и млади хора да учат чрез теория, практически задачи, казуси, решения, рефлексия и подобрение. Целта не е просто да запомнят понятия, а да разберат как се създава стойност, как се проверяват идеи и как се вземат по-добри решения.'
              )}
            </p>
          </div>
        </section>

        {/* Creator */}
        <section className="py-16 px-4 border-b border-border">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                {tx('About the creator', 'За създателя на платформата')}
              </h2>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="shrink-0">
                  <img
                    src={creatorPortrait}
                    alt={tx('Portrait of Kirilka Angelova', 'Портрет на Кирилка Ангелова')}
                    width={176}
                    height={176}
                    loading="lazy"
                    className="h-40 w-40 md:h-44 md:w-44 rounded-2xl object-cover border-2 border-foreground quest-shadow"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-display font-bold text-foreground mb-1">
                    {tx('Kirilka Angelova', 'Кирилка Ангелова')}
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    {badges.map(b => (
                      <Badge key={b} variant="outline" className="text-xs">{b}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tx(
                      'The platform was created by Kirilka Angelova — an educator and mentor working in digital innovation, entrepreneurship, marketing and digital business. Her goal is to help learners think more clearly, understand real business situations and turn ideas into reasoned decisions.',
                      'Платформата е създадена от Кирилка Ангелова — преподавател и ментор, който работи в областта на дигиталните иновации, предприемачеството, маркетинга и дигиталния бизнес. Нейната цел е да помага на учениците да мислят по-ясно, да разбират реални бизнес ситуации и да превръщат идеите си в аргументирани решения.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="sim-gradient border-0"
                onClick={() => navigate(user ? '/dashboard' : '/auth')}
              >
                {tx('Enter the platform', 'Влез в платформата')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(user ? '/cases' : '/auth?redirect=/cases')}
              >
                {tx('Explore cases', 'Разгледай казусите')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Legacy academic reference content removed from public About page.
// Curriculum content lives in the Learn modules and Dictionary.
const _removedAcademicTopics = [
  // 'What is Digital Innovation?', 'AI and the Data Economy',
  // 'Platform Economy & Network Effects', 'Startup Ecosystems'
] as const;

