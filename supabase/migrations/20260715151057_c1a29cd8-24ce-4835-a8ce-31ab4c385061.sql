-- 1. classrooms: require teacher_verified or admin to own a classroom
DROP POLICY IF EXISTS "Teacher manages own classrooms" ON public.classrooms;
CREATE POLICY "Teacher manages own classrooms"
  ON public.classrooms
  FOR ALL
  TO authenticated
  USING (
    teacher_id = auth.uid()
    AND (
      public.has_role(auth.uid(), 'teacher_verified'::app_role)
      OR public.has_role(auth.uid(), 'admin'::app_role)
    )
  )
  WITH CHECK (
    teacher_id = auth.uid()
    AND (
      public.has_role(auth.uid(), 'teacher_verified'::app_role)
      OR public.has_role(auth.uid(), 'admin'::app_role)
    )
  );

-- 2. classroom_assignments: require ownership of the target classroom
DROP POLICY IF EXISTS "Teacher manages assignments" ON public.classroom_assignments;
CREATE POLICY "Teacher manages assignments"
  ON public.classroom_assignments
  FOR ALL
  TO authenticated
  USING (
    assigned_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.classrooms c
      WHERE c.id = classroom_assignments.classroom_id
        AND c.teacher_id = auth.uid()
    )
    AND (
      public.has_role(auth.uid(), 'teacher_verified'::app_role)
      OR public.has_role(auth.uid(), 'admin'::app_role)
    )
  )
  WITH CHECK (
    assigned_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.classrooms c
      WHERE c.id = classroom_assignments.classroom_id
        AND c.teacher_id = auth.uid()
    )
    AND (
      public.has_role(auth.uid(), 'teacher_verified'::app_role)
      OR public.has_role(auth.uid(), 'admin'::app_role)
    )
  );

-- 3. peer_reviews: require a matching pending assignment
DROP POLICY IF EXISTS "Users create reviews" ON public.peer_reviews;
CREATE POLICY "Users create reviews"
  ON public.peer_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = reviewer_user_id
    AND EXISTS (
      SELECT 1 FROM public.peer_review_assignments pra
      WHERE pra.reviewer_user_id = peer_reviews.reviewer_user_id
        AND pra.reviewee_user_id = peer_reviews.reviewee_user_id
        AND pra.target_id = peer_reviews.target_id
        AND (pra.submission_id IS NOT DISTINCT FROM peer_reviews.submission_id)
        AND COALESCE(pra.status, 'pending') <> 'completed'
    )
  );

-- 4. team_members: remove direct-insert policy; force join through RPC
DROP POLICY IF EXISTS "Users join teams" ON public.team_members;

CREATE OR REPLACE FUNCTION public.join_team_with_code(_join_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_team_id uuid;
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated' USING ERRCODE = '42501';
  END IF;

  SELECT id INTO v_team_id
  FROM public.teams
  WHERE join_code = _join_code
  LIMIT 1;

  IF v_team_id IS NULL THEN
    RAISE EXCEPTION 'invalid join code' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.team_members (team_id, user_id)
  VALUES (v_team_id, v_uid)
  ON CONFLICT DO NOTHING;

  RETURN v_team_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.join_team_with_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.join_team_with_code(text) TO authenticated;