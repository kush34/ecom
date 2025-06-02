import { useContext, useEffect, useState } from "react"
import { CartContext } from "@/store/CartContext"
import Product from "@/components/Product";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const CartPage = () => {
  const navigate = useNavigate();
  const {cartItems} = useContext(CartContext);
  const [totalAmount,setTotalAmount] = useState();
  const calculateTotal = ()=>{
    let sum = 0;
    cartItems.map((product)=>{
      sum += product.price * product.quantity;
    })
    setTotalAmount(sum)
  }

const handleBuyBtn = async () => {
  const orderItems = cartItems.map(item => ({
    productId: item._id,
    quantity: item.quantity
  }));

  const { data: { key } } = await axios.get(`${import.meta.env.VITE_Backend_URL}/getkey`);
  const response = await axios.post(`${import.meta.env.VITE_Backend_URL}/payment/createOrder`, {
    orderItems: orderItems
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

    const rzp = new window.Razorpay(options);
    rzp.open();
  }
};

  useEffect(()=>{
    calculateTotal();
  },[cartItems])
  return (
    <div className="p-5 w-full h-screen">
      <div className="flex justify-between">
        <div className="title font-bold text-3xl">
          Your Cart
        </div>
        <div className="backbtn text-2xl">
          <button className="cursor-pointer" onClick={()=>navigate("/")}>Back</button>
        </div>
      </div>
      <div className="cartlanding flex w-full">
        <div className="cartItems w-3/4">
          {cartItems.length > 0 ? 
          <div className="flex flex-wrap">
            {
              cartItems.map((product)=>{
                return(
                  <Product key={product._id} {...product}/>
                )
              })  
            }
          </div>
          :
          <div>No items found</div>
          }
        </div>
        <div className="billing w-1/4">
          <div className="text-lg">
            {cartItems.map((product)=>{
              return(
                <div className="flex justify-between">
                <div>{product.productName}</div>
                <div>{product.quantity}</div>
                </div>
              )
            })}
          </div>
          <div className="total px-5 text-2xl font-bold">
            Total : ${totalAmount}
          </div>
          <div className="buy flex justify-center m-5">
            <button onClick={()=>handleBuyBtn()} className="bg-sky-600 rounded px-10 cursor-pointer py-2 text-white ">Buy</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage