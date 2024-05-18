export class CreateRoleDto {
  name: string;
  remark: string;
  permissionIds: number[];
}
export class UpdateRoleDto {
  name: string;
  remark: string;
  permissionIds: number[];
}
