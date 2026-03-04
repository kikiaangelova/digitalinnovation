import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, User, Check, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StartupRow {
  id: string;
  user_id: string;
  problem: string;
  customer: string;
  value_proposition: string;
  digital_product: string;
  business_model: string;
  growth_strategy: string;
  final_pitch: string;
  is_submitted: boolean;
  submitted_at: string | null;
  created_at: string;
}

interface ProfileRow {
  user_id: string;
  full_name: string | null;
}

const SECTION_LABELS = [
  { key: 'problem', en: 'Problem', bg: 'Проблем' },
  { key: 'customer', en: 'Customer Segments', bg: 'Клиентски сегменти' },
  { key: 'value_proposition', en: 'Value Proposition', bg: 'Стойностно предложение' },
  { key: 'digital_product', en: 'Digital Product', bg: 'Дигитален продукт' },
  { key: 'business_model', en: 'Business Model', bg: 'Бизнес модел' },
  { key: 'growth_strategy', en: 'Growth Strategy', bg: 'Стратегия за растеж' },
  { key: 'final_pitch', en: 'Final Pitch', bg: 'Финално представяне' },
  { key: 'bmc_key_partners', en: 'BMC: Key Partners', bg: 'BMC: Ключови партньори' },
  { key: 'bmc_key_activities', en: 'BMC: Key Activities', bg: 'BMC: Ключови дейности' },
  { key: 'bmc_key_resources', en: 'BMC: Key Resources', bg: 'BMC: Ключови ресурси' },
  { key: 'bmc_value_proposition', en: 'BMC: Value Proposition', bg: 'BMC: Стойностно предложение' },
  { key: 'bmc_customer_relationships', en: 'BMC: Customer Relationships', bg: 'BMC: Взаимоотношения с клиентите' },
  { key: 'bmc_channels', en: 'BMC: Channels', bg: 'BMC: Канали' },
  { key: 'bmc_customer_segments', en: 'BMC: Customer Segments', bg: 'BMC: Клиентски сегменти' },
  { key: 'bmc_cost_structure', en: 'BMC: Cost Structure', bg: 'BMC: Структура на разходите' },
  { key: 'bmc_revenue_streams', en: 'BMC: Revenue Streams', bg: 'BMC: Приходни потоци' },
];

export default function StartupProjectsAdmin() {
  const { isAdmin } = useAuth();
  const { lang } = useLang();
  const [projects, setProjects] = useState<StartupRow[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const [{ data: projs }, { data: profs }] = await Promise.all([
        supabase.from('startup_projects').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('user_id, full_name'),
      ]);
      setProjects((projs || []) as StartupRow[]);
      const map: Record<string, string> = {};
      (profs || []).forEach((p: ProfileRow) => { map[p.user_id] = p.full_name || 'Unknown'; });
      setProfiles(map);
      setLoading(false);
    };
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">Access denied</div>
      </div>
    );
  }

  const filtered = projects.filter(p => {
    if (!search) return true;
    const name = (profiles[p.user_id] || '').toLowerCase();
    return name.includes(search.toLowerCase()) || p.final_pitch.toLowerCase().includes(search.toLowerCase());
  });

  const getProgress = (p: StartupRow) => {
    const fields = SECTION_LABELS.map(s => (p as any)[s.key] as string);
    const filled = fields.filter(f => (f || '').trim().length > 20).length;
    return Math.round((filled / SECTION_LABELS.length) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">
            {lang === 'bg' ? 'Стартъп проекти' : 'Startup Projects'}
          </span>
        </nav>

        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          {lang === 'bg' ? 'Стартъп проекти на студентите' : 'Student Startup Projects'}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {lang === 'bg'
            ? `${projects.length} проекта · ${projects.filter(p => p.is_submitted).length} предадени`
            : `${projects.length} projects · ${projects.filter(p => p.is_submitted).length} submitted`}
        </p>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={lang === 'bg' ? 'Търсене по студент...' : 'Search by student...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <p className="text-muted-foreground py-10 text-center">{lang === 'bg' ? 'Зареждане...' : 'Loading...'}</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center">{lang === 'bg' ? 'Няма проекти' : 'No projects found'}</p>
        ) : (
          <div className="space-y-3">
            {filtered.map(p => {
              const progress = getProgress(p);
              const isOpen = expanded === p.id;
              return (
                <div key={p.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => setExpanded(isOpen ? null : p.id)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-accent/30 transition-colors"
                  >
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium text-foreground flex-1">{profiles[p.user_id] || p.user_id}</span>
                    <span className="text-xs font-medium text-primary mr-2">{progress}%</span>
                    {p.is_submitted ? (
                      <Badge className="bg-[hsl(var(--sim-success))]/10 text-[hsl(var(--sim-success))] border-0 text-xs">
                        <Check className="h-3 w-3 mr-1" /> {lang === 'bg' ? 'Предаден' : 'Submitted'}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" /> {lang === 'bg' ? 'В процес' : 'In progress'}
                      </Badge>
                    )}
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="border-t border-border px-5 py-4 space-y-4">
                      {SECTION_LABELS.map(s => {
                        const val = ((p as any)[s.key] as string) || '';
                        return (
                          <div key={s.key}>
                            <h3 className="text-sm font-semibold text-foreground mb-1">
                              {lang === 'bg' ? s.bg : s.en}
                            </h3>
                            {val.trim() ? (
                              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{val}</p>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                {lang === 'bg' ? 'Не е попълнено' : 'Not filled in'}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
