import { Module } from '@nestjs/common';
import { UsercommandService } from './usercommand.service';
import { UsercommandController } from './usercommand.controller';

@Module({
  controllers: [UsercommandController],
  providers: [UsercommandService],
})
export class UsercommandModule {}
