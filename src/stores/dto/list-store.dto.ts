import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ListStoresDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  pageSize?: number = 10;
}
