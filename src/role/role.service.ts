import { Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    return await this.roleRepository.save(createRoleDto);
  }

  async findAll(
    currentPage: number,
    pageSize: number,
    name: string,
  ): Promise<[Role[], number]> {
    const skip = (currentPage - 1) * pageSize;
    return await this.roleRepository
      .createQueryBuilder('role')
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
      .orderBy('role.id', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();
  }

  async findOne(id: string): Promise<Role> {
    return await this.roleRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const menu = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    menu.name = updateRoleDto.name;
    menu.remark = updateRoleDto.remark;
    await this.roleRepository.save(menu);
    return {
      message: '编辑成功',
      status: 200,
      data: {
        id: id,
      },
    };
  }

  async multiRemove(ids: []) {
    await this.roleRepository.delete(ids);
    return {
      message: '删除成功',
      status: 200,
    };
  }
}
