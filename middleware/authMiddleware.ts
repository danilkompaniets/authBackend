import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { secret } from "../configs/jwtConfig";

const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "Access denied" });
    }

    const decodedData = jwt.verify(token, secret);
    if (decodedData) {
      req.user = decodedData;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default authMiddleware;
