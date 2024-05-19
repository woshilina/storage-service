import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BcryptService } from '../../common/bcryptjs';
import { Role } from 'src/role/entities/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account: string;

  @Column()
  password: string;

  @Column()
  name: string; //姓名

  @Column({ nullable: true })
  email: string; //邮箱

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;

  @BeforeInsert()
  async encryptPwd() {
    this.password = await BcryptService.hash(this.password);
  }
  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
