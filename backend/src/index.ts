import express, { urlencoded } from "express";
import cors from "cors";
import userRouter from "./routers/userRouter"
import productRouter from "./routers/productRouter"
import paymentRouter from "./routers/paymentRouter"
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/database"; 
connectDB();
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors({
    origin:process.env.Frontend_URL,
    credentials:true
}))
app.use(cookieParser())
app.use("/user",userRouter);
app.use("/product",productRouter);
app.use("/payment",paymentRouter);
app.get("/",(req,res)=>{
    res.send("Hello from backend")
})
app.get("/getkey", (req, res) =>
  res.status(200).json({ key: process.env.key_id})
);
const port = process.env.PORT || 3000;


app.listen(port,()=>{
    console.log(`server running on ${port}`)
})