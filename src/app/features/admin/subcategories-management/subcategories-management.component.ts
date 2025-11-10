import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { 
  SubCategoryDto, 
  SubCategoryCreateDto, 
  SubCategoryUpdateDto, 
  CategoryDto 
} from '../../../core/models/category.dto';
import { SubCategoryService, PagedResult } from './sub-category.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-subcategories-management',
  standalone: false,
  templateUrl: './subcategories-management.component.html',
  styleUrl: './subcategories-management.component.css'
})
export class SubcategoriesManagementComponent implements OnInit {
  // SubCategories
  subCategories: SubCategoryDto[] = [];
  subCategoriesPagedResult: PagedResult<SubCategoryDto> | null = null;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  // Categories for dropdown
  categories: CategoryDto[] = [];
  
  // Forms
  subCategoryForm: FormGroup;
  
  // UI State
  showSubCategoryForm = false;
  isEditingSubCategory = false;
  loading = false;
  
  // Search
  searchTerm = '';
  selectedCategoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private subCategoryService: SubCategoryService,
    private notificationService: NotificationService
  ) {
    this.subCategoryForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      categoryId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSubCategories();
  }

  loadCategories(): void {
    this.subCategoryService.getCategories(1, 1000).subscribe({
      next: (result) => {
        this.categories = result?.items || [];
      },
      error: () => {
        this.notificationService.showError('Failed to load categories');
      }
    });
  }

  loadSubCategories(): void {
    this.loading = true;
    debugger  
    const operation = this.selectedCategoryId 
      ? this.subCategoryService.getSubCategoriesByCategory(this.selectedCategoryId, this.currentPage, this.pageSize)
      : this.subCategoryService.getSubCategories(false, this.currentPage, this.pageSize, this.searchTerm);

    operation.subscribe({
      next: (result) => {
        console.log(result);
        debugger
        // this.subCategoriesPagedResult = result;
        this.subCategories = result?.items || [];
        this.totalPages = result?.totalPages || 0;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load subcategories');
        this.subCategories = [];
        this.totalPages = 0;
        this.loading = false;
      }
    });
  }

  // SubCategory CRUD Operations
  openSubCategoryForm(subCategory?: SubCategoryDto): void {
    if(this.showSubCategoryForm){
      this.closeSubCategoryForm()
      return
    } 
      
    this.isEditingSubCategory = !!subCategory;
    this.subCategoryForm.reset();
    
    if (subCategory) {
      this.subCategoryForm.patchValue({
        id: subCategory.id,
        name: subCategory.name,
        description: subCategory.description || '',
        categoryId: subCategory.categoryId
      });
    } else {
      this.subCategoryForm.patchValue({
        id: null,
        name: '',
        description: '',
        categoryId: this.selectedCategoryId || null
      });
    }
    
    this.showSubCategoryForm = true;
  }

  closeSubCategoryForm(): void {
    this.showSubCategoryForm = false;
    this.subCategoryForm.reset();
    this.isEditingSubCategory = false;
  }

  saveSubCategory(): void {
    if (this.subCategoryForm.valid) {
      const formValue = this.subCategoryForm.value;
      console.log('Form is valid, saving subcategory:', formValue);
      
      const operation = this.isEditingSubCategory
        ? this.subCategoryService.updateSubCategory(formValue as SubCategoryUpdateDto)
        : this.subCategoryService.createSubCategory(formValue as SubCategoryCreateDto);

      operation.subscribe({
        next: (result) => {
          console.log('SubCategory saved successfully:', result);
          this.notificationService.showSuccess(
            this.isEditingSubCategory ? 'SubCategory updated successfully' : 'SubCategory created successfully'
          );
          this.closeSubCategoryForm();
          this.loadSubCategories();
        },
        error: (error) => {
          console.error('Error saving subcategory:', error);
          this.notificationService.showError('Failed to save subcategory');
        }
      });
    } else {
      console.log('Form is invalid:', this.subCategoryForm.errors);
      this.subCategoryForm.markAllAsTouched();
    }
  }

  deleteSubCategory(subCategory: SubCategoryDto): void {
    if (confirm(`Are you sure you want to delete "${subCategory.name}"?`)) {
      this.subCategoryService.deleteSubCategory(subCategory.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('SubCategory deleted successfully');
          this.loadSubCategories();
        },
        error: (error) => {
          this.notificationService.showError('Failed to delete subcategory');
        }
      });
    }
  }

  // Category filter
  onCategoryFilterChange(): void {
    this.currentPage = 1;
    this.loadSubCategories();
  }

  // Pagination
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadSubCategories();
  }

  // Search and Filter
  onSearch(): void {
    this.currentPage = 1;
    this.loadSubCategories();
  }

  // Track by function for ngFor
  trackBySubCategoryId(index: number, subCategory: SubCategoryDto): number {
    return subCategory.id;
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

  // Get category name by ID
  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  }
}
