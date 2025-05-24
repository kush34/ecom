import express from "express";
import { createProduct } from "../controllers/product.js";

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

export default router;