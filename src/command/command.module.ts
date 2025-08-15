import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Command } from './entities/command.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Command])],
  providers: [CommandService],
  exports: [CommandService],
})
export class CommandModule {}
