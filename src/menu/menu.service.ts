import { Injectable } from '@nestjs/common';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { Menu } from './entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { flatArrayToTree } from '../common/utils';
// import { Request } from 'express';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
  ) {}
  async create(createMenuDto: CreateMenuDto) {
    return await this.menuRepository.save(createMenuDto);
  }

  async findAll(
    currentPage: number,
    pageSize: number,
  ): Promise<[Menu[], number]> {
    const skip = (currentPage - 1) * pageSize;
    const [list, total] = await this.menuRepository.findAndCount({
      order: {
        id: 'DESC',
        orderNum: 'ASC',
      },
      skip: skip,
      take: pageSize,
    });
    return [flatArrayToTree(list), total];
  }

  async findAllMenu(type: string): Promise<Menu[]> {
    const types = type.split(',');
    const list = await this.menuRepository
      .createQueryBuilder('menu')
      .where('menu.type IN (:...types)', {
        types: types,
      })
      .orderBy({ 'menu.id': 'DESC', 'menu.orderNum': 'ASC' })
      .getMany();
    return flatArrayToTree(list);
  }

  async findOne(id: number): Promise<Menu> {
    return await this.menuRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const menu = await this.menuRepository.findOne({
      where: {
        id,
      },
    });
    menu.parentId = updateMenuDto.parentId;
    menu.name = updateMenuDto.name;
    menu.url = updateMenuDto.url;
    menu.type = updateMenuDto.type;
    menu.icon = updateMenuDto.icon;
    menu.orderNum = updateMenuDto.orderNum;
    await this.menuRepository.save(menu);
    return {
      message: '编辑成功',
      status: 200,
      data: {
        id: id,
      },
    };
  }

  async multiRemove(ids: []) {
    await this.menuRepository.delete(ids);
    return {
      message: '删除成功',
      status: 200,
    };
  }
}
