import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  OrderManagementDto, 
  TransactionDto,
  OrderStatus,
  PaymentMethod,
  TransactionStatus
} from '../../../core/models/order-management.dto';
import { environment } from '../../../../environments/environment.prod';
import { ProductManagementDto } from '../../../core/models/product-management.dto';

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderSummaryDto {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  itemCount: number;
  customerName: string;
}

export interface OrderDto {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
  paymentMethod: PaymentMethod;
  appUserId: string;
  customerName: string;
  items: OrderItemDto[];
  shippingAddress: ShippingAddressDto;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDto {
  id: number;
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShippingAddressDto {
  id: number;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface TransactionCreateDto {
  orderId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
}

export interface UpdateOrderStatusDto {
  id: number;
  status: OrderStatus;
}

export interface OrderStatisticsDto {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
}

export interface SalesDataDto {
  date: string;
  orders: number;
  revenue: number;
}

export interface OrderCreateDto {
  items: OrderItemCreateDto[];
  shippingAddress: ShippingAddressCreateDto;
  paymentMethod: PaymentMethod;
  discount?: number;
}

export interface OrderItemCreateDto {
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ShippingAddressCreateDto {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface ProductDto {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
  stockQuantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = environment.apiUrl + '/admin/AdminOrders';

  constructor(private http: HttpClient) { }

  // Get orders with pagination and filtering
  getOrders(
    status?: OrderStatus,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Observable<PagedResult<OrderSummaryDto>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PagedResult<OrderSummaryDto>>(this.baseUrl, { params });
  }

  // Get order by ID
  getOrderById(id: number): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${this.baseUrl}/${id}`);
  }

  // Get order by order number
  getOrderByNumber(orderNumber: string): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${this.baseUrl}/number/${orderNumber}`);
  }

  // Get user orders
  getUserOrders(
    userId: string,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Observable<PagedResult<OrderSummaryDto>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<OrderSummaryDto>>(`${this.baseUrl}/user/${userId}`, { params });
  }

  // Update order status
  updateOrderStatus(updateDto: UpdateOrderStatusDto): Observable<OrderDto> {
    return this.http.put<OrderDto>(`${this.baseUrl}/${updateDto.id}/status`, updateDto);
  }

  // Cancel order
  cancelOrder(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/cancel`, {});
  }

  // Get order statistics
  getOrderStatistics(): Observable<OrderStatisticsDto> {
    return this.http.get<OrderStatisticsDto>(`${this.baseUrl}/statistics`);
  }

  // Get total sales
  getTotalSales(startDate?: Date, endDate?: Date): Observable<{ totalSales: number; startDate?: Date; endDate?: Date }> {
    let params = new HttpParams();
    
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }

    return this.http.get<{ totalSales: number; startDate?: Date; endDate?: Date }>(`${this.baseUrl}/sales`, { params });
  }

  // Process payment
  processPayment(transactionDto: TransactionCreateDto): Observable<TransactionDto> {
    return this.http.post<TransactionDto>(`${this.baseUrl}/${transactionDto.orderId}/payment`, transactionDto);
  }

  // Get order transactions
  getOrderTransactions(
    orderId: number,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Observable<PagedResult<TransactionDto>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<TransactionDto>>(`${this.baseUrl}/${orderId}/transactions`, { params });
  }

  // Create new order
  createOrder(orderDto: OrderCreateDto): Observable<OrderDto> {
    // Map UI string values to backend enum integers to avoid JSON enum conversion errors
    const paymentMethodNumericMap: Record<string, number> = {
      card: 0,             // PaymentMethod.Card
      cod: 1,              // PaymentMethod.CashOnDelivery
      paypal: 2,           // PaymentMethod.PayPal
      bank: 3,             // PaymentMethod.BankTransfer
    };

    const uiValue = (orderDto.paymentMethod as unknown as string) || '';
    const payload: any = {
      ...orderDto,
      paymentMethod: paymentMethodNumericMap[uiValue] ?? orderDto.paymentMethod,
    };

    return this.http.post<OrderDto>(`${environment.apiUrl}/Orders`, payload);
  }

  // Search products for order creation
  searchProducts(searchTerm: string, pageNumber: number = 1, pageSize: number = 20): Observable<PagedResult<ProductManagementDto>> {
    let params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<ProductManagementDto>>(`${environment.apiUrl}/admin/AdminProducts`, { params });
  }

  // Get product by ID
  getProductById(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${environment.apiUrl}/products/${id}`);
  }
}
