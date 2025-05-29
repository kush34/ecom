import { useContext } from "react"
import { CartContext } from "@/store/CartContext"
import Product from "@/components/Product";
import { useNavigate } from "react-router-dom";
const CartPage = () => {
  const navigate = useNavigate();
  const {cartItems} = useContext(CartContext);
  return (
    <div className="p-5">
      <div className="flex justify-between">
        <div className="title font-bold text-3xl">
          Your Cart
        </div>
        <div className="backbtn text-2xl">
          <button className="cursor-pointer" onClick={()=>navigate("/")}>Back</button>
        </div>
      </div>
      <div className="cartItems">
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
    </div>
  )
}

export default CartPage