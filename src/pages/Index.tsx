import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Scan, QrCode, Shield, UserPlus } from "lucide-react";
import scannestLogo from "@/assets/scannest-logo.png";

const Index = () => {
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
          <div className="mt-4 flex items-center justify-center">
            <Button variant="outline" onClick={() => (window.location.href = '/auth')}>Login / Sign up</Button>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="max-w-2xl mx-auto grid gap-8 md:grid-cols-2">
          {/* Scan Button */}
          <Card className="shadow-elegant hover:shadow-glow transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mb-4">
                <Scan className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl text-gradient">Scan</CardTitle>
              <CardDescription>
                View data by entering your User ID & Password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                variant="default"
                size="lg"
                onClick={() => window.location.href = '/scanner'}
              >
                Go to Scan Page
              </Button>
            </CardContent>
          </Card>

          {/* Registration Button */}
          <Card className="shadow-elegant hover:shadow-glow transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-secondary to-secondary-light rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl text-gradient">Registration</CardTitle>
              <CardDescription>
                New users can register here with their details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                variant="secondary"
                size="lg"
                onClick={() => window.location.href = '/survey'}
              >
                Register Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Access Information */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <QrCode className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-xl font-bold text-gradient">QR Code Access</h3>
              </div>
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  📲 Scan the QR code in the app to open the Login Page directly
                </p>
                <p className="text-muted-foreground">
                  🔑 Enter your ID & Password to view your submitted information
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="mt-8 max-w-4xl mx-auto">
          <Card className="bg-success/5 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-success mr-3" />
                <h3 className="text-xl font-bold text-success">Data Security</h3>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">
                  ✨ Your information is safe and used only for survey purposes
                </p>
              </div>
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
