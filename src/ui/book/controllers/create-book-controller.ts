import { Request, Response, NextFunction } from "express";
import { BookGenre, BookStatus } from "../../../domain/book/Book";

import { z } from "zod";
import { PrismaBookRepository } from "../../../infrastructure/book/repositories/PrismaBookRepository";
import { CreateBookUseCase } from "../../../domain/book/use-cases/create-book";

const createBookValidationSchema = z.object({
  title: z.string().min(4, "Min length for title is 4 characters"),
  description: z
    .string()
    .min(25, "Min length for description is 25 characters"),
  author: z.string().min(8, "Min length for author is 8 characters"),
  price: z.number().positive("Price can't be negative"),

  genre: z
    .string()

    .transform((value) => {
      const normalized = value.toUpperCase();
      if (normalized === "SCI-FI") return "SCIFI";
      if (normalized === "SCIENCE FICTION") return "SCIFI";
      if (normalized === "SCI FI") return "SCIFI";

      return normalized;
    })

    .pipe(
      z.enum(BookGenre, {
        error:
          "Genre has to be one of: Fantasy, Biography, Science Fiction, History or Novel",
      }),
    ),
});

export const createBookController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, author, price, genre } =
      createBookValidationSchema.parse(req.body);

    const prismaBookRepository = new PrismaBookRepository();

    const createBookUseCase = new CreateBookUseCase(prismaBookRepository);

    const newBook = await createBookUseCase.execute({
      title,
      description,
      author,
      price,
      genre,
      ownerId: 1,
    });

    res.status(201).json(newBook);
  } catch (error) {
    next(error);
  }
};
