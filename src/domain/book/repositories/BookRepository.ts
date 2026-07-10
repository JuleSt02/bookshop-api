import { Book } from "../Book";
import { CreateBookUseCaseInput } from "../use-cases/create-book";
import { EditableBookInput } from "../use-cases/edit-book";
import { DeleteBookUseCaseInput } from "../use-cases/delete-book";
export interface BookRepository {
  create: (params: CreateBookUseCaseInput) => Promise<Book>;
  findById: (params: number) => Promise<Book | null>;
  edit: (params: EditableBookInput) => Promise<Book>;
  delete: (params: number) => Promise<void>;
}
