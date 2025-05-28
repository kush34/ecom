import express from "express";
import { createProduct } from "../controllers/product.js";
import Product from "../models/productModel.js";

const router = express.Router();

router.post('/createProduct',async (req,res)=>{
    try {
        const {productName,description,price,images} = req.body;
        if(!productName || !description || !price || !images) return  res.status(401).send("not enough data");
        const result = await createProduct(productName,description,price,images);
        return res.send(result);
    } catch (error) {
        console.log(error);
    }
})

router.get('/getProducts', async (req,res)=>{
    try {
        const products = await Product.find();
        res.send(products);
    } catch (error) {
        console.log(error);
    }
})
export default router;