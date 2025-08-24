import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/admin/dto/admin-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
