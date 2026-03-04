
ALTER TABLE public.case_studies
  ADD COLUMN IF NOT EXISTS title_bg text,
  ADD COLUMN IF NOT EXISTS description_bg text,
  ADD COLUMN IF NOT EXISTS topic_bg text,
  ADD COLUMN IF NOT EXISTS outcomes_bg text[];

ALTER TABLE public.case_steps
  ADD COLUMN IF NOT EXISTS title_bg text,
  ADD COLUMN IF NOT EXISTS narrative_bg text,
  ADD COLUMN IF NOT EXISTS exhibit_text_bg text;

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS prompt_bg text;
