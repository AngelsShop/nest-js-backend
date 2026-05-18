import { Request } from 'express';
import { User } from '../entities/user.entity';
import { JWTValidateResponse } from './jwt';

export type RequestWithUser = Request & {
  user: User;
};
export type RequestWithJWTPayload = Request & {
  user: JWTValidateResponse;
};
