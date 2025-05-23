import jwt from "jsonwebtoken";
import brypt from "bcrypt";
import "dotenv/config";

export const jwtAccess = (userId)=>{
    return jwt.sign({userId},process.env.Acess_Secret,{expiresIn:'15m'});
}
export const jwtRefreshToken = (userId)=>{
    return jwt.sign({userId},process.env.Refresh_Secret,{expiresIn:'7d'});
}

export const hashPass =  (pass)=>{
    try {
        return brypt.hashSync(pass,12);
        
    } catch (error) {
        console.log(`hashPass in auth.js went wrong ${error}`);
    }
}

export const checkRefreshToken = async(token)=>{  
    jwt.verify(token, process.env.Refresh_Secret, (err, user) => {
      if (err) return false;
  
      const newAccessToken = jwt.sign({ userId: user.userId }, ACCESS_SECRET, { expiresIn: '15m' });
      return ({ accessToken: newAccessToken });
    });
}