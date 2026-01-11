import express, { Request, Response } from "express";
import { createProduct } from "../controllers/productController.js";
import Product from "../models/productModel.js";

const router = express.Router();

router.post('/createProduct', async (req: Request, res: Response) => {
    try {
        const { productName, description, price, images } = req.body;
        if (!productName || !description || !price || !images) return res.status(401).send("not enough data");
        let product = {
            productName,
            description,
            price,
            images,
            rating:0
        }
        const result = await createProduct(product);
        return res.send(result);
    } catch (error) {
        console.log(error);
    }
})

router.get('/getProducts', async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (error) {
        console.log(error);
    }
})
export default router;