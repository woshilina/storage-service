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
import { PersonnelService } from './personnel.service';
import { CreatePersonnelDto, UpdatePersonnelDto } from './dto/personnel.dto';
import { DeleteDto } from './dto/delete.dto';

@Controller('/api/v1/personnel')
export class PersonnelController {
  constructor(private readonly personnelService: PersonnelService) {}

  @Post('/add')
  create(@Body() createPersonnelDto: CreatePersonnelDto) {
    return this.personnelService.create(createPersonnelDto);
  }

  @Get('/all')
  async findAll(
    @Query('currentPage') currentPage: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('name') name: string = '',
    @Query('sex') sex: string = '',
    @Query('startAge') startAge: number = 0,
    @Query('endAge') endAge: number = 0,
  ) {
    const [data, total] = await this.personnelService.findAll(
      currentPage,
      pageSize,
      name,
      sex,
      startAge,
      endAge,
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
    return this.personnelService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonnelDto: UpdatePersonnelDto,
  ) {
    return this.personnelService.update(+id, updatePersonnelDto);
  }

  @Delete('/multi')
  multiRemove(@Body() body: DeleteDto) {
    return this.personnelService.multiRemove(body.ids);
  }

  // @Delete('/:id')
  // remove(@Param('id') id: number) {
  //   return this.personnelService.remove(id);
  // }
}
