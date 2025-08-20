import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserCommand } from './entities/usercommand.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsercommandDto } from './dto/create-usercommand.dto';
import { TagService } from 'src/tag/tag.service';
import { CommandService } from 'src/command/command.service';
import { User } from 'src/user/entities/user.entity';
import { UpdateUserCommandDto } from './dto/update-usercommand.dto';

@Injectable()
export class UsercommandService {
  private readonly logger = new Logger(UsercommandService.name);

  constructor(
    @InjectRepository(UserCommand)
    private readonly userCommandRepository: Repository<UserCommand>,
    private readonly tagService: TagService,
    private readonly commandService: CommandService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: UserCommand['userId'],
    createUserCommandDto: CreateUsercommandDto,
  ) {
    const [tags, command] = await Promise.all([
      this.tagService.createMultiple(createUserCommandDto.tags),
      this.commandService.findOrCreate(createUserCommandDto.command),
    ]);
    /* 
    remainder: 
      transaction ommitted because even if either of tags and command
      is omitted it will have no effect at all and those created 
      tags and command can persist because they are foreign key referenced
      by user_command table
    */
    const usercommand = this.userCommandRepository.create({
      userId: userId,
      command: command,
      tags: tags,
      note: JSON.stringify(createUserCommandDto.note),
      arguments: command.command + ' ' + createUserCommandDto.arguments,
    });
    return await this.userCommandRepository.save(usercommand);
  }

  async findMany(userId: User['id'], commandArg: string) {
    const userCommands = await this.userCommandRepository
      .createQueryBuilder('uc')
      .select()
      .addSelect(`similarity(uc.arguments, :search)`, 'similarity')
      .leftJoinAndSelect('uc.tags', 'tags')
      .leftJoinAndSelect('uc.command', 'command')
      .where('uc.arguments ILIKE :prefix')
      .orWhere(`similarity(uc.arguments, :search) > 0.3`)
      .andWhere(`uc.user_id=:userId`)
      .setParameters({
        prefix: commandArg + '%',
        search: commandArg,
        userId: userId,
      })
      .getMany();
    return userCommands;
  }

  async findManyByUser(
    userId: User['id'],
    page: number = 1,
    sortOrder: 'ASC' | 'DESC' | 'asc' | 'desc' = 'DESC',
  ) {
    const pageSize: number = 50;
    const skip = (page - 1) * pageSize;

    const [userCommands, total] = await this.userCommandRepository.findAndCount(
      {
        where: { userId },
        relations: {
          command: true,
          tags: true,
        },
        take: pageSize,
        skip,
        order: { createdAt: sortOrder, id: sortOrder },
      },
    );
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: userCommands,
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async delete_(id: UserCommand['id']) {
    return await this.userCommandRepository.delete({ id });
  }

  async update(userId: User['id'], data: UpdateUserCommandDto) {
    const userCommand = await this.userCommandRepository.findOne({
      where: { id: data.id, userId },
      relations: ['tags'],
    });

    if (!userCommand) throw new NotFoundException('User command not found');

    return await this.dataSource.transaction(async (manager) => {
      if (data.tags) {
        const incomingNames = new Set(data.tags);
        const currentNames = new Set(userCommand.tags.map((t) => t.name));

        const toRemove = userCommand.tags.filter(
          (t) => !incomingNames.has(t.name),
        );
        const toAddNames = [...incomingNames].filter(
          (name) => !currentNames.has(name),
        );
        const toAdd = await this.tagService.createMultiple(toAddNames);

        if (toRemove.length) {
          await manager.query(
            `DELETE FROM public.user_commands_tags 
           WHERE user_command_id = $1 AND tag_id = ANY($2::int[])`,
            [userCommand.id, toRemove.map((t) => t.id)],
          );
        }

        if (toAdd.length) {
          await manager.query(
            `INSERT INTO public.user_commands_tags (user_command_id, tag_id)
           SELECT $1, unnest($2::int[])`,
            [userCommand.id, toAdd.map((t) => t.id)],
          );
        }

        userCommand.tags = userCommand.tags
          .filter((t) => !toRemove.includes(t))
          .concat(toAdd);
      }

      if (data.command) {
        const commandEntity = await this.commandService.findOrCreate(
          data.command,
        );
        userCommand.command = commandEntity;
      }

      if (data.arguments) {
        userCommand.arguments = data.arguments;
      }

      if (data.note) {
        userCommand.note = JSON.stringify({
          ...JSON.parse(userCommand.note || '{}'),
          ...data.note,
        });
      }

      return await manager.save(userCommand);
    });
  }
}
