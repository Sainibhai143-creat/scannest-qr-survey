import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, User, AlertCircle, Mail, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginData = z.infer<typeof loginSchema>;
type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

interface LoginModalProps {
  isOpen: boolean;
  qrData: any;
  onLogin: (credentials: LoginData) => void;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, qrData, onLogin, onClose }: LoginModalProps) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    reset: resetForgot,
    formState: { errors: errorsForgot, isSubmitting: isSubmittingForgot },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
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

  const handleForgotPasswordSubmit = async (data: ForgotPasswordData) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    setLoading(false);
    
    if (error) {
      toast({
        title: "Password Reset Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for password reset instructions.",
        variant: "default",
      });
      setShowForgotPassword(false);
      resetForgot();
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    resetForgot();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            {showForgotPassword ? (
              <Mail className="w-8 h-8 text-primary-foreground" />
            ) : (
              <Lock className="w-8 h-8 text-primary-foreground" />
            )}
          </div>
          <DialogTitle className="text-2xl text-center text-gradient">
            {showForgotPassword ? "Reset Password" : "Authentication Required"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {showForgotPassword 
              ? "Enter your email address to receive password reset instructions"
              : "Enter your credentials to access the survey data"
            }
          </DialogDescription>
        </DialogHeader>
        
        {showForgotPassword ? (
          <form onSubmit={handleSubmitForgot(handleForgotPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...registerForgot("email")}
                className={errorsForgot.email ? "border-destructive" : ""}
              />
              {errorsForgot.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errorsForgot.email.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={isSubmittingForgot || loading}
              >
                {isSubmittingForgot || loading ? "Sending Reset Email..." : "Send Reset Email"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={handleBackToLogin}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                User ID
              </Label>
              <Input
                id="id"
                placeholder="Enter your user ID"
                {...register("id")}
                className={errors.id ? "border-destructive" : ""}
              />
              {errors.id && (
                <p className="text-sm text-destructive flex items-center gap-1">
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
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1">
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
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Authenticating..." : "Login to View Data"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </Button>
            </div>
          </form>
        )}

        {qrData && !showForgotPassword && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              QR Code detected for: {qrData.name}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};