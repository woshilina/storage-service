import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { GoodsService } from './goods.service';
import { CreateGoodsDto, UpdateGoodsDto } from './dto/goods.dto';
import { DeleteDto } from '../common/dto/delete.dto';
import { RequirePermission } from '../common/decorator/require-permission.decorator';

@Controller('/api/v1/goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post('/')
  @RequirePermission(['goods:add'])
  create(@Body() createGoodsDto: CreateGoodsDto) {
    return this.goodsService.create(createGoodsDto);
  }

  @Get('/')
  @RequirePermission(['goods:list'])
  async findAll(
    @Query('currentPage') currentPage: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('name') name: string = '',
    @Query('specification') specification: string = '',
    @Query('startQuantity') startQuantity: number = 0,
    @Query('endQuantity') endQuantity: number = 0,
    @Query('sortBy') sortBy: string = '',
    @Query('orderBy') orderBy: string = '',
  ) {
    const [data, total] = await this.goodsService.findAll(
      currentPage,
      pageSize,
      name,
      specification,
      startQuantity,
      endQuantity,
      sortBy,
      orderBy,
    );

    const totalPage = Math.ceil(total / pageSize);
    return {
      data,
      total,
      totalPage,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goodsService.findOne(+id);
  }

  @Put(':id')
  @RequirePermission(['goods:edit'])
  update(@Param('id') id: string, @Body() updateGoodsDto: UpdateGoodsDto) {
    return this.goodsService.update(+id, updateGoodsDto);
  }

  @Delete('/')
  @RequirePermission(['goods:delete'])
  multiRemove(@Body() body: DeleteDto) {
    return this.goodsService.multiRemove(body.ids);
  }

  // @Delete('/:id')
  // remove(@Param('id') id: number) {
  //   return this.GoodsService.remove(id);
  // }
}
