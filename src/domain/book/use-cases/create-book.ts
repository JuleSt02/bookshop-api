import { BookGenre, Book } from "../Book";
import { BookRepository } from "../repositories/BookRepository";
import { BadSyntaxError } from "../../errors/BadSyntaxError";
import { genreValidator } from "../utils/genre-validator";
export interface CreateBookUseCaseInput {
  title: string;
  description: string;
  author: string;
  price: number;
  genre: BookGenre;
  ownerId: number;
}

export class CreateBookUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(input: CreateBookUseCaseInput): Promise<Book> {
    if (
      !input.title ||
      !input.description ||
      !input.author ||
      !input.price ||
      !input.genre
    ) {
      throw new BadSyntaxError("All fields are required");
    }

    if (input.price <= 0) {
      throw new BadSyntaxError("Price must be greater than 0");
    }

    const isValidGenre = genreValidator(input.genre);
    if (!isValidGenre) {
      throw new BadSyntaxError(
        "Genre has to be one of: Fantasy, Biography, Science Fiction, History or Novel",
      );
    }

    const book = await this.bookRepository.create(input);

    return book;
  }
}
