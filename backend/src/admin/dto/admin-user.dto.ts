import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from 'src/common/role.enum';

export class OwnerStoreDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role, { message: 'role must be ADMIN, USER, or OWNER' })
  role: Role;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OwnerStoreDto)
  ownerStore?: OwnerStoreDto;
}
