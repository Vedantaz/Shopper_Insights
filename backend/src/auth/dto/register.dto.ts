import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/role.enum';

export class RegisterDto {
  @IsString()
  @Length(3, 60)
  @IsNotEmpty({ message: 'Name is required' })
  name: string; // Name: min 20, max 60

  @IsEmail() @IsNotEmpty({ message: 'Email is required' }) email: string;
  @IsString() @MaxLength(400) address: string;
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Role must be written' })
  role: Role;
}
