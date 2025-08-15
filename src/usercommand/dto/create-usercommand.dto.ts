import { IsString, Matches } from 'class-validator';
import { Tag } from 'src/tag/entities/tag.entity';

export class CreateUsercommandDto {
  @IsString()
  command: string;

  @IsString()
  arguments: string;

  @IsString()
  note: typeof JSON.stringify;

  @IsString({ each: true })
  @Matches(/[a-z]+(?:-[a-z0-9]+)*/, { each: true })
  tags: Array<Tag['name']>;
}
