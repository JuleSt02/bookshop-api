import { Request, Response, NextFunction } from "express";
import { BookGenre } from "../../../domain/book/Book";
import { z } from "zod";
import { BadSyntaxError } from "../../../domain/errors/BadSyntaxError";
import { PrismaBookRepository } from "../../../infrastructure/book/repositories/PrismaBookRepository";
import { SecuritityServiceImplementation } from "../../../infrastructure/services/SecurityServiceImplementation";
import { EditBookUseCase } from "../../../domain/book/use-cases/edit-book";

const editBookValidationSchema = z.object({
  //url sends  string:
  id: z.coerce.number(),
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

export const editBookController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //id is in req.params.id , rest travels in req.body
    const { id, title, description, author, price, genre } =
      editBookValidationSchema.parse({ id: req.params.id, ...req.body });
    const authenticatedUserId = req.userId;

    const prismaBookRepository = new PrismaBookRepository();
    const editBookUseCase = new EditBookUseCase(prismaBookRepository);

    const updatedBook = await editBookUseCase.execute({
      authenticatedUserId,
      book: {
        id,
        title,
        description,
        author,
        price,
        genre,
      },
    });

    res.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
};
