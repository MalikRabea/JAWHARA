import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin().pipe(
    map((isAdmin) => {
      if (isAdmin) {
        
        return true;
      } else {
        return router.createUrlTree(['/auth/login']); // أو أي صفحة ثانية
      }
    }),
    catchError(() => {
      return of(router.createUrlTree(['/auth/login']));
    })
  );
};
