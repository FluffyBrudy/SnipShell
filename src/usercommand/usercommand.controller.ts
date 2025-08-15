import { Body, Controller, Post } from '@nestjs/common';
import { UsercommandService } from './usercommand.service';
import { CreateUsercommandDto } from './dto/create-usercommand.dto';

@Controller('usercommand')
export class UsercommandController {
  constructor(private readonly userCommandService: UsercommandService) {}

  @Post()
  async create(@Body() createUserCommandDto: CreateUsercommandDto) {
    const userCommand =
      await this.userCommandService.create(createUserCommandDto);
    return { userCommand };
  }
}
