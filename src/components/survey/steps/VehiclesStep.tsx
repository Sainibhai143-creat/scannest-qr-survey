import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Car, Fuel, Plus, X, Calendar } from "lucide-react";

const vehicleSchema = z.object({
  type: z.string().min(1, "Vehicle type is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  fuelType: z.enum(["petrol", "diesel", "electric", "cng"]),
  modelYear: z.number().min(1990).max(new Date().getFullYear()),
});

interface VehiclesStepProps {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export const VehiclesStep = ({ data, onNext, onPrevious }: VehiclesStepProps) => {
  const [vehicles, setVehicles] = useState(data.vehicles || []);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      type: "",
      registrationNumber: "",
      fuelType: "petrol",
      modelYear: new Date().getFullYear(),
    },
  });

  const onSubmit = (values: z.infer<typeof vehicleSchema>) => {
    setVehicles([...vehicles, values]);
    form.reset();
    setIsAddingVehicle(false);
  };

  const removeVehicle = (index: number) => {
    setVehicles(vehicles.filter((_: any, i: number) => i !== index));
  };

  const handleNext = () => {
    onNext({ vehicles });
  };

  const vehicleTypes = [
    "Car", "Motorcycle", "Scooter", "Bicycle", "Truck", "Bus", "Auto Rickshaw", "Tractor"
  ];

  const fuelTypes = [
    { value: "petrol", label: "Petrol" },
    { value: "diesel", label: "Diesel" },
    { value: "electric", label: "Electric" },
    { value: "cng", label: "CNG" },
  ];

  return (
    <Card className="fade-in-up">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-gradient">Vehicle Details</CardTitle>
        <CardDescription>Add information about your vehicles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Vehicles */}
        {vehicles.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" />
              Your Vehicles ({vehicles.length})
            </h3>
            <div className="space-y-2">
              {vehicles.map((vehicle: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{vehicle.type}</Badge>
                      <Badge variant="secondary">{vehicle.fuelType}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.registrationNumber} • {vehicle.modelYear}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeVehicle(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Vehicle Form */}
        {!isAddingVehicle ? (
          <Button
            variant="outline"
            onClick={() => setIsAddingVehicle(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        ) : (
          <div className="border rounded-lg p-4 bg-muted/30">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="input-glow">
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vehicleTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., DL-01-AB-1234"
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
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Fuel className="h-4 w-4" />
                          Fuel Type
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="input-glow">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fuelTypes.map((fuel) => (
                              <SelectItem key={fuel.value} value={fuel.value}>
                                {fuel.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="modelYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Model Year
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1990"
                            max={new Date().getFullYear()}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="input-glow"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingVehicle(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Add Vehicle
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onPrevious} className="flex-1">
            Previous
          </Button>
          <Button onClick={handleNext} className="flex-1 button-glow">
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
