import { Injectable } from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Personnel } from './entities/personnel.entity';

@Injectable()
export class PersonnelService {
  constructor(
    @InjectRepository(Personnel)
    private personnelRepository: Repository<Personnel>,
  ) {}
  async create(createPersonnelDto: CreatePersonnelDto) {
    const personnel = await this.personnelRepository.save(createPersonnelDto);
    return {
      message: '新增成功',
      status: 200,
      data: {
        id: personnel.id,
      },
    };
  }

  async findAll() {
    return await this.personnelRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} personnel`;
  }

  async update(id: number, updatePersonnelDto: UpdatePersonnelDto) {
    console.log(id);
    await this.personnelRepository.update(id, updatePersonnelDto);
    return {
      message: '编辑成功',
      status: 200,
      data: {
        id: id,
      },
    };
  }

  async remove(id: number) {
    await this.personnelRepository.delete(id);
    return {
      message: '删除成功',
      status: 200,
    };
  }
}
