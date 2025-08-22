-- AI BabySense Database Schema
-- Create tables for baby care tracking app

-- Profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Babies table for managing multiple baby profiles
CREATE TABLE IF NOT EXISTS public.babies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cry analysis records
CREATE TABLE IF NOT EXISTS public.cry_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_url TEXT,
  analysis_result JSONB, -- Store AI analysis results
  predicted_need TEXT, -- hunger, sleep, discomfort, etc.
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Care activities tracking (feeding, sleep, diaper changes)
CREATE TABLE IF NOT EXISTS public.care_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('feeding', 'sleep', 'diaper', 'play', 'medicine', 'other')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  metadata JSONB, -- Store activity-specific data (amount fed, diaper type, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reminders and tips
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('feeding', 'sleep', 'medicine', 'appointment', 'milestone', 'tip')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.babies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cry_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for babies
CREATE POLICY "babies_select_own" ON public.babies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "babies_insert_own" ON public.babies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "babies_update_own" ON public.babies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "babies_delete_own" ON public.babies FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for cry_analyses
CREATE POLICY "cry_analyses_select_own" ON public.cry_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cry_analyses_insert_own" ON public.cry_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cry_analyses_update_own" ON public.cry_analyses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "cry_analyses_delete_own" ON public.cry_analyses FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for care_activities
CREATE POLICY "care_activities_select_own" ON public.care_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "care_activities_insert_own" ON public.care_activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "care_activities_update_own" ON public.care_activities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "care_activities_delete_own" ON public.care_activities FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reminders
CREATE POLICY "reminders_select_own" ON public.reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reminders_insert_own" ON public.reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reminders_update_own" ON public.reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reminders_delete_own" ON public.reminders FOR DELETE USING (auth.uid() = user_id);
