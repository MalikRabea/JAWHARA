import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService, OrderSummaryDto, OrderDto, OrderStatisticsDto, PagedResult, UpdateOrderStatusDto, OrderCreateDto, OrderItemCreateDto, ShippingAddressCreateDto, ProductDto } from './order.service';
import { OrderStatus, PaymentMethod, TransactionStatus } from '../../../core/models/order-management.dto';
import { ProductManagementDto } from '../../../core/models/product-management.dto';

@Component({
  selector: 'app-orders-management',
  standalone: false,
  templateUrl: './orders-management.component.html',
  styleUrl: './orders-management.component.css'
})
export class OrdersManagementComponent implements OnInit {
  @ViewChild('orderDetailsModal') orderDetailsModal!: TemplateRef<any>;
  @ViewChild('statusUpdateModal') statusUpdateModal!: TemplateRef<any>;

  // Data properties
  orders: OrderSummaryDto[] = [];
  selectedOrder: OrderDto | null = null;
  statistics: OrderStatisticsDto | null = null;
  salesData: { totalSales: number; startDate?: Date; endDate?: Date } | null = null;
  pagedResult: PagedResult<OrderSummaryDto> | null = null;
  
  // UI state
  loading = false;
  showOrderDetails = false;
  showStatusUpdate = false;
  showCreateOrder = false;
  showOrderForm = false;
  isEditMode = false;
  selectedStatus: OrderStatus | null = null;
  selectedOrders: number[] = [];
  showBulkActions = false;
  
  // Create order state
  createOrderForm: FormGroup;
  selectedProducts: OrderItemCreateDto[] = [];
  searchResults: ProductManagementDto[] = [];
  searchTerm = '';
  searchingProducts = false;
  
  // Edit order form
  editOrderForm: FormGroup;
  
  // Filters and pagination
  filterForm: FormGroup;
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;
  
  // Enums for template
  OrderStatusEnum = {
    Pending: 0,
    Processing: 1,
    Shipped: 2,
    Delivered: 3,
    Cancelled: 4,
    Refunded: 5
  };
  PaymentMethodEnum = {
    Card: 1,
    Cod: 2,
    Paypal: 3,
    Bank: 4
  };
  TransactionStatusEnum = {
    Pending: 'pending',
    Completed: 'completed',
    Failed: 'failed',
    Refunded: 'refunded'
  };
  
