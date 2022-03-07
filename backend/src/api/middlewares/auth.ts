import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { JWTPayloadRequest } from '../../interfaces/UserInterface';

const jwtSecret: Secret = process.env.JWTSECRET as string;

export const isAuth = (req: any, res: Response, next: NextFunction) => {
  // Need to parse Header with Authorization field: Bearer "token"
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.redirect(403, '/login');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JWTPayloadRequest;
    const epochNow = new Date().getTime();
    if (decoded.exp <= epochNow) {
      req.user = decoded;
    } else {
      res.status(401).json({ status: 'unauthorized' });
    }
  } catch (err) {
    return res.status(401).json({ status: 'unauthorized' });
  }
  console.log('User Authenticated');

  //If user is authorized, send status else proceed to next route as middleware
  if (req.originalUrl === '/api/auth') {
    res.status(200).json({ status: 'authorized' });
  } else {
    return next();
  }
};
