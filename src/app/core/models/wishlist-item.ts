export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  isNew?: boolean;
  discount?: number;
  dateAdded: Date;
  inStock: boolean;
}
