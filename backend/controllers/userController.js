import { checkRefreshToken, hashPass, jwtAccess, jwtRefreshToken } from "../controllers/auth.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const updateCart = async (req, res) => {
    try {
        const user = req.user;
        const { cartItems } = req.body;
        if (!cartItems || !Array.isArray(cartItems)) {
            res.status(401).send("not enough data");
            return;
        }
        const dbUser = await User.findByIdAndUpdate(
            { _id: user },
            { $set: { cart: cartItems } },
            { new: true }
        );
        if (!dbUser) {
            res.status(404).send({ error: "could not verify your account pls login again and retry." });
            return;
        }
        console.log(dbUser)
        res.status(200).send("Update success full");
    } catch (error) {
        res.status(500).send("something went wrong internal error");
        console.log(error.message)
    }
}

export const userInfo = async (req, res) => {
    try {
        const userId = req.user;

        const dbUser = await User.findById(userId)
            .select("-password")
            .populate({
                path: "cart._id",
                select: "productName price description images"
            })
            .lean();

        if (!dbUser) return res.status(404).send("User not found");

        const simplifiedCart = (dbUser.cart || []).map((item) => {
            const product = item._id; // populated Product doc
            if (!product || typeof product !== "object") return null;
            return {
                _id: product._id,
                productName: product.productName,
                description: product.description,
                price: product.price,
                images: product.images,
                quantity: item.quantity
            };
        }).filter(Boolean);
        return res.status(200).json({
            _id: dbUser._id,
            addresses: dbUser.addresses,
            email: dbUser.email,
            cart: simplifiedCart
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
}

export const addAddress = async (req, res) => {
    try {
        const userId = req.user;
        const { address } = req.body;

        if (!address || typeof address !== "object") {
            return res.status(400).json({ error: "Address data is missing or invalid" });
        }

        const { city, contact, pincode } = address;

        if (!city || typeof city !== "string" || city.trim().length < 2) {
            return res.status(400).json({ error: "City name is required and must be a valid string" });
        }

        if (!contact || typeof contact !== "string" || !/^[6-9]\d{9}$/.test(contact)) {
            return res.status(400).json({ error: "Contact must be a valid 10-digit Indian number" });
        }

        if (
            pincode === undefined ||
            (typeof pincode !== "string" && typeof pincode !== "number") ||
            !/^\d{6}$/.test(pincode.toString())
        ) {
            return res.status(400).json({ error: "Pincode must be a valid 6-digit number" });
        }

        const dbUser = await User.findByIdAndUpdate(
            userId,
            { $push: { addresses: address } },
            { new: true }
        );

        if (!dbUser) return res.status(404).json({ error: "User not found" });

        return res.status(200).json({ success: true, address });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not save address" });
    }
};


export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).send("no token found...");

        const result = await checkRefreshToken(token);
        if (!result) return res.status(401).send("could not verify your Token, pls login again");
        res.cookie('refreshToken', result?.newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "Production",      // Use only on HTTPS
            sameSite: process.env.NODE_ENV == "Production" ? 'Strict' : 'Lax'
        });
        res.cookie('accessToken', result?.newAcessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "Production",      // Use only on HTTPS
            sameSite: process.env.NODE_ENV == "Production" ? 'Strict' : 'Lax'
        });
        res.status(200).json({ accessToken: result?.newAcessToken });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(401).send("not enough data");

        const dbUser = await User.findOne({ email });

        if (!dbUser) res.status(404).send({ error: "Wrong Credentials. Pls check if you have right credentials." })

        const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).send({ error: "Wrong Credentials" });
        }

        const accessToken = jwtAccess(dbUser._id);
        const refreshToken = jwtRefreshToken(dbUser._id);
        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction, // only HTTPS in prod
            sameSite: isProduction ? "None" : "Lax",
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
        });

        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error");
    }
}

export const register = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) return res.status(401).send("not enough data");
        const { email, password } = req.body;

        const dbUser = await User.findOne({ email });
        if (dbUser) return res.status(400).send("something went wrong");

        const hashedPass = hashPass(password);
        const newUser = await User.create({
            email,
            password: hashedPass
        });
        res.status(200).send("user registered successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error");
    }
}