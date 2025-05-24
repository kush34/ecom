import express, { urlencoded } from "express";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/database.js"; 
connectDB();
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors({
    origin:process.env.Frontend_URL,
    Credential:true
}))
app.use("/user",userRouter);
app.use("/product",productRouter);
app.get("/",(req,res)=>{
    res.send("Hello from backend")
})
const port = process.env.PORT || 3000;


app.listen(port,()=>{
    console.log(`server running on ${port}`)
})