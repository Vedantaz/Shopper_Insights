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
import { ListStoresDto } from 'src/stores/dto/list-store.dto';

// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private storeService: StoresService,
  ) {}

  @Get('dashboard')
  async dashboard() {
    const data = await this.adminService.dashboard();
    return { message: 'Data received successfully on dashboard', data };
  }

  @Post('owners-admin-signup')
  async signUpUser(@Body() body: CreateUserDto, ownerStore?: OwnerStoreDto) {
    const { user, store } = await this.adminService.signUpUser(body);
    let message = 'User signup successfully!';
    if (user.role === 'OWNER') {
      message = store
        ? 'Owner and store created successfully!'
        : 'Owner created successfully, but store was not provided.';
    }
    return { message, data: { user, store } };
  }

  @Get('list-users')
  async listUsers(@Query() q: ListUsersDto) {
    const data = await this.storeService.list(q);
    return { message: 'Listing all users.', data };
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.adminService.getUser(+id);
  }

  @Get('get-stores')
  listStores(@Query() query: ListStoresDto) {
    return this.adminService.listStores(query);
  }
}
