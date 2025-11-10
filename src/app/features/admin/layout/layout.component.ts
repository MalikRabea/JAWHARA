import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  pageTitle: string = 'Dashboard';
  pageDescription: string = 'Admin management dashboard';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Listen to route changes to update page title and description
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updatePageInfo(event.url);
      });
  }

  private updatePageInfo(url: string): void {
    const routeMap: { [key: string]: { title: string; description: string } } = {
      '/admin/dashboard': { title: 'Dashboard', description: 'Admin management dashboard' },
      '/admin/categories': { title: 'Categories', description: 'Manage product categories' },
      '/admin/subcategories': { title: 'Subcategories', description: 'Manage product subcategories' },
      '/admin/products': { title: 'Products', description: 'Manage products and inventory' },
      '/admin/orders': { title: 'Orders', description: 'View and manage orders' },
      '/admin/users': { title: 'Users', description: 'Manage user accounts' }
    };

    const pageInfo = routeMap[url] || { title: 'Admin Panel', description: 'Management dashboard' };
    this.pageTitle = pageInfo.title;
    this.pageDescription = pageInfo.description;
  }
}