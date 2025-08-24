import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AdminModule } from 'src/admin/admin.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [AdminModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
