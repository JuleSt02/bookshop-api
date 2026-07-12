import { Pagination } from "../../shared/Pagination";
import { Book } from "../Book";
import { BookRepository } from "../repositories/BookRepository";
import { BookStatus } from "../Book";

export interface FindManyBooksInput {
  pagination: Pagination;
  status: BookStatus;
  search?: string;
}
type FindBooksUseCaseInput = {
  pagination: Pagination;
  search?: string;
};
export class FindBooksUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(
    input: FindBooksUseCaseInput,
  ): Promise<{ books: Book[]; total: number }> {
    const { books, total } = await this.bookRepository.findMany({
      ...input,
      status: BookStatus.PUBLISHED,
    });

    return { books, total };
  }
}
