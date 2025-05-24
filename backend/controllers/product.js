import mongoose from "mongoose";
import Product from "../models/productModel.js";

export const createProduct = async (productName,description,price,images)=>{
    try {
        const newProduct = await Product.create({productName,description,price,images});
        if(newProduct) return newProduct;
    } catch (error) {
        console.log(error);
    }
}