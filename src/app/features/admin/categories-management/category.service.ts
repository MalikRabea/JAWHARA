import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from '../../../core/models/category.dto';
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
export class CategoryService {
  private readonly baseUrl = environment.apiUrl + '/admin/AdminCategories';

  constructor(private http: HttpClient) { }

  // Categories CRUD
  getCategories(includeSubCategories: boolean = false, pageNumber: number = 1, pageSize: number = 20, searchTerm?: string): Observable<PagedResult<CategoryDto>> {
    let params = new HttpParams()
      .set('includeSubCategories', includeSubCategories.toString())
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm && searchTerm.trim()) {
      params = params.set('searchTerm', searchTerm.trim());
    }

    return this.http.get<PagedResult<CategoryDto>>(this.baseUrl, { params });
  }

  getCategoryById(id: number): Observable<CategoryDto> {
    return this.http.get<CategoryDto>(`${this.baseUrl}/${id}`);
  }

  createCategory(category: CreateCategoryDto): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(this.baseUrl, category);
  }

  updateCategory(category: UpdateCategoryDto): Observable<CategoryDto> {
    return this.http.put<CategoryDto>(`${this.baseUrl}/${category.id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
