import { useState, useMemo } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Book, Globe, Lightbulb } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { TERMS, type DictionaryTerm } from '@/data/dictionary-terms';

const CATEGORY_COLORS: Record<string, string> = {
  'Digital Innovation': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'Startups': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  'Product Development': 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  'Data Analytics': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  'AI & Technology': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'Business Strategy': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'Platform Economy': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'Experimentation': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
};

export default function Dictionary() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const categories = useMemo(() => [...new Set(TERMS.map(t => t.category))].sort(), []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return TERMS.filter(t => {
      if (catFilter !== 'all' && t.category !== catFilter) return false;
      if (q && !t.term.toLowerCase().includes(q) && !t.termBg.toLowerCase().includes(q) && !t.definition.toLowerCase().includes(q) && !t.definitionBg.toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [search, catFilter]);

  const catColor = (c: string) => CATEGORY_COLORS[c] || 'bg-muted text-muted-foreground';

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <Book className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {lang === 'bg' ? 'Речник на дигиталните иновации' : 'Digital Innovation Dictionary'}
          </h1>
        </div>
        <p className="text-muted-foreground mb-6 ml-[52px]">
          {lang === 'bg'
            ? 'Ключови термини и концепции, които всеки дигитален иноватор трябва да знае.'
            : 'Key terms and concepts every digital innovator should know.'}
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={lang === 'bg' ? 'Търсете термини...' : 'Search terms...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCatFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${catFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              {lang === 'bg' ? 'Всички' : 'All'}
            </button>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCatFilter(c === catFilter ? 'all' : c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${catFilter === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} {lang === 'bg' ? (filtered.length !== 1 ? 'термина' : 'термин') : (filtered.length !== 1 ? 'terms' : 'term')}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <Book className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {lang === 'bg' ? 'Няма съвпадащи термини' : 'No matching terms'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {lang === 'bg' ? 'Опитайте друго търсене или категория.' : 'Try a different search query or category filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(t => (
              <TermCard key={t.term} term={t} catColor={catColor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TermCard({ term: t, catColor }: { term: DictionaryTerm; catColor: (c: string) => string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-colors space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display font-bold text-foreground text-lg leading-tight">{t.term}</h3>
          <p className="text-sm text-primary/80 font-medium mt-0.5">{t.termBg}</p>
        </div>
        <Badge variant="outline" className={`shrink-0 text-xs ${catColor(t.category)}`}>{t.category}</Badge>
      </div>

      {/* English explanation */}
      <div className="flex items-start gap-2">
        <Globe className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/85 leading-relaxed">{t.definition}</p>
      </div>

      {/* Bulgarian explanation */}
      <div className="flex items-start gap-2">
        <Globe className="h-4 w-4 text-primary/60 shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">{t.definitionBg}</p>
      </div>

      {/* Example */}
      {t.example && (
        <div className="flex items-start gap-2 rounded-md bg-accent/50 p-3">
          <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/75 leading-relaxed">{t.example}</p>
        </div>
      )}
    </div>
  );
}
