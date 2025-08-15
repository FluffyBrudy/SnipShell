import { IsString, Length, Matches } from 'class-validator';

export class CreateTagsDto {
  @IsString({ each: true })
  @Length(3, 50)
  @Matches(/[a-z]+(?:-[a-z0-9]+)*/, { each: true })
  tags: string[];
}
