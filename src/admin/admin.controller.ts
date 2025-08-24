import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CreateUserDto, OwnerStoreDto } from './dto/admin-user.dto';
import { ListUsersDto } from 'src/stores/dto/list-users.dto';
import { StoresService } from 'src/stores/stores.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private storeService: StoresService,
  ) {}

  @Get('dashboard') dashboard() {
    return this.adminService.dashboard();
  }

  @Post('users') createUser(
    @Body() body: CreateUserDto,
    ownerStore?: OwnerStoreDto,
  ) {
    return this.adminService.createUser(body);
  }

  @Get('users')
  listUsers(@Query() q: ListUsersDto) {
    return this.storeService.list(q);
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.adminService.getUser(+id);
  }

  @Get('stores')
  listStores(@Body() userData: CreateUserDto, @Query() query: ListUsersDto) {
    return this.adminService.listStores(userData, query);
  }
}
