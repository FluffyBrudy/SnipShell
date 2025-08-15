import { Body, Controller, Post, Req } from '@nestjs/common';
import { UsercommandService } from './usercommand.service';
import { CreateUsercommandDto } from './dto/create-usercommand.dto';
import { type Request } from 'express';
import { User } from 'src/user/entities/user.entity';

@Controller('usercommand')
export class UsercommandController {
  constructor(private readonly userCommandService: UsercommandService) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() createUserCommandDto: CreateUsercommandDto,
  ) {
    const user = request.user as unknown as { id: User['id']; email: string };
    const userCommand = await this.userCommandService.create(
      user.id,
      createUserCommandDto,
    );
    const note = JSON.parse(userCommand.note || '{}') as Record<string, string>;
    return { ...userCommand, note: note };
  }
}
