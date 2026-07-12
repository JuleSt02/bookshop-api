import { Router } from "express";
import { authenticationMiddleware } from "../../user/middlewares/authentication-middleware";
import { findBooksByUserController } from "../../book/controllers/find-books-by-user-controller";

export const meRouter = Router();

meRouter.get("/books", [authenticationMiddleware, findBooksByUserController]);
