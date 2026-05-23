import { JwtAuthGuard } from '$app/auth/passport/jwt-auth.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { type RequestWithUser } from '$app/auth/types/requestWithUser';

@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiResponse({ type: User })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Req() request: RequestWithUser) {
    return await this.userService.getUser(request.user.id);
  }
}
