import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, MapPin, ArrowLeft } from "lucide-react";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(10, "Please enter your complete address"),
});

type ContactData = z.infer<typeof contactSchema>;

interface ContactInformationProps {
  data: Partial<ContactData>;
  onNext: (data: ContactData) => void;
  onPrevious: () => void;
}

export const ContactInformation = ({ data, onNext, onPrevious }: ContactInformationProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: ContactData) => {
    onNext(formData);
  };

  return (
    <div className="slide-in-right">
      <Card className="shadow-elegant">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gradient">Contact Information</CardTitle>
          <CardDescription>
            Please provide your contact details for our survey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter your complete name"
                  {...register("fullName")}
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="+91 XXXXX XXXXX"
                  {...register("phoneNumber")}
                  className={errors.phoneNumber ? "border-destructive" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Complete Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="House No., Street, Area, City, State, PIN Code"
                  rows={3}
                  {...register("address")}
                  className={errors.address ? "border-destructive" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onPrevious}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button type="submit" variant="gradient" size="lg" className="flex-1">
                Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};