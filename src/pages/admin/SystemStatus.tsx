import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import {
  ShieldCheck, Database, BookOpen, Rocket, Gamepad2, Brain,
  Trophy, BarChart3, RefreshCw, CheckCircle2, AlertTriangle, XCircle, ArrowLeft
} from 'lucide-react';

type Status = 'idle' | 'running' | 'ok' | 'warn' | 'error';

interface ModuleResult {
  status: Status;
  message?: string;
  cause?: string;
  fix?: string;
  ms?: number;
}

const MODULES = [
  'auth', 'database', 'cases', 'startup', 'simulator', 'ai_mentor', 'leaderboard', 'analytics'
] as const;
type ModuleKey = typeof MODULES[number];

const MODULE_META: Record<ModuleKey, { icon: any; en: string; bg: string }> = {
  auth:        { icon: ShieldCheck, en: 'Authentication', bg: 'Автентикация' },
  database:    { icon: Database,    en: 'Database Connection', bg: 'Връзка с базата данни' },
  cases:       { icon: BookOpen,    en: 'Case Studies', bg: 'Казуси' },
  startup:     { icon: Rocket,      en: 'Startup Builder', bg: 'Стартъп конструктор' },
  simulator:   { icon: Gamepad2,    en: 'Simulator', bg: 'Симулатор' },
  ai_mentor:   { icon: Brain,       en: 'AI Mentor', bg: 'AI Ментор' },
  leaderboard: { icon: Trophy,      en: 'Leaderboard', bg: 'Класация' },
  analytics:   { icon: BarChart3,   en: 'Learning Analytics', bg: 'Аналитика' },
};

async function timed(fn: () => Promise<Omit<ModuleResult, 'ms'>>): Promise<ModuleResult> {
  const t0 = performance.now();
  try {
    const r = await fn();
    return { ...r, ms: Math.round(performance.now() - t0) };
  } catch (e: any) {
    return { status: 'error', message: e?.message || 'Unknown error', ms: Math.round(performance.now() - t0) };
  }
}

const checks: Record<ModuleKey, () => Promise<Omit<ModuleResult, 'ms'>>> = {
  auth: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return { status: 'warn', message: 'No active session', cause: 'Admin not logged in', fix: 'Log in as admin to run full checks' };
    return { status: 'ok', message: 'Session active' };
  },
  database: async () => {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) return { status: 'error', message: error.message, cause: 'Database connection issue', fix: 'Check backend status in Lovable Cloud' };
    return { status: 'ok', message: 'Connected' };
  },
  cases: async () => {
    const { data, error } = await supabase.from('case_studies').select('id').eq('published', true);
    if (error) return { status: 'error', message: error.message, cause: 'Cannot query case_studies', fix: 'Check RLS policies on case_studies table' };
    if (!data || data.length === 0) return { status: 'warn', message: 'No published cases found', cause: 'Cases may not be seeded', fix: 'Seed case studies via admin panel' };
    return { status: 'ok', message: `${data.length} published case(s)` };
  },
  startup: async () => {
    const { error } = await supabase.from('startup_projects').select('id').limit(1);
    if (error) return { status: 'error', message: error.message, cause: 'Cannot query startup_projects', fix: 'Check RLS policies' };
    return { status: 'ok', message: 'Table accessible' };
  },
  simulator: async () => {
    const { error } = await supabase.from('simulator_progress').select('id').limit(1);
    if (error) return { status: 'error', message: error.message, cause: 'Cannot query simulator_progress', fix: 'Check RLS policies' };
    return { status: 'ok', message: 'Table accessible' };
  },
  ai_mentor: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return { status: 'warn', message: 'Cannot test without auth session', cause: 'Not logged in', fix: 'Log in first' };
      const res = await supabase.functions.invoke('ai-feedback', {
        body: { sections: { problem: 'test' }, lang: 'en' },
      });
      if (res.error) return { status: 'error', message: res.error.message, cause: 'Edge function error', fix: 'Check edge function logs and API key' };
      return { status: 'ok', message: 'Edge function responding' };
    } catch (e: any) {
      return { status: 'error', message: e.message, cause: 'Network or CORS issue', fix: 'Check edge function deployment' };
    }
  },
  leaderboard: async () => {
    const { error } = await supabase.from('user_badges').select('id').limit(1);
    if (error) return { status: 'error', message: error.message, cause: 'Cannot query user_badges', fix: 'Check RLS policies' };
    return { status: 'ok', message: 'Table accessible' };
  },
  analytics: async () => {
    const { error } = await supabase.from('course_progress').select('id').limit(1);
    if (error) return { status: 'error', message: error.message, cause: 'Cannot query course_progress', fix: 'Check RLS policies' };
    return { status: 'ok', message: 'Table accessible' };
  },
};

