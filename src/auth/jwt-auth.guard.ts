import {
  Injectable,
  ExecutionContext,
  //   UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
// import { jwtConstants } from './constants';
// import { Request } from 'express';
import { IS_PUBLIC_KEY } from './decorator/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  //   handleRequest(err, user, info) {
  //     console.log(err);
  //     console.log(info);

  //     // You can throw an exception based on either "info" or "err" arguments
  //     if (err || !user) {
  //       throw err || new UnauthorizedException();
  //     }
  //     return user;
  //   }
}
