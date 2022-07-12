import { FavoritesService } from './services/favorites.service';
import { Controller } from '@nestjs/common';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}
}
