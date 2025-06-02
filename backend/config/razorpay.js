import Razorpay from "razorpay";

export const instance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

