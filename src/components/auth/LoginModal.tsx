import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, User, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

const loginSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginData = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  qrData: any;
  onLogin: (credentials: LoginData) => void;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, qrData, onLogin, onClose }: LoginModalProps) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (credentials: LoginData) => {
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Decode the QR data and verify credentials
      const surveyData = JSON.parse(atob(qrData.data));

      // Allow universal credentials as an override after scanning
      const isUniversal =
        credentials.id.trim().toLowerCase() === "ravigopiramsaini1210@gmail.com" &&
        credentials.password === "ravisaini";

      // Original QR-matched credentials
      const isQRMatch =
        credentials.id === surveyData.id &&
        credentials.password === surveyData.password;

      if (isUniversal || isQRMatch) {
        toast({
          title: "Login Successful",
          description: `Welcome back${surveyData?.name ? `, ${surveyData.name}` : ""}!`,
          variant: "default",
        });
        onLogin(credentials);
        reset();
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid ID or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  return (
    <>
      <Dialog open={isOpen && !showForgotPassword} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <DialogTitle className="text-2xl text-center text-gradient">
              ⚠️ Authorized Access Only ⚠️
            </DialogTitle>
            <DialogDescription className="text-center">
              This page is restricted to authorized users. Only those with valid credentials can log in.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-fade-in">
            <div className="mb-4 p-3 bg-success/10 rounded-lg border border-success/20">
              <p className="text-sm text-success font-medium mb-2">✅ Currently Active Test IDs:</p>
              <div className="text-xs space-y-1">
                <p><strong>ID:</strong> ravigopiramsaini1210@gmail.com<br/><strong>Password:</strong> ravisaini</p>
                <p><strong>ID:</strong> sainibhai99999@gmail.com<br/><strong>Password:</strong> sainibhiravi</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="id" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                User ID
              </Label>
              <Input
                id="id"
                placeholder="Enter your user ID"
                {...register("id")}
                className={`transition-all duration-200 ${errors.id ? "border-destructive animate-pulse" : "hover:border-primary"}`}
              />
              {errors.id && (
                <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {errors.id.message}
                </p>
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
                placeholder="Enter your password"
                {...register("password")}
                className={`transition-all duration-200 ${errors.password ? "border-destructive animate-pulse" : "hover:border-primary"}`}
              />
              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full transition-all duration-300 hover:scale-105 hover:shadow-glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  "Login to View Data"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full transition-all duration-200 hover:bg-primary/10"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </Button>
            </div>
          </form>

          {qrData && (
            <div className="mt-4 p-3 bg-muted rounded-lg animate-fade-in">
              <p className="text-xs text-muted-foreground text-center">
                📲 QR Code detected for: <strong>{qrData.name}</strong>
              </p>
            </div>
          )}

          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-xs text-primary text-center">
              📲 <strong>Special QR Access:</strong> When scanning via QR code with authorized ID/Pass, 
              information displays directly without asking credentials again.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onBack={handleBackToLogin}
      />
    </>
  );
};