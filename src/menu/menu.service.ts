import { Injectable } from '@nestjs/common';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { Menu } from './entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
    const pIds: Set<number> = new Set();
    list.forEach(async (item: any) => {
      if (item.parentId) {
        pIds.add(item.parentId);
      }
    });
    const ids: number[] = Array.from(pIds);
    const parents = await this.findByIds(ids);
    const customData = [];
    for (const item of list) {
      if (item.parentId) {
        const parent = parents.find((ele) => ele.id == item.parentId);
        customData.push({ ...item, parentName: parent.name });
      } else {
        customData.push({ ...item, parentName: '' });
      }
    }
    return [flatArrayToTree(customData), total];
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
    const pIds: Set<number> = new Set();
    list.forEach(async (item: any) => {
      if (item.parentId) {
        pIds.add(item.parentId);
      }
    });
    const ids: number[] = Array.from(pIds);
    const parents = await this.findByIds(ids);
    const customData = [];
    for (const item of list) {
      if (item.parentId) {
        const parent = parents.find((ele) => ele.id == item.parentId);
        customData.push({ ...item, parentName: parent.name });
      } else {
        customData.push({ ...item, parentName: '' });
      }
    }
    return flatArrayToTree(customData);
  }

  async findOne(id: number): Promise<Menu> {
    return await this.menuRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByIds(ids: number[]): Promise<Menu[]> {
    return await this.menuRepository.findBy({
      id: In(ids),
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
    const children: Menu[] = await this.findChildren(ids);
    const childIds = [];
    if (children.length > 0) {
      for (const child of children) {
        childIds.push(child.id);
      }
    }
    await this.menuRepository.delete([...ids, ...childIds]);
    return {
      message: '删除成功',
      status: 200,
    };
  }

  async findChildren(ids: number[]): Promise<Menu[]> {
    return await this.menuRepository.findBy({
      parentId: In(ids),
    });
  }
}
