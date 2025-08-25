import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import scannestLogo from "@/assets/scannest-logo.png";

const AuthLanding = () => {
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

        {/* Auth Action Buttons */}
        <div className="max-w-2xl mx-auto grid gap-8 md:grid-cols-2">
          {/* Login Button */}
          <Card className="shadow-elegant hover:shadow-glow transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mb-4">
                <LogIn className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl text-gradient">Login</CardTitle>
              <CardDescription>
                Access your account with existing credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/login">
                <Button className="w-full" size="lg">
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Register Button */}
          <Card className="shadow-elegant hover:shadow-glow transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-secondary to-secondary-light rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl text-gradient">Register</CardTitle>
              <CardDescription>
                New users can register with household details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/register">
                <Button className="w-full" variant="secondary" size="lg">
                  Create Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-success/5 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-success mr-3" />
                <h3 className="text-xl font-bold text-success">Secure Platform</h3>
              </div>
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  🔒 Your information is encrypted and secure
                </p>
                <p className="text-muted-foreground">
                  📋 Professional survey data collection
                </p>
                <p className="text-muted-foreground">
                  🔑 QR-based secure access to your data
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
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
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
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold">Data Security</h4>
              <p className="text-sm text-muted-foreground">
                Your information is protected and used only for surveys
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;