const statusIcon = (s: Status) => {
  if (s === 'ok') return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (s === 'warn') return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  if (s === 'error') return <XCircle className="h-5 w-5 text-red-500" />;
  return <div className="h-5 w-5 rounded-full bg-muted" />;
};

const statusBadge = (s: Status, lang: 'en' | 'bg') => {
  const labels: Record<Status, [string, string]> = {
    idle: ['Pending', 'Изчакване'],
    running: ['Running…', 'Проверка…'],
    ok: ['Working', 'Работи'],
    warn: ['Warning', 'Предупреждение'],
    error: ['Error', 'Грешка'],
  };
  const variant = s === 'ok' ? 'default' : s === 'warn' ? 'secondary' : s === 'error' ? 'destructive' : 'outline';
  return <Badge variant={variant}>{labels[s][lang === 'bg' ? 1 : 0]}</Badge>;
};

export default function SystemStatus() {
  const { lang } = useLang();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [results, setResults] = useState<Record<ModuleKey, ModuleResult>>(
    () => Object.fromEntries(MODULES.map(k => [k, { status: 'idle' as Status }])) as any
  );
  const [running, setRunning] = useState(false);

  const runAll = useCallback(async () => {
    setRunning(true);
    const fresh: any = {};
    MODULES.forEach(k => fresh[k] = { status: 'running' });
    setResults(fresh);

    for (const key of MODULES) {
      const result = await timed(checks[key]);
      setResults(prev => ({ ...prev, [key]: result }));
    }
    setRunning(false);
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          {t('Admin access required', 'Необходим е администраторски достъп')}
        </div>
      </div>
    );
  }

  const allOk = MODULES.every(k => results[k].status === 'ok');
  const hasErrors = MODULES.some(k => results[k].status === 'error');
  const hasRun = MODULES.some(k => results[k].status !== 'idle');

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="mb-4 gap-1">
          <ArrowLeft className="h-4 w-4" /> {t('Back to Admin', 'Обратно към Админ')}
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t('System Status', 'Системен статус')}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {t('Verify all platform modules are operational', 'Проверете дали всички модули работят')}
            </p>
          </div>
          <Button onClick={runAll} disabled={running} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${running ? 'animate-spin' : ''}`} />
            {running ? t('Checking…', 'Проверка…') : t('Run All Checks', 'Стартирай проверка')}
          </Button>
        </div>

        {hasRun && (
          <Card className={`mb-6 border-2 ${allOk ? 'border-green-500/40' : hasErrors ? 'border-red-500/40' : 'border-yellow-500/40'}`}>
            <CardContent className="py-4 flex items-center gap-3">
              {allOk ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : hasErrors ? <XCircle className="h-6 w-6 text-red-500" /> : <AlertTriangle className="h-6 w-6 text-yellow-500" />}
              <span className="font-semibold">
                {allOk ? t('All systems operational', 'Всички системи работят') : hasErrors ? t('Some modules have errors', 'Някои модули имат грешки') : t('Some modules have warnings', 'Някои модули имат предупреждения')}
              </span>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-3">
          {MODULES.map(key => {
            const meta = MODULE_META[key];
            const r = results[key];
            const Icon = meta.icon;
            return (
              <Card key={key}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    {statusIcon(r.status)}
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium flex-1">{lang === 'bg' ? meta.bg : meta.en}</span>
                    {statusBadge(r.status, lang)}
                    {r.ms !== undefined && <span className="text-xs text-muted-foreground">{r.ms}ms</span>}
                  </div>
                  {r.message && r.status !== 'idle' && r.status !== 'running' && (
                    <p className="text-sm text-muted-foreground mt-2 ml-14">{r.message}</p>
                  )}
                  {r.status === 'error' && r.cause && (
                    <div className="mt-3 ml-14 p-3 rounded-md bg-destructive/10 text-sm space-y-1">
                      <p><strong>{t('Cause:', 'Причина:')}</strong> {r.cause}</p>
                      {r.fix && <p><strong>{t('Fix:', 'Решение:')}</strong> {r.fix}</p>}
                    </div>
                  )}
                  {r.status === 'warn' && r.cause && (
                    <div className="mt-3 ml-14 p-3 rounded-md bg-yellow-500/10 text-sm space-y-1">
                      <p><strong>{t('Note:', 'Забележка:')}</strong> {r.cause}</p>
                      {r.fix && <p><strong>{t('Suggestion:', 'Предложение:')}</strong> {r.fix}</p>}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
