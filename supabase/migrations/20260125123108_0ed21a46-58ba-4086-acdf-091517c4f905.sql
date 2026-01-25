-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. PROFILES TABLE (for user data)
-- =============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    full_name VARCHAR(255),
    phone_number VARCHAR(50),
    address TEXT,
    house_number VARCHAR(50),
    ownership VARCHAR(20) CHECK (ownership IN ('owner', 'resident')),
    family_male INTEGER DEFAULT 0,
    family_female INTEGER DEFAULT 0,
    family_total INTEGER DEFAULT 0,
    income_source VARCHAR(50) CHECK (income_source IN ('business', 'privateJob', 'governmentJob')),
    govt_department VARCHAR(255),
    govt_designation VARCHAR(255),
    govt_employee_id VARCHAR(100),
    has_disability BOOLEAN DEFAULT FALSE,
    disability_details TEXT,
    has_health_insurance BOOLEAN DEFAULT FALSE,
    health_insurance_provider VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 2. SURVEYS TABLE (for survey submissions)
-- =============================================
CREATE TABLE public.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'submitted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own surveys" ON public.surveys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own surveys" ON public.surveys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own surveys" ON public.surveys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own surveys" ON public.surveys
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 3. APPLIANCES TABLE (linked to surveys)
-- =============================================
CREATE TABLE public.appliances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    fans INTEGER DEFAULT 0,
    lights INTEGER DEFAULT 0,
    ac INTEGER DEFAULT 0,
    refrigerator INTEGER DEFAULT 0,
    washing_machine INTEGER DEFAULT 0,
    geyser INTEGER DEFAULT 0,
    microwave INTEGER DEFAULT 0,
    others TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.appliances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own appliances" ON public.appliances
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.surveys 
            WHERE surveys.id = appliances.survey_id 
            AND surveys.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own appliances" ON public.appliances
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.surveys 
            WHERE surveys.id = appliances.survey_id 
            AND surveys.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own appliances" ON public.appliances
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.surveys 
            WHERE surveys.id = appliances.survey_id 
            AND surveys.user_id = auth.uid()
        )
    );

-- =============================================
-- 4. VEHICLES TABLE (linked to surveys)
-- =============================================
CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    type VARCHAR(100),
    registration_number VARCHAR(50),
    fuel_type VARCHAR(20) CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'cng')),
    model_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vehicles" ON public.vehicles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.surveys 
            WHERE surveys.id = vehicles.survey_id 
            AND surveys.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own vehicles" ON public.vehicles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.surveys 
            WHERE surveys.id = vehicles.survey_id 
            AND surveys.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own vehicles" ON public.vehicles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.surveys 
            WHERE surveys.id = vehicles.survey_id 
            AND surveys.user_id = auth.uid()
        )
    );

-- =============================================
-- 5. CONTACT_SUBMISSIONS TABLE (public contact form)
-- =============================================
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit contact form (public)
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

-- =============================================
-- 6. QR_TOKENS TABLE (for QR code authentication)
-- =============================================
CREATE TABLE public.qr_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE,
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.qr_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tokens" ON public.qr_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create tokens" ON public.qr_tokens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 7. UPDATE TIMESTAMP TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_surveys_updated_at
    BEFORE UPDATE ON public.surveys
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appliances_updated_at
    BEFORE UPDATE ON public.appliances
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 8. INDEXES FOR BETTER PERFORMANCE
-- =============================================
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_surveys_user_id ON public.surveys(user_id);
CREATE INDEX idx_appliances_survey_id ON public.appliances(survey_id);
CREATE INDEX idx_vehicles_survey_id ON public.vehicles(survey_id);
CREATE INDEX idx_qr_tokens_token ON public.qr_tokens(token);
CREATE INDEX idx_qr_tokens_user_id ON public.qr_tokens(user_id);