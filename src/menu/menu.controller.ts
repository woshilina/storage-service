import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { DeleteDto } from './dto/delete.dto';
import { Request } from 'express';

@Controller('/api/v1/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto, @Req() request: Request) {
    console.log(request);
    return this.menuService.create(createMenuDto, request);
  }

  @Get()
  async findAll(
    @Query('currentPage') currentPage: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    const [data, total] = await this.menuService.findAll(currentPage, pageSize);
    const totalPage = Math.ceil(total / pageSize);
    return {
      data,
      total,
      totalPage,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete('/')
  multiRemove(@Body() body: DeleteDto) {
    return this.menuService.multiRemove(body.ids);
  }
}
