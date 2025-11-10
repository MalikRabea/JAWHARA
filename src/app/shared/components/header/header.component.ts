import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CartItem } from '../../../core/models/cart-item';

declare const HSCollapse: any;

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private dropdownTimeout: any;
  private isDropdownOpen = false;
  private subscriptions: Subscription[] = [];

  // Cart properties
  cartItems: CartItem[] = [];
  cartItemsCount: number = 0;
  cartTotal: number = 0;
  isCartOpen: boolean = false;

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}
  
 
  ngAfterViewInit(): void {
    // Initialize Preline UI components
    if (typeof HSCollapse !== 'undefined') {
      HSCollapse.autoInit();
    }

    // Subscribe to cart changes
    this.subscriptions.push(
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
        this.cartItemsCount = this.cartService.getCartItemsCount();
        this.cartTotal = this.cartService.getCartTotal();
      })
    );

    this.subscriptions.push(
      this.cartService.cartOpen$.subscribe(isOpen => {
        this.isCartOpen = isOpen;
        // Add fake data when cart opens and is empty
        if (isOpen && this.cartItems.length === 0) {
          this.addFakeData();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onDropdownMouseEnter(): void {
    // Clear any existing timeout
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
    }
    
    // Open dropdown if not already open
    if (!this.isDropdownOpen) {
      const dropdownButton = document.getElementById('hs-dropdown-categories');
      if (dropdownButton) {
        dropdownButton.click();
        this.isDropdownOpen = true;
      }
    }
  }

  onDropdownMouseLeave(): void {
    // Set a timeout to close the dropdown
    this.dropdownTimeout = setTimeout(() => {
      const dropdownButton = document.getElementById('hs-dropdown-categories');
      if (dropdownButton && this.isDropdownOpen) {
        dropdownButton.click();
        this.isDropdownOpen = false;
      }
    }, 200); // 200ms delay
  }

  onDropdownMenuEnter(): void {
    // Clear the timeout when entering the dropdown menu
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
    }
  }

  onDropdownMenuLeave(): void {
    // Close dropdown when leaving the menu
    this.dropdownTimeout = setTimeout(() => {
      const dropdownButton = document.getElementById('hs-dropdown-categories');
      if (dropdownButton && this.isDropdownOpen) {
        dropdownButton.click();
        this.isDropdownOpen = false;
      }
    }, 200); // 200ms delay
  }

  // Cart methods
  toggleCart(): void {
    this.cartService.toggleCart();
  }

  closeCart(): void {
    this.cartService.closeCart();
  }

  updateCartItemQuantity(itemId: string, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity);
  }

  removeCartItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
    this.notificationService.showInfo('Item removed from cart');
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.notificationService.showWarning('Cart cleared');
  }

  // Add sample items for testing
  addSampleItem(): void {
    const sampleProducts = [
      {
        productId: 'sample-1',
        name: 'Premium Wireless Headphones',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop&crop=center',
        size: 'One Size',
        color: 'Black'
      },
      {
        productId: 'sample-2',
        name: 'Cotton T-Shirt',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop&crop=center',
        size: 'L',
        color: 'Navy Blue'
      },
      {
        productId: 'sample-3',
        name: 'Leather Wallet',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=150&h=150&fit=crop&crop=center',
        color: 'Brown'
      }
    ];

    const randomProduct = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
    this.cartService.addToCart(randomProduct);
    this.notificationService.showSuccess(`${randomProduct.name} added to cart!`);
  }

  // Toast notification test methods
  testSuccessToast(): void {
    this.notificationService.showSuccess('Operation completed successfully!');
  }

  testErrorToast(): void {
    this.notificationService.showError('Something went wrong. Please try again.');
  }

  testWarningToast(): void {
    this.notificationService.showWarning('Please check your input before proceeding.');
  }

  testInfoToast(): void {
    this.notificationService.showInfo('Here is some useful information for you.');
  }

  // Add fake data automatically when cart opens empty
  private addFakeData(): void {
    const fakeProducts = [
      {
        productId: 'fake-1',
        name: 'iPhone 15 Pro Max',
        price: 1299.99,
        image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=150&h=150&fit=crop&crop=center',
        size: '256GB',
        color: 'Space Black'
      },
      {
        productId: 'fake-2',
        name: 'Nike Air Jordan 1',
        price: 179.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop&crop=center',
        size: '42',
        color: 'Red & White'
      },
      {
        productId: 'fake-3',
        name: 'MacBook Pro 16"',
        price: 2399.99,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop&crop=center',
        size: '16-inch',
        color: 'Space Gray'
      },
      {
        productId: 'fake-4',
        name: 'Designer Sunglasses',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150&h=150&fit=crop&crop=center',
        size: 'One Size',
        color: 'Black'
      }
    ];

    // Add 2-3 random items to cart
    const itemsToAdd = Math.floor(Math.random() * 2) + 2; // 2 or 3 items
    const shuffledProducts = [...fakeProducts].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < itemsToAdd; i++) {
      this.cartService.addToCart(shuffledProducts[i]);
      // Add random quantities (1-3) for some items
      if (Math.random() > 0.5) {
        const additionalQuantity = Math.floor(Math.random() * 2) + 1;
        setTimeout(() => {
          for (let j = 0; j < additionalQuantity; j++) {
            this.cartService.addToCart(shuffledProducts[i]);
          }
        }, 100);
      }
    }
  }

}
