import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UserId } from '../decorators/user';
import { HttpGuard } from '../guards/http.guard';
import { AuthService } from './auth.service';
import { AuthRO, UserWithoutCreds, UserWithoutCredsRO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<AuthRO> {
    return this.authService.login(email, password);
  }

  @UseGuards(HttpGuard)
  @Get('me')
  me(@UserId() userId: number): UserWithoutCreds {
    return this.authService.me(userId);
  }

  @UseGuards(HttpGuard)
  @Post('logout')
  logout(@UserId() userId: number): boolean {
    return this.authService.logout(userId);
  }

  @UseGuards(HttpGuard)
  @Get('refresh-token')
  async refreshToken(@UserId() userId: number): Promise<UserWithoutCredsRO> {
    return this.authService.refreshToken(userId);
  }
}
