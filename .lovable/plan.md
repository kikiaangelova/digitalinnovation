

## Plan: Integrate Theory Modules with Case Studies and Simulator

### Current State

The platform already has:
- **5 learning modules** (Network Effects, Platform Business Models, CAC, Product-Market Fit, Digital Ecosystems) with theory, quiz, analytical, and application phases
- **8 case studies** in the database (Uber, FinTech, AI Ethics, etc.)
- **6-step startup simulator** (Industry, Problem, Competitors, Product, Business Model, Marketing)
- **XP system** fully operational via `award-xp` edge function
- **No connection** between theory modules and case studies or simulator

### What Will Change

#### 1. Add Theory-to-Case Mapping in Learning Module Data

Extend `LearningModule` interface with `related_case_topic` and `related_sim_concepts` fields. Add a mapping so each module links to a relevant case study topic and simulator concepts.

**Mapping:**
- Network Effects → Platform Economy case
- Platform Business Models → Platform Economy / Spotify case
- CAC → FinTech Disruption case
- Product-Market Fit → EdTech / AI Startup case
- Digital Ecosystems → AI Smart Cities case

#### 2. Add "Apply in a Case Study" CTA to Theory Module Results

In `LearningModulePlayer.tsx`, after the results phase, add a transition card:

> "You just learned about [concept]. Now analyze how [company] applied this in a real case."
> **[Start Case Study]** button

This queries `case_studies` by topic keyword to find matching cases and links to `/case/:id/preview`.

#### 3. Add "Test in Simulator" CTA to Theory Module Results

Below the case CTA, add a second transition:

> "Apply [concept] in the startup simulator to test your strategy."
> **[Open Simulator]** button linking to `/simulator`

#### 4. Add Theory Concept Tags to Simulator Steps

In `startup-simulator-data.ts`, add an optional `theoryConceptEn`/`theoryConceptBg` field to `SimWeek`. For relevant steps, show a small badge/tooltip referencing the theory concept (e.g., "Related: Customer Acquisition Cost"). This is UI-only, no logic change needed.

Display these in `StartupSimulator.tsx` as a small info badge above each decision.

#### 5. Add XP for Theory Module Completion

The existing XP system doesn't award XP for theory modules. Add two new actions to `award-xp` edge function and `src/lib/xp.ts`:

- `theory_complete` → +10 XP (one-time per module, context_id = module slug)
- `theory_quiz_pass` → +15 XP (one-time per module, context_id = module slug, only if quiz score >= 60%)

Call `awardXp()` in `LearningModulePlayer.tsx` `handleSubmitAll` after saving.

#### 6. Add "Recommended Theory" Banner on Case Preview

In `CasePreview.tsx`, show a banner if there's a related theory module the student hasn't completed:

> "Prepare for this case: Learn about [concept] first."
> **[Study Theory]** button → `/learn/:slug`

This requires a reverse mapping from case topic to module slug and checking `learning_module_responses` for completion.

### Files to Modify

| File | Change |
|------|--------|
| `src/data/learning-modules.ts` | Add `related_case_topic`, `related_sim_steps`, `case_transition_en/bg`, `sim_transition_en/bg` fields |
| `src/pages/LearningModulePlayer.tsx` | Add case/simulator CTAs in results phase, add XP award calls |
| `src/lib/xp.ts` | Add `theory_complete` and `theory_quiz_pass` action types |
| `supabase/functions/award-xp/index.ts` | Add `theory_complete` (10 XP) and `theory_quiz_pass` (15 XP) to config |
| `src/pages/CasePreview.tsx` | Add "Recommended Theory" banner with module link |
| `src/data/startup-simulator-data.ts` | Add `theoryConceptEn`/`theoryConceptBg` to relevant `SimWeek` entries |
| `src/pages/StartupSimulator.tsx` | Display theory concept badge on simulator steps |

### Database Changes

**Migration**: Add `theory_complete` and `theory_quiz_pass` to the `award-xp` edge function config (no schema change needed -- these are just new action strings in the existing `xp_ledger` table).

### XP Summary After Changes

| Action | XP |
|--------|-----|
| Theory module completed | +10 |
| Theory quiz passed (>=60%) | +15 |
| Case open | +5 |
| Case question answer | +10 |
| Case complete | +100 |
| Case high quality | +30 |
| Simulator scenario complete | +50 |
| Simulator high performance | +50 |
| Startup sections | +40-50 each |
| Final pitch | +120 |
| Dictionary view/quiz | +2/+10 |

