import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteDto } from 'src/common/dto/delete.dto';
import { PasswordDto } from './dto/password.dto';
import { Public } from '../auth/decorator/public.decorator';
import { RequirePermission } from 'src/common/decorator/require-permission.decorator';

@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/')
  // @RequirePermission(['user:create'])
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @RequirePermission(['user:list'])
  async findAll(
    @Query('currentPage') currentPage: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('account') account: string = '',
  ) {
    const [data, total] = await this.userService.findAll(
      currentPage,
      pageSize,
      account,
    );
    return { data, total };
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @Put(':id')
  @RequirePermission(['user:edit'])
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch(':id')
  @RequirePermission(['user:resetpass'])
  resetPassword(@Param('id') id: string, @Body() passwordDto: PasswordDto) {
    return this.userService.resetPassword(+id, passwordDto);
  }

  @Delete(':id')
  @RequirePermission(['user:delete'])
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  @Delete('/')
  @RequirePermission(['user:delete'])
  multiRemove(@Body() body: DeleteDto) {
    return this.userService.multiRemove(body.ids);
  }
}
