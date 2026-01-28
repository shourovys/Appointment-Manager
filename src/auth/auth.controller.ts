import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import type { User, UserDocument } from '../users/user.schema.js';

import { AuthService } from './auth.service.js';
import type { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{
    user: { id: string; email: string; name: string; role: string };
    access_token: string;
  }> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<{
    user: { id: string; email: string; name: string; role: string };
    access_token: string;
  }> {
    return this.authService.register(registerDto.email, registerDto.password, registerDto.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(
    @Request() req: { user: UserDocument },
  ): Promise<{ user: Omit<User, 'password'> | null }> {
    const user = await this.authService.getProfile(req.user._id.toString());
    return { user };
  }
}
