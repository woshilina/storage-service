import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Personnel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; //姓名

  @Column()
  sex: string; //性别

  @Column()
  age: number; // 年龄

  @Column({ nullable: true })
  IDNo: string; //身份证号码

  @Column({ nullable: true })
  avatar: string; //头像

  @Column({ nullable: true })
  email: string; //邮箱
}
