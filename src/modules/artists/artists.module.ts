import { Module } from '@nestjs/common';
import { ArtistsService } from './services/artists.service';
import { ArtistsController } from './artists.controller';
import { InMemoryDB } from './../../db/inMemoryDB';

@Module({
  controllers: [ArtistsController],

  providers: [ArtistsService, InMemoryDB],
})
export class ArtistsModule {}
