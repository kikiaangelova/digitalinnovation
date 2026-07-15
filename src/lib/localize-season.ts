import type { SimulationSeason, SimulationRound, DecisionTemplate, DecisionOption, ShockEvent } from '@/types/simulator';
import { SEASON_BG, ROUNDS_BG, DECISIONS_BG, SHOCKS_BG, OPTIONS_BG } from '@/data/seed-season-bg';

type Lang = 'en' | 'bg' | string;

/**
 * Return a copy of the season with all user-visible strings swapped to
 * Bulgarian when lang === 'bg'. Falls back to the original English text
 * whenever a translation is missing. Purely functional — never mutates
 * the source season. Only applies to the seed season id.
 */
export function localizeSeason(season: SimulationSeason, lang: Lang): SimulationSeason {
  if (lang !== 'bg') return season;
  if (season.id !== 'season-startup-lab') return season;

  const rounds: SimulationRound[] = season.rounds.map((round) => localizeRound(round));

  return {
    ...season,
    theme: SEASON_BG.theme || season.theme,
    description: SEASON_BG.description || season.description,
    rounds,
  };
}

function localizeRound(round: SimulationRound): SimulationRound {
  const rBg = ROUNDS_BG[round.id];
  const shockBg = SHOCKS_BG[round.id];

  const decisions: DecisionTemplate[] = round.decisions.map((d) => localizeDecision(d));

  let shock_event: ShockEvent | undefined = round.shock_event;
  if (round.shock_event && shockBg) {
    shock_event = {
      ...round.shock_event,
      title: shockBg.title || round.shock_event.title,
      description: shockBg.description || round.shock_event.description,
    };
  }

  return {
    ...round,
    narrative: rBg?.narrative || round.narrative,
    shock_event,
    decisions,
  };
}

function localizeDecision(d: DecisionTemplate): DecisionTemplate {
  const dBg = DECISIONS_BG[d.id];
  const options: DecisionOption[] = d.options.map((o) => localizeOption(o));
  return {
    ...d,
    title: dBg?.title || d.title,
    description: dBg?.description || d.description,
    options,
  };
}

function localizeOption(o: DecisionOption): DecisionOption {
  const oBg = OPTIONS_BG[o.id];
  return {
    ...o,
    label: oBg?.label || o.label,
    description: oBg?.description || o.description,
  };
}
