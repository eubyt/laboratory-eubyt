import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigMysqlModule } from './config/mysql.module.app';
import { AuthModule } from './module/auth.module';
import { TweetModule } from './module/tweet.module';
import { UsersModule } from './module/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigMysqlModule,
    UsersModule,
    AuthModule,
    TweetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
