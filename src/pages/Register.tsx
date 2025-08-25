import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import scannestLogo from "@/assets/scannest-logo.png";
import { SurveyContainer } from "@/components/survey/SurveyContainer";
import { SurveyData } from "@/types/survey";

const Register = () => {
  const [showSurvey, setShowSurvey] = useState(false);
  const navigate = useNavigate();

  const handleStartRegistration = () => {
    setShowSurvey(true);
  };

  const handleSurveyComplete = (data: SurveyData) => {
    // After survey completion, redirect to home
    navigate("/home");
  };

  if (showSurvey) {
    return <SurveyContainer onComplete={handleSurveyComplete} />;
  }

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-4 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Logo */}
        <div className="text-center mb-8 fade-in-up">
          <img 
            src={scannestLogo} 
            alt="Scannest Logo" 
            className="mx-auto mb-4 h-16 w-auto"
          />
          <h1 className="text-2xl font-bold text-gradient">Create Account</h1>
          <p className="text-muted-foreground">Register with your household details</p>
        </div>

        {/* Registration Info */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-secondary" />
              Registration
            </CardTitle>
            <CardDescription>
              Complete a comprehensive household survey to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-primary font-semibold">•</span>
                <span>Fill out household information</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-semibold">•</span>
                <span>Provide family and contact details</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-semibold">•</span>
                <span>Generate secure QR code access</span>
              </div>
            </div>

            <Button 
              onClick={handleStartRegistration}
              className="w-full" 
              size="lg"
            >
              Start Registration Survey
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;