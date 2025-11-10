import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart-item';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalAmount = 0;
  private subscriptions = new Subscription();
  couponCode = '';
  readonly freeShippingThreshold = 100;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
        this.totalAmount = this.cartService.getCartTotal();
      })
    );
  }

  updateQuantity(item: CartItem, quantity: number): void {
    this.cartService.updateQuantity(item.id, quantity);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  trackByItemId(_: number, item: CartItem): string {
    return item.id;
  }

  get cartCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  get freeShippingProgress(): number {
    const progress = (this.totalAmount / this.freeShippingThreshold) * 100;
    return Math.max(0, Math.min(100, Math.round(progress)));
  }

  get amountToFreeShipping(): number {
    return Math.max(0, this.freeShippingThreshold - this.totalAmount);
  }

  applyCoupon(): void {
    // Placeholder hook for future coupon logic
    // Example: integrate with pricing/checkout service
    console.log('Apply coupon clicked:', this.couponCode);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
