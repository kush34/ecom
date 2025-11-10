import mongoose from "mongoose";
import Product from "../models/productModel.js";

export const createProduct = async (productName,description,price,images)=>{
    try {
        const newProduct = await Product.create({productName,description,price,images});
        if(newProduct) return newProduct;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const getPrice = async (orderItems) => {
  try {
    const results = await Promise.all(orderItems.map(async (item) => {
      const product = await Product.findOne({ _id: item.product_id });
      return product ? product.price * item.quantity : 0;
    }));

    const totalPrice = results.reduce((acc, curr) => acc + curr, 0);
    return totalPrice;
  } catch (error) {
    console.log(error);
    return error;
  }
};
