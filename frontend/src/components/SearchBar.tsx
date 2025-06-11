import { CircleUser } from 'lucide-react';
import { CartContext, type CartItem } from '@/store/CartContext';
import { Bell } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CartContextType } from '@/store/CartContext';
import { UserContext } from '@/store/UserContext';
const SearchBar = () => {
    const navigate = useNavigate();
    const {cartItems} = useContext(CartContext) as CartContextType;
    const cartCtx = useContext(UserContext);
    const user = cartCtx.user !== null ? cartCtx.user : null; 
    const [numberItems,setNumberItems] = useState<number>();
    useEffect(()=>{
        let num = 0;
        if(cartItems.length != 0)cartItems?.map((product:CartItem)=>{num += product.quantity});
        setNumberItems(num);
    },[cartItems])
  return (
    <div className='flex justify-around items-center w-full mt-3'>
        <div className="brand text-3xl font-bold">
            EcomBrand.com
        </div>
        <div className="searchbar w-2/3 flex justify-center items-center border border-zinc-600 rounded">
            <div className='mx-5 w-1/5 border-r border-zinc-600'>
                <select name="All category" id="" className='outline-none'>
                    <option value="All category" className='font-medium text-zinc-600'>All Category</option>
                    <option value="All category" className='font-medium text-zinc-600'>Indic</option>
                    <option value="All category" className='font-medium text-zinc-600'>Old Money</option>
                </select>
            </div>
            <div className='w-4/5'>
                <input type="text" className='w-full px-5 py-2 outline-none rounded' placeholder='Search for product or brand' />
            </div>
        </div>
        <div className='flex gap-5 text-zinc-600'>
            <button onClick={()=>navigate('/cart')} className="cart cursor-pointer flex"><ShoppingBag />{numberItems}</button>
            <button className="notification"><Bell/></button>
            {user !== null && <button onClick={()=>navigate("/userDetails")} className='cursor-pointer'><CircleUser/></button>}
        </div>
    </div>
  )
}

export default SearchBar