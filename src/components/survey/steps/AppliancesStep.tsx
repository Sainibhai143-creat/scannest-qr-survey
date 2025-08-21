import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Zap, Lightbulb, Snowflake, ChefHat, Wind, Droplets, Microwave, Plus, X } from "lucide-react";
import { useState } from "react";

const appliancesSchema = z.object({
  fans: z.number().min(0),
  lights: z.number().min(0),
  ac: z.number().min(0),
  refrigerator: z.number().min(0),
  washingMachine: z.number().min(0),
  geyser: z.number().min(0),
  microwave: z.number().min(0),
});

interface AppliancesStepProps {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export const AppliancesStep = ({ data, onNext, onPrevious }: AppliancesStepProps) => {
  const [otherAppliances, setOtherAppliances] = useState<string[]>(data.appliances?.others || []);
  const [newAppliance, setNewAppliance] = useState("");

  const form = useForm<z.infer<typeof appliancesSchema>>({
    resolver: zodResolver(appliancesSchema),
    defaultValues: {
      fans: data.appliances?.fans || 0,
      lights: data.appliances?.lights || 0,
      ac: data.appliances?.ac || 0,
      refrigerator: data.appliances?.refrigerator || 0,
      washingMachine: data.appliances?.washingMachine || 0,
      geyser: data.appliances?.geyser || 0,
      microwave: data.appliances?.microwave || 0,
    },
  });

  const onSubmit = (values: z.infer<typeof appliancesSchema>) => {
    const applianceData = {
      appliances: {
        ...values,
        others: otherAppliances,
      },
    };
    onNext(applianceData);
  };

  const addOtherAppliance = () => {
    if (newAppliance.trim() && !otherAppliances.includes(newAppliance.trim())) {
      setOtherAppliances([...otherAppliances, newAppliance.trim()]);
      setNewAppliance("");
    }
  };

  const removeOtherAppliance = (appliance: string) => {
    setOtherAppliances(otherAppliances.filter(item => item !== appliance));
  };

  const appliances = [
    { name: "fans", label: "Fans", icon: Wind },
    { name: "lights", label: "Lights", icon: Lightbulb },
    { name: "ac", label: "Air Conditioners", icon: Snowflake },
    { name: "refrigerator", label: "Refrigerator", icon: ChefHat },
    { name: "washingMachine", label: "Washing Machine", icon: Droplets },
    { name: "geyser", label: "Geyser", icon: Zap },
    { name: "microwave", label: "Microwave", icon: Microwave },
  ];

  return (
    <Card className="fade-in-up">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-gradient">Home Appliances</CardTitle>
        <CardDescription>Tell us about your household appliances</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appliances.map(({ name, label, icon: Icon }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof z.infer<typeof appliancesSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          className="input-glow"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Other Appliances</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add other appliance"
                    value={newAppliance}
                    onChange={(e) => setNewAppliance(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOtherAppliance())}
                    className="input-glow"
                  />
                  <Button
                    type="button"
                    onClick={addOtherAppliance}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {otherAppliances.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {otherAppliances.map((appliance, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {appliance}
                      <button
                        type="button"
                        onClick={() => removeOtherAppliance(appliance)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onPrevious} className="flex-1">
                Previous
              </Button>
              <Button type="submit" className="flex-1 button-glow">
                Next Step
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};