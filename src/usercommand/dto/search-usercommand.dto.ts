import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class SearchUsercommanDto {
  @IsString()
  args: string;
}

export class FindUserCommandByUserDto {
  @IsOptional()
  @IsNumber()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsString()
  @Matches(/ASC|DESC/i, { message: 'sort order can be one of ASC and DESC' })
  sortOrder?: 'ASC' | 'DESC';
}
