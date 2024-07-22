import {
  IsString,
  IsNotEmpty,
  // IsOptional,
  // IsEmail,
  ArrayNotEmpty,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  account: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  name: string;

  // @IsOptional()
  // @IsEmail()
  email: string;

  @ArrayNotEmpty()
  roleIds: number[];
}
