import z from "zod";
import dotenv from 'dotenv';
import ZodError = require("zod");


const environmentVariablesValidator = z.object({
    DATABASE_URL : z.url(),
    JWT_SECRET: z.string(),
    NODE_ENV : z.enum(['local', 'staging', 'production', 'test']),
    PORT : z.coerce.number(),
})

type EnvironmentVariables = z.infer<typeof environmentVariablesValidator>;

class EnvironmentService {

    private environmentVariables: EnvironmentVariables | null; 


    load () { 
    //Read .env store variables , validate, store  & pt values into process.env
    //initialization method
    if (this.environmentVariables) 
        return;

    dotenv.config();  
    try {
        this.environmentVariables = environmentVariablesValidator.parse(process.env);
        console.log('Environment variables loaded')
    } catch(error) {
        if (error) {
            throw new Error('Could´t load environment variables ')
        }
    }
    };

    get() : EnvironmentVariables {
        if(!this.environmentVariables) {
            throw new Error('Environment variables not lodad, call .load() first');
        }
        return this.environmentVariables;
    };
    //return values when needed
    //accessor method 


 }

 export const environmentService = new EnvironmentService();


