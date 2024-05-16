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
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { DeleteDto } from './dto/delete.dto';
// import { Request } from 'express';

@Controller('/api/v1/menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  async findAll(
    @Query('currentPage', ParseIntPipe) currentPage: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 10,
  ) {
    const [data, total] = await this.menuService.findAll(currentPage, pageSize);
    return {
      data,
      total,
    };
  }

  @Get('/menu')
  async findAllMenu(@Query('type', new DefaultValuePipe('0,1')) type: string) {
    return await this.menuService.findAllMenu(type);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete('/')
  multiRemove(@Body() body: DeleteDto) {
    return this.menuService.multiRemove(body.ids);
  }
}
