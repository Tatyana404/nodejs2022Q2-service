import {
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { Album } from '@prisma/client';
import { PrismaService } from './../../prisma/services/prisma.service';
import { CreateAlbumDto } from './../dto/create-album.dto';
import { UpdateAlbumDto } from './../dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async getAlbums(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async getAlbum(albumId: string): Promise<Album> {
    if (!uuidValidate(albumId)) {
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    const album: Album = await this.prisma.album.findUnique({
      where: {
        id: albumId,
      },
    });

    if (!album) {
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    return album;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    if (createAlbumDto.artistId) {
      if (
        !(await this.prisma.artist.findUnique({
          where: { id: createAlbumDto.artistId },
        }))
      ) {
        throw new UnprocessableEntityException(
          `Artist ${createAlbumDto.artistId} not found`,
        );
      }
    }

    if (!['name', 'year'].every((field: string) => field in createAlbumDto)) {
      throw new BadRequestException('Body does not contain required fields');
    }

    const newAlbum: Album = await this.prisma.album.create({
      data: { ...createAlbumDto },
    });

    return newAlbum;
  }

  async updateAlbum(
    albumId: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    if (!uuidValidate(albumId)) {
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    const album: Album = await this.prisma.album.findUnique({
      where: {
        id: albumId,
      },
    });

    if (!album) {
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    const updateAlbum: Album = await this.prisma.album.update({
      where: {
        id: albumId,
      },
      data: { ...updateAlbumDto },
    });

    return updateAlbum;
  }

  async deleteAlbum(albumId: string): Promise<void> {
    if (!uuidValidate(albumId)) {
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    if (!(await this.prisma.album.findUnique({ where: { id: albumId } }))) {
      throw new NotFoundException(`Track ${albumId} not found`);
    }

    await this.prisma.album.delete({
      where: {
        id: albumId,
      },
    });
  }
}
