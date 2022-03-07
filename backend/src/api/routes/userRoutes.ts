import express from 'express';
const userRouter = express.Router();

import { UserPrismaServices } from '../../services/userServices';
import { UserController } from '../controllers/userController';
import { adminProtected } from '../middlewares/adminProtected';
import { isAuth } from '../middlewares/auth';

const userPrismaService = new UserPrismaServices();
const user = new UserController(userPrismaService);

userRouter.post('/', (req, res) => user.loginUser(req, res));

userRouter.post('/check-token', (req, res) => user.checkToken(req, res));

//User needs to be Admin to create new user
userRouter.post('/signup', isAuth, adminProtected, (req, res) => user.createUser(req, res));

export default userRouter;
