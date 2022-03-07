import { UserInterface } from '../interfaces/UserInterface';
import Services from './baseServicesClass';
import { prisma } from './prismaClient';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export class UserPrismaServices extends Services implements UserInterface {
  async loginUser() {
    const email = this.payload.email;
    const password = this.payload.password;

    try {
      const getUserHashedPassword = await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          password: true,
          role: true,
        },
      });
      if (getUserHashedPassword) {
        const passwordMatch = await bcrypt.compare(password, getUserHashedPassword.password);
        if (passwordMatch) {
          return {
            id: getUserHashedPassword.id,
            email: getUserHashedPassword.email,
            firstName: getUserHashedPassword.firstName,
            lastName: getUserHashedPassword.lastName,
            role: getUserHashedPassword.role,
          };
        }
        //If password doesn't match return null
        return null
      } 
      //If User doesn't exist return null
      else {
        return null;
      }
    } catch (e: any) {
      this.errorHandler(e);
    }
  }

  async createUser() {
    const userEnteredEmail = this.payload.email;
    const userEnteredPassword = this.payload.password;
    const userEnteredFirstName = this.payload.firstName;
    const userEnteredLastName = this.payload.lastName;
    const userEnteredRole = this.payload.role;

    try {
      const user = await prisma.user.findUnique({
        where: {
          email: userEnteredEmail,
        },
      });
      //If user doesn't exist, hash password and save new user
      if (!user) {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(userEnteredPassword, salt);
        const createUser = await prisma.user.create({
          data: {
            email: userEnteredEmail,
            password: hashedPassword,
            firstName: userEnteredFirstName,
            lastName: userEnteredLastName,
            role: userEnteredRole,
          },
        });
        return {
          status: 'success',
          message: 'New User Created',
          user: {
            id: createUser.id,
            email: createUser.email,
            firstName: createUser.firstName,
            lastName: createUser.lastName,
            role: createUser.role,
          },
        };
      } else {
        return {
          status: 'error',
          message: 'User Already Exists',
        };
      }
    } catch (e: any) {
      this.errorHandler(e);
    }
  }
}
