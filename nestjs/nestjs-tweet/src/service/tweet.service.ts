import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from '../entity/tweet.entity';
import { Repository } from 'typeorm';
import { TweetDto } from '../entity/dto/tweet.dto';
import { UsersService } from './users.service';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    private readonly userService: UsersService,
  ) {}

  async findAll(): Promise<Tweet[]> {
    return await this.tweetRepository
      .createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.userId', 'user')
      .getMany();
  }

  async create(userId: number, { content }: TweetDto): Promise<Tweet> {
    const tweet = new Tweet();
    tweet.content = content;

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new HttpException(
        {
          message: 'User not found',
          statusCode: 404,
          error: 'Not Found',
        },
        404,
      );
    }
    const newTweet = await this.tweetRepository.save(tweet);
    await this.userService.addTweet(user, newTweet);
    return newTweet;
  }
}
