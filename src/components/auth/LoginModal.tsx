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
      
      // Authorized credentials
      const authorizedUsers = [
        { id: "ravigopiramsaini1210@gmail.com", password: "ravisaini" },
        { id: "sainibhai99999@gmail.com", password: "sainibhiravi" }
      ];
      
      // Check if credentials match authorized users
      const isAuthorized = authorizedUsers.some(
        user => user.id === credentials.id && user.password === credentials.password
      );
      
      if (isAuthorized) {
        // If QR data exists, verify it matches credentials, otherwise proceed with authorized login
        if (qrData) {
          try {
            const surveyData = JSON.parse(atob(qrData.data));
            if (credentials.id === surveyData.id && credentials.password === surveyData.password) {
              toast({
                title: "QR Access Granted",
                description: `Welcome back, ${surveyData.name}! Your information is displayed directly.`,
                variant: "default",
              });
              onLogin(credentials);
              reset();
              return;
            }
          } catch (qrError) {
            // If QR data is invalid but user is authorized, still allow login
          }
        }
        
        toast({
          title: "Authorized Access Granted",
          description: "Welcome! You have been granted access to the system.",
          variant: "default",
        });
        onLogin(credentials);
        reset();
      } else {
        toast({
          title: "Unauthorized Access",
          description: "Invalid credentials. Only authorized users can access this area.",
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
    toast({
      title: "Password Recovery",
      description: "For demo purposes: Your credentials are stored in the QR code data.",
      variant: "default",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl text-center text-gradient">
            ⚠️ Authorised Access Only ⚠️
          </DialogTitle>
          <DialogDescription className="text-center">
            This page is restricted to authorised users. Only those with valid credentials can log in and view information.
          </DialogDescription>
        </DialogHeader>
        
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

        <div className="mt-4 space-y-3">
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="text-sm font-semibold text-center mb-2">✅ Currently Active IDs:</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>ID:</strong> ravigopiramsaini1210@gmail.com</p>
              <p><strong>Password:</strong> ravisaini</p>
              <hr className="my-1 border-primary/20" />
              <p><strong>ID:</strong> sainibhai99999@gmail.com</p>
              <p><strong>Password:</strong> sainibhiravi</p>
            </div>
          </div>
          
          {qrData && (
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="text-sm font-semibold text-center mb-1">📲 Special Access via QR:</h4>
              <p className="text-xs text-muted-foreground text-center">
                When scanning via QR code (with authorised ID/Pass), information will be displayed directly without asking credentials again.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};