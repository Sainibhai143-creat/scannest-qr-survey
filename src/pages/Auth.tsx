import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import scannestLogo from "@/assets/scannest-logo.png";
import { Toaster } from "@/components/ui/toaster";

// Validation schemas
const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

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

  const redirectUrl = useMemo(() => `${window.location.origin}/`, []);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    if (mode === "signup" && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        },
      });
      
      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account Exists",
            description: "This email is already registered. Please login instead.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive"
          });
        }
        return;
      }
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        toast({
          title: "Check Your Email",
          description: "We've sent you a confirmation link. Please check your email to verify your account.",
        });
      } else if (data.session) {
        toast({
          title: "Welcome!",
          description: "Account created successfully. Redirecting...",
        });
        navigate("/");
      }
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

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        if (error.message.includes("Invalid login")) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive"
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email Not Verified",
            description: "Please check your email and click the confirmation link.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive"
          });
        }
        return;
      }
      
      toast({
        title: "Welcome Back!",
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

  const handleForgotPassword = async () => {
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setErrors({ email: "Please enter your email address first" });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for the password reset link.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      handleLogin();
    } else {
      handleSignUp();
    }
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
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "login" 
              ? "Sign in to access your surveys" 
              : "Sign up to start creating surveys"}
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
              {mode === "login" ? "Login" : "Sign Up"}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === "login" 
                ? "Enter your credentials to continue" 
                : "Fill in your details to get started"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input 
                    id="fullName" 
                    type="text" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    placeholder="Enter your full name"
                    className="bg-background/50"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }} 
                  placeholder="you@example.com"
                  className={`bg-background/50 ${errors.email ? 'border-destructive' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
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
              
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }} 
                    placeholder="••••••••"
                    className={`bg-background/50 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  mode === "login" ? "Sign In" : "Create Account"
                )}
              </Button>
            </form>

            {mode === "login" && (
              <Button 
                variant="ghost" 
                onClick={handleForgotPassword} 
                disabled={loading} 
                className="w-full mt-2 text-sm text-muted-foreground hover:text-primary"
              >
                Forgot Password?
              </Button>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {mode === "login" ? "New to Scannest?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setErrors({});
              }}
            >
              {mode === "login" ? "Create an Account" : "Sign In Instead"}
            </Button>

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
            Secure Authentication
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">
            Your data is protected with industry-standard encryption
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Auth;