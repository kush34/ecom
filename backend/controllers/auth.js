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

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader) res.status(403).send("wrong");
  const accessToken = authHeader.split(" ")[1];

    // console.log(accessToken)
  try {
    const decoded = jwt.verify(accessToken, process.env.Acess_Secret);
    // console.log(`Middleware token result: ${decoded.userId}`)
    req.user = decoded.userId;
    next(); 
  } catch (error) {
    console.log(error)
    if (error.name === "TokenExpiredError") {
      return res.status(403).send("Access token expired"); 
    }
    return res.status(401).send("Invalid access token");
  }
};
