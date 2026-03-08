import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";

const UNIVERSAL_EMAIL = "admin@scannest.app";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md shadow-elegant">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Checking access...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-elegant">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gradient mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-6">Please login to continue.</p>
            <Button onClick={() => window.location.href = '/auth'} size="lg" className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.email !== UNIVERSAL_EMAIL) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-elegant">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gradient mb-4">Admin Access Only</h2>
            <p className="text-muted-foreground mb-6">
              Survey registration is restricted to admin users only. Normal users can scan QR codes to view data.
            </p>
            <div className="space-y-3">
              <Button onClick={() => window.location.href = '/scanner'} size="lg" className="w-full">
                Go to QR Scanner
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'} size="sm" className="w-full">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
