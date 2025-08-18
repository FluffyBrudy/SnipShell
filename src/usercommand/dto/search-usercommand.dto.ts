import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchUsercommanDto {
  @ApiProperty({
    description: 'Search arguments to find user commands',
    example: 'git commit',
  })
  @IsString()
  args: string;
}
