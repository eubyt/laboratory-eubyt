import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../entity/dto/create-user.dto';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Tweet } from 'src/entity/tweet.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const { displayName, password } = user;

    // Verificar se o usuário já existe no banco de dados
    const displayNameExists = await this.findDisplayName(displayName);
    if (displayNameExists) {
      throw new HttpException(
        {
          message: 'Display name already exists',
          statusCode: 409,
          error: 'Conflict',
        },
        409,
      );
    }

    // Invocar os BeforeInsert
    const userEntity = new User();
    userEntity.displayName = displayName;
    userEntity.password = password;
    userEntity.tweets = [];

    return await this.usersRepository.save(userEntity);
  }

  async findDisplayName(displayName: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { displayName },
      relations: ['tweets'],
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['tweets'],
    });
  }

  async addTweet(userId: number | User, tweet: Tweet) {
    const user = userId instanceof User ? userId : await this.findOne(userId);

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
    if (user.tweets === undefined) {
      console.log('user.tweets is undefined');
      user.tweets = [];
    }
    user.tweets.push(tweet);
    await this.usersRepository.save(user);
    return true;
  }
}
