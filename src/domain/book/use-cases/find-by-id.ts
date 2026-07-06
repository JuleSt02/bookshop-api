import { BookRepository } from "../repositories/BookRepository";

export interface FindBookByIdUseCaseInput {

    id: number;
}


export class FindBookByIdUseCase {

    private readonly bookRepository: BookRepository

    constructor(bookRepository: BookRepository

    ) {
    this.bookRepository = bookRepository

}
   async execute(input: FindBookUseCaseInput) {

    const bookById = await this.bookRepository.findById(input.id)

    return bookById
   }

}