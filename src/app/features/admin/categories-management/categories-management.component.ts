import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from '../../../core/models/category.dto';
import { CategoryService, PagedResult } from './category.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-categories-management',
  standalone: false,
  templateUrl: './categories-management.component.html',
  styleUrl: './categories-management.component.css'
})
export class CategoriesManagementComponent implements OnInit {
  // Categories
  categories: CategoryDto[] = [];
  categoriesPagedResult: PagedResult<CategoryDto> | null = null;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  // Forms
  categoryForm: FormGroup;
  
  // UI State
  showCategoryForm = false;
  isEditingCategory = false;
  loading = false;
  
  // Search
  searchTerm = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {
    this.categoryForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories(false, this.currentPage, this.pageSize, this.searchTerm)
      .subscribe({
        next: (result) => {
          console.log(result);
          
          this.categoriesPagedResult = result;
          this.categories = result?.items || [];
          this.totalPages = result?.totalPages || 0;
          this.loading = false;
        },
        error: (error) => {
          this.notificationService.showError('Failed to load categories');
          this.categories = [];
          this.totalPages = 0;
          this.loading = false;
        }
      });
  }


  // Category CRUD Operations
  openCategoryForm(category?: CategoryDto): void {
    if(this.showCategoryForm){
      this.closeCategoryForm()
      return
    } 
      
    this.isEditingCategory = !!category;
    this.categoryForm.reset();
    
    if (category) {
      this.categoryForm.patchValue({
        id: category.id,
        name: category.name,
        description: category.description || ''
      });
    } else {
      this.categoryForm.patchValue({
        id: null,
        name: '',
        description: ''
      });
    }
    
    this.showCategoryForm = true;
  }

  closeCategoryForm(): void {
    this.showCategoryForm = false;
    this.categoryForm.reset();
    this.isEditingCategory = false;
  }

  saveCategory(): void {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      console.log('Form is valid, saving category:', formValue);
      
      const operation = this.isEditingCategory
        ? this.categoryService.updateCategory(formValue as UpdateCategoryDto)
        : this.categoryService.createCategory(formValue as CreateCategoryDto);

      operation.subscribe({
        next: (result) => {
          console.log('Category saved successfully:', result);
          this.notificationService.showSuccess(
            this.isEditingCategory ? 'Category updated successfully' : 'Category created successfully'
          );
          this.closeCategoryForm();
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error saving category:', error);
          this.notificationService.showError('Failed to save category');
        }
      });
    } else {
      console.log('Form is invalid:', this.categoryForm.errors);
      this.categoryForm.markAllAsTouched();
    }
  }

  deleteCategory(category: CategoryDto): void {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Category deleted successfully');
          this.loadCategories();
        },
        error: (error) => {
          this.notificationService.showError('Failed to delete category');
        }
      });
    }
  }


  // Pagination
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCategories();
  }

  // Search and Filter
  onSearch(): void {
    this.currentPage = 1;
    this.loadCategories();
  }

  // Track by function for ngFor
  trackByCategoryId(index: number, category: CategoryDto): number {
    return category.id;
  }

  // Pagination helper
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
