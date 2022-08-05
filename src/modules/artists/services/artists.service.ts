import {
  BadRequestException,
  NotFoundException,
  Injectable,
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
    return await this.prisma.artist.findMany();
  }

  async getArtist(artistId: string): Promise<Artist> {
    if (!uuidValidate(artistId)) {
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    const artist: Artist = await this.prisma.artist.findUnique({
      where: {
        id: artistId,
      },
    });

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

    const newArtist: Artist = await this.prisma.artist.create({
      data: { ...createArtistDto },
    });

    return newArtist;
  }

  async updateArtist(
    artistId: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    if (!uuidValidate(artistId)) {
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    const artist: Artist = await this.prisma.artist.findUnique({
      where: {
        id: artistId,
      },
    });

    if (!artist) {
      throw new NotFoundException(`Artist ${artistId} not found`);
    }

    const updateArtist: Artist = await this.prisma.artist.update({
      where: {
        id: artistId,
      },
      data: { ...updateArtistDto },
    });

    return updateArtist;
  }

  async deleteArtist(artistId: string): Promise<void> {
    if (!uuidValidate(artistId)) {
      throw new BadRequestException(`Artist id ${artistId} invalid`);
    }

    if (!(await this.prisma.artist.findUnique({ where: { id: artistId } }))) {
      throw new NotFoundException(`Track ${artistId} not found`);
    }

    await this.prisma.artist.delete({
      where: {
        id: artistId,
      },
    });
  }
}
