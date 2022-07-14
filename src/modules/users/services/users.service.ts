import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { User, UserResponse } from './../../../types/users.interface';
import { UpdatePasswordDto } from './../dto/update-user.dto';
import { CreateUserDto } from './../dto/create-user.dto';
import { InMemoryDB } from './../../../db/inMemoryDB';

@Injectable()
export class UsersService {
  async getUsers(): Promise<UserResponse[]> {
    return InMemoryDB.users.map((user: User) => ({
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async getUser(userId: string): Promise<UserResponse> {
    const user: User = InMemoryDB.users.find(({ id }) => id === userId);

    if (!uuidValidate(userId)) {
      throw new BadRequestException('User id invalid');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    const newUser: User = {
      ...createUserDto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      id: uuidv4(),
    };
    const fields: string[] = ['login', 'password'];

    if (!fields.every((field: string) => field in createUserDto)) {
      throw new BadRequestException('Body does not contain required fields');
    }

    InMemoryDB.users.push(newUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = newUser;
    return rest;
  }

  async updateUser(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    const user: User = InMemoryDB.users.find(({ id }) => id === userId);
    const index: number = InMemoryDB.users.findIndex(({ id }) => id === userId);

    if (!uuidValidate(userId)) {
      throw new BadRequestException('User id invalid');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is not correct');
    }

    user.password = updatePasswordDto.newPassword;
    user.version = ++user.version;
    user.updatedAt = Date.now();

    InMemoryDB.users[index] = user;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async deleteUser(userId: string): Promise<void> {
    const index: number = InMemoryDB.users.findIndex(({ id }) => id === userId);

    if (!uuidValidate(userId)) {
      throw new BadRequestException('User id invalid');
    }

    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    InMemoryDB.users = InMemoryDB.users.filter(({ id }) => id !== userId);
  }
}
