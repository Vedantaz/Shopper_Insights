import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  upsert(userId: number, storeId: number, data: CreateRatingDto) {
    if (data.value < 1 || data.value > 5)
      throw new BadRequestException('Rating must be 1-5');
    return this.prisma.rating.upsert({
      where: { userId_storeId: { userId, storeId: storeId } },
      update: { value: data.value },
      create: { userId, storeId: storeId, value: data.value },
      select: { id: true, value: true, storeId: true, userId: true },
    });
  }

  findAll() {
    return this.prisma.rating.findMany();
  }

  findOne(id: number) {
    return this.prisma.rating.findUnique({ where: { id: id } });
  }

  update(id: number, updateRatingDto: UpdateRatingDto) {
    return this.prisma.rating.update({ where: { id }, data: updateRatingDto });
  }

  remove(id: number) {
    return this.prisma.rating.delete({ where: { id: id } });
  }
}
