import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Goods {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; //名称

  @Column()
  specification: string; //规格

  @Column()
  quantity: number; // 数量

  @Column({ nullable: true })
  weight: string; // 重量

  @Column({ nullable: true })
  remark: string; //备注
}
