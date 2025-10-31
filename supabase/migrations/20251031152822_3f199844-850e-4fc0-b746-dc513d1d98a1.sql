-- Create app_role enum if not exists
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table for secure role management
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_user_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- Add soft delete column to students
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;

-- Update students RLS policies for admin operations
DROP POLICY IF EXISTS "Anyone can read students" ON public.students;
CREATE POLICY "Anyone can read active students"
ON public.students
FOR SELECT
USING (archived = false);

CREATE POLICY "Admins can insert students"
ON public.students
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update students"
ON public.students
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete students"
ON public.students
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update requests policies
DROP POLICY IF EXISTS "Authenticated users can update requests" ON public.requests;
CREATE POLICY "Admins can update requests"
ON public.requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete requests"
ON public.requests
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update team_members policies
DROP POLICY IF EXISTS "Authenticated users can insert team members" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated users can update team members" ON public.team_members;

CREATE POLICY "Admins can insert team members"
ON public.team_members
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update team members"
ON public.team_members
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete team members"
ON public.team_members
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update teams policies
DROP POLICY IF EXISTS "Authenticated users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can update teams" ON public.teams;

CREATE POLICY "Admins can insert teams"
ON public.teams
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update teams"
ON public.teams
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete teams"
ON public.teams
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Function to update student status based on team membership
CREATE OR REPLACE FUNCTION public.update_student_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Student joined a team, set status to 'busy'
    UPDATE public.students
    SET status = 'busy'
    WHERE id = NEW.student_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Check if student has any other team memberships
    IF NOT EXISTS (
      SELECT 1 FROM public.team_members
      WHERE student_id = OLD.student_id AND id != OLD.id
    ) THEN
      -- No other teams, set status to 'free'
      UPDATE public.students
      SET status = 'free'
      WHERE id = OLD.student_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for automatic student status updates
DROP TRIGGER IF EXISTS update_student_status_trigger ON public.team_members;
CREATE TRIGGER update_student_status_trigger
AFTER INSERT OR DELETE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_student_status();