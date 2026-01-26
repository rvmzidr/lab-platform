// Purchase Requests Component TypeScript
// Manages purchase request listing, creation, filtering, and status transitions

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseRequestService } from '../../services/purchase-request.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { PurchaseRequest, PurchaseRequestStatus, getStatusLabel, getStatusColor } from '../../models/purchase-request.model';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-purchase-requests',
  templateUrl: './purchase-requests.component.html',
  styleUrls: ['./purchase-requests.component.css']
})
export class PurchaseRequestsComponent implements OnInit {
  purchaseRequests: PurchaseRequest[] = [];
  projects: Project[] = [];
  loading = false;
  error = '';
  success = '';
  
  // Filter state
  filterStatus: PurchaseRequestStatus | '' = '';
  filterProjectId: number | undefined = undefined;
  
  // Modal state
  showCreateModal = false;
  showRejectModal = false;
  selectedRequestId: number | undefined = undefined;
  rejectionReason = '';
  
  // Form data
  newRequest = {
    itemName: '',
    description: '',
    quantity: 1,
    estimatedPrice: 0,
    projectId: undefined as number | undefined,
    notes: ''
  };
  
  // Current user info
  currentUser: any = null;
  isAdmin = false;
  
  // Status enum for template
  StatusEnum = PurchaseRequestStatus;

  constructor(
    private purchaseRequestService: PurchaseRequestService,
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'admin';
    this.loadPurchaseRequests();
    this.loadProjects();
  }

  loadPurchaseRequests(): void {
    this.loading = true;
    this.error = '';
    
    const filters: any = {};
    if (this.filterStatus) filters.status = this.filterStatus;
    if (this.filterProjectId) filters.projectId = this.filterProjectId;

    this.purchaseRequestService.getAllPurchaseRequests(filters).subscribe({
      next: (response) => {
        if (response.success) {
          this.purchaseRequests = response.data;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load purchase requests: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        if (response.success) {
          this.projects = response.data;
        }
      },
      error: (err) => {
        console.error('Failed to load projects:', err);
      }
    });
  }

  applyFilters(): void {
    this.loadPurchaseRequests();
  }

  clearFilters(): void {
    this.filterStatus = '';
    this.filterProjectId = undefined;
    this.loadPurchaseRequests();
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.resetForm();
    this.error = '';
    this.success = '';
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newRequest = {
      itemName: '',
      description: '',
      quantity: 1,
      estimatedPrice: 0,
      projectId: undefined,
      notes: ''
    };
  }

  createPurchaseRequest(): void {
    if (!this.newRequest.itemName || !this.newRequest.projectId || this.newRequest.estimatedPrice < 0) {
      this.error = 'Please fill in all required fields correctly';
      return;
    }

    this.loading = true;
    this.error = '';

    this.purchaseRequestService.createPurchaseRequest(this.newRequest).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = 'Purchase request created successfully!';
          this.loadPurchaseRequests();
          setTimeout(() => {
            this.closeCreateModal();
            this.success = '';
          }, 1500);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to create purchase request: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  submitForApproval(id: number): void {
    if (!confirm('Submit this request for approval? You won\'t be able to edit it after submission.')) {
      return;
    }

    this.purchaseRequestService.submitPurchaseRequest(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = 'Request submitted for approval successfully';
          this.loadPurchaseRequests();
          setTimeout(() => this.success = '', 3000);
        }
      },
      error: (err) => {
        this.error = 'Failed to submit request: ' + (err.error?.message || err.message);
      }
    });
  }

  approveRequest(id: number): void {
    if (!confirm('Approve this purchase request?')) {
      return;
    }

    this.purchaseRequestService.approvePurchaseRequest(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = 'Request approved successfully';
          this.loadPurchaseRequests();
          setTimeout(() => this.success = '', 3000);
        }
      },
      error: (err) => {
        this.error = 'Failed to approve request: ' + (err.error?.message || err.message);
      }
    });
  }

  openRejectModal(id: number): void {
    this.selectedRequestId = id;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedRequestId = undefined;
    this.rejectionReason = '';
  }

  rejectRequest(): void {
    if (!this.selectedRequestId) return;

    this.purchaseRequestService.rejectPurchaseRequest(this.selectedRequestId, this.rejectionReason).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = 'Request rejected successfully';
          this.loadPurchaseRequests();
          this.closeRejectModal();
          setTimeout(() => this.success = '', 3000);
        }
      },
      error: (err) => {
        this.error = 'Failed to reject request: ' + (err.error?.message || err.message);
      }
    });
  }

  markAsDelivered(id: number): void {
    if (!confirm('Mark this request as delivered?')) {
      return;
    }

    this.purchaseRequestService.markAsDelivered(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = 'Request marked as delivered successfully';
          this.loadPurchaseRequests();
          setTimeout(() => this.success = '', 3000);
        }
      },
      error: (err) => {
        this.error = 'Failed to mark as delivered: ' + (err.error?.message || err.message);
      }
    });
  }

  deleteRequest(id: number): void {
    if (!confirm('Are you sure you want to delete this purchase request?')) {
      return;
    }

    this.purchaseRequestService.deletePurchaseRequest(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = 'Request deleted successfully';
          this.loadPurchaseRequests();
          setTimeout(() => this.success = '', 3000);
        }
      },
      error: (err) => {
        this.error = 'Failed to delete request: ' + (err.error?.message || err.message);
      }
    });
  }

  getStatusLabel(status: PurchaseRequestStatus): string {
    return getStatusLabel(status);
  }

  getStatusColor(status: PurchaseRequestStatus): string {
    return getStatusColor(status);
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  canSubmit(request: PurchaseRequest): boolean {
    return request.status === PurchaseRequestStatus.DRAFT;
  }

  canApprove(request: PurchaseRequest): boolean {
    return this.isAdmin && request.status === PurchaseRequestStatus.PENDING;
  }

  canReject(request: PurchaseRequest): boolean {
    return this.isAdmin && request.status === PurchaseRequestStatus.PENDING;
  }

  canDeliver(request: PurchaseRequest): boolean {
    return this.isAdmin && request.status === PurchaseRequestStatus.APPROVED;
  }

  canDelete(request: PurchaseRequest): boolean {
    return this.isAdmin;
  }

  goBack(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
