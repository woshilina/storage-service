import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BcryptService } from '../common/bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { username } = createUserDto;
    const existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existUser) {
      throw new HttpException('用户已存在', HttpStatus.UNAUTHORIZED);
    }
    try {
      // const newUser = await this.userRepository.create({
      //   username: createUserDto.username,
      //   password: createUserDto.password,
      // } as User);
      const entity = Object.assign(new User(), createUserDto);
      await this.userRepository.save(entity);
      return {
        message: '注册成功',
        status: 200,
      };
      // throw new HttpException('注册成功', 200);
      // return await this.userRepository.save({
      //   username: entity.username,
      //   password: entity.password,
      // } as User);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async login(loginData: CreateUserDto) {
    const { username, password } = loginData;
    const existUser = await this.userRepository.findOne({
      where: { username },
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

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
