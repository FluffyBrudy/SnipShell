import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Command } from './entities/command.entity';
import { CommandController } from './command.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Command])],
  providers: [CommandService],
  exports: [CommandService],
  controllers: [CommandController],
})
export class CommandModule {}
