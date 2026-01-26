// Institution Model
// Represents research institutions in the frontend

export interface Institution {
  id: number;
  name: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  projects?: Project[];
}

// Placeholder for Project to avoid circular dependency
interface Project {
  id: number;
  name: string;
  source: string;
  isActive: boolean;
}
