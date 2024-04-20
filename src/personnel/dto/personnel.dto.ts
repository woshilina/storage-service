class CreatePersonnelDto {
  name: string;
  sex: string; // 性别
  age: number; // 年龄
  IDNo: string; // 身份证号码
  avatar: string; // 头像
  email: string;
}

class UpdatePersonnelDto {
  name: string;
  sex: string; // 性别
  age: number; // 年龄
  IDNo: string; // 身份证号码
  avatar: string; // 头像
  email: string;
}

export { CreatePersonnelDto, UpdatePersonnelDto };
