import { BookRepository } from "../../../domain/book/repositories/BookRepository";
import { Book, BookGenre, BookStatus } from "../../../domain/book/Book";
import { CreateBookUseCaseInput } from "../../../domain/book/use-cases/create-book";
import { prisma } from "../../prisma-client";
import { EditableBookInput } from "../../../domain/book/use-cases/edit-book";
import { MarkBookAsSoldInput } from "../../../domain/book/use-cases/buy-book";
import { Book as PrismaBook } from "@prisma/client";
import { FindManyBooksInput } from "../../../domain/book/use-cases/find-books";

export class PrismaBookRepository implements BookRepository {
  private readonly prisma = prisma;

  async findById(id: number): Promise<Book | null> {
    const book = await this.prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (!book) {
      return null;
    }
    return this.transformToDomain(book);
  }

  async findByUser(id: number): Promise<Book[]> {
    const books = await this.prisma.book.findMany({
      where: {
        ownerId: id,
      },
    });

    const domainBooks = books.map((book) => this.transformToDomain(book));
    return domainBooks;
  }

  async create(params: CreateBookUseCaseInput): Promise<Book> {
    const prismaBook = await this.prisma.book.create({
      data: {
        title: params.title,
        description: params.description,
        author: params.author,
        price: params.price,
        genre: params.genre,
        ownerId: params.ownerId,
      },
    });
    return this.transformToDomain(prismaBook);
  }

  async edit(params: EditableBookInput): Promise<Book> {
    const prismaBook = await this.prisma.book.update({
      where: {
        id: params.id,
      },

      data: {
        title: params.title,
        description: params.description,
        author: params.author,
        price: params.price,
        genre: params.genre,
      },
    });

    return this.transformToDomain(prismaBook);
  }

  async delete(params: number): Promise<void> {
    await this.prisma.book.delete({ where: { id: params } });
  }

  async markAsSold(params: MarkBookAsSoldInput): Promise<Book> {
    const prismaBook = await this.prisma.book.update({
      where: { id: params.id },
      data: { status: params.status, soldAt: params.soldAtDate },
    });

    return this.transformToDomain(prismaBook);
  }

  async findPublished(status: BookStatus, date: Date): Promise<Book[]> {
    const prismaBooks = await this.prisma.book.findMany({
      where: {
        status,
        createdAt: {
          lte: date,
        },
      },
    });
    const domainBooks = prismaBooks.map((book) => this.transformToDomain(book));
    return domainBooks;
  }

  async findMany(
    params: FindManyBooksInput,
  ): Promise<{ books: Book[]; total: number }> {
    const prismaBooks = await this.prisma.book.findMany({
      where: {
        status: params.status,
        ...(params.search && {
          OR: [
            {
              title: {
                contains: params.search,
                mode: "insensitive",
              },
            },
            {
              author: {
                contains: params.search,
                mode: "insensitive",
              },
            },
          ],
        }),
      },
      skip: (params.pagination.page - 1) * params.pagination.limit,
      take: params.pagination.limit,
    });

    const booksTotalCount = await this.prisma.book.count({
      where: {
        status: params.status,
        ...(params.search && {
          OR: [
            {
              title: {
                contains: params.search,
                mode: "insensitive",
              },
            },
            {
              author: {
                contains: params.search,
                mode: "insensitive",
              },
            },
          ],
        }),
      },
    });

    const domainBooks = prismaBooks.map((book) => this.transformToDomain(book));

    return {
      books: domainBooks,
      total: booksTotalCount,
    };
  }

  private transformToDomain(prismaBook: PrismaBook): Book {
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
    });
  }
}
