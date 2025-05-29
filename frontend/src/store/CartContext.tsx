import Product from "@/components/Product";
import { createContext, useState } from "react";

const CartContext = createContext(null);

const CartContextProvider = ({children})=>{
    const [cartItems,setCartItems] = useState([]);
    const addProductToCart = ({ _id, productName, description, price }) => {
        const existingProduct = cartItems.find((product) => product._id === _id);

        if (existingProduct) {
            // Update quantity of existing product
            const updatedCart = cartItems.map((product) =>
                product._id === _id
                    ? { ...product, quantity: product.quantity + 1 }
                    : product
            );
            setCartItems(updatedCart);
        } else {
            // Add new product to cart
            setCartItems([
                ...cartItems,
                { _id, productName, description, price, quantity: 1 }
            ]);
        }
    };
    const removeItemFromCart = ( _id)=>{
        const existingProduct = cartItems.find((product)=>product._id === _id);
        if(existingProduct){
            if(existingProduct.quantity > 1){
                const updatedCart = cartItems.map((product)=>
                    product._id === _id ? {...product,quantity: product.quantity-1} : product 
                )
                setCartItems(updatedCart);
            }else{
                const updatedCart = cartItems.filter((product)=> product._id !== _id);
                setCartItems(updatedCart);
            }
        }
    }
    return(
        <CartContext.Provider value={{cartItems,addProductToCart,removeItemFromCart}}>
            {children}
        </CartContext.Provider>
    )
}

export {CartContext,CartContextProvider};