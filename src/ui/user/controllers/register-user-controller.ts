import { Request, Response, NextFunction } from "express";
import { PrismaUserRepository } from "../../../infrastructure/user/repositories/PrismaUserRepository";
import { RegisterUserUseCase } from "../../../domain/user/use-cases/create-user-use-case";
import { z } from "zod";
import { SecuritityServiceImplementation } from "../../../infrastructure/services/SecurityServiceImplementation";

const creatUserValidatioNSchema = z.object({});

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  try {
    const prismaUserRepository = new PrismaUserRepository();
    const securityServiceImplementation = new SecuritityServiceImplementation();
    const registerUserUseCase = new RegisterUserUseCase(
      prismaUserRepository,
      securityServiceImplementation,
    );

    const user = await registerUserUseCase.execute({ email, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
