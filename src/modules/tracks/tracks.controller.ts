import { TracksService } from './services/tracks.service';
import { Controller } from '@nestjs/common';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}
}
