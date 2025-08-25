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

  @Post('give-rating')
  async giveRating(@Req() req, @Body() createRatingDto: CreateRatingDto) {
    console.log(req.user.userId);
    const data = await this.ratingsService.upsert(
      req.user.userId,
      createRatingDto,
    );
    return { message: 'Rating has been given to store.', data };
  }

  @Patch('update-rating')
  update(@Req() req, @Body() updateRatingDto: CreateRatingDto) {
    const data = this.ratingsService.upsert(req.user.userId, updateRatingDto);
    return { message: 'Rating has been updated to store.', data };
  }

  @Get('get-all-ratings')
  async findAll() {
    const data = await this.ratingsService.findAll();
    return { message: 'Retrieved all ratings successfully!', data };
  }

  @Get('get-rating/:id')
  async findOne(@Req() req) {
    const data = await this.ratingsService.findOne(req.user.userId);
    return {
      message: `Retrieved the rating with ${req.user.userId} successfully!`,
      data,
    };
  }

  @Delete()
  async remove(@Req() req) {
    const data = await this.ratingsService.remove(req.user.userId);
    return {
      message: `Deleted the rating with ${req.user.userId} successfully!`,
      data,
    };
  }
}
