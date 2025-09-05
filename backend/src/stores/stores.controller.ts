import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles, ROLES_KEY } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { Role } from 'src/common/role.enum';

UseGuards(JwtAuthGuard);
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('list-users')
  async list(@Query() dto: ListUsersDto) {
    return this.storesService.list(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Get('/owner/ratings')
  ownerRatings(@Req() req) {
    return this.storesService.ownerRatings(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Post('/create')
  async create(@Body() createStoreDto: CreateStoreDto, @Req() req) {
    const data = await this.storesService.create(
      createStoreDto,
      req.user.userId,
    );
    return { message: 'Store created successfully', data };
  }

  @Get('/get-all-stores')
  async findAll() {
    const data = await this.storesService.findAll();
    return { message: 'Retrieved all stores successfully!', data };
  }

  @Get('/:id/get-owner-stores')
  async getOwnerStores(@Param('id', ParseIntPipe) ownerId: number) {
    const data = await this.storesService.getOwnerStores(ownerId);

    return {
      message: `Retrieved all stores for specific storeId ${ownerId} successfully!`,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.storesService.findOne(+id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    const data = await this.storesService.update(+id, updateStoreDto);
    return { message: 'Store updated successfully!', data };
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    const data = await this.storesService.remove(+id);
    return { message: 'Store deleted successfully!', data };
  }
}
