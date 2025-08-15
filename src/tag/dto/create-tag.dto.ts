import { IsNumberString, IsString, Length } from 'class-validator';
import { Tag } from '../entities/tag.entity';

export class CreateTagDto {
  @IsNumberString()
  id: Tag['id'];

  @IsString()
  @Length(3, 50)
  name: string;
}
