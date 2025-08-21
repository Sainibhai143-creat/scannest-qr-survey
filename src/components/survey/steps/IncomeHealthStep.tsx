import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Briefcase, Heart, Shield, Building2 } from "lucide-react";

const incomeHealthSchema = z.object({
  incomeSource: z.enum(["business", "privateJob", "governmentJob"]),
  governmentJobDetails: z.object({
    department: z.string(),
    designation: z.string(),
    employeeId: z.string(),
  }).optional(),
  hasDisability: z.boolean(),
  disabilityDetails: z.string().optional(),
  hasHealthInsurance: z.boolean(),
  healthInsuranceProvider: z.string().optional(),
});

interface IncomeHealthStepProps {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export const IncomeHealthStep = ({ data, onNext, onPrevious }: IncomeHealthStepProps) => {
  const form = useForm<z.infer<typeof incomeHealthSchema>>({
    resolver: zodResolver(incomeHealthSchema),
    defaultValues: {
      incomeSource: data.incomeSource || "business",
      governmentJobDetails: data.governmentJobDetails || {
        department: "",
        designation: "",
        employeeId: "",
      },
      hasDisability: data.hasDisability || false,
      disabilityDetails: data.disabilityDetails || "",
      hasHealthInsurance: data.hasHealthInsurance || false,
      healthInsuranceProvider: data.healthInsuranceProvider || "",
    },
  });

  const watchIncomeSource = form.watch("incomeSource");
  const watchHasDisability = form.watch("hasDisability");
  const watchHasHealthInsurance = form.watch("hasHealthInsurance");

  const onSubmit = (values: z.infer<typeof incomeHealthSchema>) => {
    // Clean up conditional fields
    const cleanedData = {
      ...values,
      governmentJobDetails: values.incomeSource === "governmentJob" ? values.governmentJobDetails : undefined,
      disabilityDetails: values.hasDisability ? values.disabilityDetails : undefined,
      healthInsuranceProvider: values.hasHealthInsurance ? values.healthInsuranceProvider : undefined,
    };
    onNext(cleanedData);
  };

  const incomeSourceOptions = [
    { value: "business", label: "Business", icon: Briefcase },
    { value: "privateJob", label: "Private Job", icon: Building2 },
    { value: "governmentJob", label: "Government Job", icon: Shield },
  ];

  return (
    <Card className="fade-in-up">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-gradient">Income & Health Information</CardTitle>
        <CardDescription>Final details about income source and health</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Income Source */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Income & Occupation
              </h3>
              
              <FormField
                control={form.control}
                name="incomeSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source of Income</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="input-glow">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {incomeSourceOptions.map(({ value, label, icon: Icon }) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Government Job Details */}
              {watchIncomeSource === "governmentJob" && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-medium text-sm">Government Job Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="governmentJobDetails.department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Ministry of Health"
                              {...field}
                              className="input-glow"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="governmentJobDetails.designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Senior Officer"
                              {...field}
                              className="input-glow"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="governmentJobDetails.employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., EMP123456"
                              {...field}
                              className="input-glow"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Health Information */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Health Information
              </h3>

              <FormField
                control={form.control}
                name="hasDisability"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Disability in Family
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Is there anyone with disability in your family?
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchHasDisability && (
                <FormField
                  control={form.control}
                  name="disabilityDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disability Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide details about the disability..."
                          className="input-glow"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="hasHealthInsurance"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Health Insurance
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Do you have health insurance coverage?
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchHasHealthInsurance && (
                <FormField
                  control={form.control}
                  name="healthInsuranceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Provider</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., LIC, HDFC ERGO, Star Health"
                          {...field}
                          className="input-glow"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onPrevious} className="flex-1">
                Previous
              </Button>
              <Button type="submit" className="flex-1 button-glow">
                Complete Survey
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};