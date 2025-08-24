import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}
  create(createRatingDto: CreateRatingDto) {
    return 'This action adds a new rating';
  }

  upsert(userId: number, data: CreateRatingDto) {
    if (data.value < 1 || data.value > 5)
      throw new BadRequestException('Rating must be 1-5');
    return this.prisma.rating.upsert({
      where: { userId_storeId: { userId, storeId: data.storeId } },
      update: { value: data.value },
      create: { userId, storeId: data.storeId, value: data.value },
      select: { id: true, value: true, storeId: true, userId: true },
    });
  }

  findAll() {
    return `This action returns all ratings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rating`;
  }

  update(id: number, updateRatingDto: UpdateRatingDto) {
    return `This action updates a #${id} rating`;
  }

  remove(id: number) {
    return `This action removes a #${id} rating`;
  }
}
