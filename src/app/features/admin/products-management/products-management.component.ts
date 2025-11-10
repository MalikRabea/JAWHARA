import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { 
  ProductManagementDto, 
  CreateProductDto, 
  UpdateProductDto, 
  ProductDetailDto 
} from '../../../core/models/product-management.dto';
import { CategoryDto, SubCategoryDto } from '../../../core/models/category.dto';
import { ProductService, PagedResult } from './product.service';
import { CategoryService } from '../categories-management/category.service';
import { SubCategoryService } from '../subcategories-management/sub-category.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-products-management',
  standalone: false,
  templateUrl: './products-management.component.html',
  styleUrl: './products-management.component.css'
})
export class ProductsManagementComponent implements OnInit {
  // Products
  products: ProductManagementDto[] = [];
  productsPagedResult: PagedResult<ProductManagementDto> | null = null;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  // Categories and SubCategories for dropdowns
  categories: CategoryDto[] = [];
  subCategories: SubCategoryDto[] = [];
  
  // Forms
  productForm: FormGroup;
  
  // UI State
  showProductForm = false;
  isEditingProduct = false;
  loading = false;
  
  // Search and Filters
  searchTerm = '';
  selectedCategoryId: number | null = 0;
  selectedSubCategoryId: number | null = 0;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  
  // File handling
  selectedImages: File[] = [];
  imagePreviewUrls: string[] = [];
  imagesToDelete: string[] = [];
  
  // Image modal
  showImageModal = false;
  selectedProduct: ProductManagementDto | null = null;
  
