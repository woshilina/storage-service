import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';

@Controller('/api/v1/personnel')
export class PersonnelController {
  constructor(private readonly personnelService: PersonnelService) {}

  @Post('/add')
  create(@Body() createPersonnelDto: CreatePersonnelDto) {
    console.log(createPersonnelDto);
    return this.personnelService.create(createPersonnelDto);
  }

  @Get('/all')
  async findAll(
    @Query('currentPage') currentPage: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('name') name: string = '',
    @Query('sex') sex: string = '',
    @Query('fromAge') fromAge: number = 0,
    @Query('toAge') toAge: number = 0,
  ) {
    const [data, total] = await this.personnelService.findAll(
      currentPage,
      pageSize,
      name,
      sex,
      fromAge,
      toAge,
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonnelDto: UpdatePersonnelDto,
  ) {
    return this.personnelService.update(+id, updatePersonnelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personnelService.remove(+id);
  }
}
