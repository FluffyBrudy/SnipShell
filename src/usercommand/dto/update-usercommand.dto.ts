import { PartialType } from '@nestjs/mapped-types';
import { CreateUsercommandDto } from './create-usercommand.dto';

export class UpdateUsercommandDto extends PartialType(CreateUsercommandDto) {}
