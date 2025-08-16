import { IsString } from 'class-validator';

export class SearchUsercommanDto {
  @IsString()
  args: string;
}
