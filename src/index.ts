import { app } from "./api";
import { environmentService } from "./infrastructure/EnvironmentService";
import { NodemailerEmailService } from "./infrastructure/shared/NodemailerEmailService";
import cron from 'node-cron';
import { cronLowerPriceNotification } from "./ui/shared/cron-scheduling/cron-lower-price-notifications";

import {Job, Worker} from 'bullmq'

environmentService.load();

const { PORT, NODE_ENV, REDIS_URL } = environmentService.get();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


//CRON JOB 
cron.schedule("0 9 * * 1", cronLowerPriceNotification);


const redisUrl = new URL(REDIS_URL);
const workerConnection  = {
  connection: {
    host: redisUrl.hostname,
    port: Number(redisUrl.port),
  },
};


//SELLER CONFIRMATION WORKER
new Worker(
  'seller-purchase-confirmation',
  async (job: Job<{ email: string; bookTitle: string, bookPrice: number }>) => {

    const emailService = new NodemailerEmailService();

    try {
      await emailService.send({
        email: job.data.email,
        message: `Your book ${job.data.bookTitle} was sold for (€${job.data.bookPrice})  `,
        subject:'Book sold'
      }) ;

      } catch(error) {
        console.log(error)
    }
  },
  workerConnection

)


//LOWER PRICE NOTIFICATION WORKER

new Worker(
  'lower-price-email-queu',
  async (job: Job<{email:string; bookTitle:string, bookPrice: number}>) => {

    const emailService = new NodemailerEmailService();

    try {
      await emailService.send({
        email: job.data.email,
        message: ` Your book ${job.data.bookTitle} for (€${job.data.bookPrice}) has been published for more than 7 days without being sold. Consider lowering its price `,
        subject:`Lower price`
      })
    } catch(error) {
      console.log(error)
    }
  },
  workerConnection

)