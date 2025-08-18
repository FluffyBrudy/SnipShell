import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindUserCommandByUserDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  page?: number;

  @ApiProperty({
    description: 'Sort order for results',
    example: 'DESC',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  @Matches(/ASC|DESC/i, { message: 'sort order can be one of ASC and DESC' })
  order?: 'ASC' | 'DESC';
}
