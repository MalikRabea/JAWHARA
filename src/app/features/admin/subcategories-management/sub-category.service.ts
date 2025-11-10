import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  SubCategoryDto, 
  SubCategoryCreateDto, 
  SubCategoryUpdateDto, 
  CategoryDto 
} from '../../../core/models/category.dto';
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
export class SubCategoryService {
  private baseUrl = environment.apiUrl + '/admin/AdminCategories' // Update with your actual API URL

  constructor(private http: HttpClient) { }

  // Get all subcategories with pagination and search
  getSubCategories(
    includeDeleted: boolean = false,
    pageNumber: number = 1,
    pageSize: number = 20,
    searchTerm: string = ''
  ): Observable<PagedResult<SubCategoryDto>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PagedResult<SubCategoryDto>>(`${this.baseUrl}/subcategories`, { params });
  }

  // Get subcategories by category ID
  getSubCategoriesByCategory(
    categoryId: number,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Observable<PagedResult<SubCategoryDto>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<SubCategoryDto>>(`${this.baseUrl}/${categoryId}/subcategories`, { params });
  }

  // Get single subcategory by ID
  getSubCategoryById(id: number): Observable<SubCategoryDto> {
    return this.http.get<SubCategoryDto>(`${this.baseUrl}/subcategories/${id}`);
  }

  // Create new subcategory
  createSubCategory(subCategory: SubCategoryCreateDto): Observable<SubCategoryDto> {
    return this.http.post<SubCategoryDto>(`${this.baseUrl}/subcategories`, subCategory);
  }

  // Update existing subcategory
  updateSubCategory(subCategory: SubCategoryUpdateDto): Observable<SubCategoryDto> {
    return this.http.put<SubCategoryDto>(`${this.baseUrl}/subcategories/${subCategory.id}`, subCategory);
  }

  // Delete subcategory
  deleteSubCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/subcategories/${id}`);
  }

  // Get all categories for dropdown (paged)
  getCategories(
    pageNumber: number = 1,
    pageSize: number = 1000,
    searchTerm: string = ''
  ): Observable<PagedResult<CategoryDto>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PagedResult<CategoryDto>>(`${this.baseUrl}`, { params });
  }
}
