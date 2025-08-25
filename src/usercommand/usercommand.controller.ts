import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { type Request } from 'express';
import { UsercommandService } from './usercommand.service';
import { CreateUsercommandDto } from './dto/create-usercommand.dto';
import { User } from '../user/entities/user.entity';
import { SearchUsercommanDto } from './dto/search-usercommand.dto';
import { FindUserCommandByUserDto } from './dto/find-usercommand-by-user.dto';
import { UpdateUserCommandDto } from './dto/update-usercommand.dto';
import { UserCommand } from './entities/usercommand.entity';

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

    const commands = await this.userCommandService.searchMany(
      searchUsercommanDto.args,
      user.id,
    );
    return commands;
  }

  @HttpCode(200)
  @Put(':id')
  async update(
    @Req() request: Request,
    @Body() updateUserCommandDto: UpdateUserCommandDto,
    @Param('id') id: UserCommand['id'],
  ) {
    const { id: userId } = request.user as { id: User['id'] };
    const res = await this.userCommandService.update(
      userId,
      +id,
      updateUserCommandDto,
    );
    return res;
  }

  @HttpCode(200)
  @Delete(':id')
  async delete(@Req() request: Request, @Param('id') id: UserCommand['id']) {
    console.log(request.user);
    const { id: userId } = request.user as { id: User['id'] };
    return { success: !!(await this.userCommandService.delete_(userId, +id)) };
  }
}
