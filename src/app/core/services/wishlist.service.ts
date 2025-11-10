import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WishlistItem } from '../models/wishlist-item';
import { Product } from '../models/product';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = new BehaviorSubject<WishlistItem[]>([]);
  public wishlistItems$ = this.wishlistItems.asObservable();

  constructor(private notificationService: NotificationService) {
    // Load wishlist from localStorage if available
    if (typeof localStorage !== 'undefined') {
      this.loadWishlistFromStorage();
    }
  }

  // Get all wishlist items
  getWishlistItems(): Observable<WishlistItem[]> {
    return this.wishlistItems$;
  }

  // Get wishlist count
  getWishlistCount(): number {
    return this.wishlistItems.value.length;
  }

  // Check if product is in wishlist
  isInWishlist(productId: string): boolean {
    return this.wishlistItems.value.some(item => item.productId === productId);
  }

  // Add item to wishlist
  addToWishlist(product: Product): void {
    const currentItems = this.wishlistItems.value;
    const existingItem = currentItems.find(item => item.productId === product.id.toString());

    if (!existingItem) {
      const newItem: WishlistItem = {
        id: this.generateId(),
        productId: product.id.toString(),
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        rating: product.rating,
        reviewCount: product.reviewCount,
        category: product.category,
        brand: product.brand,
        isNew: product.isNew,
        discount: product.discount,
        dateAdded: new Date(),
        inStock: true // Default to true, this could be updated based on product availability
      };

      this.wishlistItems.next([...currentItems, newItem]);
      this.saveWishlistToStorage();
      
      // Show success notification
      this.notificationService.showSuccess(`${product.name} added to wishlist!`);
    }
  }

  // Remove item from wishlist
  removeFromWishlist(productId: string): void {
    const currentItems = this.wishlistItems.value;
    const itemToRemove = currentItems.find(item => item.productId === productId);
    const updatedItems = currentItems.filter(item => item.productId !== productId);
    this.wishlistItems.next(updatedItems);
    this.saveWishlistToStorage();
    
    // Show info notification
    if (itemToRemove) {
      this.notificationService.showInfo(`${itemToRemove.name} removed from wishlist`);
    }
  }

  // Toggle item in wishlist
  toggleWishlist(product: Product): void {
    if (this.isInWishlist(product.id.toString())) {
      this.removeFromWishlist(product.id.toString());
    } else {
      this.addToWishlist(product);
    }
  }

  // Clear entire wishlist
  clearWishlist(): void {
    const itemCount = this.wishlistItems.value.length;
    this.wishlistItems.next([]);
    this.saveWishlistToStorage();
    
    // Show warning notification
    if (itemCount > 0) {
      this.notificationService.showWarning(`Cleared ${itemCount} item${itemCount === 1 ? '' : 's'} from wishlist`);
    }
  }

  // Move item to cart (if cart service is available)
  moveToCart(wishlistItem: WishlistItem): void {
    // This would integrate with CartService
    // For now, just remove from wishlist
    this.removeFromWishlist(wishlistItem.productId);
    console.log('Move to cart functionality to be implemented with CartService integration');
  }

  // Private helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private loadWishlistFromStorage(): void {
    try {
      const stored = localStorage.getItem('ecom_wishlist');
      if (stored) {
        const items = JSON.parse(stored).map((item: any) => ({
          ...item,
          dateAdded: new Date(item.dateAdded)
        }));
        this.wishlistItems.next(items);
      }
    } catch (error) {
      console.error('Error loading wishlist from storage:', error);
    }
  }

  private saveWishlistToStorage(): void {
    try {
      localStorage.setItem('ecom_wishlist', JSON.stringify(this.wishlistItems.value));
    } catch (error) {
      console.error('Error saving wishlist to storage:', error);
    }
  }
}
