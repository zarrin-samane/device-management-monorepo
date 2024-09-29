import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@device-management/types';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() dto: { username: string; password: string }) {
    return this.auth.checkLogin(dto.username, dto.password);
  }
}
