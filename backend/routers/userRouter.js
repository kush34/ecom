import express from "express";
import User from "../models/userModel.js";
import { checkRefreshToken, hashPass, jwtAccess, jwtRefreshToken, verifyToken } from "../controllers/auth.js";

const router = express.Router();


router.post("/register",async (req,res)=>{
    try {
        if(!req.body.email || !req.body.password) return res.status(401).send("not enough data");
        const {email,password} = req.body;
        
        const dbUser = await User.findOne({email});
        if(dbUser) return res.status(400).send("something went wrong");

        const hashedPass = hashPass(password);
        const newUser = await User.create({
            email,
            password:hashedPass
        });
        res.status(200).send("user registered successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error");
    }
})

router.post("/login",async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password) return res.status(401).send("not enough data");
        
        const dbUser = await User.findOne({email});
       
        const accessToken = jwtAccess(dbUser._id);
        const refreshToken = jwtRefreshToken(dbUser._id); 
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "Production",      // Use only on HTTPS
            sameSite: process.env.NODE_ENV == "Production" ? 'Strict' : 'Lax'
        });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "Production",      // Use only on HTTPS
            sameSite: process.env.NODE_ENV == "Production" ? 'Strict' : 'Lax'
        });
        res.json({accessToken});
    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error");
    }
})

router.post("/refresh-token", async(req, res) => {
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
      res.status(200).json({accessToken:result?.newAcessToken}); 
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  });
  
  router.get("/userInfo",verifyToken,async (req,res)=>{
    try {
        const user= req.user;
        console.log(`API /userInfo hit :${user}`);
        const dbUser = await User.findOne({_id:user}).select("-password");
        if(!dbUser){
            res.status(401).send("something went wrong");
            return;
        }
        console.log(dbUser);
        res.send(dbUser);
    } catch (error) {
        res.send(error);
    }
  })

router.post("/updateCart",verifyToken,async(req,res)=>{
    try{
        const user = req.user;
        const {cartItems} = req.body;
        if(!cartItems || !Array.isArray(cartItems)){
            res.status(401).send("not enough data");
            return;
        }
        const dbUser = await User.findByIdAndUpdate(
            {_id:user},
            {$set:{cart:cartItems}},
            {new:true}
        );
        if(!dbUser){
            res.status(404).send("something went wrong");
            return;
        }
        res.status(200).send("Update success full");
    }catch(error){
        res.status(500).send("something went wrong internal error");
        console.log(error.message)
    }
  })
export default router;