export abstract class DomainError extends Error {
  //constructor inherited from Error

  abstract readonly name: string;
}
