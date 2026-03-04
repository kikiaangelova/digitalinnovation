import { useState } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Book } from 'lucide-react';

interface Term {
  term: string;
  definition: string;
  category: string;
}

const TERMS: Term[] = [
  { term: 'Business Model Canvas', definition: 'A strategic management template for developing new or documenting existing business models. It describes a firm\'s value proposition, infrastructure, customers, and finances across 9 building blocks.', category: 'Strategy' },
  { term: 'Value Proposition', definition: 'The promise of value to be delivered to a customer. It explains why a consumer should buy a product or use a service — the unique benefit that distinguishes an offering from competitors.', category: 'Strategy' },
  { term: 'Platform Business Model', definition: 'A business model that creates value by facilitating exchanges between two or more interdependent groups, usually consumers and producers, through a digital platform that enables network effects.', category: 'Platform' },
  { term: 'Network Effects', definition: 'The phenomenon where a product or service gains additional value as more people use it. Direct network effects occur when value increases for the same user group; indirect effects occur across different user groups.', category: 'Platform' },
  { term: 'Two-Sided Market', definition: 'A market where two distinct user groups (e.g., buyers and sellers) provide each other with network benefits through an intermediary platform. Success depends on solving the "chicken-and-egg" problem.', category: 'Platform' },
  { term: 'Digital Transformation', definition: 'The process of using digital technologies to create new — or modify existing — business processes, culture, and customer experiences to meet changing business and market requirements.', category: 'Innovation' },
  { term: 'Disruptive Innovation', definition: 'An innovation that creates a new market and value network, eventually disrupting existing markets and displacing established market-leading firms, products, and alliances. Coined by Clayton Christensen.', category: 'Innovation' },
  { term: 'Lean Startup', definition: 'A methodology for developing businesses and products by shortening product development cycles through a combination of business-hypothesis-driven experimentation, iterative product releases, and validated learning.', category: 'Innovation' },
  { term: 'Minimum Viable Product (MVP)', definition: 'The simplest version of a product that can be released to test a business hypothesis. It has just enough features to attract early adopters and validate a product idea early in the development cycle.', category: 'Innovation' },
  { term: 'Product-Market Fit', definition: 'The degree to which a product satisfies a strong market demand. Achieved when the product meets real customer needs and does so in a way that is better than alternatives available.', category: 'Strategy' },
  { term: 'Customer Acquisition Cost (CAC)', definition: 'The total cost of sales and marketing efforts needed to acquire a new customer. Calculated by dividing total acquisition spend by the number of new customers gained.', category: 'Metrics' },
  { term: 'Customer Lifetime Value (CLV/LTV)', definition: 'The predicted net profit attributed to the entire future relationship with a customer. A high LTV-to-CAC ratio (3:1 or higher) typically indicates a sustainable business model.', category: 'Metrics' },
  { term: 'Unit Economics', definition: 'The direct revenues and costs associated with a single unit of a business — a customer, a transaction, or a product. Understanding unit economics is critical for assessing scalability.', category: 'Metrics' },
  { term: 'North Star Metric', definition: 'The single metric that best captures the core value your product delivers to customers. It guides long-term growth strategy and aligns teams around what matters most.', category: 'Metrics' },
  { term: 'A/B Testing', definition: 'A controlled experiment comparing two versions of a product, webpage, or feature to determine which performs better against a specific metric. Essential for data-driven decision making.', category: 'Experimentation' },
  { term: 'Pivot', definition: 'A structured course correction designed to test a new fundamental hypothesis about the product, strategy, or engine of growth. Common types include zoom-in, zoom-out, customer segment, and platform pivots.', category: 'Innovation' },
  { term: 'Freemium Model', definition: 'A pricing strategy where a basic product is provided free of charge while premium features are offered at a cost. Success depends on conversion rates and the perceived value gap between tiers.', category: 'Strategy' },
  { term: 'API Economy', definition: 'The set of business models and channels built around the exchange of data and functionality through Application Programming Interfaces (APIs), enabling modular, composable business architectures.', category: 'Platform' },
  { term: 'Data-Driven Decision Making', definition: 'The practice of basing decisions on the analysis of data rather than purely on intuition. Involves collecting, analyzing, and acting on relevant data to guide business strategy.', category: 'Data' },
  { term: 'Data Ethics', definition: 'The branch of ethics that studies and evaluates moral problems related to data (including generation, recording, curation, processing, dissemination, sharing, and use), algorithms, and corresponding practices.', category: 'Data' },
  { term: 'Privacy by Design', definition: 'An approach to systems engineering that takes privacy into account throughout the whole engineering process. The 7 foundational principles include being proactive, having privacy as the default, and full lifecycle protection.', category: 'Data' },
  { term: 'Digital Ecosystem', definition: 'A distributed, adaptive, open socio-technical system with properties of self-organization, scalability and sustainability. It includes digital platforms, partners, developers, and users creating mutual value.', category: 'Platform' },
  { term: 'Growth Hacking', definition: 'A process of rapid experimentation across marketing channels and product development to identify the most efficient ways to grow a business. Combines creativity, analytical thinking, and social metrics.', category: 'Experimentation' },
  { term: 'OKRs (Objectives & Key Results)', definition: 'A goal-setting framework used by teams and individuals to set challenging, ambitious goals with measurable results. Objectives are qualitative; Key Results are quantitative and time-bound.', category: 'Strategy' },
  { term: 'Agile Methodology', definition: 'An iterative approach to project management and software development that delivers work in small increments called sprints. Emphasizes flexibility, collaboration, customer feedback, and rapid adaptation.', category: 'Innovation' },
  { term: 'Design Thinking', definition: 'A human-centered approach to innovation that draws from the designer\'s toolkit to integrate the needs of people, the possibilities of technology, and the requirements for business success. Five stages: Empathize, Define, Ideate, Prototype, Test.', category: 'Innovation' },
  { term: 'Blue Ocean Strategy', definition: 'A business theory that suggests companies compete better by creating uncontested market space ("blue oceans") rather than competing in existing industries with established rivals ("red oceans").', category: 'Strategy' },
  { term: 'Marketplace Model', definition: 'A platform business model that connects buyers and sellers, facilitating transactions between them. Revenue is typically generated through commissions, listing fees, or subscription tiers.', category: 'Platform' },
  { term: 'Churn Rate', definition: 'The percentage of customers who stop using a product or service during a given time period. A critical metric for subscription and SaaS businesses — reducing churn often yields higher returns than acquiring new customers.', category: 'Metrics' },
  { term: 'Cohort Analysis', definition: 'A subset of behavioral analytics that groups users by shared characteristics over time. Helps understand whether product improvements actually change user behavior over their lifecycle.', category: 'Metrics' },
];

export default function Dictionary() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const categories = [...new Set(TERMS.map(t => t.category))].sort();

  const filtered = TERMS.filter(t => {
    if (catFilter !== 'all' && t.category !== catFilter) return false;
    if (search && !t.term.toLowerCase().includes(search.toLowerCase()) && !t.definition.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => a.term.localeCompare(b.term));

  const catColor = (c: string) => {
    const map: Record<string, string> = {
      Strategy: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      Platform: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      Innovation: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      Metrics: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      Experimentation: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      Data: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    };
    return map[c] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <Book className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Digital Innovation Dictionary</h1>
        </div>
        <p className="text-muted-foreground mb-6 ml-[52px]">Key terms and concepts every digital innovator should know.</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search terms..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCatFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${catFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >All</button>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCatFilter(c === catFilter ? 'all' : c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${catFilter === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
              >{c}</button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} term{filtered.length !== 1 ? 's' : ''}</p>

        {filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <Book className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No matching terms</h3>
            <p className="text-muted-foreground text-sm">Try a different search query or category filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(t => (
              <div key={t.term} className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className="font-display font-semibold text-foreground">{t.term}</h3>
                  <Badge variant="outline" className={`shrink-0 ${catColor(t.category)}`}>{t.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.definition}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
