import { Check } from "lucide-react";
import { SurveyStep } from "@/types/survey";

interface SurveyProgressProps {
  steps: SurveyStep[];
  currentStep: number;
}

export const SurveyProgress = ({ steps, currentStep }: SurveyProgressProps) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    index < currentStep
                      ? "bg-success text-success-foreground shadow-glow"
                      : index === currentStep
                      ? "gradient-primary text-primary-foreground shadow-elegant"
                      : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {index < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="font-semibold">{step.id}</span>
                )}
              </div>
              <div className="mt-3 text-center max-w-[120px]">
                <p
                  className={`
                    text-sm font-medium
                    ${
                      index <= currentStep
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-4 transition-all duration-300
                  ${
                    index < currentStep
                      ? "bg-success"
                      : "bg-border"
                  }
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};