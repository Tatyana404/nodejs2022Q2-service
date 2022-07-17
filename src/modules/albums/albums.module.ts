import { Module } from '@nestjs/common';
import { AlbumsService } from './services/albums.service';
import { AlbumsController } from './albums.controller';
import { InMemoryDB } from './../../db/inMemoryDB';

@Module({
  controllers: [AlbumsController],

  providers: [AlbumsService, InMemoryDB],
})
export class AlbumsModule {}
