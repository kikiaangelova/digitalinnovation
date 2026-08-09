-- 1. peer_review_assignments: reviewers may only update their own row, and only the status field
DROP POLICY IF EXISTS "Users update own assignments" ON public.peer_review_assignments;

CREATE POLICY "Reviewers update own assignment status"
ON public.peer_review_assignments
FOR UPDATE
TO authenticated
USING (auth.uid() = reviewer_user_id)
WITH CHECK (
  auth.uid() = reviewer_user_id
  AND status IN ('pending', 'completed')
);

CREATE OR REPLACE FUNCTION public.protect_peer_review_assignment_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  -- Non-admins may only change status and completed_at
  NEW.reviewer_user_id := OLD.reviewer_user_id;
  NEW.reviewee_user_id := OLD.reviewee_user_id;
  NEW.target_type := OLD.target_type;
  NEW.target_id := OLD.target_id;
  NEW.submission_id := OLD.submission_id;
  NEW.assigned_at := OLD.assigned_at;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_peer_review_assignment_fields ON public.peer_review_assignments;
CREATE TRIGGER trg_protect_peer_review_assignment_fields
BEFORE UPDATE ON public.peer_review_assignments
FOR EACH ROW EXECUTE FUNCTION public.protect_peer_review_assignment_fields();

-- 2. teams: only creator, team lead/owner, or admin may update the team
DROP POLICY IF EXISTS "Members update team" ON public.teams;

CREATE POLICY "Team owners update team"
ON public.teams
FOR UPDATE
TO authenticated
USING (
  created_by = auth.uid()
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = teams.id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('lead', 'owner')
  )
)
WITH CHECK (
  created_by = auth.uid()
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = teams.id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('lead', 'owner')
  )
);