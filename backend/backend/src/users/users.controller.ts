import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface JwtUser {
  userId: string;
  email: string;
}

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request & { user: JwtUser }) {
    return req.user; // returns { userId, email } from JWT
  }
}
