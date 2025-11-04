-- Fix SECURITY DEFINER views by recreating as SECURITY INVOKER
-- This ensures RLS policies are applied to all queries

-- Drop existing views
DROP VIEW IF EXISTS public.student_analytics;
DROP VIEW IF EXISTS public.team_performance_analytics;

-- Recreate student_analytics without SECURITY DEFINER
CREATE OR REPLACE VIEW public.student_analytics 
WITH (security_invoker = true) AS
SELECT 
  s.id,
  s.name,
  s.email,
  s.email_personal,
  s.role,
  s.status,
  s.observation_notes,
  s.metrics,
  s.srl_score,
  s.created_at,
  s.updated_at,
  tm.team_id,
  t.name as team_name
FROM public.students s
LEFT JOIN public.team_members tm ON s.id = tm.student_id
LEFT JOIN public.teams t ON tm.team_id = t.id
WHERE s.archived = false;

-- Recreate team_performance_analytics without SECURITY DEFINER  
CREATE OR REPLACE VIEW public.team_performance_analytics
WITH (security_invoker = true) AS
SELECT 
  t.id as team_id,
  t.name as team_name,
  t.leader_id,
  t.research_focus,
  t.project_description,
  t.created_at,
  t.updated_at,
  s_leader.name as leader_name,
  COUNT(tm.student_id) as team_size,
  array_agg(DISTINCT s.role) FILTER (WHERE s.role IS NOT NULL) as team_roles,
  AVG((s.metrics->>'collaboration')::numeric) as avg_collaboration,
  AVG((s.metrics->>'planning')::numeric) as avg_planning,
  AVG((s.metrics->>'adaptability')::numeric) as avg_adaptability,
  AVG((s.metrics->>'team_support')::numeric) as avg_team_support,
  AVG(s.srl_score) as avg_srl_score
FROM public.teams t
LEFT JOIN public.team_members tm ON t.id = tm.team_id
LEFT JOIN public.students s ON tm.student_id = s.id
LEFT JOIN public.students s_leader ON t.leader_id = s_leader.id
WHERE t.archived = false
GROUP BY t.id, t.name, t.leader_id, t.research_focus, t.project_description, t.created_at, t.updated_at, s_leader.name;

-- Add comprehensive input validation constraints
-- These work alongside client-side zod validation for defense-in-depth

-- Student name validation
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_name_check;
ALTER TABLE public.students ADD CONSTRAINT students_name_check 
  CHECK (length(trim(name)) >= 2 AND length(trim(name)) <= 100 AND trim(name) != '');

-- University email validation  
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_university_email_check;
ALTER TABLE public.students ADD CONSTRAINT students_university_email_check
  CHECK (university_email IS NULL OR (length(trim(university_email)) <= 255 AND trim(university_email) ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'));

-- Personal email validation
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_email_personal_check;
ALTER TABLE public.students ADD CONSTRAINT students_email_personal_check
  CHECK (email_personal IS NULL OR (length(trim(email_personal)) <= 255 AND trim(email_personal) ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'));

-- Team name validation
ALTER TABLE public.teams DROP CONSTRAINT IF EXISTS teams_name_check;
ALTER TABLE public.teams ADD CONSTRAINT teams_name_check
  CHECK (length(trim(name)) >= 2 AND length(trim(name)) <= 100 AND trim(name) != '');

-- Request message validation
ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_message_check;
ALTER TABLE public.requests ADD CONSTRAINT requests_message_check
  CHECK (message IS NULL OR length(trim(message)) <= 1000);

-- Remove overly permissive development policies from requests table
DROP POLICY IF EXISTS "Allow all for development" ON public.requests;
DROP POLICY IF EXISTS "Students manage own requests" ON public.requests;
DROP POLICY IF EXISTS "Admins manage all requests" ON public.requests;