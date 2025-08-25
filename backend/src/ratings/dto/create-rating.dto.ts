import { IsNumber } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  storeId: number;

  @IsNumber()
  value: number;
}
