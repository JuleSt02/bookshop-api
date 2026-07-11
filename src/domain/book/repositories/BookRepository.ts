import { Book } from "../Book";
import { CreateBookUseCaseInput } from "../use-cases/create-book";
import { EditableBookInput } from "../use-cases/edit-book";
import { DeleteBookUseCaseInput } from "../use-cases/delete-book";
import { MarkBookAsSoldInput } from "../use-cases/buy-book";
import { Pagination } from "../../shared/Pagination";
import { FindBookByIdUseCaseInput } from "../use-cases/find-by-id";
import { FindManyBooksInput } from "../use-cases/find-books";
import { BooksByUserUseCaseInput } from "../use-cases/find-by-userid";

export interface BookRepository {
  create: (params: CreateBookUseCaseInput) => Promise<Book>;
  findById: (id: number) => Promise<Book | null>;
  edit: (params: EditableBookInput) => Promise<Book>;
  delete: (id: number) => Promise<void>;
  markAsSold:(params: MarkBookAsSoldInput) => Promise<Book>;
  findMany(params: FindManyBooksInput) :Promise<{books: Book[], total:number}>;
  findByUser(id:number) : Promise<Book[]|null>;

}
