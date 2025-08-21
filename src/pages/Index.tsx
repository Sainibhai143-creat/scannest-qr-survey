import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardList, LogIn, Mail } from "lucide-react";
import scannestLogo from "@/assets/scannest-logo.png";

const Index = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgotPassword = () => {
    // This would require backend functionality with Supabase
    alert("Password reset functionality requires Supabase integration. Please connect to Supabase first.");
  };

  return (
    <div className="min-h-screen gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Logo */}
        <div className="text-center mb-12 fade-in-up">
          <img 
            src={scannestLogo} 
            alt="Scannest Logo" 
            className="mx-auto mb-6 h-20 w-auto"
          />
          <h1 className="text-4xl font-bold text-gradient mb-2">Welcome to Scannest</h1>
          <p className="text-lg text-muted-foreground">
            Complete household surveys and manage data with QR authentication
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Developed by Setu Developer
          </p>
        </div>

        {/* Two Main Sections */}
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
          {/* Fill Survey Form Section */}
          <Card className="shadow-elegant hover-scale">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gradient">Fill Survey Form</CardTitle>
              <CardDescription>
                Complete our comprehensive household survey to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Survey Includes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Login Information</li>
                  <li>• Contact Details</li>
                  <li>• House & Family Information</li>
                  <li>• Appliances & Vehicles</li>
                  <li>• Income & Health Details</li>
                </ul>
              </div>
              <Button 
                className="w-full" 
                variant="gradient" 
                size="lg"
                onClick={() => window.location.href = '/survey'}
              >
                Start Survey
              </Button>
            </CardContent>
          </Card>

          {/* Login Section */}
          <Card className="shadow-elegant hover-scale">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gradient">Login to View Data</CardTitle>
              <CardDescription>
                Access your submitted survey data using your credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showForgotPassword ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="loginId">User ID</Label>
                    <Input
                      id="loginId"
                      placeholder="Enter your User ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loginPassword">Password</Label>
                    <Input
                      id="loginPassword"
                      type="password"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="space-y-3">
                    <Button className="w-full" variant="outline" size="lg">
                      Login
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-sm"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <Mail className="w-12 h-12 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">Reset Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Enter your email to receive password reset instructions
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">Email Address</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      variant="gradient" 
                      size="lg"
                      onClick={handleForgotPassword}
                    >
                      Send Reset Email
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-sm"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      Back to Login
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">Why Choose Scannest?</h3>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold">Comprehensive Surveys</h4>
              <p className="text-sm text-muted-foreground">
                Detailed household data collection with step-by-step guidance
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4z"/>
                </svg>
              </div>
              <h4 className="font-semibold">QR Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Secure QR-based access to your submitted data
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h4 className="font-semibold">AI Assistant</h4>
              <p className="text-sm text-muted-foreground">
                Intelligent guidance and data insights powered by AI
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
