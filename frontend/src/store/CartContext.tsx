
import { toast } from "sonner"
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { axiosInstace } from "@/utils/axiosService";

export interface ProductType {
  _id: string;
  productName: string;
  description: string;
  price: number;
  quantity?: number;
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
  if (!UserContext) {
    console.error("UserContext is not available");
    return null; // or show fallback
  }
  const userCtx = useContext(UserContext);
  const user = userCtx ? userCtx.user : null;
  const userLoading = userCtx?.loading;
  const navigate = useNavigate();

  const addProductToCart = async ({ _id, productName, description, price }: ProductType) => {
    try {
      if (userLoading) return;
      if (user === null && !userLoading) {
        navigate("/authentication");
        return;
      }
      const existingProduct = cartItems.find((product) => product._id === _id);


      const newCartItems: CartItem[] = existingProduct
        ? cartItems.map((product) =>
          product._id === _id ? { ...product, quantity: product.quantity + 1 } : product
        )
        : [
          ...cartItems,
          { _id, productName, description, price, quantity: 1 },
        ];
      setCartItems(newCartItems);
      const updatedCart = await axiosInstace.post(`${import.meta.env.VITE_Backend_URL}/user/updateCart`, { cartItems: newCartItems })

      if (updatedCart.status !== 200) {
        const error = updatedCart.data?.error || "Could not add the item to cart.";

        toast.custom((t) => (
          <div
            className="bg-black text-red px-4 py-2 rounded shadow-lg"
            onClick={() => toast.dismiss(t)}
          >
            {error}
          </div>
        )
        )
      } else {
        toast.custom((t) => (
          <div
            className="bg-black text-white px-4 py-2 rounded shadow-lg"
            onClick={() => toast.dismiss(t)}
          >
            Added Product to the cart
          </div>
        )
        )

      }

    } catch (error) {

    }
  };

  const removeItemFromCart = async (_id: string) => {
    if (!user && !userLoading) {
      navigate("/authentication");
      return;
    }
  if(!user) return;

    const existingProduct = cartItems.find((product) => product._id === _id);
    if (!existingProduct) return; // nothing to remove

    // compute new cart synchronously
    const updatedCart =
      existingProduct.quantity > 1
        ? cartItems.map((product) =>
          product._id === _id ? { ...product, quantity: product.quantity - 1 } : product
        )
        : cartItems.filter((product) => product._id !== _id);

    // keep previous state for possible rollback
    const previousCart = cartItems;

    // optimistic UI update
    setCartItems(updatedCart);

    try {
      // send new cart to server (axiosInstance should be configured with baseURL and withCredentials)
      const resp = await axiosInstace.post("/user/updateCart", { cartItems: updatedCart });

      // axios throws for non-2xx, but check just in case
      if (resp.status !== 200) {
        // rollback and notify
        setCartItems(previousCart);
        const serverMessage = resp.data?.error || "Could not update cart.";
        toast.custom((t) => (
          <div className="bg-black text-red px-4 py-2 rounded shadow-lg" onClick={() => toast.dismiss(t)}>
            {serverMessage}
          </div>
        ));
      } else {
        // success feedback (optional)
        toast.custom((t) => (
          <div className="bg-black text-white px-4 py-2 rounded shadow-lg" onClick={() => toast.dismiss(t)}>
            Cart updated
          </div>
        ));
      }
    } catch (err: any) {
      console.error("removeItemFromCart error:", err);
      // rollback optimistic update
      setCartItems(previousCart);

      const serverMessage = err?.response?.data?.error || err?.message || "Failed to update cart.";
      toast.custom((t) => (
        <div className="bg-black text-red px-4 py-2 rounded shadow-lg" onClick={() => toast.dismiss(t)}>
          {serverMessage}
        </div>
      ));
    }
  };


  useEffect(() => {
    if (user && Array.isArray(user.cart)) {

      setCartItems(user.cart as CartItem[]);
    } else {
      setCartItems([]);
    }
  }, [user]);
  return (
    <CartContext.Provider value={{ cartItems, addProductToCart, removeItemFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
