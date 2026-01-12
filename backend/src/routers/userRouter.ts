import express from "express";
import { adminVerifyToken, verifyToken } from "../controllers/auth.js";
import { addAddress, login, refreshToken, register, updateCart, userInfo, getOrders, getAdminOrders } from "../controllers/userController.js";

const router = express.Router();


router.post("/register", register)

router.post("/login", login)

router.post("/refresh-token", refreshToken);

router.get("/userInfo", verifyToken, userInfo);

router.post("/addAddress", verifyToken, addAddress);

router.post("/updateCart", verifyToken, updateCart);

router.get("/getOrders", verifyToken, getOrders)

router.get("/admin/getOrders", adminVerifyToken, getAdminOrders)
export default router;