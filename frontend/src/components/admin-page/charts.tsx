import { MoreVertical, TrendingDown, TrendingUp } from "lucide-react";
import type { DashboardMetric, RevenueDataPoint } from "./types";

const MetricCard: React.FC<{ metric: DashboardMetric; color: string }> = ({ metric, color }) => {
  const isPositive = metric.trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">{metric.label}</span>
        <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          <span>{metric.change}</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold">{metric.value}</span>
        <div className="flex items-end gap-0.5 h-8">
          {metric.chartData.map((h, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-t ${color}`}
              style={{ height: `${h > 0 ? (h / Math.max(...metric.chartData)) * 100 : 0}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const DiscountedSalesChart: React.FC<{ data: { date: string; value: number }[]; total: number }> = ({ data, total }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium">Discounted sales in this month</h3>
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex items-center justify-center h-48 text-gray-400">
          No sales data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const midPoint = Math.floor(data.length / 2);
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium">Discounted sales in this month</h3>
        <MoreVertical className="w-5 h-5 text-gray-400" />
      </div>
      <div className="mb-6">
        <span className="text-3xl font-semibold">₹{total.toLocaleString()}</span>
      </div>
      <div className="relative h-32 flex items-end gap-1">
        {data.map((point, i) => (
          <div
            key={i}
            className="flex-1 bg-purple-300 rounded-t relative"
            style={{ height: `${maxValue > 0 ? (point.value / maxValue) * 100 : 0}%` }}
          >
            {i >= midPoint && <div className="absolute inset-0 bg-purple-500 rounded-t" />}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.length > 0 && (
          <>
            <span>{data[0]?.date}</span>
            {data.length > 6 && <span>{data[Math.floor(data.length / 6)]?.date}</span>}
            {data.length > 3 && <span>{data[Math.floor(data.length / 3)]?.date}</span>}
            {data.length > 2 && <span>{data[Math.floor(data.length / 2)]?.date}</span>}
            {data.length > 1 && <span>{data[data.length - 1]?.date}</span>}
          </>
        )}
      </div>
      <div className="mt-4 flex gap-2 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-300 rounded" />
          <span>First Half</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-500 rounded" />
          <span>Second Half</span>
        </div>
      </div>
    </div>
  );
};

const RevenueChart: React.FC<{ data: RevenueDataPoint[]; year: string }> = ({ data, year }) => {
  const maxVal = Math.max(...data.flatMap(d => [Math.abs(d.income), Math.abs(d.expense)]));
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium">Total revenue</h3>
        <div className="flex gap-4">
          <button className="px-3 py-1 text-xs bg-gray-100 rounded">Income</button>
          <button className="px-3 py-1 text-xs text-gray-600">Expense</button>
          <select className="text-xs border-none outline-none">{year}</select>
        </div>
      </div>
      <div className="relative h-48 flex items-center justify-around border-t border-b border-gray-200 py-4">
        {data.map((point, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <div className="flex flex-col items-center justify-center h-32 gap-1">
              <div
                className="w-3 bg-gray-300 rounded-full"
                style={{ height: `${(Math.abs(point.income) / maxVal) * 80}px` }}
              />
              <div
                className="w-3 bg-purple-600 rounded-full"
                style={{ height: `${(Math.abs(point.expense) / maxVal) * 80}px` }}
              />
            </div>
            <span className="text-xs text-gray-500">{point.month}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 mt-6 text-xs">
        {[-20, -10, 0, 10, 20, 30].map(val => (
          <div key={val} className="text-gray-400">{val}</div>
        ))}
      </div>
    </div>
  );
};



export  {MetricCard,RevenueChart,DiscountedSalesChart};