# Startup Journey Sim

Build an add-on mode inside the existing DigiInnov Case Lab platform: an 8-week Digital Innovation Simulator where student teams run a virtual startup and decisions affect outcomes week to week.

Name: DigiInnov Simulator

Roles:
- Student (team member)
- Instructor/Admin

High-level concept:
Teams manage a simulated startup over 8 weekly rounds. Each round has a narrative update, a metrics dashboard, a set of decisions, and consequences computed by a simulation engine. Students submit decisions with justifications; the system updates company state and generates feedback and a debrief.

Core features:
1) Team & cohort management
- Teams belong to a cohort/class.
- Team roles: Team Lead (can submit), Members (collaborate), optional Instructor assigned.
- Invite/join team with code.

2) Simulator setup (Admin)
- Create a SimulationSeason with: theme (e.g., Circular Commerce), start date, number of weeks (default 8), difficulty, and parameter set.
- Assign season to cohort and auto-create weekly rounds.
- Configure scoring weights (strategy, evidence, experimentation, coherence, reflection).

3) Weekly round experience (Student)
- Round page shows:
  - Narrative briefing (what changed in market)
  - KPIs dashboard (users, active users, churn, CAC, conversion, ARPU, revenue, burn, runway, NPS, quality/tech debt, compliance risk)
  - Decision pack (3–6 decisions)
  - Submission form: choose options + write rationale; optional upload (slides/notes)
  - Reflection prompts (what did you learn? what will you change?)
- Autosave; submit locks choices.
- After submission: immediate outcome report + instructor comments.

4) Decision types and examples
- Strategy: target segment, positioning, partnerships
- Product: MVP scope, roadmap, UX prioritization
- Growth: channel bet, pricing model, funnel improvements
- Data/AI: data collection choices, AI feature timing, governance
- Ops/Risk: hiring, incident response, compliance
Question formats: multiple choice, ranking, numeric allocation (budget split), short/long answer.

5) Simulation engine
- Maintain a CompanyState per team per round.
- CompanyState variables:
  - users_total, active_users, churn_rate
  - conversion_rate, CAC
  - ARPU, revenue
  - burn_rate, runway_months
  - NPS
  - product_quality, tech_debt
  - brand_trust, compliance_risk
- Each round has DecisionRules that map options to deltas (some conditional).
- Include small randomness/volatility parameter.
- Ensure constraints: runway cannot go below 0; rates clamped to sensible ranges.
- Generate an OutcomeReport: KPI changes, explanation, and risks created.

6) Scoring & rubrics
- Score components:
  - Decision quality (rubric per decision)
  - Evidence use (did they cite KPI/exhibit)
  - Experiment discipline (hypothesis/test/learn)
  - Strategic coherence (consistency with prior choices)
  - Reflection quality
- Keep a SeasonScoreboard with opt-in anonymized leaderboard.

7) Instructor/Admin views
- Season dashboard: teams, round completion, average score, common choices.
- Team view: timeline of decisions, KPI charts, rubric feedback.
- Ability to leave comments and override scores.
- Export results to CSV.

8) Seed content
Create one default season: "Circular Commerce Marketplace" with 8 rounds.
Each round:
- 1 narrative
- 1 KPI baseline
- 4 decisions (mix of types)
- rules that affect KPIs
Include 2 shock events (e.g., competitor copy, privacy incident).

Pages to add:
- /simulator (student landing)
- /simulator/season/:id
- /simulator/season/:id/round/:n
- /admin/simulator (admin management)
- /admin/simulator/season/:id (analytics)

Design:
- Same clean academic style as the main app.
- KPI cards + simple charts.
- Responsive.

Database entities (suggested):
- SimulationSeason(id, cohort_id, theme, start_date, weeks, difficulty, volatility, created_by)
- SimulationRound(id, season_id, week_number, narrative, shock_event_json)
- Team(id, cohort_id, name, join_code)
- TeamMember(id, team_id, user_id, role)
- CompanyState(id, team_id, round_id, kpis_json)
- DecisionTemplate(id, round_id, title, type, options_json, rubric_json, rules_json)
- DecisionSubmission(id, team_id, round_id, submitted_by, submitted_at, rationale_text, attachments)
- DecisionAnswer(id, submission_id, decision_template_id, answer_json, score, feedback)
- OutcomeReport(id, team_id, round_id, report_json)

Constraints:
- Students can only view outcomes after submitting for that round.
- Admin-only routes protected.
- Autosave drafts.

Deliverable:
A working simulator mode integrated into the platform with seeded default season and a basic but functional simulation engine updating KPIs week-to-week.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://digitalinnovation.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e4f5a6ae-9646-4a99-8c7c-9d4396e161cf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
