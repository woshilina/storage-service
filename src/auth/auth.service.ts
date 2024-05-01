import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../common/bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string; username: string }> {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new HttpException('用户名不正确！', HttpStatus.UNAUTHORIZED);
    }
    const compareResult = await BcryptService.compare(password, user.password);
    if (!compareResult) {
      throw new HttpException('密码错误！', HttpStatus.UNAUTHORIZED);
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      username: user.username,
    };
  }
}
