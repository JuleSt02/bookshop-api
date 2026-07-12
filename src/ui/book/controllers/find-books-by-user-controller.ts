import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { PrismaBookRepository } from "../../../infrastructure/book/repositories/PrismaBookRepository";
import { FindBooksByUserUseCase } from "../../../domain/book/use-cases/find-books-by-userId";
import { PrismaUserRepository } from "../../../infrastructure/user/repositories/PrismaUserRepository";

const findBooksByUserValidationSchema = z.object({
  userId: z.coerce.number(),
});

export const findBooksByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const prismaBookRepository = new PrismaBookRepository();
  const userRepository = new PrismaUserRepository();
  const findBooksByUserUseCase = new FindBooksByUserUseCase(
    prismaBookRepository,
    userRepository,
  );

  try {
    const id = findBooksByUserValidationSchema.parse({ userId: req.userId });

    const books = await findBooksByUserUseCase.execute(id);

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};
