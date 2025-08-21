import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  User, Mail, Phone, MapPin, Home, Users, 
  Zap, Car, Briefcase, Heart, ArrowLeft 
} from "lucide-react";
import { SurveyData } from "@/types/survey";

interface SurveyDataDisplayProps {
  surveyData: SurveyData;
  onBack: () => void;
}

export const SurveyDataDisplay = ({ surveyData, onBack }: SurveyDataDisplayProps) => {
  return (
    <div className="min-h-screen gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 fade-in-up">
            <h1 className="text-4xl font-bold text-gradient mb-2">Survey Data</h1>
            <p className="text-lg text-muted-foreground">
              Household information for {surveyData.name}
            </p>
          </div>

          {/* Data Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card className="shadow-elegant slide-in-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Name:</span>
                  <span>{surveyData.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span>{surveyData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <span>{surveyData.phoneNumber}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <span className="font-medium">Address:</span>
                    <p className="text-muted-foreground mt-1">{surveyData.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* House & Family Details */}
            <Card className="shadow-elegant slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  House & Family
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">House No:</span>
                  <span>{surveyData.houseNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Ownership:</span>
                  <Badge variant={surveyData.ownership === 'owner' ? 'default' : 'secondary'}>
                    {surveyData.ownership === 'owner' ? 'Owner' : 'Resident'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Family:</span>
                  <span>
                    {surveyData.familyMembers?.male || 0} Male, {surveyData.familyMembers?.female || 0} Female 
                    (Total: {surveyData.familyMembers?.total || 0})
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Appliances */}
            {surveyData.appliances && (
              <Card className="shadow-elegant slide-in-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Home Appliances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex justify-between">
                      <span>Fans:</span>
                      <Badge variant="outline">{surveyData.appliances.fans || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Lights:</span>
                      <Badge variant="outline">{surveyData.appliances.lights || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>AC:</span>
                      <Badge variant="outline">{surveyData.appliances.ac || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Refrigerator:</span>
                      <Badge variant="outline">{surveyData.appliances.refrigerator || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Washing Machine:</span>
                      <Badge variant="outline">{surveyData.appliances.washingMachine || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Geyser:</span>
                      <Badge variant="outline">{surveyData.appliances.geyser || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Microwave:</span>
                      <Badge variant="outline">{surveyData.appliances.microwave || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Income & Occupation */}
            <Card className="shadow-elegant slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Income & Occupation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Income Source:</span>
                  <Badge variant="secondary">
                    {surveyData.incomeSource === 'business' ? 'Business' :
                     surveyData.incomeSource === 'privateJob' ? 'Private Job' : 'Government Job'}
                  </Badge>
                </div>
                {surveyData.governmentJobDetails && (
                  <div className="space-y-2 p-3 bg-muted rounded-lg">
                    <p className="font-medium text-sm">Government Job Details:</p>
                    <div className="text-sm space-y-1">
                      <div>Department: {surveyData.governmentJobDetails.department}</div>
                      <div>Designation: {surveyData.governmentJobDetails.designation}</div>
                      <div>Employee ID: {surveyData.governmentJobDetails.employeeId}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Information */}
            <Card className="shadow-elegant slide-in-left md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Health Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Disability in Family:</span>
                  <Badge variant={surveyData.hasDisability ? "destructive" : "default"}>
                    {surveyData.hasDisability ? "Yes" : "No"}
                  </Badge>
                  {surveyData.hasDisability && surveyData.disabilityDetails && (
                    <span className="text-muted-foreground">- {surveyData.disabilityDetails}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Health Insurance:</span>
                  <Badge variant={surveyData.hasHealthInsurance ? "default" : "secondary"}>
                    {surveyData.hasHealthInsurance ? "Yes" : "No"}
                  </Badge>
                  {surveyData.hasHealthInsurance && surveyData.healthInsuranceProvider && (
                    <span className="text-muted-foreground">- {surveyData.healthInsuranceProvider}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scanner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};