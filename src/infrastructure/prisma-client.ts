import { PrismaClient } from '@prisma/client';

//Shared instance of PrismaClient for the whole app
//Avoids: multipe pools of conexion and inconsistent visibility between connections

const prisma = new PrismaClient();


export { prisma };


