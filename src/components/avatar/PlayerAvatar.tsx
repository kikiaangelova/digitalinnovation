import { getCurrentLevel } from '@/components/dashboard/LevelCard';

// Static imports for all 36 avatar images
import student1 from '@/assets/avatars/student-1.png';
import student2 from '@/assets/avatars/student-2.png';
import student3 from '@/assets/avatars/student-3.png';
import student4 from '@/assets/avatars/student-4.png';
import student5 from '@/assets/avatars/student-5.png';
import student6 from '@/assets/avatars/student-6.png';
import founder1 from '@/assets/avatars/founder-1.png';
import founder2 from '@/assets/avatars/founder-2.png';
import founder3 from '@/assets/avatars/founder-3.png';
import founder4 from '@/assets/avatars/founder-4.png';
import founder5 from '@/assets/avatars/founder-5.png';
import founder6 from '@/assets/avatars/founder-6.png';
import innovator1 from '@/assets/avatars/innovator-1.png';
import innovator2 from '@/assets/avatars/innovator-2.png';
import innovator3 from '@/assets/avatars/innovator-3.png';
import innovator4 from '@/assets/avatars/innovator-4.png';
import innovator5 from '@/assets/avatars/innovator-5.png';
import innovator6 from '@/assets/avatars/innovator-6.png';
import femaleStudent1 from '@/assets/avatars/female-student-1.png';
import femaleStudent2 from '@/assets/avatars/female-student-2.png';
import femaleStudent3 from '@/assets/avatars/female-student-3.png';
import femaleStudent4 from '@/assets/avatars/female-student-4.png';
import femaleStudent5 from '@/assets/avatars/female-student-5.png';
import femaleStudent6 from '@/assets/avatars/female-student-6.png';
import femaleFounder1 from '@/assets/avatars/female-founder-1.png';
import femaleFounder2 from '@/assets/avatars/female-founder-2.png';
import femaleFounder3 from '@/assets/avatars/female-founder-3.png';
import femaleFounder4 from '@/assets/avatars/female-founder-4.png';
import femaleFounder5 from '@/assets/avatars/female-founder-5.png';
import femaleFounder6 from '@/assets/avatars/female-founder-6.png';
import femaleInnovator1 from '@/assets/avatars/female-innovator-1.png';
import femaleInnovator2 from '@/assets/avatars/female-innovator-2.png';
import femaleInnovator3 from '@/assets/avatars/female-innovator-3.png';
import femaleInnovator4 from '@/assets/avatars/female-innovator-4.png';
import femaleInnovator5 from '@/assets/avatars/female-innovator-5.png';
import femaleInnovator6 from '@/assets/avatars/female-innovator-6.png';

export type AvatarStyle = 'student' | 'founder' | 'innovator' | 'female-student' | 'female-founder' | 'female-innovator';

export const AVATAR_STYLES: AvatarStyle[] = ['student', 'founder', 'innovator', 'female-student', 'female-founder', 'female-innovator'];

const AVATAR_MAP: Record<AvatarStyle, string[]> = {
  student: [student1, student2, student3, student4, student5, student6],
  founder: [founder1, founder2, founder3, founder4, founder5, founder6],
  innovator: [innovator1, innovator2, innovator3, innovator4, innovator5, innovator6],
  'female-student': [femaleStudent1, femaleStudent2, femaleStudent3, femaleStudent4, femaleStudent5, femaleStudent6],
  'female-founder': [femaleFounder1, femaleFounder2, femaleFounder3, femaleFounder4, femaleFounder5, femaleFounder6],
  'female-innovator': [femaleInnovator1, femaleInnovator2, femaleInnovator3, femaleInnovator4, femaleInnovator5, femaleInnovator6],
};

const LEVEL_BORDERS: string[] = [
  'ring-2 ring-muted-foreground/30',
  'ring-2 ring-blue-400/50',
  'ring-2 ring-purple-400/50',
  'ring-2 ring-amber-400/60 shadow-md',
  'ring-[3px] ring-amber-500/70 shadow-lg',
  'ring-[3px] ring-yellow-400 shadow-xl shadow-yellow-400/20',
];

export function getAvatarSrc(style: AvatarStyle | string, xp: number): string {
  const validStyle = (AVATAR_STYLES.includes(style as AvatarStyle) ? style : 'student') as AvatarStyle;
  const level = getCurrentLevel(xp);
  const idx = Math.min(level.level - 1, 5);
  return AVATAR_MAP[validStyle][idx];
}

export function getAvatarBorder(xp: number): string {
  const level = getCurrentLevel(xp);
  const idx = Math.min(level.level - 1, 5);
  return LEVEL_BORDERS[idx];
}

interface PlayerAvatarProps {
  style: AvatarStyle | string;
  xp: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
  fallbackInitials?: string;
}

const SIZE_CLASSES = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

export default function PlayerAvatar({
  style,
  xp,
  size = 'md',
  className = '',
  showBorder = true,
  fallbackInitials,
}: PlayerAvatarProps) {
  const hasStyle = style && AVATAR_STYLES.includes(style as AvatarStyle);

  if (!hasStyle && fallbackInitials) {
    return (
      <div className={`${SIZE_CLASSES[size]} flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold uppercase shrink-0 ${className}`}>
        {fallbackInitials}
      </div>
    );
  }

  const src = getAvatarSrc(style || 'student', xp);
  const border = showBorder ? getAvatarBorder(xp) : '';

  return (
    <div className={`${SIZE_CLASSES[size]} rounded-full overflow-hidden shrink-0 ${border} ${className}`}>
      <img
        src={src}
        alt="Player avatar"
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
