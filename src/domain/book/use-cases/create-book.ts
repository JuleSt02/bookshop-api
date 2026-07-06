import { BookGenre, BookStatus,Book } from "../Book";
import { BookRepository } from "../repositories/BookRepository";
 export interface CreateBookUseCaseInput {

    title: string;
    description: string;
    author:string;
    price: number;
    genre: BookGenre;
    ownerId: number;
}

export class  CreateBookUseCase  {

    private readonly bookRepository : BookRepository

    constructor(
        bookRepository: BookRepository
    ) {
        this.bookRepository = bookRepository
    }
    
    async execute(input: CreateBookUseCaseInput) : Promise<Book> {

        const book = await this.bookRepository.create(input)

        return book 

    }
}