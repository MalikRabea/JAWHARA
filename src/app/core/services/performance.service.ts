import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../environments/environment';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private preloadedRoutes = new Set<string>();

  constructor(private router: Router) {
    this.setupRoutePreloading();
  }

  /**
   * Preload critical routes based on user behavior
   */
  preloadRoute(routePath: string): void {
    if (this.preloadedRoutes.has(routePath) || !environment.performance.enablePreloading) {
      return;
    }

    setTimeout(() => {
      this.loadModuleByPath(routePath).then(() => {
        this.preloadedRoutes.add(routePath);
        if (environment.features.enableLogging) {
          console.log(`Preloaded route: ${routePath}`);
        }
      }).catch(() => {
        // Silently fail for non-existent routes
      });
    }, environment.performance.preloadDelay);
  }

  /**
   * Preload modules based on user role
   */
  preloadByRole(userRole: string): void {
    const rolesToPreload = userRole === 'admin' 
      ? ['admin', 'user'] 
      : ['user'];
    
    rolesToPreload.forEach(role => {
      this.preloadRoute(role);
    });
  }

  /**
   * Setup intelligent route preloading
   */
  private setupRoutePreloading(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      take(1)
    ).subscribe((event: NavigationEnd) => {
      // Preload likely next routes based on current route
      this.preloadNextLikelyRoutes(event.url);
    });
  }

  /**
   * Predict and preload next likely routes
   */
  private preloadNextLikelyRoutes(currentUrl: string): void {
    if (currentUrl.includes('/user')) {
      // User is likely to visit products, cart, or profile
      setTimeout(() => {
        this.preloadFeatureModules(['products', 'cart', 'user-profile']);
      }, environment.performance.preloadDelay);
    } else if (currentUrl.includes('/admin')) {
      // Admin is likely to visit all management modules
      setTimeout(() => {
        this.preloadFeatureModules(['products', 'orders']);
      }, environment.performance.preloadDelay);
    }
  }

  /**
   * Preload feature modules
   */
  private preloadFeatureModules(modules: string[]): void {
    modules.forEach(moduleName => {
      this.loadFeatureModule(moduleName).then(() => {
        if (environment.features.enableLogging) {
          console.log(`Preloaded feature: ${moduleName}`);
        }
      }).catch(() => {
        // Silently fail for non-existent modules
      });
    });
  }

  /**
   * Optimize images with lazy loading and compression hints
   */
  optimizeImage(imgElement: HTMLImageElement): void {
    imgElement.loading = 'lazy';
    imgElement.decoding = 'async';
    
    // Add intersection observer for progressive loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset['src']) {
              img.src = img.dataset['src'];
              observer.unobserve(img);
            }
          }
        });
      });
      observer.observe(imgElement);
    }
  }

  /**
   * Measure and log performance metrics
   */
  measurePerformance(markName: string): void {
    if (!environment.features.enableLogging) return;

    try {
      performance.mark(markName);
      
      // Measure navigation timing
      if (performance.getEntriesByType) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        console.group('Performance Metrics');
        console.log(`${markName} - DOM Content Loaded:`, navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ms');
        console.log(`${markName} - Load Complete:`, navigation.loadEventEnd - navigation.loadEventStart, 'ms');
        console.log(`${markName} - First Paint:`, this.getFirstPaint(), 'ms');
        console.log(`${markName} - First Contentful Paint:`, this.getFirstContentfulPaint(), 'ms');
        console.groupEnd();
      }
    } catch (error) {
      // Performance API not supported
    }
  }

  private getFirstPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  private getFirstContentfulPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint ? firstContentfulPaint.startTime : null;
  }

  /**
   * Load module by path using webpack's require.context for better bundling
   */
  private async loadModuleByPath(routePath: string): Promise<any> {
    // Use a more bundle-friendly approach
    const moduleLoaders: { [key: string]: () => Promise<any> } = {
      'admin': () => import('../../features/admin/admin.module').then(m => m.AdminModule),
      'user': () => import('../../modules/user/user.module').then(m => m.UserModule)
    };

    const loader = moduleLoaders[routePath];
    if (loader) {
      return loader();
    }
    throw new Error(`Module ${routePath} not found`);
  }

  /**
   * Load feature module with explicit imports
   */
  private async loadFeatureModule(moduleName: string): Promise<any> {
    const featureLoaders: { [key: string]: () => Promise<any> } = {
      'products': () => import('../../features/products/products.module').then(m => m.ProductsModule),
      'cart': () => import('../../features/cart/cart.module').then(m => m.CartModule),
      'auth': () => import('../../features/auth/auth.module').then(m => m.AuthModule),
      'admin': () => import('../../features/admin/admin.module').then(m => m.AdminModule),
      'checkout': () => import('../../features/checkout/checkout.module').then(m => m.CheckoutModule)
    };

    const loader = featureLoaders[moduleName];
    if (loader) {
      return loader();
    }
    throw new Error(`Feature module ${moduleName} not found`);
  }

  /**
   * Enable service worker for caching (in production)
   */
  enableServiceWorker(): void {
    if (!environment.features.enableServiceWorker || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.register('/sw.js').then(registration => {
      if (environment.features.enableLogging) {
        console.log('Service Worker registered:', registration.scope);
      }
    }).catch(error => {
      if (environment.features.enableLogging) {
        console.error('Service Worker registration failed:', error);
      }
    });
  }
}
