-- Create enum types for the AGIS system
CREATE TYPE public.opportunity_decision AS ENUM ('priority_a', 'priority_b', 'conditional', 'no_go');
CREATE TYPE public.hitl_status AS ENUM ('pending', 'approved', 'rejected', 'snoozed');
CREATE TYPE public.application_status AS ENUM ('draft', 'in_progress', 'submitted', 'awarded', 'rejected');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
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

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create company_profiles table (organization capabilities matrix)
CREATE TABLE public.company_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sectors TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  team_credentials JSONB DEFAULT '[]',
  cost_share_capacity NUMERIC DEFAULT 0,
  geographic_priorities TEXT[] DEFAULT '{}',
  active_proposal_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

-- Create opportunities_raw table (incoming grant data pre-scoring)
CREATE TABLE public.opportunities_raw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  external_id TEXT,
  title TEXT NOT NULL,
  agency TEXT,
  amount_min NUMERIC,
  amount_max NUMERIC,
  amount_text TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  description TEXT,
  eligibility TEXT,
  source_url TEXT,
  raw_data JSONB DEFAULT '{}',
  is_processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(source, external_id)
);

ALTER TABLE public.opportunities_raw ENABLE ROW LEVEL SECURITY;

-- Create opportunities_scored table (qualified opportunities with scores)
CREATE TABLE public.opportunities_scored (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  opportunity_raw_id UUID REFERENCES public.opportunities_raw(id) ON DELETE CASCADE NOT NULL,
  strategic_fit_score INTEGER DEFAULT 0 CHECK (strategic_fit_score >= 0 AND strategic_fit_score <= 40),
  win_probability_score INTEGER DEFAULT 0 CHECK (win_probability_score >= 0 AND win_probability_score <= 30),
  resource_efficiency_score INTEGER DEFAULT 0 CHECK (resource_efficiency_score >= 0 AND resource_efficiency_score <= 20),
  strategic_value_score INTEGER DEFAULT 0 CHECK (strategic_value_score >= 0 AND strategic_value_score <= 10),
  bonus_points INTEGER DEFAULT 0,
  capacity_penalty INTEGER DEFAULT 0,
  total_score INTEGER GENERATED ALWAYS AS (
    strategic_fit_score + win_probability_score + resource_efficiency_score + 
    strategic_value_score + bonus_points + capacity_penalty
  ) STORED,
  decision opportunity_decision NOT NULL DEFAULT 'no_go',
  hitl_status hitl_status NOT NULL DEFAULT 'pending',
  match_reasons TEXT[] DEFAULT '{}',
  risks TEXT[] DEFAULT '{}',
  scoring_details JSONB DEFAULT '{}',
  snoozed_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, opportunity_raw_id)
);

ALTER TABLE public.opportunities_scored ENABLE ROW LEVEL SECURITY;

-- Create applications table (grant applications in progress)
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  opportunity_scored_id UUID REFERENCES public.opportunities_scored(id) ON DELETE CASCADE NOT NULL,
  status application_status NOT NULL DEFAULT 'draft',
  content_sections JSONB DEFAULT '{}',
  team_members UUID[] DEFAULT '{}',
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create team_candidates table (potential partners/collaborators)
CREATE TABLE public.team_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  linkedin_url TEXT,
  email TEXT,
  skills TEXT[] DEFAULT '{}',
  credentials TEXT[] DEFAULT '{}',
  organization TEXT,
  match_score INTEGER DEFAULT 0,
  notes TEXT,
  raw_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_candidates ENABLE ROW LEVEL SECURITY;

-- Create search_history table (audit trail)
CREATE TABLE public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  results_count INTEGER DEFAULT 0,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Create api_configs table (external API credentials and settings)
CREATE TABLE public.api_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  api_name TEXT NOT NULL,
  endpoint TEXT,
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, api_name)
);

ALTER TABLE public.api_configs ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON public.company_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_opportunities_scored_updated_at BEFORE UPDATE ON public.opportunities_scored FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_api_configs_updated_at BEFORE UPDATE ON public.api_configs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- user_roles: Users can view their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- profiles: Users can manage their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- company_profiles: Users can manage their own company profiles
CREATE POLICY "Users can view their own company profiles" ON public.company_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own company profiles" ON public.company_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own company profiles" ON public.company_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own company profiles" ON public.company_profiles FOR DELETE USING (auth.uid() = user_id);

-- opportunities_raw: Authenticated users can view all raw opportunities (public data)
CREATE POLICY "Authenticated users can view raw opportunities" ON public.opportunities_raw FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service role can insert raw opportunities" ON public.opportunities_raw FOR INSERT TO authenticated WITH CHECK (true);

-- opportunities_scored: Users can manage their own scored opportunities
CREATE POLICY "Users can view their scored opportunities" ON public.opportunities_scored FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create scored opportunities" ON public.opportunities_scored FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their scored opportunities" ON public.opportunities_scored FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their scored opportunities" ON public.opportunities_scored FOR DELETE USING (auth.uid() = user_id);

-- applications: Users can manage their own applications
CREATE POLICY "Users can view their applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their applications" ON public.applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their applications" ON public.applications FOR DELETE USING (auth.uid() = user_id);

-- team_candidates: Users can manage their own team candidates
CREATE POLICY "Users can view their team candidates" ON public.team_candidates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create team candidates" ON public.team_candidates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their team candidates" ON public.team_candidates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their team candidates" ON public.team_candidates FOR DELETE USING (auth.uid() = user_id);

-- search_history: Users can view their own search history
CREATE POLICY "Users can view their search history" ON public.search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create search history" ON public.search_history FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- api_configs: Users can manage their own API configs
CREATE POLICY "Users can view their API configs" ON public.api_configs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create API configs" ON public.api_configs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their API configs" ON public.api_configs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their API configs" ON public.api_configs FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();