import { instance } from "../config/razorpay.js"
import { getPrice } from "./product.js";
import {Payment} from "../models/paymentModel.js"
import crypto from "crypto";
export const checkout = async (req,res)=>{
    try {
        const {orderItems} = req.body;
        console.log(orderItems)
        if(!orderItems) res.status(403).send("not enough data");

        if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
            return res.status(403).send("Not enough data");
        }

        const price = await getPrice(orderItems);
        if(price == 0) return res.status(403).send("pls select valid request");
        const options = {
            amount: price*100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            receipt: "order_rcptid_11"
        };
        const order = await instance.orders.create(options); 
        console.log(order);
        res.send({order});
    } catch (error) {
        console.log(error)
        res.status(500).send("some thing went wrong");
    }
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.key_secret)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(
      `${process.env.Frontend_URL}/payment/${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};