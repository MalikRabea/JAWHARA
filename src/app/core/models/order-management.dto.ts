export interface OrderManagementDto {
  id: number;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItemManagementDto[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddressDto;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  transactions?: TransactionDto[];
}

export interface OrderItemManagementDto {
  id: number;
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  product?: {
    id: number;
    title: string;
    images: string[];
  };
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

export interface TransactionDto {
  id: number;
  orderId: number;
  amount: number;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  createdAt: string;
}

export type OrderStatus = 0 | 1 | 2 | 3 | 4 | 5; // 0: pending, 1: processing, 2: shipped, 3: delivered, 4: cancelled, 5: refunded
export type PaymentMethod = 'card' | 'cod' | 'paypal' | 'bank';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface UpdateOrderStatusDto {
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
