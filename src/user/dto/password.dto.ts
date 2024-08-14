import { IsString } from 'class-validator';
// import { Match } from '../../common/decorator/match.decorator';
export class PasswordDto {
  // @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;

  // @IsString()
  // @Match('newPassword')
  confirmPassword: string;
}
