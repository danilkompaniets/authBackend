import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { rootRuter } from "./routes/rootRouter";

const app = express();

app.use(express.json());
app.use(rootRuter);

export const prismaClient = new PrismaClient();

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "server is working",
  });
});

app.listen(8081, () => {
  console.log("server is working");
});
