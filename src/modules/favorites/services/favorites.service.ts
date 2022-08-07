import {
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
  Injectable,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { Favorites } from '@prisma/client';
import { PrismaService } from './../../prisma/services/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getFavorites() {
    Logger.debug(FavoritesService.name, 'getFavorites getting started');

    const favorites = await this.prisma.favorites.findMany({
      select: {
        artists: { select: { id: true, name: true, grammy: true } },
        albums: {
          select: { id: true, name: true, year: true, artistId: true },
        },
        tracks: {
          select: {
            id: true,
            name: true,
            artistId: true,
            albumId: true,
            duration: true,
          },
        },
      },
    });

    const _ = favorites[0];

    Logger.debug(FavoritesService.name, 'getFavorites completion work');
    return {
      artists: favorites.length && _.artists ? _.artists : [],
      albums: favorites.length && _.albums ? _.albums : [],
      tracks: favorites.length && _.tracks ? _.tracks : [],
    };
  }

  async addArtistToFavorites(artistId: string): Promise<void> {
    Logger.debug(FavoritesService.name, 'addArtistToFavorites getting started');

    if (!uuidValidate(artistId)) {
      Logger.error(
        FavoritesService.name,
        `status code: ${HttpStatus.BAD_REQUEST}, error message: Artist id ${artistId} invalid`,
      );
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    if (
      !(await this.prisma.artist.findUnique({
        where: { id: artistId },
      }))
    ) {
      Logger.error(
        FavoritesService.name,
        `status code: ${HttpStatus.UNPROCESSABLE_ENTITY}, error message: Artist ${artistId} not found`,
      );
      throw new UnprocessableEntityException(`Artist ${artistId} not found`);
    }

    const favorites: Favorites[] = await this.prisma.favorites.findMany();

    if (favorites.length) {
      await this.prisma.artist.update({
        where: { id: artistId },
        data: { favoriteId: favorites[0].id },
      });
    } else {
      const { id } = await this.prisma.favorites.create({ data: {} });

      await this.prisma.artist.update({
        where: { id: artistId },
        data: { favoriteId: id },
      });
    }

    Logger.debug(FavoritesService.name, 'addArtistToFavorites completion work');
    return;
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    Logger.debug(
      FavoritesService.name,
      'removeArtistFromFavorites getting started',
    );

    if (!uuidValidate(artistId)) {
      Logger.error(
        FavoritesService.name,
        `status code: ${HttpStatus.BAD_REQUEST}, error message: Artist id ${artistId} invalid`,
      );
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    if (
      !(await this.prisma.artist.findUnique({
        where: { id: artistId },
      }))
    ) {
      Logger.error(
        FavoritesService.name,
        `status code: ${HttpStatus.NOT_FOUND}, error message: Artist ${artistId} not found`,
      );
      throw new NotFoundException(`Artist ${artistId} not found`);
    }

    await this.prisma.artist.update({
      where: { id: artistId },
      data: { favoriteId: { set: null } },
    });

    Logger.debug(
      FavoritesService.name,
      'removeArtistFromFavorites completion work',
    );
    return;
  }

  async addAlbumToFavorites(albumId: string): Promise<void> {
    Logger.debug(FavoritesService.name, 'addAlbumToFavorites getting started');

    if (!uuidValidate(albumId)) {
      Logger.error(
        FavoritesService.name,
        `status code: ${HttpStatus.BAD_REQUEST}, error message: Album id ${albumId} invalid`,
      );
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    if (
      !(await this.prisma.album.findUnique({
        where: { id: albumId },
      }))
    ) {
      Logger.error(
        FavoritesService.name,
        `status code: ${HttpStatus.UNPROCESSABLE_ENTITY}, error message: Album ${albumId} not found`,
      );
      throw new UnprocessableEntityException(`Album ${albumId} not found`);
    }

    const favorites: Favorites[] = await this.prisma.favorites.findMany();

    if (favorites.length) {
      await this.prisma.album.update({
        where: { id: albumId },
        data: { favoriteId: favorites[0].id },
      });
    } else {
      const { id } = await this.prisma.favorites.create({ data: {} });

      await this.prisma.album.update({
        where: { id: albumId },
        data: { favoriteId: id },
      });
    }

    Logger.debug(FavoritesService.name, 'addAlbumToFavorites completion work');
    return;
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    Logger.debug(
      FavoritesService.name,
      'removeAlbumFromFavorites getting started',
    );

    if (!uuidValidate(albumId)) {
      Logger.error(
        FavoritesService.name,
        `status code: ${HttpStatus.BAD_REQUEST}, error message: Album id ${albumId} invalid`,
      );
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    if (
      !(await this.prisma.album.findUnique({
        where: { id: albumId },
      }))
    ) {
      Logger.error(
        FavoritesService.name,
        `status code: ${HttpStatus.NOT_FOUND}, error message: Album ${albumId} not found`,
      );
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    await this.prisma.album.update({
      where: { id: albumId },
      data: { favoriteId: { set: null } },
    });

    Logger.debug(
      FavoritesService.name,
      'removeAlbumFromFavorites completion work',
    );
    return;
  }

  async addTrackToFavorites(trackId: string): Promise<void> {
    Logger.debug(FavoritesService.name, 'addTrackToFavorites getting started');

    if (!uuidValidate(trackId)) {
      Logger.error(
        FavoritesService.name,
        `status code: ${HttpStatus.BAD_REQUEST}, error message: Track id ${trackId} invalid`,
      );
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    if (
      !(await this.prisma.track.findUnique({
        where: { id: trackId },
      }))
    ) {
      Logger.error(
        FavoritesService.name,
        `status code: ${HttpStatus.UNPROCESSABLE_ENTITY}, error message: Track ${trackId} not found`,
      );
      throw new UnprocessableEntityException(`Track ${trackId} not found`);
    }

    const favorites: Favorites[] = await this.prisma.favorites.findMany();

    if (favorites.length) {
      await this.prisma.track.update({
        where: { id: trackId },
        data: { favoriteId: favorites[0].id },
      });
    } else {
      const { id } = await this.prisma.favorites.create({ data: {} });

      await this.prisma.track.update({
        where: { id: trackId },
        data: { favoriteId: id },
      });
    }

    Logger.debug(FavoritesService.name, 'addTrackToFavorites completion work');
    return;
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    Logger.debug(
      FavoritesService.name,
      'removeTrackFromFavorites getting started',
    );

    if (!uuidValidate(trackId)) {
      Logger.error(
        FavoritesService.name,
        `status code: ${HttpStatus.BAD_REQUEST}, error message: Track id ${trackId} invalid`,
      );
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    if (
      !(await this.prisma.track.findUnique({
        where: { id: trackId },
      }))
    ) {
      Logger.error(
        FavoritesService.name,
        `status code: ${HttpStatus.NOT_FOUND}, error message: Track ${trackId} not found`,
      );
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    await this.prisma.track.update({
      where: { id: trackId },
      data: { favoriteId: { set: null } },
    });

    Logger.debug(
      FavoritesService.name,
      'removeTrackFromFavorites completion work',
    );
    return;
  }
}
