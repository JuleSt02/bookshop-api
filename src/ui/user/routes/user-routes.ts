import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { registerUserController } from "../controllers/register-user-controller";
import { loginUserController } from "../controllers/login-user-controller";

const prisma = new PrismaClient();

export const userRouter = Router();

userRouter.post("signup", registerUserController);

userRouter.post("signin", loginUserController);
