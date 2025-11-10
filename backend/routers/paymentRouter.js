import express from "express";
import { checkout, paymentVerification } from "../controllers/paymentController.js";
import { verifyToken } from "../controllers/auth.js";

const router = express.Router();

router.post("/createOrder", verifyToken, checkout)
router.post("/paymentverification", verifyToken, paymentVerification);

export default router;