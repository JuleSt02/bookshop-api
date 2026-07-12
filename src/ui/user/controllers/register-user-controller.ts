import { Request, Response, NextFunction } from "express";
import { PrismaUserRepository } from "../../../infrastructure/user/repositories/PrismaUserRepository";
import { RegisterUserUseCase } from "../../../domain/user/use-cases/create-user-use-case";
import { z } from "zod";
import { SecuritityServiceImplementation } from "../../../infrastructure/services/SecurityServiceImplementation";
import { BadSyntaxError } from "../../../domain/errors/BadSyntaxError";

const registerUserSchema = z.object({
  email: z.email("Invalid email."),
  password: z.string().min(8, "Password must contain at least 8 characters."),
});

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = registerUserSchema.parse(req.body);

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
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
