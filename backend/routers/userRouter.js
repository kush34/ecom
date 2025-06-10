import express from "express";
import User from "../models/userModel.js";
import { checkRefreshToken, hashPass, jwtAccess, jwtRefreshToken } from "../controllers/auth.js";

const router = express.Router();


router.post("/register",async (req,res)=>{
    try {
        if(!req.body.email || !req.body.password) return res.status(401).send("not enough data");
        const {email,password} = req.body;
        
        const dbUser = await User.findOne({email});
        if(dbUser) res.status(400).send("something went wrong");

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
            secure: true,      // Use only on HTTPS
            sameSite: 'Strict' // or 'Lax'
        });
        res.json({accessToken});
    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error");
    }
})

router.post("/refresh-token", (req, res) => {
    try {
      const token = req.cookies.refreshToken;
      if (!token) return res.sendStatus(401);
      
      const result = checkRefreshToken(token);
      if (!result) return res.sendStatus(403);
      
      res.status(200).json(result); 
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });
  
export default router;