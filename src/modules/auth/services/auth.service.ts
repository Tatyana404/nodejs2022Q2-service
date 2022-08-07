import {
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import 'dotenv/config';
import { Jwt, Payload, RefreshToken } from './../../../types/jwt.interface';
import { PrismaService } from './../../prisma/services/prisma.service';
import { CreateUserDto } from './../../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async loginUser(createUserDto: CreateUserDto): Promise<Jwt> {
    Logger.debug(AuthService.name, 'loginUser getting started');

    if (
      !['login', 'password'].every((field: string) => field in createUserDto)
    ) {
      Logger.error(
        AuthService.name,
        `status code: ${HttpStatus.BAD_REQUEST}, error message: Body does not contain required fields`,
      );
      throw new BadRequestException('Body does not contain required fields');
    }

    const user: User = await this.prisma.user.findFirst({
      where: {
        login: createUserDto.login,
      },
    });

    if (!user || !(await argon.verify(user.password, createUserDto.password))) {
      Logger.error(
        AuthService.name,
        `status code: ${HttpStatus.FORBIDDEN}, error message: Authentication failed`,
      );
      throw new ForbiddenException('Authentication failed');
    }

    const payload: Payload = {
      userId: user.id,
      login: user.login,
    };

    Logger.debug(AuthService.name, 'loginUser completion work');
    return {
      accessToken: await this.jwt.signAsync(payload, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_KEY,
      }),
      refreshToken: await this.jwt.signAsync(payload, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      }),
    };
  }

  async refreshUser(refreshToken: RefreshToken): Promise<Jwt> {
    Logger.debug(AuthService.name, 'refreshUser getting started');

    if (
      !['refreshToken'].every((field: string) => field in refreshToken) ||
      !refreshToken.refreshToken.length
    ) {
      Logger.error(
        AuthService.name,
        `status code: ${HttpStatus.UNAUTHORIZED}, error message: Body does not contain required fields`,
      );
      throw new UnauthorizedException('Body does not contain required fields');
    }

    try {
      const verifyToken: Payload = await this.jwt.verifyAsync(
        refreshToken.refreshToken,
        {
          maxAge: process.env.TOKEN_REFRESH_EXPIRE_TIME,
          secret: process.env.JWT_SECRET_REFRESH_KEY,
        },
      );

      const payload: Payload = {
        userId: verifyToken.userId,
        login: verifyToken.login,
      };

      Logger.debug(AuthService.name, 'refreshUser completion work');
      return {
        accessToken: await this.jwt.signAsync(payload, {
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
          secret: process.env.JWT_SECRET_KEY,
        }),
        refreshToken: await this.jwt.signAsync(payload, {
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
          secret: process.env.JWT_SECRET_REFRESH_KEY,
        }),
      };
    } catch {
      Logger.error(
        AuthService.name,
        `status code: ${HttpStatus.FORBIDDEN}, error message: Refresh token is invalid or expired`,
      );
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }
}
