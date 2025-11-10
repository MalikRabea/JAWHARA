import { Component } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Order } from '../../../../core/models/order';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, TitleCasePipe],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent {
  orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2025-0001',
      createdAt: new Date().toISOString(),
      status: 'processing',
      items: [
        {
          productId: 'p1',
          name: 'Wireless Headphones',
          image: 'https://images.unsplash.com/photo-1518441902110-9bbbfa3a83fd?q=80&w=600&auto=format&fit=crop',
          price: 79.99,
          quantity: 1,
          color: 'Black'
        },
        {
          productId: 'p2',
          name: 'Ergonomic Chair',
          image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=600&auto=format&fit=crop',
          price: 199.0,
          quantity: 1,
          color: 'Gray'
        }
      ],
      subtotal: 278.99,
      shipping: 10,
      tax: 22.32,
      total: 311.31,
      paymentMethod: 'card',
      shippingAddress: {
        fullName: 'John Doe',
        phone: '+1 555-0100',
        street: '123 Market St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94103',
        country: 'USA'
      }
    },
    {
      id: '2',
      orderNumber: 'ORD-2025-0002',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'delivered',
      items: [
        {
          productId: 'p3',
          name: 'Mechanical Keyboard',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
          price: 129.5,
          quantity: 1,
          color: 'White'
        }
      ],
      subtotal: 129.5,
      shipping: 0,
      tax: 10.36,
      total: 139.86,
      paymentMethod: 'paypal',
      shippingAddress: {
        fullName: 'Sara Smith',
        phone: '+1 555-0101',
        street: '456 Pine Ave',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA'
      }
    }
  ];
  expandedOrderIds: string[] = [];
  toggleOrderDetails(orderId: string): void {
    const index = this.expandedOrderIds.indexOf(orderId);
    if (index > -1) {
      this.expandedOrderIds.splice(index, 1);
    } else {
      this.expandedOrderIds.push(orderId);
    }
  }

  isOrderExpanded(orderId: string): boolean {
    return this.expandedOrderIds.includes(orderId);
  }

  getStatusBadgeClass(status: Order['status']): string {
    switch (status) {
      case 'pending':
        return 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800';
      case 'shipped':
        return 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800';
      case 'cancelled':
        return 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800';
      case 'refunded':
        return 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
      default:
        return 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
    }
  }

  getProgressBarClass(status: Order['status']): string {
    switch (status) {
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-300';
    }
  }

  getProgressBarWidth(status: Order['status']): number {
    switch (status) {
      case 'pending':
        return 25;
      case 'processing':
        return 50;
      case 'shipped':
        return 75;
      case 'delivered':
        return 100;
      default:
        return 0;
    }
  }

  getPaymentIconClass(method: string): string {
    return method === 'card' ? 'bg-blue-500' : 'bg-blue-700';
  }
}
