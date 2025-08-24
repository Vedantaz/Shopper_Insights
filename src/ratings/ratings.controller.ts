import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  create(@Req() req, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.upsert(req.user.userId, createRatingDto);
  }

  @Patch()
  update(@Req() req, @Body() updateRatingDto: CreateRatingDto) {
    return this.ratingsService.upsert(req.user.userId, updateRatingDto);
  }

  @Get()
  findAll() {
    return this.ratingsService.findAll();
  }

  @Get()
  findOne(@Req() req) {
    return this.ratingsService.findOne(req.user.userId);
  }

  @Delete()
  remove(@Req() req) {
    return this.ratingsService.remove(req.user.userId);
  }
}
