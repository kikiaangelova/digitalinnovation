import KikiSticker from '@/components/mentor/KikiSticker';

interface Props {
  variant: 'library' | 'preview';
  lang: 'en' | 'bg';
}

const LIBRARY_COPY = {
  en: {
    title: 'Kiki AI in Case Lab',
    body: 'Kiki will help you choose cases and think more clearly. Start with an easier case if you are still practicing problems and assumptions. Choose an intermediate case if you are working with a business model or MVP. Advanced cases are for uncertainty, growth and strategic decisions.',
    note: 'Kiki will not solve the case for you. It will help you ask better questions.',
  },
  bg: {
    title: 'Kiki AI в Case Lab',
    body: 'Kiki ще ти помага да избираш казуси и да мислиш по-ясно. Започни с по-лесен казус, ако още тренираш проблеми и допускания. Избери среден, ако работиш с бизнес модел или MVP. Напредналите казуси са за решения при несигурност, растеж и стратегически избор.',
    note: 'Kiki няма да реши казуса вместо теб. Ще ти помага да задаваш по-добри въпроси.',
  },
} as const;

const PREVIEW_COPY = {
  en: {
    title: 'Before you start, Kiki would ask:',
    questions: [
      'What decision do you need to make in this case?',
      'Which parts are facts and which are assumptions?',
      'What evidence would make your choice reasonable?',
    ],
    note: 'Think first on your own. Then use Kiki to check and improve your reasoning.',
  },
  bg: {
    title: 'Преди да започнеш, Kiki би те попитала:',
    questions: [
      'Какво решение трябва да вземеш в този казус?',
      'Кои са фактите и кои са само допускания?',
      'Какво ще приемеш за доказателство, че изборът ти е разумен?',
    ],
    note: 'Отговори първо със собствено мислене. После използвай Kiki за проверка и подобрение.',
  },
} as const;

/**
 * Static Kiki AI guidance card for Case Lab.
 * No chat, no API calls, no usage limits — purely display-only copy.
 */
export default function KikiCaseLabCard({ variant, lang }: Props) {
  const testId = variant === 'preview' ? 'kiki-case-prep-card' : 'kiki-case-lab-card';

  return (
    <aside
      data-testid={testId}
      className="rounded-xl border border-primary/20 bg-card p-4 sm:p-5"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <KikiSticker
          mood={variant === 'library' ? 'hello' : 'thinking'}
          lang={lang}
          size={56}
          decorative
        />
        <div className="min-w-0">
          {variant === 'library' ? (
            <>
              <h3 className="text-sm font-display font-semibold text-foreground">
                {LIBRARY_COPY[lang].title}
              </h3>
              <p className="mt-1.5 text-sm text-foreground/90 leading-relaxed">
                {LIBRARY_COPY[lang].body}
              </p>
              <p className="mt-2 text-xs text-muted-foreground italic">
                {LIBRARY_COPY[lang].note}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-sm font-display font-semibold text-foreground">
                {PREVIEW_COPY[lang].title}
              </h3>
              <ul className="mt-2 space-y-1.5">
                {PREVIEW_COPY[lang].questions.map((q, i) => (
                  <li
                    key={i}
                    className="text-sm text-foreground/90 leading-relaxed pl-3 border-l-2 border-primary/40"
                  >
                    {q}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground italic">
                {PREVIEW_COPY[lang].note}
              </p>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
