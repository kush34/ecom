import { createContext, useState, ReactNode } from "react";

interface Product {
  _id: string;
  productName: string;
  description: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addProductToCart: (product: Product) => void;
  removeItemFromCart: (_id: string) => void;
}

export const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export const CartContextProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addProductToCart = ({ _id, productName, description, price }: Product) => {
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
