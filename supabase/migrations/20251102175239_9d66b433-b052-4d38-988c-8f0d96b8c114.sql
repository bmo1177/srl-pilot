-- Security Migration: Enable RLS and Fix Critical Vulnerabilities
-- This migration addresses critical security findings:
-- 1. Enable RLS on students, teams, and team_members tables
-- 2. Remove overly permissive development policies
-- 3. Add proper admin-only access control

-- ============================================================================
-- STEP 1: Enable RLS on Critical Tables
-- ============================================================================

-- Enable RLS on students table (contains sensitive PII)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Enable RLS on teams table
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Enable RLS on team_members table
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: Remove Overly Permissive Policies
-- ============================================================================

-- Remove the dangerous "Allow all for development" policy from requests table
DROP POLICY IF EXISTS "Allow all for development" ON public.requests;

-- Remove any conflicting old policies on students, teams, team_members
DROP POLICY IF EXISTS "Students are viewable by everyone" ON public.students;
DROP POLICY IF EXISTS "Students can only be inserted by admins" ON public.students;
DROP POLICY IF EXISTS "Students can only be updated by admins" ON public.students;
DROP POLICY IF EXISTS "Students can only be deleted by admins" ON public.students;

-- ============================================================================
-- STEP 3: Create Secure Admin-Only Policies for Students Table
-- ============================================================================

-- Admins can view all students
CREATE POLICY "Admins can view students"
ON public.students
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert new students
CREATE POLICY "Admins can insert students"
ON public.students
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update students
CREATE POLICY "Admins can update students"
ON public.students
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete students
CREATE POLICY "Admins can delete students"
ON public.students
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- STEP 4: Create Secure Admin-Only Policies for Teams Table
-- ============================================================================

-- Drop existing conflicting policies if any
DROP POLICY IF EXISTS "Admins can manage teams" ON public.teams;

-- Admins can view all teams
CREATE POLICY "Admins can view teams"
ON public.teams
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert teams
CREATE POLICY "Admins can insert teams"
ON public.teams
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update teams
CREATE POLICY "Admins can update teams"
ON public.teams
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete teams
CREATE POLICY "Admins can delete teams"
ON public.teams
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- STEP 5: Create Secure Admin-Only Policies for Team Members Table
-- ============================================================================

-- Drop existing conflicting policies if any
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;

-- Admins can view all team members
CREATE POLICY "Admins can view team_members"
ON public.team_members
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert team members
CREATE POLICY "Admins can insert team_members"
ON public.team_members
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update team members
CREATE POLICY "Admins can update team_members"
ON public.team_members
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete team members
CREATE POLICY "Admins can delete team_members"
ON public.team_members
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- STEP 6: Secure Requests Table Policies
-- ============================================================================

-- Keep only necessary user-specific and admin policies for requests
-- Users can view their own requests
-- (Policy already exists: "Users can view their own requests")

-- Add admin policy to view all requests
CREATE POLICY "Admins can view all requests"
ON public.requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policy to manage all requests
CREATE POLICY "Admins can update all requests"
ON public.requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete all requests"
ON public.requests
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));