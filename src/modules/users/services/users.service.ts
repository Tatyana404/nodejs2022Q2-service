import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { User, UserResponse } from './../../../types/users.interface';
import { UpdatePasswordDto } from './../dto/update-user.dto';
import { CreateUserDto } from './../dto/create-user.dto';
import { InMemoryDB } from './../../../db/inMemoryDB';

@Injectable()
export class UsersService {
  constructor(private inMemoryDB: InMemoryDB) {}

  async getUsers(): Promise<UserResponse[]> {
    return this.inMemoryDB.users.map((user: User) => ({
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async getUser(userId: string): Promise<UserResponse> {
    if (!uuidValidate(userId)) {
      throw new BadRequestException(`User id ${userId} invalid`);
    }

    const user: User = this.inMemoryDB.users.find(
      ({ id }: { id: string }) => id === userId,
    );

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return rest;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    if (
      !['login', 'password'].every((field: string) => field in createUserDto)
    ) {
      throw new BadRequestException('Body does not contain required fields');
    }

    const newUser: User = {
      ...createUserDto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      id: uuidv4(),
    };

    this.inMemoryDB.users.push(newUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = newUser;

    return rest;
  }

  async updateUser(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    if (!uuidValidate(userId)) {
      throw new BadRequestException(`User id ${userId} invalid`);
    }

    const index: number = this.inMemoryDB.users.findIndex(
      ({ id }: { id: string }) => id === userId,
    );

    if (index === -1) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const user: User = this.inMemoryDB.users.find(
      ({ id }: { id: string }) => id === userId,
    );

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is not correct');
    }

    user.password = updatePasswordDto.newPassword;
    user.version = ++user.version;
    user.updatedAt = Date.now();

    this.inMemoryDB.users[index] = user;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return rest;
  }

  async deleteUser(userId: string): Promise<void> {
    if (!uuidValidate(userId)) {
      throw new BadRequestException(`User id ${userId} invalid`);
    }

    if (
      !this.inMemoryDB.users.find(({ id }: { id: string }) => id === userId)
    ) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    this.inMemoryDB.users = this.inMemoryDB.users.filter(
      ({ id }: { id: string }) => id !== userId,
    );
  }
}
