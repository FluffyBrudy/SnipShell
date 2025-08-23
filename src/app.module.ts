import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { CommandModule } from './command/command.module';
import { UsercommandModule } from './usercommand/usercommand.module';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { JwtAuthGuard } from './auth/guards/auth.guard';
import { Tag } from './tag/entities/tag.entity';
import { UserCommand } from './usercommand/entities/usercommand.entity';
import { Command } from './command/entities/command.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('DB_URL'),
        entities: [User, Tag, Command, UserCommand],
        synchronize: configService.getOrThrow<string>('NODE_ENV') !== 'prod',
      }),
    }),
    AuthModule,
    UserModule,
    TagModule,
    CommandModule,
    UsercommandModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
