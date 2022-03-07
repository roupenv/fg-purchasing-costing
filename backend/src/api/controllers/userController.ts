import express, { NextFunction, Request, Response } from 'express';
import { JWTPayloadResponse, JWTPayloadRequest, UserInterface } from '../../interfaces/UserInterface';
import jwt, { Secret } from 'jsonwebtoken';

const jwtSecret = process.env.JWTSECRET as Secret;

export class UserController {
  constructor(private loginService: UserInterface) {}

  async loginUser(req: Request, res: Response): Promise<void> {
    const user = req.body;
    this.loginService.payload = user;

    try {
      const authenticated = await this.loginService.loginUser();
      if (authenticated) {
        const JWTPayload: JWTPayloadResponse = {
          id: authenticated.id,
          email: authenticated.email,
          firstName: authenticated.firstName,
          lastName: authenticated.lastName,
          role: authenticated.role,
        };

        const token = jwt.sign(JWTPayload, jwtSecret, {
          expiresIn: '2h',
        });
        // send user
        res.status(201).json({ userInfo: JWTPayload, token: token, message: 'User Authenticated' });
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const user = req.body;
    this.loginService.payload = user;

    try {
      const response = await this.loginService.createUser();
      if (response?.status === 'success') {
        res.status(201).json({ message: 'Created New User Successfully', user: response.user });
      } else if (response?.status === 'error') {
        res.status(400).json({ message: response.message });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async checkToken(req: any, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.redirect(403, '/login');
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as JWTPayloadRequest;
      console.log(decoded);
      const epochNow = new Date().getTime();
      if (decoded.exp <= epochNow) {
        res.status(200).json({ status: 'authorized' });
      } else {
        res.status(401).json({ status: 'unauthorized' });
      }
    } catch (err) {
      res.status(401).json({ status: 'unauthorized' });
    }
    console.log('User Authenticated');
  }
}
