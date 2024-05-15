import { Injectable } from '@nestjs/common';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { Menu } from './entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
  ) {}
  async create(createMenuDto: CreateMenuDto, request: Request) {
    console.log(request);
    return await this.menuRepository.save(createMenuDto);
  }

  async findAll(
    currentPage: number,
    pageSize: number,
  ): Promise<[Menu[], number]> {
    const skip = (currentPage - 1) * pageSize;
    return await this.menuRepository.findAndCount({
      order: {
        id: 'DESC',
      },
      skip: skip,
      take: pageSize,
    });
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