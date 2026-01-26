// Purchase Request Service
// Handles all HTTP requests for purchase request operations

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseRequest, PurchaseRequestStatus } from '../models/purchase-request.model';

const API_URL = 'http://localhost:8080/api/purchase-requests/';

@Injectable({
  providedIn: 'root'
})
export class PurchaseRequestService {
  constructor(private http: HttpClient) {}

  // Get all purchase requests with optional filtering
  getAllPurchaseRequests(filters?: {
    status?: PurchaseRequestStatus;
    projectId?: number;
    requestedById?: number;
    startDate?: string;
    endDate?: string;
  }): Observable<any> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.projectId) {
        params = params.set('projectId', filters.projectId.toString());
      }
      if (filters.requestedById) {
        params = params.set('requestedById', filters.requestedById.toString());
      }
      if (filters.startDate) {
        params = params.set('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params = params.set('endDate', filters.endDate);
      }
    }

    return this.http.get(API_URL, { params });
  }

  // Get purchase request by ID
  getPurchaseRequestById(id: number): Observable<any> {
    return this.http.get(API_URL + id);
  }

  // Create new purchase request
  createPurchaseRequest(request: Partial<PurchaseRequest>): Observable<any> {
    return this.http.post(API_URL, request);
  }

  // Update purchase request (only DRAFT status)
  updatePurchaseRequest(id: number, request: Partial<PurchaseRequest>): Observable<any> {
    return this.http.put(API_URL + id, request);
  }

  // Submit for approval (DRAFT → PENDING)
  submitPurchaseRequest(id: number): Observable<any> {
    return this.http.post(API_URL + id + '/submit', {});
  }

  // Approve request (Admin only, PENDING → APPROVED)
  approvePurchaseRequest(id: number): Observable<any> {
    return this.http.post(API_URL + id + '/approve', {});
  }

  // Reject request (Admin only, PENDING → REJECTED)
  rejectPurchaseRequest(id: number, rejectionReason?: string): Observable<any> {
    return this.http.post(API_URL + id + '/reject', { rejectionReason });
  }

  // Mark as delivered (Admin only, APPROVED → DELIVERED)
  markAsDelivered(id: number): Observable<any> {
    return this.http.post(API_URL + id + '/deliver', {});
  }

  // Delete purchase request
  deletePurchaseRequest(id: number): Observable<any> {
    return this.http.delete(API_URL + id);
  }
}
