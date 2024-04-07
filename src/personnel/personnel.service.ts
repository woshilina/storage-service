import { Injectable } from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
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

  async findAll(
    currentPage: number,
    pageSize: number,
    name: string,
    sex: string,
    fromAge: number,
    toAge: number,
  ): Promise<[Personnel[], number]> {
    const skip = (currentPage - 1) * pageSize;
    return await this.personnelRepository
      .createQueryBuilder('personnel')
      .where(
        new Brackets((qb) => {
          if (name) {
            return qb.where('personnel.name LIKE :name', {
              name: `%${name}%`,
            });
          } else {
            return qb;
          }
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (sex) {
            return qb.where('personnel.sex = :sex', { sex });
          } else {
            return qb;
          }
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (fromAge && toAge) {
            return qb.where('personnel.age BETWEEN :fromAge AND :toAge', {
              fromAge,
              toAge,
            });
          } else {
            return qb;
          }
        }),
      )
      .orderBy('personnel.id', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();
  }

  async getCount(): Promise<number> {
    return await this.personnelRepository.count();
  }

  async findOne(id: number): Promise<Personnel> {
    return await this.personnelRepository.findOneByOrFail({ id: id });
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
