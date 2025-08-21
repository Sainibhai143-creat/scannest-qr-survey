import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, ArrowLeft } from "lucide-react";

const houseSchema = z.object({
  houseNumber: z.string().min(1, "House number is required"),
  ownership: z.enum(['owner', 'resident'], {
    required_error: "Please select ownership type",
  }),
  familyMembers: z.object({
    male: z.number().min(0, "Must be 0 or more"),
    female: z.number().min(0, "Must be 0 or more"),
    total: z.number().min(1, "Total must be at least 1"),
  }),
});

type HouseData = z.infer<typeof houseSchema>;

interface HouseFamilyDetailsProps {
  data: Partial<HouseData>;
  onNext: (data: HouseData) => void;
  onPrevious: () => void;
}

export const HouseFamilyDetails = ({ data, onNext, onPrevious }: HouseFamilyDetailsProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HouseData>({
    resolver: zodResolver(houseSchema),
    defaultValues: data,
  });

  const male = watch("familyMembers.male") || 0;
  const female = watch("familyMembers.female") || 0;

  const updateTotal = () => {
    setValue("familyMembers.total", male + female);
  };

  React.useEffect(() => {
    updateTotal();
  }, [male, female]);

  const onSubmit = (formData: HouseData) => {
    onNext(formData);
  };

  return (
    <div className="slide-in-right">
      <Card className="shadow-elegant">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gradient">House & Family Details</CardTitle>
          <CardDescription>
            Information about your residence and family members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="houseNumber" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  House Number
                </Label>
                <Input
                  id="houseNumber"
                  placeholder="Enter house/flat number"
                  {...register("houseNumber")}
                  className={errors.houseNumber ? "border-destructive" : ""}
                />
                {errors.houseNumber && (
                  <p className="text-sm text-destructive">{errors.houseNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Ownership Type
                </Label>
                <Select
                  onValueChange={(value: 'owner' | 'resident') => setValue("ownership", value)}
                  defaultValue={data.ownership}
                >
                  <SelectTrigger className={errors.ownership ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select ownership type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="resident">Resident/Tenant</SelectItem>
                  </SelectContent>
                </Select>
                {errors.ownership && (
                  <p className="text-sm text-destructive">{errors.ownership.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <Users className="w-4 h-4" />
                  Family Members
                </Label>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="male">Male Members</Label>
                    <Input
                      id="male"
                      type="number"
                      min="0"
                      {...register("familyMembers.male", { valueAsNumber: true })}
                      className={errors.familyMembers?.male ? "border-destructive" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="female">Female Members</Label>
                    <Input
                      id="female"
                      type="number"
                      min="0"
                      {...register("familyMembers.female", { valueAsNumber: true })}
                      className={errors.familyMembers?.female ? "border-destructive" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="total">Total Members</Label>
                    <Input
                      id="total"
                      type="number"
                      readOnly
                      value={male + female}
                      className="bg-muted"
                    />
                  </div>
                </div>
                
                {errors.familyMembers?.total && (
                  <p className="text-sm text-destructive">{errors.familyMembers.total.message}</p>
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