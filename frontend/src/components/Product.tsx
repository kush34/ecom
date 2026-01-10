import { CartContext } from '@/store/CartContext';
import { Minus } from 'lucide-react';
import { Plus } from 'lucide-react';
import { useContext } from 'react';
import type { ProductType } from '@/store/CartContext';
import type { CartContextType } from '@/store/CartContext';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"

const Product = ({ productName, price, description, _id, quantity }: ProductType) => {
  const { addProductToCart, removeItemFromCart } = useContext(CartContext) as CartContextType;
  return (
    <Card className='border-none'>
      <CardContent>
        <img src={`./img${Math.floor(Math.random() * 4) + 1}.jpg`} className="rounded w-full h-72" alt="" />
      </CardContent>
      <CardTitle className='px-5'>{productName}</CardTitle>
      <CardDescription className='px-5'>
        {description}
      </CardDescription>
      <CardFooter className='flex gap-2 p-2'>
        <Button onClick={() => removeItemFromCart(_id)}><Minus /></Button>
        <span className='text-xl m-2'>
          {quantity}
        </span>
        <Button onClick={() => addProductToCart({ productName, price, description, _id })}><Plus /></Button>
        <span className='p-2'>₹ {price}</span>
      </CardFooter>
    </Card>
  )
}

export default Product
