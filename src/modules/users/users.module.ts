import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { InMemoryDB } from './../../db/inMemoryDB';

@Module({
  controllers: [UsersController],

  providers: [UsersService, InMemoryDB],
})
export class UsersModule {}
