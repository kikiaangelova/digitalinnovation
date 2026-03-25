import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/layout/AppHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, ArrowRight, Search, ArrowLeft, TrendingUp, Brain, Landmark, GraduationCap, Building2, Network, HeartPulse, Factory, Sprout, Plane, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { INDUSTRY_DOMAINS, matchCaseToIndustry, type IndustryDomain } from '@/data/industry-domains';

const ICON_MAP: Record<string, React.ElementType> = {
  Brain, Landmark, GraduationCap, Building2, Network, HeartPulse, Factory, Sprout, Plane, ShoppingCart,
};

interface CaseStudy {
  id: string;
  title: string;
  title_bg: string | null;
  description: string | null;
  description_bg: string | null;
  topic: string | null;
  topic_bg: string | null;
  difficulty: string;
  est_minutes: number | null;
  published: boolean;
}

export default function CaseLibrary() {
  const { t, lang } = useLang();
  const { isAdmin } = useAuth();
  const tx = (en: string | null | undefined, bg: string | null | undefined) => lang === 'bg' ? (bg || en || '') : (en || '');
  const tl = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<IndustryDomain | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      const { data } = await supabase
        .from('case_studies')
        .select('id, title, title_bg, description, description_bg, topic, topic_bg, difficulty, est_minutes, published')
        .eq('published', true)
        .order('created_at', { ascending: false });
      setCases((data as CaseStudy[]) || []);
      setLoading(false);
    };
    fetchCases();
  }, []);

  // Group cases by industry domain
  const casesByDomain = useMemo(() => {
    const map: Record<string, CaseStudy[]> = {};
    INDUSTRY_DOMAINS.forEach(d => { map[d.id] = []; });
    cases.forEach(c => {
      const domainId = matchCaseToIndustry(c.topic);
      if (!map[domainId]) map[domainId] = [];
      map[domainId].push(c);
    });
    return map;
  }, [cases]);

  // Filter domains by search
  const filteredDomains = useMemo(() => {
    if (!search) return INDUSTRY_DOMAINS;
    const q = search.toLowerCase();
    return INDUSTRY_DOMAINS.filter(d =>
      d.nameEn.toLowerCase().includes(q) ||
      d.nameBg.toLowerCase().includes(q) ||
      casesByDomain[d.id]?.some(c =>
        (c.title || '').toLowerCase().includes(q) ||
        (c.title_bg || '').toLowerCase().includes(q)
      )
    );
  }, [search, casesByDomain]);

  const diffColor = (d: string) => {
    if (d === 'beginner') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (d === 'intermediate') return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-red-500/10 text-red-600 border-red-500/20';
  };

  const diffLabel = (d: string) => {
    if (d === 'beginner') return t.beginner;
    if (d === 'intermediate') return t.intermediate;
    return t.advanced;
  };

  // ─── Industry Detail View ───
  if (selectedDomain) {
    const Icon = ICON_MAP[selectedDomain.icon] || BookOpen;
    const domainCases = casesByDomain[selectedDomain.id] || [];
    const desc = lang === 'bg' ? selectedDomain.descriptionBg : selectedDomain.descriptionEn;
    const trends = lang === 'bg' ? selectedDomain.trendsBg : selectedDomain.trendsEn;

    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <Button variant="ghost" size="sm" onClick={() => setSelectedDomain(null)} className="mb-4 gap-1">
            <ArrowLeft className="h-4 w-4" />
            {tl('All Industries', 'Всички индустрии')}
          </Button>

          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border" style={{ backgroundColor: `${selectedDomain.color}15` }}>
              <Icon className="h-7 w-7" style={{ color: selectedDomain.color }} />
            </div>
            <div>
              <h1 className="typo-h1">
                {lang === 'bg' ? selectedDomain.nameBg : selectedDomain.nameEn}
              </h1>
              <p className="typo-helper mt-1">
                {domainCases.length} {tl('case studies', 'казуса')}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-lg border border-border bg-card p-5 mb-6">
            <p className="text-sm text-foreground/90 leading-relaxed">{desc}</p>
          </div>

          {/* Trends */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              {tl('Key Innovation Trends', 'Ключови иновационни тенденции')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {trends.map(tr => (
                <Badge key={tr} variant="secondary" className="text-xs">{tr}</Badge>
              ))}
            </div>
          </div>

          {/* Cases */}
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">
            {tl('Case Studies', 'Казуси')}
          </h2>

          {domainCases.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                {tl('No case studies in this industry yet.', 'Все още няма казуси в тази индустрия.')}
              </p>
              {isAdmin && (
                <Button variant="default" size="sm" className="mt-3" asChild>
                  <Link to="/admin">{tl('Create Case Study', 'Създай казус')}</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {domainCases.map(cs => (
                <Link key={cs.id} to={`/case/${cs.id}/preview`} className="group block rounded-lg border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors pr-2">
                      {tx(cs.title, cs.title_bg)}
                    </h3>
                    <Badge variant="outline" className={`shrink-0 ${diffColor(cs.difficulty)}`}>{diffLabel(cs.difficulty)}</Badge>
                  </div>
                  {(cs.description || cs.description_bg) && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{tx(cs.description, cs.description_bg)}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {cs.est_minutes && (
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{cs.est_minutes} {t.min}</span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      {tl('Preview', 'Преглед')} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Industry Grid View ───
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">{t.caseLibrary}</h1>
          <p className="text-muted-foreground">
            {tl(
              'Explore case studies organized by industry domain. Select an industry to understand its context and analyze related cases.',
              'Разгледайте казуси, организирани по индустриални области. Изберете индустрия, за да разберете контекста и анализирате свързаните казуси.'
            )}
          </p>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tl('Search industries or cases…', 'Търси индустрии или казуси…')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">{t.loadingCases}</div>
        ) : filteredDomains.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">{tl('No matching industries found.', 'Не са намерени съвпадащи индустрии.')}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDomains.map(domain => {
              const Icon = ICON_MAP[domain.icon] || BookOpen;
              const count = casesByDomain[domain.id]?.length || 0;
              return (
                <button
                  key={domain.id}
                  onClick={() => count > 0 ? setSelectedDomain(domain) : undefined}
                  className={`group text-left rounded-lg border border-border bg-card p-5 transition-all relative ${count > 0 ? 'hover:border-primary/50 hover:shadow-md cursor-pointer' : 'opacity-70 cursor-default'}`}
                >
                  {count === 0 && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground">
                        {tl('Coming Soon', 'Очаквайте скоро')}
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border" style={{ backgroundColor: `${domain.color}15` }}>
                      <Icon className="h-5 w-5" style={{ color: domain.color }} />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                        {lang === 'bg' ? domain.nameBg : domain.nameEn}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {count > 0 ? `${count} ${tl('cases', 'казуса')}` : ''}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {lang === 'bg' ? domain.descriptionBg.slice(0, 120) + '…' : domain.descriptionEn.slice(0, 120) + '…'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(lang === 'bg' ? domain.trendsBg : domain.trendsEn).slice(0, 2).map(tr => (
                      <Badge key={tr} variant="secondary" className="text-[10px] px-1.5 py-0">{tr}</Badge>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
