import {Request, Response, NextFunction } from "express";
import { PrismaBookRepository } from "../../../infrastructure/book/repositories/PrismaBookRepository";
import { FindBooksUseCase } from "../../../domain/book/use-cases/find-books";
import { z } from "zod";
import { PaginatedResponse } from "../../shared/PaginatedResponse";
import { Book } from "../../../domain/book/Book";


const findBooksQueryParamsSchema = z.object({

    page: z.coerce.number().positive().default(1),
    limit: z.coerce.number().positive().max(100).default(10),
    search: z.string().min(3).optional()

})


export const findBooksController = async  (req: Request, res: Response , next: NextFunction) => {
    
    

        const prismaBookRepository = new PrismaBookRepository();

        const findBooksUseCase = new FindBooksUseCase(prismaBookRepository);
    
        try {

        const {page, limit, search} = findBooksQueryParamsSchema.parse(req.query);

   
        const { books, total } = await findBooksUseCase.execute({
            pagination: {
                page,
                limit,
            },
            ...(search !== undefined && {
                search,
            }),
        });
         
        const response :PaginatedResponse<Book> = {
            data: books,
            meta: {
                limit,
                page,
                total
                

            }
        }
        
        res.status(200).json(response)

    } catch(error) {
        next(error);
    }
}