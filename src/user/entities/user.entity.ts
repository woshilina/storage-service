import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { BcryptService } from '../../common/bcryptjs';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  nickname: string; //昵称

  @Column({ nullable: true })
  avatar: string; //头像

  @Column({ nullable: true })
  email: string; //邮箱

  @Column({ nullable: true })
  role: string; //角色

  @Column({ nullable: true })
  salt: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;

  @BeforeInsert()
  async encryptPwd() {
    this.password = await BcryptService.hash(this.password);
  }
}
