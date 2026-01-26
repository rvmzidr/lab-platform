// Dashboard Component TypeScript
// Protected landing page displaying user profile and navigation
// Shows role-based Quick Access cards

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get current user from auth service
    this.currentUser = this.authService.getCurrentUser();

    // If no user found (shouldn't happen due to auth guard), redirect to login
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Handle logout button click
   * Clears authentication and redirects to login
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Get display name for role
   * Converts role enum to user-friendly name
   */
  getRoleDisplayName(): string {
    switch (this.currentUser?.role) {
      case 'admin':
        return 'Lab Head (Administrator)';
      case 'member':
        return 'Lab Member';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get role-specific description
   */
  getRoleDescription(): string {
    switch (this.currentUser?.role) {
      case 'admin':
        return 'Full access to all projects, purchase requests, and scientific articles. Can supervise and validate all operations.';
      case 'member':
        return 'Can view assigned projects and access scientific articles.';
      default:
        return '';
    }
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  /**
   * Check if user is member
   */
  isMember(): boolean {
    return this.currentUser?.role === 'member';
  }
}
