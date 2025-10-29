-- Add team logo URL to teams table
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add role to team_members table
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Member';

-- Add selected_members JSONB column to requests table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'requests' 
                 AND column_name = 'selected_members') THEN
    ALTER TABLE public.requests ADD COLUMN selected_members JSONB;
  END IF;
END $$;

-- Create storage bucket for team logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-logos', 'team-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for team logos
CREATE POLICY "Anyone can view team logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-logos');

CREATE POLICY "Authenticated users can upload team logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'team-logos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their team logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'team-logos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their team logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'team-logos' 
  AND auth.role() = 'authenticated'
);

-- Update RLS policies for team operations
CREATE POLICY "Authenticated users can create teams" ON public.teams
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update teams" ON public.teams
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert team members" ON public.team_members
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update team members" ON public.team_members
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Update requests policies
CREATE POLICY "Authenticated users can update requests" ON public.requests
FOR UPDATE
USING (auth.role() = 'authenticated');