import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article, ArticleFilters } from '../models/article.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private API_URL = `${environment.apiUrl}/api/articles/`;

  constructor(private http: HttpClient) {}

  /**
   * Get all public articles (no authentication required)
   * Used for homepage and public article listing
   */
  getPublicArticles(filters?: ArticleFilters): Observable<any> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.year) params = params.set('year', filters.year.toString());
      if (filters.teamId) params = params.set('teamId', filters.teamId.toString());
      if (filters.search) params = params.set('search', filters.search);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get(this.API_URL + 'public', { params });
  }

  /**
   * Get all articles (authenticated users)
   * Members see published articles, admins see all
   */
  getAllArticles(filters?: ArticleFilters): Observable<any> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.visibility) params = params.set('visibility', filters.visibility);
      if (filters.teamId) params = params.set('teamId', filters.teamId.toString());
      if (filters.projectId) params = params.set('projectId', filters.projectId.toString());
      if (filters.year) params = params.set('year', filters.year.toString());
      if (filters.search) params = params.set('search', filters.search);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get(this.API_URL, { params });
  }

  /**
   * Get article by ID
   */
  getById(id: number): Observable<any> {
    return this.http.get(this.API_URL + id);
  }

  /**
   * Get articles by project ID
   */
  getByProject(projectId: number, isPublic: boolean = false): Observable<any> {
    const endpoint = isPublic 
      ? this.API_URL + 'public/project/' + projectId
      : this.API_URL + 'project/' + projectId;
    return this.http.get(endpoint);
  }

  /**
   * Get articles by team ID
   */
  getByTeam(teamId: number, isPublic: boolean = false): Observable<any> {
    const endpoint = isPublic 
      ? this.API_URL + 'public/team/' + teamId
      : this.API_URL + 'team/' + teamId;
    return this.http.get(endpoint);
  }

  /**
   * Create new article (Admin only)
   */
  create(articleData: Partial<Article>): Observable<any> {
    return this.http.post(this.API_URL, articleData);
  }

  /**
   * Update article (Admin only)
   */
  update(id: number, articleData: Partial<Article>): Observable<any> {
    return this.http.put(this.API_URL + id, articleData);
  }

  /**
   * Delete article (Admin only)
   */
  delete(id: number): Observable<any> {
    return this.http.delete(this.API_URL + id);
  }

  /**
   * Get article statistics (Admin only)
   */
  getStats(): Observable<any> {
    return this.http.get(this.API_URL + 'admin/stats');
  }

  /**
   * Helper method to format author names for display
   */
  formatAuthors(authors: string, maxLength: number = 50): string {
    if (!authors) return 'Unknown';
    if (authors.length <= maxLength) return authors;
    return authors.substring(0, maxLength) + '...';
  }

  /**
   * Helper method to extract publication year from date
   */
  getPublicationYear(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear().toString();
  }

  /**
   * Helper method to format DOI as clickable link
   */
  getDoiUrl(doi?: string): string | null {
    if (!doi) return null;
    // Remove 'doi:' prefix if present
    const cleanDoi = doi.replace(/^doi:\s*/i, '');
    return `https://doi.org/${cleanDoi}`;
  }

  /**
   * Helper method to get status badge class
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'published': return 'badge-success';
      case 'draft': return 'badge-warning';
      case 'archived': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }

  /**
   * Helper method to get visibility badge class
   */
  getVisibilityClass(visibility: string): string {
    switch (visibility) {
      case 'public': return 'badge-primary';
      case 'members_only': return 'badge-info';
      default: return 'badge-secondary';
    }
  }
}
