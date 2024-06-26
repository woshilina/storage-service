class CreateGoodsDto {
  name: string;
  specification: string; // 规格
  quantity: number; // 数量
  weight: string; // 重量
  remark: string; // 备注
}

class UpdateGoodsDto {
  name: string;
  specification: string; // 规格
  quantity: number; // 数量
  weight: string; // 重量
  remark: string; // 备注
}

export { CreateGoodsDto, UpdateGoodsDto };
