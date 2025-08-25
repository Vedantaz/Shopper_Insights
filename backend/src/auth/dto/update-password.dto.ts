import { IsString, Matches } from 'class-validator';
export class UpdatePasswordDto {
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[\W_])[A-Za-z\d\W_]{8,16}$/)
  newPassword: string;
}
