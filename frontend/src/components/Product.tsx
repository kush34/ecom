import { CartContext } from '@/store/CartContext';
import { Minus } from 'lucide-react';
import { Plus } from 'lucide-react';
import { useContext } from 'react';
import type { ProductType } from '@/store/CartContext';
import type { CartContextType } from '@/store/CartContext';

const Product = ({productName,price,description,_id,quantity}:ProductType) => {
  const { addProductToCart, removeItemFromCart } = useContext(CartContext) as CartContextType;
  return (
    <div className="m-3 bg-zinc-100 w-1/4 text-zinc-700 hover:bg-zinc-200 hover:scale-101 ease-in duration-100 cursor-pointer shadow-lg">
        <div className="images">
            <img src="/img1.jpg" className="p-5 rounded w-full h-72" alt="" />
        </div>
        <div className="ProductName mx-5 text-xl flex justify-start font-bold">{productName}</div>
        <div className="bottom flex justify-between w-full p-2">
            <div className="Price text-xl font-bold flex justify-start mx-5">${price}</div>
            {
              quantity &&
              <>
              <div>
                <button className='cursor-pointer text-4xl' onClick={()=>removeItemFromCart(_id)}><Minus/></button>
              </div>
              <div className=''>
                {quantity}
              </div>
              </>
            }
            <div className="addtoCard mx-5"><button onClick={()=>addProductToCart({productName,price,description,_id})} className='hover:scale-150 ease-in duration-100 cursor-pointer'><Plus/></button></div>
        </div>
    </div>
  )
}

export default Product