import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../entity/dto/create-user.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { LoginUserDto } from '../entity/dto/user-login.dto';
import { AuthService } from '../service/auth.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async create(@Body() user: CreateUserDto) {
    return await this.usersService.create(user);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('login')
  async login(@Body() user: LoginUserDto) {
    return await this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  helloWorld(@Request() req) {
    return {
      message: 'Hello World',
      user: req.user,
    };
  }
}
