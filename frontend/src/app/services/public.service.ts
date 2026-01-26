import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LabInfo, Team } from '../models/lab-info.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private apiUrl = `${environment.apiUrl}/api/public`;

  constructor(private http: HttpClient) {}

  getLabInfo(): Observable<LabInfo> {
    return this.http.get<LabInfo>(`${this.apiUrl}/lab-info`);
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/teams`);
  }

  getTeamById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/teams/${id}`);
  }
}
