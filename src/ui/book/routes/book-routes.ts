import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createBookController } from "../controllers/create-book-controller";
import { editBookController } from "../controllers/edit-book-controller";
import { authenticationMiddleware } from "../../user/middlewares/authentication-middleware";
import { deleteBookController } from "../controllers/delete-book-controller";
import { buyBookController } from "../controllers/buy-book-controller";
import { findBooksController } from "../controllers/find-books-controller.";


const prisma = new PrismaClient();

export const booksRouter = Router();


booksRouter.get("/", findBooksController)

booksRouter.post("/", [authenticationMiddleware, createBookController]);
booksRouter.put("/:id" , [authenticationMiddleware, editBookController]);
booksRouter.put("/:id/buy", [authenticationMiddleware, buyBookController]);

booksRouter.delete("/:id", [authenticationMiddleware, deleteBookController]);

