import { EmailService } from "../../domain/shared/EmailService";
import nodemailer from 'nodemailer'
import { environmentService } from "../EnvironmentService";


export class NodemailerEmailService implements EmailService {
    
    //transporter > configured nodemailer object that knows how and where to send emails
    private readonly transporter: nodemailer.Transporter;

    constructor() {
        const {MAILDEV_HOST, MAILDEV_PORT} = environmentService.get();
        this.transporter = nodemailer.createTransport({
            host: MAILDEV_HOST,
            port: MAILDEV_PORT,
            secure:false,
            ignoreTLS: true,
        });
    }


    async send(params: { email: string; message: string; subject?: string }): Promise<void> {
        
        await this.transporter.sendMail({
            //translates app data into Nodemailers expected format
            from: 'Bookshop <notreply@bookshop.com>',
            to: params.email,
            text: params.message,
            subject:params.subject
        })
    }
}


