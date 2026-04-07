import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Search, Swords, Target, Lightbulb } from 'lucide-react';

interface Competitor {
  name: string;
  productType: string;
  targetCustomer: string;
  strength: string;
  weakness: string;
}

interface CompetitorData {
  competitors: Competitor[];
  opportunity: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  lang: 'en' | 'bg';
  disabled?: boolean;
}

const EMPTY_COMPETITOR: Competitor = {
  name: '', productType: '', targetCustomer: '', strength: '', weakness: '',
};

function parseData(raw: string): CompetitorData {
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.competitors) return parsed;
  } catch { /* not JSON, try legacy */ }

  // Fallback: if there's plain text, put it in opportunity
  return {
    competitors: [{ ...EMPTY_COMPETITOR }, { ...EMPTY_COMPETITOR }],
    opportunity: raw || '',
  };
}

function serializeData(data: CompetitorData): string {
  return JSON.stringify(data);
}

const t = (lang: string, en: string, bg: string) => lang === 'bg' ? bg : en;

export default function CompetitorAnalysis({ value, onChange, lang, disabled }: Props) {
  const [data, setData] = useState<CompetitorData>(() => parseData(value));

  useEffect(() => {
    setData(parseData(value));
  }, [value]);

  const update = (newData: CompetitorData) => {
    setData(newData);
    onChange(serializeData(newData));
  };

  const updateCompetitor = (index: number, field: keyof Competitor, val: string) => {
    const newComps = [...data.competitors];
    newComps[index] = { ...newComps[index], [field]: val };
    update({ ...data, competitors: newComps });
  };

  const addCompetitor = () => {
    if (data.competitors.length >= 4) return;
    update({ ...data, competitors: [...data.competitors, { ...EMPTY_COMPETITOR }] });
  };

  const removeCompetitor = (index: number) => {
    if (data.competitors.length <= 1) return;
    update({ ...data, competitors: data.competitors.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      {/* Question 1: Competitor Cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            {t(lang, 'Which existing solutions solve a similar problem?', 'Кои съществуващи решения решават подобен проблем?')}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          {t(lang, 'Add 2–3 competitors (direct or indirect).', 'Добавете 2–3 конкурента (преки или косвени).')}
        </p>

        <div className="space-y-4">
          {data.competitors.map((comp, i) => (
            <div key={i} className="rounded-lg border border-border bg-accent/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-xs">
                  {t(lang, `Competitor ${i + 1}`, `Конкурент ${i + 1}`)}
                </Badge>
                {data.competitors.length > 1 && !disabled && (
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeCompetitor(i)}>
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {t(lang, 'Competitor Name', 'Име на конкурента')}
                  </label>
                  <Input
                    value={comp.name}
                    onChange={e => updateCompetitor(i, 'name', e.target.value)}
                    placeholder={t(lang, 'e.g. Uber, Bolt...', 'напр. Uber, Bolt...')}
                    disabled={disabled}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {t(lang, 'Product Type', 'Тип продукт')}
                  </label>
                  <Input
                    value={comp.productType}
                    onChange={e => updateCompetitor(i, 'productType', e.target.value)}
                    placeholder={t(lang, 'e.g. Mobile app, SaaS...', 'напр. Мобилно приложение, SaaS...')}
                    disabled={disabled}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {t(lang, 'Target Customer', 'Целеви клиент')}
                  </label>
                  <Input
                    value={comp.targetCustomer}
                    onChange={e => updateCompetitor(i, 'targetCustomer', e.target.value)}
                    placeholder={t(lang, 'e.g. Young professionals', 'напр. Млади професионалисти')}
                    disabled={disabled}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.competitors.length < 4 && !disabled && (
          <Button variant="outline" size="sm" className="mt-3" onClick={addCompetitor}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            {t(lang, 'Add Competitor', 'Добави конкурент')}
          </Button>
        )}
      </div>

      {/* Question 2: Strengths & Weaknesses Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Swords className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            {t(lang, 'What are the strengths and weaknesses of these competitors?', 'Какви са силните и слабите страни на тези конкуренти?')}
          </h3>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left p-3 font-medium text-muted-foreground w-1/4">
                  {t(lang, 'Competitor', 'Конкурент')}
                </th>
                <th className="text-left p-3 font-medium text-emerald-600 w-[37.5%]">
                  {t(lang, 'Strength', 'Силна страна')}
                </th>
                <th className="text-left p-3 font-medium text-destructive w-[37.5%]">
                  {t(lang, 'Weakness', 'Слаба страна')}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.competitors.map((comp, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="p-3 font-medium text-foreground">
                    {comp.name || t(lang, `Competitor ${i + 1}`, `Конкурент ${i + 1}`)}
                  </td>
                  <td className="p-2">
                    <Input
                      value={comp.strength}
                      onChange={e => updateCompetitor(i, 'strength', e.target.value)}
                      placeholder={t(lang, 'Key strength...', 'Ключова сила...')}
                      disabled={disabled}
                      className="text-sm border-emerald-500/20 focus:border-emerald-500/40"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      value={comp.weakness}
                      onChange={e => updateCompetitor(i, 'weakness', e.target.value)}
                      placeholder={t(lang, 'Key weakness...', 'Ключова слабост...')}
                      disabled={disabled}
                      className="text-sm border-destructive/20 focus:border-destructive/40"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Question 3: Opportunity */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            {t(lang, 'What opportunity do you see that competitors are missing?', 'Каква възможност виждате, която конкурентите пропускат?')}
          </h3>
        </div>
        <Textarea
          value={data.opportunity}
          onChange={e => update({ ...data, opportunity: e.target.value })}
          placeholder={t(lang,
            'Describe the gap in the market that your startup can fill...',
            'Опишете пропуска на пазара, който вашият стартъп може да запълни...'
          )}
          disabled={disabled}
          className="min-h-[120px] text-sm"
        />
      </div>

      {/* Tip */}
      <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 flex items-start gap-2.5">
        <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          {t(lang,
            'Tip: A strong competitor analysis helps you find your unique angle. Use these insights to craft a compelling value proposition in the next step.',
            'Съвет: Силният анализ на конкуренцията ви помага да намерите уникалния си ъгъл. Използвайте тези прозрения, за да създадете убедително стойностно предложение в следващата стъпка.'
          )}
        </p>
      </div>
    </div>
  );
}
