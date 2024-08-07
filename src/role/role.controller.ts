import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { DeleteDto } from '../common/dto/delete.dto';
import { RequirePermission } from '../common/decorator/require-permission.decorator';

@Controller('/api/v1/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @RequirePermission(['role:add'])
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @RequirePermission(['role:list'])
  async findAll(
    @Query('currentPage') currentPage: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('name') name: string = '',
  ) {
    const [data, total] = await this.roleService.findAll(
      currentPage,
      pageSize,
      name,
    );
    return { data, total };
  }

  @Get('/all')
  async findAllRoles() {
    return await this.roleService.findAllRoles();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Put(':id')
  @RequirePermission(['role:edit'])
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roleService.remove(id);
  // }
  @Delete('/')
  @RequirePermission(['role:delete'])
  multiRemove(@Body() body: DeleteDto) {
    return this.roleService.multiRemove(body.ids);
  }
}
