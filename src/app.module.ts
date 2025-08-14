import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { UsercommandTagModule } from './usercommand-tag/usercommand-tag.module';
import { CommandModule } from './command/command.module';
import { UsercommandModule } from './usercommand/usercommand.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [AuthModule, UserModule, TagModule, CommandModule, UsercommandModule, UsercommandTagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
