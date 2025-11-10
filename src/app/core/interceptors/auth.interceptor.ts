import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // Debug logging
  console.log('Auth Interceptor - URL:', req.url);
  console.log('Auth Interceptor - isAuthRequest:', isAuthRequest(req.url));
  // Skip auth header for login and register requests
  if (isAuthRequest(req.url)) {
    console.log('Auth Interceptor - Skipping auth header for:', req.url);
    return next(req);
  }

  // Add JWT token to requests
  const token = authService.getToken();
  console.log('Auth Interceptor - Token found:', !!token);
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set(
        environment.jwtConfig.headerName, 
        environment.jwtConfig.authScheme + token
      )
    });
    console.log('Auth Interceptor - Adding token to request');
    return next(authReq).pipe(
      catchError(error => {
        // Handle 401 errors by attempting token refresh
        if (error.status === 401 && !isRefreshRequest(req.url)) {
          return authService.refreshToken().pipe(
            switchMap(() => {
              
              // Retry the request with new token
              const newToken = authService.getToken();
              const retryReq = req.clone({
                headers: req.headers.set(
                  environment.jwtConfig.headerName, 
                  environment.jwtConfig.authScheme + newToken
                )
              });
              return next(retryReq);
            }),
            catchError(refreshError => {
              // Refresh failed, logout user
              authService.logout();
              return throwError(refreshError);
            })
          );
        }
        return throwError(error);
      })
    );
  }

  return next(req);
};

function isAuthRequest(url: string): boolean {
  return environment.jwtConfig.disallowedRoutes.some(route => url.includes(route));
}

function isRefreshRequest(url: string): boolean {
  return url.includes('/auth/refresh');
}

// Class-based interceptor for backward compatibility
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isAuthRequest(req.url)) {
      return next.handle(req);
    }

    const token = this.authService.getToken();
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set(
          environment.jwtConfig.headerName, 
          environment.jwtConfig.authScheme + token
        )
      });

      return next.handle(authReq).pipe(
        catchError(error => {
          if (error.status === 401 && !isRefreshRequest(req.url)) {
            return this.authService.refreshToken().pipe(
              switchMap(() => {
                const newToken = this.authService.getToken();
                const retryReq = req.clone({
                  headers: req.headers.set(
                    environment.jwtConfig.headerName, 
                    environment.jwtConfig.authScheme + newToken
                  )
                });
                return next.handle(retryReq);
              }),
              catchError(refreshError => {
                this.authService.logout();
                return throwError(refreshError);
              })
            );
          }
          return throwError(error);
        })
      );
    }

    return next.handle(req);
  }
}
