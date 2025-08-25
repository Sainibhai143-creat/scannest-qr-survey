import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Scan, QrCode, Shield, Home as HomeIcon, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import scannestLogo from "@/assets/scannest-logo.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Mobile-like Navigation Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={scannestLogo} 
                alt="Scannest" 
                className="h-8 w-auto"
              />
              <h1 className="text-lg font-bold text-gradient">Scannest</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="text-center mb-8 fade-in-up">
          <h2 className="text-3xl font-bold text-gradient mb-2">Welcome Home</h2>
          <p className="text-muted-foreground">
            Manage your household surveys and data
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Survey Action */}
          <Card className="shadow-elegant hover:shadow-glow transition-all duration-300 cursor-pointer"
                onClick={() => navigate("/survey")}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">New Survey</h3>
              <p className="text-sm text-muted-foreground">
                Complete a new household survey
              </p>
            </CardContent>
          </Card>

          {/* Scanner Action */}
          <Card className="shadow-elegant hover:shadow-glow transition-all duration-300 cursor-pointer"
                onClick={() => navigate("/scanner")}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Scan className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">QR Scanner</h3>
              <p className="text-sm text-muted-foreground">
                Scan QR codes to access data
              </p>
            </CardContent>
          </Card>

          {/* Data View */}
          <Card className="shadow-elegant hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-success-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">My Data</h3>
              <p className="text-sm text-muted-foreground">
                View your submitted information
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Information Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* How it Works */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <QrCode className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-xl font-bold text-gradient">How QR Access Works</h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Complete the household survey</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Get your unique QR code</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Scan QR anytime to access your data</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card className="bg-success/5 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-success mr-3" />
                <h3 className="text-xl font-bold text-success">Secure & Private</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>🔒 Your data is encrypted and secure</p>
                <p>🚫 No unauthorized access allowed</p>
                <p>✅ Used only for survey purposes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile-like Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            <Button variant="ghost" className="flex-col gap-1 h-auto py-2">
              <HomeIcon className="w-5 h-5 text-primary" />
              <span className="text-xs text-primary">Home</span>
            </Button>
            <Button variant="ghost" className="flex-col gap-1 h-auto py-2"
                    onClick={() => navigate("/scanner")}>
              <Scan className="w-5 h-5" />
              <span className="text-xs">Scan</span>
            </Button>
            <Button variant="ghost" className="flex-col gap-1 h-auto py-2"
                    onClick={() => navigate("/survey")}>
              <ClipboardList className="w-5 h-5" />
              <span className="text-xs">Survey</span>
            </Button>
            <Button variant="ghost" className="flex-col gap-1 h-auto py-2">
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Add bottom padding to account for fixed navigation */}
      <div className="h-16"></div>
    </div>
  );
};

export default Home;