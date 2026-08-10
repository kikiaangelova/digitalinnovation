# Sprint 1 — Teacher MVP vertical slice (Digital Innovation pilot)

Goal: one coherent flow in the preview Teacher Workspace (`/teacher-new`):
teacher → classroom → module assignment → student work → evidence → feedback → progress.

## Scope
- Subject: `digital-innovation`. Pilot module: `network-effects`.
- Code + tests only. No deploy, no SQL writes, no migrations, no production data changes.

## Work items
1. **Classroom selection & scoping** — load all active classrooms owned by the teacher
   (replaces the single-classroom `.maybeSingle()` assumption), add an explicit selector,
   and scope roster, assignments, responses and feedback to the selected classroom.
2. **Safe module assignment** — Assignments tab with a form that only lists modules that are
   registered in the database, have rich static content and match the classroom subject.
   Submission stays disabled until a valid target is picked. Bilingual validation states.
3. **Student player integrity** — the module player no longer inserts a missing
   `learning_modules` row from a student session; an honest unavailable state is shown instead.
4. **Progress & evidence** — status derived from `learning_module_responses`:
   no row = not started, row without `completed_at` = in progress, `completed_at` = completed.
   Only completed rows count. Teacher detail shows quiz score, analytical and application answers.
   XP is never used as status or grade.
5. **Teacher feedback** — create/update through the existing `teacher_feedback` model with
   `target_type='learning_module_response'`. Unavailable (with explanation) when no response exists.
6. **Tests** — validation, assignable filtering, classroom scoping, status mapping,
   completed-only counting, evidence rendering, no catalogue insertion.

## Technical notes
- New pure helpers in `src/lib/teacher-assignments.ts` keep the rules unit-testable.
- New hooks: `useTeacherClassrooms`, `useModuleResponses`; `useClassroomStudents` accepts a classroom id.
- Existing RLS remains the security boundary; client filters are added for clarity.
