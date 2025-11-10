export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  id: number;
  name?: string;
  description?: string;
}

export interface SubCategoryDto {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  categoryName: string;
  category?: CategoryDto;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubCategoryDto {
  name: string;
  description?: string;
  categoryId: number;
}

export interface UpdateSubCategoryDto {
  id: number;
  name?: string;
  description?: string;
  categoryId?: number;
}

// Backend API DTOs
export interface SubCategoryCreateDto {
  name: string;
  description?: string;
  categoryId: number;
}

export interface SubCategoryUpdateDto {
  id: number;
  name?: string;
  description?: string;
  categoryId?: number;
}