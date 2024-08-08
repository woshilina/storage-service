import { Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, In } from 'typeorm';
import { Permission } from '../permission/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const permissions = await this.permissionRepository.find({
      where: {
        id: In(createRoleDto.permissionIds),
      },
    });
    return await this.roleRepository.save({ ...createRoleDto, permissions });
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
            return qb.where('role.name LIKE :name', {
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

  async findAllRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number) {
    return await this.roleRepository.findOne({
      where: {
        id,
      },
      relations: {
        permissions: true,
      },
    });
  }

  async findRolesByIds(roleIds: number[]) {
    return await this.roleRepository.find({
      where: {
        id: In(roleIds),
      },
      relations: {
        permissions: true,
      },
    });
  }
  async findRolesPermIds(roleIds: number[]) {
    const roles = await this.roleRepository.find({
      where: { id: In(roleIds) },
      relations: {
        permissions: true,
      },
    });
    const permIds = new Set([]);
    roles.forEach((role) => {
      if (role.permissions && role.permissions.length) {
        role.permissions.forEach((item) => {
          permIds.add(item.id);
        });
      }
    });
    const permissionIds = Array.from(permIds);
    return permissionIds;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    role.name = updateRoleDto.name;
    role.remark = updateRoleDto.remark;
    if (updateRoleDto.permissionIds && updateRoleDto.permissionIds.length) {
      const permissions = await this.permissionRepository.find({
        where: {
          id: In(updateRoleDto.permissionIds),
        },
      });
      role.permissions = permissions;
    } else {
      role.permissions = [];
    }
    await this.roleRepository.save(role);
    return {
      message: '编辑成功',
      status: 200,
      data: {
        id: id,
      },
    };
  }

  async multiRemove(ids: []) {
    const roles = await this.roleRepository.find({
      relations: {
        permissions: true,
      },
      where: {
        id: In(ids),
      },
    });
    roles.forEach((user) => {
      user.permissions = [];
    });
    await this.roleRepository.save(roles);
    await this.roleRepository.delete(ids);
    return {
      message: '删除成功',
      status: 200,
    };
  }
}
