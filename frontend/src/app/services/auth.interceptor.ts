// HTTP Interceptor
// Automatically attaches JWT token to all outgoing HTTP requests
// Handles token expiration and redirects to login

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get JWT token from auth service
    const token = this.authService.getToken();

    // Clone request and add Authorization header if token exists
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Handle response and catch errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Token expired or invalid (401 Unauthorized)
        if (error.status === 401) {
          // Logout user and redirect to login
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        // Access denied (403 Forbidden)
        if (error.status === 403) {
          console.error('Access denied: Insufficient permissions');
        }

        return throwError(() => error);
      })
    );
  }
}
