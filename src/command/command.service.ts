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
}
