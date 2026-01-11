import mongoose from "mongoose";

const USER_ROLES = ["user", "admin"]

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: USER_ROLES,
        default: "user",
        required: true
    },
    password: {
        type: String,
        required: true
    },
    addresses: [{
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
        address: {
            type: String,
            required: true,
        }
    }],
    cart: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            }
        }
    ]
})

const User = mongoose.model('User', userSchema);

export default User;