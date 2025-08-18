import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsercommandService } from './usercommand.service';
import { CreateUsercommandDto } from './dto/create-usercommand.dto';
import {
  UserCommandResponseDto,
  UserCommandsResponseDto,
} from './dto/usercommand-response.dto';
import { type Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { SearchUsercommanDto } from './dto/search-usercommand.dto';
import { FindUserCommandByUserDto } from './dto/find-usercommand-by-user.dto';

@ApiTags('usercommands')
@ApiBearerAuth()
@Controller('usercommand')
export class UsercommandController {
  constructor(private readonly userCommandService: UsercommandService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user command',
    description:
      'Creates a new command snippet with tags and notes for the authenticated user',
  })
  @ApiBody({ type: CreateUsercommandDto })
  @ApiResponse({
    status: 201,
    description: 'User command created successfully',
    type: UserCommandResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['command should not be empty'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Get user commands with pagination',
    description:
      'Retrieves paginated list of user commands for the authenticated user',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'order',
    description: 'Sort order',
    example: 'DESC',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @ApiResponse({
    status: 200,
    description: 'User commands retrieved successfully',
    type: UserCommandsResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['page must be a positive integer'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Search user commands',
    description: 'Search for user commands by arguments',
  })
  @ApiQuery({
    name: 'args',
    description: 'Search arguments',
    example: 'git commit',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
    type: UserCommandsResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid search query',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['args should not be empty'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
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
