import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../common/bcryptjs';
import { jwtConstants } from './constants';

// import { flatArrayToTree } from '../common/utils';
// import { Permission } from 'src/permission/entities/permission.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private jwtService: JwtService,
  ) {}

  async getUserPerms(user: User): Promise<string[]> {
    const roleIds = user.roles.map((role) => role.id);
    const permIds = await this.roleService.findRolesPermIds(roleIds);
    const permissions = await this.permissionService.findPermsByIds(permIds);
    const permCodes =
      permissions.length > 0 ? permissions.map((perm) => perm.code) : [];
    return permCodes;
  }

  async validateUser(
    account: string,
    password: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
    user: User;
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
    const permCodes = await this.getUserPerms(user);
    const payload = {
      id: user.id,
      permissions: permCodes,
    };
    const { accessToken, refreshToken } = await this.generateToken(payload);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: user,
      permissions: permCodes,
    };
  }
  // 生成 token
  async generateToken(payload) {
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '24h',
      }),
    };
  }
  // 刷新token
  async refreshToken(refresh_token: string) {
    try {
      // 验证refresh_token
      const { id } = await this.jwtService.verifyAsync(refresh_token, {
        secret: jwtConstants.secret,
      });
      // 获取用户信息
      const user = await this.userService.findOneById(id);
      const permCodes = await this.getUserPerms(user);
      const { accessToken, refreshToken } = await this.generateToken({
        id,
        permissions: permCodes,
      });

      return {
        refresh_token: refreshToken,
        access_token: accessToken,
      };
    } catch (error) {
      throw new HttpException('refresh_token已过期', HttpStatus.BAD_REQUEST);
    }
  }
}
