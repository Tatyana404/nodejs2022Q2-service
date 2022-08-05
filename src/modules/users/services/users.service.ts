import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from './../../prisma/services/prisma.service';
import { UserResponse } from './../../../types/users.interface';
import { UpdatePasswordDto } from './../dto/update-user.dto';
import { CreateUserDto } from './../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<UserResponse[]> {
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

    return users;
  }

  async getUser(userId: string): Promise<UserResponse> {
    if (!uuidValidate(userId)) {
      throw new BadRequestException(`User id ${userId} invalid`);
    }

    const user: User = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    user.createdAt = new Date(user.createdAt).getTime() as any;
    user.updatedAt = new Date(user.updatedAt).getTime() as any;
    delete user.password;

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    if (
      !['login', 'password'].every((field: string) => field in createUserDto)
    ) {
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

    return newUser;
  }

  async updateUser(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    if (!uuidValidate(userId)) {
      throw new BadRequestException(`User id ${userId} invalid`);
    }

    const user: User = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    if (!(await argon.verify(user.password, updatePasswordDto.oldPassword))) {
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

    return updateUser;
  }

  async deleteUser(userId: string): Promise<void> {
    if (!uuidValidate(userId)) {
      throw new BadRequestException(`User id ${userId} invalid`);
    }

    if (!(await this.prisma.user.findUnique({ where: { id: userId } }))) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
