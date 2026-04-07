import { useProgress } from '@/context/ProgressContext';

/**
 * Lightweight hook that returns the 6-stage journey completion percentage.
 * Now powered by the unified ProgressContext — no duplicate queries.
 */
export function useJourneyProgress() {
  const { journeyPct } = useProgress();
  return journeyPct;
}
