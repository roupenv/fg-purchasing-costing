import { PrismaClient } from '.prisma/client';
import { prisma, Prisma } from './prismaClient';

interface prismaErrorInterface extends Error {
  code?: string;
  meta?: string;
}

export default class Services {
  id: number | undefined;
  payload: any | undefined;
  context: PrismaClient;
  constructor(
    id: number | undefined = undefined,
    payload: any | undefined = undefined,
    context: PrismaClient = prisma
  ) {
    this.id = Number(id);
    this.payload = payload;
    this.context = context;
  }

  async dbConnect() {
    await this.context.$connect();
  }

  async dbDisconnect() {
    await this.context.$disconnect();
  } 

  errorHandler(e: prismaErrorInterface) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('This is a Prisma Error');
      // console.error(error)
      // The .code property can be accessed in a type-safe manner
      switch (e.code) {
        case 'P2002':
          throw new Error(e.message);
        case 'P2025':
          console.log(e.meta);
          throw new Error(JSON.stringify(e.meta));
        case 'P2003':
          console.log(e);
          console.log(e.meta);
          throw new Error('Cant Delete: Records in other tables');
        case 'P2014':
          console.log(e);
          console.log(e.meta);
          throw new Error('Cant Delete: The change you are trying to make would violate the required relation');
        default:
          console.log('Unhandled Prisma Error!!!!');
          console.log(e);
          break;
      }
    } else if (e  instanceof Prisma.PrismaClientValidationError){
      console.log(e.message)
      throw new Error('Prisma cant validate clients request');

    } 
    else {
      console.error('This is not a Prisma Error');
      console.error(e);
      throw new Error(e.message);
    }
  }
}
