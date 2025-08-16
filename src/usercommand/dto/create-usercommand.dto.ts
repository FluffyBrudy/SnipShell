import { IsObject, IsString, Matches } from 'class-validator';

export class CreateUsercommandDto {
  @IsString()
  command: string;

  @IsString()
  arguments: string;

  @IsObject()
  note: object;

  @IsString({ each: true })
  @Matches(/^[a-z]+(?:-[a-z0-9]+)*$/, {
    each: true,
    message:
      'Each tag must be lowercase, start with a letter, and only contain letters, numbers, or hyphens (e.g. "work-project").',
  })
  tags: string[];
}
