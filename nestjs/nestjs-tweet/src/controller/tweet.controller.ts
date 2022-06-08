import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { TweetDto } from 'src/entity/dto/tweet.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { TweetService } from 'src/service/tweet.service';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() tweet: TweetDto, @Request() req) {
    return await this.tweetService.create(req.user.userId, tweet);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return await this.tweetService.findAll();
  }
}
