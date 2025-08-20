import { PartialType } from '@nestjs/mapped-types';
import { CreateUsercommandDto } from './create-usercommand.dto';
import { UserCommand } from '../entities/usercommand.entity';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AtLeastOneField } from './validator/oneof.validator';

@AtLeastOneField(['id'])
export class UpdateUserCommandDto extends PartialType(CreateUsercommandDto) {
  @Type(() => Number)
  @IsNumber()
  id: UserCommand['id'];
}
