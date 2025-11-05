
-- ============================================================================
-- SECURITY FIX: Restrict Public Access to Sensitive Student Data
-- ============================================================================
-- This migration addresses critical security findings:
-- 1. Remove public read access to students table
-- 2. Restrict metrics and action plans to admin-only access
-- 3. Replace weak "authenticated" checks with proper role-based access
-- 4. Add storage RLS policies for team logos (admin-only uploads)
-- 5. Secure student_analytics view
-- ============================================================================

-- STEP 1: Fix Students Table - Remove Public Access
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can read students" ON public.students;
DROP POLICY IF EXISTS "Anyone can read active students" ON public.students;

-- Students table should only be accessible by admins
-- (The "Admins can view students" policy already exists and is correct)

-- STEP 2: Fix Student Metrics Table - Admin Only Access
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can read student metrics" ON public.student_metrics;
DROP POLICY IF EXISTS "Authenticated users can insert student metrics" ON public.student_metrics;
DROP POLICY IF EXISTS "Authenticated users can update student metrics" ON public.student_metrics;

CREATE POLICY "Admins can view student metrics"
ON public.student_metrics FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert student metrics"
ON public.student_metrics FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update student metrics"
ON public.student_metrics FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- STEP 3: Fix Student Action Plans - Admin Only Access
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can read action plans" ON public.student_action_plans;
DROP POLICY IF EXISTS "Authenticated users can insert action plans" ON public.student_action_plans;
DROP POLICY IF EXISTS "Authenticated users can update action plans" ON public.student_action_plans;
DROP POLICY IF EXISTS "Authenticated users can delete action plans" ON public.student_action_plans;

CREATE POLICY "Admins can view action plans"
ON public.student_action_plans FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert action plans"
ON public.student_action_plans FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update action plans"
ON public.student_action_plans FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete action plans"
ON public.student_action_plans FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- STEP 4: Fix Metric History - Admin Only Access
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can read metric history" ON public.metric_history;
DROP POLICY IF EXISTS "Authenticated users can insert metric history" ON public.metric_history;

CREATE POLICY "Admins can view metric history"
ON public.metric_history FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Metric history should primarily be inserted by triggers, but allow admin insert
CREATE POLICY "Admins can insert metric history"
ON public.metric_history FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- STEP 5: Fix Team Metrics - Admin Only Access
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can read team metrics" ON public.team_metrics;
DROP POLICY IF EXISTS "Authenticated users can insert team metrics" ON public.team_metrics;
DROP POLICY IF EXISTS "Authenticated users can update team metrics" ON public.team_metrics;

CREATE POLICY "Admins can view team metrics"
ON public.team_metrics FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert team metrics"
ON public.team_metrics FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update team metrics"
ON public.team_metrics FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- STEP 6: Fix Student Reflections - Admin Only Access
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can read student reflections" ON public.student_reflections;
DROP POLICY IF EXISTS "Authenticated users can insert reflections" ON public.student_reflections;

CREATE POLICY "Admins can view student reflections"
ON public.student_reflections FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert student reflections"
ON public.student_reflections FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- STEP 7: Recreate student_analytics View as SECURITY INVOKER
-- ============================================================================
DROP VIEW IF EXISTS public.student_analytics;

CREATE VIEW public.student_analytics
WITH (security_invoker = true)
AS
SELECT 
  s.id,
  s.name,
  s.email,
  s.email_personal,
  s.status,
  s.role,
  s.metrics,
  s.observation_notes,
  t.name AS team_name,
  t.id AS team_id,
  (
    COALESCE((s.metrics->>'collaboration')::numeric, 0) * 0.3 +
    COALESCE((s.metrics->>'planning')::numeric, 0) * 0.3 +
    COALESCE((s.metrics->>'adaptability')::numeric, 0) * 0.2 +
    COALESCE((s.metrics->>'team_support')::numeric, 0) * 0.2
  )::numeric(5,1) AS srl_score,
  s.created_at,
  s.updated_at
FROM public.students s
LEFT JOIN public.team_members tm ON s.id = tm.student_id
LEFT JOIN public.teams t ON tm.team_id = t.id
WHERE s.archived = false;

-- STEP 8: Fix Storage RLS Policies for Team Logos - Admin Only Uploads
-- ============================================================================
-- Drop existing weak policies
DROP POLICY IF EXISTS "Authenticated users can upload team logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their team logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their team logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view team logos" ON storage.objects;

-- Only admins can upload team logos
CREATE POLICY "Admins can upload team logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'team-logos' AND
  public.has_role(auth.uid(), 'admin')
);

-- Only admins can update team logos
CREATE POLICY "Admins can update team logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'team-logos' AND
  public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'team-logos' AND
  public.has_role(auth.uid(), 'admin')
);

-- Only admins can delete team logos
CREATE POLICY "Admins can delete team logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'team-logos' AND
  public.has_role(auth.uid(), 'admin')
);

-- Anyone can view team logos (public bucket for display)
CREATE POLICY "Anyone can view team logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-logos');

-- ============================================================================
-- Migration Complete
-- ============================================================================
-- All sensitive student data is now restricted to admin-only access
-- Storage uploads are restricted to admins
-- Views use security_invoker to respect RLS policies
-- ============================================================================
