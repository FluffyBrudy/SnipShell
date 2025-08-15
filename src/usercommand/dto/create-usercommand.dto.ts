import { IsObject, IsString, Matches } from 'class-validator';
import { Tag } from 'src/tag/entities/tag.entity';

export class CreateUsercommandDto {
  @IsString()
  command: string;

  @IsString()
  arguments: string;

  @IsObject()
  note: object;

  @IsString({ each: true })
  @Matches(/[a-z]+(?:-[a-z0-9]+)*/, { each: true })
  tags: Array<Tag['name']>;
}
