// Authentication Service
// Handles login, signup, token management, and current user information

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Backend API base URL
  private readonly API_URL = `${environment.apiUrl}/api/auth`;
  
  // Token storage key
  private readonly TOKEN_KEY = 'lab_platform_token';
  private readonly USER_KEY = 'lab_platform_user';
  
  // Current user observable for reactive components
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private http: HttpClient) {
    // Initialize current user from localStorage
    const storedUser = localStorage.getItem(this.USER_KEY);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * User Login
   * Sends credentials to backend, stores token and user info on success
   * @param credentials - Email and password
   * @returns Observable with login response
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/signin`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            // Store JWT token in localStorage
            localStorage.setItem(this.TOKEN_KEY, response.data.token);
            
            // Store user information for profile display
            localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user));
            
            // Update current user observable
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  /**
   * User Registration
   * Creates new user account on backend
   * @param userData - User registration details
   * @returns Observable with signup response
   */
  signup(userData: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.API_URL}/signup`, userData);
  }

  /**
   * Register new user (alias for signup)
   * Creates PENDING user account awaiting approval
   * @param userData - User registration data
   * @returns Observable with registration response
   */
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/signup`, userData);
  }

  /**
   * Logout
   * Removes token and user info from localStorage
   * Clears current user observable
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  /**
   * Get JWT Token
   * Retrieves stored JWT token for API requests
   * @returns JWT token string or null
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check Authentication Status
   * Verifies if user is currently logged in
   * @returns True if token exists, false otherwise
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Get Current User
   * Returns current user information from observable
   * @returns User object or null
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get Current User Role
   * Returns role of currently logged in user
   * @returns User role string or null
   */
  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  /**
   * Check if current user is Admin
   * @returns True if user has admin role
   */
  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'admin';
  }

  /**
   * Check if current user is Admin
   * @returns True if user has admin role
   */
  isProjectManager(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'admin';
  }
}
