import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 fade-in-up">
            <h1 className="text-4xl font-bold text-gradient mb-2">Survey Data</h1>
            <p className="text-lg text-muted-foreground">
              Complete household information for {surveyData.fullName}
            </p>
          </div>

          {/* Comprehensive Data Table */}
          <Card className="shadow-elegant fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Complete Survey Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Field</TableHead>
                      <TableHead className="font-semibold">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Personal Information */}
                    <TableRow>
                      <TableCell rowSpan={5} className="font-medium border-r bg-muted/50">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Personal Information
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">Login Name</TableCell>
                      <TableCell>{surveyData.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Full Name</TableCell>
                      <TableCell>{surveyData.fullName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Email</TableCell>
                      <TableCell>{surveyData.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Phone Number</TableCell>
                      <TableCell>{surveyData.phoneNumber}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Address</TableCell>
                      <TableCell>{surveyData.address}</TableCell>
                    </TableRow>

                    {/* House & Family Details */}
                    <TableRow>
                      <TableCell rowSpan={5} className="font-medium border-r bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          House & Family
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">House Number</TableCell>
                      <TableCell>{surveyData.houseNumber}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Ownership</TableCell>
                      <TableCell>
                        <Badge variant={surveyData.ownership === 'owner' ? 'default' : 'secondary'}>
                          {surveyData.ownership === 'owner' ? 'Owner' : 'Resident'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Male Members</TableCell>
                      <TableCell><Badge variant="outline">{surveyData.familyMembers?.male || 0}</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Female Members</TableCell>
                      <TableCell><Badge variant="outline">{surveyData.familyMembers?.female || 0}</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Family Members</TableCell>
                      <TableCell><Badge variant="default">{surveyData.familyMembers?.total || 0}</Badge></TableCell>
                    </TableRow>

                    {/* Appliances */}
                    <TableRow>
                      <TableCell rowSpan={8} className="font-medium border-r bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Home Appliances
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">Fans</TableCell>
                      <TableCell><Badge variant="outline">{surveyData.appliances?.fans || 0}</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Lights</TableCell>
                      <TableCell><Badge variant="outline">{surveyData.appliances?.lights || 0}</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Air Conditioner</TableCell>
                      <TableCell><Badge variant="outline">{surveyData.appliances?.ac || 0}</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Refrigerator</TableCell>
                      <TableCell><Badge variant="outline">{surveyData.appliances?.refrigerator || 0}</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Washing Machine</TableCell>
                      <TableCell><Badge variant="outline">{surveyData.appliances?.washingMachine || 0}</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Geyser</TableCell>
                      <TableCell><Badge variant="outline">{surveyData.appliances?.geyser || 0}</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Microwave</TableCell>
                      <TableCell><Badge variant="outline">{surveyData.appliances?.microwave || 0}</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Other Appliances</TableCell>
                      <TableCell>
                        {surveyData.appliances?.others?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {surveyData.appliances.others.map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">{item}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                    </TableRow>

                    {/* Vehicles */}
                    <TableRow>
                      <TableCell rowSpan={Math.max(1, surveyData.vehicles?.length || 0)} className="font-medium border-r bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4" />
                          Vehicles
                        </div>
                      </TableCell>
                      {surveyData.vehicles && surveyData.vehicles.length > 0 ? (
                        <>
                          <TableCell className="font-medium">Vehicle 1</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div><Badge variant="default">{surveyData.vehicles[0].type}</Badge></div>
                              <div className="text-sm text-muted-foreground">
                                Reg: {surveyData.vehicles[0].registrationNumber} | 
                                Fuel: {surveyData.vehicles[0].fuelType} | 
                                Year: {surveyData.vehicles[0].modelYear}
                              </div>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="font-medium">Vehicles</TableCell>
                          <TableCell><span className="text-muted-foreground">No vehicles</span></TableCell>
                        </>
                      )}
                    </TableRow>
                    {surveyData.vehicles && surveyData.vehicles.slice(1).map((vehicle, index) => (
                      <TableRow key={index + 1}>
                        <TableCell className="font-medium">Vehicle {index + 2}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div><Badge variant="default">{vehicle.type}</Badge></div>
                            <div className="text-sm text-muted-foreground">
                              Reg: {vehicle.registrationNumber} | 
                              Fuel: {vehicle.fuelType} | 
                              Year: {vehicle.modelYear}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* Income & Occupation */}
                    <TableRow>
                      <TableCell rowSpan={surveyData.governmentJobDetails ? 5 : 2} className="font-medium border-r bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Income & Occupation
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">Income Source</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {surveyData.incomeSource === 'business' ? 'Business' :
                           surveyData.incomeSource === 'privateJob' ? 'Private Job' : 'Government Job'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Login ID</TableCell>
                      <TableCell>{surveyData.id}</TableCell>
                    </TableRow>
                    {surveyData.governmentJobDetails && (
                      <>
                        <TableRow>
                          <TableCell className="font-medium">Department</TableCell>
                          <TableCell>{surveyData.governmentJobDetails.department}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Designation</TableCell>
                          <TableCell>{surveyData.governmentJobDetails.designation}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Employee ID</TableCell>
                          <TableCell>{surveyData.governmentJobDetails.employeeId}</TableCell>
                        </TableRow>
                      </>
                    )}

                    {/* Health Information */}
                    <TableRow>
                      <TableCell rowSpan={2} className="font-medium border-r bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Health Information
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">Disability in Family</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={surveyData.hasDisability ? "destructive" : "default"}>
                            {surveyData.hasDisability ? "Yes" : "No"}
                          </Badge>
                          {surveyData.hasDisability && surveyData.disabilityDetails && (
                            <span className="text-sm text-muted-foreground">({surveyData.disabilityDetails})</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Health Insurance</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={surveyData.hasHealthInsurance ? "default" : "secondary"}>
                            {surveyData.hasHealthInsurance ? "Yes" : "No"}
                          </Badge>
                          {surveyData.hasHealthInsurance && surveyData.healthInsuranceProvider && (
                            <span className="text-sm text-muted-foreground">({surveyData.healthInsuranceProvider})</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

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