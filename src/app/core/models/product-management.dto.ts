export interface ProductManagementDto {
  id: number;
  title: string;
  description: string;
  oldPrice: number;
  newPrice: number;
  images: string[];
  subCategoryId: number;
  subCategoryName: string;
  categoryName: string;
  productDetails: ProductDetailDto[];
  ratings: RatingDto[];
  averageRating: number;
  totalReviews: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductDetailDto {
  id?: number;
  label: string;
  value: string;
}

export interface RatingDto {
  id: number;
  productId: number;
  userId: string;
  rating: number;
  review?: string;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateProductDto {
  title: string;
  description?: string;
  oldPrice?: number;
  newPrice: number;
  images: File[];
  subCategoryId: number;
  productDetails: Omit<ProductDetailDto, 'id'>[];
}

export interface UpdateProductDto {
  id: number;
  title?: string;
  description?: string;
  oldPrice?: number;
  newPrice?: number;
  subCategoryId?: number;
  images?: File[];
  imagesToDelete?: string[];
  productDetails?: ProductDetailUpdateDto[];
}

export interface ProductDetailUpdateDto {
  id?: number;
  label: string;
  value: string;
}

export interface ProductRatingDto {
  id: number;
  productId: number;
  userId: string;
  rating: number;
  review?: string;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateProductRatingDto {
  productId: number;
  rating: number;
  review?: string;
}
