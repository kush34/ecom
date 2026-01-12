import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"
import { OrderCard } from "./OrderCard"
import type { Order } from "./types"

export const OrdersSection = ({ orders }: { orders: Order[] }) => (
  <Card className="bg-white border border-gray-200 shadow-sm">
    <CardTitle className="p-6 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-gray-700" />
        <span className="text-lg font-semibold text-gray-900">Orders</span>
        <span className="ml-auto text-sm text-gray-500">{orders.length} total</span>
      </div>
    </CardTitle>
    <CardContent className="p-6">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </CardContent>
  </Card>
)