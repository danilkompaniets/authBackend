import { Router } from "express";
import { Controller } from "../controllers/rootController";
import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const controller = new Controller();
export const rootRuter = Router();

rootRuter.post("/sign-in", controller.login);
rootRuter.post("/sign-up", controller.register);
rootRuter.get("/users", [roleMiddleware(["ADMIN"])], controller.getUsers);
