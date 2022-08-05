import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './modules/logger/utils/logger.middleware';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { LoggerModule } from './modules/logger/logger.module';
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
    LoggerModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
