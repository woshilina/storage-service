import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  Param,
  Delete,
  // Req,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { DeleteDto } from '../common/dto/delete.dto';
import { RequirePermission } from '../common/decorator/require-permission.decorator';
// import { Request } from 'express';

@Controller('/api/v1/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @RequirePermission(['permission:add'])
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  // @Get()
  // async findAll(
  //   @Query('currentPage', ParseIntPipe) currentPage: number = 1,
  //   @Query('pageSize', ParseIntPipe) pageSize: number = 10,
  // ) {
  //   const [data, total] = await this.permissionService.findAll(currentPage, pageSize);
  //   return {
  //     data,
  //     total,
  //   };
  // }

  @Get('/')
  @RequirePermission(['permission:list'])
  async findPermissionByType(
    @Query('type', new DefaultValuePipe('0,1,2')) type: string,
  ) {
    return await this.permissionService.findPermissionByType(type);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findOne(+id);
  }

  @Put(':id')
  @RequirePermission(['permission:edit'])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete('/')
  @RequirePermission(['permission:delete'])
  multiRemove(@Body() body: DeleteDto) {
    return this.permissionService.multiRemove(body.ids);
  }
}
