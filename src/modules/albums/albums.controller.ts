import { AlbumsService } from './services/albums.service';
import { Controller } from '@nestjs/common';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}
}
