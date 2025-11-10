import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesManagementComponent } from './categories-management/categories-management.component';
import { SubcategoriesManagementComponent } from './subcategories-management/subcategories-management.component';
import { ProductsManagementComponent } from './products-management/products-management.component';
import { OrdersManagementComponent } from './orders-management/orders-management.component';
import { UsersManagementComponent } from './users-management/users-management.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'categories',
        component: CategoriesManagementComponent
      },
      {
        path: 'subcategories',
        component: SubcategoriesManagementComponent
      },
      {
        path: 'products',
        component: ProductsManagementComponent
      },
      {
        path: 'orders',
        component: OrdersManagementComponent
      },
      {
        path: 'users',
        component: UsersManagementComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }