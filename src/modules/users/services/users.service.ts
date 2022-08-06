import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from './../../prisma/services/prisma.service';
import { CustomLogger } from './../../logger/services/logger.service';
import { UserResponse } from './../../../types/users.interface';
import { UpdatePasswordDto } from './../dto/update-user.dto';
import { CreateUserDto } from './../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private logger: CustomLogger) {}

  async getUsers(): Promise<UserResponse[]> {
    this.logger.debug('getUsers getting started');

    const users: UserResponse[] = await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    for (const user of users) {
      user.createdAt = new Date(user.createdAt).getTime() as any;
      user.updatedAt = new Date(user.updatedAt).getTime() as any;
    }

    this.logger.debug('getUsers completion work');
    return users;
  }

  async getUser(userId: string): Promise<UserResponse> {
    this.logger.debug('getUser getting started');

    if (!uuidValidate(userId)) {
      this.logger.error(`${HttpStatus.BAD_REQUEST} User id ${userId} invalid`);
      throw new BadRequestException(`User id ${userId} invalid`);
    }

    const user: User = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      this.logger.error(`${HttpStatus.NOT_FOUND} User ${userId} not found`);
      throw new NotFoundException(`User ${userId} not found`);
    }

    user.createdAt = new Date(user.createdAt).getTime() as any;
    user.updatedAt = new Date(user.updatedAt).getTime() as any;
    delete user.password;

    this.logger.debug('getUser completion work');
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    this.logger.debug('createUser getting started');

    if (
      !['login', 'password'].every((field: string) => field in createUserDto)
    ) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Body does not contain required fields`,
      );
      throw new BadRequestException('Body does not contain required fields');
    }

    const newUser: User = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: await argon.hash(createUserDto.password),
      },
    });

    newUser.createdAt = new Date(newUser.createdAt).getTime() as any;
    newUser.updatedAt = new Date(newUser.updatedAt).getTime() as any;
    delete newUser.password;

    this.logger.debug('createUser completion work');
    return newUser;
  }

  async updateUser(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    this.logger.debug('updateUser getting started');

    if (!uuidValidate(userId)) {
      this.logger.error(`${HttpStatus.BAD_REQUEST} User id ${userId} invalid`);
      throw new BadRequestException(`User id ${userId} invalid`);
    }

    const user: User = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      this.logger.error(`${HttpStatus.NOT_FOUND} User ${userId} not found`);
      throw new NotFoundException(`User ${userId} not found`);
    }

    if (!(await argon.verify(user.password, updatePasswordDto.oldPassword))) {
      this.logger.error(`${HttpStatus.FORBIDDEN} Old password is not correct`);
      throw new ForbiddenException('Old password is not correct');
    }

    const updateUser: User = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        version: {
          increment: 1,
        },
        password: await argon.hash(updatePasswordDto.newPassword),
        updatedAt: new Date().toISOString(),
      },
    });

    updateUser.createdAt = new Date(updateUser.createdAt).getTime() as any;
    updateUser.updatedAt = new Date(updateUser.updatedAt).getTime() as any;
    delete updateUser.password;

    this.logger.debug('updateUser completion work');
    return updateUser;
  }

  async deleteUser(userId: string): Promise<void> {
    this.logger.debug('deleteUser getting started');

    if (!uuidValidate(userId)) {
      this.logger.error(`${HttpStatus.BAD_REQUEST} User id ${userId} invalid`);
      throw new BadRequestException(`User id ${userId} invalid`);
    }

    if (!(await this.prisma.user.findUnique({ where: { id: userId } }))) {
      this.logger.error(`${HttpStatus.NOT_FOUND} User ${userId} not found`);
      throw new NotFoundException(`User ${userId} not found`);
    }

    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });

    this.logger.debug('deleteUser completion work');
  }
}
