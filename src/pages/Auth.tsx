import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Lock, User, ArrowLeft, Shield, Loader2, Mail, UserPlus } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  
  // Universal login fields
  const [universalId, setUniversalId] = useState("");
  const [universalPass, setUniversalPass] = useState("");
  
  // Normal login/signup fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Universal credential login
  const handleUniversalLogin = async () => {
    const newErrors: Record<string, string> = {};
    if (!universalId.trim()) newErrors.universalId = "User ID is required";
    if (!universalPass.trim()) newErrors.universalPass = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (universalId !== UNIVERSAL_ID || universalPass !== UNIVERSAL_PASSWORD) {
      toast({ title: "Login Failed", description: "Invalid universal credentials.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: UNIVERSAL_EMAIL,
        password: UNIVERSAL_PASSWORD,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login")) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: UNIVERSAL_EMAIL,
            password: UNIVERSAL_PASSWORD,
            options: { data: { full_name: "Admin (Universal)" } }
          });
          if (signUpError) {
            toast({ title: "Error", description: signUpError.message, variant: "destructive" });
            return;
          }
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email: UNIVERSAL_EMAIL, password: UNIVERSAL_PASSWORD,
          });
          if (retryError) {
            toast({ title: "Account Created", description: "Please try again shortly." });
            return;
          }
        } else {
          toast({ title: "Login Failed", description: signInError.message, variant: "destructive" });
          return;
        }
      }
      toast({ title: "Welcome Admin!", description: "Universal login successful. Full access granted." });
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Normal email login
  const handleNormalLogin = async () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome!", description: "Login successful." });
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Normal email signup
  const handleNormalSignup = async () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) {
        toast({ title: "Signup Failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account Created!", description: "You can now scan QR codes to view data." });
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen gradient-subtle flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 fade-in-up">
            <img src={scannestLogo} alt="Scannest Logo" className="mx-auto mb-4 h-16 w-auto" />
            <h1 className="text-3xl font-bold text-gradient mb-2">Welcome to Scannest</h1>
            <p className="text-muted-foreground">Sign in to access the app</p>
          </div>

          <Card className="shadow-elegant border-primary/20">
            <CardContent className="pt-6">
              <Tabs defaultValue="normal" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="normal">
                    <User className="w-4 h-4 mr-2" />
                    Normal Login
                  </TabsTrigger>
                  <TabsTrigger value="universal">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Login
                  </TabsTrigger>
                </TabsList>

                {/* Normal Login / Signup */}
                <TabsContent value="normal">
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                      <form onSubmit={(e) => { e.preventDefault(); handleNormalLogin(); }} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email" className="flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Email
                          </Label>
                          <Input id="login-email" type="email" value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                            placeholder="your@email.com"
                            className={`bg-background/50 ${errors.email ? 'border-destructive' : ''}`} />
                          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-pass" className="flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Password
                          </Label>
                          <Input id="login-pass" type="password" value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }}
                            placeholder="••••••••"
                            className={`bg-background/50 ${errors.password ? 'border-destructive' : ''}`} />
                          {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>
                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</> : "Sign In"}
                        </Button>
                      </form>
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground text-center">
                          Normal users can <strong>scan QR codes</strong> and view data only.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="signup">
                      <form onSubmit={(e) => { e.preventDefault(); handleNormalSignup(); }} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name" className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" /> Full Name
                          </Label>
                          <Input id="signup-name" value={fullName}
                            onChange={(e) => { setFullName(e.target.value); setErrors(p => ({ ...p, fullName: "" })); }}
                            placeholder="Your full name"
                            className={`bg-background/50 ${errors.fullName ? 'border-destructive' : ''}`} />
                          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email" className="flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Email
                          </Label>
                          <Input id="signup-email" type="email" value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                            placeholder="your@email.com"
                            className={`bg-background/50 ${errors.email ? 'border-destructive' : ''}`} />
                          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-pass" className="flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Password
                          </Label>
                          <Input id="signup-pass" type="password" value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }}
                            placeholder="Min 6 characters"
                            className={`bg-background/50 ${errors.password ? 'border-destructive' : ''}`} />
                          {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>
                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : "Create Account"}
                        </Button>
                      </form>
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground text-center">
                          Sign up to <strong>scan QR codes</strong> and view survey data.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                {/* Universal / Admin Login */}
                <TabsContent value="universal">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); handleUniversalLogin(); }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="uni-id" className="flex items-center gap-2">
                        <User className="w-4 h-4" /> Admin ID
                      </Label>
                      <Input id="uni-id" value={universalId}
                        onChange={(e) => { setUniversalId(e.target.value); setErrors(p => ({ ...p, universalId: "" })); }}
                        placeholder="Enter admin ID"
                        className={`bg-background/50 ${errors.universalId ? 'border-destructive' : ''}`} />
                      {errors.universalId && <p className="text-sm text-destructive">{errors.universalId}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uni-pass" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Admin Password
                      </Label>
                      <Input id="uni-pass" type="password" value={universalPass}
                        onChange={(e) => { setUniversalPass(e.target.value); setErrors(p => ({ ...p, universalPass: "" })); }}
                        placeholder="••••••••"
                        className={`bg-background/50 ${errors.universalPass ? 'border-destructive' : ''}`} />
                      {errors.universalPass && <p className="text-sm text-destructive">{errors.universalPass}</p>}
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</> : "Admin Sign In"}
                    </Button>
                  </form>
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground text-center">
                      Admin login grants <strong>full access</strong>: survey registration + QR scanning.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <Button variant="ghost" className="w-full mt-4" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
              </Button>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="mt-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Shield className="w-3 h-3 mr-1" /> Admin = Full Access
              </Badge>
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                <User className="w-3 h-3 mr-1" /> User = Scan Only
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
