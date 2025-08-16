import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchCommandDto {
  @ApiProperty({
    description: 'Command name to search for',
    example: 'git',
    minLength: 1,
    maxLength: 50
  })
  @IsString()
  @Length(1, 50)
  command: string;
}
