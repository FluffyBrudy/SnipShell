import { IsLowercase, IsObject, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsercommandDto {
  @ApiProperty({
    description: 'Command name (lowercase, no special symbols)',
    example: 'git',
    pattern: '^[a-z]+\\d*[a-z0-9]*$',
  })
  @IsString()
  @IsLowercase()
  @Matches(/^[a-z]+\d*[a-z0-9]*/, {
    message: 'command must not contain any extra symbol',
  })
  command: string;

  @ApiProperty({
    description: 'Command arguments',
    example: 'commit -m "Initial commit"',
  })
  @IsString()
  arguments: string;

  @ApiProperty({
    description: 'Additional notes about the command',
    example: {
      description: 'Git commit with message',
      usage: 'Use for initial commits',
    },
    type: 'object',
    additionalProperties: true,
  })
  @IsObject()
  note: object;

  @ApiProperty({
    description: 'Tags for organizing the command',
    example: ['git', 'version-control', 'commit'],
    type: [String],
    pattern: '^[a-z]+(?:-[a-z0-9]+)*$',
  })
  @IsString({ each: true })
  @Matches(/^[a-z]+(?:-[a-z0-9]+)*$/, {
    each: true,
    message:
      'Each tag must be lowercase, start with a letter, and only contain letters, numbers, or hyphens (e.g. "work-project").',
  })
  tags: string[];
}
