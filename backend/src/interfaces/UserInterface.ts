import { Role } from '@prisma/client';

export interface UserInterface {
  id: number | undefined;
  payload: any | undefined;
  loginUser(): Promise<
    { id: number; email: string; firstName: string; lastName: string; role: Role } | null | undefined
  >;
  createUser(): Promise<
    | {
        status: string;
        message: string;
        user: {
          id: number;
          email: string;
          firstName: string;
          lastName: string;
          role: Role;
        };
      }
    | {
        status: string;
        message: string;
        user?: undefined;
      }
    | undefined
  >;
}

export interface JWTPayloadResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface JWTPayloadRequest extends JWTPayloadResponse {
  iat: number;
  exp: number;
}
