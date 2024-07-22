import { IsString, IsNumber } from 'class-validator';
export class CreateGoodsDto {
  @IsString()
  name: string;

  @IsString()
  specification: string; // 规格

  @IsNumber()
  quantity: number; // 数量

  @IsString()
  weight: string; // 重量

  remark: string; // 备注
}

import { PartialType } from '@nestjs/mapped-types';
export class UpdateGoodsDto extends PartialType(CreateGoodsDto) {}
