import { EntityNotFoundError } from "../../errors/EntityNotFoundError";
import { BookRepository } from "../repositories/BookRepository";
import { ForbiddenOperationError } from "../../errors/ForbiddenOperationError";
import { BookStatus } from "../Book";



interface BuyBookUseCaseInput {

    id : number;
    authenticatedUserId: number | undefined
}

export interface MarkBookAsSoldInput {

    id:number;
    status: BookStatus;
    soldAtDate: Date
}

export class BuyBookUseCase {

    private readonly bookRepository: BookRepository

    constructor(bookRepository: BookRepository) {

        this.bookRepository = bookRepository
    }

    async execute(input: BuyBookUseCaseInput) {

        const existingBook = await this.bookRepository.findById(input.id)

        if(!existingBook) {
            throw new EntityNotFoundError('Book', input.id)
        }

        if(existingBook.status !== BookStatus.PUBLISHED) {
            throw new ForbiddenOperationError('Only published books can be purchased')
        }
        if(existingBook.ownerId === input.authenticatedUserId) {
            throw new ForbiddenOperationError('Users cannot buy their own items')
        }

        const soldAtDate = new Date();
        const status = BookStatus.SOLD

        const soldBook = await this.bookRepository.markAsSold({id : existingBook.id, status, soldAtDate})

        return soldBook;
    }


}