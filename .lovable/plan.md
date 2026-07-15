# 2026–27 Curriculum Upgrade — Phased Build Plan

The full audit spans content, gamification, assessments, versioning, and school-config UI. Shipping all of it in one turn would touch ~30 files, the DB schema, and every learner surface — high risk of regressions to XP, RLS, and existing student data. I'll build it in phases behind feature flags, one phase per turn, so you can review before each step.

---

## Phase 1 — Foundations (this turn)

Ship the plumbing every later phase depends on. Content-only + one flag. No DB changes, no gamification changes yet.

1. **Curriculum manifest** — new `src/data/curriculum-2026.ts` describing the 12 pathways (Core + Business/Marketing/Data-AI/Human tracks), each with `id`, `level` (foundation/intermediate/advanced), and a `references[]` array pointing to existing modules/stages/dictionary categories/cases. Zero content is deleted or moved.
2. **Preservation mapping** — `src/data/curriculum-mapping.ts` marks every existing module and stage with class (Keep/Update/Expand/Merge/Optional) so later phases can act on it programmatically.
3. **TEACR loop scaffold** — reusable component `src/components/learning/DecisionConsequenceReflection.tsx` (Decision → Consequence → Reflection → Improvement) so any module can adopt the loop without rewriting.
4. **Pathway index page** — `/pathways` route rendering the 12 pathways with counts pulled from the manifest. Gated by `curriculum-v2026` flag.
5. **Feature flag** — add `curriculum-v2026` to `src/lib/featureFlags.ts`.

Deliverables in Phase 1 don't affect any signed-out visitor, existing dashboards, XP, or DB.

---

## Phase 2 — Content Expansions (next turn)

- Expand Marketing Fundamentals → sub-topics (Positioning, SEO, Content, Paid, Analytics).
- Expand AI dictionary category → Foundations / GenAI / Prompting / Ethics / Agents.
- Add Finance & Unit Economics module + dictionary category.
- Merge Ops + Supply Chain modules into "Operations & Systems".

## Phase 3 — Assessment & Iteration Loop

- Wire the TEACR component into all 6 stages and 10 modules.
- Add "Iterate with feedback" step after graded work.

## Phase 4 — Gamification Rebalance

- Replace attendance badges (`comeback_kid`, `perfect_week`) with learning-quality badges (`iteration_master`, `evidence_citer`, `unit_economist`, `ai_ethicist`).
- Add server-side XP actions: `reflection_deep`, `iteration_saved`, `peer_helpful`. Migration to `award-xp` edge function.

## Phase 5 — School & Teacher Curriculum Builder

- DB: `school_pathways`, `class_programs` tables + RLS + GRANTs.
- Teacher UI to activate pathways per class.

## Phase 6 — Academic-Year Versioning

- Version field on curriculum manifest, snapshot mechanism, in-flight student cohorts pinned to 2025-26.

---

## Confirm before I proceed

I'll start with **Phase 1 only** on approval. If instead you want a specific phase first (e.g. jump straight to Marketing expansion or Gamification rebalance), say which.
