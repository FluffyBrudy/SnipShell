import { ApiProperty } from '@nestjs/swagger';

export class CommandResponseDto {
  @ApiProperty({
    description: 'Command ID',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Command name',
    example: 'git'
  })
  command: string;
}

export class CommandsResponseDto {
  @ApiProperty({
    description: 'Array of commands',
    type: [CommandResponseDto]
  })
  commands: CommandResponseDto[];
}
