import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { UsercommandService } from './usercommand.service';
import { CreateUsercommandDto } from './dto/create-usercommand.dto';
import { type Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import {
  FindUserCommandByUserDto,
  SearchUsercommanDto,
} from './dto/search-usercommand.dto';

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

  @Get()
  async fetchByUser(
    @Req() request: Request,
    @Query() findUserCommandByUserDto: FindUserCommandByUserDto,
  ) {
    const user = request.user as unknown as { id: User['id']; email: string };
    const { page, order } = findUserCommandByUserDto;
    const commands = await this.userCommandService.findManyByUser(
      user.id,
      page || 1,
      order || 'DESC',
    );

    return { commands };
  }

  @Get('search')
  async search(
    @Req() request: Request,
    @Query() searchUsercommanDto: SearchUsercommanDto,
  ) {
    const user = request.user as unknown as { id: User['id']; email: string };

    const commands = await this.userCommandService.findMany(
      user.id,
      searchUsercommanDto.args,
    );
    return commands;
  }
}
