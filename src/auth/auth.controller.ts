import {
  // Body,
  Controller,
  Get,
  Query,
  Post,
  // HttpCode,
  // HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    console.log(req);
    return req.user;
  }
  @Public()
  @Get('/refreshtoken')
  refresh(@Query('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
