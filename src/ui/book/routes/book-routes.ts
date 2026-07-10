import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createBookController } from "../controllers/create-book-controller";
import { editBookController } from "../controllers/edit-book-controller";
import { authenticationMiddleware } from "../../user/middlewares/authentication-middleware";
import { deleteBookController } from "../controllers/delete-book-controller";
const prisma = new PrismaClient();

export const booksRouter = Router();

booksRouter.post("/", [authenticationMiddleware, createBookController]);
booksRouter.put("/:id", [authenticationMiddleware, editBookController]);
booksRouter.delete("/:id", [authenticationMiddleware, deleteBookController]);
