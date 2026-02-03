-- Fix RLS policies to only allow authenticated users (not anonymous)
-- This fixes the security warnings about anonymous access

-- 1. Drop existing policies and recreate with 'authenticated' role restriction
-- APPLIANCES TABLE
DROP POLICY IF EXISTS "Users can view own appliances" ON public.appliances;
DROP POLICY IF EXISTS "Users can insert own appliances" ON public.appliances;
DROP POLICY IF EXISTS "Users can update own appliances" ON public.appliances;

CREATE POLICY "Users can view own appliances" ON public.appliances
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys 
    WHERE surveys.id = appliances.survey_id 
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own appliances" ON public.appliances
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM surveys 
    WHERE surveys.id = appliances.survey_id 
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own appliances" ON public.appliances
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys 
    WHERE surveys.id = appliances.survey_id 
    AND surveys.user_id = auth.uid()
  ));

-- PROFILES TABLE
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- QR_TOKENS TABLE
DROP POLICY IF EXISTS "Users can view own tokens" ON public.qr_tokens;
DROP POLICY IF EXISTS "Users can create tokens" ON public.qr_tokens;

CREATE POLICY "Users can view own tokens" ON public.qr_tokens
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tokens" ON public.qr_tokens
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- SURVEYS TABLE
DROP POLICY IF EXISTS "Users can view own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Users can insert own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Users can update own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Users can delete own surveys" ON public.surveys;

CREATE POLICY "Users can view own surveys" ON public.surveys
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own surveys" ON public.surveys
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own surveys" ON public.surveys
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own surveys" ON public.surveys
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- VEHICLES TABLE
DROP POLICY IF EXISTS "Users can view own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can insert own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can update own vehicles" ON public.vehicles;

CREATE POLICY "Users can view own vehicles" ON public.vehicles
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys 
    WHERE surveys.id = vehicles.survey_id 
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own vehicles" ON public.vehicles
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM surveys 
    WHERE surveys.id = vehicles.survey_id 
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own vehicles" ON public.vehicles
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys 
    WHERE surveys.id = vehicles.survey_id 
    AND surveys.user_id = auth.uid()
  ));