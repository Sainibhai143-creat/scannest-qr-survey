import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SurveyContainer } from "@/components/survey/SurveyContainer";
import { QRGenerator } from "@/components/qr/QRGenerator";
import { QRScanner } from "@/components/qr/QRScanner";
import { LoginModal } from "@/components/auth/LoginModal";
import { SurveyDataDisplay } from "@/components/data/SurveyDataDisplay";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { SurveyData } from "@/types/survey";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

type AppState = 'survey' | 'qr-generated' | 'scanner' | 'login' | 'data-display';

interface AppProps {
  initialState?: AppState;
}

const App = ({ initialState = 'survey' }: AppProps) => {
  const [currentState, setCurrentState] = useState<AppState>(initialState);
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [scannedQRData, setScannedQRData] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSurveyComplete = async (data: SurveyData) => {
    try {
      // Get current user from Supabase
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please login to save survey data",
          variant: "destructive"
        });
        return;
      }

      // Save survey data to database for authenticated Supabase users
      const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
          user_id: user!.id,
          title: `Survey - ${data.fullName}`,
          description: `Household survey for ${data.address}`,
          status: 'completed'
        })
        .select()
        .maybeSingle();

      if (surveyError) {
        console.error('Survey insert error:', surveyError);
        throw surveyError;
      }

      if (!survey) {
        throw new Error('Failed to create survey');
      }

      // Update profile with survey data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user!.id,
          email: data.email,
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          address: data.address,
          house_number: data.houseNumber,
          ownership: data.ownership,
          family_male: data.familyMembers.male,
          family_female: data.familyMembers.female,
          family_total: data.familyMembers.total,
          income_source: data.incomeSource,
          govt_department: data.governmentJobDetails?.department,
          govt_designation: data.governmentJobDetails?.designation,
          govt_employee_id: data.governmentJobDetails?.employeeId,
          has_disability: data.hasDisability,
          disability_details: data.disabilityDetails,
          has_health_insurance: data.hasHealthInsurance,
          health_insurance_provider: data.healthInsuranceProvider
        }, { onConflict: 'user_id' });

      if (profileError) {
        console.error('Profile upsert error:', profileError);
        throw profileError;
      }

      // Save appliances data
      const { error: appliancesError } = await supabase
        .from('appliances')
        .insert({
          survey_id: survey.id,
          fans: data.appliances.fans,
          lights: data.appliances.lights,
          ac: data.appliances.ac,
          refrigerator: data.appliances.refrigerator,
          washing_machine: data.appliances.washingMachine,
          geyser: data.appliances.geyser,
          microwave: data.appliances.microwave,
          others: data.appliances.others
        });

      if (appliancesError) {
        console.error('Appliances insert error:', appliancesError);
        throw appliancesError;
      }

      // Save vehicles data
      if (data.vehicles && data.vehicles.length > 0) {
        const { error: vehiclesError } = await supabase
          .from('vehicles')
          .insert(
            data.vehicles.map(vehicle => ({
              survey_id: survey.id,
              type: vehicle.type,
              registration_number: vehicle.registrationNumber,
              fuel_type: vehicle.fuelType,
              model_year: vehicle.modelYear
            }))
          );

        if (vehiclesError) {
          console.error('Vehicles insert error:', vehiclesError);
          throw vehiclesError;
        }
      }

      // Set survey data with database ID for dynamic QR
      const surveyDataWithId = { ...data, id: survey.id };
      setSurveyData(surveyDataWithId);
      setCurrentState('qr-generated');
      
      toast({
        title: "Survey Saved",
        description: "Your survey data has been saved! QR code will fetch latest data from database."
      });

    } catch (error: any) {
      console.error('Error saving survey:', error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to save survey data",
        variant: "destructive"
      });
    }
  };

  const handleQRGenerated = () => {
    setCurrentState('scanner');
  };

  const handleQRScanned = (qrData: any) => {
    setScannedQRData(qrData);
    setIsLoginModalOpen(true);
  };

  const handleLogin = () => {
    setIsLoginModalOpen(false);
    if (scannedQRData) {
      const data = JSON.parse(atob(scannedQRData.data));
      setSurveyData(data);
      setCurrentState('data-display');
    }
  };

  const handleBackToScanner = () => {
    setCurrentState('scanner');
    setSurveyData(null);
    setScannedQRData(null);
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case 'survey':
        return <SurveyContainer onComplete={handleSurveyComplete} />;
      case 'qr-generated':
        return surveyData ? (
          <QRGenerator surveyData={surveyData} onContinue={handleQRGenerated} />
        ) : null;
      case 'scanner':
        return <QRScanner onScanSuccess={handleQRScanned} />;
      case 'data-display':
        return surveyData ? (
          <div className="min-h-screen gradient-subtle">
            <div className="container mx-auto px-4 py-8">
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <SurveyDataDisplay 
                    surveyData={surveyData} 
                    onBack={handleBackToScanner} 
                  />
                </div>
                <div className="lg:col-span-1">
                  <AIAssistant surveyData={surveyData} />
                </div>
              </div>
            </div>
          </div>
        ) : null;
      default:
        return <SurveyContainer onComplete={handleSurveyComplete} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {renderCurrentState()}
        
        <LoginModal
          isOpen={isLoginModalOpen}
          qrData={scannedQRData}
          onLogin={handleLogin}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;