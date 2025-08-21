import React, { useState } from "react";
import { SurveyData, SurveyStep } from "@/types/survey";
import { SurveyProgress } from "./SurveyProgress";
import { LoginInformation } from "./steps/LoginInformation";
import { ContactInformation } from "./steps/ContactInformation";
import { HouseFamilyDetails } from "./steps/HouseFamilyDetails";
import { Card } from "@/components/ui/card";

const surveySteps: SurveyStep[] = [
  {
    id: 1,
    title: "Login Info",
    description: "Create credentials",
    isComplete: false,
  },
  {
    id: 2,
    title: "Contact",
    description: "Personal details",
    isComplete: false,
  },
  {
    id: 3,
    title: "House & Family",
    description: "Home details",
    isComplete: false,
  },
  {
    id: 4,
    title: "Appliances",
    description: "Home appliances",
    isComplete: false,
  },
  {
    id: 5,
    title: "Vehicles",
    description: "Transport details",
    isComplete: false,
  },
  {
    id: 6,
    title: "Income & Health",
    description: "Final details",
    isComplete: false,
  },
];

interface SurveyContainerProps {
  onComplete: (data: SurveyData) => void;
}

export const SurveyContainer = ({ onComplete }: SurveyContainerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState<Partial<SurveyData>>({});

  const handleStepComplete = (stepData: any) => {
    const newSurveyData = { ...surveyData, ...stepData };
    setSurveyData(newSurveyData);
    
    if (currentStep < surveySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Survey complete
      onComplete(newSurveyData as SurveyData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <LoginInformation
            data={surveyData}
            onNext={handleStepComplete}
          />
        );
      case 1:
        return (
          <ContactInformation
            data={surveyData}
            onNext={handleStepComplete}
            onPrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <HouseFamilyDetails
            data={surveyData}
            onNext={handleStepComplete}
            onPrevious={handlePrevious}
          />
        );
      default:
        return (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Step {currentStep + 1} Coming Soon</h3>
            <p className="text-muted-foreground">This step is under development.</p>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 fade-in-up">
            <h1 className="text-4xl font-bold text-gradient mb-2">Scannest Survey</h1>
            <p className="text-lg text-muted-foreground">
              Complete household survey by Setu Developer
            </p>
          </div>

          {/* Progress */}
          <SurveyProgress steps={surveySteps} currentStep={currentStep} />

          {/* Current Step */}
          <div className="max-w-2xl mx-auto">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};