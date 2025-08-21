import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, IdCard, Lock } from "lucide-react";

const loginSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  id: z.string().min(3, "ID must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

interface LoginInformationProps {
  data: Partial<LoginData>;
  onNext: (data: LoginData) => void;
}

export const LoginInformation = ({ data, onNext }: LoginInformationProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: LoginData) => {
    onNext(formData);
  };

  return (
    <div className="slide-in-right">
      <Card className="shadow-elegant">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gradient">Login Information</CardTitle>
          <CardDescription>
            Create your secure login credentials for Scannest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="id" className="flex items-center gap-2">
                  <IdCard className="w-4 h-4" />
                  User ID
                </Label>
                <Input
                  id="id"
                  placeholder="Create a unique ID"
                  {...register("id")}
                  className={errors.id ? "border-destructive" : ""}
                />
                {errors.id && (
                  <p className="text-sm text-destructive">{errors.id.message}</p>
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
                  placeholder="Create a secure password"
                  {...register("password")}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" variant="gradient" size="lg">
              Continue to Survey
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};