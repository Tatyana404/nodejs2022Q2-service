import { Module } from '@nestjs/common';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    FavoritesModule,
    ArtistsModule,
    TracksModule,
    AlbumsModule,
    UsersModule,
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}
