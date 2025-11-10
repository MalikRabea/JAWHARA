import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PerformanceService } from './core/services/performance.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Ecom-Front';
  hideHeader = false;

  constructor(
    private performanceService: PerformanceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize performance monitoring
    this.performanceService.measurePerformance('app-init');
    
    // Enable service worker in production
    if (environment.production) {
      this.performanceService.enableServiceWorker();
    }

    // Log environment info in development
    if (environment.features.enableLogging) {
      console.log('🚀 E-Commerce App Initialized');
      console.log('Environment:', environment.name);
      console.log('API URL:', environment.apiUrl);
      console.log('Features:', environment.features);
    }

    // Determine visibility of header based on current URL
    this.hideHeader = this.router.url.includes('user');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideHeader = event.urlAfterRedirects.includes('user')||event.urlAfterRedirects.includes('admin');
      }
    });
  }
}
