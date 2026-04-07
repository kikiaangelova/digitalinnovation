import { GameStatus, Resources, KPIs } from '@/types/simulator';
import { Button } from '@/components/ui/button';
import { Skull, Trophy, ArrowLeft, RotateCcw, Wallet, Clock } from 'lucide-react';

interface Props {
  gameStatus: GameStatus;
  resources: Resources;
  kpis: KPIs;
  weekNumber: number;
  onRestart?: () => void;
  onBack: () => void;
  lang?: string;
}

export default function GameOverScreen({ gameStatus, resources, kpis, weekNumber, onRestart, onBack, lang = 'en' }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const isWin = gameStatus === 'won';

  const loseReasons: Record<string, { icon: typeof Skull; title: string; desc: string }> = {
    lost_money: {
      icon: Wallet,
      title: t('Bankrupt!', 'Банкрут!'),
      desc: t(
        'Your startup ran out of money. Without budget, you can\'t pay your team or keep the lights on.',
        'Стартъпът ви остана без пари. Без бюджет не можете да плащате на екипа или да поддържате бизнеса.'
      ),
    },
    lost_time: {
      icon: Clock,
      title: t('Out of Time!', 'Времето изтече!'),
      desc: t(
        'Your runway expired before you could build a sustainable business. You needed to move faster or cut costs.',
        'Резервът ви изтече преди да изградите устойчив бизнес. Трябваше да действате по-бързо или да намалите разходите.'
      ),
    },
  };

  const reason = isWin ? null : loseReasons[gameStatus];
  const ReasonIcon = reason?.icon || Skull;

  return (
    <div className="rounded-2xl border-2 border-border bg-card p-8 text-center space-y-6">
      <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
        isWin ? 'bg-sim-success/10' : 'bg-destructive/10'
      }`}>
        {isWin ? (
          <Trophy className="h-10 w-10 text-sim-success" />
        ) : (
          <ReasonIcon className="h-10 w-10 text-destructive" />
        )}
      </div>

      <div>
        <h2 className={`text-2xl font-bold ${isWin ? 'text-sim-success' : 'text-destructive'}`}>
          {isWin ? t('🏆 You Won!', '🏆 Победихте!') : reason?.title}
        </h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          {isWin
            ? t(
                `Your startup survived ${weekNumber} weeks and reached a stable business! You managed resources wisely and adapted to market chaos.`,
                `Стартъпът ви оцеля ${weekNumber} седмици и достигна стабилен бизнес! Управлявахте ресурсите мъдро и се адаптирахте към пазарния хаос.`
              )
            : reason?.desc}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs text-muted-foreground">{t('Weeks Survived', 'Седмици')}</p>
          <p className="text-xl font-bold text-foreground">{weekNumber}</p>
        </div>
        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs text-muted-foreground">{t('Final Budget', 'Финален бюджет')}</p>
          <p className="text-xl font-bold text-foreground">€{resources.money.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs text-muted-foreground">{t('Total Users', 'Потребители')}</p>
          <p className="text-xl font-bold text-foreground">{kpis.users_total.toLocaleString()}</p>
        </div>
      </div>

      {!isWin && (
        <div className="rounded-lg border border-sim-warning/30 bg-sim-warning/5 p-4 max-w-md mx-auto">
          <p className="text-sm text-foreground font-medium mb-1">
            💡 {t('Lesson from Kotler\'s Chaotics', 'Урок от Chaotics на Котлър')}
          </p>
          <p className="text-xs text-muted-foreground">
            {gameStatus === 'lost_money'
              ? t(
                  '"In turbulent times, the worst thing a company can do is cut everything. The best companies selectively invest in resilience."',
                  '„В турбулентни времена най-лошото нещо, което компанията може да направи, е да режe всичко. Най-добрите компании инвестират селективно в устойчивост."'
                )
              : t(
                  '"Speed of execution is the ultimate competitive advantage in uncertainty. Those who move fastest survive."',
                  '„Скоростта на изпълнение е най-голямото конкурентно предимство в несигурност. Тези, които се движат най-бързо, оцеляват."'
                )}
          </p>
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('Back to Season', 'Към сезона')}
        </Button>
        {onRestart && (
          <Button onClick={onRestart} className="sim-gradient border-0">
            <RotateCcw className="h-4 w-4 mr-1" />
            {t('Try Again', 'Опитай отново')}
          </Button>
        )}
      </div>
    </div>
  );
}