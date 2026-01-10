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

    console.log(response); // Check if this logs the correct structure

    if (response.status === 200) {
      const options = {
        key: key,
        amount: response.data.order.amount,
        currency: response.data.order.currency,
        name: "devKC",
        description: "Test Transaction",
        order_id: response.data.order.id, // ✅ FIXED
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
    <div className="p-5 w-full h-screen">
      <div className="flex justify-between">
        <div className="title font-bold text-3xl mx-3">
          Your Cart
        </div>
        <div className="backbtn text-2xl">
          <Button className="cursor-pointer" onClick={() => navigate("/")}>Back</Button>
        </div>
      </div>
      <div className="cartlanding flex w-full">
        <div className="cartItems w-3/4">
          {cartItems.length > 0 ?
            <div className="flex flex-wrap gap-5">
              {
                cartItems.map((product) => {
                  return (
                    <Product key={product._id} {...product} />
                  )
                })
              }
            </div>
            :
            <div>No items found</div>
          }
        </div>
        <div className="billing w-1/4 mr-12">
          <div className="text-lg mt-5">
            <DataTable columns={columns} data={cartItems} />
          </div>
          <div className="total mt-5 text-2xl font-bold">
            Total : ₹{totalAmount}
          </div>
          <div className=" flex text-sm font-light text-black">
            <AddressManager address={user?.addresses[0] ? user.addresses[0] : null} />
          </div>
          <div className="buy flex justify-center m-5">
            <button onClick={() => handleBuyBtn()} className="bg-sky-600 rounded px-10 cursor-pointer py-2 text-white ">Buy</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage