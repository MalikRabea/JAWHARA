import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesManagementComponent } from './categories-management/categories-management.component';
import { CategoryService } from './categories-management/category.service';
import { SubCategoryService } from './subcategories-management/sub-category.service';
import { ProductsManagementComponent } from './products-management/products-management.component';
import { ProductService } from './products-management/product.service';
import { OrdersManagementComponent } from './orders-management/orders-management.component';
import { UsersManagementComponent } from './users-management/users-management.component';
import { SubcategoriesManagementComponent } from './subcategories-management/subcategories-management.component';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserManagementService } from '../../core/services/user-management.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PaymentsChartComponent } from './dashboard/payments-chart/payments-chart.component';
import { VistorsChartComponent } from './dashboard/vistors-chart/vistors-chart.component';
import { OrderService } from './orders-management/order.service';

@NgModule({
  declarations: [
    DashboardComponent,
    CategoriesManagementComponent,
    ProductsManagementComponent,
    OrdersManagementComponent,
    UsersManagementComponent,
    SubcategoriesManagementComponent,
    LayoutComponent,
    SidebarComponent,
    PaymentsChartComponent,
    VistorsChartComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AdminRoutingModule,
    NgApexchartsModule
  ],
  providers: [
    CategoryService,
    SubCategoryService,
    ProductService,
    UserManagementService,
    OrderService
  ]
})
export class AdminModule { }
