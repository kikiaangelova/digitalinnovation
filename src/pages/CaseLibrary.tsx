import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLang } from '@/context/LangContext';
import AppHeader from '@/components/layout/AppHeader';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, ArrowRight, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CaseStudy {
  id: string;
  title: string;
  description: string | null;
  topic: string | null;
  difficulty: string;
  est_minutes: number | null;
  published: boolean;
}

export default function CaseLibrary() {
  const { t } = useLang();
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');

  useEffect(() => {
    const fetchCases = async () => {
      const { data } = await supabase
        .from('case_studies')
        .select('id, title, description, topic, difficulty, est_minutes, published')
        .eq('published', true)
        .order('created_at', { ascending: false });
      setCases(data || []);
      setLoading(false);
    };
    fetchCases();
  }, []);

  const topics = [...new Set(cases.map(c => c.topic).filter(Boolean))];

  const filtered = cases.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.description?.toLowerCase().includes(search.toLowerCase())) return false;
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
                {topics.map(tp => <SelectItem key={tp} value={tp!}>{tp}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">{t.loadingCases}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{t.noCasesFound}</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {search || diffFilter !== 'all' || topicFilter !== 'all' ? t.noCasesFilterHint : t.noCasesEmpty}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map(cs => (
              <Link key={cs.id} to={`/case/${cs.id}/preview`} className="group block rounded-lg border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{cs.title}</h3>
                  <Badge variant="outline" className={diffColor(cs.difficulty)}>{diffLabel(cs.difficulty)}</Badge>
                </div>
                {cs.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{cs.description}</p>}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {cs.topic && <span className="bg-accent px-2 py-0.5 rounded">{cs.topic}</span>}
                    {cs.est_minutes && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{cs.est_minutes} {t.min}</span>}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
