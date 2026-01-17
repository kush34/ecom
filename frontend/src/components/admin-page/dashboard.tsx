import { useQuery } from '@tanstack/react-query';
import { DiscountedSalesChart, MetricCard, RevenueChart } from './charts';
import BudgetCard from './budget-chart';
import { axiosInstace } from '@/utils/axiosService';
import type { DashboardData } from './types';

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await axiosInstace('/admin/dashboard');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  // ---- HARD GATE: data does NOT exist beyond this point ----
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    console.error(error);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    totalOrders,
    weeklySales,
    products,
    refunds,
    discountedSalesData,
    discountedSales,
    totalBudget,
    earning,
    expense,
    revenueData,
  } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden">←</button>
            <div>
              <h1 className="text-xl font-semibold">E-Commerce-v.2</h1>
              <p className="text-sm text-gray-500">
                Dashboard &gt; E-Commerce-v.2
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg">
              Manage Sales
            </button>
            <button className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg">
              Add Products
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard metric={totalOrders} color="bg-purple-500" />
          <MetricCard metric={weeklySales} color="bg-orange-400" />
          <MetricCard metric={products} color="bg-blue-500" />
          <MetricCard metric={refunds} color="bg-red-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DiscountedSalesChart
              data={discountedSalesData}
              total={discountedSales}
            />
          </div>
          <BudgetCard
            total={totalBudget}
            earning={earning}
            expense={expense}
          />
        </div>

        <div className="mt-6">
          <RevenueChart data={revenueData} year="2022" />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
