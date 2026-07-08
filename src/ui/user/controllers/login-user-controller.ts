import { Request, Response, NextFunction } from "express";
import { PrismaUserRepository } from "../../../infrastructure/user/repositories/PrismaUserRepository";
import { SecuritityServiceImplementation } from "../../../infrastructure/services/SecurityServiceImplementation";
import { LoginUserUseCase } from "../../../domain/user/use-cases/login-user-use-case";
import { BadSyntaxError } from "../../../domain/errors/BadSyntaxError";

export const loginUserController = async (
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
    const securityService = new SecuritityServiceImplementation();
    const loginUserUseCase = new LoginUserUseCase(
      prismaUserRepository,
      securityService,
    );

    const token = await loginUserUseCase.execute({ email, password });
    res.status(200).json({ accessToken: token });
    return;
  } catch (error) {
    next(error);
  }
};
