// Login Component TypeScript
// Handles user authentication form and login process

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Form model - Pre-filled with admin credentials for testing
  credentials: LoginRequest = {
    email: 'admin@lab.com',
    password: 'admin123'
  };

  // UI state
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect to dashboard if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Handle login form submission
   * Calls auth service and navigates to dashboard on success
   */
  onSubmit(): void {
    // Clear previous error
    this.errorMessage = '';

    // Validate form
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    // Set loading state
    this.loading = true;

    // Call login service
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response.success) {
          // Login successful, navigate to dashboard
          console.log('Login successful:', response.data.user);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);
        
        // Display error message from backend or generic message
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An error occurred during login. Please try again.';
        }
      }
    });
  }
}
