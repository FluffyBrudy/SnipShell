import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsercommandService } from './usercommand.service';
import { CreateUsercommandDto } from './dto/create-usercommand.dto';
import { UpdateUsercommandDto } from './dto/update-usercommand.dto';

@Controller('usercommand')
export class UsercommandController {
  constructor(private readonly usercommandService: UsercommandService) {}

  @Post()
  create(@Body() createUsercommandDto: CreateUsercommandDto) {
    return this.usercommandService.create(createUsercommandDto);
  }

  @Get()
  findAll() {
    return this.usercommandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usercommandService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsercommandDto: UpdateUsercommandDto) {
    return this.usercommandService.update(+id, updateUsercommandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usercommandService.remove(+id);
  }
}
