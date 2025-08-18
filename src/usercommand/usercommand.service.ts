import { Injectable } from '@nestjs/common';
import { UserCommand } from './entities/usercommand.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsercommandDto } from './dto/create-usercommand.dto';
import { TagService } from 'src/tag/tag.service';
import { CommandService } from 'src/command/command.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UsercommandService {
  constructor(
    @InjectRepository(UserCommand)
    private readonly userCommandRepository: Repository<UserCommand>,
    private readonly tagService: TagService,
    private readonly commandService: CommandService,
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
      arguments: createUserCommandDto.arguments,
    });
    return await this.userCommandRepository.save(usercommand);
  }

  async findMany(userId: User['id'], commandArg: UserCommand['arguments']) {
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
}
