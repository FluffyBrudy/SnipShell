import { Controller, Get, Query } from '@nestjs/common';
import { CommandService } from './command.service';
import { SearchCommandDto } from './dto/search-command.dto';

@Controller('command')
export class CommandController {
  constructor(private readonly commandService: CommandService) {}

  @Get('/search')
  async searchMany(@Query() searchCommandDto: SearchCommandDto) {
    const commands = await this.commandService.searchMany(
      searchCommandDto.command,
    );
    return commands;
  }
}
