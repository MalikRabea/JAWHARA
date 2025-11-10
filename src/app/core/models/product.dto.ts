export interface ProductDto {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  description: string;
  images: string[];
  thumbnails: string[];
  specs: Array<{ label: string; value: string }>;
}


