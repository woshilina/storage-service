import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, In } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BcryptService } from '../common/bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { account } = createUserDto;
    const existUser = await this.userRepository.findOne({
      where: { account },
    });
    if (existUser) {
      throw new HttpException('用户已存在', HttpStatus.UNAUTHORIZED);
    }
    try {
      // 直接 save  user entity @BeforeInsert 会不起作用
      const roles = await this.roleRepository.find({
        where: {
          id: In(createUserDto.roleIds),
        },
      });
      const entity = Object.assign(new User(), createUserDto);
      entity.roles = roles;
      await this.userRepository.save(entity);
      return {
        message: '注册成功',
        status: 200,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(
    currentPage: number,
    pageSize: number,
    account: string,
  ): Promise<[User[], number]> {
    const skip = (currentPage - 1) * pageSize;
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .where(
        new Brackets((qb) => {
          if (account) {
            return qb.where('user.account LIKE :account', {
              account: `%${account}%`,
            });
          } else {
            return qb;
          }
        }),
      )
      .orderBy('user.id', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();
  }

  async login(loginData: CreateUserDto) {
    const { account, password } = loginData;
    const existUser = await this.userRepository.findOne({
      where: { account },
    });
    if (!existUser) {
      throw new HttpException('用户名不正确！', HttpStatus.UNAUTHORIZED);
    }
    const compareResult = BcryptService.compare(password, existUser.password);
    if (!compareResult) {
      throw new HttpException('密码错误！', HttpStatus.UNAUTHORIZED);
    } else {
      return {
        message: '登录成功',
        status: '200',
      };
    }
  }

  async findOneById(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        roles: true,
      },
    });
    return user;
  }

  async findOne(account: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { account },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    user.account = updateUserDto.account;
    // user.password = updateUserDto.password;
    user.name = updateUserDto.name;
    user.email = updateUserDto.email;
    const roles = await this.roleRepository.find({
      where: {
        id: In(updateUserDto.roleIds),
      },
    });
    user.roles = roles;
    await this.userRepository.save(user);
    return {
      message: '编辑成功',
      status: 200,
      data: {
        id: id,
      },
    };
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      relations: {
        roles: true,
      },
      where: {
        id,
      },
    });
    user.roles = [];
    await this.userRepository.save(user);
    await this.userRepository.delete(id);
    return {
      message: '删除成功',
      status: 200,
    };
  }

  async multiRemove(ids: []) {
    const users = await this.userRepository.find({
      relations: {
        roles: true,
      },
      where: {
        id: In(ids),
      },
    });
    users.forEach((user) => {
      user.roles = [];
    });
    await this.userRepository.save(users);
    await this.userRepository.delete(ids);
    return {
      message: '删除成功',
      status: 200,
    };
  }
}
