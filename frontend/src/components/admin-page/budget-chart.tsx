import { TrendingDown, TrendingUp } from "lucide-react";

const BudgetCard: React.FC<{ total: number; earning: number; expense: number }> = ({ total, earning, expense }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col justify-between">
    <div className="flex items-center justify-center mb-4">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="#a855f7"
            strokeWidth="8"
            strokeDasharray={`${(earning / total) * 352} 352`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Total Budget</span>
        <span className="text-lg font-semibold">${total.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm">Earning in this year</span>
        </div>
        <span className="font-semibold">${earning.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-500" />
          <span className="text-sm">Expense in this year</span>
        </div>
        <span className="font-semibold">${expense.toLocaleString()}</span>
      </div>
      <button className="w-full bg-purple-600 text-white py-2 rounded-lg mt-4">
        Increase Budget
      </button>
    </div>
  </div>
);

export default BudgetCard;