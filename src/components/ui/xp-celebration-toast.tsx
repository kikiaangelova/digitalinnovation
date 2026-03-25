import { useEffect, useState, useCallback } from 'react';
import { Zap } from 'lucide-react';

type Lang = 'en' | 'bg';

interface XpToastItem {
  id: string;
  amount: number;
  label: string;
  type: 'xp' | 'levelup';
  levelNum?: number;
  levelName?: string;
  exiting?: boolean;
}

const MAX_VISIBLE = 3;
const HOLD_DURATION = 2500;
const ANIM_DURATION = 300;

let toastIdCounter = 0;
const listeners: Array<(toast: XpToastItem) => void> = [];

export function fireXpToast(amount: number, label: string) {
  const item: XpToastItem = {
    id: `xp-${++toastIdCounter}`,
    amount,
    label,
    type: 'xp',
  };
  listeners.forEach(fn => fn(item));
}

export function fireLevelUpToast(levelNum: number, levelName: string) {
  const item: XpToastItem = {
    id: `lvl-${++toastIdCounter}`,
    amount: 0,
    label: '',
    type: 'levelup',
    levelNum,
    levelName,
  };
  listeners.forEach(fn => fn(item));
}

export function XpCelebrationToaster() {
  const [toasts, setToasts] = useState<XpToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, ANIM_DURATION);
  }, []);

  const addToast = useCallback((item: XpToastItem) => {
    setToasts(prev => {
      const next = [item, ...prev];
      // If over max, mark oldest for exit
      if (next.length > MAX_VISIBLE) {
        const oldest = next[next.length - 1];
        setTimeout(() => dismiss(oldest.id), 0);
      }
      return next.slice(0, MAX_VISIBLE + 1);
    });

    // Auto-dismiss after hold
    setTimeout(() => dismiss(item.id), HOLD_DURATION);
  }, [dismiss]);

  useEffect(() => {
    listeners.push(addToast);
    return () => {
      const idx = listeners.indexOf(addToast);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        t.type === 'levelup' ? (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-xl px-6 py-4 sim-gradient text-primary-foreground shadow-xl
              ${t.exiting ? 'animate-xp-toast-out' : 'animate-xp-toast-in animate-level-pop'}`}
          >
            <div className="flex items-center gap-3">
              <Zap className="h-7 w-7 text-primary-foreground" />
              <div>
                <p className="text-lg font-bold font-display tracking-wide">
                  🎉 {t.levelName}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg
              ${t.exiting ? 'animate-xp-toast-out' : 'animate-xp-toast-in'}`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-xp-gold/20">
              <Zap className="h-4 w-4 text-xp-gold" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-xp-gold">
                +{t.amount} XP
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {t.label}
              </p>
            </div>
          </div>
        )
      ))}
    </div>
  );
}
