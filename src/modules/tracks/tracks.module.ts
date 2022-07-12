import { Module } from '@nestjs/common';
import { TracksService } from './services/tracks.service';
import { TracksController } from './tracks.controller';

@Module({
  controllers: [TracksController],

  providers: [TracksService],

  exports: [TracksService],
})
export class TracksModule {}
