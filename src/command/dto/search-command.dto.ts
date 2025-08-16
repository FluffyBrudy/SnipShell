import { IsString, Length } from 'class-validator';

export class SearchCommandDto {
  @IsString()
  @Length(1, 50)
  command: string;
}
