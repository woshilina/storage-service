import { IsString, IsInt } from 'class-validator';
class CreateMenuDto {
  @IsInt()
  parentId: number;
  @IsString()
  name: string; //名称
  @IsString()
  url: string; // 路由
  @IsString()
  type: string; // 类型
  icon: string; //  图标
  @IsInt()
  orderNum: number; // 排序
}

class UpdateMenuDto {
  @IsInt()
  parentId: number;
  @IsString()
  name: string; //名称
  @IsString()
  url: string; // 路由
  @IsString()
  type: string; // 类型
  icon: string; //  图标
  @IsInt()
  orderNum: number; // 排序
}

export { CreateMenuDto, UpdateMenuDto };
