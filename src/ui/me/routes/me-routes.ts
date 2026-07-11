
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authenticationMiddleware } from "../../user/middlewares/authentication-middleware";
import { findBooksByUserController } from "../../book/controllers/find-books-by-user-controller";

const prisma = new PrismaClient();

export const meRouter = Router();

meRouter.get("/books", [authenticationMiddleware, findBooksByUserController])
