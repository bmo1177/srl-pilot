-- Add logo_url to requests table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'requests' 
                 AND column_name = 'logo_url') THEN
    ALTER TABLE public.requests ADD COLUMN logo_url TEXT;
  END IF;
END $$;