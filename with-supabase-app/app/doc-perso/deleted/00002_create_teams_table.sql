-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  coach_id UUID REFERENCES public.profiles(id),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Teams are viewable by everyone" ON public.teams
  FOR SELECT USING (true);

CREATE POLICY "Teams can be created by admins and coaches" ON public.teams
  FOR INSERT WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'coach')
  );

CREATE POLICY "Teams can be updated by admins and coaches" ON public.teams
  FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'coach')
  );

CREATE POLICY "Teams can be deleted by admins" ON public.teams
  FOR DELETE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Create trigger to update the updated_at column
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();