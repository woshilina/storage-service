import {
  Body,
  Controller,
  //   Get,
  Post,
  HttpCode,
  HttpStatus,
  //   Request,
  //   UseGuards,
} from '@nestjs/common';
// import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.account, signInDto.password);
  }

  //   @UseGuards(AuthGuard)
  //   @Get('profile')
  //   getProfile(@Request() req) {
  //     return req.user;
  //   }
}
