import mongoose from "mongoose";


const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unit_price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    total_price: {
      type: Number,
      required: true,
      min: 0,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    address: {
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
      contact: {
        type: String, 
        required: true,
      },
    },

    razorpay_order_id: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
