import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsercommandService } from './usercommand.service';
import { UserCommand } from './entities/usercommand.entity';
import { TagModule } from '../tag/tag.module';
import { CommandModule } from '../command/command.module';
import { UsercommandController } from './usercommand.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserCommand]), TagModule, CommandModule],
  controllers: [UsercommandController],
  providers: [UsercommandService],
})
export class UsercommandModule {}
