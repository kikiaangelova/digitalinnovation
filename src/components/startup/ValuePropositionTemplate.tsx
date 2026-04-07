import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Zap, HelpCircle } from 'lucide-react';

interface VPData {
  customer: string;
  problem: string;
  solution: string;
  uniqueBenefit: string;
  competitor: string;
  freeform: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  lang: 'en' | 'bg';
  disabled?: boolean;
  /** Pre-fill from other project fields */
  prefill?: { customer?: string; problem?: string; competitor?: string };
}

function parseVP(raw: string): VPData {
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.solution !== undefined) return parsed;
  } catch { /* plain text fallback */ }
  return { customer: '', problem: '', solution: '', uniqueBenefit: '', competitor: '', freeform: raw || '' };
}

function serializeVP(data: VPData): string {
  return JSON.stringify(data);
}

const t = (lang: string, en: string, bg: string) => lang === 'bg' ? bg : en;

const FIELDS: { key: keyof VPData; prefixEn: string; prefixBg: string; placeholderEn: string; placeholderBg: string }[] = [
  { key: 'customer', prefixEn: 'For', prefixBg: 'За', placeholderEn: 'target customer segment', placeholderBg: 'целеви клиентски сегмент' },
  { key: 'problem', prefixEn: 'who', prefixBg: 'които', placeholderEn: 'have this problem / need', placeholderBg: 'имат този проблем / нужда' },
  { key: 'solution', prefixEn: 'our product is', prefixBg: 'нашият продукт е', placeholderEn: 'a digital solution that...', placeholderBg: 'дигитално решение, което...' },
  { key: 'uniqueBenefit', prefixEn: 'that', prefixBg: 'което', placeholderEn: 'unique benefit / outcome', placeholderBg: 'уникална полза / резултат' },
  { key: 'competitor', prefixEn: 'unlike', prefixBg: 'за разлика от', placeholderEn: 'main competitor / alternative', placeholderBg: 'основен конкурент / алтернатива' },
];

export default function ValuePropositionTemplate({ value, onChange, lang, disabled, prefill }: Props) {
  const [data, setData] = useState<VPData>(() => {
    const parsed = parseVP(value);
    // Apply prefill if fields are empty
    if (prefill) {
      if (!parsed.customer && prefill.customer) parsed.customer = prefill.customer;
      if (!parsed.problem && prefill.problem) parsed.problem = prefill.problem;
      if (!parsed.competitor && prefill.competitor) parsed.competitor = prefill.competitor;
    }
    return parsed;
  });

  useEffect(() => {
    setData(parseVP(value));
  }, [value]);

  const update = (field: keyof VPData, val: string) => {
    const newData = { ...data, [field]: val };
    setData(newData);
    onChange(serializeVP(newData));
  };

  return (
    <div className="space-y-5">
      {/* Template */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            {t(lang, 'Value Proposition Template', 'Шаблон за стойностно предложение')}
          </h3>
          <Badge variant="outline" className="text-[10px] ml-auto">
            {t(lang, 'Guided', 'Насочен')}
          </Badge>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
          {FIELDS.map((f) => (
            <div key={f.key} className="flex items-center gap-3">
              <span className="text-sm font-medium text-primary min-w-[80px] text-right italic">
                {lang === 'bg' ? f.prefixBg : f.prefixEn}
              </span>
              <Input
                value={data[f.key]}
                onChange={e => update(f.key, e.target.value)}
                placeholder={lang === 'bg' ? f.placeholderBg : f.placeholderEn}
                disabled={disabled}
                className="text-sm bg-background"
              />
            </div>
          ))}
        </div>

        {/* Preview sentence */}
        {data.customer && data.solution && (
          <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {t(lang, 'Your Value Proposition:', 'Вашето стойностно предложение:')}
            </p>
            <p className="text-sm text-foreground italic leading-relaxed">
              {t(lang, 'For', 'За')} <strong>{data.customer || '...'}</strong>{' '}
              {t(lang, 'who', 'които')} <strong>{data.problem || '...'}</strong>,{' '}
              {t(lang, 'our product is', 'нашият продукт е')} <strong>{data.solution || '...'}</strong>{' '}
              {t(lang, 'that', 'което')} <strong>{data.uniqueBenefit || '...'}</strong>,{' '}
              {t(lang, 'unlike', 'за разлика от')} <strong>{data.competitor || '...'}</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Freeform expansion */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            {t(lang, 'Expand on your value proposition (optional):', 'Разширете стойностното си предложение (по избор):')}
          </span>
        </div>
        <Textarea
          value={data.freeform}
          onChange={e => update('freeform', e.target.value)}
          placeholder={t(lang,
            'Add more context about why your solution is unique...',
            'Добавете повече контекст защо вашето решение е уникално...'
          )}
          disabled={disabled}
          className="min-h-[100px] text-sm"
        />
      </div>
    </div>
  );
}
