import { QueueService } from "../../shared/QueueService";
import { UserRepository } from "../../user/repositories/UserRepository";
import { BookRepository } from "../repositories/BookRepository";
import { Book, BookStatus } from "../Book";

export class SendLowerPriceNotificationUseCase {
  private readonly bookRepository: BookRepository;
  private readonly userRepository: UserRepository;
  private readonly queueService: QueueService;

  constructor(
    bookRepository: BookRepository,
    userRepository: UserRepository,
    queueService: QueueService,
  ) {
    this.bookRepository = bookRepository;
    this.userRepository = userRepository;
    this.queueService = queueService;
  }

  async execute(): Promise<void> {
    const currentDate = new Date();
    //copy of current Date
    const sevenDaysAgo = new Date(currentDate);
    //modify substracting 7 from current Date.
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const books = await this.bookRepository.findPublished(
      BookStatus.PUBLISHED,
      sevenDaysAgo,
    );

    for (const book of books) {
      const bookOwner = await this.userRepository.findById(book.ownerId);
      if (!bookOwner) {
        continue;
      }
      void this.queueService.sendLowerPriceNotification({
        email: bookOwner.email,
        bookTitle: book.title,
        bookPrice: book.price,
      });
    }
  }
}
