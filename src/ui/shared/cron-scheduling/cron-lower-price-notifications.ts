import { SendLowerPriceNotificationUseCase } from "../../../domain/book/use-cases/find-books-for-notification";
import { PrismaBookRepository } from "../../../infrastructure/book/repositories/PrismaBookRepository"
import { BullQueuService } from "../../../infrastructure/shared/BullQueuService";
import { PrismaUserRepository } from "../../../infrastructure/user/repositories/PrismaUserRepository";



export const  cronLowerPriceNotification =  async () => {

    const prismaBookRepository = new PrismaBookRepository();
    const prismaUserRepository = new PrismaUserRepository();
    const bullQueueService = new BullQueuService();

    const sendLowerPriceNotificationUseCase = new SendLowerPriceNotificationUseCase(prismaBookRepository, prismaUserRepository, bullQueueService)
    try {

     await sendLowerPriceNotificationUseCase.execute();

    } catch(error) {
        console.log(error)
    }
    
    

}