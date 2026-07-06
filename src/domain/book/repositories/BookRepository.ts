
import { Book } from "../Book"
import { CreateBookUseCaseInput } from "../use-cases/create-book"


export interface BookRepository {

    create : (params: CreateBookUseCaseInput) => Promise<Book>,
    findById: (params: number) => Promise<Book | null>,

}
