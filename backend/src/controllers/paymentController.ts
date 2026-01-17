import { instance } from "../config/razorpay.js";
import { getPrice } from "./productController.js";
import { Payment } from "../models/paymentModel.js";
import { Order } from "../models/orderModel.js";
import crypto from "crypto";
import { Request, Response } from "express";
import { error } from "console";

// ----------------------------
// CREATE ORDER + INIT PAYMENT
// ----------------------------
const KEY_SECRET = process.env.key_secret;

export const checkout = async (req: Request, res: Response) => {
  try {
    const { orderItems, address } = req.body;
    console.log("Checkout Order:", orderItems);
    console.log("Checkout Address:", address);
    const user_id = req.user;
    if (!Array.isArray(orderItems) || orderItems.length === 0)
      return res.status(400).send("No products provided.");

    if (!user_id || !address)
      return res.status(400).send("Missing user or address details.");

    const price = await getPrice(orderItems);
    if (price <= 0) return res.status(400).send("Invalid order request. price cannot be zero");
    if (typeof price !== "number") {
      console.log("Price is not a number")
      return;
    }
    const options = {
      amount: price * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };
    const razorpayOrder = await instance.orders.create(options);

    const dbOrder = await Order.create({
      products: orderItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      total_price: price,
      user_id,
      address,
      razorpay_order_id: razorpayOrder.id,
      status: "pending",
    });

    res.json({ success: true, order: razorpayOrder, dbOrderId: dbOrder._id });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).send("Something went wrong during checkout.");
  }
};

// ----------------------------
// VERIFY PAYMENT
// ----------------------------
export const paymentVerification = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    if (!KEY_SECRET) {
      throw new error("KEY_SECRET NOT present")
    }
    const expectedSignature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic)
      return res.status(400).json({ success: false, message: "Invalid payment signature." });

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    await Order.findOneAndUpdate(
      { razorpay_order_id },
      { status: "paid" },
      { new: true }
    );

    res.redirect(`${process.env.Frontend_URL}/payment/${razorpay_payment_id}`);
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).send("Something went wrong during payment verification.");
  }
};
