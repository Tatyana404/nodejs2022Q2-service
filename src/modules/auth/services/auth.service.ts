import {
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import 'dotenv/config';
import { Jwt, Payload, RefreshToken } from './../../../types/jwt.interface';
import { PrismaService } from './../../prisma/services/prisma.service';
import { CustomLogger } from './../../logger/services/logger.service';
import { CreateUserDto } from './../../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private logger: CustomLogger,
  ) {}

  async loginUser(createUserDto: CreateUserDto): Promise<Jwt> {
    this.logger.debug('loginUser getting started');

    if (
      !['login', 'password'].every((field: string) => field in createUserDto)
    ) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Body does not contain required fields`,
      );
      throw new BadRequestException('Body does not contain required fields');
    }

    const user: User = await this.prisma.user.findFirst({
      where: {
        login: createUserDto.login,
      },
    });

    if (!user || !(await argon.verify(user.password, createUserDto.password))) {
      this.logger.error(`${HttpStatus.FORBIDDEN} Authentication failed`);
      throw new ForbiddenException('Authentication failed');
    }

    const payload: Payload = {
      userId: user.id,
      login: user.login,
    };

    this.logger.debug('loginUser completion work');
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
    this.logger.debug('refreshUser getting started');

    if (
      !['refreshToken'].every((field: string) => field in refreshToken) ||
      !refreshToken.refreshToken.length
    ) {
      this.logger.error(
        `${HttpStatus.UNAUTHORIZED} Body does not contain required fields`,
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

      this.logger.debug('refreshUser completion work');
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
      this.logger.error(
        `${HttpStatus.FORBIDDEN} Refresh token is invalid or expired`,
      );
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }
}
