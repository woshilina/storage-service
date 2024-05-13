class CreateMenuDto {
  name: string; //名称
  url: string; // 路由
  type: number; // 类型
  icon: string; //  图标
  orderNum: string; // 排序
}

class UpdateMenuDto {
  name: string; //名称
  url: string; // 路由
  type: number; // 类型
  icon: string; //  图标
  orderNum: string; // 排序
}

export { CreateMenuDto, UpdateMenuDto };
