import { Request, Response } from "express";
import { prismaClient } from "../server";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { secret } from "../configs/jwtConfig";

const generateAccessToken = (id: number, role: string) => {
  const payload = {
    id,
    role,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class Controller {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await prismaClient.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
        return res.status(400).json ({ message: "Incorrect password" });
      }
      const token = generateAccessToken(user.id, user.role);
      return res.json({ token });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Login Error" });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const candidate = await prismaClient.user.findUnique({
        where: {
          email: email,
          password: password,
        },
      });

      if (candidate) {
        return res.status(400).json({ message: "User alredy exists" });
      }

      const hashedPassword = bcrypt.hashSync(password, 7);
      const user = {
        email: email,
        password: hashedPassword,
      };

      await prismaClient.user.create({ data: user });
      res.json({ userData: user });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Registration Error" });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await prismaClient.user.findMany();
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error" });
    }
  }
}

export { Controller };