  // Status options for dropdown
  statusOptions = [
    { value: 0, label: 'Pending', color: 'yellow' },
    { value: 1, label: 'Processing', color: 'blue' },
    { value: 2, label: 'Shipped', color: 'purple' },
    { value: 3, label: 'Delivered', color: 'green' },
    { value: 4, label: 'Cancelled', color: 'red' },
    { value: 5, label: 'Refunded', color: 'gray' }
  ];

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      searchTerm: [''],
      dateFrom: [''],
      dateTo: ['']
    });

    this.createOrderForm = this.fb.group({
      shippingAddress: this.fb.group({
        fullName: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: [''],
        postalCode: ['', [Validators.required]],
        country: ['', [Validators.required]]
      }),
      paymentMethod: ['card', [Validators.required]],
      discount: [0]
    });

    this.editOrderForm = this.fb.group({
      status: [0, [Validators.required]],
      shippingAddress: this.fb.group({
        fullName: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: [''],
        postalCode: ['', [Validators.required]],
        country: ['', [Validators.required]]
      }),
      paymentMethod: ['card', [Validators.required]],
      discount: [0]
    });
  }

  ngOnInit(): void {
    this.loadOrders();
    this.loadStatistics();
    this.loadSalesData();
  }

  loadOrders(): void {
    this.loading = true;
    const status = this.filterForm.get('status')?.value;
    
    this.orderService.getOrders(status, this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        this.orders = result.items;
        console.log(this.orders);
        
        this.pagedResult = result;
        this.totalPages = result.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  loadStatistics(): void {
    this.orderService.getOrderStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  loadSalesData(): void {
    this.orderService.getTotalSales().subscribe({
      next: (sales) => {
        this.salesData = sales;
      },
      error: (error) => {
        console.error('Error loading sales data:', error);
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadOrders();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  onPageSizeChange(size: string): void {
    this.pageSize = parseInt(size, 10);
    this.currentPage = 1;
    this.loadOrders();
  }

  viewOrderDetails(orderId: number): void {
    this.loading = true;
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        this.selectedOrder = order;
        this.showOrderForm = true;
        this.isEditMode = false;
        this.populateEditForm(order);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order details:', error);
        this.loading = false;
      }
    });
  }

  updateOrderStatus(orderId: number, newStatus: number): void {
    this.loading = true;
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        this.selectedOrder = order;
        this.showOrderForm = true;
        this.isEditMode = true;
        this.populateEditForm(order);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order details:', error);
        this.loading = false;
      }
    });
  }

  confirmStatusUpdate(): void {
    if (!this.selectedOrder || !this.selectedStatus) return;

    const updateDto: UpdateOrderStatusDto = {
      id: this.selectedOrder.id,
      status: Number(this.selectedStatus) as OrderStatus
    };

    this.loading = true;
    this.orderService.updateOrderStatus(updateDto).subscribe({
      next: (updatedOrder) => {
        this.selectedOrder = updatedOrder;
        this.loadOrders(); // Refresh the list
        this.showStatusUpdate = false;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        this.loading = false;
      }
    });
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.loading = true;
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.loadOrders(); // Refresh the list
          this.loading = false;
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          this.loading = false;
        }
      });
    }
  }

  closeModals(): void {
    this.showOrderDetails = false;
    this.showStatusUpdate = false;
    this.selectedOrder = null;
    this.selectedStatus = null;
  }

  populateEditForm(order: OrderDto): void {
    this.editOrderForm.patchValue({
      status: order.status,
      shippingAddress: {
        fullName: order.shippingAddress.fullName,
        phone: order.shippingAddress.phone,
        street: order.shippingAddress.street,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        postalCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country
      },
      paymentMethod: order.paymentMethod,
      discount: order.discount || 0
    });
  }

  backToTable(): void {
    this.showOrderForm = false;
    this.isEditMode = false;
    this.selectedOrder = null;
    this.editOrderForm.reset();
  }

  saveOrderChanges(): void {
    if (!this.selectedOrder || !this.editOrderForm.valid) {
      this.editOrderForm.markAllAsTouched();
      return;
    }

    const updateDto: UpdateOrderStatusDto = {
      id: this.selectedOrder.id,
      status: Number(this.editOrderForm.get('status')?.value) as OrderStatus
    };

    this.loading = true;
    this.orderService.updateOrderStatus(updateDto).subscribe({
      next: (updatedOrder) => {
        this.selectedOrder = updatedOrder;
        this.loadOrders(); // Refresh the list
        this.loading = false;
        alert('Order updated successfully!');
      },
      error: (error) => {
        console.error('Error updating order:', error);
        this.loading = false;
        alert('Error updating order: ' + error.message);
      }
    });
  }

  getStatusColor(status: OrderStatus): string {
    const statusOption = this.statusOptions.find(option => option.value === status);
    return statusOption?.color || 'gray';
  }

  getStatusLabel(status: OrderStatus): string {
    const statusOption = this.statusOptions.find(option => option.value === status);
    return statusOption?.label || status.toString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

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

  // Expose Math to template
  Math = Math;

  // Bulk actions
  toggleOrderSelection(orderId: number): void {
    const index = this.selectedOrders.indexOf(orderId);
    if (index > -1) {
      this.selectedOrders.splice(index, 1);
    } else {
      this.selectedOrders.push(orderId);
    }
    this.showBulkActions = this.selectedOrders.length > 0;
  }

  selectAllOrders(): void {
    this.selectedOrders = this.orders.map(order => order.id);
    this.showBulkActions = this.selectedOrders.length > 0;
  }

  clearSelection(): void {
    this.selectedOrders = [];
    this.showBulkActions = false;
  }

  bulkUpdateStatus(newStatus: OrderStatus): void {
    if (this.selectedOrders.length === 0) return;

    if (confirm(`Are you sure you want to update ${this.selectedOrders.length} orders to ${this.getStatusLabel(newStatus)}?`)) {
      this.loading = true;
      // Here you would implement bulk status update
      // For now, we'll just show a message
      console.log('Bulk updating orders:', this.selectedOrders, 'to status:', newStatus);
      this.loading = false;
      this.clearSelection();
    }
  }

  exportOrders(): void {
    // Implement export functionality
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private generateCSV(): string {
    const headers = ['Order Number', 'Customer', 'Status', 'Total', 'Items', 'Date'];
    const rows = this.orders.map(order => [
      order.orderNumber,
      order.customerName,
      this.getStatusLabel(order.status),
      order.total.toString(),
      order.itemCount.toString(),
      this.formatDate(order.createdAt)
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Create Order Methods
  openCreateOrder(): void {
    this.showCreateOrder = true;
    this.selectedProducts = [];
    this.searchResults = [];
    this.searchTerm = '';
    this.createOrderForm.reset();
    this.createOrderForm.patchValue({
      paymentMethod: 'card',
      discount: 0
    });
  }

  searchProducts(): void {
    if (this.searchTerm.trim().length < 2) {
      this.searchResults = [];
      return;
    }

    this.searchingProducts = true;
    this.orderService.searchProducts(this.searchTerm).subscribe({
      next: (result) => {
        console.log('Search results:', result);
        this.searchResults = result.items;
        debugger;
        this.searchingProducts = false;
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.searchingProducts = false;
      }
    });
  }

  addProductToOrder(product: ProductManagementDto): void {
    const existingItem = this.selectedProducts.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.selectedProducts.push({
        productId: product.id,
        name: product.title,
        image: product.images[0] || '',
        price: product.newPrice,
        quantity: 1
      });
    }
  }

  removeProductFromOrder(productId: number): void {
    this.selectedProducts = this.selectedProducts.filter(item => item.productId !== productId);
  }

  updateProductQuantity(productId: number, quantity: number): void {
    const item = this.selectedProducts.find(item => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeProductFromOrder(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  getOrderTotal(): number {
    const subtotal = this.selectedProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = this.createOrderForm.get('discount')?.value || 0;
    const shipping = 10; // Fixed shipping cost
    const tax = (subtotal - discount) * 0.1; // 10% tax
    
    return subtotal - discount + shipping + tax;
  }

  createOrder(): void {
    if (this.selectedProducts.length === 0) {
      alert('Please add at least one product to the order');
      return;
    }

    if (!this.createOrderForm.valid) {
      // Mark all form fields as touched to show validation errors
      this.createOrderForm.markAllAsTouched();
      alert('Please fill in all required fields');
      return;
    }

    const orderData: OrderCreateDto = {
      items: this.selectedProducts,
      shippingAddress: this.createOrderForm.get('shippingAddress')?.value,
      paymentMethod: this.createOrderForm.get('paymentMethod')?.value,
      discount: this.createOrderForm.get('discount')?.value || 0
    };

    this.loading = true;
    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        this.loading = false;
        this.showCreateOrder = false;
        this.loadOrders(); // Refresh the orders list
        alert('Order created successfully!');
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.loading = false;
        alert('Error creating order: ' + error.message);
      }
    });
  }

  closeCreateOrder(): void {
    this.showCreateOrder = false;
    this.selectedProducts = [];
    this.searchResults = [];
    this.searchTerm = '';
  }

  // Helper methods for template
  getSubtotal(): number {
    return this.selectedProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTax(): number {
    const subtotal = this.getSubtotal();
    const discount = this.createOrderForm.get('discount')?.value || 0;
    return (subtotal - discount) * 0.1;
  }

  getShipping(): number {
    return 10; // Fixed shipping cost
  }
}
