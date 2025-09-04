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
  ParseIntPipe,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/give-rating')
  async giveRating(
    @Param('id', ParseIntPipe) storeId: number,
    @Req() req,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    const data = await this.ratingsService.upsert(
      req.user.userId,
      storeId,
      createRatingDto,
    );
    return { message: 'Rating has been given to store.', data };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-rating')
  update(
    @Param('id', ParseIntPipe) storeId: number,
    @Req() req,
    @Body() updateRatingDto: CreateRatingDto,
  ) {
    const data = this.ratingsService.upsert(
      req.user.userId,
      storeId,
      updateRatingDto,
    );
    return { message: 'Rating has been updated to store.', data };
  }

  @Get('get-all-ratings')
  async findAll() {
    const data = await this.ratingsService.findAll();
    return { message: 'Retrieved all ratings successfully!', data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-rating/:id')
  async findOne(@Req() req) {
    const data = await this.ratingsService.findOne(req.user.userId);
    return {
      message: `Retrieved the rating with ${req.user.userId} successfully!`,
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@Req() req) {
    const data = await this.ratingsService.remove(req.user.userId);
    return {
      message: `Deleted the rating with ${req.user.userId} successfully!`,
      data,
    };
  }

  //  get ratings given by a user
  @UseGuards(JwtAuthGuard)
  @Get('get-ratings-by-user')
  async getRatingsByUser(@Req() req) {
    const ratingsData = await this.ratingsService.getRatingsByUser(
      req.user.userId,
    );
    return {
      message: `Retrieved all rating by user with ${req.user.userId} id successfully!`,
      ratingsData,
    };
  }

  @Get('get-ratings-for-store/:id')
  async getRatingsForStore(@Param('id', ParseIntPipe) storeId: number) {
    const ratingsData = await this.ratingsService.getRatingsForStore(storeId);
    return {
      message: `Retrieved all rating for store with ${storeId} id successfully!`,
      ratingsData,
    };
  }
}
