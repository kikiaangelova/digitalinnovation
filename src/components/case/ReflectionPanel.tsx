import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, MessageSquare, Globe, PenTool, Zap, AlertTriangle } from 'lucide-react';

interface ConsequenceData {
  choice_key: string;
  choice_label: string;
  choice_label_bg?: string | null;
  explanation: string;
  explanation_bg?: string | null;
  real_world_link?: string | null;
  real_world_link_bg?: string | null;
}

interface ReflectionPanelProps {
  consequences: ConsequenceData[];
  chosenStrategy: string | null;
  reflectionText: string;
  onReflectionChange: (text: string) => void;
  onSave: () => void;
  saving: boolean;
  isSubmitted: boolean;
  lang: string;
}

export default function ReflectionPanel({
  consequences,
  chosenStrategy,
  reflectionText,
  onReflectionChange,
  onSave,
  saving,
  isSubmitted,
  lang,
}: ReflectionPanelProps) {
  const tl = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const tx = (en: string | null | undefined, bg: string | null | undefined) =>
    lang === 'bg' ? (bg || en || '') : (en || '');

  const sorted = [...consequences].sort((a, b) => a.choice_key.localeCompare(b.choice_key));
  const chosenConsequence = sorted.find(c => c.choice_key === chosenStrategy);

  // Determine if choice is "correct" (B is often the best in the data structure)
  // We use a simple heuristic: the consequence with the longest positive explanation
  const isGoodChoice = chosenConsequence?.explanation?.toLowerCase().includes('work') ||
    chosenConsequence?.explanation_bg?.toLowerCase().includes('работ');

  const charCount = reflectionText.length;
  const isValidReflection = charCount >= 50;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent shrink-0">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-foreground text-lg">
            {tl('Reflection', 'Рефлексия')}
          </h3>
          <p className="text-xs text-muted-foreground">
            {tl(
              'Understand why each strategy succeeded or failed.',
              'Разберете защо всяка стратегия проработи или се провали.'
            )}
          </p>
        </div>
      </div>

      {/* Block 1: Why strategies worked or failed */}
      <div className="space-y-3">
        <h4 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-sim-warning" />
          {tl('Why the decisions worked or failed', 'Защо решенията проработиха или се провалиха')}
        </h4>
        {sorted.map((c) => {
          const explanationText = tx(c.explanation, c.explanation_bg);
          if (!explanationText) return null;
          return (
            <div
              key={c.choice_key}
              className={`rounded-lg border p-4 ${
                chosenStrategy === c.choice_key
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs font-semibold">
                  {tl('Strategy', 'Стратегия')} {c.choice_key}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {tx(c.choice_label, c.choice_label_bg)}
                </span>
                {chosenStrategy === c.choice_key && (
                  <Badge className="bg-primary text-primary-foreground text-xs ml-auto">
                    {tl('Your choice', 'Твоят избор')}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-foreground leading-relaxed">{explanationText}</p>
            </div>
          );
        })}
      </div>

      {/* Block 2: Your decision feedback */}
      {chosenStrategy && chosenConsequence && (
        <div className={`rounded-lg border p-4 ${
          isGoodChoice
            ? 'border-sim-success/30 bg-sim-success/5'
            : 'border-sim-warning/30 bg-sim-warning/5'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {isGoodChoice ? (
              <CheckCircle2 className="h-5 w-5 text-sim-success" />
            ) : (
              <MessageSquare className="h-5 w-5 text-sim-warning" />
            )}
            <h4 className="text-sm font-display font-semibold text-foreground">
              {tl('Your Decision', 'Твоето решение')}
            </h4>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {isGoodChoice
              ? tl(
                  '✅ Good choice. The data supported this strategy.',
                  '✅ Добър избор. Данните подкрепяха тази стратегия.'
                )
              : tl(
                  '💭 Understandable choice. Here\'s what the data suggested about alternative approaches...',
                  '💭 Разбираем избор. Ето какво подсказваха данните за алтернативните подходи...'
                )
            }
          </p>
        </div>
      )}

      {/* Block 3: Real-world connection */}
      {sorted.some(c => c.real_world_link || c.real_world_link_bg) && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-display font-semibold text-foreground">
              {tl('Apply to the Real World', 'Приложи към реалния свят')}
            </h4>
          </div>
          {sorted.filter(c => c.real_world_link || c.real_world_link_bg).map(c => {
            const linkText = tx(c.real_world_link, c.real_world_link_bg);
            return linkText ? (
              <p key={c.choice_key} className="text-sm text-foreground leading-relaxed">{linkText}</p>
            ) : null;
          })}
        </div>
      )}

      {/* Block 4: Open reflection */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenTool className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-display font-semibold text-foreground">
              {tl('What would you do differently?', 'Какво би направил по-различно?')}
            </h4>
          </div>
          <Badge variant="outline" className="text-xs px-1.5 py-0 border-sim-warning/30 text-sim-warning">
            <Zap className="h-3 w-3 mr-0.5" /> +5 XP
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {tl(
            'Now that you\'ve seen the consequences, what would you decide differently and why? No right answer — think like a founder.',
            'Сега, след като видя последствията, какво би решил по-различно и защо? Без правилен отговор — мисли като основател.'
          )}
        </p>
        <Textarea
          value={reflectionText}
          onChange={(e) => onReflectionChange(e.target.value)}
          placeholder={tl(
            'Write at least 50 characters...',
            'Напишете поне 50 символа...'
          )}
          className="min-h-[120px]"
          disabled={isSubmitted}
        />
        <div className="flex items-center justify-between">
          <span className={`text-xs ${isValidReflection ? 'text-sim-success' : 'text-muted-foreground'}`}>
            {charCount}/50 {tl('characters min', 'символа мин.')}
            {charCount > 0 && charCount < 50 && (
              <span className="text-muted-foreground"> · {50 - charCount} {tl('more', 'още')}</span>
            )}
          </span>
          {!isSubmitted && (
            <Button variant="outline" size="sm" onClick={onSave} disabled={saving}>
              {saving ? tl('Saving...', 'Запазване...') : tl('Save Reflection', 'Запази рефлексията')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
