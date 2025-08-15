import { Module } from '@nestjs/common';
import { UsercommandService } from './usercommand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCommand } from './entities/usercommand.entity';
import { TagModule } from 'src/tag/tag.module';
import { CommandModule } from 'src/command/command.module';
import { UsercommandController } from './usercommand.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserCommand]), TagModule, CommandModule],
  controllers: [UsercommandController],
  providers: [UsercommandService],
})
export class UsercommandModule {}
