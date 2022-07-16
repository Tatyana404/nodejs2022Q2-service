import {
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { CreateAlbumDto } from './../dto/create-album.dto';
import { UpdateAlbumDto } from './../dto/update-album.dto';
import { Album } from './../../../types/albums.interface';
import { InMemoryDB } from './../../../db/inMemoryDB';
@Injectable()
export class AlbumsService {
  constructor(private inMemoryDB: InMemoryDB) {}

  async getAlbums(): Promise<Album[]> {
    return this.inMemoryDB.albums;
  }

  async getAlbum(albumId: string): Promise<Album> {
    if (!uuidValidate(albumId)) {
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    const album: Album = this.inMemoryDB.albums.find(
      ({ id }: { id: string }) => id === albumId,
    );

    if (!album) {
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    return album;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    if (createAlbumDto.artistId) {
      if (
        !this.inMemoryDB.artists.find(
          ({ id }: { id: string }) => id === createAlbumDto.artistId,
        )
      ) {
        throw new UnprocessableEntityException(
          `Artist ${createAlbumDto.artistId} not found`,
        );
      }
    }

    if (!['name', 'year'].every((field: string) => field in createAlbumDto)) {
      throw new BadRequestException('Body does not contain required fields');
    }

    const newAlbum: Album = {
      ...createAlbumDto,
      artistId: createAlbumDto.artistId || null,
      id: uuidv4(),
    };

    this.inMemoryDB.albums.push(newAlbum);

    return newAlbum;
  }

  async updateAlbum(
    albumId: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    if (!uuidValidate(albumId)) {
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    const index: number = this.inMemoryDB.albums.findIndex(
      ({ id }: { id: string }) => id === albumId,
    );

    if (index === -1) {
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    const updateAlbum: Album = { ...updateAlbumDto, id: albumId };

    this.inMemoryDB.albums[index] = updateAlbum;

    return updateAlbum;
  }

  async deleteAlbum(albumId: string): Promise<void> {
    if (!uuidValidate(albumId)) {
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    if (
      !this.inMemoryDB.albums.find(({ id }: { id: string }) => id === albumId)
    ) {
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    this.inMemoryDB.albums = this.inMemoryDB.albums.filter(
      ({ id }: { id: string }) => id !== albumId,
    );

    if (
      this.inMemoryDB.favorites.albums.findIndex(
        (id: string) => id === albumId,
      ) !== -1
    ) {
      this.inMemoryDB.favorites.albums =
        this.inMemoryDB.favorites.albums.filter((id: string) => id !== albumId);
    }

    const albumInTracks: number = this.inMemoryDB.tracks.findIndex(
      ({ albumId: id }: { albumId: string }) => id === albumId,
    );

    if (albumInTracks !== -1) {
      this.inMemoryDB.tracks[albumInTracks].albumId = null;
    }
  }
}
