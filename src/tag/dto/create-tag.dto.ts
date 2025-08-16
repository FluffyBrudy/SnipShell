import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagsDto {
  @ApiProperty({
    description: 'Array of tag names to create',
    example: ['git', 'version-control', 'work-project'],
    type: [String],
    minLength: 3,
    maxLength: 50,
    pattern: '[a-z]+(?:-[a-z0-9]+)*'
  })
  @IsString({ each: true })
  @Length(3, 50)
  @Matches(/[a-z]+(?:-[a-z0-9]+)*/, { each: true })
  tags: string[];
}
