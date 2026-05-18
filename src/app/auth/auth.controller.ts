import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignUpResponseDto } from './dto/sign-up.dto';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  type RequestWithJWTPayload,
  type RequestWithUser,
} from './types/requestWithUser';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './entities/user.entity';
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

  @Get('user')
  @ApiBearerAuth()
  @ApiResponse({ type: User })
  @UseGuards(JwtAuthGuard)
  getUser(@Request() request: RequestWithJWTPayload) {
    return this.authService.getUser(request.user.login);
  }
}
