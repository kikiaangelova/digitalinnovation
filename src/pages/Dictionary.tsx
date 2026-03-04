import { useState, useMemo, useCallback } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Book, Lightbulb, ChevronDown, ChevronUp, Star, HelpCircle, CheckCircle2, XCircle, Shuffle } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { TERMS, type DictionaryTerm } from '@/data/dictionary-terms';

const CATEGORY_COLORS: Record<string, string> = {
  Innovation: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Startup: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  Product: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  Data: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  Technology: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Strategy: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  Platform: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  Metrics: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  Experimentation: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  AI: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
  'Business Model': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  Growth: 'bg-lime-500/10 text-lime-600 border-lime-500/20',
};

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  Innovation: 'Иновации',
  Startup: 'Стартъп',
  Product: 'Продукт',
  Data: 'Данни',
  Technology: 'Технологии',
  Strategy: 'Стратегия',
  Platform: 'Платформа',
  Metrics: 'Метрики',
  Experimentation: 'Експериментиране',
  AI: 'AI',
  'Business Model': 'Бизнес модел',
  Growth: 'Растеж',
};

// Deterministic "Term of the Week" based on week number
function getTermOfTheWeek(): DictionaryTerm {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.floor(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  return TERMS[weekNum % TERMS.length];
}

// Generate a quiz question from a random term
function generateQuiz(exclude?: string): { term: DictionaryTerm; options: string[]; correctIndex: number } {
  const pool = TERMS.filter(t => t.term !== exclude);
  const term = pool[Math.floor(Math.random() * pool.length)];
  const wrongPool = TERMS.filter(t => t.term !== term.term);
  const wrongs: string[] = [];
  while (wrongs.length < 3 && wrongPool.length > 0) {
    const idx = Math.floor(Math.random() * wrongPool.length);
    wrongs.push(wrongPool[idx].definition);
    wrongPool.splice(idx, 1);
  }
  const correctIndex = Math.floor(Math.random() * 4);
  const options = [...wrongs];
  options.splice(correctIndex, 0, term.definition);
  return { term, options, correctIndex };
}

export default function Dictionary() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [letterFilter, setLetterFilter] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quiz, setQuiz] = useState(() => generateQuiz());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const termOfTheWeek = useMemo(() => getTermOfTheWeek(), []);
  const categories = useMemo(() => [...new Set(TERMS.map(t => t.category))].sort(), []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return TERMS.filter(t => {
      if (catFilter !== 'all' && t.category !== catFilter) return false;
      if (letterFilter && !t.term.toUpperCase().startsWith(letterFilter)) return false;
      if (q && !t.term.toLowerCase().includes(q) && !t.termBg.toLowerCase().includes(q) && !t.definition.toLowerCase().includes(q) && !t.definitionBg.toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [search, catFilter, letterFilter]);

  const availableLetters = useMemo(() => {
    const letters = new Set(TERMS.map(t => t.term[0].toUpperCase()));
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => letters.has(l));
  }, []);

  const catColor = (c: string) => CATEGORY_COLORS[c] || 'bg-muted text-muted-foreground';

  const nextQuiz = useCallback(() => {
    setQuiz(generateQuiz(quiz.term.term));
    setSelectedAnswer(null);
  }, [quiz.term.term]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
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
            ? `${TERMS.length} ключови термина за дигитални иновации, стартъпи и бизнес стратегия.`
            : `${TERMS.length} key terms for digital innovation, startups, and business strategy.`}
        </p>

        {/* Term of the Week + Quick Quiz cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Term of the Week */}
          <div className="rounded-lg border-2 border-primary/20 bg-accent/30 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {lang === 'bg' ? 'Термин на седмицата' : 'Term of the Week'}
              </span>
            </div>
            <h3 className="font-display font-bold text-foreground text-lg">{termOfTheWeek.term}</h3>
            <p className="text-sm text-primary/70 font-medium">{termOfTheWeek.termBg}</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {lang === 'bg' ? termOfTheWeek.definitionBg : termOfTheWeek.definition}
            </p>
            {termOfTheWeek.example && (
              <div className="flex items-start gap-2 rounded-md bg-accent/50 p-2 mt-3">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/70">{termOfTheWeek.example}</p>
              </div>
            )}
          </div>

          {/* Quick Quiz */}
          <div className="rounded-lg border-2 border-primary/20 bg-accent/30 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  {lang === 'bg' ? 'Бърз тест' : 'Quick Quiz'}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={nextQuiz} className="h-7 px-2">
                <Shuffle className="h-3.5 w-3.5" />
              </Button>
            </div>
            {!showQuiz ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  {lang === 'bg' ? 'Тествайте знанията си за дигитални иновации!' : 'Test your digital innovation knowledge!'}
                </p>
                <Button size="sm" onClick={() => setShowQuiz(true)}>
                  {lang === 'bg' ? 'Започнете' : 'Start Quiz'}
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  {lang === 'bg' ? 'Какво е' : 'What is'} <span className="text-primary">{quiz.term.term}</span>?
                </p>
                <p className="text-xs text-muted-foreground mb-3">{quiz.term.termBg}</p>
                <div className="space-y-2">
                  {quiz.options.map((opt, i) => {
                    const isCorrect = i === quiz.correctIndex;
                    const isSelected = selectedAnswer === i;
                    const showResult = selectedAnswer !== null;
                    let borderClass = 'border-border';
                    if (showResult && isCorrect) borderClass = 'border-emerald-500 bg-emerald-500/5';
                    else if (showResult && isSelected && !isCorrect) borderClass = 'border-destructive bg-destructive/5';

                    return (
                      <button
                        key={i}
                        onClick={() => selectedAnswer === null && setSelectedAnswer(i)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left rounded-md border p-2.5 text-xs leading-relaxed transition-all ${borderClass} ${
                          selectedAnswer === null ? 'hover:border-primary/40 cursor-pointer' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">
                            {showResult && isCorrect && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                            {showResult && isSelected && !isCorrect && <XCircle className="h-3.5 w-3.5 text-destructive" />}
                            {!showResult && <span className="inline-block w-3.5 h-3.5 rounded-full border border-border" />}
                          </span>
                          <span className="text-foreground/80 line-clamp-2">{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedAnswer !== null && (
                  <Button size="sm" variant="outline" onClick={nextQuiz} className="mt-3 w-full">
                    {lang === 'bg' ? 'Следващ въпрос' : 'Next Question'} →
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={lang === 'bg' ? 'Търсете термини на английски или български...' : 'Search terms in English or Bulgarian...'}
            value={search}
            onChange={e => { setSearch(e.target.value); setLetterFilter(''); }}
            className="pl-9"
          />
        </div>

        {/* Alphabetical index */}
        <div className="flex flex-wrap gap-1 mb-4">
          <button
            onClick={() => setLetterFilter('')}
            className={`w-7 h-7 rounded text-xs font-bold transition-colors ${!letterFilter ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            {lang === 'bg' ? 'Вс' : 'All'}
          </button>
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => {
            const available = availableLetters.includes(l);
            return (
              <button
                key={l}
                onClick={() => available && setLetterFilter(l === letterFilter ? '' : l)}
                disabled={!available}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                  letterFilter === l
                    ? 'bg-primary text-primary-foreground'
                    : available
                    ? 'bg-muted text-muted-foreground hover:text-foreground hover:bg-accent'
                    : 'bg-muted/50 text-muted-foreground/30 cursor-not-allowed'
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
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
              {lang === 'bg' ? (CATEGORY_TRANSLATIONS[c] || c) : c}
            </button>
          ))}
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
          <div className="space-y-3">
            {filtered.map(t => (
              <TermCard key={t.term} term={t} catColor={catColor} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TermCard({ term: t, catColor, lang }: { term: DictionaryTerm; catColor: (c: string) => string; lang: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-lg border border-border bg-card hover:border-primary/30 transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3 p-4 pb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-foreground text-base leading-tight">{t.term}</h3>
          <p className="text-sm text-primary/70 font-medium mt-0.5">{t.termBg}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className={`text-xs ${catColor(t.category)}`}>{lang === 'bg' ? (CATEGORY_TRANSLATIONS[t.category] || t.category) : t.category}</Badge>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
          <div className="flex items-start gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0 mt-0.5 w-6">EN</span>
            <p className="text-sm text-foreground/85 leading-relaxed">{t.definition}</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-bold text-primary/60 uppercase tracking-wider shrink-0 mt-0.5 w-6">BG</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.definitionBg}</p>
          </div>
          {t.example && (
            <div className="flex items-start gap-2 rounded-md bg-accent/50 p-3">
              <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/75 leading-relaxed">{t.example}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
