import { IsString, ArrayNotEmpty } from 'class-validator';
export class CreateRoleDto {
  @IsString()
  name: string;

  remark: string;

  @ArrayNotEmpty()
  permissionIds: number[];
}
export class UpdateRoleDto {
  @IsString()
  name: string;

  remark: string;

  @ArrayNotEmpty()
  permissionIds: number[];
}
