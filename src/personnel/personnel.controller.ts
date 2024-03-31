import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  findAll() {
    return this.personnelService.findAll();
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
