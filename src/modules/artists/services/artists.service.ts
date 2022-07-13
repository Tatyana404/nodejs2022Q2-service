import { InMemoryDB } from './../../../db/inMemoryDB';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { UpdateArtistDto } from './../dto/update-artist.dto';
import { CreateArtistDto } from './../dto/create-artist.dto';
import { Artist } from './../../../types/artists.interface';

@Injectable()
export class ArtistsService {
  async getArtists(): Promise<Artist[]> {
    return InMemoryDB.artists;
  }

  async getArtist(artistId: string): Promise<Artist> {
    const artist = InMemoryDB.artists.find(({ id }) => id === artistId);

    if (!uuidValidate(artistId)) {
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Artist id invalid',
      );
    }

    if (!artist) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, 'Artist not found');
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
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Body does not contain required fields',
      );
    }

    InMemoryDB.artists.push(newArtist);

    return newArtist;
  }

  async updateArtist(
    artistId: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    const updateArtist: Artist = { ...updateArtistDto, id: artistId };
    const index = InMemoryDB.artists.findIndex(({ id }) => id === artistId);

    if (!uuidValidate(artistId)) {
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Artist id invalid',
      );
    }

    if (index === -1) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, 'Artist not found');
    }

    InMemoryDB.artists[index] = updateArtist;

    return updateArtist;
  }

  async deleteArtist(artistId: string): Promise<any> {
    const index = InMemoryDB.artists.findIndex(({ id }) => id === artistId);

    if (!uuidValidate(artistId)) {
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Artist id invalid',
      );
    }

    if (index === -1) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, 'Artist not found');
    }

    InMemoryDB.artists = InMemoryDB.artists.filter(({ id }) => id !== artistId);
  }
}
