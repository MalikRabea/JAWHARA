import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  private cartOpen = new BehaviorSubject<boolean>(false);
  public cartOpen$ = this.cartOpen.asObservable();

  constructor(private notificationService: NotificationService) {
    // Load cart from localStorage if available
    if(typeof localStorage !== 'undefined') {
      this.loadCartFromStorage();
    }
  }

  // Toggle cart sidebar
  toggleCart(): void {
    this.cartOpen.next(!this.cartOpen.value);
  }

  // Open cart sidebar
  openCart(): void {
    this.cartOpen.next(true);
  }

  // Close cart sidebar
  closeCart(): void {
    this.cartOpen.next(false);
  }

  // Get current cart items
  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  // Get cart items count
  getCartItemsCount(): number {
    return this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
  }

  // Get cart total
  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Add item to cart
  addToCart(product: Omit<CartItem, 'id' | 'quantity'>): void {
    const currentItems = this.cartItems.value;
    const existingItemIndex = currentItems.findIndex(item => 
      item.productId === product.productId && 
      item.size === product.size && 
      item.color === product.color
    );

    if (existingItemIndex > -1) {
      // Item exists, increase quantity
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += 1;
      this.cartItems.next(updatedItems);
      
      // Show success notification for quantity update
      this.notificationService.showSuccess(`${product.name} quantity updated in cart!`);
    } else {
      // New item, add to cart
      const newItem: CartItem = {
        ...product,
        id: this.generateId(),
        quantity: 1
      };
      this.cartItems.next([...currentItems, newItem]);
      
      // Show success notification for new item
      this.notificationService.showSuccess(`${product.name} added to cart!`);
    }

    this.saveCartToStorage();
  }

  // Update item quantity
  updateQuantity(itemId: string, quantity: number): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    });
    this.cartItems.next(updatedItems);
    this.saveCartToStorage();
  }

  // Remove item from cart
  removeFromCart(itemId: string): void {
    const currentItems = this.cartItems.value;
    const itemToRemove = currentItems.find(item => item.id === itemId);
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.cartItems.next(updatedItems);
    this.saveCartToStorage();
    
    // Show info notification
    if (itemToRemove) {
      this.notificationService.showInfo(`${itemToRemove.name} removed from cart`);
    }
  }

  // Clear cart
  clearCart(): void {
    const itemCount = this.cartItems.value.length;
    this.cartItems.next([]);
    this.saveCartToStorage();
    
    // Show warning notification
    if (itemCount > 0) {
      this.notificationService.showWarning(`Cleared ${itemCount} item${itemCount === 1 ? '' : 's'} from cart`);
    }
  }

  // Save cart to localStorage
  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }

  // Load cart from localStorage
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        this.cartItems.next(cartData);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  // Generate unique ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
