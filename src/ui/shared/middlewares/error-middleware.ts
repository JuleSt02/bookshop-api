import { EntityNotFoundError } from "../../../domain/errors/EntityNotFoundError";
import { BusinessConflictError } from "../../../domain/errors/BusinessConflictError";
import { BadSyntaxError } from "../../../domain/errors/BadSyntaxError";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";
import { ForbiddenOperationError } from "../../../domain/errors/ForbiddenOperationError";
import { Response, Request, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandlerMiddleWare = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //express identifies error middleware by its 4 parameters even if unused.
  //thrown by use-case > caught in controller > controller calls next(error)>  middleware translates

  if (error instanceof EntityNotFoundError) {
    return res.status(404).json({ error: error.message });
  }

  if (error instanceof BusinessConflictError) {
    return res.status(409).json({ error: error.message });
  }

  if (error instanceof BadSyntaxError) {
    return res.status(400).json({ error: error.message });
  }

  if (error instanceof UnauthorizedError) {
    return res.status(401).json({ error: error.message });
  }

  if (error instanceof ForbiddenOperationError) {
    return res.status(403).json({ error: error.message });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({ error: error.issues[0]?.message });
  }

  res.status(500).json({ error: JSON.stringify(error) });
};
