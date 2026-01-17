export interface DashboardMetric {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  chartData: number[];
}

export interface RevenueDataPoint {
  month: string;
  income: number;
  expense: number;
}

export interface DashboardData {
  totalOrders: DashboardMetric;
  weeklySales: DashboardMetric;
  products: DashboardMetric;
  refunds: DashboardMetric;
  discountedSales: number;
  discountedSalesData: { date: string; value: number }[];
  revenueData: RevenueDataPoint[];
  totalBudget: number;
  earning: number;
  expense: number;
}