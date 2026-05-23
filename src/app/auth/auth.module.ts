import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbModule } from 'src/common/service/db/db.module';
import { LocalStrategy } from './passport/local.strategy';
import { ExtractJwt } from 'passport-jwt';
import { JwtStrategy } from './passport/jwt.strategy';
import { UserModule } from '$app/user/user.module';
import { UserService } from '$app/user/user.service';
import { UserRepository } from '$app/user/user.repository';

@Module({
  imports: [
    DbModule,
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        signOptions: { expiresIn: '3600s' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    ConfigService,
    JwtStrategy,
    UserService,
    UserRepository,
  ],
})
export class AuthModule {}
