import { PartialType } from '@nestjs/mapped-types';
import { CreateUsercommandDto } from './create-usercommand.dto';

import { AtLeastOneField } from './validator/oneof.validator';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { UserCommand } from '../entities/usercommand.entity';

@AtLeastOneField([])
export class UpdateUserCommandDto extends PartialType(CreateUsercommandDto) {}

