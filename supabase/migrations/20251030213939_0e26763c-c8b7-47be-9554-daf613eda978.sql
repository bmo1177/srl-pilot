-- Create student_metrics table for SRL analytics
CREATE TABLE IF NOT EXISTS public.student_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  technical_skills INTEGER DEFAULT 0 CHECK (technical_skills >= 0 AND technical_skills <= 100),
  collaboration INTEGER DEFAULT 0 CHECK (collaboration >= 0 AND collaboration <= 100),
  adaptability INTEGER DEFAULT 0 CHECK (adaptability >= 0 AND adaptability <= 100),
  consistency INTEGER DEFAULT 0 CHECK (consistency >= 0 AND consistency <= 100),
  problem_solving INTEGER DEFAULT 0 CHECK (problem_solving >= 0 AND problem_solving <= 100),
  srl_score INTEGER DEFAULT 0 CHECK (srl_score >= 0 AND srl_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id)
);

-- Create student_reflections table for journals and timeline
CREATE TABLE IF NOT EXISTS public.student_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  reflection_text TEXT NOT NULL,
  milestone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_action_plans table for tasks and todos
CREATE TABLE IF NOT EXISTS public.student_action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  task_title TEXT NOT NULL,
  description TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  owner TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create team_metrics table for team analytics
CREATE TABLE IF NOT EXISTS public.team_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  synergy_score INTEGER DEFAULT 0 CHECK (synergy_score >= 0 AND synergy_score <= 100),
  avg_srl_score INTEGER DEFAULT 0 CHECK (avg_srl_score >= 0 AND avg_srl_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(team_id)
);

-- Create metric_history table for tracking changes over time
CREATE TABLE IF NOT EXISTS public.metric_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  technical_skills INTEGER,
  collaboration INTEGER,
  adaptability INTEGER,
  consistency INTEGER,
  problem_solving INTEGER,
  srl_score INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.student_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_metrics (anyone can read, authenticated can update)
CREATE POLICY "Anyone can read student metrics"
  ON public.student_metrics FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert student metrics"
  ON public.student_metrics FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update student metrics"
  ON public.student_metrics FOR UPDATE
  USING (auth.role() = 'authenticated');

-- RLS Policies for student_reflections
CREATE POLICY "Anyone can read student reflections"
  ON public.student_reflections FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert reflections"
  ON public.student_reflections FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for student_action_plans
CREATE POLICY "Anyone can read action plans"
  ON public.student_action_plans FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert action plans"
  ON public.student_action_plans FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update action plans"
  ON public.student_action_plans FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete action plans"
  ON public.student_action_plans FOR DELETE
  USING (auth.role() = 'authenticated');

-- RLS Policies for team_metrics
CREATE POLICY "Anyone can read team metrics"
  ON public.team_metrics FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert team metrics"
  ON public.team_metrics FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update team metrics"
  ON public.team_metrics FOR UPDATE
  USING (auth.role() = 'authenticated');

-- RLS Policies for metric_history
CREATE POLICY "Anyone can read metric history"
  ON public.metric_history FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert metric history"
  ON public.metric_history FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create trigger to update updated_at column
CREATE TRIGGER update_student_metrics_updated_at
  BEFORE UPDATE ON public.student_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_action_plans_updated_at
  BEFORE UPDATE ON public.student_action_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_metrics_updated_at
  BEFORE UPDATE ON public.team_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to record metric changes to history
CREATE OR REPLACE FUNCTION public.record_metric_history()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Trigger to automatically record history when metrics are updated
CREATE TRIGGER record_student_metrics_history
  AFTER INSERT OR UPDATE ON public.student_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.record_metric_history();