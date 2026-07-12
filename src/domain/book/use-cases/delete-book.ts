import { BookRepository } from "../repositories/BookRepository";
import { EntityNotFoundError } from "../../errors/EntityNotFoundError";
import { ForbiddenOperationError } from "../../errors/ForbiddenOperationError";

export interface DeleteBookUseCaseInput {
  bookId: number;
  authenticatedUserId: number | undefined;
}

export class DeleteBookUseCase {
  readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(input: DeleteBookUseCaseInput) {
    const existingBook = await this.bookRepository.findById(input.bookId);

    if (!existingBook) {
      throw new EntityNotFoundError("Book", input.bookId);
    }

    if (input.authenticatedUserId !== existingBook.ownerId) {
      throw new ForbiddenOperationError(
        "You are not allowed to delete this book.",
      );
    }

    if (existingBook.soldAt !== null) {
      throw new ForbiddenOperationError("Sold books cannot be deleted.");
    }

    await this.bookRepository.delete(existingBook.id);
  }
}
