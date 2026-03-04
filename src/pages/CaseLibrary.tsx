import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/layout/AppHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, ArrowRight, Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const TOPIC_LABELS: Record<string, { en: string; bg: string }> = {
  'Retail': { en: 'Retail', bg: 'Ритейл' },
  'Digital Health': { en: 'Digital Health', bg: 'Дигитално здраве' },
  'FinTech': { en: 'FinTech', bg: 'Финтех' },
  'Education': { en: 'Education', bg: 'Образование' },
  'Agriculture': { en: 'Agriculture', bg: 'Земеделие' },
  'Tourism': { en: 'Tourism', bg: 'Туризъм' },
};

export default function CaseLibrary() {
  const { t, lang } = useLang();
  const { isAdmin } = useAuth();
  const tx = (en: string | null | undefined, bg: string | null | undefined) => lang === 'bg' ? (bg || en || '') : (en || '');
  const tl = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

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

  // Get unique topics from internal (EN) values
  const topics = useMemo(() => {
    return [...new Set(cases.map(c => c.topic).filter(Boolean))] as string[];
  }, [cases]);

  const topicLabel = (topic: string) => {
    const labels = TOPIC_LABELS[topic];
    if (labels) return lang === 'bg' ? labels.bg : labels.en;
    return topic;
  };

  const hasFilters = debouncedSearch || diffFilter !== 'all' || topicFilter !== 'all';

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setDiffFilter('all');
    setTopicFilter('all');
  };

  const filtered = cases.filter(c => {
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      const titleMatch = (c.title || '').toLowerCase().includes(q) || (c.title_bg || '').toLowerCase().includes(q);
      const descMatch = (c.description || '').toLowerCase().includes(q) || (c.description_bg || '').toLowerCase().includes(q);
      if (!titleMatch && !descMatch) return false;
    }
    if (diffFilter !== 'all' && c.difficulty !== diffFilter) return false;
    if (topicFilter !== 'all' && c.topic !== topicFilter) return false;
    return true;
  });

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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">{t.caseLibrary}</h1>
          <p className="text-muted-foreground">{t.caseLibraryDesc}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t.searchCases} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={diffFilter} onValueChange={setDiffFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-1" />
              <SelectValue placeholder={t.allLevels} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allLevels}</SelectItem>
              <SelectItem value="beginner">{t.beginner}</SelectItem>
              <SelectItem value="intermediate">{t.intermediate}</SelectItem>
              <SelectItem value="advanced">{t.advanced}</SelectItem>
            </SelectContent>
          </Select>
          {topics.length > 0 && (
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t.allTopics} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allTopics}</SelectItem>
                {topics.map(tp => (
                  <SelectItem key={tp} value={tp}>{topicLabel(tp)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 shrink-0">
              <X className="h-4 w-4" />
              {tl('Clear filters', 'Изчисти филтрите')}
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">{t.loadingCases}</div>
        ) : cases.length === 0 ? (
          /* No published cases at all */
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {tl('No published case studies yet.', 'Няма публикувани казуси още.')}
            </h3>
            <div className="flex flex-col items-center gap-2 mt-4">
              <Button variant="outline" asChild>
                <Link to="/dashboard">{tl('Back to Dashboard', 'Обратно към таблото')}</Link>
              </Button>
              {isAdmin && (
                <Button variant="default" asChild>
                  <Link to="/admin">{tl('Create Case Study', 'Създай казус')}</Link>
                </Button>
              )}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          /* Filters hiding everything */
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {tl('No case studies found for these filters.', 'Няма намерени казуси за тези филтри.')}
            </h3>
            <Button variant="outline" onClick={clearFilters} className="mt-3 gap-1">
              <X className="h-4 w-4" />
              {tl('Clear filters', 'Изчисти филтрите')}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map(cs => (
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
                    {cs.topic && (
                      <span className="bg-accent px-2 py-0.5 rounded">{topicLabel(cs.topic)}</span>
                    )}
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
