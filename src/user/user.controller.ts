import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../auth/decorator/public.decorator';

// import { ValidationPipe } from '../pipe/validation/validation.pipe';

@Controller('/api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
  // login(@Body(ValidationPipe) createUserDto: CreateUserDto, @Req() req) {
  //   return req.user;
  // }
  // @Post('/login')
  // login(@Body() loginData: CreateUserDto) {
  //   return this.userService.login(loginData);
  // }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
