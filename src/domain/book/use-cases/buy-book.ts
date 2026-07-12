import { EntityNotFoundError } from "../../errors/EntityNotFoundError";
import { BookRepository } from "../repositories/BookRepository";
import { ForbiddenOperationError } from "../../errors/ForbiddenOperationError";
import { BookStatus } from "../Book";
import { QueueService } from "../../shared/QueueService";
import { UserRepository } from "../../user/repositories/UserRepository";

interface BuyBookUseCaseInput {
  id: number;
  authenticatedUserId: number | undefined;
}

export interface MarkBookAsSoldInput {
  id: number;
  status: BookStatus;
  soldAtDate: Date;
}

export class BuyBookUseCase {
  private readonly bookRepository: BookRepository;
  private readonly queueService: QueueService;
  private readonly userRepository: UserRepository;

  constructor(
    bookRepository: BookRepository,
    queueService: QueueService,
    userRepository: UserRepository,
  ) {
    this.bookRepository = bookRepository;
    this.queueService = queueService;
    this.userRepository = userRepository;
  }

  async execute(input: BuyBookUseCaseInput) {
    const existingBook = await this.bookRepository.findById(input.id);

    if (!existingBook) {
      throw new EntityNotFoundError("Book", input.id);
    }

    if (existingBook.status !== BookStatus.PUBLISHED) {
      throw new ForbiddenOperationError(
        "Only published books can be purchased",
      );
    }
    if (existingBook.ownerId === input.authenticatedUserId) {
      throw new ForbiddenOperationError("Users cannot buy their own items");
    }

    const soldAtDate = new Date();
    const status = BookStatus.SOLD;

    const soldBook = await this.bookRepository.markAsSold({
      id: existingBook.id,
      status,
      soldAtDate,
    });

    const seller = await this.userRepository.findById(soldBook.ownerId);

    //guarantees TS seller is !null other option seller!.email
    if (!seller) {
      throw new EntityNotFoundError("User", soldBook.ownerId);
    }

    //secondary service,not core to our business > no await the flow continues
    // issue: if adding job fails > error won´t be caught & handled by errormiddleware
    void this.queueService.sendPurchaseConfirmationEmail({
      email: seller.email,
      bookTitle: soldBook.title,
      bookPrice: soldBook.price,
    });

    return soldBook;
  }
}
