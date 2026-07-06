import {Router, Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import { createBookController } from '../controllers/create-book-controller';





const prisma = new PrismaClient();


export const booksRouter = Router();

booksRouter.post('/' , createBookController);

booksRouter.get('/', getBooksController);


