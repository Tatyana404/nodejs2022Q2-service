import { Module } from '@nestjs/common';
import { TracksService } from './services/tracks.service';
import { TracksController } from './tracks.controller';
import { InMemoryDB } from './../../db/inMemoryDB';

@Module({
  controllers: [TracksController],

  providers: [TracksService, InMemoryDB],
})
export class TracksModule {}
