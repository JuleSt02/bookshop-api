
import { BookRepository } from "../repositories/BookRepository";
import { Book } from "../Book";

export interface BooksByUserUseCaseInput {

    userId : number,
}

export class FindBooksByUserUseCase {

    readonly bookRepository: BookRepository;

    constructor(bookRepository: BookRepository) {

        this.bookRepository = bookRepository;
    }

    async execute(input : BooksByUserUseCaseInput ): Promise<Book[]|null>  {

        const booksByUserId = await this.bookRepository.findByUser(input.userId)
        return booksByUserId;

    }
        
}