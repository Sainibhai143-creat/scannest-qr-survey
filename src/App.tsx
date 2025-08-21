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

const queryClient = new QueryClient();

type AppState = 'survey' | 'qr-generated' | 'scanner' | 'login' | 'data-display';

const App = () => {
  const [currentState, setCurrentState] = useState<AppState>('survey');
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [scannedQRData, setScannedQRData] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSurveyComplete = (data: SurveyData) => {
    setSurveyData(data);
    setCurrentState('qr-generated');
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
