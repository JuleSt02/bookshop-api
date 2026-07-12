import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { PrismaBookRepository } from "../../../infrastructure/book/repositories/PrismaBookRepository";
import { BuyBookUseCase } from "../../../domain/book/use-cases/buy-book";
import { PrismaUserRepository } from "../../../infrastructure/user/repositories/PrismaUserRepository";
import { BullQueuService } from "../../../infrastructure/shared/BullQueuService";

const buyBookValidationSchema = z.object({
  //url sends  string:
  id: z.coerce.number(),
});

export const buyBookController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const prismaBookRepository = new PrismaBookRepository();
  const queueService = new BullQueuService();
  const prismaUserRepository = new PrismaUserRepository();
  const buyBookUseCase = new BuyBookUseCase(
    prismaBookRepository,
    queueService,
    prismaUserRepository,
  );

  try {
    const { id } = buyBookValidationSchema.parse(req.params);
    const authenticatedUserId = req.userId;
    const soldBook = await buyBookUseCase.execute({ id, authenticatedUserId });
    res.status(200).json(soldBook);
  } catch (error) {
    next(error);
  }
};
