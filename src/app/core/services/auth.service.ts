import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.getCurrentUser()
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/Auth/login`, credentials)
      .pipe(
        map((response: LoginResponse) => {
          if (response.token && typeof localStorage !== 'undefined') {
            // Store tokens
            localStorage.setItem(
              environment.jwtConfig.tokenKey,
              response.token
            );
            localStorage.setItem(
              environment.jwtConfig.refreshTokenKey,
              response.refreshToken
            );
            console.log(
              'Auth Service - Token stored:',
              response.token.substring(0, 20) + '...'
            );

            // Update current user
            this.currentUserSubject.next(response.user);

            // Navigate based on role
            this.navigateByRole(response.user.role);
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  register(userData: any): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/Auth/register`, userData)
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    // Remove tokens from localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(environment.jwtConfig.tokenKey);
      localStorage.removeItem(environment.jwtConfig.refreshTokenKey);
    }

    // Reset current user
    this.currentUserSubject.next(null);

    // Navigate to Auth
    this.router.navigate(['/Auth/login']);
  }

  refreshToken(): Observable<any> {
    const refreshToken =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(environment.jwtConfig.refreshTokenKey)
        : null;

    if (!refreshToken) {
      this.logout();
      return throwError('No refresh token available');
    }

    return this.http
      .post(`${environment.apiUrl}/Auth/refresh`, {
        refresh_token: refreshToken,
      })
      .pipe(
        map((response: any) => {
          if (response.access_token && typeof localStorage !== 'undefined') {
            localStorage.setItem(
              environment.jwtConfig.tokenKey,
              response.access_token
            );
          }
          return response;
        }),
        catchError((error) => {
          this.logout();
          return throwError(error);
        })
      );
  }

  // isAuthenticated(): boolean {
  //   const token = this.getToken();
  //   if (!token) {
  //     return false;
  //   }

  //   // Check if token is expired
  //   if (this.jwtHelper.isTokenExpired(token)) {
  //     return false;
  //   }

  //   return true;
  // }

  // isAdminSync(): boolean {
  //   const user = this.getCurrentUser();
  //   return user?.role === 'admin' || false;
  // }

  isAdmin(): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/Auth/isAdmin`);
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(environment.jwtConfig.tokenKey);
      console.log(
        'Auth Service - getToken():',
        token ? 'Token found' : 'No token'
      );
      return token;
    }
    return null;
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      return this.jwtHelper.decodeToken(token);
    }
    return null;
  }

  getCurrentUser(): User | null {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return {
        id: decodedToken.sub,
        email: decodedToken.email,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        role: decodedToken.role,
      };
    }
    return null;
  }

  private navigateByRole(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'user':
      default:
        this.router.navigate(['/user']);
        break;
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid credentials';
          break;
        case 403:
          errorMessage = 'Access forbidden';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 500:
          errorMessage = 'Internal server error';
          break;
        default:
          errorMessage = error.error?.message || `Error Code: ${error.status}`;
      }
    }

    if (environment.features.enableLogging) {
      console.error('Auth Service Error:', error);
    }

    return throwError(errorMessage);
  }
}
