import {
  BadRequestException,
  NotFoundException,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { Artist } from '@prisma/client';
import { PrismaService } from './../../prisma/services/prisma.service';
import { CustomLogger } from './../../logger/services/logger.service';
import { UpdateArtistDto } from './../dto/update-artist.dto';
import { CreateArtistDto } from './../dto/create-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService, private logger: CustomLogger) {}

  async getArtists(): Promise<Artist[]> {
    this.logger.debug('getArtists getting started');
    this.logger.debug('getArtists completion work');
    return await this.prisma.artist.findMany();
  }

  async getArtist(artistId: string): Promise<Artist> {
    this.logger.debug('getArtist getting started');

    if (!uuidValidate(artistId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Artist id ${artistId} invalid`,
      );
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    const artist: Artist = await this.prisma.artist.findUnique({
      where: {
        id: artistId,
      },
    });

    if (!artist) {
      this.logger.error(`${HttpStatus.NOT_FOUND} Artist ${artistId} not found`);
      throw new NotFoundException(`Artist ${artistId} not found`);
    }

    this.logger.debug('getArtist completion work');
    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    this.logger.debug('createArtist getting started');

    if (
      !['name', 'grammy'].every((field: string) => field in createArtistDto)
    ) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Body does not contain required fields`,
      );
      throw new BadRequestException('Body does not contain required fields');
    }

    const newArtist: Artist = await this.prisma.artist.create({
      data: { ...createArtistDto },
    });

    this.logger.debug('createArtist completion work');
    return newArtist;
  }

  async updateArtist(
    artistId: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    this.logger.debug('updateArtist getting started');

    if (!uuidValidate(artistId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Artist id ${artistId} invalid`,
      );
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    const artist: Artist = await this.prisma.artist.findUnique({
      where: {
        id: artistId,
      },
    });

    if (!artist) {
      this.logger.error(`${HttpStatus.NOT_FOUND} Artist ${artistId} not found`);
      throw new NotFoundException(`Artist ${artistId} not found`);
    }

    const updateArtist: Artist = await this.prisma.artist.update({
      where: {
        id: artistId,
      },
      data: { ...updateArtistDto },
    });

    this.logger.debug('updateArtist completion work');
    return updateArtist;
  }

  async deleteArtist(artistId: string): Promise<void> {
    this.logger.debug('deleteArtist getting started');

    if (!uuidValidate(artistId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Artist id ${artistId} invalid`,
      );
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    if (!(await this.prisma.artist.findUnique({ where: { id: artistId } }))) {
      this.logger.error(`${HttpStatus.NOT_FOUND} Artist ${artistId} not found`);
      throw new NotFoundException(`Artist ${artistId} not found`);
    }

    await this.prisma.artist.delete({
      where: {
        id: artistId,
      },
    });

    this.logger.debug('deleteArtist completion work');
  }
}
