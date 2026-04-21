import express, { Request, Response } from "express";
import { createProduct } from "../controllers/productController.js";
import Product from "../models/productModel.js";
import { adminVerifyToken } from "../controllers/auth.js";

const router = express.Router();

router.post('/createProduct', adminVerifyToken, async (req: Request, res: Response) => {
    try {
        const { productName, description, price, images } = req.body;
        if (!productName || !description || !price || !images) return res.status(401).send("not enough data");
        let product = {
            productName,
            description,
            price,
            images,
            rating: 0
        }
        const result = await createProduct(product);
        return res.send(result);
    } catch (error) {
        console.log(error);
    }
})

export const updateProductById = async (id: string, update: any) => {
    return await Product.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true } // return updated doc
    );
};

router.put(
    "/updateProduct/:id",
    adminVerifyToken,
    async (req: Request, res: Response) => {
        try {
            
            const { id } = req.params;
            const { productName, description, price, images, quantity } = req.body;

            if (!id) {
                return res.status(400).json({ message: "Product ID is required" });
            }

            // build update object dynamically (partial updates allowed)
            const updateFields: any = {};

            if (productName !== undefined) updateFields.productName = productName;
            if (description !== undefined) updateFields.description = description;
            if (price !== undefined) updateFields.price = price;
            if (images !== undefined) updateFields.images = images;
            if (quantity !== undefined) updateFields.quantity = quantity;

            if (Object.keys(updateFields).length === 0) {
                return res.status(400).json({ message: "No fields to update" });
            }
            console.log("\n\n")
            console.log(updateFields)
            console.log("\n\n")
            // direct DB call (no separate function)
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                { $set: updateFields },
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }
            console.log("Updated Product",updatedProduct);
            return res.json(updatedProduct);
        } catch (error) {
            console.error("Update product error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }
);

router.delete(
    "/deleteProduct/:id",
    adminVerifyToken,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "Product ID is required" });
            }

            const deletedProduct = await Product.findByIdAndDelete(id);

            if (!deletedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }

            return res.json({ message: "Product deleted successfully" });
        } catch (error) {
            console.error("Delete product error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }
);

router.get('/getProducts', async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (error) {
        console.log(error);
    }
})
export default router;