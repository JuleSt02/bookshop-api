import { QueueService } from "../../domain/shared/QueueService";
import { Queue } from "bullmq";
import {environmentService} from '../EnvironmentService'


export class BullQueuService implements QueueService {
    
    private readonly purchaseConfirmationEmailQueue : Queue;
    private readonly lowerPriceEmailQueue: Queue;

    constructor() {
        const {REDIS_URL} = environmentService.get();
        const redisUrl = new URL(REDIS_URL);
        const connection = {
            connection: {
                host: redisUrl.hostname,
                port: Number(redisUrl.port)
            },
        };

        this.purchaseConfirmationEmailQueue = new Queue('seller-purchase-confirmation', connection)
        this.lowerPriceEmailQueue = new Queue('lower-price-email-queu', connection)
    }

    async sendPurchaseConfirmationEmail(params:{email:string, bookTitle:string, bookPrice: number}):Promise<void> {
         
        //awaits until Bull adds the job to Redis.
        await this.purchaseConfirmationEmailQueue.add('seller-purchase-confirmation-job', params)
    }

    async sendLowerPriceNotification(params: { email: string; bookTitle: string; bookPrice: number; }): Promise<void> {
        
        await this.lowerPriceEmailQueue.add('lower-price-email-job', params)
    }

}