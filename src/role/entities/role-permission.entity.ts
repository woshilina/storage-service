import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleId: number;

  @Column()
  permissionId: number;
}
