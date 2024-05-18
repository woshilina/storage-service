import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  type: string; //  类型：0目录 1菜单 2按钮

  @Column({ nullable: true })
  code: string; // 编码

  @Column({ nullable: true })
  icon: string; //图标

  @Column({ name: 'order_num' })
  orderNum: number; //排序

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;
}
