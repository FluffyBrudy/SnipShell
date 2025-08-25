import { Transform } from 'class-transformer';
import { ArrayMinSize, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SearchUsercommanDto {
  @IsString()
  args: string;
}

export class SearchUsercommandByTagsDto {
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(String).map((v) => v.trim());
    }
    if (typeof value === 'string') {
      return [value.trim()];
    }
    return [];
  })
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Matches(/^[a-z]+\d*[a-z0-9]*/, { each: true })
  tags: string[];
}
