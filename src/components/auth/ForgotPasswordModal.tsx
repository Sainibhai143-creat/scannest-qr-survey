import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, KeyRound } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z.object({
  code: z.string().min(6, "Verification code must be 6 characters").max(6, "Verification code must be 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailData = z.infer<typeof emailSchema>;
type ResetData = z.infer<typeof resetSchema>;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export const ForgotPasswordModal = ({ isOpen, onClose, onBack }: ForgotPasswordModalProps) => {
  const [step, setStep] = useState<'email' | 'verify' | 'success'>('email');
  const [emailSent, setEmailSent] = useState('');

  const emailForm = useForm<EmailData>({
    resolver: zodResolver(emailSchema),
  });

  const resetForm = useForm<ResetData>({
    resolver: zodResolver(resetSchema),
  });

  const onEmailSubmit = async (data: EmailData) => {
    try {
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Demo: Check if email matches our test accounts
      const validEmails = ['ravigopiramsaini1210@gmail.com', 'sainibhai99999@gmail.com'];
      
      if (validEmails.includes(data.email.toLowerCase())) {
        setEmailSent(data.email);
        setStep('verify');
        toast({
          title: "Reset Code Sent!",
          description: `Verification code sent to ${data.email}. Demo code: 123456`,
          variant: "default",
        });
      } else {
        toast({
          title: "Email Not Found",
          description: "This email is not registered in our system.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onResetSubmit = async (data: ResetData) => {
    try {
      // Simulate password reset delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo: Accept code 123456
      if (data.code === '123456') {
        setStep('success');
        toast({
          title: "Password Reset Successfully!",
          description: "Your password has been updated. You can now log in with your new password.",
          variant: "default",
        });
      } else {
        toast({
          title: "Invalid Code",
          description: "The verification code is incorrect. Demo code is: 123456",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmailSent('');
    emailForm.reset();
    resetForm.reset();
    onClose();
  };

  const renderEmailStep = () => (
    <div className="animate-fade-in space-y-4">
      <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your registered email"
            {...emailForm.register("email")}
            className={emailForm.formState.errors.email ? "border-destructive" : ""}
          />
          {emailForm.formState.errors.email && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {emailForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={emailForm.formState.isSubmitting}
          >
            {emailForm.formState.isSubmitting ? "Sending..." : "Send Reset Code"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </form>
    </div>
  );

  const renderVerifyStep = () => (
    <div className="animate-scale-in space-y-4">
      <div className="text-center space-y-2 mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">
          We've sent a 6-digit code to <br />
          <strong>{emailSent}</strong>
        </p>
      </div>

      <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code" className="flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            Verification Code
          </Label>
          <Input
            id="code"
            placeholder="Enter 6-digit code"
            maxLength={6}
            {...resetForm.register("code")}
            className={`text-center text-lg tracking-widest ${resetForm.formState.errors.code ? "border-destructive" : ""}`}
          />
          {resetForm.formState.errors.code && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {resetForm.formState.errors.code.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            {...resetForm.register("newPassword")}
            className={resetForm.formState.errors.newPassword ? "border-destructive" : ""}
          />
          {resetForm.formState.errors.newPassword && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {resetForm.formState.errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            {...resetForm.register("confirmPassword")}
            className={resetForm.formState.errors.confirmPassword ? "border-destructive" : ""}
          />
          {resetForm.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {resetForm.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={resetForm.formState.isSubmitting}
          >
            {resetForm.formState.isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setStep('email')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Email
          </Button>
        </div>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="animate-scale-in text-center space-y-6">
      <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto animate-bounce-gentle">
        <CheckCircle className="w-10 h-10 text-success" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-success">Password Reset Complete!</h3>
        <p className="text-muted-foreground">
          Your password has been successfully updated. You can now log in with your new credentials.
        </p>
      </div>

      <Button
        onClick={onBack}
        variant="gradient"
        size="lg"
        className="w-full"
      >
        Continue to Login
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
            {step === 'success' ? (
              <CheckCircle className="w-8 h-8 text-primary-foreground" />
            ) : (
              <KeyRound className="w-8 h-8 text-primary-foreground" />
            )}
          </div>
          <DialogTitle className="text-2xl text-center text-gradient">
            {step === 'email' && "Reset Password"}
            {step === 'verify' && "Verify & Reset"}
            {step === 'success' && "Success!"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 'email' && "Enter your email to receive a reset code"}
            {step === 'verify' && "Enter the code and your new password"}
            {step === 'success' && "Your password has been reset successfully"}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' && renderEmailStep()}
        {step === 'verify' && renderVerifyStep()}
        {step === 'success' && renderSuccessStep()}

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            Demo Mode: Use verification code <strong>123456</strong> for testing
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};