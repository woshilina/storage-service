import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
    account: string,
    password: string,
  ): Promise<{ access_token: string; account: string; name: string }> {
    const user = await this.userService.findOne(account);
    if (!user) {
      throw new HttpException('用户名不正确！', HttpStatus.UNAUTHORIZED);
    }
    const compareResult = await BcryptService.compare(password, user.password);
    if (!compareResult) {
      throw new HttpException('密码错误！', HttpStatus.UNAUTHORIZED);
    }
    const payload = { sub: user.id, account: user.account };
    return {
      access_token: await this.jwtService.signAsync(payload),
      account: user.account,
      name: user.name,
    };
  }
}