  // Debounce for search input
  private searchInputTimeoutId: any = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private notificationService: NotificationService
  ) {
    this.productForm = this.fb.group({
      id: [null],
      title: ['', [Validators.minLength(2)]],
      description: [''],
      oldPrice: [null, [Validators.min(0)]],
      newPrice: [null, [Validators.min(0)]],
      subCategoryId: [null],
      productDetails: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadSubCategories()

  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(
      this.selectedCategoryId || undefined,
      this.selectedSubCategoryId || undefined,
      this.minPrice || undefined,
      this.maxPrice || undefined,
      this.searchTerm,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (result) => {
        this.productsPagedResult = result;
        this.products = result?.items || [];
        this.totalPages = result?.totalPages || 0;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load products');
        this.products = [];
        this.totalPages = 0;
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories(true, 1, 1000).subscribe({
      next: (result) => {
        this.categories = result?.items || [];
      },
      error: (error) => {
        this.notificationService.showError('Failed to load categories');
      }
    });
  }
  loadSubCategories(): void {
    this.subCategoryService.getSubCategories(false, 1, 1000).subscribe({
      next: (result) => {
        this.subCategories = result?.items || [];
      }
    });
  }
  onCategoryChange(categoryId: number): void {
    if(categoryId == 0)return;

    this.selectedCategoryId = categoryId;
    this.selectedSubCategoryId = null;
    this.subCategories = [];
    
    if (categoryId && categoryId > 0) {
      this.subCategoryService.getSubCategoriesByCategory(categoryId, 1, 1000).subscribe({
        next: (result) => {
          this.subCategories = result?.items || [];
        },
        error: (error) => {
          this.notificationService.showError('Failed to load subcategories');
        }
      });
    }
    
    this.loadProducts();
  }

  onSubCategoryChange(subCategoryId: number): void {
    if(subCategoryId == 0)return;
    this.selectedSubCategoryId = subCategoryId > 0 ? subCategoryId : null;
    this.loadProducts();
  }

  onPriceFilterChange(): void {
    this.loadProducts();
  }

  // Product CRUD Operations
  openProductForm(product?: ProductManagementDto): void {
    if (this.showProductForm) {
      this.closeProductForm();
      return;
    }
      
    this.isEditingProduct = !!product;
    this.productForm.reset();
    this.selectedImages = [];
    this.imagePreviewUrls = [];
    this.imagesToDelete = [];
    
    if (product) {
      this.productForm.patchValue({
        id: product.id,
        title: product.title,
        description: product.description || '',
        oldPrice: product.oldPrice,
        newPrice: product.newPrice,
        subCategoryId: product.subCategoryId
      });
      
      // Load product details
      this.productDetails.clear();
      product.productDetails.forEach(detail => {
        this.addProductDetail(detail.label, detail.value, detail.id);
      });
      
      // Set image previews for existing images
      this.imagePreviewUrls = product.images || [];
    } else {
      this.productForm.patchValue({
        id: null,
        title: '',
        description: '',
        oldPrice: null,
        newPrice: null,
        subCategoryId: null
      });
      
      this.productDetails.clear();
    }
    
    this.showProductForm = true;
  }

  closeProductForm(): void {
    this.showProductForm = false;
    this.productForm.reset();
    this.isEditingProduct = false;
    this.selectedImages = [];
    this.imagePreviewUrls = [];
    this.imagesToDelete = [];
    this.productDetails.clear();
  }
  saveProduct(): void {
    const formValue = this.productForm.value;
    let isValid = true;
    let errorMessage = '';
  
    // ✅ التحقق
    if (!this.isEditingProduct) {
      // Create
      if (!formValue.title || formValue.title.trim().length < 2) {
        isValid = false;
        errorMessage = 'Title is required and must be at least 2 characters';
      } else if (!formValue.newPrice || formValue.newPrice <= 0) {
        isValid = false;
        errorMessage = 'New price is required and must be greater than 0';
      } else if (!formValue.subCategoryId) {
        isValid = false;
        errorMessage = 'SubCategory is required';
      }
    } else {
      // Update
      if (formValue.title && formValue.title.trim().length < 2) {
        isValid = false;
        errorMessage = 'Title must be at least 2 characters if provided';
      } else if (formValue.newPrice && formValue.newPrice <= 0) {
        isValid = false;
        errorMessage = 'New price must be greater than 0 if provided';
      }
    }
  
    if (!isValid) {
      this.notificationService.showError(errorMessage);
      this.productForm.markAllAsTouched();
      return;
    }
  
    // ✅ بناء الـ DTO
    let dto: CreateProductDto | UpdateProductDto;
     if (this.isEditingProduct) {
       dto = {
         id: formValue.id,
         title: formValue.title?.trim() || undefined,
         description: formValue.description?.trim() || undefined,
         oldPrice: formValue.oldPrice || undefined,
         newPrice: formValue.newPrice || undefined,
         subCategoryId: formValue.subCategoryId || undefined,
         images: this.selectedImages, // صور جديدة إذا وجدت
         imagesToDelete: this.imagesToDelete, // صور للحذف
         productDetails: this.productDetails.value.map((detail: any) => ({
           id: detail.id || undefined,
           label: detail.label,
           value: detail.value
         }))
       } as UpdateProductDto;
    } else {
      dto = {
        title: formValue.title,
        description: formValue.description,
        oldPrice: formValue.oldPrice,
        newPrice: formValue.newPrice,
        subCategoryId: formValue.subCategoryId,
        images: this.selectedImages,
        productDetails: this.productDetails.value
      } as CreateProductDto;
    }
  
    // ✅ الطلب للـ API
    const request$ = this.isEditingProduct
      ? this.productService.updateProduct(dto as UpdateProductDto)
      : this.productService.createProduct(dto as CreateProductDto);
  
    request$.subscribe({
      next: (result) => {
        this.notificationService.showSuccess(
          this.isEditingProduct ? 'Product updated successfully' : 'Product created successfully'
        );
        this.closeProductForm();
        this.loadProducts();
      },
      error: (error) => {
        console.error('Save failed:', error);
        this.notificationService.showError(
          `Failed to save product: ${error.error?.message || error.message || 'Unknown error'}`
        );
      }
    });
  }
  

  deleteProduct(product: ProductManagementDto): void {
    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Product deleted successfully');
          this.loadProducts();
        },
        error: (error) => {
          this.notificationService.showError('Failed to delete product');
        }
      });
    }
  }

  // Product Details Management
  get productDetails(): FormArray {
    return this.productForm.get('productDetails') as FormArray;
  }

  addProductDetail(label: string = '', value: string = '', id?: number): void {
    const detailForm = this.fb.group({
      id: [id || null],
      label: [label, [Validators.required]],
      value: [value, [Validators.required]]
    });
    this.productDetails.push(detailForm);
  }

  removeProductDetail(index: number): void {
    this.productDetails.removeAt(index);
  }

  // Image handling
  onImageSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          this.selectedImages.push(file);
          
          // Create preview URL
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagePreviewUrls.push(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  removeImage(index: number): void {
    // Check if this is an existing image (URL) or a new image (File)
    const imageUrl = this.imagePreviewUrls[index];
    
    if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
      // This is a new image (File preview), remove from selectedImages
      this.selectedImages.splice(index, 1);
    } else {
      // This is an existing image (URL), add to imagesToDelete
      this.imagesToDelete.push(imageUrl);
    }
    
    this.imagePreviewUrls.splice(index, 1);
  }

  restoreImage(imageUrl: string): void {
    // Remove from imagesToDelete and add back to imagePreviewUrls
    const index = this.imagesToDelete.indexOf(imageUrl);
    if (index > -1) {
      this.imagesToDelete.splice(index, 1);
      this.imagePreviewUrls.push(imageUrl);
    }
  }

  // Pagination
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  // Search and Filter
  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  // Enhanced filter helpers for UI
  onSearchInput(): void {
    if (this.searchInputTimeoutId) {
      clearTimeout(this.searchInputTimeoutId);
    }
    this.searchInputTimeoutId = setTimeout(() => {
      this.onSearch();
    }, 400);
  }

  hasActiveFilters(): boolean {
    return !!(
      (this.searchTerm && this.searchTerm.trim().length > 0) ||
      this.selectedCategoryId ||
      this.selectedSubCategoryId ||
      this.minPrice != null ||
      this.maxPrice != null
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  clearCategoryFilter(): void {
    this.onCategoryChange(0);
  }

  clearSubCategoryFilter(): void {
    this.selectedSubCategoryId = null;
    this.loadProducts();
  }

  clearPriceFilter(): void {
    this.minPrice = null;
    this.maxPrice = null;
    this.loadProducts();
  }

  resetToFirstPage(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  getCategoryName(categoryId: number | null): string {
    if (!categoryId) { return ''; }
    const found = this.categories.find(c => c.id === categoryId);
    return found ? found.name : '';
  }

  getSubCategoryName(subCategoryId: number | null): string {
    if (!subCategoryId) { return ''; }
    const found = this.subCategories.find(sc => sc.id === subCategoryId);
    return found ? found.name : '';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = null;
    this.selectedSubCategoryId = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.subCategories = [];
    this.currentPage = 1;
    this.loadProducts();
  }

  // Track by function for ngFor
  trackByProductId(index: number, product: ProductManagementDto): number {
    return product.id;
  }

  // Image modal methods
  viewProductImages(product: ProductManagementDto): void {
    this.selectedProduct = product;
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.selectedProduct = null;
  }

  downloadImage(imageUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Helper method for template null safety
  hasImages(): boolean {
    return !!(this.selectedProduct?.images && this.selectedProduct.images.length > 0);
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
