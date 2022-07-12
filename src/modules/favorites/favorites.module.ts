import { Module } from '@nestjs/common';
import { FavoritesService } from './services/favorites.service';
import { FavoritesController } from './favorites.controller';

@Module({
  controllers: [FavoritesController],

  providers: [FavoritesService],

  exports: [FavoritesService],
})
export class FavoritesModule {}
