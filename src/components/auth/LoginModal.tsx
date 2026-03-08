import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, User, AlertCircle, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const UNIVERSAL_ID = "admin";
const UNIVERSAL_PASSWORD = "admin123";

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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const surveyData = JSON.parse(atob(qrData.data));

      // Check if credentials match QR owner's credentials
      const isQRMatch =
        credentials.id === surveyData.id &&
        credentials.password === surveyData.password;

      // Check if credentials match universal/admin credentials
      const isUniversalMatch =
        credentials.id === UNIVERSAL_ID &&
        credentials.password === UNIVERSAL_PASSWORD;

      if (isQRMatch || isUniversalMatch) {
        toast({
          title: "Access Granted",
          description: isUniversalMatch 
            ? "Admin access - viewing survey data." 
            : `Welcome back${surveyData?.name ? `, ${surveyData.name}` : ""}!`,
          variant: "default",
        });
        onLogin(credentials);
        reset();
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid credentials. Use your own ID/Password or Admin credentials.",
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl text-center text-gradient">
            View Survey Data
          </DialogTitle>
          <DialogDescription className="text-center">
            Enter your own credentials or admin credentials to view data
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id" className="flex items-center gap-2">
              <User className="w-4 h-4" /> User ID
            </Label>
            <Input id="id" placeholder="Your ID or admin"
              {...register("id")}
              className={errors.id ? "border-destructive" : ""} />
            {errors.id && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" /> Password
            </Label>
            <Input id="password" type="password" placeholder="Your password"
              {...register("password")}
              className={errors.password ? "border-destructive" : ""} />
            {errors.password && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "View Data"}
          </Button>
        </form>

        <div className="mt-2 p-3 bg-muted rounded-lg space-y-1">
          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            <User className="w-3 h-3" /> Enter your own ID & Password
          </p>
          <p className="text-xs text-muted-foreground text-center font-medium">OR</p>
          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> Enter Admin credentials for full access
          </p>
        </div>

        {qrData && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              QR Code detected for: {qrData.name}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
