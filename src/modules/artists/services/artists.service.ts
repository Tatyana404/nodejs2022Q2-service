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
  private static artists: Artist[] = [];

  async getArtists(): Promise<Artist[]> {
    return ArtistsService.artists;
  }

  async getArtist(artistId: string): Promise<Artist> {
    const artist = ArtistsService.artists.find(({ id }) => id === artistId);

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

    ArtistsService.artists.push(newArtist);

    return newArtist;
  }

  async updateArtist(
    artistId: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    const updateArtist: Artist = { ...updateArtistDto, id: artistId };
    const index = ArtistsService.artists.findIndex(({ id }) => id === artistId);

    if (!uuidValidate(artistId)) {
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Artist id invalid',
      );
    }

    if (index === -1) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, 'Artist not found');
    }

    ArtistsService.artists[index] = updateArtist;

    return updateArtist;
  }

  async deleteArtist(artistId: string): Promise<any> {
    const index = ArtistsService.artists.findIndex(({ id }) => id === artistId);

    if (!uuidValidate(artistId)) {
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Artist id invalid',
      );
    }

    if (index === -1) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, 'Artist not found');
    }

    ArtistsService.artists = ArtistsService.artists.filter(
      ({ id }) => id !== artistId,
    );
  }
}
