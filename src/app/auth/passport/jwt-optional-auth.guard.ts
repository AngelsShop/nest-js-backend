import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(_, user: TUser): TUser | undefined {
    return user || undefined;
  }
}
