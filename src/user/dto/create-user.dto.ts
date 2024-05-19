export class CreateUserDto {
  account: string;
  password: string;
  name: string;
  email: string;
  roleIds: number[];
}
