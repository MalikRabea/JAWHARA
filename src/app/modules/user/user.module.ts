import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';
import { AsideComponent } from './components/aside/aside.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { ProfileViewComponent } from './user-profile/profile-view/profile-view.component';


@NgModule({
  declarations: [
    UserDashboardComponent,
    UserLayoutComponent,
    AsideComponent,
    ProfileViewComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OrderListComponent
  ]
})
export class UserModule { }
