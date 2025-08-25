import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { StoresModule } from 'src/stores/stores.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [StoresModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
  exports: [AdminService],
})
export class AdminModule {}
