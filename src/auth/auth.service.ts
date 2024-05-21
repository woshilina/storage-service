import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../common/bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private jwtService: JwtService,
  ) {}
  async signIn(
    account: string,
    password: string,
  ): Promise<{
    access_token: string;
    user: User;
    // account: string;
    // name: string;
    // id: string;
    permissions: string[];
  }> {
    const user = await this.userService.findOne(account);
    if (!user) {
      throw new HttpException('用户名不正确！', HttpStatus.UNAUTHORIZED);
    }
    const compareResult = await BcryptService.compare(password, user.password);
    if (!compareResult) {
      throw new HttpException('密码错误！', HttpStatus.UNAUTHORIZED);
    }
    const roleIds = user.roles.map((role) => role.id);
    const permIds = await this.roleService.findRolesPerms(roleIds);
    const permissions = await this.permissionService.findByIds(permIds);

    const permCodes =
      permissions.length > 0 ? permissions.map((perm) => perm.code) : [];
    const payload = { sub: user.id, account: user.account };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
      // account: user.account,
      // name: user.name,
      // id: user.id + '',
      permissions: permCodes,
    };
  }
}
