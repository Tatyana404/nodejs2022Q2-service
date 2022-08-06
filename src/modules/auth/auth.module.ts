import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UsersService } from './../users/services/users.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.register({})],

  controllers: [AuthController],

  providers: [AuthService, UsersService, JwtStrategy],
})
export class AuthModule {}
