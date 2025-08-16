import { ApiProperty } from '@nestjs/swagger';

export class CreateCommandDto {
  @ApiProperty({
    description: 'Command name',
    example: 'git',
    minLength: 1,
    maxLength: 20
  })
  command: string;
}
