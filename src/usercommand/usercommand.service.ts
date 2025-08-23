import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserCommand } from './entities/usercommand.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsercommandDto } from './dto/create-usercommand.dto';
import { TagService } from '../tag/tag.service';
import { CommandService } from '../command/command.service';
import { User } from '../user/entities/user.entity';
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

  async delete_(userId: User['id'], id: UserCommand['id']) {
    this.logger.log({ userId, id }, 'delete');
    const userCommand = await this.userCommandRepository.findOne({
      where: {
        userId,
        id,
      },
      relations: ['tags'],
    });
    if (!userCommand) throw new NotFoundException('User command not found');

    await this.userCommandRepository
      .createQueryBuilder()
      .relation(UserCommand, 'tags')
      .of(userCommand.id)
      .remove(userCommand.tags.map((t) => t.id));

    await this.userCommandRepository.delete({ userId, id });
    return true;
  }

  async update(
    userId: User['id'],
    userCommandId: UserCommand['id'],
    data: UpdateUserCommandDto,
  ) {
    const userCommand = await this.userCommandRepository.findOne({
      where: { id: userCommandId, userId },
      relations: ['tags', 'command'],
    });

    if (!userCommand) throw new NotFoundException('User command not found');

    const res = await this.dataSource.transaction(async (manager) => {
      if (data.tags) {
        await this.syncTags(userCommand, data.tags);
      }

      if (data.command) {
        const commandEntity = await this.commandService.findOrCreate(
          data.command,
        );
        const arguments_ =
          data.arguments ||
          userCommand.arguments.replace(userCommand.command.command, '');
        userCommand.command = commandEntity;
        userCommand.arguments = commandEntity.command + arguments_;
      }
      if (data.arguments) {
        userCommand.arguments = data.arguments;
      }
      if (data.note) {
        userCommand.note = JSON.stringify({
          ...JSON.parse(userCommand.note),
          ...data.note,
        });
      }
      return await manager.save(userCommand);
    });
    return res;
  }

  private async syncTags(userCommand: UserCommand, incomingTags: string[]) {
    const incomingNames = new Set(incomingTags.map((t) => t));
    const currentNames = new Set(userCommand.tags.map((t) => t.name));

    const toRemove = userCommand.tags.filter((t) => !incomingNames.has(t.name));
    const toAddNames = [...incomingNames].filter(
      (name) => !currentNames.has(name),
    );
    const toAdd = (await this.tagService.createMultiple(toAddNames)) || [];
    const finalizedToAdd = userCommand.tags
      .filter((t) => !(toRemove ?? []).some((r) => r.id === t.id))
      .concat(toAdd);
    if (toRemove || toAdd) {
      userCommand.tags = finalizedToAdd;
    }
  }
}
