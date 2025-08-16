import { ApiProperty } from '@nestjs/swagger';

export class TagResponseDto {
  @ApiProperty({
    description: 'Tag ID',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Tag name',
    example: 'git'
  })
  name: string;
}

export class UserCommandResponseDto {
  @ApiProperty({
    description: 'User command ID',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Command ID',
    example: 1
  })
  commandId: number;

  @ApiProperty({
    description: 'User ID',
    example: 1
  })
  userId: number;

  @ApiProperty({
    description: 'Command arguments',
    example: 'commit -m "Initial commit"'
  })
  arguments: string;

  @ApiProperty({
    description: 'Additional notes about the command',
    example: { description: 'Git commit with message', usage: 'Use for initial commits' }
  })
  note: object;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00.000Z'
  })
  createdAt: Date | null;

  @ApiProperty({
    description: 'Associated tags',
    type: [TagResponseDto]
  })
  tags: TagResponseDto[];
}

export class UserCommandsResponseDto {
  @ApiProperty({
    description: 'Array of user commands',
    type: [UserCommandResponseDto]
  })
  commands: UserCommandResponseDto[];
}
