import { Module } from '@nestjs/common';
import { AlbumsService } from './services/albums.service';
import { AlbumsController } from './albums.controller';

@Module({
  controllers: [AlbumsController],

  providers: [AlbumsService],

  exports: [AlbumsService],
})
export class AlbumsModule {}
