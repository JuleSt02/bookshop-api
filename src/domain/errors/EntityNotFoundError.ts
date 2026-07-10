import { DomainError } from "./DomainError";

export class EntityNotFoundError extends DomainError {
  readonly name = "EntityNotFoundError";

  constructor(entity: string, id: number) {
    super(`Entity ${entity} not found with id ${id}`);
  }
}
