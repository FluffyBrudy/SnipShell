import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Command } from './entities/command.entity';

@Injectable()
export class CommandService {
  constructor(
    @InjectRepository(Command)
    private readonly comandRepository: Repository<Command>,
  ) {}

  async findOrCreate(command: string) {
    const existingCommand = await this.comandRepository.findOneBy({ command });
    if (!existingCommand) {
      const newCommand = this.comandRepository.create({ command });
      return await this.comandRepository.save(newCommand);
    } else {
      return existingCommand;
    }
  }

  async findMany(command: Command['command']) {
    const commands = await this.comandRepository
      .createQueryBuilder('c')
      .select('c.command')
      .addSelect(`similarity(c.command, :search)`, 'similarity')
      .where(`similarity(c.command, :search) > 0.3`)
      .setParameter('search', command)
      .getRawMany<{ similarity: number; command: string }>();
    return commands;
  }
}
