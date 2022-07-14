import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { UpdateArtistDto } from './../dto/update-artist.dto';
import { CreateArtistDto } from './../dto/create-artist.dto';
import { Artist } from './../../../types/artists.interface';
import { Album } from './../../../types/albums.interface';
import { Track } from './../../../types/tracks.interface';
import { InMemoryDB } from './../../../db/inMemoryDB';

@Injectable()
export class ArtistsService {
  async getArtists(): Promise<Artist[]> {
    return InMemoryDB.artists;
  }

  async getArtist(artistId: string): Promise<Artist> {
    const artist: Artist = InMemoryDB.artists.find(({ id }) => id === artistId);

    if (!uuidValidate(artistId)) {
      throw new BadRequestException('Artist id invalid');
    }

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist: Artist = {
      ...createArtistDto,
      id: uuidv4(),
    };
    const fields: string[] = ['name', 'grammy'];

    if (!fields.every((field: string) => field in createArtistDto)) {
      throw new BadRequestException('Body does not contain required fields');
    }

    InMemoryDB.artists.push(newArtist);

    return newArtist;
  }

  async updateArtist(
    artistId: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    const updateArtist: Artist = { ...updateArtistDto, id: artistId };
    const index: number = InMemoryDB.artists.findIndex(
      ({ id }) => id === artistId,
    );

    if (!uuidValidate(artistId)) {
      throw new BadRequestException('Artist id invalid');
    }

    if (index === -1) {
      throw new NotFoundException('Artist not found');
    }

    InMemoryDB.artists[index] = updateArtist;

    return updateArtist;
  }

  async deleteArtist(artistId: string): Promise<void> {
    const artist: Artist = InMemoryDB.artists.find(({ id }) => id === artistId);
    const artistInFavorites: number = InMemoryDB.favorites.artists.findIndex(
      (id) => id === artistId,
    );
    const artistInAlbums: Album = InMemoryDB.albums.find(
      ({ id }) => id === artistId,
    );
    const artistInTracks: Track = InMemoryDB.tracks.find(
      ({ id }) => id === artistId,
    );

    if (!uuidValidate(artistId)) {
      throw new BadRequestException('Artist id invalid');
    }

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    if (artistInFavorites !== -1) {
      InMemoryDB.favorites.artists = InMemoryDB.favorites.artists.filter(
        (id) => id !== artistId,
      );
    }

    if (artistInAlbums) {
      artistInAlbums.artistId = null;
    }

    if (artistInTracks) {
      artistInTracks.artistId = null;
    }

    InMemoryDB.artists = InMemoryDB.artists.filter(({ id }) => id !== artistId);
  }
}
