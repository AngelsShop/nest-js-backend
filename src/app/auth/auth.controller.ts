import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignUpResponseDto } from './dto/sign-up.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { type RequestWithUser } from './types/requestWithUser';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { SignInDto } from './dto/sign-in.dto';

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
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
