// There should only be one instance of Prisma, so all ORM calls should reference this instance

//The object is cached the first time the module is imported. 
//Subsequent requests return the cached object rather than creating a new PrismaClient:

import { PrismaClient, Prisma } from '@prisma/client'

let prisma = new PrismaClient()  // use "let" keyword

export {prisma, Prisma} ;
