import { Request, Response, NextFunction } from "express"
import { BookGenre, BookStatus } from "../../../domain/book/Book";


import {z} from 'zod';
import { PrismaBookRepository } from "../../../infrastructure/book/repositories/PrismaBookRepository";
import { FindBookByIdUseCase } from "../../../domain/book/use-cases/find-by-id";


export const findBooByIdController = async (req: Request, res:Response, next: NextFunction) => {


    const findBookValidationSchema = z.object({
        id: z.number()

    })

    try {
        
        const {id} = findBookValidationSchema.parse({id: Number(req.params.id)})

        const prismaBookRepository = new PrismaBookRepository();
        
        const  findBookByIdUseCase = new FindBookByIdUseCase(prismaBookRepository);

        const bookById = await findBookByIdUseCase.execute({id})
        res.status(200).json(bookById);
    } catch(error) {
        next(error)
    }
}