
import { DomainError} from "./DomainError";


export class UnauthorizedError extends DomainError {

    readonly name = 'UnauthorizedError';

    constructor() {
        super(`User isn´t authorized`)
    }
}
