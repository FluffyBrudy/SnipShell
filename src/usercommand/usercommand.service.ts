import { Injectable } from '@nestjs/common';
import { UserCommand } from './entities/usercommand.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsercommandDto } from './dto/create-usercommand.dto';
import { TagService } from 'src/tag/tag.service';
import { CommandService } from 'src/command/command.service';

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
}
