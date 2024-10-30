import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginUserDto } from './dto/login.dto';

import { comparePassword } from 'src/common/helpers/password';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(loginUserDto.email);
    const { password, ...restUser } = user;

    const isMatch = await comparePassword(loginUserDto.password, password);

    if (!isMatch) throw new BadRequestException('Invalid credentials');

    return {
      access_token: this.jwtService.sign({
        userName: restUser.name,
        userId: restUser.id,
      }),

      user: restUser,
    };
  }

  async getTokenInfo(userToken: { userName: string; userId: string }) {
    try {
      const user = await this.usersService.getUserById(userToken.userId);
      delete user.password;
      return user;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
