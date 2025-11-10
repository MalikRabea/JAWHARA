import { CanActivateFn, Router } from '@angular/router';
import { inject, Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting after login (only in browser)
  if (isPlatformBrowser(platformId)) {
    sessionStorage.setItem('redirectUrl', state.url);
  }
  
  // Navigate to login page
  router.navigate(['/auth/login']);
  return false;
};

// For backward compatibility, also export as a class-based guard

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Store the attempted URL for redirecting after login (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('redirectUrl', state.url);
    }
    
    this.router.navigate(['/auth/login']);
    return false;
  }
}
