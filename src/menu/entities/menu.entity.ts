import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  //   ManyToOne,
  //   OneToMany,
  //   Tree,
  //   TreeChildren,
  //   TreeParent,
  //   TreeLevelColumn,
} from 'typeorm';

@Entity()
// @Tree('closure-table')
export class Menu {
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
  icon: string; //图标

  @Column({ name: 'order_num' })
  orderNum: number; //排序

  //   @TreeChildren()
  //   children: Menu[];

  //   @TreeParent()
  //   parent: Menu;
  //   @ManyToOne((type) => Menu, (menu) => menu.childMenus)
  //   parentMenu: Menu;

  //   @OneToMany((type) => Menu, (menu) => menu.parentMenu)
  //   childMenus: Menu[];

  @Column({ nullable: true })
  create_by: string; //创建人

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ nullable: true })
  update_by: string; //更新人

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;
}
