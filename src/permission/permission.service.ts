import { Injectable } from '@nestjs/common';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';

import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { flatArrayToTree } from '../common/utils';
// import { Request } from 'express';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto) {
    return await this.permissionRepository.save(createPermissionDto);
  }

  async findAll(
    currentPage: number,
    pageSize: number,
  ): Promise<[Permission[], number]> {
    const skip = (currentPage - 1) * pageSize;
    const [list, total] = await this.permissionRepository.findAndCount({
      order: {
        orderNum: 'ASC',
        id: 'DESC',
      },
      skip: skip,
      take: pageSize,
    });
    // 添加 parentName 字段
    // const pIds: Set<number> = new Set();
    // list.forEach(async (item: any) => {
    //   if (item.parentId) {
    //     pIds.add(item.parentId);
    //   }
    // });
    // const ids: number[] = Array.from(pIds);
    // const parents = await this.findByIds(ids);
    // const customData = [];
    // for (const item of list) {
    //   if (item.parentId) {
    //     const parent = parents.find((ele) => ele.id == item.parentId);
    //     customData.push({ ...item, parentName: parent.name });
    //   } else {
    //     customData.push({ ...item, parentName: '' });
    //   }
    // }
    return [flatArrayToTree(list), total];
  }

  async findPermissionByType(type: string): Promise<Permission[]> {
    const types = type.split(',');
    const list = await this.permissionRepository
      .createQueryBuilder('permission')
      .where('permission.type IN (:...types)', {
        types: types,
      })
      .orderBy({ 'permission.orderNum': 'ASC', 'permission.id': 'DESC' })
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

  async findOne(id: number): Promise<Permission> {
    return await this.permissionRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByIds(ids: number[]): Promise<Permission[]> {
    return await this.permissionRepository.findBy({
      id: In(ids),
    });
  }
  async findMenuPerms(ids: number[], perms: Permission[]) {
    const permissions = await this.findByIds(ids);
    perms.push(...permissions);
    const newIds = [];
    permissions.forEach((item) => {
      if (item.parentId) {
        newIds.push(item.parentId);
      }
    });
    if (newIds.length) {
      return this.findMenuPerms(newIds, perms);
    } else {
      return perms;
    }
  }
  async findPermsByIds(ids: number[]): Promise<Permission[]> {
    const perms: Permission[] = [];
    // 递归查找父元素 直至最顶层
    const permsArr = await this.findMenuPerms(ids, perms);
    // 去重
    for (let i = 0; i < permsArr.length - 1; i++) {
      for (let j = i + 1; j < permsArr.length; j++) {
        if (permsArr[i].id == permsArr[j].id) {
          permsArr.splice(j, 1);
          // splice删除了一个元素，下标要减一，否则循环会漏掉一个元素(多个相邻的元素 可能会漏掉删除元素)
          j--;
        }
      }
    }
    return permsArr;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepository.findOne({
      where: {
        id,
      },
    });
    permission.parentId = updatePermissionDto.parentId;
    permission.name = updatePermissionDto.name;
    permission.url = updatePermissionDto.url;
    permission.code = updatePermissionDto.code;
    permission.type = updatePermissionDto.type;
    permission.icon = updatePermissionDto.icon;
    permission.orderNum = updatePermissionDto.orderNum;
    await this.permissionRepository.save(permission);
    return {
      message: '编辑成功',
      status: 200,
      data: {
        id: id,
      },
    };
  }

  async multiRemove(ids: []) {
    const children: Permission[] = await this.findChildren(ids);
    const childIds = [];
    if (children.length > 0) {
      for (const child of children) {
        childIds.push(child.id);
      }
    }
    await this.permissionRepository.delete([...ids, ...childIds]);
    return {
      message: '删除成功',
      status: 200,
    };
  }

  async findChildren(ids: number[]): Promise<Permission[]> {
    return await this.permissionRepository.findBy({
      parentId: In(ids),
    });
  }
}
