import { Request } from 'express';
import { JWTValidateResponse } from './jwt';
import { User } from '$app/user/entities/user.entity';

export type RequestWithUser = Request & {
  user: User;
};
export type RequestWithJWTPayload = Request & {
  user: JWTValidateResponse;
};
