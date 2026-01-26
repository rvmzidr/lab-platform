// Institution Service
// Handles all HTTP requests for institution operations

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Institution } from '../models/institution.model';

const API_URL = 'http://localhost:8080/api/institutions/';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
  constructor(private http: HttpClient) {}

  // Get all institutions
  getAllInstitutions(): Observable<any> {
    return this.http.get(API_URL);
  }

  // Get institution by ID
  getInstitutionById(id: number): Observable<any> {
    return this.http.get(API_URL + id);
  }

  // Create new institution
  createInstitution(institution: Partial<Institution>): Observable<any> {
    return this.http.post(API_URL, institution);
  }

  // Update institution
  updateInstitution(id: number, institution: Partial<Institution>): Observable<any> {
    return this.http.put(API_URL + id, institution);
  }

  // Delete institution
  deleteInstitution(id: number): Observable<any> {
    return this.http.delete(API_URL + id);
  }
}
