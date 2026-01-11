import express from "express";
import { checkout, paymentVerification } from "../controllers/paymentController.js";
import { verifyToken } from "../controllers/auth.js";

const router = express.Router();

router.post("/createOrder", verifyToken, checkout)
// dont add token verify as this endpoint will be hit by payment gateway from their server.
router.post("/paymentverification", paymentVerification);

export default router;