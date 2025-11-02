-- Security Fix: Enable RLS on Backup Tables and Add search_path to Functions
-- This migration addresses remaining security linter warnings

-- ============================================================================
-- STEP 1: Enable RLS on All Backup Tables
-- ============================================================================

-- Enable RLS on backup tables (they contain historical sensitive data)
ALTER TABLE IF EXISTS public.students_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.requests_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.team_members_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.teams_backup ENABLE ROW LEVEL SECURITY;

-- Add admin-only policies for backup tables
DROP POLICY IF EXISTS "Admins can view students_backup" ON public.students_backup;
CREATE POLICY "Admins can view students_backup"
ON public.students_backup
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view requests_backup" ON public.requests_backup;
CREATE POLICY "Admins can view requests_backup"
ON public.requests_backup
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view team_members_backup" ON public.team_members_backup;
CREATE POLICY "Admins can view team_members_backup"
ON public.team_members_backup
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view teams_backup" ON public.teams_backup;
CREATE POLICY "Admins can view teams_backup"
ON public.teams_backup
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- STEP 2: Fix search_path on Functions
-- ============================================================================

-- Fix update_student_status_on_team_change function
CREATE OR REPLACE FUNCTION public.update_student_status_on_team_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Student joined a team
    UPDATE public.students 
    SET status = 'team_assigned', updated_at = now()
    WHERE id = NEW.student_id AND status != 'inactive' AND status != 'graduated';
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Student left a team
    -- Check if student is in any other team
    IF NOT EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE student_id = OLD.student_id AND id != OLD.id
    ) THEN
      UPDATE public.students 
      SET status = 'active', updated_at = now()
      WHERE id = OLD.student_id AND status = 'team_assigned';
    END IF;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$function$;

-- Fix update_srl_score function
CREATE OR REPLACE FUNCTION public.update_srl_score()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.srl_score := ROUND((
    (COALESCE((NEW.metrics->>'collaboration')::numeric,0) * 0.3) +
    (COALESCE((NEW.metrics->>'planning')::numeric,0) * 0.3) +
    (COALESCE((NEW.metrics->>'adaptability')::numeric,0) * 0.2) +
    (COALESCE((NEW.metrics->>'team_support')::numeric,0) * 0.2)
  )::numeric,1);
  RETURN NEW;
END;
$function$;

-- Fix cleanup_students_after_team_delete function
CREATE OR REPLACE FUNCTION public.cleanup_students_after_team_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- When a team is deleted, reset all students who belonged to it
  UPDATE public.students
  SET 
    status = 'active',
    role = 'free'
  WHERE id IN (
    SELECT student_id FROM public.team_members WHERE team_id = OLD.id
  );
  RETURN OLD;
END;
$function$;

-- Fix is_admin(uuid) function (not the one without params)
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$ 
BEGIN 
  RETURN user_id = '924eef10-71ce-4eee-943f-dcad85556f08'; 
END; 
$function$;

-- Fix mark_duplicate_students function
CREATE OR REPLACE FUNCTION public.mark_duplicate_students()
RETURNS TABLE(id uuid, name text, email text, duplicate_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  WITH duplicates AS (
    SELECT 
      lower(trim(s.name)) as normalized_name,
      COUNT(*) as count
    FROM 
      public.students s
    WHERE 
      s.archived = false
    GROUP BY 
      lower(trim(s.name))
    HAVING 
      COUNT(*) > 1
  )
  SELECT 
    s.id,
    s.name,
    s.university_email,
    d.count as duplicate_count
  FROM 
    public.students s
  JOIN 
    duplicates d ON lower(trim(s.name)) = d.normalized_name
  ORDER BY 
    d.normalized_name, s.created_at DESC;
END;
$function$;

-- Fix delete_duplicate_students function
CREATE OR REPLACE FUNCTION public.delete_duplicate_students()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  deleted_count INTEGER := 0;
  current_name TEXT := '';
  keep_id UUID;
  rec RECORD;
BEGIN
  FOR rec IN (
    SELECT * FROM mark_duplicate_students() ORDER BY name, created_at DESC
  )
  LOOP
    IF current_name <> rec.name THEN
      current_name := rec.name;
      keep_id := rec.id;
    ELSE
      -- Archive the duplicate instead of hard delete
      UPDATE public.students 
      SET archived = true 
      WHERE id = rec.id;
      
      deleted_count := deleted_count + 1;
    END IF;
  END LOOP;
  
  RETURN deleted_count;
END;
$function$;

-- Fix record_weekly_metrics_snapshot function
CREATE OR REPLACE FUNCTION public.record_weekly_metrics_snapshot(p_student_id uuid, p_week_number integer, p_academic_year text DEFAULT (EXTRACT(year FROM CURRENT_DATE))::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  student_record RECORD;
  team_record RECORD;
BEGIN
  -- Get current student data
  SELECT s.*, tm.team_id INTO student_record
  FROM public.students s
  LEFT JOIN public.team_members tm ON s.id = tm.student_id
  WHERE s.id = p_student_id;
  
  IF student_record.id IS NULL THEN
    RAISE EXCEPTION 'Student not found: %', p_student_id;
  END IF;
  
  -- Insert or update metrics snapshot
  INSERT INTO public.student_metrics_snapshots (
    student_id, week_number, academic_year, metrics, team_id, role, notes
  ) VALUES (
    p_student_id, p_week_number, p_academic_year, 
    student_record.metrics, student_record.team_id, student_record.role,
    student_record.observation_notes
  )
  ON CONFLICT (student_id, week_number, academic_year) 
  DO UPDATE SET
    metrics = EXCLUDED.metrics,
    team_id = EXCLUDED.team_id,
    role = EXCLUDED.role,
    notes = EXCLUDED.notes,
    created_at = now();
    
  -- Update metrics history in students table
  UPDATE public.students 
  SET metrics_history = array_append(
    COALESCE(metrics_history, ARRAY[]::jsonb[]), 
    jsonb_build_object(
      'week', p_week_number,
      'year', p_academic_year,
      'metrics', student_record.metrics,
      'timestamp', now()
    )
  )
  WHERE id = p_student_id;
END;
$function$;