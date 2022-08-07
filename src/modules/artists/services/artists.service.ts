import {
  BadRequestException,
  NotFoundException,
  Injectable,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { Artist } from '@prisma/client';
import { PrismaService } from './../../prisma/services/prisma.service';
import { UpdateArtistDto } from './../dto/update-artist.dto';
import { CreateArtistDto } from './../dto/create-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  async getArtists(): Promise<Artist[]> {
    Logger.debug(ArtistsService.name, 'getArtists getting started');
    Logger.debug(ArtistsService.name, 'getArtists completion work');
    return await this.prisma.artist.findMany();
  }

  async getArtist(artistId: string): Promise<Artist> {
    Logger.debug(ArtistsService.name, 'getArtist getting started');

    if (!uuidValidate(artistId)) {
      Logger.error(
        `${ArtistsService.name} ${HttpStatus.BAD_REQUEST} Artist id ${artistId} invalid`,
      );
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    const artist: Artist = await this.prisma.artist.findUnique({
      where: {
        id: artistId,
      },
    });

    if (!artist) {
      Logger.error(
        `${ArtistsService.name} ${HttpStatus.NOT_FOUND} Artist ${artistId} not found`,
      );
      throw new NotFoundException(`Artist ${artistId} not found`);
    }

    Logger.debug(ArtistsService.name, 'getArtist completion work');
    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    Logger.debug(ArtistsService.name, 'createArtist getting started');

    if (
      !['name', 'grammy'].every((field: string) => field in createArtistDto)
    ) {
      Logger.error(
        `${ArtistsService.name} ${HttpStatus.BAD_REQUEST} Body does not contain required fields`,
      );
      throw new BadRequestException('Body does not contain required fields');
    }

    const newArtist: Artist = await this.prisma.artist.create({
      data: { ...createArtistDto },
    });

    Logger.debug(ArtistsService.name, 'createArtist completion work');
    return newArtist;
  }

  async updateArtist(
    artistId: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    Logger.debug(ArtistsService.name, 'updateArtist getting started');

    if (!uuidValidate(artistId)) {
      Logger.error(
        `${ArtistsService.name} ${HttpStatus.BAD_REQUEST} Artist id ${artistId} invalid`,
      );
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    const artist: Artist = await this.prisma.artist.findUnique({
      where: {
        id: artistId,
      },
    });

    if (!artist) {
      Logger.error(
        `${ArtistsService.name} ${HttpStatus.NOT_FOUND} Artist ${artistId} not found`,
      );
      throw new NotFoundException(`Artist ${artistId} not found`);
    }

    const updateArtist: Artist = await this.prisma.artist.update({
      where: {
        id: artistId,
      },
      data: { ...updateArtistDto },
    });

    Logger.debug(ArtistsService.name, 'updateArtist completion work');
    return updateArtist;
  }

  async deleteArtist(artistId: string): Promise<void> {
    Logger.debug(ArtistsService.name, 'deleteArtist getting started');

    if (!uuidValidate(artistId)) {
      Logger.error(
        `${ArtistsService.name} ${HttpStatus.BAD_REQUEST} Artist id ${artistId} invalid`,
      );
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    if (!(await this.prisma.artist.findUnique({ where: { id: artistId } }))) {
      Logger.error(
        `${ArtistsService.name} ${HttpStatus.NOT_FOUND} Artist ${artistId} not found`,
      );
      throw new NotFoundException(`Artist ${artistId} not found`);
    }

    await this.prisma.artist.delete({
      where: {
        id: artistId,
      },
    });

    Logger.debug(ArtistsService.name, 'deleteArtist completion work');
  }
}
