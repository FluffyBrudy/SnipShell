import { Controller, Get, Query } from '@nestjs/common';
import { CommandService } from './command.service';
import { SearchCommandDto } from './dto/search-command.dto';
import { CommandsResponseDto } from './dto/command-response.dto';

@Controller('command')
export class CommandController {
  constructor(private readonly commandService: CommandService) {}

  @Get()
    async fetchMany(@Query() searchCommandDto: SearchCommandDto) {
    const commands = await this.commandService.findMany(
      searchCommandDto.command,
    );
    return commands;
  }
}
