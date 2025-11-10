import { Component, ViewChild, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";

import { series } from "./data";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};

interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  status: string;
  date: Date;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  sales: number;
  image: string;
}

interface ActivityItem {
  id: string;
  type: string;
  icon: string;
  description: string;
  time: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  
  // Key metrics
  totalRevenue: number = 125430.50;
  totalOrders: number = 2847;
  totalCustomers: number = 1245;
  totalProducts: number = 156;

  // Recent orders data
  recentOrders: RecentOrder[] = [
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      amount: 299.99,
      status: 'completed',
      date: new Date('2024-01-15')
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      amount: 149.50,
      status: 'pending',
      date: new Date('2024-01-15')
    },
    {
      id: 'ORD-003',
      customerName: 'Mike Johnson',
      amount: 89.99,
      status: 'shipped',
      date: new Date('2024-01-14')
    },
    {
      id: 'ORD-004',
      customerName: 'Sarah Wilson',
      amount: 199.99,
      status: 'completed',
      date: new Date('2024-01-14')
    },
    {
      id: 'ORD-005',
      customerName: 'David Brown',
      amount: 79.99,
      status: 'cancelled',
      date: new Date('2024-01-13')
    }
  ];

  // Top products data
  topProducts: TopProduct[] = [
    {
      id: '1',
      name: 'Wireless Headphones',
      category: 'Electronics',
      price: 199.99,
      sales: 245,
      image: 'https://via.placeholder.com/80x80?text=Headphones'
    },
    {
      id: '2',
      name: 'Smart Watch',
      category: 'Electronics',
      price: 299.99,
      sales: 189,
      image: 'https://via.placeholder.com/80x80?text=Watch'
    },
    {
      id: '3',
      name: 'Running Shoes',
      category: 'Sports',
      price: 129.99,
      sales: 156,
      image: 'https://via.placeholder.com/80x80?text=Shoes'
    },
    {
      id: '4',
      name: 'Coffee Maker',
      category: 'Home',
      price: 89.99,
      sales: 134,
      image: 'https://via.placeholder.com/80x80?text=Coffee'
    }
  ];

  // Recent activities data
  recentActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'order',
      icon: 'fas fa-shopping-cart',
      description: 'New order #ORD-001 received from John Doe',
      time: new Date('2024-01-15T10:30:00')
    },
    {
      id: '2',
      type: 'product',
      icon: 'fas fa-box',
      description: 'Product "Wireless Headphones" stock updated',
      time: new Date('2024-01-15T09:15:00')
    },
    {
      id: '3',
      type: 'user',
      icon: 'fas fa-user-plus',
      description: 'New customer Sarah Wilson registered',
      time: new Date('2024-01-15T08:45:00')
    },
    {
      id: '4',
      type: 'payment',
      icon: 'fas fa-credit-card',
      description: 'Payment of $299.99 processed successfully',
      time: new Date('2024-01-15T08:20:00')
    },
    {
      id: '5',
      type: 'order',
      icon: 'fas fa-truck',
      description: 'Order #ORD-002 shipped to Jane Smith',
      time: new Date('2024-01-15T07:30:00')
    },
    {
      id: '6',
      type: 'system',
      icon: 'fas fa-cog',
      description: 'System backup completed successfully',
      time: new Date('2024-01-15T06:00:00')
    }
  ];

  ngOnInit(): void {
    // Initialize dashboard data
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // In a real application, this would fetch data from your API
    console.log('Loading dashboard data...');
  }
}
