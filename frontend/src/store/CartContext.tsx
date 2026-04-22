import { toast } from "sonner";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "./UserContext";
import { axiosInstace } from "@/utils/axiosService";

export interface ProductType {
  _id: string;
  images: string[];
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
  addProductToCart: (product: ProductType) => Promise<void>;
  removeItemFromCart: (_id: string) => Promise<void>;
}

export const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

const showToast = (message: string, isError = false) => {
  toast.custom((t) => (
    <div
      className={`px-4 py-2 rounded shadow-lg cursor-pointer ${isError ? "bg-black text-red-500" : "bg-black text-white"
        }`}
      onClick={() => toast.dismiss(t)}
    >
      {message}
    </div>
  ));
};

export const CartContextProvider = ({
  children,
}: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const userCtx = useContext(UserContext);
  const user = userCtx?.user ?? null;
  const userLoading = userCtx?.loading ?? false;

  const navigate = useNavigate();

  const addProductToCart = async ({
    _id,
    productName,
    description,
    price,
    images,
  }: ProductType) => {
    try {
      if (userLoading) return;

      if (!user) {
        navigate("/authentication");
        return;
      }

      const existingProduct = cartItems.find(
        (product) => product._id === _id
      );

      const newCartItems: CartItem[] = existingProduct
        ? cartItems.map((product) =>
          product._id === _id
            ? {
              ...product,
              quantity: product.quantity + 1,
            }
            : product
        )
        : [
          ...cartItems,
          {
            _id,
            productName,
            description,
            price,
            images,
            quantity: 1,
          },
        ];

      const previousCart = cartItems;

      // optimistic update
      setCartItems(newCartItems);

      const response = await axiosInstace.post(
        "/user/updateCart",
        { cartItems: newCartItems }
      );

      if (response.status !== 200) {
        setCartItems(previousCart);

        const error =
          response.data?.error ||
          "Could not add item to cart.";

        showToast(error, true);
        return;
      }

      showToast("Product added to cart");
    } catch (error: any) {
      console.error("addProductToCart error:", error);

      setCartItems(cartItems);

      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update cart.";

      showToast(errorMessage, true);
    }
  };

  const removeItemFromCart = async (_id: string) => {
    try {
      if (userLoading) return;

      if (!user) {
        navigate("/authentication");
        return;
      }

      const existingProduct = cartItems.find(
        (product) => product._id === _id
      );

      if (!existingProduct) return;

      const updatedCart: CartItem[] =
        existingProduct.quantity > 1
          ? cartItems.map((product) =>
            product._id === _id
              ? {
                ...product,
                quantity: product.quantity - 1,
              }
              : product
          )
          : cartItems.filter(
            (product) => product._id !== _id
          );

      const previousCart = cartItems;

      // optimistic update
      setCartItems(updatedCart);

      const response = await axiosInstace.post(
        "/user/updateCart",
        { cartItems: updatedCart }
      );

      if (response.status !== 200) {
        setCartItems(previousCart);

        const error =
          response.data?.error ||
          "Could not update cart.";

        showToast(error, true);
        return;
      }

      showToast("Cart updated");
    } catch (error: any) {
      console.error("removeItemFromCart error:", error);

      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update cart.";

      showToast(errorMessage, true);
    }
  };

  useEffect(() => {
    if (user?.cart && Array.isArray(user.cart)) {
      setCartItems(user.cart as CartItem[]);
    } else {
      setCartItems([]);
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addProductToCart,
        removeItemFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};