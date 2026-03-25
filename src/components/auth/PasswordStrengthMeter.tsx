import { useMemo } from 'react';
import { Check, X, Eye, EyeOff } from 'lucide-react';

const COMMON_PASSWORDS = [
  'password', '123456', '12345678', '123456789', '1234567890', 'qwerty', 'abc123',
  'password1', 'letmein', 'welcome', 'admin', 'login', 'master', 'dragon',
  'monkey', 'shadow', 'sunshine', 'princess', 'football', 'baseball', 'iloveyou',
  'trustno1', 'passw0rd', 'password123', 'qwerty123', 'welcome1',
];

export interface PasswordCheck {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  notCommon: boolean;
  notContainsName: boolean;
  complexityMet: boolean; // 3 of 4 char types
}

export function checkPassword(password: string, nameOrEmail?: string): PasswordCheck {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const charTypes = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

  const lower = password.toLowerCase();
  const notCommon = password.length === 0 || !COMMON_PASSWORDS.includes(lower);

  let notContainsName = true;
  if (nameOrEmail && password.length >= 4) {
    const parts = nameOrEmail.toLowerCase().replace(/@.*$/, '').split(/[\s._-]+/).filter(p => p.length >= 3);
    notContainsName = !parts.some(p => lower.includes(p));
  }

  return {
    minLength: password.length >= 8,
    hasUpper,
    hasLower,
    hasNumber,
    hasSymbol,
    notCommon,
    notContainsName,
    complexityMet: charTypes >= 3,
  };
}

export function getStrength(checks: PasswordCheck): 'none' | 'weak' | 'ok' | 'strong' {
  if (!checks.minLength) return checks.hasLower || checks.hasUpper ? 'weak' : 'none';
  if (!checks.complexityMet || !checks.notCommon || !checks.notContainsName) return 'weak';
  const all = checks.minLength && checks.complexityMet && checks.notCommon && checks.notContainsName;
  if (!all) return 'weak';
  const charTypes = [checks.hasUpper, checks.hasLower, checks.hasNumber, checks.hasSymbol].filter(Boolean).length;
  return charTypes === 4 ? 'strong' : 'ok';
}

const STRENGTH_COLORS = {
  none: 'bg-muted',
  weak: 'bg-destructive',
  ok: 'bg-sim-warning',
  strong: 'bg-sim-success',
};

const STRENGTH_LABELS = {
  none: { en: '', bg: '' },
  weak: { en: 'Weak', bg: 'Слаба' },
  ok: { en: 'OK', bg: 'Добра' },
  strong: { en: 'Strong', bg: 'Силна' },
};

interface Props {
  password: string;
  nameOrEmail?: string;
  lang: 'en' | 'bg';
}

export default function PasswordStrengthMeter({ password, nameOrEmail, lang }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const checks = useMemo(() => checkPassword(password, nameOrEmail), [password, nameOrEmail]);
  const strength = useMemo(() => getStrength(checks), [checks]);

  if (!password) return null;

  const requirements: { key: keyof PasswordCheck; en: string; bg: string }[] = [
    { key: 'minLength', en: 'At least 8 characters', bg: 'Поне 8 символа' },
    { key: 'complexityMet', en: '3 of 4: uppercase, lowercase, number, symbol', bg: '3 от 4: главна, малка, цифра, символ' },
    { key: 'notCommon', en: 'Not a common password', bg: 'Не е често срещана парола' },
    { key: 'notContainsName', en: 'Does not contain your name/email', bg: 'Не съдържа вашето име/имейл' },
  ];

  const bars = strength === 'none' ? 0 : strength === 'weak' ? 1 : strength === 'ok' ? 2 : 3;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < bars ? STRENGTH_COLORS[strength] : 'bg-muted'}`} />
          ))}
        </div>
        <span className={`text-xs font-medium ${strength === 'strong' ? 'text-sim-success' : strength === 'ok' ? 'text-sim-warning' : strength === 'weak' ? 'text-destructive' : 'text-muted-foreground'}`}>
          {STRENGTH_LABELS[strength][lang]}
        </span>
      </div>
      <div className="space-y-1">
        {requirements.map(r => {
          const met = checks[r.key];
          return (
            <div key={r.key} className="flex items-center gap-1.5">
              {met ? <Check className="h-3 w-3 text-sim-success" /> : <X className="h-3 w-3 text-muted-foreground" />}
              <span className={`text-xs ${met ? 'text-sim-success' : 'text-muted-foreground'}`}>
                {t(r.en, r.bg)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
