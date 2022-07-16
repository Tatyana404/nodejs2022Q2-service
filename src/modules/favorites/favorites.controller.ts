import {
  Controller,
  HttpStatus,
  HttpCode,
  Delete,
  Param,
  Post,
  Get,
} from '@nestjs/common';
import { FavoritesRepsonse } from './../../types/favorites.interface';
import { FavoritesService } from './services/favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getFavorites(): Promise<FavoritesRepsonse> {
    return this.favoritesService.getFavorites();
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtistToFavorites(@Param('id') id: string): Promise<void> {
    return this.favoritesService.addArtistToFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtistFromFavorites(@Param('id') id: string): Promise<void> {
    return this.favoritesService.removeArtistFromFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavorites(@Param('id') id: string): Promise<void> {
    return this.favoritesService.addAlbumToFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbumFromFavorites(@Param('id') id: string): Promise<void> {
    return this.favoritesService.removeAlbumFromFavorites(id);
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrackToFavorites(@Param('id') id: string): Promise<void> {
    return this.favoritesService.addTrackToFavorites(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrackFromFavorites(@Param('id') id: string): Promise<void> {
    return this.favoritesService.removeTrackFromFavorites(id);
  }
}
