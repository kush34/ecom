import jwt from "jsonwebtoken";
import brypt from "bcrypt";
import "dotenv/config";
import User from "../models/userModel.js";

export const jwtAccess = (userId) => {
  return jwt.sign({ userId }, process.env.Access_Secret, { expiresIn: '15m' });
}
export const jwtRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.Refresh_Secret, { expiresIn: '7d' });
}

export const hashPass = (pass) => {
  try {
    return brypt.hashSync(pass, 12);

  } catch (error) {
    console.log(`hashPass in auth.js went wrong ${error}`);
  }
}

export const checkRefreshToken = async (token) => {
  try {
    const result = jwt.verify(token, process.env.Refresh_Secret);
    if (!result) {
      return false;
    }
    //checking if user exists in the db
    const dbUser = await User.findById({ _id: result?.userId });


    if (dbUser) {
      //returning new Refresh and Access Token.
      const newRefreshToken = jwtRefreshToken(result?.userId);
      const newAcessToken = jwtAccess(result?.userId);
      return { newAcessToken, newRefreshToken };
    } else {
      return false;
    }
  } catch (error) {
    return false;
    console.log(`Could not verify Refresh Token : ${error.message}`);
  }
}

export const verifyToken = (req, res, next) => {
  console.log("Cookies in Request:", req.cookies);

  // read from cookie or Authorization header
  const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(403).send("No auth token found");
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.Access_Secret);
    req.user = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(403).send("Access token expired");
    }
    return res.status(401).send("Invalid access token");
  }
};