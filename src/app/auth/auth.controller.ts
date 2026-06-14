import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignUpResponseDto } from './dto/sign-up.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { type RequestWithUser } from './types/requestWithUser';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { type Response } from 'express';
import { TOKEN_COOKIE_NAME } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignInDto })
  signIn(@Request() request: RequestWithUser) {
    return this.authService.signIn(request.user);
  }

  @Post('signup')
  @ApiResponse({ type: SignUpResponseDto })
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const signUpResult = await this.authService.signUp(signUpDto);

    response.cookie(TOKEN_COOKIE_NAME, signUpResult.access_token, {
      httpOnly: true,
    });

    return signUpResult;
  }
}
