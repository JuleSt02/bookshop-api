import { BookRepository } from '../../../domain/book/repositories/BookRepository';
import { Book, BookGenre, BookStatus } from '../../../domain/book/Book';
import { CreateBookUseCaseInput } from '../../../domain/book/use-cases/create-book';
import {prisma} from '../../prisma-client';


export class PrismaBookRepository implements BookRepository {

    private readonly prisma = prisma;

    async findById(id:number): Promise<Book | null> {

        const book = await this.prisma.book.findUnique({
            where: {
                id,
            }
        });

        return book
    }

    async create(params: CreateBookUseCaseInput) : Promise<Book> {
        
        const prismaBook = await this.prisma.book.create({
            data: {
                title: params.title,
                description: params.description,
                author: params.author,
                price: params.price,
                genre: params.genre,
                ownerId: params.ownerId
                
            },
        });

        return new Book({
            id: prismaBook.id,
            createdAt: prismaBook.createdAt,
            updatedAt: prismaBook.updatedAt,
            title: prismaBook.title,
            description: prismaBook.description,
            author: prismaBook.author,
            price: prismaBook.price,
            genre: prismaBook.genre as BookGenre,
            status: prismaBook.status as BookStatus,
            ownerId: prismaBook.ownerId, 
            soldAt: prismaBook.soldAt,

        })
    }
}