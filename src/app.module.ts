import { Module } from '@nestjs/common';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AlbumsModule,
    ArtistsModule,
    FavoritesModule,
    TracksModule,
    UsersModule,
  ],
})
export class AppModule {}
