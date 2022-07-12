import { ArtistsService } from './services/artists.service';
import { Controller } from '@nestjs/common';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}
}
