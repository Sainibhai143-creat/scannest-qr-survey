import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [status, setStatus] = useState<string>("");
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthed(!!session);
    });

    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(!!data.session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const redirectUrl = useMemo(() => `${window.location.origin}/auth`, []);

  const handleSignUp = async () => {
    setLoading(true);
    setStatus("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    setLoading(false);
    if (error) return setStatus(error.message);
    setStatus("Signup successful. Check your email to confirm.");
  };

  const handleLogin = async () => {
    setLoading(true);
    setStatus("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setStatus(error.message);
    setStatus("Login successful.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setStatus("Logged out.");
  };

  const testDb = async () => {
    setStatus("Testing database connection...");
    const { data, error } = await (supabase as any)
      .from("surveys")
      .select("id", { count: "exact", head: false })
      .limit(1);

    if (error) {
      setStatus(`Connected, but RLS denied data access: ${error.message}`);
    } else {
      const countText = data?.length ? `${data.length} row(s) fetched` : "0 rows (but connection OK)";
      setStatus(`Database connection OK • ${countText}`);
    }
  };

  useEffect(() => {
    if (isAuthed) {
      // Redirect authenticated users to home page
      navigate("/");
    }
  }, [isAuthed, navigate]);

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader>
          <CardTitle className="text-2xl">{mode === "login" ? "Login" : "Create Account"}</CardTitle>
          <CardDescription>
            {mode === "login" ? "Sign in to access your surveys" : "Sign up to start creating surveys"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <div className="flex gap-2">
            {mode === "login" ? (
              <Button className="flex-1" onClick={handleLogin} disabled={loading}>
                {loading ? "Please wait..." : "Login"}
              </Button>
            ) : (
              <Button className="flex-1" onClick={handleSignUp} disabled={loading}>
                {loading ? "Please wait..." : "Sign up"}
              </Button>
            )}
            <Button variant="secondary" onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Need an account?" : "Have an account?"}</Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>Back Home</Button>
            <Button variant="outline" className="flex-1" onClick={isAuthed ? handleLogout : testDb}>
              {isAuthed ? "Logout" : "Test DB"}
            </Button>
          </div>

          {status && (
            <p className="text-sm text-muted-foreground" role="status">{status}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
