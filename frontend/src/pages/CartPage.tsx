import { useContext, useEffect, useState } from "react"
import { CartContext } from "@/store/CartContext"
import Product from "@/components/Product";
import { useNavigate } from "react-router-dom";
import type { CartContextType } from "@/store/CartContext";
import { UserContext } from "@/store/UserContext";
import { AddressManager } from "@/components/AddressManager";
import { toast } from "sonner";
import { axiosInstace } from "@/utils/axiosService";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/CheckOutBill"
const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext) as CartContextType;
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const userCtx = useContext(UserContext);
  const user = userCtx ? userCtx.user : null;
  const userLoading = userCtx ? userCtx.loading : false;
  const calculateTotal = () => {
    let sum = 0;
    cartItems.forEach((product) => {
      sum += product.price * product.quantity;
    });
    setTotalAmount(sum);
  };

  const handleBuyBtn = async () => {
    if (user?.addresses[0] === undefined || user?.addresses[0] === null) {
      return toast.error("Pls Add Address to place an Order")
    }
    const orderItems = cartItems.map(item => ({
      product_id: item._id,
      quantity: item.quantity,
      unit_price: item.price
    }));

    const { data: { key } } = await axiosInstace.get(`${import.meta.env.VITE_Backend_URL}/getkey`);
    const response = await axiosInstace.post(`${import.meta.env.VITE_Backend_URL}/payment/createOrder`, {
      orderItems: orderItems,
      address: user?.addresses[0],
    });

    console.log(response); 

    if (response.status === 200) {
      const options = {
        key: key,
        amount: response.data.order.amount,
        currency: response.data.order.currency,
        name: "devKC",
        description: "Test Transaction",
        order_id: response.data.order.id,
        callback_url: `${import.meta.env.VITE_Backend_URL}/payment/paymentverification`,
        theme: { color: "#3399cc" },
      };

      const rzp: any = new window.Razorpay(options);
      rzp.open();
    }
  };
  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      navigate("/authentication");
    }
  }, [user, userLoading, navigate]);

  useEffect(() => {
    calculateTotal();
  }, [cartItems])
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Your Cart</h1>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-gray-900 text-gray-900 hover:bg-gray-50 font-medium"
          >
            Back
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              {cartItems.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {cartItems.map((product) => (
                    <Product key={product._id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No items in cart
                </div>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="mb-6">
                <DataTable columns={columns} data={cartItems} />
              </div>

              <div className="flex items-center justify-between py-4 mb-6 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">₹{totalAmount}</span>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-100">
                <AddressManager address={user?.addresses[0] ? user.addresses[0] : null} />
              </div>

              <button
                onClick={() => handleBuyBtn()}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage