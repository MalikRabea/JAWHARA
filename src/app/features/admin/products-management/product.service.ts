import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  ProductManagementDto, 
  CreateProductDto, 
  UpdateProductDto, 
  ProductDetailDto,
  ProductRatingDto,
  CreateProductRatingDto
} from '../../../core/models/product-management.dto';
import { environment } from '../../../../environments/environment.prod';

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = environment.apiUrl + '/admin/AdminProducts';

  constructor(private http: HttpClient) { }

  // Products CRUD
  getProducts(
    categoryId?: number,
    subCategoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    searchTerm?: string,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Observable<PagedResult<ProductManagementDto>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }
    if (subCategoryId) {
      params = params.set('subCategoryId', subCategoryId.toString());
    }
    if (minPrice) {
      params = params.set('minPrice', minPrice.toString());
    }
    if (maxPrice) {
      params = params.set('maxPrice', maxPrice.toString());
    }
    if (searchTerm && searchTerm.trim()) {
      params = params.set('searchTerm', searchTerm.trim());
    }

    return this.http.get<PagedResult<ProductManagementDto>>(this.baseUrl, { params });
  }

  getProductById(id: number): Observable<ProductManagementDto> {
    return this.http.get<ProductManagementDto>(`${this.baseUrl}/${id}`);
  }

   private buildFormData(product: CreateProductDto | UpdateProductDto, isUpdate: boolean): FormData {
     const formData = new FormData();
   
     // Basic fields
     if (product.title !== undefined && product.title !== null) {
       formData.append('Title', product.title);
     }
     if (product.description !== undefined && product.description !== null) {
       formData.append('Description', product.description);
     }
     if (product.oldPrice !== undefined && product.oldPrice !== null) {
       formData.append('OldPrice', product.oldPrice.toString());
     }
     if (product.newPrice !== undefined && product.newPrice !== null) {
       formData.append('NewPrice', product.newPrice.toString());
     }
     if (product.subCategoryId !== undefined && product.subCategoryId !== null) {
       formData.append('SubCategoryId', product.subCategoryId.toString());
     }
   
     // Product details
     if (product.productDetails && product.productDetails.length > 0) {
       product.productDetails.forEach((detail: any, index) => {
         if (isUpdate && detail.id) {
           formData.append(`ProductDetails[${index}].Id`, detail.id.toString());
         }
         formData.append(`ProductDetails[${index}].Label`, detail.label);
         formData.append(`ProductDetails[${index}].Value`, detail.value);
       });
     }
   
     // Images to upload
     if (product.images && product.images.length > 0) {
       product.images.forEach((file: File) => {
         formData.append('Images', file, file.name);
       });
     }
   
     // Images to delete (only for updates)
     if (isUpdate && (product as UpdateProductDto).imagesToDelete && (product as UpdateProductDto).imagesToDelete!.length > 0) {
       (product as UpdateProductDto).imagesToDelete!.forEach((imageUrl: string, index: number) => {
         formData.append(`ImagesToDelete[${index}]`, imageUrl);
       });
     }
   
     return formData;
   }
  
  // =======================
  // CREATE
  // =======================
  createProduct(product: CreateProductDto): Observable<ProductManagementDto> {
    const formData = this.buildFormData(product, false);
    return this.http.post<ProductManagementDto>(this.baseUrl, formData);
  }
  
  // =======================
  // UPDATE
  // =======================
  updateProduct(product: UpdateProductDto): Observable<ProductManagementDto> {
    const formData = this.buildFormData(product, true);
    return this.http.put<ProductManagementDto>(`${this.baseUrl}/${product.id}`, formData);
  }
  

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Product Ratings
  getProductRatings(productId: number, pageNumber: number = 1, pageSize: number = 20): Observable<PagedResult<ProductRatingDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<ProductRatingDto>>(`${this.baseUrl}/${productId}/ratings`, { params });
  }

  addProductRating(rating: CreateProductRatingDto): Observable<ProductRatingDto> {
    return this.http.post<ProductRatingDto>(`${this.baseUrl}/${rating.productId}/ratings`, rating);
  }

  // Featured Products
  getFeaturedProducts(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<ProductManagementDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<ProductManagementDto>>(`${this.baseUrl}/featured`, { params });
  }

  // Products by Category
  getProductsByCategory(categoryId: number, pageNumber: number = 1, pageSize: number = 20): Observable<PagedResult<ProductManagementDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<ProductManagementDto>>(`${this.baseUrl}/category/${categoryId}`, { params });
  }

  // Products by SubCategory
  getProductsBySubCategory(subCategoryId: number, pageNumber: number = 1, pageSize: number = 20): Observable<PagedResult<ProductManagementDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<ProductManagementDto>>(`${this.baseUrl}/subcategory/${subCategoryId}`, { params });
  }

  // Related Products
  getRelatedProducts(productId: number, pageNumber: number = 1, pageSize: number = 5): Observable<PagedResult<ProductManagementDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<ProductManagementDto>>(`${this.baseUrl}/${productId}/related`, { params });
  }
}
