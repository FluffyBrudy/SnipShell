import { Controller, Get, Query } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery, 
  ApiBadRequestResponse 
} from '@nestjs/swagger';
import { CommandService } from './command.service';
import { SearchCommandDto } from './dto/search-command.dto';
import { CommandsResponseDto } from './dto/command-response.dto';

@ApiTags('commands')
@Controller('command')
export class CommandController {
  constructor(private readonly commandService: CommandService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Search commands',
    description: 'Search for system commands by name'
  })
  @ApiQuery({ name: 'command', description: 'Command name to search for', example: 'git' })
  @ApiResponse({ 
    status: 200, 
    description: 'Commands found successfully',
    type: CommandsResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid search query',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['command should not be empty'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  async fetchMany(@Query() searchCommandDto: SearchCommandDto) {
    const commands = await this.commandService.findMany(
      searchCommandDto.command,
    );
    return commands;
  }
}
