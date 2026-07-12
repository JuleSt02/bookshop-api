import { BookRepository } from "../repositories/BookRepository";
import { Book } from "../Book";
import { ForbiddenOperationError } from "../../errors/ForbiddenOperationError";
import { EntityNotFoundError } from "../../errors/EntityNotFoundError";
import { BookGenre } from "../Book";
import { BadSyntaxError } from "../../errors/BadSyntaxError";
import { genreValidator } from "../utils/genre-validator";

export interface EditableBookInput {
  id: number;
  title: string;
  description: string;
  author: string;
  price: number;
  genre: BookGenre;
}

interface EditBookUseCaseInput {
  authenticatedUserId: number | undefined;
  book: EditableBookInput;
}

export class EditBookUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(input: EditBookUseCaseInput): Promise<Book> {
    if (
      !input.book.title ||
      !input.book.description ||
      !input.book.author ||
      !input.book.price ||
      !input.book.genre
    ) {
      throw new BadSyntaxError("All fields are required");
    }

    if (input.book.price <= 0) {
      throw new BadSyntaxError("Price must be greater than 0");
    }

    const isValidGenre = genreValidator(input.book.genre);

    if (!isValidGenre) {
      throw new BadSyntaxError(
        "Genre has to be one of: Fantasy, Biography, Science Fiction, History or Novel",
      );
    }

    const existingBook = await this.bookRepository.findById(input.book.id);

    if (!existingBook) {
      throw new EntityNotFoundError(input.book.title, input.book.id);
    }

    //trusted source token user Id and owner id received from database
    if (input.authenticatedUserId !== existingBook.ownerId)
      throw new ForbiddenOperationError(
        "You are not allowed to edit this book",
      );

    const updatedBook = await this.bookRepository.edit(input.book);

    return updatedBook;
  }
}
