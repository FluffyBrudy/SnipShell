import { IsNotEmpty, IsString } from 'class-validator';

export class SearchUsercommanDto {
  @IsString()
  args: string;
}

export class SearchUsercommandByTagsDto {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags: string[];
}
