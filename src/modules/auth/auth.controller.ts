import {
  Controller,
  HttpStatus,
  UseGuards,
  HttpCode,
  Body,
  Post,
} from '@nestjs/common';
import { UsersService } from './../users/services/users.service';
import { Jwt, RefreshToken } from './../../types/jwt.interface';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { UserResponse } from '../../types/users.interface';
import { AuthService } from './services/auth.service';
import { JwtGward } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.usersService.createUser(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  loginUser(@Body() createUserDto: CreateUserDto): Promise<Jwt> {
    return this.authService.loginUser(createUserDto);
  }

  @UseGuards(JwtGward)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshUser(@Body() refreshToken: RefreshToken): Promise<Jwt> {
    return this.authService.refreshUser(refreshToken);
  }
}
