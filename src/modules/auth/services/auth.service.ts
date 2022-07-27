import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import 'dotenv/config';
import { CreateUserDto } from './../../users/dto/create-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Jwt } from './../../../types/jwt.interface';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async loginUser(createUserDto: CreateUserDto): Promise<Jwt> {
    if (
      !['login', 'password'].every((field: string) => field in createUserDto)
    ) {
      throw new BadRequestException('Body does not contain required fields');
    }

    const user: User = await this.prisma.user.findFirst({
      where: {
        login: createUserDto.login,
      },
    });

    if (!user || !(await argon.verify(user.password, createUserDto.password))) {
      throw new ForbiddenException('Authentication failed ');
    }

    const payload = {
      userId: user.id,
      login: user.login,
    };

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
}
