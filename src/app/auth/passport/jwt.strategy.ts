import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTPayload, JWTValidateResponse } from '../types/jwt';
import { Request } from 'express';
import { TOKEN_COOKIE_NAME } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies[TOKEN_COOKIE_NAME];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '',
    });
  }

  validate(payload: JWTPayload): JWTValidateResponse {
    return { id: payload.sub, login: payload.username };
  }
}
