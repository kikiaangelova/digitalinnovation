## Startup Simulator BML Upgrade Plan

### Part 1: Database Schema
- Create `simulator_experiments` table with RLS
- No changes to existing `simulator_progress` table (use existing `decisions` JSONB to store cycle data)

### Part 2: Data Layer (`startup-simulator-data.ts`)
- Add MVP Decision System to Step 4 (Step 4A: validation approach + Step 4B: scoped product type)
- Add Cycle 2/3 decision generators based on weakest KPI
- Add experiment definitions with weighted random outcomes
- Add financial KPI calculations (revenue, costs, burn, break-even)

### Part 3: BML Summary Component
- New `BMLSummary.tsx` component showing BUILD | MEASURE | LEARN columns
- Strategic + Financial KPIs display
- Key insight auto-generated from lowest KPI
- "Start Cycle 2" / "Save and Finish" buttons

### Part 4: Experiment Lab Component
- New `ExperimentLab.tsx` with 4 experiment cards
- Weighted random result generation (60% signal / 25% inconclusive / 15% no traction)
- Result display with insight + remaining uncertainty + recommendation

### Part 5: StartupSimulator.tsx Refactor
- Add cycle state management (currentCycle, maxCycles=3)
- After Step 6 → show BML Summary instead of results
- BML Summary → optional Experiment Lab → Cycle 2 decisions
- Cycle 2/3: 3 targeted decisions based on weakest KPI
- After all cycles → Final Results screen

### Part 6: Final Results Screen Redesign
- Startup Scorecard with financial rating
- Lean Startup Journey timeline (all cycles)
- Hypotheses Report
- "What a real founder would have done differently"
- Save to My Startup button

### Implementation Order
1. Database migration (simulator_experiments)
2. Data layer updates (decisions, experiments, financial KPIs)
3. New components (BMLSummary, ExperimentLab)
4. StartupSimulator.tsx refactor (cycle logic + MVP step)
5. Final results screen redesign
