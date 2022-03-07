import { NextFunction, Response } from 'express';

//Middleware that checks if User Role is Admin, or terminates request to access protected endpoint
export const adminProtected = (req: any, res: Response, next: NextFunction) => {
  const { role } = req.user;
  if (role !== 'ADMIN') {
    return res.sendStatus(403);
  }
  console.log('User Is Admin');
  next();
};
