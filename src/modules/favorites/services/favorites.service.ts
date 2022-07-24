import {
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { FavoritesRepsonse } from './../../../types/favorites.interface';
import { InMemoryDB } from './../../../db/inMemoryDB';

@Injectable()
export class FavoritesService {
  constructor(private inMemoryDB: InMemoryDB) {}

  async getFavorites(): Promise<FavoritesRepsonse> {
    const artists = this.inMemoryDB.favorites.artists.map((artistId) =>
      this.inMemoryDB.artists.find(({ id }: { id: string }) => id === artistId),
    );

    const albums = this.inMemoryDB.favorites.albums.map((albumId) =>
      this.inMemoryDB.albums.find(({ id }: { id: string }) => id === albumId),
    );

    const tracks = this.inMemoryDB.favorites.tracks.map((trackId) =>
      this.inMemoryDB.tracks.find(({ id }: { id: string }) => id === trackId),
    );

    return { artists, albums, tracks };
  }

  async addArtistToFavorites(artistId: string): Promise<void> {
    if (!uuidValidate(artistId)) {
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    if (
      !this.inMemoryDB.artists.find(({ id }: { id: string }) => id === artistId)
    ) {
      throw new UnprocessableEntityException(`Artist ${artistId} not found`);
    }

    this.inMemoryDB.favorites.artists.push(artistId);

    return;
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    if (!uuidValidate(artistId)) {
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    if (
      !this.inMemoryDB.artists.find(({ id }: { id: string }) => id === artistId)
    ) {
      throw new NotFoundException(`Artist ${artistId} not found`);
    }

    this.inMemoryDB.favorites.artists =
      this.inMemoryDB.favorites.artists.filter((id: string) => id !== artistId);

    return;
  }

  async addAlbumToFavorites(albumId: string): Promise<void> {
    if (!uuidValidate(albumId)) {
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    if (
      !this.inMemoryDB.albums.find(({ id }: { id: string }) => id === albumId)
    ) {
      throw new UnprocessableEntityException(`Album ${albumId} not found`);
    }

    this.inMemoryDB.favorites.albums.push(albumId);

    return;
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    if (!uuidValidate(albumId)) {
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    if (
      !this.inMemoryDB.albums.find(({ id }: { id: string }) => id === albumId)
    ) {
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    this.inMemoryDB.favorites.albums = this.inMemoryDB.favorites.albums.filter(
      (id: string) => id !== albumId,
    );

    return;
  }

  async addTrackToFavorites(trackId: string): Promise<void> {
    if (!uuidValidate(trackId)) {
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    if (
      !this.inMemoryDB.tracks.find(({ id }: { id: string }) => id === trackId)
    ) {
      throw new UnprocessableEntityException(`Track ${trackId} not found`);
    }

    this.inMemoryDB.favorites.tracks.push(trackId);

    return;
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    if (!uuidValidate(trackId)) {
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    if (
      !this.inMemoryDB.tracks.find(({ id }: { id: string }) => id === trackId)
    ) {
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    this.inMemoryDB.favorites.tracks = this.inMemoryDB.favorites.tracks.filter(
      (id: string) => id !== trackId,
    );

    return;
  }
}
