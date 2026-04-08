import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { useProgress } from '@/context/ProgressContext';
import AppHeader from '@/components/layout/AppHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  BookOpen, Clock, ArrowRight, Search, ArrowLeft, TrendingUp,
  Brain, Landmark, GraduationCap, Building2, Network, HeartPulse,
  Factory, Sprout, Plane, ShoppingCart, Filter, X, LayoutGrid, List,
  CheckCircle2, Zap,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import PhaseBadge from '@/components/ui/phase-badge';
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

type ViewMode = 'grid' | 'list';
type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';
type TimeFilter = 'all' | 'short' | 'medium' | 'long';
type StatusFilter = 'all' | 'completed' | 'not_started';

const XP_BY_DIFFICULTY: Record<string, number> = {
  beginner: 20,
  intermediate: 35,
  advanced: 50,
};

export default function CaseLibrary() {
  const { t, lang } = useLang();
  const { isAdmin, user } = useAuth();
  const { completedCaseIds } = useProgress();
  const tx = (en: string | null | undefined, bg: string | null | undefined) => lang === 'bg' ? (bg || en || '') : (en || '');
  const tl = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<IndustryDomain | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

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

  const hasActiveFilters = difficultyFilter !== 'all' || timeFilter !== 'all' || statusFilter !== 'all' || industryFilter !== 'all';

  const clearAllFilters = () => {
    setDifficultyFilter('all');
    setTimeFilter('all');
    setStatusFilter('all');
    setIndustryFilter('all');
    setSearch('');
  };

  // Apply filters to cases
  const filterCases = (casesToFilter: CaseStudy[]) => {
    return casesToFilter.filter(c => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          (c.title || '').toLowerCase().includes(q) ||
          (c.title_bg || '').toLowerCase().includes(q) ||
          (c.description || '').toLowerCase().includes(q) ||
          (c.description_bg || '').toLowerCase().includes(q) ||
          (c.topic || '').toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      // Difficulty
      if (difficultyFilter !== 'all' && c.difficulty !== difficultyFilter) return false;
      // Time
      if (timeFilter !== 'all') {
        const mins = c.est_minutes || 60;
        if (timeFilter === 'short' && mins > 30) return false;
        if (timeFilter === 'medium' && (mins <= 30 || mins > 60)) return false;
        if (timeFilter === 'long' && mins <= 60) return false;
      }
      // Completion status
      if (statusFilter !== 'all' && user) {
        const isCompleted = completedCaseIds.has(c.id);
        if (statusFilter === 'completed' && !isCompleted) return false;
        if (statusFilter === 'not_started' && isCompleted) return false;
      }
      // Industry
      if (industryFilter !== 'all') {
        const domainId = matchCaseToIndustry(c.topic);
        if (domainId !== industryFilter) return false;
      }
      return true;
    });
  };

  // All filtered cases for list view
  const allFilteredCases = useMemo(() => filterCases(cases), [cases, search, difficultyFilter, timeFilter, statusFilter, industryFilter, completedCaseIds]);

  // Filter domains for grid view
  const filteredDomains = useMemo(() => {
    if (!search && !hasActiveFilters) return INDUSTRY_DOMAINS;
    return INDUSTRY_DOMAINS.filter(d => {
      const domainCases = filterCases(casesByDomain[d.id] || []);
      if (domainCases.length > 0) return true;
      // Also match domain name in search
      if (search) {
        const q = search.toLowerCase();
        if (d.nameEn.toLowerCase().includes(q) || d.nameBg.toLowerCase().includes(q)) return true;
      }
      return false;
    });
  }, [search, casesByDomain, difficultyFilter, timeFilter, statusFilter, industryFilter]);

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

  // ── Filter Bar Component ──
  const FilterBar = () => (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mr-1">
          <Filter className="h-3.5 w-3.5" />
          {tl('Filters:', 'Филтри:')}
        </div>

        {/* Difficulty */}
        {(['all', 'beginner', 'intermediate', 'advanced'] as DifficultyFilter[]).map(d => (
          <button
            key={d}
            onClick={() => setDifficultyFilter(d)}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
              difficultyFilter === d
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary/40'
            }`}
          >
            {d === 'all' ? tl('Any Difficulty', 'Всяка трудност')
              : d === 'beginner' ? tl('Beginner', 'Начинаещ')
              : d === 'intermediate' ? tl('Intermediate', 'Средно')
              : tl('Advanced', 'Напреднал')}
          </button>
        ))}

        <span className="text-border">|</span>

        {/* Time */}
        {(['all', 'short', 'medium', 'long'] as TimeFilter[]).map(tf => (
          <button
            key={tf}
            onClick={() => setTimeFilter(tf)}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
              timeFilter === tf
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary/40'
            }`}
          >
            <Clock className="h-3 w-3" />
            {tf === 'all' ? tl('Any Time', 'Всяко време')
              : tf === 'short' ? tl('≤30 min', '≤30 мин')
              : tf === 'medium' ? tl('30-60 min', '30-60 мин')
              : tl('60+ min', '60+ мин')}
          </button>
        ))}

        <span className="text-border">|</span>

        {/* Completion Status */}
        {user && (['all', 'completed', 'not_started'] as StatusFilter[]).map(sf => (
          <button
            key={sf}
            onClick={() => setStatusFilter(sf)}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
              statusFilter === sf
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary/40'
            }`}
          >
            {sf === 'all' ? tl('Any Status', 'Всеки статус')
              : sf === 'completed' ? (
                <><CheckCircle2 className="h-3 w-3" />{tl('Completed', 'Завършени')}</>
              ) : tl('Not Started', 'Незапочнати')}
          </button>
        ))}
      </div>

      {/* Industry chips (only in list view) */}
      {viewMode === 'list' && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-1">{tl('Industry:', 'Индустрия:')}</span>
          <button
            onClick={() => setIndustryFilter('all')}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border ${
              industryFilter === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary/40'
            }`}
          >
            {tl('All', 'Всички')}
          </button>
          {INDUSTRY_DOMAINS.filter(d => (casesByDomain[d.id]?.length || 0) > 0).map(d => (
            <button
              key={d.id}
              onClick={() => setIndustryFilter(industryFilter === d.id ? 'all' : d.id)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border ${
                industryFilter === d.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/40'
              }`}
            >
              {lang === 'bg' ? d.nameBg : d.nameEn}
            </button>
          ))}
        </div>
      )}

      {/* Active filter summary + clear */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {allFilteredCases.length} {tl('cases found', 'казуса намерени')}
          </span>
          <button onClick={clearAllFilters} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
            <X className="h-3 w-3" />
            {tl('Clear all', 'Изчисти всички')}
          </button>
        </div>
      )}
    </div>
  );

  // ── Case Card Component ──
  const CaseCard = ({ cs }: { cs: CaseStudy }) => {
    const caseStatus = user ? (completedCaseIds.has(cs.id) ? 'completed' : 'not_started') : undefined;
    const xp = XP_BY_DIFFICULTY[cs.difficulty] || 25;
    const domain = INDUSTRY_DOMAINS.find(d => d.id === matchCaseToIndustry(cs.topic));
    const DomainIcon = domain ? (ICON_MAP[domain.icon] || BookOpen) : BookOpen;

    return (
      <Link
        to={`/case/${cs.id}/preview`}
        className="group block rounded-lg border border-border bg-card p-4 sm:p-5 hover:border-primary/50 hover:shadow-md transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base">
            {tx(cs.title, cs.title_bg)}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            {caseStatus && <StatusBadge status={caseStatus} lang={lang} />}
            <Badge variant="outline" className={`${diffColor(cs.difficulty)}`}>{diffLabel(cs.difficulty)}</Badge>
          </div>
        </div>
        {(cs.description || cs.description_bg) && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{tx(cs.description, cs.description_bg)}</p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {domain && (
              <span className="flex items-center gap-1">
                <DomainIcon className="h-3 w-3" style={{ color: domain.color }} />
                {lang === 'bg' ? domain.nameBg : domain.nameEn}
              </span>
            )}
            {cs.est_minutes && (
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{cs.est_minutes} {t.min}</span>
            )}
            <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-xp-gold" />{xp} XP</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            {tl('Preview', 'Преглед')} <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    );
  };

  // ─── Industry Detail View ───
  if (selectedDomain) {
    const Icon = ICON_MAP[selectedDomain.icon] || BookOpen;
    const domainCases = filterCases(casesByDomain[selectedDomain.id] || []);
    const totalDomainCases = casesByDomain[selectedDomain.id]?.length || 0;
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
                {totalDomainCases} {tl('case studies', 'казуса')}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-lg border border-border bg-card p-5 mb-6">
            <p className="text-sm text-foreground/90 leading-relaxed">{desc}</p>
          </div>

          {/* Trends */}
          <div className="mb-6">
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

          {/* Filters inside domain view */}
          <div className="mb-6">
            <FilterBar />
          </div>

          {/* Cases */}
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">
            {tl('Case Studies', 'Казуси')}
            {domainCases.length !== totalDomainCases && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({domainCases.length}/{totalDomainCases})
              </span>
            )}
          </h2>

          {domainCases.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                {hasActiveFilters
                  ? tl('No cases match the current filters.', 'Няма казуси, отговарящи на текущите филтри.')
                  : tl('No case studies in this industry yet.', 'Все още няма казуси в тази индустрия.')}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" className="mt-3" onClick={clearAllFilters}>
                  {tl('Clear Filters', 'Изчисти филтри')}
                </Button>
              )}
              {!hasActiveFilters && isAdmin && (
                <Button variant="default" size="sm" className="mt-3" asChild>
                  <Link to="/admin">{tl('Create Case Study', 'Създай казус')}</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {domainCases.map(cs => <CaseCard key={cs.id} cs={cs} />)}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Main View (Grid or List) ───
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="typo-h1 mb-2 flex items-center gap-2">{t.caseLibrary} <PhaseBadge phase="apply" lang={lang} /></h1>
            <p className="typo-helper">
              {tl(
                'Explore case studies organized by industry domain. Select an industry to understand its context and analyze related cases.',
                'Разгледай казуси, организирани по индустриални области. Избери индустрия, за да разбереш контекста и да анализираш свързаните казуси.'
              )}
            </p>
          </div>
          {/* View mode toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title={tl('Industry Grid', 'Индустриална мрежа')}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md p-1.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title={tl('All Cases', 'Всички казуси')}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={viewMode === 'grid'
              ? tl('Search industries or cases…', 'Търси индустрии или казуси…')
              : tl('Search cases…', 'Търси казуси…')
            }
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter bar */}
        <div className="mb-6">
          <FilterBar />
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">{t.loadingCases}</div>
        ) : viewMode === 'list' ? (
          /* ── List View: All Cases ── */
          allFilteredCases.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-lg">
              <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {hasActiveFilters || search
                  ? tl('No cases match your filters.', 'Няма казуси, отговарящи на филтрите ви.')
                  : tl('No case studies available.', 'Няма налични казуси.')}
              </p>
              {(hasActiveFilters || search) && (
                <Button variant="outline" size="sm" className="mt-3" onClick={clearAllFilters}>
                  {tl('Clear Filters', 'Изчисти филтри')}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-1 mb-4">
              <p className="text-xs text-muted-foreground mb-3">
                {allFilteredCases.length} {tl('cases', 'казуса')}
                {cases.length !== allFilteredCases.length && ` ${tl('of', 'от')} ${cases.length}`}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {allFilteredCases.map(cs => <CaseCard key={cs.id} cs={cs} />)}
              </div>
            </div>
          )
        ) : (
          /* ── Grid View: By Industry ── */
          filteredDomains.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-lg">
              <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">{tl('No matching industries found.', 'Не са намерени съвпадащи индустрии.')}</p>
              {(hasActiveFilters || search) && (
                <Button variant="outline" size="sm" className="mt-3" onClick={clearAllFilters}>
                  {tl('Clear Filters', 'Изчисти филтри')}
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDomains.map(domain => {
                const DIcon = ICON_MAP[domain.icon] || BookOpen;
                const domainCases = casesByDomain[domain.id] || [];
                const filteredCount = filterCases(domainCases).length;
                const count = domainCases.length;
                return (
                  <button
                    key={domain.id}
                    onClick={() => count > 0 ? setSelectedDomain(domain) : undefined}
                    className={`group text-left rounded-lg border border-border bg-card p-5 transition-all relative ${count > 0 ? 'hover:border-primary/50 hover:shadow-md cursor-pointer' : 'opacity-70 cursor-default'}`}
                  >
                    {count === 0 && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                          {tl('Coming Soon', 'Очаквайте скоро')}
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border" style={{ backgroundColor: `${domain.color}15` }}>
                        <DIcon className="h-5 w-5" style={{ color: domain.color }} />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                          {lang === 'bg' ? domain.nameBg : domain.nameEn}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {count > 0
                            ? hasActiveFilters
                              ? `${filteredCount}/${count} ${tl('cases', 'казуса')}`
                              : `${count} ${tl('cases', 'казуса')}`
                            : ''}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {lang === 'bg' ? domain.descriptionBg.slice(0, 120) + '…' : domain.descriptionEn.slice(0, 120) + '…'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(lang === 'bg' ? domain.trendsBg : domain.trendsEn).slice(0, 2).map(tr => (
                        <Badge key={tr} variant="secondary" className="text-xs px-1.5 py-0">{tr}</Badge>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
