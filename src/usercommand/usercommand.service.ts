import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCommand } from './entities/usercommand.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsercommandDto } from './dto/create-usercommand.dto';
import { TagService } from 'src/tag/tag.service';
import { CommandService } from 'src/command/command.service';
import { User } from 'src/user/entities/user.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Command } from 'src/command/entities/command.entity';

@Injectable()
export class UsercommandService {
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

  async update(data: {
    tags: Tag[];
    id: UserCommand['id'];
    commad: Command;
    arguments: UserCommand['arguments'];
    note: Record<string, string>;
  }) {
    const userCommand = await this.userCommandRepository.findOne({
      where: { id: data.id },
      relations: ['tags'],
    });
    if (!userCommand) throw new NotFoundException('User command not found');

    await this.dataSource.transaction(async (manager) => {
      await this.syncTags(userCommand, data.tags, manager);

      const commandEntity = await this.commandService.findOrCreate(
        data.commad['command'],
      );
      userCommand.command = commandEntity;
      userCommand.arguments = data.arguments;
      userCommand.note = JSON.stringify(data.note);

      await manager.save(userCommand);
    });
  }

  private async syncTags(
    userCommand: UserCommand,
    incomingTags: Tag[],
    manager: EntityManager,
  ) {
    const existingIds = incomingTags.filter((t) => t.id).map((t) => t.id);
    const newNames = incomingTags.filter((t) => !t.id).map((t) => t.name);

    const existingTags = existingIds.length
      ? await this.tagService.findManyByIds(existingIds)
      : [];
    const newTags = newNames.length
      ? await this.tagService.createMultiple(newNames)
      : [];

    const desiredTags = [...existingTags, ...newTags];

    const desiredIds = new Set(desiredTags.map((t) => t.id));
    const toRemove = userCommand.tags.filter((t) => !desiredIds.has(t.id));

    const currentIds = new Set(userCommand.tags.map((t) => t.id));
    const toAdd = desiredTags.filter((t) => !currentIds.has(t.id));

    if (toRemove.length > 0) {
      await manager
        .createQueryBuilder()
        .relation(UserCommand, 'tags')
        .of(userCommand.id)
        .remove(toRemove);
    }

    if (toAdd.length > 0) {
      await manager
        .createQueryBuilder()
        .relation(UserCommand, 'tags')
        .of(userCommand.id)
        .add(toAdd);
    }
  }
}
