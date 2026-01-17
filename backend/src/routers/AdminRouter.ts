import express from "express";
import { adminVerifyToken } from "../controllers/auth";
import { dashboard } from "../controllers/adminController";

const router = express.Router();

router.use(adminVerifyToken);

router.get("/dashboard",dashboard)

export default router