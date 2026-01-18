import { X } from "lucide-react";
import type { AdminOrder } from "../admin-colums/admin-columns";
import { Button } from "../ui/button";

const OrderModal = ({ order, onClose }: { order: AdminOrder; onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-[600px] rounded p-5">
                <div className="flex justify-between">
                <h3 className="text-xl font-bold mb-4 text-muted">Order #{order._id}</h3>
                <button onClick={onClose}><X/></button>
                </div>
                <div className="space-y-2 my-5">
                    {order.products.map((p) => (
                        <div key={p.product_id._id} className="flex justify-between border-b pb-2">
                            <div>
                                <p className="font-medium">{p.product_id.productName}</p>
                                <p className="text-xs text-gray-500">
                                    Qty: {p.quantity}
                                </p>
                            </div>
                            <p>₹{p.unit_price * p.quantity}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-4 font-semibold">
                    Total: ₹{order.total_price}
                </div>

                <Button onClick={onClose} className="mt-4 text-white btn">
                    Close
                </Button>
            </div>
        </div>
    )
}
export default OrderModal;