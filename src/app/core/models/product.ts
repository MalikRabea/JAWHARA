export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  subCategory?: string;
  brand: string;
  isNew?: boolean;
  discount?: number;
  inWishlist: boolean;
}
