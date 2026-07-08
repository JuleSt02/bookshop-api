import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";
import { SecuritityServiceImplementation } from "../../../infrastructure/services/SecurityServiceImplementation";

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new UnauthorizedError("User is not authorized");
  }

  const sanitzedToken = token.replace("Bearer ", "");

  const securityService = new SecuritityServiceImplementation();
};
