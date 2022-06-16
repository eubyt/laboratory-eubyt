import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { HttpException, Injectable } from '@nestjs/common';
import { LoginUserDto } from '../entity/dto/user-login.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: LoginUserDto): Promise<{
    access_token: string;
  }> {
    const { displayName, password } = user;

    const userExists = await this.usersService.findDisplayName(displayName);
    if (!userExists) {
      throw new HttpException(
        {
          message: 'User not found',
          statusCode: 404,
          error: 'Not Found',
        },
        404,
      );
    }

    const isPasswordValid = await argon2.verify(userExists.password, password);
    if (!isPasswordValid) {
      throw new HttpException(
        {
          message: 'Password is invalid',
          statusCode: 401,
          error: 'Unauthorized',
        },
        401,
      );
    }

    const payload = { displayName: userExists.displayName, sub: userExists.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
