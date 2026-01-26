// Purchase Request Model
// Represents purchase requests with status lifecycle

export enum PurchaseRequestStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DELIVERED = 'DELIVERED'
}

export interface PurchaseRequest {
  id: number;
  itemName: string;
  description?: string;
  quantity: number;
  estimatedPrice: number;
  totalPrice?: number;
  status: PurchaseRequestStatus;
  projectId: number;
  requestedById: number;
  reviewedById?: number;
  reviewedAt?: Date;
  deliveredAt?: Date;
  rejectionReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Associated data
  project?: {
    id: number;
    name: string;
    source: string;
    budget?: number;
  };
  requester?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
  };
  reviewer?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
  };
}

// Helper function to get status label
export function getStatusLabel(status: PurchaseRequestStatus): string {
  switch (status) {
    case PurchaseRequestStatus.DRAFT:
      return 'Draft';
    case PurchaseRequestStatus.PENDING:
      return 'Pending Approval';
    case PurchaseRequestStatus.APPROVED:
      return 'Approved';
    case PurchaseRequestStatus.REJECTED:
      return 'Rejected';
    case PurchaseRequestStatus.DELIVERED:
      return 'Delivered';
    default:
      return status;
  }
}

// Helper function to get status color for UI
export function getStatusColor(status: PurchaseRequestStatus): string {
  switch (status) {
    case PurchaseRequestStatus.DRAFT:
      return 'gray';
    case PurchaseRequestStatus.PENDING:
      return 'orange';
    case PurchaseRequestStatus.APPROVED:
      return 'green';
    case PurchaseRequestStatus.REJECTED:
      return 'red';
    case PurchaseRequestStatus.DELIVERED:
      return 'blue';
    default:
      return 'gray';
  }
}
