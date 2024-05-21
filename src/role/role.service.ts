import { Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, In } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private rolePermRepository: Repository<RolePermission>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.save(createRoleDto);
    const rolePerms = [];
    createRoleDto.permissionIds.forEach((id) => {
      rolePerms.push({
        roleId: role.id,
        permissionId: id,
      });
    });
    return await this.rolePermRepository.save(rolePerms);
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
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    const rolePerms = await this.rolePermRepository.find({
      where: { roleId: role.id },
    });
    const permIds = [];
    rolePerms.forEach((item) => {
      permIds.push(item.permissionId);
    });
    return { ...role, permissionIds: permIds };
  }

  async findRolesPerms(roleIds: number[]) {
    const rolePerms = await this.rolePermRepository.find({
      where: { roleId: In(roleIds) },
    });
    const permIds = [];
    rolePerms.forEach((item) => {
      permIds.push(item.permissionId);
    });
    return permIds;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    role.name = updateRoleDto.name;
    role.remark = updateRoleDto.remark;
    await this.roleRepository.save(role);
    //find 该角色对应的所有角色权限数据
    const rolePerms = await this.rolePermRepository.find({
      where: {
        roleId: id,
      },
    });

    // delete 该角色对应的所有角色权限数据
    const rolePermIds = [];
    rolePerms.forEach((item) => {
      rolePermIds.push(item.id);
    });
    await this.rolePermRepository.delete(rolePermIds);

    // save 该角色对应的所有新的角色权限数据
    const newRolePerms = [];
    updateRoleDto.permissionIds.forEach((item) => {
      newRolePerms.push({ roleId: id, permissionId: item });
    });
    await this.rolePermRepository.save(newRolePerms);
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
    const rolePerms = await this.rolePermRepository.find({
      where: {
        roleId: In(ids),
      },
    });
    const rolePermIds = [];
    rolePerms.forEach((item) => {
      rolePermIds.push(item.id);
    });
    await this.rolePermRepository.delete(rolePermIds);
    return {
      message: '删除成功',
      status: 200,
    };
  }
}
