import jwt from "jsonwebtoken";
import brypt from "bcrypt";
import "dotenv/config";
import User from "../models/userModel.js";
import { NextFunction, Request, Response } from "express";
import { error } from "node:console";

export const jwtAccess = (userId: string, role: string): string => {
  const accessKey = process.env.Access_Secret
  if (!accessKey) {
    throw new error("Refresh_Secret missing")
  }
  return jwt.sign({ userId, role }, accessKey, { expiresIn: '15m' });
}
export const jwtRefreshToken = (userId: string, role: string): string => {
  const refreshKey = process.env.Refresh_Secret
  if (!refreshKey) {
    throw new error("Refresh_Secret missing")
  }
  return jwt.sign({ userId, role }, refreshKey, { expiresIn: '7d' });
}

export const hashPass = (pass: string) => {
  try {
    return brypt.hashSync(pass, 12);
  } catch (error) {
    console.log(`hashPass in auth.js went wrong ${error}`);
    return error;
  }
}

export const checkRefreshToken = async (token) => {
  try {
    const refreshKey = process.env.Refresh_Secret
    if (!refreshKey) {
      throw new error("Refresh_Secret missing")
    }
    const result = jwt.verify(token, refreshKey);
    if (!result) {
      return false;
    }
    //checking if user exists in the db
    const dbUser = await User.findById({ _id: result?.userId });


    if (dbUser) {
      //returning new Refresh and Access Token.
      const newRefreshToken = jwtRefreshToken(result?.userId, dbUser.role);
      const newAcessToken = jwtAccess(result?.userId, dbUser.role);
      return { newAcessToken, newRefreshToken };
    } else {
      return false;
    }
  } catch (error) {
    console.log(`Could not verify Refresh Token : ${error}`);
    return false;
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  console.log("Cookies in Request:", req.cookies);

  // read from cookie or Authorization header
  const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(403).send("No auth token found");
  }
  const accessKey = process.env.Access_Secret
  if (!accessKey) {
    throw new error("Refresh_Secret missing")
  }
  try {
    const decoded = jwt.verify(accessToken, accessKey);
    req.user = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);

    if ((error as Error).name === "TokenExpiredError") {
      return res.status(403).send("Access token expired");
    }
    return res.status(401).send("Invalid access token");
  }
};