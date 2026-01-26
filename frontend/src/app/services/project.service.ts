// Project Service
// Handles all HTTP requests for project operations

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

const API_URL = 'http://localhost:8080/api/projects/';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  // Get all projects with optional filtering
  getAllProjects(filters?: {
    institutionId?: number;
    projectManagerId?: number;
    isActive?: boolean;
  }): Observable<any> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.institutionId) {
        params = params.set('institutionId', filters.institutionId.toString());
      }
      if (filters.projectManagerId) {
        params = params.set('projectManagerId', filters.projectManagerId.toString());
      }
      if (filters.isActive !== undefined) {
        params = params.set('isActive', filters.isActive.toString());
      }
    }

    return this.http.get(API_URL, { params });
  }

  // Get project by ID
  getProjectById(id: number): Observable<any> {
    return this.http.get(API_URL + id);
  }

  // Create new project
  createProject(project: Partial<Project>): Observable<any> {
    return this.http.post(API_URL, project);
  }

  // Update project
  updateProject(id: number, project: Partial<Project>): Observable<any> {
    return this.http.put(API_URL + id, project);
  }

  // Delete project
  deleteProject(id: number): Observable<any> {
    return this.http.delete(API_URL + id);
  }
}
