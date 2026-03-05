
-- Add missing unique constraints (skip existing ones)

-- responses: unique on (submission_id, question_id)
DO $$ BEGIN
  ALTER TABLE public.responses
    ADD CONSTRAINT responses_submission_question_unique UNIQUE (submission_id, question_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- course_progress: unique on (user_id, module, module_id)
DO $$ BEGIN
  ALTER TABLE public.course_progress
    ADD CONSTRAINT course_progress_user_module_unique UNIQUE (user_id, module, module_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Enable realtime for case_sessions
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.case_sessions;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
