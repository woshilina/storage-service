import { Injectable } from '@nestjs/common';
import { CreateGoodsDto, UpdateGoodsDto } from './dto/goods.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Goods } from './entities/goods.entity';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Goods)
    private GoodsRepository: Repository<Goods>,
  ) {}
  async create(createGoodsDto: CreateGoodsDto) {
    const Goods = await this.GoodsRepository.save(createGoodsDto);
    return {
      message: '新增成功',
      status: 200,
      data: {
        id: Goods.id,
      },
    };
  }

  async findAll(
    currentPage: number,
    pageSize: number,
    name: string,
    specification: string,
    startQuantity: number,
    endQuantity: number,
    nameOrder: string,
    quantityOrder: string,
  ): Promise<[Goods[], number]> {
    console.log(quantityOrder);
    const skip = (currentPage - 1) * pageSize;
    return await this.GoodsRepository.createQueryBuilder('goods')
      .where(
        new Brackets((qb) => {
          if (name) {
            return qb.where('goods.name LIKE :name', {
              name: `%${name}%`,
            });
          } else {
            return qb;
          }
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (specification) {
            return qb.where('goods.specification LIKE :specification', {
              name: `%${specification}%`,
            });
          } else {
            return qb;
          }
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (startQuantity && endQuantity) {
            return qb.where(
              'goods.quantity BETWEEN :startQuantity AND :endQuantity',
              {
                startQuantity,
                endQuantity,
              },
            );
          } else if (startQuantity && !endQuantity) {
            return qb.where('goods.quantity  >= :startQuantity', {
              startQuantity,
            });
          } else if (!startQuantity && endQuantity) {
            return qb.where('goods.quantity  <= :startQuantity', {
              endQuantity,
            });
          } else {
            return qb;
          }
        }),
      )
      .orderBy(
        // 'goods.id': 'DESC',
        'goods.name',
        nameOrder && nameOrder == 'asc' ? 'ASC' : 'DESC',
      )
      .orderBy(
        'goods.quantity',
        quantityOrder && quantityOrder == 'asc' ? 'ASC' : 'DESC',
      )
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();
  }

  async getCount(): Promise<number> {
    return await this.GoodsRepository.count();
  }

  async findOne(id: number): Promise<Goods> {
    return await this.GoodsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateGoodsDto: UpdateGoodsDto) {
    const Goods = await this.GoodsRepository.findOne({
      where: {
        id,
      },
    });
    Goods.name = updateGoodsDto.name;
    Goods.specification = updateGoodsDto.specification;
    Goods.quantity = updateGoodsDto.quantity;
    Goods.weight = updateGoodsDto.weight;
    Goods.remark = updateGoodsDto.remark;
    await this.GoodsRepository.save(Goods);
    return {
      message: '编辑成功',
      status: 200,
      data: {
        id: id,
      },
    };
  }

  // async remove(id: number) {
  //   await this.GoodsRepository.delete(id);
  //   return {
  //     message: '删除成功',
  //     status: 200,
  //   };
  // }

  async multiRemove(ids: []) {
    await this.GoodsRepository.delete(ids);
    return {
      message: '删除成功',
      status: 200,
    };
  }
}
