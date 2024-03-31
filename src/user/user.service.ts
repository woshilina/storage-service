import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { Console } from 'console';
import { HttpException, HttpStatus } from '@nestjs/common';

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
      return {
        message: '用户已存在',
        code: '10003',
      };
    }
    try {
      // const newUser = await this.userRepository.create({
      //   username: createUserDto.username,
      //   password: createUserDto.password,
      // } as User);
      return await this.userRepository.save({
        username: createUserDto.username,
        password: createUserDto.password,
      } as User);
    } catch (error) {
      console.log('error', error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    return await this.userRepository.find();
    // return `This action returns all user`;
  }

  login(loginData: CreateUserDto) {
    console.log(loginData);
    return `登录成功`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
