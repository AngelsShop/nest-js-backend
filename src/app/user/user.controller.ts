import { JwtAuthGuard } from '$app/auth/passport/jwt-auth.guard';
import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { type RequestWithUser } from '$app/auth/types/requestWithUser';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Put('update')
  @ApiResponse({ type: User })
  async updateUser(
    @Body() user: UpdateUserDto,
    @Req() request: RequestWithUser,
  ) {
    return this.userService.updateUser(request.user.id, user);
  }
}
