import { Request } from 'express';
import { JWTValidateResponse } from './jwt';
import { UserDto } from '$app/user/dto/user.dto';

export type RequestWithUser = Request & {
  user: UserDto;
};
export type RequestWithJWTPayload = Request & {
  user: JWTValidateResponse;
};
