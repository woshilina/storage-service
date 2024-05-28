import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { RoleService } from 'src/role/role.service';
// import { Permission } from 'src/permission/entities/permission.entity';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { PERMS_KEY } from 'src/common/decorator/require-permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(RoleService)
  private roleService: RoleService;
  @Inject(JwtService)
  private jwtService: JwtService;
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return true;
    }
    const requirePermissions = this.reflector.getAllAndOverride<string[]>(
      PERMS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requirePermissions) {
      return true;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request['permissions'] = payload;
    } catch {
      console.log('error');
      throw new UnauthorizedException();
    }
    for (let i = 0; i < requirePermissions.length; i++) {
      const curPermission = requirePermissions[i];
      const found = request['permissions'].permissions.find(
        (item) => item === curPermission,
      );
      if (!found) {
        throw new UnauthorizedException('您没有访问该接口的权限');
      }
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
