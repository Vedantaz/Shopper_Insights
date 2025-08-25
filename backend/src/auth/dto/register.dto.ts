import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString() @Length(20, 60) name: string; // Name: min 20, max 60
  @IsEmail() email: string;
  @IsString() @MaxLength(400) address: string;
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[\W_])[A-Za-z\d\W_]{8,16}$/, {
    // 8-16, >=1 uppercase & special
    message:
      'Password must be 8-16 chars, include 1 uppercase & 1 special char',
  })
  password: string;
}
