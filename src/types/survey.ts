export interface SurveyData {
  // Login Information
  name: string;
  email: string;
  id: string;
  password: string;
  
  // Contact Information  
  fullName: string;
  phoneNumber: string;
  address: string;
  
  // House & Family Details
  houseNumber: string;
  ownership: 'owner' | 'resident';
  familyMembers: {
    male: number;
    female: number;
    total: number;
  };
  
  // Appliances
  appliances: {
    fans: number;
    lights: number;
    ac: number;
    refrigerator: number;
    washingMachine: number;
    geyser: number;
    microwave: number;
    others: string[];
  };
  
  // Vehicle Details
  vehicles: Array<{
    type: string;
    registrationNumber: string;
    fuelType: 'petrol' | 'diesel' | 'electric' | 'cng';
    modelYear: number;
  }>;
  
  // Income & Occupation
  incomeSource: 'business' | 'privateJob' | 'governmentJob';
  governmentJobDetails?: {
    department: string;
    designation: string;
    employeeId: string;
  };
  
  // Health Information
  hasDisability: boolean;
  disabilityDetails?: string;
  hasHealthInsurance: boolean;
  healthInsuranceProvider?: string;
}

export interface SurveyStep {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
}