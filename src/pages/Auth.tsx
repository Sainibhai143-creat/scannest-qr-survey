import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Lock, User, ArrowLeft, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import scannestLogo from "@/assets/scannest-logo.png";
import { Toaster } from "@/components/ui/toaster";

// Universal credentials
const UNIVERSAL_ID = "admin";
const UNIVERSAL_PASSWORD = "admin123";
const UNIVERSAL_EMAIL = "admin@scannest.app";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ userId?: string; password?: string }>({});

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!userId.trim()) newErrors.userId = "User ID is required";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    // Check universal credentials
    if (userId !== UNIVERSAL_ID || password !== UNIVERSAL_PASSWORD) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Use the universal credentials to login.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Try to sign in with the universal Supabase account
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: UNIVERSAL_EMAIL,
        password: UNIVERSAL_PASSWORD,
      });

      if (signInError) {
        // If account doesn't exist, create it
        if (signInError.message.includes("Invalid login")) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: UNIVERSAL_EMAIL,
            password: UNIVERSAL_PASSWORD,
            options: {
              data: { full_name: "Admin (Universal)" }
            }
          });

          if (signUpError) {
            toast({
              title: "Error",
              description: signUpError.message,
              variant: "destructive"
            });
            return;
          }

          // Try signing in again after signup
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email: UNIVERSAL_EMAIL,
            password: UNIVERSAL_PASSWORD,
          });

          if (retryError) {
            toast({
              title: "Account Created",
              description: "Account created but email confirmation may be required. Please try again shortly.",
            });
            return;
          }
        } else {
          toast({
            title: "Login Failed",
            description: signInError.message,
            variant: "destructive"
          });
          return;
        }
      }

      toast({
        title: "Welcome!",
        description: "Login successful. Redirecting...",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <>
    <Toaster />
    <div className="min-h-screen gradient-subtle flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 fade-in-up">
          <img 
            src={scannestLogo} 
            alt="Scannest Logo" 
            className="mx-auto mb-4 h-16 w-auto"
          />
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Welcome to Scannest
          </h1>
          <p className="text-muted-foreground">
            Sign in with universal credentials to access surveys
          </p>
        </div>

        <Card className="shadow-elegant border-primary/20">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center text-gradient">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter universal credentials to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  User ID
                </Label>
                <Input 
                  id="userId" 
                  type="text" 
                  value={userId} 
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setErrors(prev => ({ ...prev, userId: undefined }));
                  }} 
                  placeholder="Enter user ID"
                  className={`bg-background/50 ${errors.userId ? 'border-destructive' : ''}`}
                />
                {errors.userId && (
                  <p className="text-sm text-destructive">{errors.userId}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }} 
                  placeholder="••••••••"
                  className={`bg-background/50 ${errors.password ? 'border-destructive' : ''}`}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Credentials hint */}
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Universal Credentials:</strong> ID: <code className="bg-background px-1 rounded">admin</code> | Password: <code className="bg-background px-1 rounded">admin123</code>
              </p>
            </div>

            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <Shield className="w-3 h-3 mr-1" />
            Universal Access
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">
            QR scanning is open to all • Data entry requires login
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Auth;