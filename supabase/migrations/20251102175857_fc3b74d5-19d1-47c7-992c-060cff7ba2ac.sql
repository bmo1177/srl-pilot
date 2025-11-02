-- Security Fix: Remove SECURITY DEFINER from Views
-- This migration addresses the remaining security linter errors about SECURITY DEFINER views

-- ============================================================================
-- Fix student_analytics View
-- ============================================================================

-- Recreate the view without SECURITY DEFINER (default is SECURITY INVOKER)
DROP VIEW IF EXISTS public.student_analytics;

CREATE VIEW public.student_analytics AS
SELECT 
  s.id,
  s.name,
  s.university_email AS email,
  s.email_personal,
  s.status,
  s.role,
  s.metrics,
  s.observation_notes,
  t.name AS team_name,
  t.id AS team_id,
  (
    COALESCE((s.metrics->>'collaboration')::numeric,0)*0.3
  + COALESCE((s.metrics->>'planning')::numeric,0)*0.3
  + COALESCE((s.metrics->>'adaptability')::numeric,0)*0.2
  + COALESCE((s.metrics->>'team_support')::numeric,0)*0.2
  )::numeric(5,1) AS srl_score,
  s.created_at,
  s.updated_at
FROM public.students s
LEFT JOIN public.team_members tm ON s.id = tm.student_id
LEFT JOIN public.teams t ON tm.team_id = t.id
WHERE s.archived = false;

-- ============================================================================
-- Fix team_performance_analytics View
-- ============================================================================

-- Recreate the view without SECURITY DEFINER (default is SECURITY INVOKER)
DROP VIEW IF EXISTS public.team_performance_analytics;

CREATE VIEW public.team_performance_analytics AS
SELECT 
  t.id AS team_id,
  t.name AS team_name,
  t.project_description,
  t.research_focus,
  t.leader_id,
  s_leader.name AS leader_name,
  t.created_at,
  t.updated_at,
  COUNT(DISTINCT tm.student_id) AS team_size,
  ARRAY_AGG(DISTINCT tm.role) FILTER (WHERE tm.role IS NOT NULL) AS team_roles,
  AVG((s.metrics->>'collaboration')::numeric) AS avg_collaboration,
  AVG((s.metrics->>'planning')::numeric) AS avg_planning,
  AVG((s.metrics->>'adaptability')::numeric) AS avg_adaptability,
  AVG((s.metrics->>'team_support')::numeric) AS avg_team_support,
  AVG(
    (COALESCE((s.metrics->>'collaboration')::numeric,0)*0.3 +
     COALESCE((s.metrics->>'planning')::numeric,0)*0.3 +
     COALESCE((s.metrics->>'adaptability')::numeric,0)*0.2 +
     COALESCE((s.metrics->>'team_support')::numeric,0)*0.2)
  )::numeric(5,1) AS avg_srl_score
FROM public.teams t
LEFT JOIN public.team_members tm ON t.id = tm.team_id
LEFT JOIN public.students s ON tm.student_id = s.id
LEFT JOIN public.students s_leader ON t.leader_id = s_leader.id
WHERE t.archived = false
GROUP BY 
  t.id, 
  t.name, 
  t.project_description, 
  t.research_focus, 
  t.leader_id, 
  s_leader.name,
  t.created_at,
  t.updated_at;

-- Note: Views now use SECURITY INVOKER (default), which enforces RLS policies
-- of the querying user rather than the view creator.