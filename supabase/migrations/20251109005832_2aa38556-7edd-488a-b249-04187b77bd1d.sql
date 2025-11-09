-- Fix security issues: Remove hardcoded admin UUID and development policy

-- 1. Drop the insecure is_admin(uuid) function with hardcoded UUID
-- This function creates a backdoor and is redundant with the proper has_role() system
DROP FUNCTION IF EXISTS public.is_admin(user_id uuid);

-- 2. Remove the overly permissive development policy on requests table
DROP POLICY IF EXISTS "Allow all for development" ON public.requests;

-- Verify all requests policies are properly scoped to users and admins
-- The remaining policies should be:
-- - "Admins can delete all requests" (admin only)
-- - "Admins can update all requests" (admin only)
-- - "Admins can view all requests" (admin only)
-- - "Users can create requests" (user owns the request)
-- - "Users can delete their own requests" (user owns the request)
-- - "Users can update their own requests" (user owns the request)