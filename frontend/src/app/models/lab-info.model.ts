export interface LabInfo {
  fullName: string;
  shortName: string;
  address: string;
  createdYear: number;
  mission: string;
  presentation: string;
  context: string;
  objectives: string;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface Team {
  id: number;
  name: string;
  description: string;
  expertise: string;
  objectives: string;
  order: number;
}
