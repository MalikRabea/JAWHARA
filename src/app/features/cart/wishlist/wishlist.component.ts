import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistItem } from '../../../core/models/wishlist-item';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-wishlist',
  standalone: false,
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit, OnDestroy {
  Math = Math; // Make Math available in template
  wishlistItems: WishlistItem[] = [];
  isLoading = false;
  private subscriptions = new Subscription();

  // View mode for responsive display
  viewMode: 'grid' | 'list' = 'grid';

  // Sort options
  sortOptions = [
    { value: 'newest', label: 'Recently Added' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' }
  ];
  selectedSort = 'newest';

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    public router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadWishlist(): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.wishlistService.getWishlistItems().subscribe(items => {
        this.wishlistItems = this.sortItems(items);
        this.isLoading = false;
      })
    );
  }

  private sortItems(items: WishlistItem[]): WishlistItem[] {
    const sorted = [...items];
    
    switch (this.selectedSort) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }

  onSortChange(): void {
    this.wishlistItems = this.sortItems(this.wishlistItems);
  }

  removeFromWishlist(item: WishlistItem): void {
    this.wishlistService.removeFromWishlist(item.productId);
  }

  addToCart(item: WishlistItem): void {
    const cartItem = {
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image
    };
    
    this.cartService.addToCart(cartItem);
    // Optionally remove from wishlist after adding to cart
    // this.removeFromWishlist(item);
  }

  moveToCart(item: WishlistItem): void {
    this.addToCart(item);
    this.removeFromWishlist(item);
    // Note: Individual notifications are handled by the services, 
    // but we can show a special notification for "move" action
    this.notificationService.showSuccess(`${item.name} moved to cart!`);
  }

  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      this.wishlistService.clearWishlist();
    }
  }

  viewProduct(item: WishlistItem): void {
    this.router.navigate(['/products', item.productId]);
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  trackByItemId(_: number, item: WishlistItem): string {
    return item.id;
  }

  get wishlistCount(): number {
    return this.wishlistItems.length;
  }

  // Helper method to calculate savings
  getSavings(item: WishlistItem): number {
    if (item.originalPrice) {
      return item.originalPrice - item.price;
    }
    return 0;
  }

  // Helper method to get star array for ratings
  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }
}
