import { User } from '@device-management/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  mobilePhoneTokens = new Map<string, string>();
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private login(user: User, expireTokenIn = '15d') {
    const payload: User = {
      id: user.id,
      name: user.name,
      username: user.username,
    } as User;

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: expireTokenIn,
    });

    return token;
  }

  async checkLogin(username: string, password: string): Promise<string> {
    const user = await this.userModel.findOne({ username, password }).exec();
    if (user) {
      return this.login(user);
    } else {
      throw new UnauthorizedException();
    }
  }
}
