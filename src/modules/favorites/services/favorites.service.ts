import {
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { Favorites } from '@prisma/client';
import { PrismaService } from './../../prisma/services/prisma.service';
import { CustomLogger } from './../../logger/services/logger.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService, private logger: CustomLogger) {}

  async getFavorites() {
    this.logger.debug('getFavorites getting started');

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

    this.logger.debug('getFavorites completion work');
    return {
      artists: favorites.length && _.artists ? _.artists : [],
      albums: favorites.length && _.albums ? _.albums : [],
      tracks: favorites.length && _.tracks ? _.tracks : [],
    };
  }

  async addArtistToFavorites(artistId: string): Promise<void> {
    this.logger.debug('addArtistToFavorites getting started');

    if (!uuidValidate(artistId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Artist id ${artistId} invalid`,
      );
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    if (
      !(await this.prisma.artist.findUnique({
        where: { id: artistId },
      }))
    ) {
      this.logger.error(
        `${HttpStatus.UNPROCESSABLE_ENTITY} Artist ${artistId} not found`,
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

    this.logger.debug('addArtistToFavorites completion work');
    return;
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    this.logger.debug('removeArtistFromFavorites getting started');

    if (!uuidValidate(artistId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Artist id ${artistId} invalid`,
      );
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    if (
      !(await this.prisma.artist.findUnique({
        where: { id: artistId },
      }))
    ) {
      this.logger.error(`${HttpStatus.NOT_FOUND} Artist ${artistId} not found`);
      throw new NotFoundException(`Artist ${artistId} not found`);
    }

    await this.prisma.artist.update({
      where: { id: artistId },
      data: { favoriteId: { set: null } },
    });

    this.logger.debug('removeArtistFromFavorites completion work');
    return;
  }

  async addAlbumToFavorites(albumId: string): Promise<void> {
    this.logger.debug('addAlbumToFavorites getting started');

    if (!uuidValidate(albumId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Album id ${albumId} invalid`,
      );
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    if (
      !(await this.prisma.album.findUnique({
        where: { id: albumId },
      }))
    ) {
      this.logger.error(
        `${HttpStatus.UNPROCESSABLE_ENTITY} Album ${albumId} not found`,
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

    this.logger.debug('addAlbumToFavorites completion work');
    return;
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    this.logger.debug('removeAlbumFromFavorites getting started');

    if (!uuidValidate(albumId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Album id ${albumId} invalid`,
      );
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    if (
      !(await this.prisma.album.findUnique({
        where: { id: albumId },
      }))
    ) {
      this.logger.error(`${HttpStatus.NOT_FOUND} Album ${albumId} not found`);
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    await this.prisma.album.update({
      where: { id: albumId },
      data: { favoriteId: { set: null } },
    });

    this.logger.debug('removeAlbumFromFavorites completion work');
    return;
  }

  async addTrackToFavorites(trackId: string): Promise<void> {
    this.logger.debug('addTrackToFavorites getting started');

    if (!uuidValidate(trackId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Track id ${trackId} invalid`,
      );
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    if (
      !(await this.prisma.track.findUnique({
        where: { id: trackId },
      }))
    ) {
      this.logger.error(
        `${HttpStatus.UNPROCESSABLE_ENTITY} Track ${trackId} not found`,
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

    this.logger.debug('addTrackToFavorites completion work');
    return;
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    this.logger.debug('removeTrackFromFavorites getting started');

    if (!uuidValidate(trackId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Track id ${trackId} invalid`,
      );
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    if (
      !(await this.prisma.track.findUnique({
        where: { id: trackId },
      }))
    ) {
      this.logger.error(`${HttpStatus.NOT_FOUND} Track ${trackId} not found`);
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    await this.prisma.track.update({
      where: { id: trackId },
      data: { favoriteId: { set: null } },
    });

    this.logger.debug('removeTrackFromFavorites completion work');
    return;
  }
}
