import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { UpdateArtistDto } from './../dto/update-artist.dto';
import { CreateArtistDto } from './../dto/create-artist.dto';
import { Artist } from './../../../types/artists.interface';
import { InMemoryDB } from './../../../db/inMemoryDB';

@Injectable()
export class ArtistsService {
  constructor(private inMemoryDB: InMemoryDB) {}

  async getArtists(): Promise<Artist[]> {
    return this.inMemoryDB.artists;
  }

  async getArtist(artistId: string): Promise<Artist> {
    if (!uuidValidate(artistId)) {
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    const artist: Artist = this.inMemoryDB.artists.find(
      ({ id }: { id: string }) => id === artistId,
    );

    if (!artist) {
      throw new NotFoundException(`Artist ${artistId} not found`);
    }

    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    if (
      !['name', 'grammy'].every((field: string) => field in createArtistDto)
    ) {
      throw new BadRequestException('Body does not contain required fields');
    }

    const newArtist: Artist = {
      ...createArtistDto,
      id: uuidv4(),
    };

    this.inMemoryDB.artists.push(newArtist);

    return newArtist;
  }

  async updateArtist(
    artistId: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    if (!uuidValidate(artistId)) {
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    const index: number = this.inMemoryDB.artists.findIndex(
      ({ id }: { id: string }) => id === artistId,
    );

    if (index === -1) {
      throw new NotFoundException(`Artist ${artistId} not found`);
    }

    const updateArtist: Artist = { ...updateArtistDto, id: artistId };

    this.inMemoryDB.artists[index] = updateArtist;

    return updateArtist;
  }

  async deleteArtist(artistId: string): Promise<void> {
    if (!uuidValidate(artistId)) {
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    if (
      !this.inMemoryDB.artists.find(({ id }: { id: string }) => id === artistId)
    ) {
      throw new NotFoundException(`Artist ${artistId} not found`);
    }

    this.inMemoryDB.artists = this.inMemoryDB.artists.filter(
      ({ id }: { id: string }) => id !== artistId,
    );

    if (
      this.inMemoryDB.favorites.artists.findIndex(
        (id: string) => id === artistId,
      ) !== -1
    ) {
      this.inMemoryDB.favorites.artists =
        this.inMemoryDB.favorites.artists.filter(
          (id: string) => id !== artistId,
        );
    }

    const artistInAlbums: number = this.inMemoryDB.albums.findIndex(
      ({ artistId: id }: { artistId: string }) => id === artistId,
    );

    if (artistInAlbums !== -1) {
      this.inMemoryDB.albums[artistInAlbums].artistId = null;
    }

    const artistInTracks: number = this.inMemoryDB.tracks.findIndex(
      ({ artistId: id }: { artistId: string }) => id === artistId,
    );

    if (artistInTracks !== -1) {
      this.inMemoryDB.tracks[artistInTracks].artistId = null;
    }
  }
}
