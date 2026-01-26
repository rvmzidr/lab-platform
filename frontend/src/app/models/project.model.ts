// Project Model
// Represents research projects in the frontend

export interface Project {
  id: number;
  name: string;
  source: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  institutionId: number;
  projectManagerId?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Associated data
  institution?: {
    id: number;
    name: string;
  };
  projectManager?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  purchaseRequests?: PurchaseRequest[];
}

// Placeholder for PurchaseRequest to avoid circular dependency
interface PurchaseRequest {
  id: number;
  status: string;
}
