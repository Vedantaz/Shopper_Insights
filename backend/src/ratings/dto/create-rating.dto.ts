import { IsNumber } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  value: number;
}
