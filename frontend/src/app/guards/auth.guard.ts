// Authentication Guard
// Protects routes from unauthenticated access
// Redirects to login page if user is not authenticated

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if user is authenticated
    if (this.authService.isAuthenticated()) {
      return true;  // Allow access to route
    }

    // User not authenticated, redirect to login
    // Save attempted URL for redirecting after login
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    
    return false;  // Block access to route
  }
}
