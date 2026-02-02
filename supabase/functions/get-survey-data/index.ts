import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { survey_id } = await req.json();
    
    if (!survey_id) {
      console.log("No survey_id provided");
      return new Response(
        JSON.stringify({ error: "Survey ID is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Fetching survey data for ID:", survey_id);

    // Create Supabase client with service role for accessing data
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch survey with profile, appliances, and vehicles
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', survey_id)
      .maybeSingle();

    if (surveyError) {
      console.error("Survey fetch error:", surveyError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch survey" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!survey) {
      console.log("Survey not found for ID:", survey_id);
      return new Response(
        JSON.stringify({ error: "Survey not found" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Survey found:", survey.id);

    // Fetch profile for this user
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', survey.user_id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
    }

    // Fetch appliances for this survey
    const { data: appliances, error: appliancesError } = await supabase
      .from('appliances')
      .select('*')
      .eq('survey_id', survey_id)
      .maybeSingle();

    if (appliancesError) {
      console.error("Appliances fetch error:", appliancesError);
    }

    // Fetch vehicles for this survey
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('survey_id', survey_id);

    if (vehiclesError) {
      console.error("Vehicles fetch error:", vehiclesError);
    }

    console.log("Data fetched - Profile:", !!profile, "Appliances:", !!appliances, "Vehicles:", vehicles?.length || 0);

    // Construct SurveyData object from database data
    const surveyData = {
      // Login Info
      name: profile?.full_name?.split(' ')[0] || '',
      email: profile?.email || '',
      id: survey_id,
      password: '', // Not stored
      
      // Contact Info
      fullName: profile?.full_name || '',
      phoneNumber: profile?.phone_number || '',
      address: profile?.address || '',
      
      // House & Family
      houseNumber: profile?.house_number || '',
      ownership: (profile?.ownership as 'owner' | 'resident') || 'resident',
      familyMembers: {
        male: profile?.family_male || 0,
        female: profile?.family_female || 0,
        total: profile?.family_total || 0,
      },
      
      // Appliances
      appliances: {
        fans: appliances?.fans || 0,
        lights: appliances?.lights || 0,
        ac: appliances?.ac || 0,
        refrigerator: appliances?.refrigerator || 0,
        washingMachine: appliances?.washing_machine || 0,
        geyser: appliances?.geyser || 0,
        microwave: appliances?.microwave || 0,
        others: appliances?.others || [],
      },
      
      // Vehicles
      vehicles: (vehicles || []).map((v: any) => ({
        type: v.type || '',
        registrationNumber: v.registration_number || '',
        fuelType: v.fuel_type as 'petrol' | 'diesel' | 'electric' | 'cng',
        modelYear: v.model_year || new Date().getFullYear(),
      })),
      
      // Income
      incomeSource: (profile?.income_source as 'business' | 'privateJob' | 'governmentJob') || 'business',
      governmentJobDetails: profile?.govt_department ? {
        department: profile.govt_department,
        designation: profile.govt_designation || '',
        employeeId: profile.govt_employee_id || '',
      } : undefined,
      
      // Health
      hasDisability: profile?.has_disability || false,
      disabilityDetails: profile?.disability_details || undefined,
      hasHealthInsurance: profile?.has_health_insurance || false,
      healthInsuranceProvider: profile?.health_insurance_provider || undefined,
    };

    console.log("Returning survey data for:", surveyData.fullName);

    return new Response(
      JSON.stringify({ success: true, data: surveyData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
