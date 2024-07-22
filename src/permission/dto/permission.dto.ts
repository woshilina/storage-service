import { IsString, IsInt } from 'class-validator';
export class CreatePermissionDto {
  // @IsInt()
  parentId: number;

  @IsString()
  name: string; //名称

  @IsString()
  url: string; // 路由

  @IsString()
  code: string; // 编码

  @IsString()
  type: string; // 类型

  icon: string; //  图标

  @IsInt()
  orderNum: number; // 排序
}
import { PartialType } from '@nestjs/mapped-types';
export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
