import { Request, Response, NextFunction } from "express";
import { PrismaBookRepository } from "../../../infrastructure/book/repositories/PrismaBookRepository";
import { DeleteBookUseCase } from "../../../domain/book/use-cases/delete-book";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";
import { z } from "zod";

const deleteBookValidationSchema = z.object({
  //url sends  string:
  bookId: z.coerce.number(),
});

export const deleteBookController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { bookId } = deleteBookValidationSchema.parse(req.params);
    const authenticatedUserId = req.userId;

    const prismaBookRepository = new PrismaBookRepository();
    const deleteBookUseCase = new DeleteBookUseCase(prismaBookRepository);

    await deleteBookUseCase.execute({ bookId, authenticatedUserId });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
