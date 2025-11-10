import { Component, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  rating: number;
  searchQuery: string;
}

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  Math = Math; // Make Math available in template
 
  isFilterSidebarOpen = false;
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 12;
  skeletonItems = Array.from({ length: 12 });
  viewMode: 'grid' | 'list' = 'list';
  // Sort options
  sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];
  selectedSort = 'popular';

  // Filter state
  filters: FilterState = {
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 1000 },
    rating: 0,
    searchQuery: ''
  };

  // Category display state
  showAllCategories = false;
  maxVisibleCategories = 3;

  // Available filter options with subcategories
  categories = [
    'Electronics', 'Clothing', 'Books', 'Home & Garden', 
    'Sports', 'Beauty', 'Toys', 'Automotive'
  ];

  subcategories: { [key: string]: string[] } = {
    'Electronics': ['Smartphones', 'Laptops', 'Headphones', 'Cameras', 'Smart Watches', 'Gaming'],
    'Clothing': ['Men\'s Fashion', 'Women\'s Fashion', 'Kids\' Clothing', 'Shoes', 'Accessories'],
    'Books': ['Fiction', 'Non-Fiction', 'Educational', 'Comics', 'Children\'s Books'],
    'Home & Garden': ['Furniture', 'Kitchen', 'Bathroom', 'Garden Tools', 'Decor'],
    'Sports': ['Fitness Equipment', 'Outdoor Sports', 'Team Sports', 'Water Sports', 'Winter Sports'],
    'Beauty': ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Personal Care'],
    'Toys': ['Educational Toys', 'Action Figures', 'Board Games', 'Dolls', 'Electronic Toys'],
    'Automotive': ['Car Parts', 'Accessories', 'Tools', 'Oils & Fluids', 'Electronics']
  };
  
  

  // Mock product data
  allProducts: Product[] = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      description: 'Experience superior sound quality with active noise cancellation, 30-hour battery life, and premium comfort design.',
      price: 299,
      originalPrice: 399,
      image: 'https://m.media-amazon.com/images/I/71AlWM6t3eL._AC_SX444_SY639_FMwebp_QL65_.jpg',
      rating: 4.8,
      reviewCount: 1245,
      category: 'Electronics',
      subCategory: 'Headphones',
      brand: 'Sony',
      isNew: true,
      discount: 25,
      inWishlist: false
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      description: 'Track your fitness goals with GPS, heart rate monitoring, sleep tracking, and 5-day battery life.',
      price: 199,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      rating: 4.6,
      reviewCount: 892,
      category: 'Electronics',
      subCategory: 'Smart Watches',
      brand: 'Apple',
      inWishlist: true
    },
    {
      id: 3,
      name: 'Professional Running Shoes',
      description: 'Engineered for performance with responsive cushioning, breathable mesh upper, and durable outsole.',
      price: 129,
      originalPrice: 159,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      rating: 4.7,
      reviewCount: 2156,
      category: 'Sports',
      subCategory: 'Fitness Equipment',
      brand: 'Nike',
      discount: 19,
      inWishlist: false
    },
    {
      id: 4,
      name: 'Organic Coffee Beans',
      description: 'Single-origin coffee beans, ethically sourced and expertly roasted for a rich, smooth flavor profile.',
      price: 24,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
      rating: 4.9,
      reviewCount: 567,
      category: 'Food',
      brand: 'Premium Roast',
      inWishlist: false
    },
    {
      id: 5,
      name: 'Leather Messenger Bag',
      description: 'Handcrafted from genuine leather with multiple compartments, perfect for work and travel.',
      price: 89,
      originalPrice: 119,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      rating: 4.5,
      reviewCount: 334,
      category: 'Fashion',
      brand: 'Heritage',
      discount: 25,
      inWishlist: true
    },
    {
      id: 6,
      name: 'Wireless Bluetooth Speaker',
      description: 'Portable speaker with 360-degree sound, waterproof design, and 12-hour battery life.',
      price: 79,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
      rating: 4.4,
      reviewCount: 445,
      category: 'Electronics',
      subCategory: 'Gaming',
      brand: 'Samsung',
      inWishlist: false
    },
    {
      id: 7,
      name: 'Premium Sunglasses',
      description: 'UV400 protection with polarized lenses, lightweight titanium frame, and classic design.',
      price: 149,
      originalPrice: 199,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
      rating: 4.6,
      reviewCount: 778,
      category: 'Fashion',
      brand: 'Ray-Ban',
      discount: 25,
      inWishlist: false
    },
    {
      id: 8,
      name: 'Gaming Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard with tactile switches, anti-ghosting, and programmable keys.',
      price: 159,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
      rating: 4.8,
      reviewCount: 1123,
      category: 'Electronics',
      subCategory: 'Gaming',
      brand: 'Corsair',
      isNew: true,
      inWishlist: false
    }
  ];

  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.filteredProducts = [...this.allProducts];
    this.updateDisplayedProducts();
    setTimeout(() => {
      this.isLoading = false;
    }, 600);
  }

  // Filter and search methods
  applyFilters() {
    this.filteredProducts = this.allProducts.filter(product => {
      // Search query filter
      if (this.filters.searchQuery && !product.name.toLowerCase().includes(this.filters.searchQuery.toLowerCase())) {
        return false;
      }

      // Category and Subcategory filter
      const selectedCategories = this.filters.categories.filter(c => !c.includes(' > '));
      const selectedSubcategories = this.filters.categories.filter(c => c.includes(' > '));
      if (selectedCategories.length > 0 || selectedSubcategories.length > 0) {
        const inSelectedCategory = selectedCategories.length === 0 ? true : selectedCategories.includes(product.category);
        const inSelectedSubcategory = selectedSubcategories.length === 0 ? true : selectedSubcategories.some(sc => {
          const [cat, sub] = sc.split(' > ');
          return product.category === cat && product.subCategory === sub;
        });
        if (!(inSelectedCategory && inSelectedSubcategory)) {
          return false;
        }
      }

      // Brand filter
      if (this.filters.brands.length > 0 && !this.filters.brands.includes(product.brand)) {
        return false;
      }

      // Price range filter
      if (product.price < this.filters.priceRange.min || product.price > this.filters.priceRange.max) {
        return false;
      }

      // Rating filter
      if (this.filters.rating > 0 && product.rating < this.filters.rating) {
        return false;
      }

      return true;
    });

    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  applySorting() {
    switch (this.selectedSort) {
      case 'newest':
        this.filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default: // popular
        this.filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    this.updateDisplayedProducts();
  }

  getSortLabel(): string {
    const option = this.sortOptions.find(opt => opt.value === this.selectedSort);
    return option ? option.label : 'Most Popular';
  }

  // Filter methods
  toggleCategory(category: string) {
    const index = this.filters.categories.indexOf(category);
    if (index > -1) {
      this.filters.categories.splice(index, 1);
    } else {
      this.filters.categories.push(category);
    }
    this.applyFilters();
  }

  toggleBrand(brand: string) {
    const index = this.filters.brands.indexOf(brand);
    if (index > -1) {
      this.filters.brands.splice(index, 1);
    } else {
      this.filters.brands.push(brand);
    }
    this.applyFilters();
  }

  updatePriceRange(event: any) {
    this.filters.priceRange.max = parseInt(event.target.value);
    this.applyFilters();
  }

  setRating(rating: number) {
    this.filters.rating = rating;
    this.applyFilters();
  }

  clearFilters() {
    this.filters = {
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 1000 },
      rating: 0,
      searchQuery: ''
    };
    this.applyFilters();
  }

  // Chip helpers
  removeCategoryFilter(key: string) {
    const index = this.filters.categories.indexOf(key);
    if (index > -1) {
      this.filters.categories.splice(index, 1);
      this.applyFilters();
    }
  }

  removeBrandFilter(brand: string) {
    const index = this.filters.brands.indexOf(brand);
    if (index > -1) {
      this.filters.brands.splice(index, 1);
      this.applyFilters();
    }
  }

  clearSearchQuery() {
    this.filters.searchQuery = '';
    this.applyFilters();
  }

  clearRatingFilter() {
    this.filters.rating = 0;
    this.applyFilters();
  }

  clearPriceRange() {
    this.filters.priceRange = { min: 0, max: 1000 };
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    const defaultPrice = this.filters.priceRange.min === 0 && this.filters.priceRange.max === 1000;
    return (
      this.filters.categories.length > 0 ||
      this.filters.brands.length > 0 ||
      this.filters.searchQuery.trim().length > 0 ||
      this.filters.rating > 0 ||
      !defaultPrice
    );
  }

  toggleFilterSidebar() {
    this.isFilterSidebarOpen = !this.isFilterSidebarOpen;
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  // Product interaction methods

  quickView(product: Product) {
    // Here you would typically open a modal or navigate to product detail
    console.log('Quick view for:', product.name);
  }

  addToCart(product: Product, event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    const cartItem = {
      productId: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image
    };
    
    this.cartService.addToCart(cartItem);
  }

  // Pagination methods
  updateDisplayedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updateDisplayedProducts();
    }
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  // Category expansion methods
  getVisibleCategories(): string[] {
    return this.showAllCategories 
      ? this.categories 
      : this.categories.slice(0, this.maxVisibleCategories);
  }

  getRemainingCategoriesCount(): number {
    return Math.max(0, this.categories.length - this.maxVisibleCategories);
  }

  toggleCategoriesExpansion(): void {
    this.showAllCategories = !this.showAllCategories;
  }

  isCategorySelected(category: string): boolean {
    return this.filters.categories.includes(category);
  }

  getSubcategories(category: string): string[] {
    return this.subcategories[category] || [];
  }

  toggleSubcategory(category: string, subcategory: string): void {
    const subcategoryKey = `${category} > ${subcategory}`;
    const index = this.filters.categories.indexOf(subcategoryKey);
    
    if (index > -1) {
      this.filters.categories.splice(index, 1);
    } else {
      this.filters.categories.push(subcategoryKey);
    }
    
    this.applyFilters();
  }

  isSubcategorySelected(category: string, subcategory: string): boolean {
    const subcategoryKey = `${category} > ${subcategory}`;
    return this.filters.categories.includes(subcategoryKey);
  }

  // Wishlist methods
  toggleWishlist(product: Product, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    this.wishlistService.toggleWishlist(product);
    // Update the product's wishlist status in the local array
    const productIndex = this.allProducts.findIndex(p => p.id === product.id);
    if (productIndex > -1) {
      this.allProducts[productIndex].inWishlist = !this.allProducts[productIndex].inWishlist;
    }
  }

  isInWishlist(product: Product): boolean {
    return this.wishlistService.isInWishlist(product.id.toString());
  }
}
