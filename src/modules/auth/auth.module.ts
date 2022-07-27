import { Module } from '@nestjs/common';
import { UsersService } from './../users/services/users.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],

  providers: [AuthService, UsersService],
})
export class AuthModule {}
