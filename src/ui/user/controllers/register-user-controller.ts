import { Request, Response, NextFunction } from "express";
import { PrismaUserRepository } from "../../../infrastructure/user/repositories/PrismaUserRepository";
import { RegisterUserUseCase } from "../../../domain/user/use-cases/create-user-use-case";
import { z } from "zod";
import { SecuritityServiceImplementation } from "../../../infrastructure/services/SecurityServiceImplementation";
import { BadSyntaxError } from "../../../domain/errors/BadSyntaxError";

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      //Alternative : return next(newBadSyntaxError > continues to middleware)
      throw new BadSyntaxError("Email and password are mandatory."); //caught below > next (error) > errormiddleware > one error flow
    }

    const prismaUserRepository = new PrismaUserRepository();
    const securityServiceImplementation = new SecuritityServiceImplementation();
    const registerUserUseCase = new RegisterUserUseCase(
      prismaUserRepository,
      securityServiceImplementation,
    );

    const user = await registerUserUseCase.execute({ email, password });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
