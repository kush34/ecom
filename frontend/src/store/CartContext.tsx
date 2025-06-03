
import { toast } from "sonner"
import { createContext, useState } from "react";
import type {ReactNode} from "react";

export interface ProductType {
  _id: string;
  productName: string;
  description: string;
  price: number;
  quantity?:number;
}

export interface CartItem extends ProductType {
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addProductToCart: (product: ProductType) => void;
  removeItemFromCart: (_id: string) => void;
}

export const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export const CartContextProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addProductToCart = ({ _id, productName, description, price }: ProductType) => {
    const existingProduct = cartItems.find((product) => product._id === _id);

    if (existingProduct) {
      const updatedCart: CartItem[] = cartItems.map((product) =>
        product._id === _id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      );
      setCartItems(updatedCart);
    } else {
      setCartItems([
        ...cartItems,
        { _id, productName, description, price, quantity: 1 },
      ]);
    }
    toast.custom((t)=>(
       <div
    className="bg-black text-white px-4 py-2 rounded shadow-lg"
    onClick={() => toast.dismiss(t)}
  >
    Added Product to the cart
  </div>
    )
    )
  };

  const removeItemFromCart = (_id: string) => {
    const existingProduct = cartItems.find((product) => product._id === _id);
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        const updatedCart = cartItems.map((product) =>
          product._id === _id
            ? { ...product, quantity: product.quantity - 1 }
            : product
        );
        setCartItems(updatedCart);
      } else {
        const updatedCart = cartItems.filter((product) => product._id !== _id);
        setCartItems(updatedCart);
      }
    }
  };
  return (
    <CartContext.Provider value={{ cartItems, addProductToCart, removeItemFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
