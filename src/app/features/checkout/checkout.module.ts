import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { ChecklayoutComponent } from './checklayout/checklayout.component';
import { CartComponent } from './cart/cart.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { PaymentComponent } from './payment/payment.component';
import { StepperComponent } from './stepper/stepper.component';


@NgModule({
  declarations: [
    ChecklayoutComponent,
    CartComponent,
    ShippingAddressComponent,
    PaymentComponent,
    StepperComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CheckoutModule { }
