import { Component, ViewChild } from '@angular/core';
import { Step } from '../stepper/stepper.component';
import { CartService } from '../../../core/services/cart.service';
import { CheckoutSummary } from '../../../core/models/checkout-summary';

@Component({
  selector: 'app-checklayout',
  standalone: false,
  templateUrl: './checklayout.component.html',
  styleUrls: ['./checklayout.component.css']
})
export class ChecklayoutComponent {
  currentStep = 0;
  steps: Step[] = [
    {
      id: 'shipping',
      title: 'Shipping Address',
      description: 'Enter your delivery details',
      completed: false,
      active: true,
      disabled: false
    },
    {
      id: 'payment',
      title: 'Payment',
      description: 'Choose payment method',
      completed: false,
      active: false,
      disabled: true
    }
  ];

  checkoutSummary: CheckoutSummary = {
    itemsCount: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0
  };

  constructor(public cartService: CartService) {
    this.calculateSummary();
  }

  onStepChange(stepIndex: number): void {
    if (stepIndex < this.currentStep || this.steps[stepIndex].completed) {
      this.currentStep = stepIndex;
      this.updateStepStates();
    }
  }

  onShippingComplete(): void {
    this.steps[0].completed = true;
    this.steps[1].disabled = false;
    this.steps[1].active = true;
    this.currentStep = 1;
    this.updateStepStates();
  }

  onPaymentComplete(): void {
    this.steps[1].completed = true;
    // Handle order completion
    console.log('Order completed!');
    
    // Clear cart after successful order
    this.cartService.clearCart();
    
    // You can add navigation to success page here
    // this.router.navigate(['/order-success']);
  }

  private updateStepStates(): void {
    this.steps.forEach((step, index) => {
      step.active = index === this.currentStep;
    });
  }

  private calculateSummary(): void {
    const cartItems = this.cartService.getCartItems();
    this.checkoutSummary.itemsCount = this.cartService.getCartItemsCount();
    this.checkoutSummary.subtotal = this.cartService.getCartTotal();
    this.checkoutSummary.shipping = 10; // Fixed shipping cost
    this.checkoutSummary.tax = this.checkoutSummary.subtotal * 0.1; // 10% tax
    this.checkoutSummary.total = this.checkoutSummary.subtotal + this.checkoutSummary.shipping + this.checkoutSummary.tax;
  }
}
