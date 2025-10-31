-- Enable RLS on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admins table
CREATE POLICY "Admins can view their own record"
ON public.admins
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert their own record"
ON public.admins
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update existing functions to have search_path set
CREATE OR REPLACE FUNCTION public.record_metric_history()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.metric_history (
    student_id,
    technical_skills,
    collaboration,
    adaptability,
    consistency,
    problem_solving,
    srl_score
  ) VALUES (
    NEW.student_id,
    NEW.technical_skills,
    NEW.collaboration,
    NEW.adaptability,
    NEW.consistency,
    NEW.problem_solving,
    NEW.srl_score
  );
  RETURN NEW;
END;
$function$;

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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;