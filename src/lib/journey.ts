export type StepStatus = 'completed' | 'in_progress' | 'not_started';

export interface JourneyStatusProps {
  casesCompleted: number;
  startupSections: Record<string, boolean>;
  startupSubmitted: boolean;
  simWeek: number;
  simComplete: boolean;
}

export function deriveJourneyStatuses(props: JourneyStatusProps): StepStatus[] {
  const { casesCompleted, startupSections, startupSubmitted, simWeek, simComplete } = props;
  const s = (key: string) => !!startupSections[key];

  return [
    // Step 1: Discover — completed if ≥1 case done
    casesCompleted >= 1 ? 'completed' : 'not_started',
    // Step 2: Analyze — completed if ≥2 cases done
    casesCompleted >= 2 ? 'completed' : casesCompleted >= 1 ? 'in_progress' : 'not_started',
    // Step 3: Design — problem + value proposition
    s('problem') && s('value_proposition') ? 'completed' : (s('problem') || s('customer') || s('value_proposition')) ? 'in_progress' : 'not_started',
    // Step 4: Build — product + business model + growth
    s('digital_product') && s('business_model') && s('growth_strategy') ? 'completed' : (s('digital_product') || s('business_model') || s('growth_strategy')) ? 'in_progress' : 'not_started',
    // Step 5: Simulator
    simComplete ? 'completed' : simWeek > 1 ? 'in_progress' : 'not_started',
    // Step 6: Pitch
    startupSubmitted ? 'completed' : s('final_pitch') ? 'in_progress' : 'not_started',
  ];
}
