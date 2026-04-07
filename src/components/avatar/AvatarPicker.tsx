import { useLang } from '@/context/LangContext';
import type { AvatarStyle } from './PlayerAvatar';
import { getAvatarSrc } from './PlayerAvatar';
import { CheckCircle2 } from 'lucide-react';

interface AvatarPickerProps {
  selected: AvatarStyle | '';
  onSelect: (style: AvatarStyle) => void;
  xp?: number;
}

const STYLES: { key: AvatarStyle; en: string; bg: string; descEn: string; descBg: string }[] = [
  { key: 'student', en: 'Student', bg: 'Студент', descEn: 'The eager learner', descBg: 'Нетърпелив ученик' },
  { key: 'founder', en: 'Founder', bg: 'Основател', descEn: 'The business builder', descBg: 'Бизнес строител' },
  { key: 'innovator', en: 'Innovator', bg: 'Иноватор', descEn: 'The creative thinker', descBg: 'Творчески мислител' },
  { key: 'female-student', en: 'Student ♀', bg: 'Студентка', descEn: 'The eager learner', descBg: 'Нетърпелива ученичка' },
  { key: 'female-founder', en: 'Founder ♀', bg: 'Основателка', descEn: 'The business builder', descBg: 'Бизнес строителка' },
  { key: 'female-innovator', en: 'Innovator ♀', bg: 'Иноваторка', descEn: 'The creative thinker', descBg: 'Творческа мислителка' },
];

export default function AvatarPicker({ selected, onSelect, xp = 0 }: AvatarPickerProps) {
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-foreground">
        {t('Choose your avatar style', 'Избери стил на аватара')}
      </p>
      <p className="text-xs text-muted-foreground">
        {t('Your avatar evolves as you level up!', 'Аватарът ти еволюира с всяко ниво!')}
      </p>
      <div className="grid grid-cols-3 gap-3">
        {STYLES.map(s => {
          const isSelected = selected === s.key;
          const src = getAvatarSrc(s.key, xp);
          return (
            <button
              key={s.key}
              onClick={() => onSelect(s.key)}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                ${isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/40 hover:bg-accent'}`}
            >
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 bg-primary rounded-full p-0.5">
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-primary/20">
                <img src={src} alt={s.en} className="h-full w-full object-cover" />
              </div>
              <span className="text-xs font-semibold text-foreground">
                {lang === 'bg' ? s.bg : s.en}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {lang === 'bg' ? s.descBg : s.descEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
