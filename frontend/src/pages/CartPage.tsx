import { useContext, useEffect, useState } from "react"
import { CartContext } from "@/store/CartContext"
import Product from "@/components/Product";
import { useNavigate } from "react-router-dom";
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
          <div className="total px-5 text-2xl font-bold">
            Total : ${totalAmount}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage