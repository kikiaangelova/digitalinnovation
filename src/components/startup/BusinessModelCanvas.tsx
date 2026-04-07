import { useCallback, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users, Zap, Megaphone, HeartHandshake, DollarSign,
  Box, Activity, Handshake, Wallet
} from 'lucide-react';

export interface BMCData {
  bmc_customer_segments: string;
  bmc_value_proposition: string;
  bmc_channels: string;
  bmc_customer_relationships: string;
  bmc_revenue_streams: string;
  bmc_key_resources: string;
  bmc_key_activities: string;
  bmc_key_partners: string;
  bmc_cost_structure: string;
}

export const BMC_KEYS: (keyof BMCData)[] = [
  'bmc_key_partners', 'bmc_key_activities', 'bmc_value_proposition',
  'bmc_customer_relationships', 'bmc_customer_segments',
  'bmc_key_resources', 'bmc_channels',
  'bmc_cost_structure', 'bmc_revenue_streams',
];

interface Block {
  key: keyof BMCData;
  icon: React.ElementType;
  en: string;
  bg: string;
  descEn: string;
  descBg: string;
  gridArea: string;
}

const BLOCKS: Block[] = [
  {
    key: 'bmc_key_partners', icon: Handshake,
    en: 'Key Partners', bg: 'Ключови партньори',
    descEn: 'Who are your strategic partners?',
    descBg: 'Кои са вашите стратегически партньори?',
    gridArea: 'kp',
  },
  {
    key: 'bmc_key_activities', icon: Activity,
    en: 'Key Activities', bg: 'Ключови дейности',
    descEn: 'What activities are required to run the business?',
    descBg: 'Какви ключови дейности трябва да изпълнявате?',
    gridArea: 'ka',
  },
  {
    key: 'bmc_key_resources', icon: Box,
    en: 'Key Resources', bg: 'Ключови ресурси',
    descEn: 'What resources are required to deliver your value proposition?',
    descBg: 'Какви ключови ресурси са необходими?',
    gridArea: 'kr',
  },
  {
    key: 'bmc_value_proposition', icon: Zap,
    en: 'Value Proposition', bg: 'Стойностно предложение',
    descEn: 'What problem do you solve and what value do you create?',
    descBg: 'Какъв проблем решавате и каква стойност създавате?',
    gridArea: 'vp',
  },
  {
    key: 'bmc_customer_relationships', icon: HeartHandshake,
    en: 'Customer Relationships', bg: 'Взаимоотношения с клиентите',
    descEn: 'How will you interact with your customers?',
    descBg: 'Как ще взаимодействате с клиентите си?',
    gridArea: 'cr',
  },
  {
    key: 'bmc_channels', icon: Megaphone,
    en: 'Channels', bg: 'Канали',
    descEn: 'How do you reach your customers?',
    descBg: 'Чрез кои канали достигате до клиентите си?',
    gridArea: 'ch',
  },
  {
    key: 'bmc_customer_segments', icon: Users,
    en: 'Customer Segments', bg: 'Клиентски сегменти',
    descEn: 'Who are your target customers?',
    descBg: 'Кои са вашите целеви клиенти?',
    gridArea: 'cs',
  },
  {
    key: 'bmc_cost_structure', icon: Wallet,
    en: 'Cost Structure', bg: 'Структура на разходите',
    descEn: 'What are the main costs of running the startup?',
    descBg: 'Кои са основните разходи за стартиране и развитие на бизнеса?',
    gridArea: 'co',
  },
  {
    key: 'bmc_revenue_streams', icon: DollarSign,
    en: 'Revenue Streams', bg: 'Приходни потоци',
    descEn: 'How will your startup make money?',
    descBg: 'Как вашият стартъп ще генерира приходи?',
    gridArea: 'rs',
  },
];

interface Props {
  data: BMCData;
  lang: 'en' | 'bg';
  disabled?: boolean;
  onChange: (key: keyof BMCData, value: string) => void;
}

export default function BusinessModelCanvas({ data, lang, disabled, onChange }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const filledCount = BLOCKS.filter(b => (data[b.key] || '').trim().length > 30).length;
  const pct = Math.round((filledCount / 9) * 100);

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {t('Business Model Canvas Completion', 'Завършеност на Business Model Canvas')}
          </span>
          <Badge variant="outline" className="text-xs">
            {filledCount} / 9 {t('sections', 'секции')}
          </Badge>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

      {/* Canvas grid — mobile stack */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {BLOCKS.map(block => {
          const Icon = block.icon;
          const filled = (data[block.key] || '').trim().length > 30;
          return (
            <div
              key={block.key}
              className="rounded-lg border border-border bg-card p-3 flex flex-col"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-xs font-semibold text-foreground truncate">
                  {t(block.en, block.bg)}
                </span>
                {filled && (
                  <span className="ml-auto text-xs text-[hsl(var(--sim-success))]">✓</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2 leading-tight">
                {t(block.descEn, block.descBg)}
              </p>
              <Textarea
                value={data[block.key] || ''}
                onChange={e => onChange(block.key, e.target.value)}
                disabled={disabled}
                placeholder={t('Type here...', 'Пишете тук...')}
                className="flex-1 min-h-[80px] text-xs resize-none"
              />
            </div>
          );
        })}
      </div>

      {/* Canvas grid — desktop */}
      <div
        className="hidden md:grid gap-2"
        style={{
          gridTemplateColumns: 'repeat(10, 1fr)',
          gridTemplateRows: 'auto auto auto',
          gridTemplateAreas: `
            "kp kp ka ka vp vp cr cr cs cs"
            "kp kp kr kr vp vp ch ch cs cs"
            "co co co co co rs rs rs rs rs"
          `,
        }}
      >
        {BLOCKS.map(block => {
          const Icon = block.icon;
          const filled = (data[block.key] || '').trim().length > 30;
          return (
            <div
              key={block.key}
              className="rounded-lg border border-border bg-card p-3 flex flex-col"
              style={{ gridArea: block.gridArea }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-xs font-semibold text-foreground truncate">
                  {t(block.en, block.bg)}
                </span>
                {filled && (
                  <span className="ml-auto text-xs text-[hsl(var(--sim-success))]">✓</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2 leading-tight">
                {t(block.descEn, block.descBg)}
              </p>
              <Textarea
                value={data[block.key] || ''}
                onChange={e => onChange(block.key, e.target.value)}
                disabled={disabled}
                placeholder={t('Type here...', 'Пишете тук...')}
                className="flex-1 min-h-[80px] text-xs resize-none"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
