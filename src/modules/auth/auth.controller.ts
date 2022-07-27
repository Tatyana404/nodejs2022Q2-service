import { Controller, HttpStatus, HttpCode, Body, Post } from '@nestjs/common';
import { UsersService } from './../users/services/users.service';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { UserResponse } from '../../types/users.interface';
import { AuthService } from './services/auth.service';

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
}
