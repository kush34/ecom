import { Card, CardContent } from "@/components/ui/card"
import { Package, MapPin, Phone, Calendar } from "lucide-react"
import type { Order } from "./types"

export const OrderCard = ({ order }: { order: Order }) => (
  <Card className="bg-white border border-gray-200 shadow-sm mb-4">
    <CardContent className="p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Package className="w-4 h-4 text-gray-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Order ID</p>
            <p className="text-sm font-medium text-gray-900">{order._id}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {order.status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {order.products.map((item) => (
          <div key={item.product_id._id} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-900">{item.product_id.productName}</span>
              <span className="text-gray-900 font-medium">
                {item.quantity} X ₹{item.unit_price}
              </span>
            </div>
            <p className="text-xs text-gray-500">{item.product_id.description}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total</span>
          <span className="text-lg font-semibold text-gray-900">₹{order.total_price}</span>
        </div>
      </div>

      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3" />
          <span>{order.address.city} - {order.address.pincode}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3 h-3" />
          <span>{order.address.contact}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </CardContent>
  </Card>
)