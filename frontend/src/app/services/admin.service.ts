// Admin Service - Manages user approval workflow and user management
// Available only to Lab Head (Admin role)

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const API_URL = `${environment.apiUrl}/api/admin/`;

export interface UserWithApprover {
  id: number;
  firstName: string;
  lastName: string;
  nationalId: string;
  email: string;
  role: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISABLED';
  rejectionReason?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  approver?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {}

  // Get all users with optional status filter
  getAllUsers(status?: string): Observable<UserWithApprover[]> {
    const url = status ? `${API_URL}users?status=${status}` : `${API_URL}users`;
    return this.http.get<ApiResponse<UserWithApprover[]>>(url).pipe(
      map(response => response.data || [])
    );
  }

  // Get single user details
  getUserById(userId: number): Observable<UserWithApprover> {
    return this.http.get<ApiResponse<UserWithApprover>>(`${API_URL}users/${userId}`).pipe(
      map(response => response.data!)
    );
  }

  // Approve a pending user
  approveUser(userId: number): Observable<{ message: string }> {
    return this.http.patch<ApiResponse<any>>(`${API_URL}users/${userId}/approve`, {}).pipe(
      map(response => ({ message: response.message }))
    );
  }

  // Reject a pending user with reason
  rejectUser(userId: number, reason: string): Observable<{ message: string }> {
    return this.http.patch<ApiResponse<any>>(`${API_URL}users/${userId}/reject`, { rejectionReason: reason }).pipe(
      map(response => ({ message: response.message }))
    );
  }

  // Disable an approved user (temporarily block access)
  disableUser(userId: number): Observable<{ message: string }> {
    return this.http.patch<ApiResponse<any>>(`${API_URL}users/${userId}/disable`, {}).pipe(
      map(response => ({ message: response.message }))
    );
  }

  // Re-enable a disabled user
  enableUser(userId: number): Observable<{ message: string }> {
    return this.http.patch<ApiResponse<any>>(`${API_URL}users/${userId}/enable`, {}).pipe(
      map(response => ({ message: response.message }))
    );
  }

  // Promote user to different role
  promoteUser(userId: number, newRole: string): Observable<{ message: string }> {
    return this.http.patch<ApiResponse<any>>(`${API_URL}users/${userId}/promote`, { newRole }).pipe(
      map(response => ({ message: response.message }))
    );
  }
}
