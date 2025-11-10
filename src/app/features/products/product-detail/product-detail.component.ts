import { Component } from '@angular/core';
import { ProductDto } from '../../../core/models/product.dto';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  selectedImageIndex = 0;
  quantity = 1;

  product: ProductDto = {
    id: 'p-1001',
    title: 'Premium Wireless Headphones',
    price: 199,
    oldPrice: 249,
    currency: '$',
    rating: 4.5,
    reviewsCount: 128,
    inStock: true,
    description: 'Rich sound with ANC, 40h battery and ultra‑comfortable fit.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526178618718-4ae29a0f05b9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop'
    ],
    thumbnails: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526178618718-4ae29a0f05b9?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=400&auto=format&fit=crop'
    ],
    specs: [
      { label: 'Driver', value: '40 mm' },
      { label: 'Battery', value: 'Up to 40h' },
      { label: 'Charge', value: 'USB‑C' },
      { label: 'BT', value: '5.3' }
    ]
  };

  get discountPercentage(): number | null {
    if (!this.product.oldPrice) return null;
    const pct = (1 - this.product.price / this.product.oldPrice) * 100;
    return Math.max(0, Math.round(pct));
  }

  selectImage(index: number): void {
    if (index < 0 || index >= this.product.images.length) return;
    this.selectedImageIndex = index;
  }

  increment(): void {
    this.quantity = Math.min(99, this.quantity + 1);
  }

  decrement(): void {
    this.quantity = Math.max(1, this.quantity - 1);
  }

  addToCart(): void {
    // Integrate with cart service later
    // Placeholder: console log to indicate action
    console.log('Add to cart', { id: this.product.id, quantity: this.quantity });
  }

  toggleWishlist(): void {
    console.log('Toggle wishlist', { id: this.product.id });
  }

  copyLink(): void {
    try {
      const href = typeof window !== 'undefined' && window.location ? window.location.href : '';
      if (!href) return;
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(href).catch(() => {});
      }
    } catch {
      // no-op
    }
  }
}

