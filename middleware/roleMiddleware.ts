import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { secret } from "../configs/jwtConfig";

interface JwtPayload {
  role: string;
  // Add other properties if needed
}

export const roleMiddleware = (roles: string[]) => {
  return function (req: any, res: Response, next: NextFunction) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(400).json({ message: "Access denied" });
      }

      const { role } = jwt.verify(token, secret) as JwtPayload;

      let hasRole = role === "ADMIN";

      if (!hasRole) {
        res.json({ message: "Access Denied" });
      }
      if (!hasRole) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    } catch (error) {
      console.log(error);
    }
  };
};

export default roleMiddleware;
