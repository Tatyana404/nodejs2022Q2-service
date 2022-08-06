import {
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { Album } from '@prisma/client';
import { PrismaService } from './../../prisma/services/prisma.service';
import { CustomLogger } from './../../logger/services/logger.service';
import { CreateAlbumDto } from './../dto/create-album.dto';
import { UpdateAlbumDto } from './../dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService, private logger: CustomLogger) {}

  async getAlbums(): Promise<Album[]> {
    this.logger.debug('getAlbums getting started');
    this.logger.debug('getAlbums completion work');
    return await this.prisma.album.findMany();
  }

  async getAlbum(albumId: string): Promise<Album> {
    this.logger.debug('getAlbum getting started');

    if (!uuidValidate(albumId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Album id ${albumId} invalid`,
      );
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    const album: Album = await this.prisma.album.findUnique({
      where: {
        id: albumId,
      },
    });

    if (!album) {
      this.logger.error(`${HttpStatus.NOT_FOUND} Album ${albumId} not found`);
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    this.logger.debug('getAlbum completion work');
    return album;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    this.logger.debug('createAlbum getting started');

    if (createAlbumDto.artistId) {
      if (
        !(await this.prisma.artist.findUnique({
          where: { id: createAlbumDto.artistId },
        }))
      ) {
        this.logger.error(
          `${HttpStatus.UNPROCESSABLE_ENTITY} Artist ${createAlbumDto.artistId} not found`,
        );
        throw new UnprocessableEntityException(
          `Artist ${createAlbumDto.artistId} not found`,
        );
      }
    }

    if (!['name', 'year'].every((field: string) => field in createAlbumDto)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Body does not contain required fields`,
      );
      throw new BadRequestException('Body does not contain required fields');
    }

    const newAlbum: Album = await this.prisma.album.create({
      data: { ...createAlbumDto },
    });

    this.logger.debug('createAlbum completion work');
    return newAlbum;
  }

  async updateAlbum(
    albumId: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    this.logger.debug('updateAlbum getting started');

    if (!uuidValidate(albumId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Album id ${albumId} invalid`,
      );
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    const album: Album = await this.prisma.album.findUnique({
      where: {
        id: albumId,
      },
    });

    if (!album) {
      this.logger.error(`${HttpStatus.NOT_FOUND} Album ${albumId} not found`);
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    const updateAlbum: Album = await this.prisma.album.update({
      where: {
        id: albumId,
      },
      data: { ...updateAlbumDto },
    });

    this.logger.debug('updateAlbum completion work');
    return updateAlbum;
  }

  async deleteAlbum(albumId: string): Promise<void> {
    this.logger.debug('deleteAlbum getting started');

    if (!uuidValidate(albumId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Album id ${albumId} invalid`,
      );
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    if (!(await this.prisma.album.findUnique({ where: { id: albumId } }))) {
      this.logger.error(`${HttpStatus.NOT_FOUND} Track ${albumId} not found`);
      throw new NotFoundException(`Track ${albumId} not found`);
    }

    await this.prisma.album.delete({
      where: {
        id: albumId,
      },
    });

    this.logger.debug('deleteAlbum completion work');
  }
}
