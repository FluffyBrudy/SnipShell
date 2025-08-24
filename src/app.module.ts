import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { CommandModule } from './command/command.module';
import { UsercommandModule } from './usercommand/usercommand.module';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './auth/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('DB_URL'),
        entities: [
          __dirname + '//**/*.entity{.ts,.js}',
          process.cwd() + '/dist/**/*.entity.js',
        ],
        migrations: ['dist/migrations/*.js'],
        synchronize: configService.getOrThrow<string>('NODE_ENV') !== 'prod',
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UserModule,
    TagModule,
    CommandModule,
    UsercommandModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
