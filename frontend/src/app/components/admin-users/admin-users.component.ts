// Admin Users Management Component
// Displays all users with ability to approve, reject, disable, enable, and promote

import { Component, OnInit } from '@angular/core';
import { AdminService, UserWithApprover } from '../../services/admin.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  users: UserWithApprover[] = [];
  filteredUsers: UserWithApprover[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Filter state
  filterStatus: string = 'all';
  searchTerm: string = '';

  // Modal state for rejection
  showRejectModal = false;
  rejectUserId: number | null = null;
  rejectionReason = '';

  // Modal state for promotion
  showPromoteModal = false;
  promoteUserId: number | null = null;
  newRole = 'member';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const statusFilter = this.filterStatus !== 'all' ? this.filterStatus : undefined;

    this.adminService.getAllUsers(statusFilter).subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesSearch;
    });
  }

  onFilterChange(): void {
    this.loadUsers();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  // Approve user
  approveUser(userId: number): void {
    if (!confirm('Approve this user?')) return;

    this.adminService.approveUser(userId).subscribe({
      next: () => {
        this.successMessage = 'User approved successfully';
        this.loadUsers();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to approve user';
      }
    });
  }

  // Open reject modal
  openRejectModal(userId: number): void {
    this.rejectUserId = userId;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  // Confirm rejection
  confirmReject(): void {
    if (!this.rejectUserId || !this.rejectionReason.trim()) {
      alert('Rejection reason is required');
      return;
    }

    this.adminService.rejectUser(this.rejectUserId, this.rejectionReason).subscribe({
      next: () => {
        this.successMessage = 'User rejected';
        this.showRejectModal = false;
        this.loadUsers();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to reject user';
        this.showRejectModal = false;
      }
    });
  }

  // Disable user
  disableUser(userId: number): void {
    if (!confirm('Disable this user? They will not be able to login.')) return;

    this.adminService.disableUser(userId).subscribe({
      next: () => {
        this.successMessage = 'User disabled';
        this.loadUsers();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to disable user';
      }
    });
  }

  // Enable user
  enableUser(userId: number): void {
    if (!confirm('Re-enable this user?')) return;

    this.adminService.enableUser(userId).subscribe({
      next: () => {
        this.successMessage = 'User enabled';
        this.loadUsers();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to enable user';
      }
    });
  }

  // Open promote modal
  openPromoteModal(userId: number, currentRole: string): void {
    this.promoteUserId = userId;
    this.newRole = currentRole === 'member' ? 'admin' : 'member';
    this.showPromoteModal = true;
  }

  // Confirm promotion
  confirmPromote(): void {
    if (!this.promoteUserId) return;

    this.adminService.promoteUser(this.promoteUserId, this.newRole).subscribe({
      next: () => {
        this.successMessage = 'User role updated';
        this.showPromoteModal = false;
        this.loadUsers();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update role';
        this.showPromoteModal = false;
      }
    });
  }

  // Get status badge class
  getStatusClass(status: string): string {
    switch(status) {
      case 'PENDING': return 'status-pending';
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      case 'DISABLED': return 'status-disabled';
      default: return '';
    }
  }

  // Get role display text
  getRoleDisplay(role: string): string {
    switch(role) {
      case 'admin': return 'Lab Head';
      case 'member': return 'Lab Member';
      default: return role;
    }
  }
}
