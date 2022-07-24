import {
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { Favorites } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getFavorites() {
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

    return {
      artists: favorites.length && _.artists ? _.artists : [],
      albums: favorites.length && _.albums ? _.albums : [],
      tracks: favorites.length && _.tracks ? _.tracks : [],
    };
  }

  async addArtistToFavorites(artistId: string): Promise<void> {
    if (!uuidValidate(artistId)) {
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    if (
      !(await this.prisma.artist.findUnique({
        where: { id: artistId },
      }))
    ) {
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

    return;
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    if (!uuidValidate(artistId)) {
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    if (
      !(await this.prisma.artist.findUnique({
        where: { id: artistId },
      }))
    ) {
      throw new NotFoundException(`Artist ${artistId} not found`);
    }

    await this.prisma.artist.update({
      where: { id: artistId },
      data: { favoriteId: { set: null } },
    });

    return;
  }

  async addAlbumToFavorites(albumId: string): Promise<void> {
    if (!uuidValidate(albumId)) {
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    if (
      !(await this.prisma.album.findUnique({
        where: { id: albumId },
      }))
    ) {
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

    return;
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    if (!uuidValidate(albumId)) {
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    if (
      !(await this.prisma.album.findUnique({
        where: { id: albumId },
      }))
    ) {
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    await this.prisma.album.update({
      where: { id: albumId },
      data: { favoriteId: { set: null } },
    });

    return;
  }

  async addTrackToFavorites(trackId: string): Promise<void> {
    if (!uuidValidate(trackId)) {
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    if (
      !(await this.prisma.track.findUnique({
        where: { id: trackId },
      }))
    ) {
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

    return;
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    if (!uuidValidate(trackId)) {
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    if (
      !(await this.prisma.track.findUnique({
        where: { id: trackId },
      }))
    ) {
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    await this.prisma.track.update({
      where: { id: trackId },
      data: { favoriteId: { set: null } },
    });

    return;
  }
}
