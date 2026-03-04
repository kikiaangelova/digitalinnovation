import { useState, useEffect } from 'react';
import { DecisionTemplate, DecisionAnswer } from '@/types/simulator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Lightbulb, Target, TrendingUp, Database, Shield } from 'lucide-react';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  strategy: <Target className="h-4 w-4" />,
  product: <Lightbulb className="h-4 w-4" />,
  growth: <TrendingUp className="h-4 w-4" />,
  data_ai: <Database className="h-4 w-4" />,
  ops_risk: <Shield className="h-4 w-4" />,
};

const TYPE_COLORS: Record<string, string> = {
  strategy: 'bg-sim-info/10 text-sim-info border-sim-info/30',
  product: 'bg-primary/10 text-primary border-primary/30',
  growth: 'bg-sim-success/10 text-sim-success border-sim-success/30',
  data_ai: 'bg-accent/10 text-accent border-accent/30',
  ops_risk: 'bg-sim-danger/10 text-sim-danger border-sim-danger/30',
};

interface DecisionFormProps {
  decisions: DecisionTemplate[];
  initialAnswers?: DecisionAnswer[];
  rationale?: string;
  reflection?: string;
  onSaveDraft: (answers: DecisionAnswer[], rationale: string, reflection: string) => void;
  onSubmit: () => void;
  isSubmitted: boolean;
}

export default function DecisionForm({
  decisions, initialAnswers, rationale: initRationale, reflection: initReflection,
  onSaveDraft, onSubmit, isSubmitted,
}: DecisionFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [rationale, setRationale] = useState(initRationale || '');
  const [reflection, setReflection] = useState(initReflection || '');

  useEffect(() => {
    if (initialAnswers) {
      const map: Record<string, string> = {};
      initialAnswers.forEach(a => { map[a.decision_template_id] = a.answer; });
      setAnswers(map);
    }
  }, [initialAnswers]);

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setTimeout(() => {
      const answerList = Object.entries(answers).map(([templateId, answer]) => ({
        decision_template_id: templateId,
        answer,
      }));
      onSaveDraft(answerList, rationale, reflection);
    }, 1000);
    return () => clearTimeout(timer);
  }, [answers, rationale, reflection, isSubmitted, onSaveDraft]);

  const selectOption = (templateId: string, optionId: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [templateId]: optionId }));
  };

  const allAnswered = decisions.every(d => answers[d.id]);

  const handleSubmit = () => {
    if (!allAnswered || isSubmitted) return;
    onSubmit();
  };

  return (
    <div className="space-y-6">
      {decisions.map((decision, idx) => (
        <div key={decision.id} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start gap-3 mb-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {idx + 1}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground">{decision.title}</h4>
                <Badge variant="outline" className={`text-xs ${TYPE_COLORS[decision.type]}`}>
                  <span className="mr-1">{TYPE_ICONS[decision.type]}</span>
                  {decision.type.replace('_', '/')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{decision.description}</p>
            </div>
            {answers[decision.id] && (
              <CheckCircle2 className="h-5 w-5 text-sim-success shrink-0" />
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {decision.options.map(option => {
              const selected = answers[decision.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => selectOption(decision.id, option.id)}
                  disabled={isSubmitted}
                  className={`rounded-lg border p-3 text-left transition-all ${
                    selected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/40 hover:bg-sim-surface'
                  } ${isSubmitted ? 'cursor-default opacity-75' : 'cursor-pointer'}`}
                >
                  <p className="text-sm font-medium text-foreground">{option.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="font-semibold text-foreground mb-3">📝 Decision Rationale</h4>
        <p className="text-sm text-muted-foreground mb-2">Explain your reasoning. Cite KPIs or data that informed your choices.</p>
        <Textarea
          value={rationale}
          onChange={e => setRationale(e.target.value)}
          placeholder="We chose to focus on... because our data shows..."
          disabled={isSubmitted}
          className="min-h-[100px]"
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="font-semibold text-foreground mb-3">🔍 Reflection</h4>
        <p className="text-sm text-muted-foreground mb-2">What did you learn this week? What would you do differently?</p>
        <Textarea
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          placeholder="This week we learned that..."
          disabled={isSubmitted}
          className="min-h-[100px]"
        />
      </div>

      {!isSubmitted && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {Object.keys(answers).length}/{decisions.length} decisions made
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="sim-gradient border-0"
          >
            Submit Decisions
          </Button>
        </div>
      )}
    </div>
  );
}
