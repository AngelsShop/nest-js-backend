import { JwtAuthGuard } from '$app/auth/passport/jwt-auth.guard';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { CurrentUserId } from 'src/decorators/current-user-id.decorator';

@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiResponse({ type: UserDto })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@CurrentUserId() userId: string) {
    return await this.userService.getUser(userId);
  }

  @Patch('update')
  @ApiResponse({ type: UserDto })
  async updateUser(
    @Body() user: UpdateUserDto,
    @CurrentUserId() userId: string,
  ) {
    return this.userService.updateUser(userId, user);
  }
}
