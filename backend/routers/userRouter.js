import express from "express";
import { verifyToken } from "../controllers/auth.js";
import { addAddress, login, refreshToken, register, updateCart, userInfo } from "../controllers/userController.js";

const router = express.Router();


router.post("/register", register)

router.post("/login", login)

router.post("/refresh-token", refreshToken);

router.get("/userInfo", verifyToken, userInfo);

router.post("/addAddress", verifyToken, addAddress);

router.post("/updateCart", verifyToken, updateCart)

export default router;