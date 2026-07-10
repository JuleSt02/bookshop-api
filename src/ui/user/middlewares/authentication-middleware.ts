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
    throw new UnauthorizedError("Authentication required");
  }

  const sanitzedToken = token.replace("Bearer ", "");

  const securityService = new SecuritityServiceImplementation();

  const decodedPayload = securityService.verifyToken(sanitzedToken);

  if (!decodedPayload) {
    throw new UnauthorizedError("Authentication required.");
  } else {
    req.userId = decodedPayload?.userId;
    next();
  }
};
