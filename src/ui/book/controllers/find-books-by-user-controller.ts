import { Request, Response, NextFunction } from "express"
import { z } from "zod";
import { PrismaBookRepository } from "../../../infrastructure/book/repositories/PrismaBookRepository";
import { Prisma } from "@prisma/client/extension";
import { FindBooksByUserUseCase } from "../../../domain/book/use-cases/find-by-userid";

const findBooksByUserValidationSchema = z.object({
    userId: z.coerce.number(),
})


export const findBooksByUserController =  (req:Request, res:Response, next: NextFunction) => {
     

    const prismaBookRepository = new PrismaBookRepository();
    const findBooksByUserUseCase = new FindBooksByUserUseCase(prismaBookRepository)

    try {
        
        const id = findBooksByUserValidationSchema.parse(req.userId)
        
        const books = findBooksByUserUseCase.execute(id)

        res.status(200).json(books);
        
    } catch(error) {
        next(error)
    }
}  
