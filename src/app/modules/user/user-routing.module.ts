import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { ProfileViewComponent } from './user-profile/profile-view/profile-view.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: UserDashboardComponent,
        data: { title: 'User Dashboard', breadcrumb: 'Dashboard' }
      },
      {
        path: 'profile',
        component: ProfileViewComponent,
        data: { title: 'User Profile', breadcrumb: 'Dashboard' }
      },
      {
        path: 'cart',
        loadChildren: () => import('../../features/cart/cart.module').then(m => m.CartModule),
        data: { title: 'Shopping Cart', breadcrumb: 'Cart' }
      },
      {
        path: 'orders',
        component: OrderListComponent,
        data: { title: 'Order History', breadcrumb: 'Orders' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
