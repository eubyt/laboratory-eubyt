import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TweetController } from 'src/controller/tweet.controller';
import { Tweet } from 'src/entity/tweet.entity';
import { TweetService } from 'src/service/tweet.service';
import { UsersModule } from './users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet]), UsersModule],
  providers: [TweetService],
  controllers: [TweetController],
})
export class TweetModule {}
