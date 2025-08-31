import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(3, 60)
  @IsNotEmpty({ message: 'Name is required' })
  name: string; // Name: min 20, max 60
  @IsEmail() @IsNotEmpty({ message: 'Email is required' }) email: string;
  @IsString() @MaxLength(400) address: string;
  @IsString()
  // @Matches(/^(?=.*[A-Z])(?=.*[\W_])[A-Za-z\d\W_]{8,16}$/, {
  //   // 8-16, >=1 uppercase & special
  //   message:
  //     'Password must be 8-16 characters, include 1 uppercase & 1 special character',
  // })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
